"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const shutterEase = [0.455, 0.03, 0.515, 0.955] as const;

/**
 * Benaq's adaptation of Skiper 10 / Preloader_004.
 *
 * The original `Main` demo is deliberately not rendered here: the real landing
 * page remains underneath this overlay, so it is revealed by the shutters
 * instead of being replaced by a blank white demo section.
 */
export function Skiper10({ duration = 2500 }: { duration?: number }) {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowPreloader(false);
      return;
    }

    const timer = window.setTimeout(() => setShowPreloader(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration]);

  const words = "Vivienda con intención.".split(" ");

  return (
    <AnimatePresence mode="wait">
      {showPreloader && (
        <motion.div
          className="skiper10-preloader"
          style={{ backgroundColor: "#101010" }}
          role="status"
          aria-label="Cargando Benaq Constructora"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.42, delay: 0.98, ease: "easeOut" } }}
        >
          <div className="skiper10-copy" style={{ color: "#f36b2a" }}>
            <img src="/brand/benaq-mark.png" alt="" />
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.7 } }}
              exit={{ opacity: 0, transition: { duration: 0.35 } }}
            >
              {words.map((word, index) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, delay: 0.2 * index }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <motion.div className="skiper10-shutters skiper10-shutters-top">
            {Array.from({ length: 10 }, (_, index) => (
              <motion.span
                key={index}
                style={{ backgroundColor: index % 3 === 2 ? "#202020" : "#f36b2a" }}
                initial={{ height: "100%" }}
                animate={{ height: "100%" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + 0.05 * index, ease: shutterEase }}
              />
            ))}
          </motion.div>
          <motion.div className="skiper10-shutters skiper10-shutters-bottom">
            {Array.from({ length: 10 }, (_, index) => (
              <motion.span
                key={index}
                style={{ backgroundColor: index % 3 === 2 ? "#202020" : "#f36b2a" }}
                initial={{ height: "100%" }}
                animate={{ height: "100%" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + 0.05 * index, ease: shutterEase }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
