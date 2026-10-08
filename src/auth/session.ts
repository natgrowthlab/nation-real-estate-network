import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import type { Role } from "../domain/auth/permissions";

export const SESSION_COOKIE = "nation_session";
const issuer = "nation-real-estate-network";
const audience = "nation-app";
const lifetimeSeconds = 60 * 60 * 8;

export type SessionClaims = { userId: string; role: Role; sessionId: string; expiresAt: Date };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be configured with at least 32 characters.");
  return new TextEncoder().encode(value);
}

export async function signSession(input: Omit<SessionClaims, "expiresAt">): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + lifetimeSeconds * 1000);
  const token = await new SignJWT({ role: input.role, sid: input.sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secret());
  return { token, expiresAt };
}

export async function verifySession(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), { issuer, audience });
    if (!payload.sub || typeof payload.role !== "string" || typeof payload.sid !== "string" || !payload.exp) return null;
    return { userId: payload.sub, role: payload.role as Role, sessionId: payload.sid, expiresAt: new Date(payload.exp * 1000) };
  } catch { return null; }
}

export const sessionCookie = (expiresAt: Date) => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", expires: expiresAt });
