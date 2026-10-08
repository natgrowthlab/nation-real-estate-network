import { Prisma, type PrismaClient } from "@prisma/client";
import type { CreatePropertyInput, PropertyWriter } from "../../domain/properties/property-service";

export class PrismaPropertyWriter implements PropertyWriter {
  constructor(private readonly db: PrismaClient) {}

  async create(input: CreatePropertyInput): Promise<{ id: string; code: string }> {
    return this.db.property.create({
      data: {
        code: input.code,
        title: input.title,
        city: input.city,
        neighborhood: input.neighborhood,
        address: input.address,
        propertyType: input.propertyType,
        salePrice: new Prisma.Decimal(input.salePrice),
        owners: { create: { ownerId: input.ownerId, ownershipPercentage: new Prisma.Decimal(100), isPrimaryContact: true } },
      },
      select: { id: true, code: true },
    });
  }
}
