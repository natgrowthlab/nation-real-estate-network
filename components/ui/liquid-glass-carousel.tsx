"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface LiquidGlassCarouselItem { src: string; title: string; aspect?: number; }
export interface LiquidGlassCarouselProps {
  items?: LiquidGlassCarouselItem[]; panelHeight?: number; gap?: number; background?: string;
  entry?: boolean; className?: string; style?: CSSProperties; onActiveChange?: (index: number) => void; onFocusChange?: (focused: boolean) => void;
}

export type LiquidGlassCarouselHandle = { next: () => void; previous: () => void; closeFocus: () => void };

export const liquidGlassCarouselDefaultItems: LiquidGlassCarouselItem[] = [
  { title: "Project One", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop" },
  { title: "Project Two", src: "https://images.unsplash.com/photo-1514906689926-25ba6dcb584b?w=900&auto=format&fit=crop" },
  { title: "Project Three", src: "https://images.unsplash.com/photo-1568557412756-7d219873dd11?w=900&auto=format&fit=crop" },
];

/** A reliable, keyboard and touch accessible replacement for the experimental WebGL version. */
export function LiquidGlassCarousel({ items = liquidGlassCarouselDefaultItems, panelHeight = 360, gap = 20, background = "#fff", className, style, onActiveChange }: LiquidGlassCarouselProps) {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const labelId = useId();
  const count = items.length;
  const setIndex = (next: number) => { if (!count) return; const index = (next + count) % count; setActive(index); onActiveChange?.(index); };
  useEffect(() => { setActive(0); onActiveChange?.(0); }, [count, onActiveChange]);
  if (!count) return null;
  return <section className={cn("liquid-carousel", className)} style={{ "--liquid-height": `${panelHeight}px`, "--liquid-gap": `${gap}px`, background, ...style } as CSSProperties} aria-roledescription="carousel" aria-labelledby={labelId} tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); setIndex(active + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); setIndex(active - 1); } }}>
    <p id={labelId} className="sr-only">Carrusel de proyectos</p>
    <div className="liquid-carousel-track" onPointerDown={(event) => { startX.current = event.clientX; }} onPointerUp={(event) => { if (startX.current === null) return; const distance = event.clientX - startX.current; startX.current = null; if (Math.abs(distance) > 36) setIndex(active + (distance < 0 ? 1 : -1)); }} onPointerCancel={() => { startX.current = null; }}>
      {items.map((item, index) => { const offset = (index - active + count) % count; const position = offset === 0 ? "active" : offset === 1 ? "next" : "previous"; return <button key={`${item.title}-${index}`} type="button" className={`liquid-carousel-card liquid-carousel-card-${position}`} onClick={() => setIndex(index)} aria-label={`Ver ${item.title}`} aria-current={index === active}>
        <img src={item.src} alt={item.title} draggable={false}/><span>{item.title}</span>
      </button>; })}
    </div>
    <div className="liquid-carousel-controls"><button type="button" onClick={() => setIndex(active - 1)} aria-label="Proyecto anterior"><ChevronLeft size={20}/></button><p aria-live="polite">{items[active].title} <span>{active + 1}/{count}</span></p><button type="button" onClick={() => setIndex(active + 1)} aria-label="Proyecto siguiente"><ChevronRight size={20}/></button></div>
  </section>;
}
