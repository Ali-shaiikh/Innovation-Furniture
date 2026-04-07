import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;
import type { Category, Product, SiteSetting } from "@/types";

// ─── Client ────────────────────────────────────────────────────────────────────

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

// ─── Image URL Helper ──────────────────────────────────────────────────────────

const builder = imageUrlBuilder(sanityClient);

export function getSanityImageUrl(
  source: SanityImageSource | null | undefined,
  { width, quality }: { width?: number; quality?: number } = {}
): string {
  if (!source) return "";
  let img = builder.image(source).auto("format").fit("max").quality(quality ?? 90);
  if (width) img = img.width(width);
  return img.url();
}

// ─── Format Currency ───────────────────────────────────────────────────────────

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Categories ────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  return sanityClient.fetch(
    `*[_type == "category"] | order(order asc, name asc) {
      _id, name, slug, description, order,
      image { asset->, alt, hotspot, crop }
    }`,
    {},
    { next: { revalidate: 120 } }
  );
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const results = await sanityClient.fetch(
    `*[_type == "category" && slug.current == $slug][0] {
      _id, name, slug, description,
      image { asset->, alt, hotspot, crop }
    }`,
    { slug },
    { next: { revalidate: 120 } }
  );
  return results ?? null;
}

// ─── Products ──────────────────────────────────────────────────────────────────

export async function getProducts(params?: {
  categorySlug?: string;
  limit?: number;
  page?: number;
}): Promise<Product[]> {
  const filter = params?.categorySlug
    ? `*[_type == "product" && category->slug.current == $categorySlug]`
    : `*[_type == "product"]`;

  const pagination = params?.limit
    ? `[${((params.page ?? 1) - 1) * params.limit}...${(params.page ?? 1) * params.limit}]`
    : "";

  return sanityClient.fetch(
    `${filter} | order(_createdAt asc) ${pagination} {
      _id, name, slug, starting_price, description, materials, dimensions,
      images[] { asset->, alt, hotspot, crop },
      category->{ _id, name, slug }
    }`,
    { categorySlug: params?.categorySlug ?? "" },
    { next: { revalidate: 120 } }
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const result = await sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id, name, slug, starting_price, description, materials, dimensions,
      images[] { asset->, alt, hotspot, crop },
      category->{ _id, name, slug }
    }`,
    { slug },
    { next: { revalidate: 120 } }
  );
  return result ?? null;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return getProducts({ limit });
}

// ─── Site Settings ─────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSetting | null> {
  const result = await sanityClient.fetch(
    `*[_type == "siteSettings"][0] {
      hero_title, hero_subtitle, hero_stats, why_us_items,
      cta_title, cta_subtitle,
      about_mission, about_stats, about_values,
      contact_email, contact_phone, contact_address,
      social_instagram, social_pinterest,
      hero_image { asset->, alt, hotspot, crop }
    }`,
    {},
    { next: { revalidate: 86400 } }
  );
  return result ?? null;
}
