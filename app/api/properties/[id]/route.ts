import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizationResponse, requireUser } from "../../../../src/server/auth/require-user";
import { db } from "../../../../src/server/db";

const updateSchema = z.object({
  title: z.string().trim().min(4).max(160).optional(), city: z.string().trim().min(2).max(80).optional(),
  neighborhood: z.string().trim().min(2).max(100).optional(), address: z.string().trim().min(5).max(220).optional(),
  propertyType: z.string().trim().min(2).max(60).optional(), salePrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "ACTIVE", "PAUSED", "RESERVED", "SOLD", "ARCHIVED"]).optional(),
}).refine((data) => Object.keys(data).length > 0, "Indica al menos un campo para actualizar.");

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser("property:create"); const { id } = await params; const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Revisa los datos del inmueble." }, { status: 400 });
    const property = await db.property.update({ where: { id, archivedAt: null }, data: parsed.data, select: { id: true, code: true, title: true, status: true } });
    await db.auditEvent.create({ data: { actorUserId: user.id, actorRole: user.role, action: "PROPERTY_UPDATED", entityType: "PROPERTY", entityId: property.id, metadata: { fields: Object.keys(parsed.data) } } });
    return NextResponse.json(property);
  } catch (error) { const auth = authorizationResponse(error); if ((error as { code?: string }).code === "P2025") return NextResponse.json({ error: "El inmueble no existe." }, { status: 404 }); return NextResponse.json({ error: auth?.message ?? "No fue posible actualizar el inmueble." }, { status: auth?.status ?? 500 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser("property:create"); const { id } = await params;
    const property = await db.property.update({ where: { id, archivedAt: null }, data: { archivedAt: new Date(), status: "ARCHIVED" }, select: { id: true, code: true } });
    await db.auditEvent.create({ data: { actorUserId: user.id, actorRole: user.role, action: "PROPERTY_ARCHIVED", entityType: "PROPERTY", entityId: property.id, metadata: { code: property.code } } });
    return NextResponse.json({ ok: true });
  } catch (error) { const auth = authorizationResponse(error); if ((error as { code?: string }).code === "P2025") return NextResponse.json({ error: "El inmueble no existe." }, { status: 404 }); return NextResponse.json({ error: auth?.message ?? "No fue posible archivar el inmueble." }, { status: auth?.status ?? 500 }); }
}
