import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../src/server/db";

const contactSchema = z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(180), phone: z.string().trim().max(40).optional().or(z.literal("")), interest: z.enum(["Comprar vivienda", "Invertir", "Conocer proyectos futuros"]), message: z.string().trim().max(1200).optional().or(z.literal("")) });

export async function POST(request: Request) {
  try {
    const body = contactSchema.parse(await request.json());
    const inquiry = await db.auditEvent.create({ data: { action: "PUBLIC_CONTACT_REQUEST", entityType: "PUBLIC_INQUIRY", entityId: crypto.randomUUID(), metadata: body } });
    return NextResponse.json({ id: inquiry.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Datos de contacto no válidos" }, { status: 400 });
    return NextResponse.json({ error: "No se pudo registrar la solicitud" }, { status: 500 });
  }
}
