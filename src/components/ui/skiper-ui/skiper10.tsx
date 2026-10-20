"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Benaq adaptation of Skiper 10's staged shutter preloader. */
export function Skiper10({ duration = 2500, onComplete }: { duration?: number; onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      onComplete?.();
      return;
    }
    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration]);

  return <AnimatePresence mode="wait" onExitComplete={onComplete}>{visible && <motion.div className="skiper10-preloader" style={{ backgroundColor: "#f36b2a" }} role="status" aria-label="Cargando Benaq Constructora">
    <div className="skiper10-copy" style={{ color: "#111111" }}><img src="/brand/benaq-mark.png" alt=""/><motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: .6 } }} exit={{ opacity: 0, transition: { duration: .35 } }}>{["Vivienda", "con", "intención."].map((word, index) => <motion.span key={word} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .48, delay: .18 * index }}>{word}</motion.span>)}</motion.h1></div>
    <div className="skiper10-shutters skiper10-shutters-top">{Array.from({ length: 10 }, (_, index) => <motion.span key={index} style={{ backgroundColor: index % 3 === 2 ? "#f36b2a" : index % 2 ? "#202020" : "#101010" }} initial={{ height: "100%" }} exit={{ height: 0 }} transition={{ duration: .5, delay: .35 + .05 * index, ease: [0.455, .03, .515, .955] }}/>)}</div>
    <div className="skiper10-shutters skiper10-shutters-bottom">{Array.from({ length: 10 }, (_, index) => <motion.span key={index} style={{ backgroundColor: index % 3 === 2 ? "#f36b2a" : index % 2 ? "#202020" : "#101010" }} initial={{ height: "100%" }} exit={{ height: 0 }} transition={{ duration: .5, delay: .35 + .05 * index, ease: [0.455, .03, .515, .955] }}/>)}</div>
  </motion.div>}</AnimatePresence>;
}
