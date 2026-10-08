import { type PrismaClient, Prisma } from "@prisma/client";
import type { AuditEvent, AuditWriter } from "../../domain/audit/audit-service";

export class PrismaAuditWriter implements AuditWriter {
  constructor(private readonly db: PrismaClient) {}

  async append(event: AuditEvent): Promise<void> {
    await this.db.auditEvent.create({
      data: {
        id: event.id,
        actorUserId: event.actorUserId,
        actorRole: event.actorRole,
        action: event.action,
        entityType: event.entityType,
        entityId: event.entityId,
        metadata: event.metadata as Prisma.InputJsonValue,
        createdAt: event.createdAt,
      },
    });
  }
}
