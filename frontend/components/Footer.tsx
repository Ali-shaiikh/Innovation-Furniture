import Link from "next/link";
import Image from "next/image";
import { getCategories, getSiteSettings } from "@/lib/strapi";

// ─── Social Icons ──────────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

// ─── Footer (async server component) ──────────────────────────────────────────

export default async function Footer() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  const hasSocial = settings?.social_instagram || settings?.social_pinterest;

  return (
    <footer className="bg-[#1A1410] text-[#F5EFE4]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* ── Brand column ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.png"
                alt="Innovation Designer Furniture"
                width={160}
                height={160}
                className="w-[120px] lg:w-[140px] h-auto"
              />
            </Link>

            {/* Social links — only rendered when URLs are set in Strapi */}
            {hasSocial && (
              <div className="flex items-center gap-4 mt-4">
                {settings?.social_instagram && (
                  <a
                    href={settings.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow on Instagram"
                    className="w-9 h-9 border border-[rgba(201,169,110,0.2)] flex items-center justify-center text-[#8B7D6E] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all duration-300"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {settings?.social_pinterest && (
                  <a
                    href={settings.social_pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow on Pinterest"
                    className="w-9 h-9 border border-[rgba(201,169,110,0.2)] flex items-center justify-center text-[#8B7D6E] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all duration-300"
                  >
                    <PinterestIcon />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* ── Collections — from Strapi categories ──────────────────────── */}
          {categories.length > 0 && (
            <div>
              <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#C9A96E] mb-5">
                Collections
              </h4>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="font-sans text-sm text-[rgba(245,239,228,0.55)] hover:text-[#C9A96E] transition-colors duration-300 font-light"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Company + Contact ─────────────────────────────────────────── */}
          <div>
            <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#C9A96E] mb-5">
              Company
            </h4>
            <ul className="space-y-3 mb-8">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact",  href: "/contact" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans text-sm text-[rgba(245,239,228,0.55)] hover:text-[#C9A96E] transition-colors duration-300 font-light"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact — only rendered when set in Strapi */}
            {(settings?.contact_email || settings?.contact_phone || settings?.contact_address) && (
              <>
                <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#C9A96E] mb-4">
                  Contact
                </h4>
                <address className="not-italic font-sans text-sm text-[rgba(245,239,228,0.45)] space-y-1.5 font-light">
                  {settings?.contact_email && (
                    <p>
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="hover:text-[#C9A96E] transition-colors"
                      >
                        {settings.contact_email}
                      </a>
                    </p>
                  )}
                  {settings?.contact_phone && (
                    <p>
                      <a
                        href={`tel:${settings.contact_phone.replace(/\s/g, "")}`}
                        className="hover:text-[#C9A96E] transition-colors"
                      >
                        {settings.contact_phone}
                      </a>
                    </p>
                  )}
                  {settings?.contact_address && <p>{settings.contact_address}</p>}
                </address>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[11px] text-[rgba(245,239,228,0.28)] tracking-wide">
            &copy; {new Date().getFullYear()} Innovation Designer Furniture. All rights reserved.
          </p>
          <p className="font-sans text-[11px] text-[rgba(245,239,228,0.2)] tracking-wide">
            Crafted with care for Indian homes
          </p>
        </div>
      </div>
    </footer>
  );
}
