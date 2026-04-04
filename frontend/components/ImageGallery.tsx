"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { SanityImage } from "@/types";
import { getSanityImageUrl } from "@/lib/sanity";
import clsx from "clsx";

interface ImageGalleryProps {
  images: SanityImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  // Close lightbox on ESC, navigate with arrow keys
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, prev, next]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  if (!images.length) {
    return (
      <div className="aspect-[4/3] bg-[#F0E9DF] flex items-center justify-center">
        <p className="font-sans text-[#8B7D6E] text-sm tracking-wide">No images available</p>
      </div>
    );
  }

  const activeImage = images[activeIndex];
  const imageUrl    = getSanityImageUrl(activeImage);

  const blockContextMenu = (e: React.MouseEvent) => e.preventDefault();

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative aspect-[4/3] overflow-hidden bg-[#F0E9DF] group cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
          onContextMenu={blockContextMenu}
        >
          <Image
            key={imageUrl}
            src={imageUrl}
            alt={activeImage.alt ?? `${productName} — view ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-opacity duration-500 select-none"
            draggable={false}
          />
          {/* Transparent overlay blocks right-click save on the image element */}
          <div className="absolute inset-0 z-10" onContextMenu={blockContextMenu} />

          {/* Expand hint */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-[#1A1410]/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5EFE4" strokeWidth="1.5">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1A1410]/60 backdrop-blur-sm flex items-center justify-center text-[#F5EFE4] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C9A96E] hover:text-[#1A1410]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1A1410]/60 backdrop-blur-sm flex items-center justify-center text-[#F5EFE4] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C9A96E] hover:text-[#1A1410]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              <div className="absolute bottom-4 right-4 font-sans text-[11px] tracking-[0.1em] text-[#F5EFE4] bg-[#1A1410]/60 backdrop-blur-sm px-2.5 py-1">
                {activeIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((img, i) => {
              const thumbUrl = getSanityImageUrl(img);
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  className={clsx(
                    "relative aspect-square overflow-hidden transition-all duration-300",
                    i === activeIndex
                      ? "ring-2 ring-[#C9A96E] ring-offset-1"
                      : "opacity-55 hover:opacity-100"
                  )}
                >
                  <Image
                    src={thumbUrl}
                    alt={img.alt ?? `${productName} thumbnail ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D0A08]/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-[#F5EFE4] hover:text-[#C9A96E] transition-colors z-10"
            aria-label="Close"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] mx-6"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={blockContextMenu}
          >
            <Image
              src={imageUrl}
              alt={activeImage.alt ?? productName}
              fill
              className="object-contain select-none"
              sizes="100vw"
              priority
              draggable={false}
            />
            <div className="absolute inset-0 z-10" onContextMenu={blockContextMenu} />
          </div>

          {/* Prev / Next in lightbox */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-[#F5EFE4] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-[#F5EFE4] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Counter */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-sans text-[11px] tracking-[0.15em] text-[rgba(245,239,228,0.5)]">
                {activeIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
