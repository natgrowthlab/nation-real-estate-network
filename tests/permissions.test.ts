import { describe, expect, it } from "vitest";
import { assertCan, can, AuthorizationError } from "../src/domain/auth/permissions";

describe("RBAC", () => {
  it("permite al asesor ver inventario sin revelar datos sensibles", () => {
    expect(can("SELLER", "property:read")).toBe(true);
    expect(can("SELLER", "property:read_sensitive")).toBe(false);
  });
  it("impide al asesor aprobar una comisión", () => {
    expect(() => assertCan("SELLER", "commission:approve")).toThrow(AuthorizationError);
  });
});
