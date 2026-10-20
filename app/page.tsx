"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";
import styles from "./landing.module.css";
import "./liquid-glass-carousel.css";
import "./skiper8-preloader.css";
import "./skiper80-projects.css";
import { SplineHero } from "../src/components/spline-hero";
import { BrandPreloader } from "../src/components/brand-preloader";
import { TextReveal } from "../src/components/text-reveal";
import { Skiper80Projects } from "../src/components/ui/skiper-ui/skiper80";

const projects = [
  {
    name: "Lúmina",
    place: "Apartamentos de 59 m²",
    status: "Prelanzamiento",
    price: "Desde $175 millones COP",
    detail:
      "Una propuesta residencial de prelanzamiento con una distribución completa para vivir con comodidad todos los días.",
    rooms: "3 alcobas",
    area: "59 m²",
    delivery: "Prelanzamiento",
    image: "/brand/project-lumina.png",
    features: [
      "Sala comedor",
      "Alcoba principal con baño",
      "Baño social",
      "Cocina y patio de ropas",
      "Balcón",
      "Parqueadero para moto y bodega",
    ],
  },
];

export default function PublicLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form) as Record<string, string>;
    const message = [
      `Hola, soy ${payload.name}.`,
      `Me interesa: ${payload.interest}.`,
      `Correo: ${payload.email}.`,
      payload.phone ? `Teléfono: ${payload.phone}.` : "",
      payload.message ? `Mensaje: ${payload.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Persist the lead when possible, without holding back the WhatsApp handoff.
    void fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    event.currentTarget.reset();
    setFormStatus("sent");
    window.location.assign(`https://wa.me/573104590887?text=${encodeURIComponent(message)}`);
  }
  return (
    <main className={styles.page} style={{ display: "block", width: "100%" }}>
      <BrandPreloader />
      <header className={styles.header}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="Benaq Constructora, inicio"
        >
          <img src="/brand/benaq-mark.png" alt="" />
          <span>BENAQ</span>
          <small>CONSTRUCTORA</small>
        </Link>
        <button
          className={styles.menuButton}
          type="button"
          aria-label={menuOpen ? "Cerrar navegación" : "Abrir navegación"}
          aria-controls="public-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={21} />}
        </button>
        <nav
          id="public-navigation"
          className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`}
          aria-label="Navegación principal"
        >
          <a href="#proyectos" onClick={() => setMenuOpen(false)}>
            Proyectos
          </a>
          <a href="#inversion" onClick={() => setMenuOpen(false)}>
            Vivir e invertir
          </a>
          <a href="#benaq" onClick={() => setMenuOpen(false)}>
            Nosotros
          </a>
          <a href="#contacto" onClick={() => setMenuOpen(false)}>
            Contacto
          </a>
        </nav>
      </header>
      <section className={styles.hero} aria-labelledby="hero-title">
        <SplineHero />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>BENAQ CONSTRUCTORA · COLOMBIA</p>
          <h1 id="hero-title">
            <TextReveal>Espacios con intención.</TextReveal>
            <br />
            <em><TextReveal delay={130}>Decisiones con futuro.</TextReveal></em>
          </h1>
          <p className={styles.heroText}>
            <TextReveal delay={260}>
              Creamos oportunidades de vivienda e inversión pensadas para
              habitar bien hoy y construir patrimonio mañana.
            </TextReveal>
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#proyectos">
              Conoce los proyectos <ArrowRight size={17} />
            </a>
            <a className={styles.textAction} href="#contacto">
              Hablar con un asesor <ChevronRight size={17} />
            </a>
          </div>
        </div>
        <div className={styles.heroNote}>
          <span>VIVIENDA · INVERSIÓN · CONFIANZA</span>
          <p>
            Proyectos que conectan arquitectura, ubicación y una forma cercana
            de acompañarte.
          </p>
        </div>
      </section>
      <section
        id="proyectos"
        className={styles.projects}
        aria-labelledby="projects-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>OPORTUNIDADES DISPONIBLES</p>
            <h2 id="projects-title">
              Encuentra un lugar
              <br />
              para lo que sigue.
            </h2>
          </div>
          <p>
            Conoce nuestros próximos proyectos y recibe orientación para
            encontrar una oportunidad coherente con tu momento y tus metas.
          </p>
        </div>
        <Skiper80Projects projects={projects} />
      </section>
      <section
        id="inversion"
        className={styles.investment}
        aria-labelledby="investment-title"
      >
        <div className={styles.investmentCopy}>
          <p className={styles.eyebrow}>MÁS QUE METROS CUADRADOS</p>
          <h2 id="investment-title">
            Un hogar puede ser
            <br />
            <em>tu próximo gran paso.</em>
          </h2>
          <p>
            Te ayudamos a evaluar una compra desde lo que de verdad importa:
            cómo quieres vivir, qué buscas proteger y hacia dónde quieres
            crecer.
          </p>
          <a href="#contacto" className={styles.lightAction}>
            Explorar oportunidades <ArrowRight size={17} />
          </a>
        </div>
        <div className={styles.benefits}>
          <article>
            <Building2 />
            <h3>Vivienda pensada</h3>
            <p>
              Diseño funcional, entornos para compartir y decisiones que se
              sienten en lo cotidiano.
            </p>
          </article>
          <article>
            <TrendingUp />
            <h3>Inversión consciente</h3>
            <p>
              Alternativas para convertir una decisión inmobiliaria en una base
              para tus próximos proyectos.
            </p>
          </article>
          <article>
            <ShieldCheck />
            <h3>Acompañamiento real</h3>
            <p>
              Información clara y asesoría humana durante cada paso de tu
              proceso.
            </p>
          </article>
        </div>
      </section>
      <section
        id="benaq"
        className={styles.about}
        aria-labelledby="about-title"
      >
        <div className={styles.aboutImage}>
          <img
            src="/brand/benaq-hero.png"
            alt="Arquitectura residencial de Benaq Constructora"
          />
        </div>
        <div className={styles.aboutCopy}>
          <p className={styles.eyebrow}>CONSTRUIR ES CUIDAR EL DETALLE</p>
          <h2 id="about-title">Proyectos que empiezan escuchando.</h2>
          <p>
            En Benaq creemos que construir vivienda no es llenar una ciudad de
            edificios. Es entender las decisiones que hacen posible una vida
            bien vivida y responder con espacios honestos, útiles y duraderos.
          </p>
          <ol>
            <li>
              <span>01</span>
              <div>
                <h3>Elegimos con criterio</h3>
                <p>
                  Analizamos cada oportunidad desde la ubicación, el uso y su
                  potencial a largo plazo.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Diseñamos para la vida real</h3>
                <p>
                  Priorizamos luz, circulación, flexibilidad y momentos de
                  encuentro.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Acompañamos con claridad</h3>
                <p>
                  Te orientamos con información comprensible antes, durante y
                  después de tu decisión.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
      <section
        id="contacto"
        className={styles.contact}
        aria-labelledby="contact-title"
      >
        <div className={styles.contactIntro}>
          <p className={styles.eyebrow}>HABLEMOS DE TU PRÓXIMO ESPACIO</p>
          <h2 id="contact-title">
            <TextReveal>
              Una conversación puede abrir una buena oportunidad.
            </TextReveal>
          </h2>
          <p>
            Cuéntanos qué estás buscando. Nuestro equipo te contactará para
            compartirte información de los proyectos que mejor se ajusten a ti.
          </p>
          <div className={styles.contactDetails}>
            <span>
              <Mail size={17} /> Información de proyectos
            </span>
            <span>
              <Phone size={17} /> Atención personalizada
            </span>
            <span>
              <MapPin size={17} /> Colombia
            </span>
          </div>
        </div>
        <form className={styles.contactForm} onSubmit={submitContact}>
          <label>
            Nombre completo
            <input
              required
              name="name"
              autoComplete="name"
              placeholder="Tu nombre"
            />
          </label>
          <label>
            Correo electrónico
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="nombre@correo.com"
            />
          </label>
          <label>
            Teléfono
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Tu número de contacto"
            />
          </label>
          <label>
            ¿Qué te interesa?
            <select required name="interest" defaultValue="">
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option>Comprar vivienda</option>
              <option>Invertir</option>
              <option>Conocer proyectos futuros</option>
            </select>
          </label>
          <label className={styles.fullField}>
            Cuéntanos un poco más
            <textarea
              name="message"
              rows={4}
              placeholder="Ciudad, presupuesto o el tipo de espacio que buscas"
            />
          </label>
          <button
            className={styles.submit}
            type="submit"
            disabled={formStatus === "sending"}
          >
            Continuar por WhatsApp
            <ArrowRight size={17} />
          </button>
          <p className={styles.whatsappHint}>
            Al continuar, abriremos WhatsApp con tu solicitud lista para enviar.
          </p>
          {formStatus === "sent" && (
            <p className={styles.success} role="status">
              Abriendo WhatsApp…
            </p>
          )}
        </form>
      </section>
      <footer className={styles.footer}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="Benaq Constructora, inicio"
        >
          <img src="/brand/benaq-mark.png" alt="" />
          <span>BENAQ</span>
          <small>CONSTRUCTORA</small>
        </Link>
        <p>
          © {new Date().getFullYear()} Benaq Constructora. Vivienda e inversión
          con intención.
        </p>
      </footer>
    </main>
  );
}
