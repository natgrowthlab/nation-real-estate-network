import { assertCan, type Role } from "../auth/permissions";

export type DisclosureLevel = "PUBLIC" | "SELLER" | "APPOINTMENT_UNLOCKED" | "ADMIN_ONLY";

export type PropertyRecord = {
  id: string; code: string; title: string; city: string; neighborhood: string;
  address: string; salePrice: string; currency: string; description: string | null;
  disclosureLevel: DisclosureLevel; owner: { legalName: string; email: string | null; phone: string | null };
};

export type PropertyView = Omit<PropertyRecord, "address" | "owner" | "disclosureLevel"> & {
  address?: string; owner?: { legalName: string; email: string | null; phone: string | null };
  addressRestricted: boolean;
};

const order: Record<DisclosureLevel, number> = { PUBLIC: 0, SELLER: 1, APPOINTMENT_UNLOCKED: 2, ADMIN_ONLY: 3 };

export function discloseProperty(property: PropertyRecord, actor: { role: Role; appointmentUnlocked?: boolean }): PropertyView {
  assertCan(actor.role, "property:read");
  const isAdmin = actor.role === "SUPER_ADMIN" || actor.role === "OPERATIONS_ADMIN";
  const maySeeAddress = isAdmin || (actor.appointmentUnlocked === true && order[property.disclosureLevel] <= order.APPOINTMENT_UNLOCKED);
  const maySeeOwner = isAdmin && property.disclosureLevel !== "PUBLIC";
  const { address, owner, disclosureLevel: _, ...safe } = property;
  return { ...safe, ...(maySeeAddress ? { address } : {}), ...(maySeeOwner ? { owner } : {}), addressRestricted: !maySeeAddress };
}
