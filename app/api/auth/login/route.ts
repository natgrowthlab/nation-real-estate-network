import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../../../../src/auth/password";
import { SESSION_COOKIE, sessionCookie, signSession } from "../../../../src/auth/session";
import { db } from "../../../../src/server/db";

const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(128) });

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Credenciales inválidas." }, { status: 400 });
  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !user.isActive || !user.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) return NextResponse.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });
  const session = await db.session.create({ data: { userId: user.id, expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) } });
  const { token, expiresAt } = await signSession({ userId: user.id, role: user.role, sessionId: session.id });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookie(expiresAt));
  return response;
}
