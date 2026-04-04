import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { getSanityImageUrl, formatINR } from "@/lib/sanity";

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
  const imageUrl      = primaryImage ? getSanityImageUrl(primaryImage) : null;
  const imageAlt      = primaryImage?.alt ?? product.name;

  return (
    <div className="product-card group flex flex-col">
    <Link
      href={`/products/${typeof product.slug === "string" ? product.slug : product.slug.current}`}
      className="block flex-1"
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

    {/* WhatsApp quick quote */}
    <a
      href={`https://wa.me/919892410488?text=${encodeURIComponent(`Hi, I'm interested in the ${product.name}. Is this available? Also, can I get the best price?`)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:bg-[#1ebe5d] transition-colors duration-200 font-sans text-[11px] tracking-[0.12em] uppercase text-white font-medium"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.849L.073 23.927l6.235-1.635A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.658-.516-5.172-1.415l-.371-.22-3.844 1.008 1.027-3.748-.242-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
      Get Quote
    </a>
    </div>
  );
}
