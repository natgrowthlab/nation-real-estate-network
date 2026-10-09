import { notFound } from "next/navigation";
import { PortalScreen } from "../../src/components/portal-screen";

const sections: Record<string, { title: string; eyebrow: string; description: string; empty: string; action: string }> = {
  inventory: { title: "Inventario", eyebrow: "INMUEBLES", description: "Consulta inmuebles según las reglas de disclosure de tu rol.", empty: "No hay inmuebles que mostrar todavía.", action: "Crear inmueble" },
  clients: { title: "Mis clientes", eyebrow: "CRM", description: "Registra compradores, protege su atribución y acompaña cada etapa.", empty: "Aún no hay compradores asignados.", action: "Registrar comprador" },
  appointments: { title: "Agenda", eyebrow: "VISITAS", description: "Solicita, confirma y da seguimiento a las visitas autorizadas.", empty: "No hay visitas programadas.", action: "Programar visita" },
  offers: { title: "Ofertas", eyebrow: "NEGOCIACIÓN", description: "Envía ofertas y conserva cada versión bajo trazabilidad.", empty: "No hay ofertas activas.", action: "Crear oferta" },
  deals: { title: "Operaciones", eyebrow: "CIERRES", description: "Gestiona hitos, requisitos y el avance de cada operación.", empty: "No hay operaciones abiertas.", action: "Ver operaciones" },
  commissions: { title: "Comisiones", eyebrow: "RESULTADOS", description: "Consulta proyecciones y pagos con base en reglas registradas.", empty: "No hay comisiones para este periodo.", action: "Ver reglas" },
  documents: { title: "Documentos", eyebrow: "CUMPLIMIENTO", description: "Centraliza los documentos privados con acceso controlado.", empty: "No hay documentos disponibles.", action: "Subir documento" },
};

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const config = sections[section];
  if (!config) notFound();
  return <PortalScreen title={config.title} eyebrow={config.eyebrow} description={config.description}><section className="module-empty" aria-labelledby="empty-title"><div className="module-mark">N</div><h2 id="empty-title">{config.empty}</h2><p>Este módulo ya tiene su ruta protegida y está preparado para mostrar datos reales de la red.</p><button type="button">{config.action}</button></section></PortalScreen>;
}
