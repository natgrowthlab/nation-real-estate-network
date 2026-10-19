"use client";

import { AnimatePresence, motion, useSpring } from "framer-motion";
import { useRef, useState } from "react";

type Project = { name: string; image: string; label: string };

export function Skiper6ProjectCarousel({ projects, active, onActiveChange }: { projects: Project[]; active: number; onActiveChange: (index: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { mass: .1, damping: 16, stiffness: 71 });
  const y = useSpring(0, { mass: .1, damping: 16, stiffness: 71 });
  const scale = useSpring(0, { mass: .1, damping: 10, stiffness: 150 });
  const current = hovered ?? active;
  const project = projects[current];
  return <section className="skiper6-projects" aria-label="Galería de proyectos" onPointerMove={(event) => { const rect = gallery.current?.getBoundingClientRect(); if (rect) { x.set(event.clientX - rect.left); y.set(event.clientY - rect.top); } }}>
    <div className="skiper6-thumbnails" ref={gallery} onPointerEnter={() => scale.set(1)} onPointerLeave={() => { scale.set(0); setHovered(null); }}>
      {projects.map((item, index) => <motion.button key={item.name} type="button" className={`skiper6-thumb ${current === index ? "is-active" : ""}`} animate={{ width: current === index ? 150 : 76, height: current === index ? 150 : 76 }} transition={{ duration: .24, ease: "easeOut" }} onFocus={() => { setHovered(index); onActiveChange(index); }} onMouseEnter={() => { setHovered(index); onActiveChange(index); }} onClick={() => onActiveChange(index)} aria-label={`Ver proyecto ${item.name}`} aria-pressed={active === index}><img src={item.image} alt={item.label}/><span>{item.name}</span></motion.button>)}
      <motion.div className="skiper6-cursor" style={{ x, y, scale, transformOrigin: "left top" }} aria-hidden="true">↗</motion.div>
    </div>
    <div className="skiper6-name" aria-live="polite"><AnimatePresence mode="wait"><motion.h3 key={project.name} initial={{ y: "105%" }} animate={{ y: 0 }} exit={{ y: "-105%" }} transition={{ duration: .55, ease: [0.19, 1, 0.22, 1] }}>{project.name}</motion.h3></AnimatePresence></div>
    <p className="skiper6-instruction">Explora un proyecto</p>
  </section>;
}
