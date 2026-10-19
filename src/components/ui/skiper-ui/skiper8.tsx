"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const words = ["Benaq", "Vivienda", "Inversión", "Con intención"];

/** Benaq adaptation of the Skiper 8 curved white preloader. */
export function Skiper8({ duration = 1550 }: { duration?: number }) {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const wordTimer = window.setInterval(
      () => setIndex((current) => (current + 1) % words.length),
      310,
    );
    const doneTimer = window.setTimeout(() => setVisible(false), duration);
    return () => {
      window.clearInterval(wordTimer);
      window.clearTimeout(doneTimer);
    };
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="skiper8-preloader"
          role="status"
          aria-label="Cargando Benaq Constructora"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="skiper8-copy">
            <img src="/brand/benaq-mark.png" alt="" />
            <p>Constructora</p>
            <strong key={words[index]}>{words[index]}</strong>
            <span aria-hidden="true" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
