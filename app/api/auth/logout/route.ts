import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "../../../../src/auth/session";
import { db } from "../../../../src/server/db";

export async function POST() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const claims = token ? await verifySession(token) : null;
  if (claims) await db.session.updateMany({ where: { id: claims.sessionId, userId: claims.userId, revokedAt: null }, data: { revokedAt: new Date() } });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
