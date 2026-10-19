"use client";

import { useEffect, useState } from "react";
import styles from "./brand-preloader.module.css";

const messages = ["Vivienda", "Inversión", "Benaq"];

export function BrandPreloader() {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(false);
      return;
    }
    const words = window.setInterval(() => setMessage((current) => (current + 1) % messages.length), 420);
    const done = window.setTimeout(() => setVisible(false), 1500);
    return () => { window.clearInterval(words); window.clearTimeout(done); };
  }, []);

  if (!visible) return null;
  return <div className={styles.preloader} role="status" aria-label="Cargando Benaq Constructora">
    <div className={styles.inner}>
      <img src="/brand/benaq-mark.png" alt="" />
      <p>Construimos con intención</p>
      <strong key={messages[message]}>{messages[message]}</strong>
      <span aria-hidden="true" />
    </div>
  </div>;
}
