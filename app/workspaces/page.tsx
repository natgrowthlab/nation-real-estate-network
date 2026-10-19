"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { PortalScreen } from "../../src/components/portal-screen";

type Workspace = { id: string; name: string; slug: string; role: "OWNER" | "ADMIN" | "MEMBER"; setting?: { currency: string; timezone: string } | null };

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetch("/api/workspaces").then((response) => response.json()).then((data) => { setWorkspaces(data.workspaces ?? []); setActiveWorkspaceId(data.activeWorkspaceId ?? null); }); }, []);

  async function create(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage("");
    const response = await fetch("/api/workspaces", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    const workspace = await response.json();
    if (!response.ok) setMessage(workspace.error ?? "No fue posible crear el espacio.");
    else { setWorkspaces((current) => [...current, workspace]); setActiveWorkspaceId(workspace.id); setName(""); setMessage("Espacio creado y seleccionado."); }
    setLoading(false);
  }

  async function remove(workspace: Workspace) {
    const confirmed = window.confirm(`Eliminar “${workspace.name}” eliminará permanentemente sus inmuebles, clientes, visitas, ofertas, cierres y configuración. Esta acción no se puede deshacer.`);
    if (!confirmed) return;
    setDeletingId(workspace.id); setMessage("");
    const response = await fetch(`/api/workspaces/${workspace.id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) setMessage(result.error ?? "No fue posible eliminar el espacio.");
    else { setWorkspaces((current) => current.filter((item) => item.id !== workspace.id)); setActiveWorkspaceId(result.activeWorkspaceId ?? null); setMessage("Espacio eliminado. La información de los otros espacios no fue modificada."); }
    setDeletingId(null);
  }

  return <PortalScreen title="Espacios de trabajo" eyebrow="ORGANIZACIÓN" description="Cada espacio mantiene sus propios inmuebles, clientes, visitas, ofertas, cierres y configuración.">
    <section className="workspace-layout">
      <form className="create-card" onSubmit={create}>
        <h2>Crear un espacio</h2>
        <p>Usa un espacio distinto para cada constructora, equipo o unidad de negocio.</p>
        <label>Nombre<input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Ej. Andina Metropolitana" /></label>
        {message && <p className={message.includes("No fue") || message.includes("posible") ? "form-error" : "form-success"}>{message}</p>}
        <button disabled={loading}>{loading ? "Creando…" : <><Plus size={16}/> Crear espacio</>}</button>
      </form>
      <div className="workspace-list" aria-live="polite">
        {workspaces.length ? workspaces.map((workspace) => <article key={workspace.id} className={workspace.id === activeWorkspaceId ? "workspace-current" : ""}>
          <div className="workspace-icon">{workspace.name.slice(0, 1).toUpperCase()}</div>
          <div><strong>{workspace.name}</strong><span>{workspace.slug} · {workspace.role === "OWNER" ? "Propietario" : workspace.role === "ADMIN" ? "Administrador" : "Miembro"}</span>{workspace.id === activeWorkspaceId && <small className="workspace-active"><Check size={12}/> Espacio activo</small>}</div>
          {workspace.role === "OWNER" && <button className="workspace-delete" type="button" onClick={() => remove(workspace)} disabled={deletingId === workspace.id} aria-label={`Eliminar ${workspace.name}`}>{deletingId === workspace.id ? "…" : <Trash2 size={16}/>}</button>}
        </article>) : <p className="muted-empty">Crea tu primer espacio de trabajo para comenzar.</p>}
      </div>
    </section>
  </PortalScreen>;
}
