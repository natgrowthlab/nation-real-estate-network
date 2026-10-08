import { describe, expect, it } from "vitest";
import { normalizeEmail, normalizePhone } from "../src/domain/leads/normalization";

describe("normalización de compradores", () => {
  it("normaliza teléfono colombiano en formato E.164", () => expect(normalizePhone("300 111 22 33")).toBe("+573001112233"));
  it("rechaza teléfonos de longitud inválida", () => expect(normalizePhone("12")).toBeNull());
  it("normaliza correo antes de comprobar duplicados", () => expect(normalizeEmail("  CLIENTE@EJEMPLO.COM ")).toBe("cliente@ejemplo.com"));
});
