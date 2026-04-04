import type { Metadata } from "next";
import Link from "next/link";
import NavbarServer from "@/components/NavbarServer";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductCard from "@/components/ProductCard";
import AnimatedSection, { StaggeredChildren } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import type { WhyUsItem } from "@/types";
import {
  getSiteSettings,
  getCategories,
  getFeaturedProducts,
} from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Innovation Designer Furniture — Luxury Living, Accessible Price",
};

// ─── Why Us icon map ───────────────────────────────────────────────────────────
// Maps icon names (set in Strapi) to inline SVGs

function WhyUsIcon({ name }: { name: WhyUsItem["icon"] }) {
  const props = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "#C9A96E",
    strokeWidth: 1.2,
  };
  switch (name) {
    case "shield":
      return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "clock":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    case "heart":
      return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
    case "star":
      return <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
    case "truck":
      return <svg {...props}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    case "award":
      return <svg {...props}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>;
    default:
      return null;
  }
}

// ─── Home Page ─────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [settings, categories, featuredProducts] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getFeaturedProducts(6),
  ]);

  const hasWhyUs = settings?.why_us_items && settings.why_us_items.length > 0;
  const hasCta   = Boolean(settings?.cta_title);

  return (
    <>
      <NavbarServer />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Hero settings={settings} />

      {/* ── Featured Categories ───────────────────────────────────────────── */}
      <div id="categories">
        <FeaturedCategories categories={categories} />
      </div>

      {/* ── Rating Strip ──────────────────────────────────────────────────– */}
      <div className="bg-[#1A1410] border-b border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#C9A96E" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <div className="hidden sm:block w-px h-5 bg-[rgba(201,169,110,0.2)]" />
          <p className="font-sans text-[13px] text-[rgba(245,239,228,0.6)] text-center">
            <span className="text-[#C9A96E] font-medium">4.8 / 5</span>
            {" "}·{" "}
            Based on <span className="text-[rgba(245,239,228,0.85)]">120+ happy customers</span> across India
          </p>
        </div>
      </div>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="section-pad bg-[#FAF7F2]" aria-labelledby="products-heading">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

            <AnimatedSection className="mb-12 lg:mb-16">
              {/* Header row: spacer | FEATURED COLLECTION | VIEW ALL */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex-1" />
                <h2
                  id="products-heading"
                  className="font-sans text-[0.78rem] lg:text-[0.88rem] font-[500] tracking-[0.38em] text-[#3D2B1F] uppercase text-center"
                >
                  Featured Collection
                </h2>
                <div className="flex-1 flex justify-end">
                  <Link
                    href="/category/sofas"
                    className="hidden sm:inline-block font-sans text-[10px] lg:text-[11px] tracking-[0.22em] uppercase text-[#9C7B4A] hover:text-[#C9A96E] transition-colors duration-300 whitespace-nowrap"
                  >
                    View All
                  </Link>
                </div>
              </div>
              {/* Gold underline */}
              <div className="flex justify-center">
                <div className="h-px w-14 bg-[#C9A96E] opacity-65" />
              </div>
            </AnimatedSection>

            <StaggeredChildren
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
              staggerMs={60}
              baseDelay={80}
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </StaggeredChildren>
          </div>
        </section>
      )}

      {/* ── Testimonials ──────────────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── Why Choose Us — only rendered when why_us_items are set in Strapi ── */}
      {hasWhyUs && (
        <section
          className="section-pad relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1A1410 0%, #2A1F16 50%, #1A1410 100%)" }}
          aria-labelledby="why-heading"
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 70%)" }}
          />

          <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
            <AnimatedSection className="text-center mb-14">
              <p className="eyebrow mb-3">Why Innovation</p>
              <h2
                id="why-heading"
                className="font-serif text-[2.2rem] lg:text-[3rem] font-light text-[#F5EFE4]"
              >
                The Difference You&apos;ll Feel
              </h2>
              <div className="divider-gold mt-4 max-w-xs mx-auto opacity-40" />
            </AnimatedSection>

            <StaggeredChildren
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
              staggerMs={120}
            >
              {settings!.why_us_items!.map(({ icon, title, description }) => (
                <div
                  key={title}
                  className="border border-[rgba(201,169,110,0.12)] p-8 lg:p-10 group hover:border-[rgba(201,169,110,0.3)] transition-colors duration-500"
                >
                  <div className="mb-6">
                    <WhyUsIcon name={icon} />
                  </div>
                  <div className="w-8 h-px bg-[#C9A96E] mb-5 opacity-50 group-hover:w-14 transition-all duration-500" />
                  <h3 className="font-serif text-[1.4rem] text-[#F5EFE4] font-light mb-3">
                    {title}
                  </h3>
                  <p className="font-sans text-sm text-[rgba(245,239,228,0.5)] leading-relaxed font-light">
                    {description}
                  </p>
                </div>
              ))}
            </StaggeredChildren>
          </div>
        </section>
      )}

      {/* ── CTA Banner — only rendered when cta_title is set in Strapi ─────── */}
      {hasCta && (
        <section
          className="py-20 px-6 lg:px-12 text-center"
          style={{ background: "#F5EFE4" }}
          aria-label="Call to action"
        >
          <AnimatedSection>
            <p className="eyebrow mb-4">Begin Your Story</p>
            <h2 className="font-serif text-[2.2rem] lg:text-[3.5rem] font-light text-[#3D2B1F] max-w-2xl mx-auto leading-tight mb-3">
              {settings!.cta_title}
            </h2>
            {settings?.cta_subtitle && (
              <p className="font-sans text-sm text-[#8B7D6E] mb-10 max-w-md mx-auto font-light">
                {settings.cta_subtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="btn-primary">
                <span>Book Consultation</span>
              </Link>
              <Link href="/about" className="btn-outline-dark">
                <span>Our Story</span>
              </Link>
            </div>
          </AnimatedSection>
        </section>
      )}

      <Footer />
    </>
  );
}
