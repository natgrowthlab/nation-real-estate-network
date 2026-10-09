import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizationResponse, requireUser } from "../../../src/server/auth/require-user";
import { db } from "../../../src/server/db";

const dealSchema = z.object({ propertyId: z.string().uuid(), leadId: z.string().uuid() });

export async function GET() {
  try { await requireUser("deal:manage"); const deals = await db.deal.findMany({ orderBy: { updatedAt: "desc" }, take: 100 }); return NextResponse.json({ deals }); }
  catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible consultar las operaciones." }, { status: auth?.status ?? 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser("deal:manage"); const parsed = dealSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Revisa los datos de la operación." }, { status: 400 });
    const acceptedOffer = await db.offer.findFirst({ where: { propertyId: parsed.data.propertyId, leadId: parsed.data.leadId, status: "ACCEPTED" }, select: { id: true } });
    if (!acceptedOffer) return NextResponse.json({ error: "Solo una oferta aceptada puede abrir una operación." }, { status: 422 });
    const existing = await db.deal.findFirst({ where: parsed.data, select: { id: true } }); if (existing) return NextResponse.json({ error: "Ya existe una operación para este comprador e inmueble." }, { status: 409 });
    const deal = await db.deal.create({ data: parsed.data });
    await db.auditEvent.create({ data: { actorUserId: user.id, actorRole: user.role, action: "DEAL_CREATED", entityType: "DEAL", entityId: deal.id, metadata: { ...parsed.data, offerId: acceptedOffer.id } } });
    return NextResponse.json(deal, { status: 201 });
  } catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible crear la operación." }, { status: auth?.status ?? 500 }); }
}
