import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizationResponse, requireUser } from "../../../src/server/auth/require-user";
import { db } from "../../../src/server/db";

const ruleSchema = z.object({ propertyId: z.string().uuid(), sellerPercentage: z.number().min(0).max(100), companyPercentage: z.number().min(0).max(100) }).refine((value) => value.sellerPercentage + value.companyPercentage <= 100, { message: "Los porcentajes no pueden superar 100%." });

export async function GET() {
  try {
    await requireUser("commission:read_own");
    const rules = await db.commissionRule.findMany({ include: { property: { select: { code: true, title: true } } }, orderBy: { effectiveFrom: "desc" }, take: 100 });
    return NextResponse.json({ rules });
  } catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible consultar comisiones." }, { status: auth?.status ?? 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser("commission:approve"); const parsed = ruleSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Revisa los porcentajes de comisión." }, { status: 400 });
    const property = await db.property.findFirst({ where: { id: parsed.data.propertyId, archivedAt: null }, select: { id: true } });
    if (!property) return NextResponse.json({ error: "El inmueble no está disponible." }, { status: 422 });
    const rule = await db.commissionRule.create({ data: parsed.data });
    await db.auditEvent.create({ data: { actorUserId: user.id, actorRole: user.role, action: "COMMISSION_RULE_CREATED", entityType: "COMMISSION_RULE", entityId: rule.id, metadata: parsed.data } });
    return NextResponse.json(rule, { status: 201 });
  } catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible crear la regla." }, { status: auth?.status ?? 500 }); }
}
