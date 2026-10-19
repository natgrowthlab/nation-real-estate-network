"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Benaq adaptation of the Skiper 21 login surface. */
export function Skiper21Shell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="skiper21-shell"
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="skiper21-orbit skiper21-orbit-one" aria-hidden="true" />
      <span className="skiper21-orbit skiper21-orbit-two" aria-hidden="true" />
      <div className="skiper21-content">{children}</div>
    </motion.div>
  );
}

export function Skiper21() {
  return (
    <Skiper21Shell>
      <p>Acceso seguro Benaq</p>
    </Skiper21Shell>
  );
}
