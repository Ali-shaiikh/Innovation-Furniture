import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { getStrapiImageUrl, formatINR } from "@/lib/strapi";

// ─── Arrow Icon ────────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ─── ProductCard ───────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage  = product.images?.[0];
  const imageUrl      = primaryImage ? getStrapiImageUrl(primaryImage.url) : null;
  const imageAlt      = primaryImage?.alternativeText ?? product.name;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card group block"
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
      <div className="product-card-image aspect-[3/2] relative bg-[#EDE4D8]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          /* No-image state */
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="#C9A96E" strokeWidth="0.8" opacity="0.4">
              <rect x="3" y="3" width="18" height="18" rx="1"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}

        {/* Category tag */}
        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="font-sans text-[10px] tracking-[0.15em] uppercase bg-[#1A1410]/70 backdrop-blur-sm text-[#C9A96E] px-2.5 py-1">
              {product.category.name}
            </span>
          </div>
        )}

        {/* View Details overlay */}
        <div className="absolute inset-0 bg-[#1A1410]/0 group-hover:bg-[#1A1410]/40 transition-all duration-500 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-3 group-hover:translate-y-0">
            <span className="flex items-center gap-2 font-sans text-[11px] tracking-[0.18em] uppercase text-[#C9A96E] bg-[#1A1410]/90 px-4 py-2.5">
              View Details <ArrowRight />
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 lg:p-5 border border-t-0 border-[rgba(61,43,31,0.08)]">
        <h3
          className="font-serif text-[1.1rem] lg:text-[1.25rem] font-light text-[#3D2B1F] leading-snug mb-1 group-hover:text-[#9C7B4A] transition-colors duration-300"
        >
          {product.name}
        </h3>
        <p className="font-sans text-[11px] tracking-[0.12em] text-[#8B7D6E] uppercase mb-3">
          Starting price
        </p>
        <p className="font-serif text-[1.15rem] text-[#3D2B1F] font-medium">
          {formatINR(product.starting_price)}
        </p>
      </div>
    </Link>
  );
}
