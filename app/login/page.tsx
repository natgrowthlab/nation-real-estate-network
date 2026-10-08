"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("configured");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    if (response.ok) window.location.assign("/");
    else setError((await response.json()).error ?? "No fue posible iniciar sesión.");
    setLoading(false);
  }
  return <main className="auth-shell login-shell"><section className="auth-aside"><div className="auth-brand"><i>N</i><span>NATION</span></div><div><p className="eyebrow">RED DE DISTRIBUCIÓN INMOBILIARIA</p><h1>Todo el negocio, en una sola dirección.</h1><p>Inventario verificado, compradores atribuidos y cierres que dejan evidencia.</p></div><div className="aside-metric"><strong>100%</strong><span>de tus operaciones con trazabilidad.</span></div></section><section className="auth-panel"><form onSubmit={submit} className="auth-card"><div className="auth-key"><KeyRound size={20}/></div><p className="eyebrow">ACCESO SEGURO</p><h2>Bienvenido de vuelta</h2>{configured && <p className="form-success">La cuenta administradora fue creada. Ya puedes iniciar sesión.</p>}<label>Correo<input name="email" type="email" required autoComplete="email" placeholder="nombre@empresa.com" /></label><label>Contraseña<input name="password" type="password" required autoComplete="current-password" placeholder="Tu contraseña" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="auth-submit" disabled={loading}>{loading ? "Validando…" : <>Ingresar a NATION <ArrowRight size={17}/></>}</button><p className="setup-link">¿Aún no existe una cuenta? <Link href="/setup">Configurar plataforma</Link></p></form></section></main>;
}
