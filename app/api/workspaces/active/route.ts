import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizationResponse, requireUser } from "../../../../src/server/auth/require-user";
import { db } from "../../../../src/server/db";

const selectionSchema = z.object({ workspaceId: z.string().uuid() });
const ACTIVE_WORKSPACE_COOKIE = "nexo_active_workspace";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const parsed = selectionSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "El espacio seleccionado no es válido." }, { status: 400 });

    const membership = await db.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: parsed.data.workspaceId, userId: user.id } },
      select: { workspaceId: true },
    });
    if (!membership) return NextResponse.json({ error: "No tienes acceso a este espacio." }, { status: 403 });

    const response = NextResponse.json({ activeWorkspaceId: membership.workspaceId });
    response.cookies.set(ACTIVE_WORKSPACE_COOKIE, membership.workspaceId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  } catch (error) {
    const auth = authorizationResponse(error);
    return NextResponse.json({ error: auth?.message ?? "No fue posible seleccionar el espacio." }, { status: auth?.status ?? 500 });
  }
}
