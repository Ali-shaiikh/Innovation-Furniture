import type { Metadata } from "next";
import Link from "next/link";
import NavbarServer from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Luxury Furniture Store in Pune | Innovation Designer Furniture",
  description:
    "Shop premium designer furniture delivered across Pune. Innovation Designer Furniture offers luxury sofas, dining tables, beds & accent chairs — inspired by world-class makers, priced for Indian homes.",
  keywords: [
    "furniture store Pune",
    "luxury furniture Pune",
    "designer furniture Pune",
    "best furniture company Pune",
    "premium sofa Pune",
    "designer sofa Pune",
    "furniture shop Pune",
    "home furniture Pune",
    "luxury sofa Pune",
    "designer dining table Pune",
  ],
  openGraph: {
    title: "Luxury Furniture Store in Pune | Innovation Designer Furniture",
    description:
      "Premium designer furniture delivered across Pune. Luxury sofas, dining tables & accent chairs at prices that make sense.",
    url: "https://innovationfurniture.in/furniture-store-pune",
  },
  alternates: {
    canonical: "https://innovationfurniture.in/furniture-store-pune",
  },
};

const FAQ_ITEMS = [
  {
    q: "Do you deliver furniture across Pune?",
    a: "Yes — we deliver across all of Pune including Koregaon Park, Aundh, Baner, Viman Nagar, Kothrud, Hadapsar, Hinjewadi, and surrounding areas. Most orders are delivered and installed within 4–6 weeks of order confirmation.",
  },
  {
    q: "What luxury furniture options are available for Pune homes?",
    a: "Our Pune customers love our designer sofas, walnut dining sets, velvet accent chairs, and premium beds. Every piece is inspired by international design studios but priced honestly for Indian homes.",
  },
  {
    q: "How can I order furniture from Innovation Designer Furniture in Pune?",
    a: "Browse our collection at innovationfurniture.in, then reach out via WhatsApp or our contact form. We'll guide you through fabric selection, customisation options, and delivery scheduling — all from the comfort of your Pune home.",
  },
  {
    q: "Is custom furniture available for Pune homes?",
    a: "Yes. We offer customisation on fabric, colour, dimensions, and finishes. Our design team will help you find the right configuration — whether you have a compact flat in Baner or a villa in Koregaon Park.",
  },
  {
    q: "What is the delivery timeline for furniture orders in Pune?",
    a: "Standard delivery and installation in Pune takes 4–6 weeks from order confirmation. We keep you updated throughout and schedule the final delivery at your convenience.",
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
    title: "Delivered Across Pune",
    body: "We ship to every Pune neighbourhood — Koregaon Park to Kothrud, Baner to Hadapsar — with white-glove installation included.",
  },
  {
    title: "No Showroom Markup",
    body: "By skipping the showroom, we pass those savings directly to you — luxury quality at honest prices, right to your Pune home.",
  },
  {
    title: "Crafted to Your Spec",
    body: "Every piece is made to order. Choose your fabric, finish, and size — so the furniture fits both your Pune home and your lifestyle.",
  },
];

export default async function PunePage() {
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
          Serving Pune &amp; Surrounding Areas
        </p>
        <h1
          className="font-serif font-light text-[#F5EFE4] mx-auto leading-tight mb-6"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", maxWidth: "760px" }}
        >
          Premium Designer Furniture Delivered to Pune
        </h1>
        <p
          className="font-sans font-light text-[rgba(245,239,228,0.6)] mx-auto mb-10"
          style={{ fontSize: "1rem", maxWidth: "560px", lineHeight: 1.75 }}
        >
          World-class design, at your doorstep. Innovation Designer Furniture
          brings globally-inspired pieces to Pune homes — crafted to order,
          without the import price tag.
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
                Our Pune Collection
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

      {/* ── Why IDF in Pune ───────────────────────────────────────────────── */}
      <section
        className="section-pad"
        style={{
          background:
            "linear-gradient(160deg, #1A1410 0%, #2A1F16 50%, #1A1410 100%)",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Why Pune Chooses Us</p>
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
              Furniture Delivery in Pune — FAQs
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
          Let&apos;s Find the Perfect Piece for Your Pune Home
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
            href="https://wa.me/919892410488?text=Hi%2C%20I%27m%20looking%20for%20furniture%20for%20my%20Pune%20home."
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
