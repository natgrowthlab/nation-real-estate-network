import { NextResponse } from "next/server";
import { can } from "../../../../src/domain/auth/permissions";
import { authorizationResponse, requireUser } from "../../../../src/server/auth/require-user";
import { db } from "../../../../src/server/db";
import { AuditService } from "../../../../src/domain/audit/audit-service";
import { PrismaAuditWriter } from "../../../../src/server/audit/prisma-audit-writer";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser("lead:create");
    const { id } = await params;
    const lead = await db.lead.findUnique({ where: { id }, select: { id: true, fullName: true, currentSellerId: true, archivedAt: true } });
    if (!lead || lead.archivedAt) return NextResponse.json({ error: "El cliente no existe." }, { status: 404 });
    if (!can(user.role, "lead:read_all")) {
      const seller = await db.sellerProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (!seller || lead.currentSellerId !== seller.id) return NextResponse.json({ error: "No puedes eliminar este cliente." }, { status: 403 });
    }
    await db.lead.update({ where: { id }, data: { archivedAt: new Date() } });
    await new AuditService(new PrismaAuditWriter(db)).record({ actorUserId: user.id, actorRole: user.role, action: "LEAD_ARCHIVED", entityType: "LEAD", entityId: id, metadata: { fullName: lead.fullName } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const auth = authorizationResponse(error);
    return NextResponse.json({ error: auth?.message ?? "No fue posible eliminar el cliente." }, { status: auth?.status ?? 500 });
  }
}
