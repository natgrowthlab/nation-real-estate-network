"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./text-reveal.module.css";

export function TextReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) { setShown(true); observer.disconnect(); } }, { threshold: .15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <span ref={ref} className={`${styles.reveal} ${shown ? styles.shown : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</span>;
}
