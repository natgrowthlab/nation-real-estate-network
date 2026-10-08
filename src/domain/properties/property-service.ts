import { assertCan, type Role } from "../auth/permissions";
import type { AuditService } from "../audit/audit-service";

export type CreatePropertyInput = { code: string; title: string; city: string; neighborhood: string; address: string; propertyType: string; salePrice: string; ownerId: string };
export interface PropertyWriter { create(input: CreatePropertyInput): Promise<{ id: string; code: string }>; }

export class PropertyService {
  constructor(private readonly properties: PropertyWriter, private readonly audit: AuditService) {}
  async create(actor: { id: string; role: Role }, input: CreatePropertyInput) {
    assertCan(actor.role, "property:create");
    const property = await this.properties.create(input);
    await this.audit.record({ actorUserId: actor.id, actorRole: actor.role, action: "PROPERTY_CREATED", entityType: "PROPERTY", entityId: property.id, metadata: { code: property.code, ownerId: input.ownerId } });
    return property;
  }
}
