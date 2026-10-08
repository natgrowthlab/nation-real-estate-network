import { cookies } from "next/headers";
import { db } from "../db";
import { SESSION_COOKIE, verifySession } from "../../auth/session";

export async function currentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const claims = await verifySession(token);
  if (!claims) return null;
  const session = await db.session.findFirst({ where: { id: claims.sessionId, userId: claims.userId, revokedAt: null, expiresAt: { gt: new Date() }, user: { isActive: true } }, include: { user: true } });
  return session?.user ?? null;
}
