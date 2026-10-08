import { describe, expect, it } from "vitest";
import { AuditService, type AuditEvent } from "../src/domain/audit/audit-service";

describe("auditoría", () => {
  it("registra una acción inmutable con metadatos", async () => {
    const stored: AuditEvent[] = [];
    const audit = new AuditService({ append: async (event) => { stored.push(event); } }, () => "event-1");
    await audit.record({ actorUserId: "u1", actorRole: "SELLER", action: "PROPERTY_ADDRESS_REVEALED", entityType: "PROPERTY", entityId: "p1", metadata: { appointmentId: "a1" } });
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ id: "event-1", action: "PROPERTY_ADDRESS_REVEALED", metadata: { appointmentId: "a1" } });
  });
});
