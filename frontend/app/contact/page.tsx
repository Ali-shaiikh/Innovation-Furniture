import type { Metadata } from "next";
import Link from "next/link";
import NavbarServer from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import ContactForm from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Contact | Innovation Designer Furniture",
  description:
    "Get in touch with Innovation Designer Furniture. Request a quote, book a showroom visit, or ask about our collections.",
};

// ─── Contact Info ──────────────────────────────────────────────────────────────

const DEFAULT_CONTACT = {
  email:   "info@innovationfurniture.in",
  phone:   "+91 9892410488",
  cities:  "Mumbai · Delhi · Bengaluru",
  hours:   "Mon – Sat, 10am – 7pm",
};

// ─── Contact Page (Server Component) ──────────────────────────────────────────

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contactInfo = [
    {
      label: "Email",
      value: settings?.contact_email ?? DEFAULT_CONTACT.email,
      href:  `mailto:${settings?.contact_email ?? DEFAULT_CONTACT.email}`,
    },
    {
      label: "Phone",
      value: settings?.contact_phone ?? DEFAULT_CONTACT.phone,
      href:  `tel:${(settings?.contact_phone ?? DEFAULT_CONTACT.phone).replace(/\s/g, "")}`,
    },
    {
      label: "Showrooms",
      value: settings?.contact_address ?? DEFAULT_CONTACT.cities,
      href:  null,
    },
    {
      label: "Hours",
      value: DEFAULT_CONTACT.hours,
      href:  null,
    },
  ];

  return (
    <>
      <NavbarServer />

      {/* ── Page Hero ────────────────────────────────────────────────────── */}
      <div
        className="relative pt-[80px] min-h-[300px] flex items-end overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1A1410 0%, #2A1F16 60%, #1A1410 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, rgba(201,169,110,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-[1440px] mx-auto w-full px-6 lg:px-12 pb-12">
          <div className="gold-line mb-5" />
          <p className="eyebrow mb-3">Get In Touch</p>
          <h1 className="font-serif text-[2.8rem] lg:text-[4rem] font-light text-[#F5EFE4] leading-tight">
            Let&apos;s Furnish
            <br />
            <em className="text-[#C9A96E]">your dream home</em>
          </h1>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <section className="section-pad bg-[#FAF7F2]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Contact Info sidebar */}
            <AnimatedSection className="lg:col-span-2 space-y-8">
              <div>
                <p className="eyebrow mb-3">Contact Information</p>
                <h2 className="font-serif text-[1.8rem] font-light text-[#3D2B1F] mb-4">
                  We&apos;d love to hear from you
                </h2>
                <p className="font-sans text-sm text-[#8B7D6E] font-light leading-relaxed">
                  Whether you have a question about a specific product, need help with
                  dimensions, or want to book a showroom visit — our team is here.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map(({ label, value, href }) => (
                  <div key={label}>
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#C9A96E] mb-1">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="font-sans text-sm text-[#3D2B1F] font-light hover:text-[#C9A96E] transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-sans text-sm text-[#3D2B1F] font-light">{value}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-[rgba(201,169,110,0.15)]">
                <p className="font-sans text-xs text-[#8B7D6E] font-light leading-relaxed">
                  We typically respond within 4 hours during business hours. For urgent
                  queries, please call us directly.
                </p>
              </div>
            </AnimatedSection>

            {/* Contact Form (Client Component) */}
            <AnimatedSection delay={150} className="lg:col-span-3">
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
