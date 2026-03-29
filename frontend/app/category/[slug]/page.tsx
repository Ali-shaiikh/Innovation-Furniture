import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import NavbarServer from "@/components/NavbarServer";
import ProductCard from "@/components/ProductCard";
import AnimatedSection, { StaggeredChildren } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import { getCategoryBySlug, getProducts, getCategories, getStrapiImageUrl } from "@/lib/strapi";

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | Innovation Designer Furniture`,
    description:
      category.description ??
      `Browse our premium ${category.name.toLowerCase()} collection. Luxury design at accessible prices for Indian homes.`,
  };
}

// ─── Dynamic Params ────────────────────────────────────────────────────────────
// Allow slugs not returned by generateStaticParams to be rendered on-demand
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ categoryName }: { categoryName: string }) {
  return (
    <div className="py-24 text-center">
      <div className="w-16 h-px bg-[#C9A96E] mx-auto mb-8 opacity-40" />
      <h2 className="font-serif text-[1.8rem] font-light text-[#3D2B1F] mb-3">
        New Arrivals Coming Soon
      </h2>
      <p className="font-sans text-sm text-[#8B7D6E] max-w-sm mx-auto font-light">
        Our {categoryName} collection is being curated. Check back soon or explore
        other categories.
      </p>
    </div>
  );
}

// ─── Category Page ─────────────────────────────────────────────────────────────

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({ categorySlug: slug }),
  ]);

  if (!category) notFound();

  const coverImageUrl = category.image
    ? getStrapiImageUrl(category.image.url)
    : null;

  return (
    <>
      <NavbarServer />

      {/* ── Category Header ──────────────────────────────────────────────── */}
      <div className="relative min-h-[320px] lg:min-h-[420px] flex items-end overflow-hidden">
        {/* Background */}
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={category.image?.alternativeText ?? category.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(160deg, #1A1410 0%, #2A1F16 60%, #1C160F 100%)",
            }}
          />
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(17,14,11,0.3) 0%, rgba(17,14,11,0.75) 70%, rgba(17,14,11,0.9) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 lg:px-12 pb-12 pt-28">
          {/* Breadcrumb */}
          <nav className="breadcrumb mb-5">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <span className="text-[#C9A96E]">{category.name}</span>
          </nav>

          <div className="gold-line mb-5" />
          <h1 className="font-serif text-[2.5rem] lg:text-[3.5rem] font-light text-[#F5EFE4]">
            {category.name}
          </h1>
          {category.description && (
            <p className="font-sans text-sm text-[rgba(245,239,228,0.55)] mt-3 max-w-lg font-light leading-relaxed">
              {category.description}
            </p>
          )}
          <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-[#C9A96E] mt-4 opacity-70">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
      </div>

      {/* ── Products Grid ────────────────────────────────────────────────── */}
      <section className="section-pad bg-[#FAF7F2]" aria-label={`${category.name} products`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {products.length === 0 ? (
            <EmptyState categoryName={category.name} />
          ) : (
            <StaggeredChildren
              className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
              staggerMs={70}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </StaggeredChildren>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
