import { describe, expect, it } from "vitest";
import { toWorkspaceSlug } from "../src/domain/workspaces/slug";
describe("workspace slug", () => { it("crea identificadores estables y sin acentos", () => expect(toWorkspaceSlug("  Nación Inmobiliaria Bogotá  ")).toBe("nacion-inmobiliaria-bogota")); });
