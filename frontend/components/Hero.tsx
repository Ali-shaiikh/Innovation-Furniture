"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteSetting } from "@/types";
import { getSanityImageUrl } from "@/lib/sanity";

// ─── Arrow Icon ────────────────────────────────────────────────────────────────

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ─── Scroll Indicator ──────────────────────────────────────────────────────────

function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2 opacity-50">
      <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#C9A96E]">
        Scroll
      </span>
      <div className="w-px h-10 bg-[#C9A96E] relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-full bg-[#C9A96E] opacity-60"
          style={{
            animation: "scrollLine 2s ease-in-out infinite",
          }}
        />
      </div>
      <style>{`
        @keyframes scrollLine {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </div>
  );
}

// ─── Hero Props ────────────────────────────────────────────────────────────────

interface HeroProps {
  settings: SiteSetting | null;
}

const DEFAULT_SUBTITLE =
  "Designer-inspired sofas, dining tables and statement furniture crafted for modern Indian homes.";

// ─── Hero Component ────────────────────────────────────────────────────────────

export default function Hero({ settings }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImageUrl = settings?.hero_image
    ? getSanityImageUrl(settings.hero_image)
    : null;
  const subtitle = settings?.hero_subtitle ?? DEFAULT_SUBTITLE;

  // Fallback to /hero-bg.jpg when no CMS image is set
  const [localImgFailed, setLocalImgFailed] = useState(false);

  // Subtle parallax on scroll
  useEffect(() => {
    const el = containerRef.current?.querySelector(".hero-bg") as HTMLElement;
    if (!el) return;

    const onScroll = () => {
      const y = window.scrollY;
      el.style.transform = `translateY(${y * 0.08}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background ──────────────────────────────────────────────────────── */}
      {/* Extend 5% beyond container — just enough to hide parallax travel */}
      <div
        className="hero-bg absolute will-change-transform"
        style={{ inset: "-5%" }}
      >
        {/* CSS atmospheric sits underneath as base layer */}
        <div className="absolute inset-0 hero-atmospheric noise-overlay" />

        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={settings?.hero_image?.alt ?? "Innovation Designer Furniture — luxury interior"}
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : !localImgFailed ? (
          /* Local fallback — /public/hero-bg.jpg */
          <Image
            src="/hero-bg.jpg"
            alt="Luxury furniture interior"
            fill
            priority
            quality={92}
            className="object-cover object-center"
            sizes="100vw"
            onError={() => setLocalImgFailed(true)}
          />
        ) : null}
      </div>

      {/* ── Dark Overlay ─────────────────────────────────────────────────────── */}
      <div className="hero-overlay absolute inset-0" />

      {/* ── Right side ambient glow ──────────────────────────────────────────── */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, rgba(201,169,110,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Corner ornament (bottom-right) ──── */}
      <div className="absolute bottom-8 right-8 lg:right-12 w-12 h-12 pointer-events-none opacity-30">
        <div className="absolute bottom-0 right-0 w-full h-px bg-[#C9A96E]" />
        <div className="absolute bottom-0 right-0 w-px h-full bg-[#C9A96E]" />
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 lg:px-12 pt-20">
        <div className="max-w-[680px]">

          {/* Eyebrow */}
          <p
            className="opacity-0 animate-fade-in-up"
            style={{
              fontFamily: "var(--font-jost, sans-serif)",
              fontSize: "0.68rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#C9A96E",
              marginBottom: "1.2rem",
              animationDelay: "100ms",
              animationFillMode: "forwards",
            }}
          >
            Innovation Designer Furniture
          </p>

          {/* Main Heading */}
          <h1
            className="font-serif opacity-0 animate-fade-in-up"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "0.01em",
              color: "#E8DDD0",
              animationDelay: "200ms",
              animationFillMode: "forwards",
            }}
          >
            {settings?.hero_title ?? (
              <>
                Luxury Living
                <span
                  className="block"
                  style={{
                    fontWeight: 300,
                    color: "#C9B99A",
                    fontSize: "clamp(1.4rem, 2.8vw, 2.6rem)",
                    marginTop: "0.18em",
                    letterSpacing: "0.02em",
                  }}
                >
                  Without the Luxury Price
                </span>
              </>
            )}
          </h1>

          {/* Gold rule */}
          <div
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: "420ms", animationFillMode: "forwards" }}
          >
            <div style={{ width: "2.5rem", height: "1px", background: "#C9A96E", opacity: 0.6, margin: "1.4rem 0" }} />
          </div>

          {/* Subtitle */}
          <p
            className="font-sans opacity-0 animate-fade-in-up"
            style={{
              fontSize: "clamp(0.82rem, 1.2vw, 0.92rem)",
              color: "rgba(210,196,178,0.72)",
              fontWeight: 300,
              lineHeight: 1.9,
              maxWidth: "400px",
              letterSpacing: "0.02em",
              animationDelay: "500ms",
              animationFillMode: "forwards",
              marginBottom: "2.2rem",
            }}
          >
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap items-center gap-3 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "650ms", animationFillMode: "forwards" }}
          >
            <Link href="#categories" className="btn-primary">
              <span>Explore Collection</span>
              <ArrowRight />
            </Link>
            <Link href="/category/sofas" className="btn-outline">
              <span>Browse Sofas</span>
            </Link>
          </div>

          {/* Trust indicators — only rendered when hero_stats are set in Strapi */}
          {settings?.hero_stats && settings.hero_stats.length > 0 && (
            <div
              className="mt-14 flex items-center gap-8 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
            >
              {settings.hero_stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span
                    className="font-serif"
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 300,
                      color: "#C9A96E",
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </span>
                  <span
                    className="font-sans mt-1"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(210,196,178,0.5)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll Indicator ─────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "1000ms", animationFillMode: "forwards" }}
      >
        <ScrollIndicator />
      </div>

      {/* ── Bottom gradient fade ──────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--warm-white) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
