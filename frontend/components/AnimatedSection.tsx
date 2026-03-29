"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

// ─── Animate on scroll with IntersectionObserver ───────────────────────────────

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: "fade-up" | "fade-in" | "fade-left";
  threshold?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  animation = "fade-up",
  threshold = 0.1,
  as: Tag = "div",
}: AnimatedSectionProps) {
  const ref     = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const baseStyle: React.CSSProperties = {
    transition: `opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
    opacity:   visible ? 1 : 0,
    transform: visible
      ? "none"
      : animation === "fade-up"   ? "translateY(32px)"
      : animation === "fade-left" ? "translateX(-24px)"
      : "none",
  };

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={baseStyle}>
      {children}
    </Tag>
  );
}

// ─── Staggered children container ─────────────────────────────────────────────

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
  baseDelay?: number;
}

export function StaggeredChildren({
  children,
  className,
  staggerMs = 100,
  baseDelay = 0,
}: StaggerProps) {
  const ref     = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                transition: `opacity 0.7s ease ${baseDelay + i * staggerMs}ms, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${baseDelay + i * staggerMs}ms`,
                opacity:   visible ? 1 : 0,
                transform: visible ? "none" : "translateY(24px)",
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
