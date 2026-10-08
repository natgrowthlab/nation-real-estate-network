import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "../../../src/auth/password";
import { db } from "../../../src/server/db";

const bootstrapSchema = z.object({ fullName: z.string().trim().min(2).max(120), email: z.string().trim().email().max(254), password: z.string().min(12).max(128) });

export async function POST(request: Request) {
  const body = bootstrapSchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Revisa los datos de acceso. La contraseña requiere 12 caracteres." }, { status: 400 });
  try {
    const user = await db.$transaction(async (tx) => {
      if (await tx.user.count()) return null;
      return tx.user.create({ data: { fullName: body.data.fullName, email: body.data.email.toLowerCase(), passwordHash: await hashPassword(body.data.password), role: "SUPER_ADMIN" } });
    }, { isolationLevel: "Serializable" });
    if (!user) return NextResponse.json({ error: "La cuenta inicial ya fue configurada." }, { status: 409 });
    await db.auditEvent.create({ data: { actorUserId: user.id, actorRole: "SUPER_ADMIN", action: "PLATFORM_BOOTSTRAPPED", entityType: "USER", entityId: user.id, metadata: { email: user.email } } });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "No fue posible completar la configuración." }, { status: 500 }); }
}
