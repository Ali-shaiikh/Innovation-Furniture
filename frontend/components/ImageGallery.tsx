"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { StrapiImage } from "@/types";
import { getStrapiImageUrl } from "@/lib/strapi";
import clsx from "clsx";

interface ImageGalleryProps {
  images: StrapiImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  if (!images.length) {
    return (
      <div className="aspect-[4/3] bg-[#F0E9DF] flex items-center justify-center">
        <p className="font-sans text-[#8B7D6E] text-sm tracking-wide">No images available</p>
      </div>
    );
  }

  const activeImage = images[activeIndex];
  const imageUrl    = getStrapiImageUrl(activeImage.url);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F0E9DF] group">
        <Image
          key={imageUrl}
          src={imageUrl}
          alt={activeImage.alternativeText ?? `${productName} — view ${activeIndex + 1}`}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover transition-opacity duration-500"
        />

        {/* Navigation arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1A1410]/60 backdrop-blur-sm flex items-center justify-center text-[#F5EFE4] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C9A96E] hover:text-[#1A1410]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1A1410]/60 backdrop-blur-sm flex items-center justify-center text-[#F5EFE4] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C9A96E] hover:text-[#1A1410]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Image counter */}
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
            const thumbUrl = getStrapiImageUrl(img.formats?.thumbnail?.url ?? img.url);
            return (
              <button
                key={img.id}
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
                  alt={img.alternativeText ?? `${productName} thumbnail ${i + 1}`}
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
  );
}
