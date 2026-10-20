"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import React, {
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export interface TextBoxRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  highlight?: string;
  highlightTextClass?: string;
  highlightBgClass?: string;
  compact?: boolean;
}

export const TextBoxReveal: FC<TextBoxRevealProps> = ({
  children,
  className,
  highlight,
  highlightTextClass,
  highlightBgClass,
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const mobileScrollProgress = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");
    let frameId: number | undefined;
    let mobilePhase = "before";

    const updateProgress = () => {
      const element = containerRef.current;
      const mobile = mediaQuery.matches;
      setIsMobile((previous) => (previous === mobile ? previous : mobile));

      if (!mobile || !element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      mobileScrollProgress.set(progress);

      // Mobile browsers are inconsistent with CSS `position: sticky` inside
      // long animated sections. Pin only while the scroll journey is active,
      // then anchor the scene to the end of its reserved space. This keeps the
      // reveal centered and avoids layout changes on every scroll frame.
      const stickyElement = element.querySelector<HTMLElement>(
        ".skiper70-sticky",
      );
      if (!stickyElement) return;

      const nextPhase =
        rect.top > 0
          ? "before"
          : rect.bottom <= stickyElement.offsetHeight
            ? "complete"
            : "pinned";

      if (nextPhase !== mobilePhase) {
        element.classList.toggle("is-mobile-pinned", nextPhase === "pinned");
        element.classList.toggle(
          "is-mobile-complete",
          nextPhase === "complete",
        );
        mobilePhase = nextPhase;
      }
    };

    const requestUpdate = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    mediaQuery.addEventListener("change", requestUpdate);

    return () => {
      containerRef.current?.classList.remove(
        "is-mobile-pinned",
        "is-mobile-complete",
      );
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      mediaQuery.removeEventListener("change", requestUpdate);
    };
  }, [mobileScrollProgress]);
  const progress = isMobile ? mobileScrollProgress : scrollYProgress;

  // Convert children to string for processing
  const textContent =
    typeof children === "string"
      ? children
      : React.Children.toArray(children)
          .map((child: ReactNode) => {
            if (typeof child === "string") return child;
            if (
              typeof child === "object" &&
              child !== null &&
              "props" in child
            ) {
              // Handle JSX elements like <span>, <br />
              const childElement = child as {
                type: string;
                props: { children?: ReactNode };
              };
              if (childElement.type === "br") return "\n";
              if (childElement.type === "span")
                return childElement.props.children || "";
              return childElement.props.children || "";
            }
            return String(child);
          })
          .join("");

  // Split by lines first, then by words
  const lines = textContent.split(/\n+/);
  const allWords: { word: string; lineIndex: number; wordIndex: number }[] = [];

  lines.forEach((line, lineIndex) => {
    const words = line.split(/\s+/).filter((word) => word.length > 0);
    words.forEach((word, wordIndex) => {
      allWords.push({ word, lineIndex, wordIndex });
    });
  });

  return (
    <div ref={containerRef} className={cn("skiper70-reveal", compact && "skiper70-reveal-compact")}>
      <div className="skiper70-sticky">
        <div
          className={cn(
            "skiper70-text",
            className,
          )}
        >
          {lines.map((line, lineIndex) => {
            const lineWords = line
              .split(/\s+/)
              .filter((word) => word.length > 0);
            return (
              <div key={lineIndex} className="skiper70-line">
                {lineWords.map((word, wordIndex) => {
                  const globalWordIndex = allWords.findIndex(
                    (w) =>
                      w.lineIndex === lineIndex && w.wordIndex === wordIndex,
                  );
                  return (
                    <AnimatedWord
                      key={`${isMobile ? "mobile" : "desktop"}-${lineIndex}-${wordIndex}`}
                      progress={progress}
                      wordIndex={globalWordIndex}
                      totalWords={allWords.length}
                      highlight={highlight}
                      highlightTextClass={highlightTextClass}
                      highlightBgClass={highlightBgClass}
                    >
                      {word}
                    </AnimatedWord>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface AnimatedWordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  wordIndex: number;
  totalWords: number;
  classes?: string;
  highlight?: string;
  highlightTextClass?: string;
  highlightBgClass?: string;
}

const AnimatedWord: FC<AnimatedWordProps> = ({
  children,
  progress,
  wordIndex,
  totalWords,
  highlight,
  highlightTextClass,
  highlightBgClass,
}) => {
  // Animation parameters
  const overlapWords = 6;

  // Calculate word timing
  const wordStart = wordIndex / totalWords;
  const wordEnd = wordStart + overlapWords / totalWords;
  const totalAnimationLength = 1 + overlapWords / totalWords;
  const timelineScale =
    1 /
    Math.min(
      totalAnimationLength,
      1 + (totalWords - 1) / totalWords + overlapWords / totalWords,
    );
  const adjustedStart = wordStart * timelineScale;
  const adjustedEnd = wordEnd * timelineScale;
  const duration = adjustedEnd - adjustedStart;

  // Background opacity
  const bgOpacity = useTransform(
    progress,
    [adjustedStart + duration * 0.9, adjustedEnd],
    [1, 0],
  );

  // Text reveal opacity
  const textOpacity = useTransform(
    progress,
    [adjustedStart + duration * 0.9, adjustedEnd],
    [0, 1],
  );

  return (
    <motion.span
      className={cn(
        "skiper70-word",
        highlight === children && highlightTextClass,
      )}
    >
      <motion.div
        className={cn(
          "skiper70-word-cover",
          highlight === children && highlightBgClass,
        )}
        style={{ opacity: bgOpacity }}
      />
      <motion.span
        className={cn("relative z-10")}
        style={{ opacity: textOpacity }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
};

const Skiper70 = () => {
  return (
    <div className="h-full w-full">
      <div className="my-20 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Scroll to reveal text word by word
        </span>
      </div>
      <TextBoxReveal
        highlight="distributed"
        highlightTextClass="!text-orange-500"
        highlightBgClass="!bg-orange-500"
        className="font-old-school-grotesk"
      >
        Your data is taken by companies and used to train the next wave of Al
        models and build the world's top products and services. Yet it often
        happens without any earnings being distributed back to you.
        <br />
        It's time for a change. With Navigate you join a decentralized
        intelligence platform that puts the power back in your hands and rewards
        you for the data you contribute.
      </TextBoxReveal>
    </div>
  );
};

export { Skiper70 };

// https://nvg8.io/ recreated this effect from this
