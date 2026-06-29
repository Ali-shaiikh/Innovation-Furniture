import type { Metadata } from "next";
import Link from "next/link";
import NavbarServer from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Luxury Furniture Store in Mumbai | Innovation Designer Furniture",
  description:
    "Shop premium designer furniture in Mumbai. Innovation Designer Furniture offers luxury sofas, dining tables, beds & accent chairs — inspired by world-class makers, priced for Indian homes.",
  keywords: [
    "furniture store Mumbai",
    "luxury furniture Mumbai",
    "designer furniture Mumbai",
    "best furniture company Mumbai",
    "premium sofa Mumbai",
    "designer sofa Mumbai",
    "furniture shop Mumbai",
    "home furniture Mumbai",
    "luxury sofa Mumbai",
    "designer dining table Mumbai",
  ],
  openGraph: {
    title: "Luxury Furniture Store in Mumbai | Innovation Designer Furniture",
    description:
      "Premium designer furniture delivered across Mumbai. Luxury sofas, dining tables & accent chairs at prices that make sense.",
    url: "https://innovationfurniture.in/furniture-store-mumbai",
  },
  alternates: {
    canonical: "https://innovationfurniture.in/furniture-store-mumbai",
  },
};

const FAQ_ITEMS = [
  {
    q: "Do you deliver designer furniture across Mumbai?",
    a: "Yes — we deliver across all of Mumbai including South Mumbai, Bandra, Andheri, Powai, Thane, Navi Mumbai, and the wider MMR. Delivery and white-glove installation is typically completed within 4–6 weeks of order confirmation.",
  },
  {
    q: "What is the starting price for luxury sofas in Mumbai?",
    a: "Our designer sofas start from ₹44,900. Each piece is crafted to order with your choice of fabric, finish, and size. Prices include delivery and basic installation within Mumbai.",
  },
  {
    q: "Can I customise furniture for my Mumbai home?",
    a: "Absolutely. We offer customisation on fabric, colour, dimensions, and leg finishes — so whether you have a compact flat in Andheri or a bungalow in Juhu, the piece fits perfectly.",
  },
  {
    q: "Do you have a furniture showroom in Mumbai?",
    a: "We operate on a consultation-first model, allowing us to pass on the showroom savings to you. Book a free virtual consultation or request swatches to be couriered to your Mumbai address.",
  },
  {
    q: "What types of furniture do you offer for Mumbai homes?",
    a: "Our collection covers sofas, sectionals, dining tables and chairs, beds, wardrobes, and accent chairs — all designed to balance luxury aesthetics with the practical dimensions suited to Mumbai apartments.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const WHY_ITEMS = [
  {
    title: "Pan-Mumbai Delivery",
    body: "We ship to every corner of Mumbai and the MMR — from Colaba to Virar, Thane to Navi Mumbai.",
  },
  {
    title: "No Showroom Markup",
    body: "By skipping the showroom, we pass those savings directly to you — luxury quality at honest prices.",
  },
  {
    title: "Made to Order",
    body: "Every piece is crafted on order, meaning you get exactly what you want — the right fabric, size, and finish.",
  },
];

export default async function MumbaiPage() {
  const categories = await getCategories();

  return (
    <>
      <NavbarServer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="pt-[140px] pb-20 px-6 lg:px-12 text-center"
        style={{
          background:
            "linear-gradient(160deg, #1A1410 0%, #2A1F16 50%, #1A1410 100%)",
        }}
      >
        <p
          className="font-sans mb-4"
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "#C9A96E",
          }}
        >
          Serving Mumbai &amp; MMR
        </p>
        <h1
          className="font-serif font-light text-[#F5EFE4] mx-auto leading-tight mb-6"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", maxWidth: "760px" }}
        >
          Luxury Designer Furniture in Mumbai
        </h1>
        <p
          className="font-sans font-light text-[rgba(245,239,228,0.6)] mx-auto mb-10"
          style={{ fontSize: "1rem", maxWidth: "560px", lineHeight: 1.75 }}
        >
          World-class design, delivered to your door. Innovation Designer
          Furniture brings globally-inspired pieces to Mumbai homes — without
          the international price tag.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/contact" className="btn-primary">
            <span>Book Free Consultation</span>
          </Link>
          <Link href="/#categories" className="btn-outline">
            <span>Browse Collection</span>
          </Link>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="section-pad bg-[#FAF7F2]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">Shop by Category</p>
              <h2 className="font-serif text-[2rem] lg:text-[2.6rem] font-light text-[#3D2B1F]">
                Our Mumbai Collection
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const slug =
                  typeof cat.slug === "string" ? cat.slug : cat.slug.current;
                return (
                  <Link
                    key={cat._id}
                    href={`/category/${slug}`}
                    className="group border border-[rgba(61,43,31,0.1)] p-6 text-center hover:border-[#C9A96E] transition-colors duration-300"
                  >
                    <p className="font-serif text-[1.1rem] text-[#3D2B1F] font-light group-hover:text-[#9C7B4A] transition-colors">
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p className="font-sans text-xs text-[#8B7D6E] mt-1 font-light line-clamp-1">
                        {cat.description}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Why IDF in Mumbai ─────────────────────────────────────────────── */}
      <section
        className="section-pad"
        style={{
          background:
            "linear-gradient(160deg, #1A1410 0%, #2A1F16 50%, #1A1410 100%)",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Why Mumbai Chooses Us</p>
            <h2 className="font-serif text-[2rem] lg:text-[2.6rem] font-light text-[#F5EFE4]">
              The Difference You&apos;ll Feel
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_ITEMS.map(({ title, body }) => (
              <div
                key={title}
                className="border border-[rgba(201,169,110,0.15)] p-8 hover:border-[rgba(201,169,110,0.35)] transition-colors duration-400"
              >
                <div className="w-8 h-px bg-[#C9A96E] mb-5 opacity-60" />
                <h3 className="font-serif text-[1.3rem] text-[#F5EFE4] font-light mb-3">
                  {title}
                </h3>
                <p className="font-sans text-sm text-[rgba(245,239,228,0.5)] leading-relaxed font-light">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="section-pad bg-[#FAF7F2]">
        <div className="max-w-[860px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Common Questions</p>
            <h2 className="font-serif text-[2rem] lg:text-[2.6rem] font-light text-[#3D2B1F]">
              Furniture Delivery in Mumbai — FAQs
            </h2>
          </div>
          <div className="divide-y divide-[rgba(61,43,31,0.08)]">
            {FAQ_ITEMS.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <span className="font-serif text-[1.1rem] text-[#3D2B1F] font-light leading-snug">
                    {q}
                  </span>
                  <span
                    className="text-[#C9A96E] text-xl shrink-0 transition-transform duration-300 group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="font-sans text-sm text-[#8B7D6E] leading-relaxed font-light mt-4 pr-8">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 lg:px-12 text-center"
        style={{ background: "#F5EFE4" }}
      >
        <p className="eyebrow mb-4">Ready to Transform Your Home?</p>
        <h2 className="font-serif text-[2rem] lg:text-[3rem] font-light text-[#3D2B1F] max-w-xl mx-auto leading-tight mb-3">
          Let&apos;s Find the Perfect Piece for Your Mumbai Home
        </h2>
        <p className="font-sans text-sm text-[#8B7D6E] mb-10 max-w-md mx-auto font-light">
          Book a free consultation and our team will help you choose the right
          furniture for your space, taste, and budget.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/contact" className="btn-primary">
            <span>Book Consultation</span>
          </Link>
          <a
            href="https://wa.me/919892410488?text=Hi%2C%20I%27m%20looking%20for%20furniture%20for%20my%20Mumbai%20home."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-dark"
          >
            <span>WhatsApp Us</span>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
