"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, CalendarDays, CheckCircle2, FileText, LayoutDashboard, UsersRound, WalletCards } from "lucide-react";

const items = [
  ["Resumen", "/", LayoutDashboard], ["Inventario", "/inventory", Building2], ["Mis clientes", "/clients", UsersRound],
  ["Agenda", "/appointments", CalendarDays], ["Ofertas", "/offers", FileText], ["Operaciones", "/deals", CheckCircle2],
  ["Comisiones", "/commissions", WalletCards], ["Documentos", "/documents", FileText],
] as const;

export function PortalScreen({ title, eyebrow, description, children }: { title: string; eyebrow: string; description: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return <><a className="skip-link" href="#module-content">Ir al contenido principal</a><div className="portal-screen"><aside className="portal-nav" aria-label="Navegación principal"><Link className="portal-brand" href="/"><i>H</i><span>Habita Inmobiliaria</span></Link><nav>{items.map(([label, href, Icon]) => <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}><Icon size={18}/><span>{label}</span></Link>)}</nav></aside><main className="portal-module" id="module-content" tabIndex={-1}><header className="module-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div><Link className="module-home" href="/">Volver al resumen</Link></header>{children}</main></div></>;
}
