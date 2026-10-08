import type { Role } from "../auth/permissions";

export type AuditEventInput = { actorUserId?: string; actorRole?: Role; action: string; entityType: string; entityId: string; metadata?: Record<string, unknown> };
export type AuditEvent = AuditEventInput & { id: string; createdAt: Date };

export interface AuditWriter { append(event: AuditEvent): Promise<void>; }

export class AuditService {
  constructor(private readonly writer: AuditWriter, private readonly newId: () => string = crypto.randomUUID) {}
  async record(event: AuditEventInput): Promise<AuditEvent> {
    const record = { ...event, metadata: event.metadata ?? {}, id: this.newId(), createdAt: new Date() };
    await this.writer.append(record);
    return record;
  }
}
