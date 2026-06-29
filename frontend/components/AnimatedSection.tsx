"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

// ─── Shared IntersectionObserver hook ────────────────────────────────────────

function useVisible(threshold = 0.1, rootMargin = "0px 0px -60px 0px") {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, visible };
}

// ─── AnimatedSection ──────────────────────────────────────────────────────────

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** fade-up: opacity + translateY (standard)
   *  fade-in: opacity only
   *  fade-left: opacity + translateX
   *  reveal: text-mask slide-up (wraps children in overflow:hidden clipper)
   */
  animation?: "fade-up" | "fade-in" | "fade-left" | "reveal";
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
  const { ref, visible } = useVisible(threshold);

  // ── text-mask reveal ───────────────────────────────────────────────────────
  if (animation === "reveal") {
    return (
      // @ts-expect-error dynamic tag
      <Tag ref={ref} className={clsx("reveal-parent", className)}>
        <span
          className={clsx("reveal-child", visible && "is-visible")}
          style={{ transitionDelay: `${delay}ms` }}
        >
          {children}
        </span>
      </Tag>
    );
  }

  // ── standard transitions ───────────────────────────────────────────────────
  const style: React.CSSProperties = {
    transition: [
      `opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
      `transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
    ].join(", "),
    opacity: visible ? 1 : 0,
    transform: visible
      ? "none"
      : animation === "fade-up"
        ? "translateY(56px)"
        : animation === "fade-left"
          ? "translateX(-32px)"
          : "none",
  };

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

// ─── StaggeredChildren ────────────────────────────────────────────────────────

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
  const { ref, visible } = useVisible(0.08);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                transition: [
                  `opacity 0.8s ease ${baseDelay + i * staggerMs}ms`,
                  `transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${baseDelay + i * staggerMs}ms`,
                ].join(", "),
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(40px)",
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

// ─── RevealText — heading-level text mask reveal with per-line support ─────────

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function RevealText({
  children,
  className,
  delay = 0,
  as: Tag = "h2",
}: RevealTextProps) {
  const { ref, visible } = useVisible(0.12);

  return (
    <div ref={ref} className={clsx("reveal-parent", className)}>
      <Tag
        style={{
          display: "block",
          transform: visible ? "translateY(0)" : "translateY(108%)",
          transition: `transform 1.1s cubic-bezier(0.76, 0, 0.24, 1) ${delay}ms`,
        }}
      >
        {children}
      </Tag>
    </div>
  );
}

// ─── FadeUp — simple one-liner for quick fade-up use ──────────────────────────

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

export function FadeUp({ children, className, delay = 0, as: Tag = "div" }: FadeUpProps) {
  const { ref, visible } = useVisible(0.1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const El = Tag as any;

  return (
    <El
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(48px)",
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
      }}
    >
      {children}
    </El>
  );
}
