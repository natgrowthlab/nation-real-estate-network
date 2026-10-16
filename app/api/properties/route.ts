import { NextResponse } from "next/server";
import { z } from "zod";
import { discloseProperty } from "../../../src/domain/properties/disclosure";
import { PropertyService } from "../../../src/domain/properties/property-service";
import { authorizationResponse, requireUser } from "../../../src/server/auth/require-user";
import { PrismaAuditWriter } from "../../../src/server/audit/prisma-audit-writer";
import { db } from "../../../src/server/db";
import { PrismaPropertyWriter } from "../../../src/server/properties/prisma-property-writer";
import { AuditService } from "../../../src/domain/audit/audit-service";

const propertySchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^NT-[A-Z0-9-]{3,30}$/),
  title: z.string().trim().min(4).max(160), city: z.string().trim().min(2).max(80), neighborhood: z.string().trim().min(2).max(100),
  address: z.string().trim().min(5).max(220), propertyType: z.string().trim().min(2).max(60),
  salePrice: z.string().regex(/^\d+(\.\d{1,2})?$/), ownerId: z.string().uuid(),
});
const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageBytes = 2 * 1024 * 1024;

async function readPropertyRequest(request: Request) {
  if (!request.headers.get("content-type")?.includes("multipart/form-data")) return { input: await request.json(), image: null as File | null };
  const form = await request.formData();
  const image = form.get("image");
  return {
    input: Object.fromEntries(["code", "title", "city", "neighborhood", "address", "propertyType", "salePrice", "ownerId"].map((key) => [key, form.get(key)])),
    image: image instanceof File && image.size > 0 ? image : null,
  };
}

export async function GET() {
  try {
    const user = await requireUser("property:read");
    const properties = await db.property.findMany({
      where: { archivedAt: null, ...(user.role === "SELLER" ? { status: "ACTIVE" } : {}) },
      include: { owners: { include: { owner: true } }, media: { orderBy: { position: "asc" }, take: 1 } }, orderBy: { createdAt: "desc" }, take: 50,
    });
    const response = properties.map((property) => ({ ...discloseProperty({
      id: property.id, code: property.code, title: property.title, city: property.city, neighborhood: property.neighborhood,
      address: property.address, salePrice: property.salePrice.toString(), currency: property.currency, description: property.description,
      disclosureLevel: property.disclosureLevel, owner: { legalName: property.owners[0]?.owner.legalName ?? "", email: property.owners[0]?.owner.email ?? null, phone: property.owners[0]?.owner.phone ?? null },
    }, { role: user.role }), imageUrl: property.media[0]?.storageKey ?? null }));
    return NextResponse.json({ properties: response });
  } catch (error) {
    const auth = authorizationResponse(error);
    return NextResponse.json({ error: auth?.message ?? "No fue posible consultar inmuebles." }, { status: auth?.status ?? 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser("property:create");
    const { input, image } = await readPropertyRequest(request);
    const parsed = propertySchema.safeParse(input);
    if (!parsed.success) return NextResponse.json({ error: "Revisa los datos del inmueble." }, { status: 400 });
    if (image && (!acceptedImageTypes.includes(image.type) || image.size > maxImageBytes)) return NextResponse.json({ error: "La imagen debe ser JPG, PNG o WebP y pesar máximo 2 MB." }, { status: 400 });
    const owner = await db.owner.findFirst({ where: { id: parsed.data.ownerId, archivedAt: null }, select: { id: true } });
    if (!owner) return NextResponse.json({ error: "El propietario no existe o está archivado." }, { status: 422 });
    const audit = new AuditService(new PrismaAuditWriter(db));
    const imageDataUrl = image ? `data:${image.type};base64,${Buffer.from(await image.arrayBuffer()).toString("base64")}` : undefined;
    const property = await new PropertyService(new PrismaPropertyWriter(db), audit).create({ id: user.id, role: user.role }, { ...parsed.data, imageDataUrl });
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    const auth = authorizationResponse(error);
    if ((error as { code?: string }).code === "P2002") return NextResponse.json({ error: "Ese código de inmueble ya existe." }, { status: 409 });
    return NextResponse.json({ error: auth?.message ?? "No fue posible crear el inmueble." }, { status: auth?.status ?? 500 });
  }
}
