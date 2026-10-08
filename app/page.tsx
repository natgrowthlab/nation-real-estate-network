"use client";

import { useState } from "react";
import {
  ArrowUpRight, Bell, Building2, CalendarDays, ChevronDown, ChevronRight,
  CircleHelp, Command, FileText, Home, LayoutDashboard, MapPin, Menu,
  MoreHorizontal, Plus, Search, Settings, SlidersHorizontal, Sparkles,
  UsersRound, WalletCards, X, CheckCircle2, Clock3
} from "lucide-react";

const navigation = [
  ["Resumen", LayoutDashboard], ["Inventario", Building2], ["Mis clientes", UsersRound],
  ["Agenda", CalendarDays], ["Comisiones", WalletCards], ["Documentos", FileText]
] as const;

const properties = [
  { code: "NT-24018", name: "Casa Altos del Chicó", location: "Chicó Norte · Bogotá", price: "$ 3.480 M", commission: "$ 69,6 M", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85", tag: "Exclusiva", tone: "blue" },
  { code: "NT-24021", name: "Apartamento Reserva 56", location: "Chapinero Alto · Bogotá", price: "$ 1.280 M", commission: "$ 25,6 M", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", tag: "Nuevo", tone: "teal" },
  { code: "NT-23987", name: "Loft Torre 93", location: "El Poblado · Medellín", price: "$ 890 M", commission: "$ 17,8 M", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85", tag: "Alta demanda", tone: "amber" }
];

function Metric({ label, value, change, icon: Icon }: { label: string; value: string; change: string; icon: typeof UsersRound }) {
  return <article className="metric-card">
    <div className="metric-icon"><Icon size={19} strokeWidth={1.8} /></div>
    <p>{label}</p><strong>{value}</strong>
    <span className="metric-change">{change} <ArrowUpRight size={13} /></span>
  </article>
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [active, setActive] = useState("Resumen");
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 3200); };

  return <main>
    <aside className={menuOpen ? "sidebar open" : "sidebar"} aria-label="Navegación principal">
      <div className="brand"><div className="brand-mark">N</div><span>NATION</span><button className="close-button" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}><X /></button></div>
      <div className="workspace"><span>ESPACIO DE TRABAJO</span><button><div className="avatar small">AM</div> Andina Metropolitana <ChevronDown size={15}/></button></div>
      <nav>{navigation.map(([label, Icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => { setActive(label); setMenuOpen(false); notify(`${label} está listo para explorar.`); }}><Icon size={18}/><span>{label}</span>{label === "Agenda" && <em>3</em>}</button>)}</nav>
      <div className="sidebar-bottom"><button onClick={() => notify("Centro de ayuda abierto.")}><CircleHelp size={18}/> Ayuda</button><button onClick={() => notify("Configuración disponible próximamente.")}><Settings size={18}/> Configuración</button><div className="profile"><div className="avatar">AM</div><div><strong>Andrés Morales</strong><small>Asesor senior</small></div><MoreHorizontal size={18}/></div></div>
    </aside>

    <section className="content">
      <header className="topbar">
        <button className="menu-button" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}><Menu /></button>
        <div className="search"><Search size={18}/><input aria-label="Buscar en Nation" placeholder="Buscar propiedades, clientes o códigos…"/><kbd><Command size={12}/> K</kbd></div>
        <div className="top-actions"><button className="icon-button" aria-label="Notificaciones" onClick={() => notify("Tienes 3 notificaciones pendientes.")}><Bell size={19}/><i /></button><button className="new-button" onClick={() => notify("Formulario de nuevo cliente preparado.")}><Plus size={18}/> <span>Nuevo cliente</span></button></div>
      </header>

      <div className="dashboard">
        <section className="welcome">
          <div><p className="eyebrow">MIÉRCOLES, 8 DE OCTUBRE</p><h1>Buenos días, Andrés<span>.</span></h1><p className="intro">Tu red se mueve contigo. Aquí está el pulso de tu operación.</p></div>
          <button className="capture-button" onClick={() => notify("Iniciamos la captura de una nueva propiedad.")}><Building2 size={18}/><span>Captar propiedad</span><ArrowUpRight size={17}/></button>
        </section>

        <section className="metrics" aria-label="Indicadores comerciales">
          <Metric label="Clientes activos" value="24" change="12% este mes" icon={UsersRound}/>
          <Metric label="Visitas programadas" value="08" change="3 para hoy" icon={CalendarDays}/>
          <Metric label="Negociaciones" value="05" change="2 por cerrar" icon={FileText}/>
          <Metric label="Comisión proyectada" value="$ 42,8 M" change="18% vs. mes anterior" icon={WalletCards}/>
        </section>

        <section className="grid-main">
          <article className="pipeline panel">
            <div className="panel-heading"><div><p className="eyebrow">PIPELINE</p><h2>Clientes en movimiento</h2></div><button className="quiet-button" onClick={() => notify("Vista completa de clientes abierta.")}>Ver todos <ChevronRight size={16}/></button></div>
            <div className="pipeline-stats"><div><strong>24</strong><span>Activos</span></div><div><strong>8</strong><span>En visita</span></div><div><strong>5</strong><span>En oferta</span></div><div><strong>3</strong><span>En cierre</span></div></div>
            <div className="progress-bar" aria-label="Estado de los clientes"><i style={{width:"31%"}}/><i style={{width:"33%"}}/><i style={{width:"21%"}}/><i style={{width:"15%"}}/></div>
            <div className="client-list">
              {[['LM','Laura Méndez','Buscando en Chicó','Seguimiento hoy','coral'],['CG','Carlos Gómez','Visita · Reserva 56','10:30 a. m.','blue'],['SV','Sofía Velasco','Oferta en revisión','Hace 2 h','green']].map(([initials,name,detail,meta,color]) => <div className="client-row" key={name}><div className={`avatar ${color}`}>{initials}</div><div><strong>{name}</strong><span>{detail}</span></div><time>{meta}</time><ChevronRight size={17}/></div>)}
            </div>
          </article>

          <article className="agenda panel">
            <div className="panel-heading"><div><p className="eyebrow">AGENDA DE HOY</p><h2>Próximas visitas</h2></div><button className="round-add" aria-label="Programar visita" onClick={() => notify("Programar visita.")}><Plus size={17}/></button></div>
            <div className="agenda-list"><div className="appointment"><time>10:30<small>a. m.</small></time><div className="appointment-line teal"/><div><strong>Reserva 56 · Apto 402</strong><span><MapPin size={13}/> Chapinero Alto</span><small>Con Carlos Gómez</small></div></div><div className="appointment"><time>02:00<small>p. m.</small></time><div className="appointment-line blue"/><div><strong>Casa Altos del Chicó</strong><span><MapPin size={13}/> Calle 93 # 11–20</span><small>Con Laura Méndez</small></div></div><div className="appointment"><time>04:30<small>p. m.</small></time><div className="appointment-line amber"/><div><strong>Loft Torre 93</strong><span><MapPin size={13}/> El Poblado</span><small>Con David Arango</small></div></div></div>
            <button className="schedule-link" onClick={() => notify("Calendario completo disponible.")}>Ver calendario completo <ArrowUpRight size={15}/></button>
          </article>
        </section>

        <section className="inventory-section"><div className="section-heading"><div><p className="eyebrow">INVENTARIO CURADO</p><h2>Propiedades para tus clientes</h2></div><div><button className="filter-button" onClick={() => notify("Filtros de inventario abiertos.")}><SlidersHorizontal size={16}/> Filtrar</button><button className="quiet-button all-button" onClick={() => notify("Catálogo completo abierto.")}>Ver inventario <ChevronRight size={16}/></button></div></div><div className="properties">{properties.map((property) => <article className="property-card" key={property.code}><div className="property-image" style={{backgroundImage:`linear-gradient(180deg, transparent 35%, rgba(5,32,32,.66)), url(${property.image})`}}><span className={`property-tag ${property.tone}`}>{property.tag}</span><button aria-label={`Guardar ${property.name}`} onClick={() => notify(`${property.name} fue guardada.`)}>♡</button><small>{property.code}</small></div><div className="property-body"><p>{property.location}</p><h3>{property.name}</h3><div className="property-features"><span>3 hab.</span><span>4 baños</span><span>2 parqueaderos</span></div><div className="property-price"><strong>{property.price}</strong><span>Comisión <b>{property.commission}</b></span></div></div></article>)}</div></section>

        <section className="bottom-grid"><article className="activity panel"><div className="panel-heading"><div><p className="eyebrow">TRAZABILIDAD</p><h2>Actividad reciente</h2></div><button className="quiet-button" onClick={() => notify("Historial de auditoría abierto.")}>Ver historial <ChevronRight size={16}/></button></div><div className="activity-item"><div className="event-icon"><CheckCircle2 size={17}/></div><p><b>Visita confirmada</b><span>Reserva 56 · con Carlos Gómez</span></p><time>Hace 12 min</time></div><div className="activity-item"><div className="event-icon neutral"><Clock3 size={17}/></div><p><b>Seguimiento pendiente</b><span>Laura Méndez no registra actividad hace 4 días</span></p><time>Hace 1 h</time></div></article><article className="insight"><Sparkles size={19}/><div><p>RECOMENDACIÓN NATION</p><strong>3 clientes pueden hacer match con propiedades recién publicadas.</strong><button onClick={() => notify("Revisando coincidencias recomendadas.")}>Ver coincidencias <ArrowUpRight size={15}/></button></div></article></section>
      </div>
    </section>
    {notice && <div className="toast" role="status"><CheckCircle2 size={18}/>{notice}</div>}
  </main>;
}
