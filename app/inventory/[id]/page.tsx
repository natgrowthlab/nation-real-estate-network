import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPin, Pencil, Tag } from "lucide-react";
import { PortalScreen } from "../../../src/components/portal-screen";
import { discloseProperty } from "../../../src/domain/properties/disclosure";
import { requireUser } from "../../../src/server/auth/require-user";
import { db } from "../../../src/server/db";

export default async function PropertyProfile({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("property:read");
  const { id } = await params;
  const property = await db.property.findFirst({ where: { id, archivedAt: null }, include: { owners: { include: { owner: true } }, media: { orderBy: { position: "asc" } } } });
  if (!property) notFound();
  const view = discloseProperty({ id: property.id, code: property.code, title: property.title, city: property.city, neighborhood: property.neighborhood, address: property.address, salePrice: property.salePrice.toString(), currency: property.currency, description: property.description, disclosureLevel: property.disclosureLevel, owner: { legalName: property.owners[0]?.owner.legalName ?? "", email: property.owners[0]?.owner.email ?? null, phone: property.owners[0]?.owner.phone ?? null } }, { role: user.role });
  const price = new Intl.NumberFormat("es-CO", { style: "currency", currency: view.currency, maximumFractionDigits: 0 }).format(Number(view.salePrice));
  const image = property.media[0];
  return <PortalScreen title="Perfil de propiedad" eyebrow="INVENTARIO" description="Información registrada para este inmueble."><article className="property-profile"><div className="property-profile-image">{image ? <img src={image.storageKey} alt={image.altText}/> : <div className="property-profile-placeholder"><Building2 size={38}/><span>Sin imagen principal</span></div>}</div><div className="property-profile-copy"><div className="property-profile-heading"><div><p className="eyebrow">{view.code}</p><h2>{view.title}</h2></div><Link href="/inventory" className="profile-back"><Pencil size={15}/> Ver inventario</Link></div><p className="property-location"><MapPin size={16}/>{view.neighborhood}, {view.city}{view.address ? ` · ${view.address}` : ""}</p><strong className="property-profile-price">{price}</strong><dl><div><dt>Tipo</dt><dd>{property.propertyType}</dd></div><div><dt>Estado</dt><dd>{property.status.replaceAll("_", " ")}</dd></div><div><dt>Propietario</dt><dd>{view.owner?.legalName ?? "Información restringida"}</dd></div></dl>{view.description && <p className="property-description"><Tag size={16}/>{view.description}</p>}</div></article></PortalScreen>;
}
