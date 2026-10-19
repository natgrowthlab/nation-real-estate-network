import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizationResponse, requireUser } from "../../../../src/server/auth/require-user";
import { db } from "../../../../src/server/db";
import { getActiveWorkspaceId } from "../../../../src/server/workspaces/active-workspace";

const statusSchema = z.object({ isActive: z.boolean() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const actor = await requireUser("user:manage"); const workspaceId = await getActiveWorkspaceId(actor.id); const { id } = await params; const parsed = statusSchema.safeParse(await request.json()); if (!workspaceId) return NextResponse.json({ error: "Selecciona un espacio de trabajo." }, { status: 409 }); if (!parsed.success) return NextResponse.json({ error: "Estado inválido." }, { status: 400 }); if (id === actor.id && !parsed.data.isActive) return NextResponse.json({ error: "No puedes desactivar tu propia cuenta." }, { status: 400 });
    const membership = await db.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId, userId: id } }, select: { userId: true } }); if (!membership) return NextResponse.json({ error: "El usuario no pertenece a este espacio." }, { status: 404 });
    const user = await db.user.update({ where: { id }, data: { isActive: parsed.data.isActive }, select: { id: true, fullName: true, email: true, role: true, isActive: true, createdAt: true } }); await db.auditEvent.create({ data: { workspaceId, actorUserId: actor.id, actorRole: actor.role, action: parsed.data.isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED", entityType: "USER", entityId: id, metadata: {} } }); return NextResponse.json(user);
  } catch (error) { const auth = authorizationResponse(error); if ((error as { code?: string }).code === "P2025") return NextResponse.json({ error: "El usuario no existe." }, { status: 404 }); return NextResponse.json({ error: auth?.message ?? "No fue posible actualizar el usuario." }, { status: auth?.status ?? 500 }); }
}
