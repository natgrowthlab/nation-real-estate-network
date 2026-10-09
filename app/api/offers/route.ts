import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizationResponse, requireUser } from "../../../src/server/auth/require-user";
import { db } from "../../../src/server/db";

const offerSchema = z.object({ propertyId: z.string().uuid(), leadId: z.string().uuid(), amount: z.string().regex(/^\d+(\.\d{1,2})?$/), currency: z.string().length(3).default("COP") });

export async function GET() {
  try { await requireUser("offer:manage"); const offers = await db.offer.findMany({ orderBy: { createdAt: "desc" }, take: 100 }); return NextResponse.json({ offers }); }
  catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible consultar las ofertas." }, { status: auth?.status ?? 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser("offer:manage"); const parsed = offerSchema.safeParse(await request.json());
    if (!parsed.success || Number(parsed.data.amount) <= 0) return NextResponse.json({ error: "Revisa el valor de la oferta." }, { status: 400 });
    const [property, lead] = await Promise.all([db.property.findFirst({ where: { id: parsed.data.propertyId, archivedAt: null } }), db.lead.findFirst({ where: { id: parsed.data.leadId, archivedAt: null } })]);
    if (!property || !lead) return NextResponse.json({ error: "El inmueble o comprador no está disponible." }, { status: 422 });
    const offer = await db.offer.create({ data: { ...parsed.data, currency: parsed.data.currency.toUpperCase() } });
    await db.auditEvent.create({ data: { actorUserId: user.id, actorRole: user.role, action: "OFFER_SUBMITTED", entityType: "OFFER", entityId: offer.id, metadata: { propertyId: offer.propertyId, leadId: offer.leadId, amount: offer.amount.toString() } } });
    return NextResponse.json(offer, { status: 201 });
  } catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible crear la oferta." }, { status: auth?.status ?? 500 }); }
}
