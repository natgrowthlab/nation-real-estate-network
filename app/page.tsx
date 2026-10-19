"use client";

import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Building2,
  CalendarDays,
  ChevronRight,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  Phone,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";
import styles from "./landing.module.css";
import "./liquid-glass-carousel.css";
import { SplineHero } from "../src/components/spline-hero";
import { LiquidGlassCarousel } from "../components/ui/liquid-glass-carousel";
import { BrandPreloader } from "../src/components/brand-preloader";
import { TextReveal } from "../src/components/text-reveal";
import { RollingText } from "../src/components/ui/skiper-ui/skiper27";
import { HoverMember } from "../src/components/ui/skiper-ui/skiper6";

const projects = [
  {
    name: "Ladera",
    place: "Un proyecto residencial",
    status: "Prelanzamiento",
    price: "Desde COP 420 millones",
    detail:
      "Apartamentos pensados para acompañar cada etapa de vida, con espacios que privilegian la luz, la calma y la conexión.",
    rooms: "1–3 habitaciones",
    area: "48–102 m²",
    delivery: "Consulta fechas de entrega",
    image: "/brand/project-ladera.png",
  },
  {
    name: "Atria",
    place: "Un proyecto de inversión",
    status: "En construcción",
    price: "Desde COP 365 millones",
    detail:
      "Una alternativa para quienes buscan patrimonio con un diseño consciente, ubicaciones de alto potencial y asesoría cercana.",
    rooms: "1–2 habitaciones",
    area: "38–76 m²",
    delivery: "Consulta disponibilidad",
    image: "/brand/project-atria.png",
  },
  {
    name: "Verde Alto",
    place: "Un proyecto para habitar",
    status: "Próxima apertura",
    price: "Información bajo solicitud",
    detail:
      "Una propuesta que integra vivienda, zonas comunes y una relación más natural con el entorno cotidiano.",
    rooms: "2–3 habitaciones",
    area: "64–118 m²",
    delivery: "Regístrate para novedades",
    image: "/brand/project-verde-alto.png",
  },
];

export default function PublicLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(0);
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const project = projects[selectedProject];
  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("sending");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const result = await response.json();
      if (!response.ok || !result.whatsappUrl) throw new Error(result.error);
      event.currentTarget.reset();
      setFormStatus("sent");
      window.location.assign(result.whatsappUrl);
    } catch {
      setFormStatus("error");
    }
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
            <RollingText
              text="Espacios con intención."
              speed={0.018}
              duration={1.65}
              className="skiper-hero-title"
            />
            <em>
              <RollingText
                text="Decisiones con futuro."
                speed={0.018}
                duration={1.75}
                className="skiper-hero-title skiper-hero-italic"
              />
            </em>
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
        <div className="glass-carousel-shell">
          <LiquidGlassCarousel
            items={projects.map(({ name, image }) => ({
              title: name,
              src: image,
              aspect: 1.5,
            }))}
            panelHeight={360}
            gap={20}
            background="#f8faf7"
            entry={false}
            onActiveChange={setSelectedProject}
          />
        </div>
        <div className={styles.projectLayout}>
          <div className={styles.projectList}>
            {projects.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className={`${styles.projectCard} ${selectedProject === index ? styles.projectCardActive : ""}`}
                onClick={() => setSelectedProject(index)}
                aria-pressed={selectedProject === index}
              >
                <span className={styles.projectNumber}>0{index + 1}</span>
                <div>
                  <span className={styles.projectStatus}>{item.status}</span>
                  <h3>{item.name}</h3>
                  <p>{item.place}</p>
                </div>
                <ArrowRight size={19} />
              </button>
            ))}
          </div>
          <article className={styles.projectDetail} aria-live="polite">
            <div className={styles.projectVisual}>
              <img
                src={project.image}
                alt={`${project.name}, ${project.place.toLowerCase()}`}
              />
              <span>{project.status}</span>
            </div>
            <div className={styles.projectInfo}>
              <p className={styles.eyebrow}>{project.place.toUpperCase()}</p>
              <h3>{project.name}</h3>
              <p>{project.detail}</p>
              <strong>{project.price}</strong>
              <div className={styles.projectSpecs}>
                <span>
                  <BedDouble size={16} />
                  {project.rooms}
                </span>
                <span>
                  <Maximize2 size={16} />
                  {project.area}
                </span>
                <span>
                  <CalendarDays size={16} />
                  {project.delivery}
                </span>
              </div>
              <a href="#contacto" className={styles.inlineAction}>
                Quiero recibir información <ArrowRight size={16} />
              </a>
            </div>
          </article>
        </div>
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
          <HoverMember defaultName="BENAQ" teamMembers={[{ name: "Criterio", image: "/brand/project-ladera.png" }, { name: "Vida real", image: "/brand/project-atria.png" }, { name: "Claridad", image: "/brand/project-verde-alto.png" }]} />
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
            {formStatus === "sending"
              ? "Preparando WhatsApp…"
              : "Continuar por WhatsApp"}
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
          {formStatus === "error" && (
            <p className={styles.error} role="alert">
              No fue posible preparar WhatsApp. Configura WHATSAPP_NUMBER o
              inténtalo de nuevo.
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
