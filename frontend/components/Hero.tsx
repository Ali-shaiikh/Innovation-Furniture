"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteSetting } from "@/types";
import { getStrapiImageUrl } from "@/lib/strapi";

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
    ? getStrapiImageUrl(settings.hero_image.url)
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
      el.style.transform = `translateY(${y * 0.18}px)`;
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
      {/* Extend 15% beyond container on all sides so parallax never exposes edges */}
      <div
        className="hero-bg absolute will-change-transform"
        style={{ inset: "-15%" }}
      >
        {/* CSS atmospheric sits underneath as base layer */}
        <div className="absolute inset-0 hero-atmospheric noise-overlay" />

        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={settings?.hero_image?.alternativeText ?? "Innovation Designer Furniture — luxury interior"}
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

          {/* Main Heading */}
          <h1
            className="font-serif opacity-0 animate-fade-in-up"
            style={{
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#F5EFE4",
              animationDelay: "200ms",
              animationFillMode: "forwards",
            }}
          >
            {settings?.hero_title ?? (
              <>
                Luxury Living
                <em
                  className="block"
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "#C9A96E",
                    marginTop: "0.05em",
                  }}
                >
                  Without the Luxury Price
                </em>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p
            className="font-sans mt-6 mb-10 opacity-0 animate-fade-in-up"
            style={{
              fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
              color: "rgba(245,239,228,0.65)",
              fontWeight: 300,
              lineHeight: 1.8,
              maxWidth: "460px",
              animationDelay: "500ms",
              animationFillMode: "forwards",
            }}
          >
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap items-center gap-4 opacity-0 animate-fade-in-up"
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
                      fontSize: "1.6rem",
                      fontWeight: 400,
                      color: "#C9A96E",
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </span>
                  <span
                    className="font-sans mt-1"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(245,239,228,0.45)",
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
