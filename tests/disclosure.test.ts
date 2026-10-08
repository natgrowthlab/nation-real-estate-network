import { describe, expect, it } from "vitest";
import { discloseProperty, type PropertyRecord } from "../src/domain/properties/disclosure";

const property: PropertyRecord = { id: "p1", code: "NT-001", title: "Casa privada", city: "Bogotá", neighborhood: "Chicó", address: "Calle privada 1", salePrice: "1000000000", currency: "COP", description: null, disclosureLevel: "APPOINTMENT_UNLOCKED", owner: { legalName: "Propietario Reservado", email: "owner@example.com", phone: "+573001112233" } };

describe("seller-safe disclosure", () => {
  it("redacta dirección y propietario para un asesor sin visita", () => {
    const result = discloseProperty(property, { role: "SELLER" });
    expect(result.address).toBeUndefined();
    expect(result.owner).toBeUndefined();
    expect(result.addressRestricted).toBe(true);
  });
  it("libera dirección sólo después de la visita autorizada", () => {
    const result = discloseProperty(property, { role: "SELLER", appointmentUnlocked: true });
    expect(result.address).toBe("Calle privada 1");
    expect(result.owner).toBeUndefined();
  });
  it("permite operaciones ver los datos para operar el inmueble", () => {
    const result = discloseProperty(property, { role: "OPERATIONS_ADMIN" });
    expect(result.address).toBe("Calle privada 1");
    expect(result.owner?.phone).toBe("+573001112233");
  });
});
