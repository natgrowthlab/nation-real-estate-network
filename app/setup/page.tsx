"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Building2, CheckCircle2, ShieldCheck } from "lucide-react";

export default function SetupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    if (response.ok) window.location.assign("/login?configured=1");
    else setError((await response.json()).error ?? "No fue posible configurar la cuenta.");
    setLoading(false);
  }
  return <main className="auth-shell"><section className="auth-aside"><div className="auth-brand"><i>N</i><span>NATION</span></div><div><p className="eyebrow">CONFIGURACIÓN INICIAL</p><h1>Una red construida para la confianza.</h1><p>Crea la cuenta que administrará inventario, reglas comerciales, atribución y trazabilidad.</p></div><div className="trust-list"><p><ShieldCheck size={17}/> Acceso con roles y permisos</p><p><CheckCircle2 size={17}/> Auditoría de acciones sensibles</p><p><Building2 size={17}/> Inventario centralizado</p></div></section><section className="auth-panel"><form onSubmit={submit} className="auth-card"><p className="eyebrow">PRIMER ACCESO</p><h2>Crea la cuenta administradora</h2><p className="auth-copy">Esta cuenta tendrá control total de la plataforma.</p><label>Nombre completo<input name="fullName" required autoComplete="name" placeholder="Tu nombre" /></label><label>Correo corporativo<input name="email" type="email" required autoComplete="email" placeholder="nombre@empresa.com" /></label><label>Contraseña<input name="password" type="password" minLength={12} required autoComplete="new-password" placeholder="Mínimo 12 caracteres" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="auth-submit" disabled={loading}>{loading ? "Configurando…" : <>Crear cuenta <ArrowRight size={17}/></>}</button></form></section></main>;
}
