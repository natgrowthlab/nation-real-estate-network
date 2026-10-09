import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizationResponse, requireUser } from "../../../src/server/auth/require-user";
import { db } from "../../../src/server/db";

const profileSchema = z.object({ fullName: z.string().trim().min(2).max(120) });

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json({ id: user.id, fullName: user.fullName, email: user.email, role: user.role, createdAt: user.createdAt });
  } catch (error) {
    const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible consultar la cuenta." }, { status: auth?.status ?? 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser(); const parsed = profileSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Indica un nombre válido." }, { status: 400 });
    const account = await db.user.update({ where: { id: user.id }, data: { fullName: parsed.data.fullName }, select: { id: true, fullName: true, email: true, role: true } });
    return NextResponse.json(account);
  } catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible actualizar la cuenta." }, { status: auth?.status ?? 500 }); }
}
