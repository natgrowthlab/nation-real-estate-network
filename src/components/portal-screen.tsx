"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, CalendarDays, CheckCircle2, FileText, LayoutDashboard, UsersRound, WalletCards, LogOut, Settings, UserCog } from "lucide-react";

const items = [
  ["Resumen", "/", LayoutDashboard], ["Inventario", "/inventory", Building2], ["Mis clientes", "/clients", UsersRound],
  ["Agenda", "/appointments", CalendarDays], ["Ofertas", "/offers", FileText], ["Operaciones", "/deals", CheckCircle2],
  ["Comisiones", "/commissions", WalletCards], ["Documentos", "/documents", FileText],
  ["Usuarios", "/users", UserCog],
] as const;

export function PortalScreen({ title, eyebrow, description, children }: { title: string; eyebrow: string; description: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.assign("/login"); };
  return <><a className="skip-link" href="#module-content">Ir al contenido principal</a><div className="portal-screen"><aside className="portal-nav" aria-label="Acciones rápidas"><nav>{items.slice(0, 6).map(([label, href, Icon]) => <Link href={href} key={href} aria-label={label} aria-current={pathname === href ? "page" : undefined}><Icon size={18}/><span>{label}</span></Link>)}</nav><div className="portal-rail-bottom"><Link href="/settings" aria-label="Configuración"><Settings size={18}/><span>Configuración</span></Link><button className="logout-button" type="button" onClick={logout} aria-label="Cerrar sesión"><LogOut size={18}/> Cerrar sesión</button></div></aside><section className="portal-content"><header className="portal-topbar"><Link className="portal-top-brand" href="/"><img className="brand-logo" src="/brand/benaq-mark.png" alt=""/><span>Benaq Constructora</span></Link><nav className="portal-top-navigation" aria-label="Secciones principales">{items.map(([label, href]) => <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav></header><main className="portal-module" id="module-content" tabIndex={-1}><header className="module-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div><Link className="module-home" href="/">Volver al resumen</Link></header>{children}</main></section></div></>;
}
