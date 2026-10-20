"use client";

import {
  motion,
  MotionValue,
  useInView,
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
  const isInView = useInView(containerRef, { amount: 0.18, once: true });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

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
                      key={`${lineIndex}-${wordIndex}`}
                      progress={scrollYProgress}
                      wordIndex={globalWordIndex}
                      totalWords={allWords.length}
                      highlight={highlight}
                      highlightTextClass={highlightTextClass}
                      highlightBgClass={highlightBgClass}
                      mobileReveal={isMobile && isInView}
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
  mobileReveal: boolean;
}

const AnimatedWord: FC<AnimatedWordProps> = ({
  children,
  progress,
  wordIndex,
  totalWords,
  highlight,
  highlightTextClass,
  highlightBgClass,
  mobileReveal,
}) => {
  // Animation parameters
  const overlapWords = 15;

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

  // Word opacity
  const opacity = useTransform(progress, [adjustedStart, adjustedEnd], [0.14, 1]);

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
  const revealDelay = Math.min(wordIndex * 0.055, 1.2);

  return (
    <motion.span
      className={cn(
        "skiper70-word",
        highlight === children && highlightTextClass,
      )}
      style={mobileReveal ? undefined : { opacity }}
      initial={mobileReveal ? { opacity: 0, y: 10 } : false}
      animate={mobileReveal ? { opacity: 1, y: 0 } : undefined}
      transition={
        mobileReveal
          ? { duration: 0.32, delay: revealDelay, ease: "easeOut" }
          : undefined
      }
    >
      <motion.div
        className={cn(
          "skiper70-word-cover",
          highlight === children && highlightBgClass,
        )}
        style={mobileReveal ? undefined : { opacity: bgOpacity }}
        initial={mobileReveal ? { opacity: 1, scaleX: 1 } : false}
        animate={mobileReveal ? { opacity: 0, scaleX: 0.35 } : undefined}
        transition={
          mobileReveal
            ? { duration: 0.28, delay: revealDelay + 0.1, ease: "easeOut" }
            : undefined
        }
      />
      <motion.span
        className={cn("relative z-10")}
        style={mobileReveal ? undefined : { opacity: textOpacity }}
        initial={mobileReveal ? { opacity: 0 } : false}
        animate={mobileReveal ? { opacity: 1 } : undefined}
        transition={
          mobileReveal
            ? { duration: 0.2, delay: revealDelay + 0.1, ease: "easeOut" }
            : undefined
        }
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
