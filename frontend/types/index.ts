// ─── Strapi Base ───────────────────────────────────────────────────────────────

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string; width: number; height: number };
    small?:     { url: string; width: number; height: number };
    medium?:    { url: string; width: number; height: number };
    large?:     { url: string; width: number; height: number };
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// ─── Category ──────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  image: StrapiImage | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Product ───────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  starting_price: number;
  description: string | null;
  materials: string | null;
  dimensions: string | null;
  images: StrapiImage[];
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Site Setting JSON sub-types ───────────────────────────────────────────────

export interface HeroStat {
  value: string; // e.g. "500+"
  label: string; // e.g. "Designs"
}

export interface WhyUsItem {
  icon: "shield" | "clock" | "heart" | "star" | "truck" | "award";
  title: string;
  description: string;
}

export interface AboutStat {
  value: string; // e.g. "2015"
  label: string; // e.g. "Year Founded"
}

export interface AboutValue {
  number: string; // e.g. "01"
  title: string;
  description: string;
}

// ─── Site Setting (single type) ────────────────────────────────────────────────

export interface SiteSetting {
  id: number;
  // Hero
  hero_title:    string | null;
  hero_subtitle: string | null;
  hero_image:    StrapiImage | null;
  hero_stats:    HeroStat[] | null;
  // Home — Why Us section
  why_us_items:  WhyUsItem[] | null;
  // Home — CTA banner
  cta_title:    string | null;
  cta_subtitle: string | null;
  // About page
  about_mission: string | null;
  about_stats:   AboutStat[] | null;
  about_values:  AboutValue[] | null;
  // Contact / global
  contact_email:   string | null;
  contact_phone:   string | null;
  contact_address: string | null;
  // Social
  social_instagram: string | null;
  social_pinterest: string | null;
}
