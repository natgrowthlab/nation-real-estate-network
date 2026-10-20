"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BedDouble, CalendarDays, Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";

export type Skiper80Project = {
  name: string;
  place: string;
  status: string;
  price: string;
  detail: string;
  rooms: string;
  area: string;
  delivery: string;
  image: string;
  features: string[];
};

export function Skiper80Projects({ projects }: { projects: Skiper80Project[] }) {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const preview = projects[hoveredIndex];
  const activeProject = activeIndex === null ? null : projects[activeIndex];

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <div className="skiper80-projects" aria-label="Proyectos disponibles">
        <div className="skiper80-project-list">
          <p className="skiper80-project-list-label">PROYECTOS DISPONIBLES</p>
          {projects.map((project, index) => (
            <motion.button
              key={project.name}
              type="button"
              className={`skiper80-project-item ${hoveredIndex === index ? "is-active" : ""}`}
              onFocus={() => setHoveredIndex(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver información de ${project.name}`}
            >
              <span className="skiper80-project-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="skiper80-project-item-copy">
                <small>{project.status}</small>
                <strong>{project.name}</strong>
                <em>{project.place}</em>
              </span>
              <ArrowRight size={24} aria-hidden="true" />
            </motion.button>
          ))}
        </div>

        <motion.button
          type="button"
          className="skiper80-project-preview"
          layoutId={`project-image-${preview.name}`}
          onClick={() => setActiveIndex(hoveredIndex)}
          aria-label={`Abrir información de ${preview.name}`}
        >
          <img src={preview.image} alt={`Fachada del proyecto ${preview.name}`} />
          <span>{preview.status}</span>
          <div><small>{preview.place}</small><strong>{preview.name}</strong></div>
        </motion.button>
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="skiper80-dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setActiveIndex(null)}
          >
            <motion.section
              className="skiper80-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="skiper80-dialog-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button className="skiper80-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Cerrar información del proyecto">
                <X size={21} />
              </button>
              <motion.img layoutId={`project-image-${activeProject.name}`} src={activeProject.image} alt={`Fachada del proyecto ${activeProject.name}`} />
              <div className="skiper80-dialog-copy">
                <p>{activeProject.place.toUpperCase()}</p>
                <h3 id="skiper80-dialog-title">{activeProject.name}</h3>
                <span className="skiper80-dialog-status">{activeProject.status}</span>
                <p className="skiper80-dialog-description">{activeProject.detail}</p>
                <strong className="skiper80-dialog-price">{activeProject.price}</strong>
                <div className="skiper80-dialog-specs">
                  <span><BedDouble size={17} />{activeProject.rooms}</span>
                  <span><Maximize2 size={17} />{activeProject.area}</span>
                  <span><CalendarDays size={17} />{activeProject.delivery}</span>
                </div>
                <ul>{activeProject.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <a href="#contacto" onClick={() => setActiveIndex(null)}>Quiero recibir información de {activeProject.name} <ArrowRight size={17} /></a>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
