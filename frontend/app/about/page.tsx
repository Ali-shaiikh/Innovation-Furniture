import type { Metadata } from "next";
import Link from "next/link";
import NavbarServer from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import AnimatedSection, { StaggeredChildren } from "@/components/AnimatedSection";
import { getSiteSettings } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "About Us | Innovation Designer Furniture",
  description:
    "The story behind Innovation Designer Furniture — luxury home furnishings made accessible for Indian families.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const hasStats  = settings?.about_stats  && settings.about_stats.length  > 0;
  const hasValues = settings?.about_values && settings.about_values.length > 0;

  return (
    <>
      <NavbarServer />

      {/* ── Page Hero ────────────────────────────────────────────────────── */}
      <div
        className="relative pt-[80px] min-h-[380px] flex items-end overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1A1410 0%, #2A1F16 60%, #1A1410 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 60%, rgba(201,169,110,0.1) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-[1440px] mx-auto w-full px-6 lg:px-12 pb-14">
          <div className="gold-line mb-5" />
          <p className="eyebrow mb-3">Our Story</p>
          <h1 className="font-serif text-[2.8rem] lg:text-[4rem] font-light text-[#F5EFE4] leading-tight">
            Design without
            <br />
            <em className="text-[#C9A96E]">compromise</em>
          </h1>
        </div>
      </div>

      {/* ── Mission — only rendered when about_mission is set in Strapi ──── */}
      {(settings?.about_mission || hasStats) && (
        <section className="section-pad bg-[#FAF7F2]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className={`grid grid-cols-1 gap-12 lg:gap-20 items-center ${hasStats ? "lg:grid-cols-2" : ""}`}>

              {settings?.about_mission && (
                <AnimatedSection>
                  <p className="eyebrow mb-4">Who We Are</p>
                  <h2 className="font-serif text-[2rem] lg:text-[2.8rem] font-light text-[#3D2B1F] mb-6 leading-tight">
                    Luxury furniture,
                    <br />
                    real Indian prices
                  </h2>
                  <div className="font-sans text-[15px] text-[#3D2B1F] font-light leading-relaxed whitespace-pre-line">
                    {settings.about_mission}
                  </div>
                </AnimatedSection>
              )}

              {/* Stats grid — only rendered when about_stats are set in Strapi */}
              {hasStats && (
                <AnimatedSection delay={150} className="grid grid-cols-2 gap-4">
                  {settings!.about_stats!.map(({ value, label }) => (
                    <div
                      key={label}
                      className="bg-white border border-[rgba(61,43,31,0.07)] p-6 lg:p-8"
                    >
                      <p className="font-serif text-[2rem] lg:text-[2.5rem] text-[#C9A96E] font-light">
                        {value}
                      </p>
                      <p className="font-sans text-[11px] tracking-[0.12em] uppercase text-[#8B7D6E] mt-1">
                        {label}
                      </p>
                    </div>
                  ))}
                </AnimatedSection>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Values — only rendered when about_values are set in Strapi ───── */}
      {hasValues && (
        <section
          className="section-pad"
          style={{ background: "#F5EFE4" }}
          aria-labelledby="values-heading"
        >
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <AnimatedSection className="mb-12 lg:mb-16 text-center">
              <p className="eyebrow mb-3">What We Stand For</p>
              <h2
                id="values-heading"
                className="font-serif text-[2.2rem] lg:text-[3rem] font-light text-[#3D2B1F]"
              >
                Our Principles
              </h2>
            </AnimatedSection>

            <StaggeredChildren
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              staggerMs={100}
            >
              {settings!.about_values!.map(({ number, title, description }) => (
                <div
                  key={number}
                  className="bg-white p-8 lg:p-10 border border-[rgba(61,43,31,0.06)] group hover:border-[rgba(201,169,110,0.25)] transition-colors duration-400"
                >
                  <p className="font-serif text-[3rem] text-[#C9A96E] opacity-20 font-light leading-none mb-4 group-hover:opacity-35 transition-opacity duration-400">
                    {number}
                  </p>
                  <div className="w-7 h-px bg-[#C9A96E] mb-5 opacity-50" />
                  <h3 className="font-serif text-[1.4rem] text-[#3D2B1F] font-light mb-3">
                    {title}
                  </h3>
                  <p className="font-sans text-sm text-[#8B7D6E] leading-relaxed font-light">
                    {description}
                  </p>
                </div>
              ))}
            </StaggeredChildren>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="py-20 text-center px-6"
        style={{ background: "linear-gradient(160deg, #1A1410 0%, #2A1F16 50%, #1A1410 100%)" }}
      >
        <AnimatedSection>
          <p className="eyebrow mb-4">Ready to Begin?</p>
          <h2 className="font-serif text-[2rem] lg:text-[2.8rem] font-light text-[#F5EFE4] mb-3">
            Furnish your home with confidence
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link href="/category/sofas" className="btn-primary">
              <span>Shop Now</span>
            </Link>
            <Link href="/contact" className="btn-outline">
              <span>Get in Touch</span>
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </>
  );
}
