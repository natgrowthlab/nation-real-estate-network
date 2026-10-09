import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizationResponse, requireUser } from "../../../../../src/server/auth/require-user";
import { db } from "../../../../../src/server/db";

const settingsSchema = z.object({ legalName: z.string().trim().max(180).optional(), timezone: z.string().trim().min(3).max(80), currency: z.enum(["COP", "USD", "EUR"]) });

async function memberOrError(workspaceId: string, userId: string) { return db.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId, userId } } }); }

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const user = await requireUser(); const { id } = await params; const member = await memberOrError(id, user.id); if (!member) return NextResponse.json({ error: "No tienes acceso a este espacio." }, { status: 403 }); const setting = await db.workspaceSetting.findUnique({ where: { workspaceId: id } }); return NextResponse.json({ setting, role: member.role }); } catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible consultar la configuración." }, { status: auth?.status ?? 500 }); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const user = await requireUser(); const { id } = await params; const member = await memberOrError(id, user.id); if (!member || !["OWNER", "ADMIN"].includes(member.role)) return NextResponse.json({ error: "No tienes permiso para configurar este espacio." }, { status: 403 }); const parsed = settingsSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Revisa la configuración." }, { status: 400 }); const setting = await db.workspaceSetting.upsert({ where: { workspaceId: id }, create: { workspaceId: id, ...parsed.data }, update: parsed.data }); return NextResponse.json(setting); } catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible guardar la configuración." }, { status: auth?.status ?? 500 }); }
}
