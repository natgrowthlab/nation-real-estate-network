import { NextResponse } from "next/server";
import { z } from "zod";
import { AuditService } from "../../../src/domain/audit/audit-service";
import { authorizationResponse, requireUser } from "../../../src/server/auth/require-user";
import { PrismaAuditWriter } from "../../../src/server/audit/prisma-audit-writer";
import { db } from "../../../src/server/db";

const ownerSchema = z.object({ legalName: z.string().trim().min(2).max(180), email: z.string().trim().email().max(254).optional().or(z.literal("")), phone: z.string().trim().min(7).max(30).optional().or(z.literal("")) });

export async function GET() {
  try {
    await requireUser("owner:read");
    const owners = await db.owner.findMany({ where: { archivedAt: null }, select: { id: true, legalName: true, email: true, phone: true }, orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json({ owners });
  } catch (error) {
    const auth = authorizationResponse(error);
    return NextResponse.json({ error: auth?.message ?? "No fue posible consultar propietarios." }, { status: auth?.status ?? 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser("owner:manage");
    const parsed = ownerSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Revisa los datos del propietario." }, { status: 400 });
    const owner = await db.owner.create({ data: { legalName: parsed.data.legalName, email: parsed.data.email || null, phone: parsed.data.phone || null } });
    await new AuditService(new PrismaAuditWriter(db)).record({ actorUserId: user.id, actorRole: user.role, action: "OWNER_CREATED", entityType: "OWNER", entityId: owner.id });
    return NextResponse.json({ id: owner.id, legalName: owner.legalName }, { status: 201 });
  } catch (error) {
    const auth = authorizationResponse(error);
    return NextResponse.json({ error: auth?.message ?? "No fue posible crear el propietario." }, { status: auth?.status ?? 500 });
  }
}
