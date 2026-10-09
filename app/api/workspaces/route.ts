import { NextResponse } from "next/server";
import { z } from "zod";
import { toWorkspaceSlug } from "../../../src/domain/workspaces/slug";
import { authorizationResponse, requireUser } from "../../../src/server/auth/require-user";
import { db } from "../../../src/server/db";

const workspaceSchema = z.object({ name: z.string().trim().min(2).max(100) });

export async function GET() {
  try {
    const user = await requireUser();
    const workspaces = await db.workspaceMember.findMany({ where: { userId: user.id }, include: { workspace: { include: { setting: true } } }, orderBy: { createdAt: "asc" } });
    return NextResponse.json({ workspaces: workspaces.map(({ role, workspace }) => ({ ...workspace, role })) });
  } catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible consultar espacios." }, { status: auth?.status ?? 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(); const parsed = workspaceSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Indica un nombre de espacio válido." }, { status: 400 });
    const root = toWorkspaceSlug(parsed.data.name); if (!root) return NextResponse.json({ error: "No fue posible crear un identificador válido." }, { status: 400 });
    let slug = root; let suffix = 1; while (await db.workspace.findUnique({ where: { slug }, select: { id: true } })) slug = `${root.slice(0, 42)}-${++suffix}`;
    const workspace = await db.workspace.create({ data: { name: parsed.data.name, slug, memberships: { create: { userId: user.id, role: "OWNER" } }, setting: { create: {} } }, include: { setting: true } });
    return NextResponse.json({ ...workspace, role: "OWNER" }, { status: 201 });
  } catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible crear el espacio." }, { status: auth?.status ?? 500 }); }
}
