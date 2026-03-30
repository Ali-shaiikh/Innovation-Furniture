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
  { name: "Bed",           slug: "bed" },
  { name: "Dining",        slug: "dining" },
  { name: "Coffee Tables", slug: "coffee-tables" },
  { name: "TV Units",      slug: "tv-units" },
];

// ─── SearchIcon ────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ─── HamburgerIcon ─────────────────────────────────────────────────────────────

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 flex flex-col justify-between cursor-pointer">
      <span className="block h-px bg-current transition-all duration-300 ease-out origin-left"
        style={{ transform: open ? "rotate(45deg) translateY(-1px)" : "none" }} />
      <span className="block h-px bg-current transition-all duration-200"
        style={{ opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "scaleX(1)" }} />
      <span className="block h-px bg-current transition-all duration-300 ease-out origin-left"
        style={{ transform: open ? "rotate(-45deg) translateY(1px)" : "none" }} />
    </div>
  );
}

// ─── ChevronDown ───────────────────────────────────────────────────────────────

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      className="transition-transform duration-300"
      style={{ transform: open ? "rotate(180deg)" : "none" }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

interface NavbarProps {
  categories?: { name: string; slug: string }[];
}

export default function Navbar({ categories }: NavbarProps) {
  const pathname = usePathname();
  const catList  = categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [searching,    setSearching]    = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const searchRef    = useRef<HTMLInputElement>(null);
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const subBarRef    = useRef<HTMLDivElement>(null);
  const closeTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHeroPage    = pathname === "/";
  const isTransparent = isHeroPage && !scrolled && !menuOpen;
  const isProductsActive = pathname.startsWith("/category") || pathname.startsWith("/products");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setProductsOpen(false); }, [pathname]);

  useEffect(() => {
    if (searching) searchRef.current?.focus();
  }, [searching]);

  // Close dropdown on outside click — must exclude the sub-bar itself
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const inDropdown = dropdownRef.current?.contains(e.target as Node);
      const inSubBar   = subBarRef.current?.contains(e.target as Node);
      if (!inDropdown && !inSubBar) setProductsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const BASE_LINKS = [
    { label: "Home",    href: "/" },
    { label: "About",   href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isTransparent
            ? "bg-transparent"
            : productsOpen
              ? "bg-[#FAF7F2]/98 backdrop-blur-md"
              : "bg-[#FAF7F2]/95 backdrop-blur-md shadow-[0_1px_0_rgba(201,169,110,0.15)]"
        )}
        onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
        onMouseLeave={() => { closeTimer.current = setTimeout(() => setProductsOpen(false), 150); }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-[72px] lg:h-[80px]">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 z-10">
              <Image
                src="/logo3.svg"
                alt="Innovation Designer Furniture"
                width={50}
                height={75}
                priority
                className={clsx(
                  "transition-all duration-500 h-[52px] lg:h-[64px] w-auto",
                  isTransparent
                    ? "drop-shadow-[0_0_10px_rgba(201,169,110,0.35)]"
                    : "opacity-90"
                )}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {/* Home */}
              <Link
                href="/"
                className={clsx(
                  "nav-link font-sans text-[13px] font-[400] tracking-[0.1em] transition-colors duration-300",
                  pathname === "/" && "active",
                  isTransparent ? "text-[rgba(245,239,228,0.85)] hover:text-[#C9A96E]" : "text-[#3D2B1F] hover:text-[#C9A96E]"
                )}
              >
                Home
              </Link>

              {/* Products dropdown */}
              <div ref={dropdownRef} className="relative"
                onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); setProductsOpen(true); }}
              >
                <button
                  onClick={() => setProductsOpen(!productsOpen)}
                  className={clsx(
                    "flex items-center gap-1.5 nav-link font-sans text-[13px] font-[400] tracking-[0.1em] transition-colors duration-300",
                    isProductsActive && "active",
                    isTransparent ? "text-[rgba(245,239,228,0.85)] hover:text-[#C9A96E]" : "text-[#3D2B1F] hover:text-[#C9A96E]"
                  )}
                >
                  Products
                  <ChevronDown open={productsOpen} />
                </button>

              </div>

              {/* About & Contact */}
              {BASE_LINKS.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "nav-link font-sans text-[13px] font-[400] tracking-[0.1em] transition-colors duration-300",
                    pathname.startsWith(link.href) && "active",
                    isTransparent ? "text-[rgba(245,239,228,0.85)] hover:text-[#C9A96E]" : "text-[#3D2B1F] hover:text-[#C9A96E]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearching(!searching)}
                aria-label="Search"
                className={clsx(
                  "hidden lg:flex items-center justify-center w-9 h-9 transition-colors duration-300",
                  isTransparent ? "text-[rgba(245,239,228,0.75)] hover:text-[#C9A96E]" : "text-[#3D2B1F] hover:text-[#C9A96E]"
                )}
              >
                <SearchIcon />
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                className={clsx(
                  "flex lg:hidden items-center justify-center w-9 h-9 transition-colors duration-300",
                  isTransparent || menuOpen ? "text-[#C9A96E]" : "text-[#3D2B1F]"
                )}
              >
                <HamburgerIcon open={menuOpen} />
              </button>
            </div>
          </div>

        </div>

        {/* ── Products sub-bar — absolutely positioned below header ── */}
        <div
          ref={subBarRef}
          className={clsx(
            "hidden lg:block absolute left-0 right-0 top-full",
            "border-t border-[rgba(201,169,110,0.2)]",
            "transition-all duration-250 ease-out",
            isTransparent ? "bg-[rgba(20,16,12,0.75)] backdrop-blur-sm" : "bg-[#FAF7F2]/98 backdrop-blur-md",
            productsOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"
          )}
        >
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center gap-10 py-3.5">
            {catList.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setProductsOpen(false)}
                className={clsx(
                  "font-sans text-[11px] tracking-[0.18em] uppercase whitespace-nowrap transition-colors duration-200",
                  pathname === `/category/${cat.slug}`
                    ? "text-[#C9A96E]"
                    : isTransparent
                      ? "text-[rgba(245,239,228,0.75)] hover:text-[#C9A96E]"
                      : "text-[#8B7D6E] hover:text-[#C9A96E]"
                )}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

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
      <div className={clsx("fixed inset-0 z-40 lg:hidden transition-all duration-500", menuOpen ? "pointer-events-auto" : "pointer-events-none")}>
        {/* Backdrop */}
        <div
          className={clsx("absolute inset-0 bg-[#110E0B] transition-opacity duration-500", menuOpen ? "opacity-80" : "opacity-0")}
          onClick={() => setMenuOpen(false)}
        />

        {/* Panel */}
        <div className={clsx(
          "absolute top-0 right-0 h-full w-[300px] bg-[#1A1410]",
          "flex flex-col pt-[100px] pb-12 px-8 overflow-y-auto",
          "transition-transform duration-500 ease-out",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="w-8 h-px bg-[#C9A96E] mb-10 opacity-60" />

          <nav className="flex flex-col gap-1">
            {/* Home */}
            <Link
              href="/"
              style={{ transitionDelay: menuOpen ? "0ms" : "0ms" }}
              className={clsx(
                "font-serif text-[1.6rem] font-light py-2 transition-colors duration-300",
                pathname === "/" ? "text-[#C9A96E]" : "text-[#F5EFE4] hover:text-[#C9A96E]"
              )}
            >
              Home
            </Link>

            {/* Products accordion */}
            <div>
              <button
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                style={{ transitionDelay: menuOpen ? "50ms" : "0ms" }}
                className={clsx(
                  "w-full flex items-center justify-between font-serif text-[1.6rem] font-light py-2 transition-colors duration-300",
                  isProductsActive ? "text-[#C9A96E]" : "text-[#F5EFE4] hover:text-[#C9A96E]"
                )}
              >
                Products
                <ChevronDown open={mobileProductsOpen} />
              </button>

              {/* Sub-items */}
              <div className={clsx(
                "overflow-hidden transition-all duration-300",
                mobileProductsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="pl-4 pb-2 flex flex-col gap-0.5 border-l border-[rgba(201,169,110,0.2)] ml-1">
                  {catList.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className={clsx(
                        "font-sans text-[0.95rem] tracking-[0.06em] py-1.5 transition-colors duration-200",
                        pathname === `/category/${cat.slug}` ? "text-[#C9A96E]" : "text-[rgba(245,239,228,0.6)] hover:text-[#C9A96E]"
                      )}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* About & Contact */}
            {BASE_LINKS.slice(1).map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ transitionDelay: menuOpen ? `${(i + 2) * 50}ms` : "0ms" }}
                className={clsx(
                  "font-serif text-[1.6rem] font-light py-2 transition-colors duration-300",
                  pathname.startsWith(link.href) ? "text-[#C9A96E]" : "text-[#F5EFE4] hover:text-[#C9A96E]"
                )}
              >
                {link.label}
              </Link>
            ))}
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
