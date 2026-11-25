"use client";

import { useEffect, useRef, useState } from "react";
import type { Reel } from "@/lib/instagram";

const PROFILE_URL = "https://www.instagram.com/innovationfurniture.in/";

export default function InstagramReels({ reels }: { reels: Reel[] }) {
  const [open, setOpen] = useState<Reel | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (reels.length === 0) return null;

  return (
    <section className="section-pad bg-[#1A1410]" aria-labelledby="reels-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <p className="eyebrow mb-3">Straight from the workshop</p>
            <h2 id="reels-heading" className="font-serif text-[2rem] lg:text-[2.8rem] font-light text-[#F5EFE4] leading-tight">
              Made in Mumbai, filmed on our floor
            </h2>
          </div>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#C9A96E] hover:text-[#F5EFE4] transition-colors duration-300 whitespace-nowrap"
          >
            @innovationfurniture.in &rarr;
          </a>
        </div>

        <div className="-mx-6 px-6 lg:mx-0 lg:px-0 flex lg:grid lg:grid-cols-4 gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-2 [scrollbar-width:none]">
          {reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} onOpen={() => setOpen(reel)} />
          ))}
        </div>
      </div>

      {open && <ReelModal reel={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

function ReelCard({ reel, onOpen }: { reel: Reel; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        const v = videoRef.current;
        if (v) { v.pause(); v.currentTime = 0; }
      }}
      className="group relative shrink-0 w-[62vw] sm:w-[40vw] lg:w-auto aspect-[9/16] snap-start overflow-hidden border border-[rgba(201,169,110,0.12)] hover:border-[rgba(201,169,110,0.45)] transition-colors duration-500 text-left"
      aria-label={`Play reel: ${reel.caption || "Instagram reel"}`}
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.thumbnailUrl}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-transparent to-transparent opacity-90" />
      <span className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center border border-[rgba(245,239,228,0.5)] text-[#F5EFE4] group-hover:opacity-0 transition-opacity duration-300">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3" /></svg>
      </span>
      {reel.caption && (
        <p className="absolute bottom-0 inset-x-0 p-4 font-serif text-[1.05rem] lg:text-[1.15rem] leading-snug text-[#F5EFE4] font-light">
          {reel.caption}
        </p>
      )}
    </button>
  );
}

function ReelModal({ reel, onClose }: { reel: Reel; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reel"
      className="fixed inset-0 z-[100] bg-[rgba(10,8,6,0.92)] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
        <video
          src={reel.videoUrl}
          poster={reel.thumbnailUrl}
          autoPlay
          controls
          playsInline
          className="w-full max-h-[78vh] aspect-[9/16] object-cover bg-black"
        />
        <div className="flex items-center justify-between gap-4 mt-4">
          <p className="font-sans text-sm text-[rgba(245,239,228,0.75)] font-light line-clamp-2">{reel.caption}</p>
          <a
            href={reel.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-sans text-[10px] tracking-[0.22em] uppercase text-[#C9A96E] hover:text-[#F5EFE4]"
          >
            View on Instagram
          </a>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-11 right-0 w-9 h-9 flex items-center justify-center text-[#F5EFE4] hover:text-[#C9A96E]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}
