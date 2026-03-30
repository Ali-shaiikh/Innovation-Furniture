import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import NavbarServer from "@/components/NavbarServer";
import ImageGallery from "@/components/ImageGallery";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import {
  getProductBySlug,
  getProducts,
  formatINR,
} from "@/lib/strapi";

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Innovation Designer Furniture`,
    description:
      product.description ??
      `${product.name} — premium designer furniture starting at ${formatINR(product.starting_price)}`,
  };
}

// ─── Dynamic Params ────────────────────────────────────────────────────────────
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

// ─── Detail Row ────────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-4 border-b border-[rgba(61,43,31,0.07)]">
      <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-[#8B7D6E] w-28 shrink-0 pt-0.5">
        {label}
      </dt>
      <dd className="font-sans text-sm text-[#3D2B1F] font-light leading-relaxed">
        {value}
      </dd>
    </div>
  );
}

// ─── Product Page ──────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Related products from same category
  const relatedProducts = product.category
    ? (await getProducts({ categorySlug: product.category.slug, limit: 4 }))
        .filter((p) => p.id !== product.id)
        .slice(0, 3)
    : [];

  return (
    <>
      <NavbarServer />

      <div className="pt-[80px]">
        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
          <nav className="breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            {product.category && (
              <>
                <a href={`/category/${product.category.slug}`}>
                  {product.category.name}
                </a>
                <span className="breadcrumb-sep">/</span>
              </>
            )}
            <span className="text-[#3D2B1F] truncate max-w-[180px]">{product.name}</span>
          </nav>
        </div>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">

            {/* Left: Gallery */}
            <div className="lg:sticky lg:top-[100px]">
              <ImageGallery images={product.images ?? []} productName={product.name} />
            </div>

            {/* Right: Info */}
            <div>
              {/* Category tag */}
              {product.category && (
                <Link
                  href={`/category/${product.category.slug}`}
                  className="inline-block font-sans text-[11px] tracking-[0.18em] uppercase text-[#C9A96E] mb-4 hover:text-[#9C7B4A] transition-colors"
                >
                  {product.category.name}
                </Link>
              )}

              {/* Name */}
              <h1 className="font-serif text-[2.2rem] lg:text-[2.8rem] font-light text-[#3D2B1F] leading-tight mb-3">
                {product.name}
              </h1>

              {/* Gold divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px bg-[#C9A96E] opacity-60" />
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8B7D6E] mb-1">
                  Starting Price
                </p>
                <p className="font-serif text-[2rem] text-[#3D2B1F]">
                  {formatINR(product.starting_price)}
                </p>
                <p className="font-sans text-xs text-[#8B7D6E] mt-1 font-light">
                  Final price varies by configuration and material choice
                </p>
              </div>

              {/* CTA */}
              {(() => {
                const waMsg = encodeURIComponent(
                  `Hi, I'm interested in the ${product.name}. Is this available? Also, can I get the best price?`
                );
                const waUrl = `https://wa.me/918169566689?text=${waMsg}`;
                return (
                  <div className="flex flex-wrap gap-3 mb-10">
                    <a href={waUrl} target="_blank" rel="noopener noreferrer"
                      className="btn-primary flex-1 justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.849L.073 23.927l6.235-1.635A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.658-.516-5.172-1.415l-.371-.22-3.844 1.008 1.027-3.748-.242-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                      <span>Get Quote on WhatsApp</span>
                    </a>
                  </div>
                );
              })()}

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h2 className="font-sans text-[11px] tracking-[0.18em] uppercase text-[#8B7D6E] mb-3">
                    Description
                  </h2>
                  <p className="font-sans text-sm text-[#3D2B1F] leading-relaxed font-light whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Details */}
              {(product.materials || product.dimensions) && (
                <div className="mb-8">
                  <h2 className="font-sans text-[11px] tracking-[0.18em] uppercase text-[#8B7D6E] mb-1">
                    Specifications
                  </h2>
                  <dl>
                    {product.materials && (
                      <DetailRow label="Materials" value={product.materials} />
                    )}
                    {product.dimensions && (
                      <DetailRow label="Dimensions" value={product.dimensions} />
                    )}
                  </dl>
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[rgba(61,43,31,0.07)]">
                {[
                  { label: "Free Shipping", sub: "Pan India" },
                  { label: "5 Year Warranty", sub: "Craftsmanship" },
                  { label: "Easy Returns", sub: "30-day policy" },
                ].map(({ label, sub }) => (
                  <div key={label} className="text-center py-3 px-2 bg-[#F5EFE4]">
                    <p className="font-serif text-[0.85rem] text-[#3D2B1F] font-light leading-tight">
                      {label}
                    </p>
                    <p className="font-sans text-[10px] text-[#8B7D6E] mt-0.5 tracking-wide">
                      {sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Products ─────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section
            className="section-pad bg-[#F5EFE4]"
            aria-label="Related products"
          >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
              <AnimatedSection className="mb-10">
                <p className="eyebrow mb-2">You May Also Like</p>
                <h2 className="font-serif text-[2rem] lg:text-[2.5rem] font-light text-[#3D2B1F]">
                  From the Same Collection
                </h2>
              </AnimatedSection>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </>
  );
}
