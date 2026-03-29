"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// ─── Fallback nav categories (used when Strapi is offline) ─────────────────────

const FALLBACK_CATEGORIES = [
  { name: "Sofas",         slug: "sofas" },
  { name: "Chairs",        slug: "chairs" },
  { name: "Coffee Tables", slug: "coffee-tables" },
  { name: "Dining",        slug: "dining" },
];

// ─── SearchIcon ────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ─── HamburgerIcon ─────────────────────────────────────────────────────────────

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 flex flex-col justify-between cursor-pointer">
      <span
        className="block h-px bg-current transition-all duration-300 ease-out origin-left"
        style={{ transform: open ? "rotate(45deg) translateY(-1px)" : "none", width: open ? "100%" : "100%" }}
      />
      <span
        className="block h-px bg-current transition-all duration-200"
        style={{ opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "scaleX(1)" }}
      />
      <span
        className="block h-px bg-current transition-all duration-300 ease-out origin-left"
        style={{ transform: open ? "rotate(-45deg) translateY(1px)" : "none" }}
      />
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

interface NavbarProps {
  categories?: { name: string; slug: string }[];
}

export default function Navbar({ categories }: NavbarProps) {
  const pathname     = usePathname();

  // Build nav from Strapi categories; fall back to static list if offline
  const catList = categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  const NAV_LINKS = [
    { label: "Home",    href: "/" },
    ...catList.map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
    { label: "About",   href: "/about" },
    { label: "Contact", href: "/contact" },
  ];
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const isHeroPage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Focus search input
  useEffect(() => {
    if (searching) searchRef.current?.focus();
  }, [searching]);

  const isTransparent = isHeroPage && !scrolled && !menuOpen;

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isTransparent
            ? "bg-transparent"
            : "bg-[#FAF7F2]/95 backdrop-blur-md shadow-[0_1px_0_rgba(201,169,110,0.15)]"
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-[72px] lg:h-[80px]">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 z-10">
              <Image
                src="/logo.png"
                alt="Innovation Designer Furniture"
                width={80}
                height={80}
                priority
                className={clsx(
                  "transition-all duration-500 h-[52px] lg:h-[60px] w-auto",
                  isTransparent
                    ? "drop-shadow-[0_0_12px_rgba(201,169,110,0.4)]"
                    : "opacity-95"
                )}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "nav-link font-sans text-[13px] font-[400] tracking-[0.1em]",
                      "transition-colors duration-300",
                      isActive && "active",
                      isTransparent
                        ? "text-[rgba(245,239,228,0.85)] hover:text-[#C9A96E]"
                        : "text-[#3D2B1F] hover:text-[#C9A96E]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              {/* Search toggle */}
              <button
                onClick={() => setSearching(!searching)}
                aria-label="Search"
                className={clsx(
                  "hidden lg:flex items-center justify-center w-9 h-9 transition-colors duration-300",
                  isTransparent
                    ? "text-[rgba(245,239,228,0.75)] hover:text-[#C9A96E]"
                    : "text-[#3D2B1F] hover:text-[#C9A96E]"
                )}
              >
                <SearchIcon />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                className={clsx(
                  "flex lg:hidden items-center justify-center w-9 h-9 transition-colors duration-300",
                  isTransparent || menuOpen
                    ? "text-[#C9A96E]"
                    : "text-[#3D2B1F]"
                )}
              >
                <HamburgerIcon open={menuOpen} />
              </button>
            </div>
          </div>

          {/* Desktop search bar */}
          {searching && (
            <div className="hidden lg:block border-t border-[rgba(201,169,110,0.2)] py-3">
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-transparent font-sans text-sm text-[#3D2B1F] placeholder-[#8B7D6E] outline-none py-1 pr-8"
                  onKeyDown={(e) => e.key === "Escape" && setSearching(false)}
                />
                <button
                  onClick={() => setSearching(false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8B7D6E] hover:text-[#C9A96E] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={clsx(
          "fixed inset-0 z-40 lg:hidden transition-all duration-500",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={clsx(
            "absolute inset-0 bg-[#110E0B] transition-opacity duration-500",
            menuOpen ? "opacity-80" : "opacity-0"
          )}
          onClick={() => setMenuOpen(false)}
        />

        {/* Panel */}
        <div
          className={clsx(
            "absolute top-0 right-0 h-full w-[300px] bg-[#1A1410]",
            "flex flex-col pt-[100px] pb-12 px-8",
            "transition-transform duration-500 ease-out",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Gold accent line */}
          <div className="w-8 h-px bg-[#C9A96E] mb-10 opacity-60" />

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ transitionDelay: menuOpen ? `${i * 50}ms` : "0ms" }}
                  className={clsx(
                    "font-serif text-[1.6rem] font-light py-2",
                    "transition-colors duration-300",
                    isActive ? "text-[#C9A96E]" : "text-[#F5EFE4] hover:text-[#C9A96E]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="w-full h-px bg-[#C9A96E] opacity-15 mb-6" />
            <p className="font-sans text-xs text-[#8B7D6E] tracking-[0.1em] uppercase">
              Innovation Designer Furniture
            </p>
            <p className="font-sans text-xs text-[#8B7D6E] mt-1 opacity-60">
              Luxury Living, Accessible Price
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
