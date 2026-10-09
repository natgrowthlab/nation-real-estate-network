"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight, Bell, Building2, CalendarDays, ChevronDown, ChevronRight,
  CircleHelp, Command, FileText, Home, LayoutDashboard, MapPin, Menu,
  MoreHorizontal, Plus, Search, Settings, SlidersHorizontal, Sparkles,
  UsersRound, WalletCards, X, CheckCircle2, Clock3
} from "lucide-react";

const navigation = [
  ["Resumen", "/", LayoutDashboard], ["Inventario", "/inventory", Building2], ["Mis clientes", "/clients", UsersRound],
  ["Agenda", "/appointments", CalendarDays], ["Ofertas", "/offers", FileText], ["Operaciones", "/deals", CheckCircle2],
  ["Comisiones", "/commissions", WalletCards], ["Documentos", "/documents", FileText]
] as const;

const properties = [
  { code: "NT-24018", name: "Casa Altos del Chicó", location: "Chicó Norte · Bogotá", price: "$ 3.480 M", commission: "$ 69,6 M", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85", tag: "Exclusiva", tone: "blue" },
  { code: "NT-24021", name: "Apartamento Reserva 56", location: "Chapinero Alto · Bogotá", price: "$ 1.280 M", commission: "$ 25,6 M", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", tag: "Nuevo", tone: "teal" },
  { code: "NT-23987", name: "Loft Torre 93", location: "El Poblado · Medellín", price: "$ 890 M", commission: "$ 17,8 M", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85", tag: "Alta demanda", tone: "amber" }
];

function Metric({ label, value, change, icon: Icon, href }: { label: string; value: string; change: string; icon: typeof UsersRound; href: string }) {
  return <Link className="metric-link" href={href} aria-label={`${label}: ${value}. Ver detalle`}><article className="metric-card">
    <div className="metric-icon"><Icon size={19} strokeWidth={1.8} /></div>
    <p>{label}</p><strong>{value}</strong>
    <span className="metric-change">{change} <ArrowUpRight size={13} /></span>
  </article></Link>
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 3200); };

  return <><a className="skip-link" href="#dashboard-content">Ir al contenido principal</a><main>
    <aside className={menuOpen ? "sidebar open" : "sidebar"} aria-label="Navegación principal">
      <div className="brand"><div className="brand-mark">H</div><span>Habita Inmobiliaria</span><button className="close-button" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}><X /></button></div>
      <div className="workspace"><span>ESPACIO DE TRABAJO</span><Link href="/workspaces"><div className="avatar small">AM</div> Andina Metropolitana <ChevronDown size={15}/></Link></div>
      <nav>{navigation.map(([label, href, Icon]) => <Link key={label} href={href} className={label === "Resumen" ? "active" : ""} aria-current={label === "Resumen" ? "page" : undefined} onClick={() => setMenuOpen(false)}><Icon size={18}/><span>{label}</span>{label === "Agenda" && <em>3</em>}</Link>)}</nav>
      <div className="sidebar-bottom"><Link href="/documents"><CircleHelp size={18}/> Ayuda</Link><Link href="/settings"><Settings size={18}/> Configuración</Link><Link className="profile" href="/account"><div className="avatar">AM</div><div><strong>Andrés Morales</strong><small>Asesor senior</small></div><MoreHorizontal size={18}/></Link></div>
    </aside>

    <section className="content" id="dashboard-content" tabIndex={-1}>
      <header className="topbar">
        <button className="menu-button" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}><Menu /></button>
        <div className="search"><Search size={18}/><input aria-label="Buscar en Habita Inmobiliaria" placeholder="Buscar propiedades, clientes o códigos…"/><kbd><Command size={12}/> K</kbd></div>
        <div className="top-actions"><button className="icon-button" aria-label="Notificaciones" onClick={() => notify("Tienes 3 notificaciones pendientes.")}><Bell size={19}/><i /></button><Link className="new-button" href="/clients?new=1"><Plus size={18}/> <span>Nuevo cliente</span></Link></div>
      </header>

      <div className="dashboard">
        <section className="welcome">
          <div><p className="eyebrow">MIÉRCOLES, 8 DE OCTUBRE</p><h1>Buenos días, Andrés<span>.</span></h1><p className="intro">Tu red se mueve contigo. Aquí está el pulso de tu operación.</p></div>
          <Link className="capture-button" href="/inventory?capture=1"><Building2 size={18}/><span>Captar propiedad</span><ArrowUpRight size={17}/></Link>
        </section>

        <section className="metrics" aria-label="Indicadores comerciales">
          <Metric label="Clientes activos" value="24" change="12% este mes" icon={UsersRound} href="/clients"/>
          <Metric label="Visitas programadas" value="08" change="3 para hoy" icon={CalendarDays} href="/appointments"/>
          <Metric label="Negociaciones" value="05" change="2 por cerrar" icon={FileText} href="/offers"/>
          <Metric label="Comisión proyectada" value="$ 42,8 M" change="18% vs. mes anterior" icon={WalletCards} href="/commissions"/>
        </section>

        <section className="grid-main">
          <article className="pipeline panel">
            <div className="panel-heading"><div><p className="eyebrow">PIPELINE</p><h2>Clientes en movimiento</h2></div><Link className="quiet-button" href="/clients">Ver todos <ChevronRight size={16}/></Link></div>
            <div className="pipeline-stats"><div><strong>24</strong><span>Activos</span></div><div><strong>8</strong><span>En visita</span></div><div><strong>5</strong><span>En oferta</span></div><div><strong>3</strong><span>En cierre</span></div></div>
            <div className="progress-bar" aria-label="Estado de los clientes"><i style={{width:"31%"}}/><i style={{width:"33%"}}/><i style={{width:"21%"}}/><i style={{width:"15%"}}/></div>
            <div className="client-list">
              {[['LM','Laura Méndez','Buscando en Chicó','Seguimiento hoy','coral'],['CG','Carlos Gómez','Visita · Reserva 56','10:30 a. m.','blue'],['SV','Sofía Velasco','Oferta en revisión','Hace 2 h','green']].map(([initials,name,detail,meta,color]) => <div className="client-row" key={name}><div className={`avatar ${color}`}>{initials}</div><div><strong>{name}</strong><span>{detail}</span></div><time>{meta}</time><ChevronRight size={17}/></div>)}
            </div>
          </article>

          <article className="agenda panel">
            <div className="panel-heading"><div><p className="eyebrow">AGENDA DE HOY</p><h2>Próximas visitas</h2></div><Link className="round-add" aria-label="Programar visita" href="/appointments?new=1"><Plus size={17}/></Link></div>
            <div className="agenda-list"><div className="appointment"><time>10:30<small>a. m.</small></time><div className="appointment-line teal"/><div><strong>Reserva 56 · Apto 402</strong><span><MapPin size={13}/> Chapinero Alto</span><small>Con Carlos Gómez</small></div></div><div className="appointment"><time>02:00<small>p. m.</small></time><div className="appointment-line blue"/><div><strong>Casa Altos del Chicó</strong><span><MapPin size={13}/> Calle 93 # 11–20</span><small>Con Laura Méndez</small></div></div><div className="appointment"><time>04:30<small>p. m.</small></time><div className="appointment-line amber"/><div><strong>Loft Torre 93</strong><span><MapPin size={13}/> El Poblado</span><small>Con David Arango</small></div></div></div>
            <Link className="schedule-link" href="/appointments">Ver calendario completo <ArrowUpRight size={15}/></Link>
          </article>
        </section>

        <section className="inventory-section"><div className="section-heading"><div><p className="eyebrow">INVENTARIO CURADO</p><h2>Propiedades para tus clientes</h2></div><div><Link className="filter-button" href="/inventory?filters=1"><SlidersHorizontal size={16}/> Filtrar</Link><Link className="quiet-button all-button" href="/inventory">Ver inventario <ChevronRight size={16}/></Link></div></div><div className="properties">{properties.map((property) => <article className="property-card" key={property.code}><div className="property-image" style={{backgroundImage:`linear-gradient(180deg, transparent 35%, rgba(5,32,32,.66)), url(${property.image})`}}><span className={`property-tag ${property.tone}`}>{property.tag}</span><button aria-label={`Guardar ${property.name}`} onClick={() => notify(`${property.name} fue guardada.`)}>♡</button><small>{property.code}</small></div><div className="property-body"><p>{property.location}</p><h3>{property.name}</h3><div className="property-features"><span>3 hab.</span><span>4 baños</span><span>2 parqueaderos</span></div><div className="property-price"><strong>{property.price}</strong><span>Comisión <b>{property.commission}</b></span></div></div></article>)}</div></section>

        <section className="bottom-grid"><article className="activity panel"><div className="panel-heading"><div><p className="eyebrow">TRAZABILIDAD</p><h2>Actividad reciente</h2></div><Link className="quiet-button" href="/documents?audit=1">Ver historial <ChevronRight size={16}/></Link></div><div className="activity-item"><div className="event-icon"><CheckCircle2 size={17}/></div><p><b>Visita confirmada</b><span>Reserva 56 · con Carlos Gómez</span></p><time>Hace 12 min</time></div><div className="activity-item"><div className="event-icon neutral"><Clock3 size={17}/></div><p><b>Seguimiento pendiente</b><span>Laura Méndez no registra actividad hace 4 días</span></p><time>Hace 1 h</time></div></article><article className="insight"><Sparkles size={19}/><div><p>RECOMENDACIÓN HABITA</p><strong>3 clientes pueden hacer match con propiedades recién publicadas.</strong><Link href="/clients?matches=1">Ver coincidencias <ArrowUpRight size={15}/></Link></div></article></section>
      </div>
    </section>
    {notice && <div className="toast" role="status"><CheckCircle2 size={18}/>{notice}</div>}
  </main></>;
}
