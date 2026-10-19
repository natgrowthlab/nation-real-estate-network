"use client";

import { createElement } from "react";
import Script from "next/script";
import styles from "./spline-hero.module.css";

const sceneUrl = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode";

export function SplineHero() {
  return <div className={styles.stage} aria-hidden="true">
    <Script src="https://unpkg.com/@splinetool/viewer@1.10.55/build/spline-viewer.js" type="module" strategy="afterInteractive" />
    {createElement("spline-viewer", { url: sceneUrl, className: styles.viewer })}
  </div>;
}
