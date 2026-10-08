import { NextResponse } from "next/server";
import { z } from "zod";
import { assertCan, can } from "../../../src/domain/auth/permissions";
import { normalizeEmail, normalizePhone } from "../../../src/domain/leads/normalization";
import { authorizationResponse, requireUser } from "../../../src/server/auth/require-user";
import { db } from "../../../src/server/db";
import { AuditService } from "../../../src/domain/audit/audit-service";
import { PrismaAuditWriter } from "../../../src/server/audit/prisma-audit-writer";

const leadSchema = z.object({ fullName: z.string().trim().min(2).max(160), phone: z.string().trim().max(30).optional(), email: z.string().trim().email().max(254).optional(), source: z.string().trim().min(2).max(60).default("MANUAL") }).refine((value) => Boolean(value.phone || value.email), { message: "Indica un teléfono o correo." });

export async function GET() {
  try {
    const user = await requireUser();
    const allLeads = can(user.role, "lead:read_all");
    if (!allLeads) assertCan(user.role, "lead:read_own");
    const seller = allLeads ? null : await db.sellerProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (!allLeads && !seller) return NextResponse.json({ leads: [] });
    const leads = await db.lead.findMany({ where: { archivedAt: null, ...(allLeads ? {} : { currentSellerId: seller!.id }) }, select: { id: true, fullName: true, stage: true, originSource: true, createdAt: true, currentSellerId: true, protectionUntil: true }, orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json({ leads });
  } catch (error) {
    const auth = authorizationResponse(error);
    return NextResponse.json({ error: auth?.message ?? "No fue posible consultar compradores." }, { status: auth?.status ?? 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser("lead:create");
    const parsed = leadSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Revisa los datos del comprador." }, { status: 400 });
    const normalizedPhone = normalizePhone(parsed.data.phone);
    const normalizedEmail = normalizeEmail(parsed.data.email);
    if (!normalizedPhone && !normalizedEmail) return NextResponse.json({ error: "El teléfono no tiene un formato válido." }, { status: 400 });
    const duplicate = await db.lead.findFirst({ where: { archivedAt: null, OR: [{ normalizedPhone: normalizedPhone ?? undefined }, { normalizedEmail: normalizedEmail ?? undefined }] }, select: { id: true } });
    if (duplicate) return NextResponse.json({ error: "Este comprador ya está registrado en la red.", code: "DUPLICATE_LEAD" }, { status: 409 });
    const seller = await db.sellerProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
    const lead = await db.lead.create({ data: { fullName: parsed.data.fullName, normalizedPhone, normalizedEmail, originSource: parsed.data.source, originSellerId: seller?.id, currentSellerId: seller?.id, protectionUntil: seller ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : null, attributions: { create: { sellerId: seller?.id, source: parsed.data.source, action: "CREATED" } } }, select: { id: true, fullName: true, stage: true } });
    await new AuditService(new PrismaAuditWriter(db)).record({ actorUserId: user.id, actorRole: user.role, action: "LEAD_CREATED", entityType: "LEAD", entityId: lead.id, metadata: { source: parsed.data.source, sellerId: seller?.id ?? null } });
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    const auth = authorizationResponse(error);
    if ((error as { code?: string }).code === "P2002") return NextResponse.json({ error: "Este comprador ya está registrado en la red.", code: "DUPLICATE_LEAD" }, { status: 409 });
    return NextResponse.json({ error: auth?.message ?? "No fue posible registrar el comprador." }, { status: auth?.status ?? 500 });
  }
}
