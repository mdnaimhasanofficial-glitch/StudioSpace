"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "cn";

interface RevealProps {
  children: ReactNode;
  /** Extra classes for the wrapper div. */
  className?: string;
  /** Milliseconds to wait before animating — use for staggered grids. */
  delay?: number;
  /** Distance to slide up from, in px. */
  y?: number;
}

/**
 * Fades and slides its children in the first time they scroll into view.
 * The observer disconnects after the first intersection, and people who
 * prefer reduced motion get the content immediately with no movement.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // setState lives in the observer callback (an async subscription), not in
    // the effect body, so it satisfies react-hooks/set-state-in-effect.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      // Start slightly after the element enters the viewport.
      { threshold: 0, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = {
    transitionDelay: `${delay}ms`,
    transitionDuration: "700ms",
    "--reveal-y": `${y}px`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        "transition-[opacity,transform] ease-out motion-reduce:transition-none",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-var(--reveal-y) opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
