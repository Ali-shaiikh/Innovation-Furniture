import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";
import { getSanityImageUrl } from "@/lib/sanity";

// ─── CategoryStrip ─────────────────────────────────────────────────────────────
// Horizontal strip of category cards: text+arrow left, product image right.
// Matches the reference design exactly.

interface LibraryCollectionProps {
  categories: Category[];
}

export default function LibraryCollection({ categories }: LibraryCollectionProps) {
  if (!categories.length) return null;

  return (
    <section aria-label="Shop by Category">
      {/* Top hairline */}
      <div className="h-px bg-[rgba(61,43,31,0.09)]" />

      {/* Card row — 1px gap between cards acts as separator */}
      <div
        className="flex overflow-x-auto lg:overflow-visible scrollbar-hide"
        style={{ gap: "1px", background: "rgba(61,43,31,0.09)" }}
      >
        {categories.map((cat, i) => {
          const imageUrl = cat.image ? getSanityImageUrl(cat.image) : null;
          const slug = typeof cat.slug === "string" ? cat.slug : cat.slug.current;

          return (
            <Link
              key={cat._id}
              href={`/category/${slug}`}
              className="group relative flex flex-1 min-w-[180px] lg:min-w-0 overflow-hidden"
              style={{
                background: "#F5EFE4",
                minHeight: "155px",
              }}
              aria-label={`Browse ${cat.name}`}
            >
              {/* ── Left: Category label ──────────────────────────────────── */}
              <div className="flex flex-col justify-center px-5 lg:px-7 py-4 shrink-0 min-w-[120px] lg:min-w-[140px]">
                <h3
                  className="font-serif text-[1.3rem] lg:text-[1.5rem] font-light leading-tight text-[#2A1F15] group-hover:text-[#9C7B4A] transition-colors duration-300"
                >
                  {cat.name}
                </h3>
                <span
                  className="mt-2.5 text-[#C9A96E] text-[1rem] font-light inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </div>

              {/* ── Right: Product image ──────────────────────────────────── */}
              <div className="relative flex-1 overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={cat.image?.alt ?? cat.name}
                    fill
                    sizes="(max-width: 768px) 35vw, 14vw"
                    className="object-cover object-center transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                ) : (
                  /* Placeholder tone when no image */
                  <div className="absolute inset-0 bg-[#EDE4D8]" />
                )}
              </div>

              {/* Subtle gold bottom-border on hover */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-[#C9A96E] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
            </Link>
          );
        })}
      </div>

      {/* Bottom hairline */}
      <div className="h-px bg-[rgba(61,43,31,0.09)]" />
    </section>
  );
}
