import { NextResponse } from "next/server";
import { db } from "../../../../src/server/db";
import { authorizationResponse, requireUser } from "../../../../src/server/auth/require-user";
import { ACTIVE_WORKSPACE_COOKIE } from "../../../../src/server/workspaces/active-workspace";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const membership = await db.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId: id, userId: user.id } }, select: { role: true } });
    if (!membership) return NextResponse.json({ error: "No tienes acceso a este espacio." }, { status: 403 });
    if (membership.role !== "OWNER") return NextResponse.json({ error: "Solo la persona propietaria puede eliminar un espacio." }, { status: 403 });

    await db.workspace.delete({ where: { id } });
    const nextWorkspace = await db.workspaceMember.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "asc" }, select: { workspaceId: true } });
    const response = NextResponse.json({ ok: true, activeWorkspaceId: nextWorkspace?.workspaceId ?? null });
    if (nextWorkspace) response.cookies.set(ACTIVE_WORKSPACE_COOKIE, nextWorkspace.workspaceId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
    else response.cookies.delete(ACTIVE_WORKSPACE_COOKIE);
    return response;
  } catch (error) {
    const auth = authorizationResponse(error);
    if ((error as { code?: string }).code === "P2025") return NextResponse.json({ error: "El espacio ya no existe." }, { status: 404 });
    return NextResponse.json({ error: auth?.message ?? "No fue posible eliminar el espacio." }, { status: auth?.status ?? 500 });
  }
}
