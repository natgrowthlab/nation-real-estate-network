import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizationResponse, requireUser } from "../../../src/server/auth/require-user";
import { db } from "../../../src/server/db";

const appointmentSchema = z.object({ propertyId: z.string().uuid(), leadId: z.string().uuid(), startsAt: z.string().datetime() });

export async function GET() {
  try {
    await requireUser("appointment:manage");
    const appointments = await db.appointment.findMany({ include: { property: { select: { id: true, code: true, title: true } } }, orderBy: { startsAt: "asc" }, take: 100 });
    return NextResponse.json({ appointments });
  } catch (error) {
    const auth = authorizationResponse(error);
    return NextResponse.json({ error: auth?.message ?? "No fue posible consultar las visitas." }, { status: auth?.status ?? 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser("appointment:manage");
    const parsed = appointmentSchema.safeParse(await request.json());
    if (!parsed.success || new Date(parsed.data.startsAt) <= new Date()) return NextResponse.json({ error: "Indica una fecha futura y datos válidos." }, { status: 400 });
    const [property, lead] = await Promise.all([db.property.findFirst({ where: { id: parsed.data.propertyId, archivedAt: null } }), db.lead.findFirst({ where: { id: parsed.data.leadId, archivedAt: null } })]);
    if (!property || !lead) return NextResponse.json({ error: "El inmueble o comprador no está disponible." }, { status: 422 });
    const appointment = await db.appointment.create({ data: { ...parsed.data, startsAt: new Date(parsed.data.startsAt) } });
    await db.auditEvent.create({ data: { actorUserId: user.id, actorRole: user.role, action: "APPOINTMENT_CREATED", entityType: "APPOINTMENT", entityId: appointment.id, metadata: { propertyId: appointment.propertyId, leadId: appointment.leadId } } });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) { const auth = authorizationResponse(error); return NextResponse.json({ error: auth?.message ?? "No fue posible programar la visita." }, { status: auth?.status ?? 500 }); }
}
