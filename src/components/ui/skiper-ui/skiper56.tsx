"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";

import { cn } from "@/lib/utils";

const Skiper56 = () => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 bg-[#f5f4f3]">
      <div className="lg:h-22 flex h-14 w-full items-center justify-end">
        <div className="ml-10 h-full w-full border-b border-black/10 lg:w-[50vw]">
          <VanishForm
            placeholder="yo@gxuri.me"
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export { Skiper56 };

// Component adapted from Aceternity UI by Manu Arora
// Source: https://ui.aceternity.com/registry/placeholders-and-vanish-input.json
// Integrated into Skiper UI with design system and code structure updates
// Respect original creator's rights.

export function VanishForm({
  placeholder,
  onChange,
  onSubmit,
  className,
}: {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.letterSpacing = "-0.05em";

    // Automatically calculate text position based on font metrics
    const metrics = ctx.measureText("A"); // Use "A" as baseline if no value
    const textHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const baselineY = textHeight + 10;

    ctx.fillText(value, 0, baselineY);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let t = 0; t < 800; t++) {
      const i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        const e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const animate = (start: number) => {
    const animateFrame = (pos = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSubmit();
    }
  };

  const vanishAndSubmit = () => {
    setAnimating(true);
    draw();

    const value = inputRef.current?.value || "";
    if (value && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0,
      );
      animate(maxX);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    vanishAndSubmit();
    onSubmit && onSubmit(e);
  };
  return (
    <form
      className={cn(
        "relative mx-auto w-full text-4xl tracking-[-0.05em] text-black lg:!text-6xl",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <canvas
        className={cn(
          "pointer-events-none absolute top-[10%] origin-top-left scale-50 transform pr-20 text-base invert filter lg:top-[12%]",
          !animating ? "opacity-0" : "opacity-100",
        )}
        ref={canvasRef}
      />
      <label className="flex items-center pr-2">
        <input
          name="quickMessage"
          onChange={(e) => {
            if (!animating) {
              setValue(e.target.value);
              onChange && onChange(e);
            }
          }}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          className={cn(
            "relative z-50 h-full w-full border-none bg-transparent pr-4 text-black focus:outline-none focus:ring-0",
            animating && "text-transparent dark:text-transparent",
          )}
        />
        <button
          type="submit"
          className="rounded-6 flex h-full cursor-pointer items-center justify-center whitespace-nowrap pr-4"
        >
          {!value ? (
            "→"
          ) : (
            <p className="pt-2 text-base tracking-tight opacity-50">
              [&nbsp;enter ↵&nbsp;]
            </p>
          )}
        </button>
      </label>
    </form>
  );
}

/**
 * Skiper 56 Placeholders and Vanish Input — React + framer motion
 * Inspired by and adapted from https://ui.aceternity.com/registry/placeholders-and-vanish-input.json
 * Inspired by and adapted from https://devouringdetails.com/login
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the ui.aceternity.com . They’re independent recreations meant to study interaction design
 * These animations aren’t associated with the devouringdetails.com . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
