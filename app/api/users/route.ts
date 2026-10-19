import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "../../../src/auth/password";
import { authorizationResponse, requireUser } from "../../../src/server/auth/require-user";
import { db } from "../../../src/server/db";
import { getActiveWorkspaceId } from "../../../src/server/workspaces/active-workspace";

const userSchema = z.object({ fullName: z.string().trim().min(2).max(120), email: z.string().trim().email().max(254), password: z.string().min(12).max(128), role: z.enum(["SUPER_ADMIN", "OPERATIONS_ADMIN", "COMMERCIAL_MANAGER", "SELLER", "FINANCE", "COMPLIANCE"]) });

export async function GET() {
  try { const actor = await requireUser("user:manage"); const workspaceId = await getActiveWorkspaceId(actor.id); if (!workspaceId) return NextResponse.json({ users: [] }); const memberships = await db.workspaceMember.findMany({ where: { workspaceId }, select: { user: { select: { id: true, fullName: true, email: true, role: true, isActive: true, createdAt: true } } }, orderBy: { createdAt: "desc" } }); return NextResponse.json({ users: memberships.map(({ user }) => user) }); }
  catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible consultar usuarios." }, { status: auth?.status ?? 500 }); }
}

export async function POST(request: Request) {
  try { const actor = await requireUser("user:manage"); const workspaceId = await getActiveWorkspaceId(actor.id); const parsed = userSchema.safeParse(await request.json()); if (!workspaceId) return NextResponse.json({ error: "Selecciona un espacio de trabajo antes de crear usuarios." }, { status: 409 }); if (!parsed.success) return NextResponse.json({ error: "Revisa los datos. La contraseña debe tener mínimo 12 caracteres." }, { status: 400 });
    const user = await db.user.create({ data: { fullName: parsed.data.fullName, email: parsed.data.email.toLowerCase(), passwordHash: await hashPassword(parsed.data.password), role: parsed.data.role, workspaceMemberships: { create: { workspaceId, role: "MEMBER" } } }, select: { id: true, fullName: true, email: true, role: true, isActive: true, createdAt: true } });
    await db.auditEvent.create({ data: { workspaceId, actorUserId: actor.id, actorRole: actor.role, action: "USER_CREATED", entityType: "USER", entityId: user.id, metadata: { role: user.role } } }); return NextResponse.json(user, { status: 201 });
  } catch (error) { const auth = authorizationResponse(error); if ((error as { code?: string }).code === "P2002") return NextResponse.json({ error: "Ya existe una cuenta con este correo." }, { status: 409 }); return NextResponse.json({ error: auth?.message ?? "No fue posible crear el usuario." }, { status: auth?.status ?? 500 }); }
}
