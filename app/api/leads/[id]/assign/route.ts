import { NextResponse } from "next/server";
import { z } from "zod";
import { AuditService } from "../../../../../src/domain/audit/audit-service";
import { authorizationResponse, requireUser } from "../../../../../src/server/auth/require-user";
import { PrismaAuditWriter } from "../../../../../src/server/audit/prisma-audit-writer";
import { db } from "../../../../../src/server/db";

const assignmentSchema = z.object({ sellerId: z.string().uuid(), reason: z.string().trim().min(3).max(240).optional() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser("lead:assign");
    const parsed = assignmentSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Revisa los datos de asignación." }, { status: 400 });
    const { id } = await params;
    const seller = await db.sellerProfile.findFirst({ where: { id: parsed.data.sellerId, status: "ACTIVE" }, select: { id: true } });
    if (!seller) return NextResponse.json({ error: "El asesor no está activo." }, { status: 422 });
    const lead = await db.lead.update({ where: { id }, data: { currentSellerId: seller.id, attributions: { create: { sellerId: seller.id, source: "MANUAL_ASSIGNMENT", action: "REASSIGNED", reason: parsed.data.reason } } }, select: { id: true, originSellerId: true, currentSellerId: true } });
    await new AuditService(new PrismaAuditWriter(db)).record({ actorUserId: user.id, actorRole: user.role, action: "LEAD_REASSIGNED", entityType: "LEAD", entityId: lead.id, metadata: { originSellerId: lead.originSellerId, assignedSellerId: seller.id } });
    return NextResponse.json(lead);
  } catch (error) {
    const auth = authorizationResponse(error);
    if ((error as { code?: string }).code === "P2025") return NextResponse.json({ error: "El comprador no existe." }, { status: 404 });
    return NextResponse.json({ error: auth?.message ?? "No fue posible reasignar el comprador." }, { status: auth?.status ?? 500 });
  }
}
