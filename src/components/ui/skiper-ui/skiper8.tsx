"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const words = ["BENAQ", "LÚMINA", "VIVIENDA", "INVERSIÓN"];
const curveEase = [0.76, 0, 0.24, 1] as const;

/** Benaq implementation of Skiper 8 / Preloader_002. */
export function Skiper8({ duration = 2000 }: { duration?: number }) {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowPreloader(false);
      return;
    }
    const timer = window.setTimeout(() => setShowPreloader(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration]);

  return <AnimatePresence mode="wait">{showPreloader && <Preloader002 />}</AnimatePresence>;
}

function Preloader002() {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => setDimension({ width: window.innerWidth, height: window.innerHeight });
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (index === words.length - 1) return;
    const timer = window.setTimeout(() => setIndex((current) => current + 1), index === 0 ? 850 : 180);
    return () => window.clearTimeout(timer);
  }, [index]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  return (
    <motion.div
      className="skiper8-wave-preloader"
      role="status"
      aria-label="Cargando Benaq Constructora"
      variants={{ initial: { top: 0 }, exit: { top: "-100vh", transition: { duration: 0.8, ease: curveEase, delay: 0.2 } } }}
      initial="initial"
      exit="exit"
    >
      {dimension.width > 0 && <>
        <motion.div className="skiper8-wave-copy" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.45, delay: 0.12 } }}>
          <span className="skiper8-wave-logo" aria-hidden="true"><img src="/brand/benaq-mark.png" alt="" /></span>
          <motion.p key={words[index]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>{words[index]}</motion.p>
        </motion.div>
        <svg className="skiper8-wave-curve" aria-hidden="true">
          <motion.path
            variants={{ initial: { d: initialPath, transition: { duration: 0.7, ease: curveEase } }, exit: { d: targetPath, transition: { duration: 0.7, ease: curveEase, delay: 0.3 } } }}
            initial="initial"
            exit="exit"
            className="skiper8-wave-path"
          />
        </svg>
      </>}
    </motion.div>
  );
}
