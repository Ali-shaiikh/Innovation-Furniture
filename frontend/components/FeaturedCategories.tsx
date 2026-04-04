import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";
import { getSanityImageUrl } from "@/lib/sanity";
import AnimatedSection, { StaggeredChildren } from "./AnimatedSection";

// ─── Category Card ─────────────────────────────────────────────────────────────

// Slug → local filename overrides (for when filename ≠ slug)
const LOCAL_IMAGE_MAP: Record<string, string> = {
  "coffee-tables": "coffee-table",
};

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const slug = typeof category.slug === "string" ? category.slug : category.slug.current;
  const localFile = LOCAL_IMAGE_MAP[slug] ?? slug;
  // Sanity image takes priority; fall back to /category/{slug}.png if present
  const imageUrl = category.image
    ? getSanityImageUrl(category.image)
    : `/category/${localFile}.png`;
  const imageAlt = category.image?.alt ?? category.name;

  return (
    <Link
      href={`/category/${slug}`}
      className="group relative block overflow-hidden aspect-[3/4]"
      aria-label={`Browse ${category.name}`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#2A1F16]" />
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(180deg, rgba(17,14,11,0.05) 0%, rgba(17,14,11,0.65) 70%, rgba(17,14,11,0.85) 100%)",
        }}
      />

      {/* Hover shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle at 50% 80%, rgba(201,169,110,0.08) 0%, transparent 70%)" }}
      />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7">
        {/* Gold line */}
        <div className="w-8 h-px bg-[#C9A96E] mb-3 transition-all duration-500 group-hover:w-14" />

        <h3
          className="font-serif text-[1.5rem] lg:text-[1.75rem] font-light text-[#F5EFE4] leading-tight mb-1"
        >
          {category.name}
        </h3>

        {category.description && (
          <p className="font-sans text-[12px] text-[rgba(245,239,228,0.55)] tracking-wide line-clamp-2 mb-4">
            {category.description}
          </p>
        )}

        <span className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.18em] uppercase text-[#C9A96E] opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0">
          Explore
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>

      {/* Corner ornament */}
      <div className="absolute top-4 right-4 w-6 h-6 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-full h-px bg-[#C9A96E]" />
        <div className="absolute top-0 right-0 w-px h-full bg-[#C9A96E]" />
      </div>
    </Link>
  );
}

// ─── FeaturedCategories ────────────────────────────────────────────────────────

interface FeaturedCategoriesProps {
  categories: Category[];
}

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  if (!categories.length) return null;

  return (
    <section className="section-pad bg-[#FAF7F2]" aria-labelledby="categories-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Section Header */}
        <AnimatedSection className="mb-12 lg:mb-16">
          <p className="eyebrow mb-3">Our Collections</p>
          <div className="flex items-end justify-between gap-4">
            <h2
              id="categories-heading"
              className="font-serif text-[2.2rem] lg:text-[3rem] font-light text-[#3D2B1F]"
            >
              Shop by Category
            </h2>
            <Link
              href="/category/sofas"
              className="hidden sm:inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.15em] uppercase text-[#9C7B4A] hover:text-[#C9A96E] transition-colors duration-300 pb-1 border-b border-[#9C7B4A] hover:border-[#C9A96E] whitespace-nowrap"
            >
              View All
            </Link>
          </div>
        </AnimatedSection>

        {/* Grid */}
        <StaggeredChildren
          className={`grid gap-3 ${
            categories.length >= 4
              ? "grid-cols-2 lg:grid-cols-4"
              : categories.length === 3
              ? "grid-cols-2 lg:grid-cols-3"
              : "grid-cols-2"
          }`}
          staggerMs={80}
        >
          {categories.map((cat, i) => (
            <CategoryCard key={cat._id} category={cat} index={i} />
          ))}
        </StaggeredChildren>
      </div>
    </section>
  );
}
