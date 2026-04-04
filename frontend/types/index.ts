// ─── Sanity Image ──────────────────────────────────────────────────────────────

export interface SanityImageAsset {
  _ref?: string;
  _type?: string;
  url?: string;
  metadata?: {
    dimensions?: { width: number; height: number };
  };
}

export interface SanityImage {
  asset: SanityImageAsset;
  alt?: string | null;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

// Keep StrapiImage as alias so existing components don't break
export type StrapiImage = SanityImage;

// ─── Category ──────────────────────────────────────────────────────────────────

export interface Category {
  _id: string;
  name: string;
  slug: { current: string } | string;
  description: string | null;
  order?: number;
  image: SanityImage | null;
}

// ─── Product ───────────────────────────────────────────────────────────────────

export interface Product {
  _id: string;
  name: string;
  slug: { current: string } | string;
  starting_price: number;
  description: string | null;
  materials: string | null;
  dimensions: string | null;
  images: SanityImage[];
  category: Category | null;
}

// ─── Site Setting JSON sub-types ───────────────────────────────────────────────

export interface HeroStat {
  value: string;
  label: string;
}

export interface WhyUsItem {
  icon: "shield" | "clock" | "heart" | "star" | "truck" | "award";
  title: string;
  description: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutValue {
  number: string;
  title: string;
  description: string;
}

// ─── Site Setting ──────────────────────────────────────────────────────────────

export interface SiteSetting {
  hero_title:       string | null;
  hero_subtitle:    string | null;
  hero_image:       SanityImage | null;
  hero_stats:       HeroStat[] | null;
  why_us_items:     WhyUsItem[] | null;
  cta_title:        string | null;
  cta_subtitle:     string | null;
  about_mission:    string | null;
  about_stats:      AboutStat[] | null;
  about_values:     AboutValue[] | null;
  contact_email:    string | null;
  contact_phone:    string | null;
  contact_address:  string | null;
  social_instagram: string | null;
  social_pinterest: string | null;
}
