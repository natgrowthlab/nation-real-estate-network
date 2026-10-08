import { describe, expect, it } from "vitest";
import { signSession, verifySession } from "../src/auth/session";

process.env.AUTH_SECRET = "a-long-test-secret-that-is-at-least-thirty-two-characters";

describe("session signing", () => {
  it("signs and verifies an authenticated role", async () => {
    const { token } = await signSession({ userId: "user-1", role: "SUPER_ADMIN", sessionId: "session-1" });
    await expect(verifySession(token)).resolves.toMatchObject({ userId: "user-1", role: "SUPER_ADMIN", sessionId: "session-1" });
  });
  it("rejects a modified token", async () => {
    await expect(verifySession("not.a.valid.token")).resolves.toBeNull();
  });
});
