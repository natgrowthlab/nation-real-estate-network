import { describe, expect, it } from "vitest";
import { AuditService, type AuditEvent } from "../src/domain/audit/audit-service";
import { PropertyService } from "../src/domain/properties/property-service";

describe("PropertyService", () => {
  it("crea el inmueble y deja evidencia de quién lo registró", async () => {
    const events: AuditEvent[] = [];
    const service = new PropertyService({ create: async () => ({ id: "property-1", code: "NT-100" }) }, new AuditService({ append: async (event) => { events.push(event); } }, () => "audit-1"));
    await expect(service.create({ id: "admin-1", role: "OPERATIONS_ADMIN" }, { code: "NT-100", title: "Apartamento Central", city: "Bogotá", neighborhood: "Chicó", address: "Calle 90 # 10", propertyType: "Apartamento", salePrice: "1000000000", ownerId: "owner-1" })).resolves.toEqual({ id: "property-1", code: "NT-100" });
    expect(events[0]).toMatchObject({ action: "PROPERTY_CREATED", actorUserId: "admin-1", metadata: { code: "NT-100", ownerId: "owner-1" } });
  });
});
