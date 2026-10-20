"use client";

import { Skiper10 } from "./ui/skiper-ui/skiper10";

export function BrandPreloader({ onComplete }: { onComplete?: () => void }) {
  return <Skiper10 onComplete={onComplete} />;
}
