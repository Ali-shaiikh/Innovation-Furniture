import type {
  Category,
  Product,
  SiteSetting,
  StrapiResponse,
} from "@/types";

// ─── Config ────────────────────────────────────────────────────────────────────

const STRAPI_URL   = process.env.NEXT_PUBLIC_STRAPI_URL  || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN        || "";

// ─── Core Fetcher ──────────────────────────────────────────────────────────────

async function fetchStrapi<T>(
  endpoint: string,
  options: { revalidate?: number } = {}
): Promise<T | null> {
  const url = `${STRAPI_URL}/api${endpoint}`;
  const { revalidate = 60 } = options;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      // On 5xx errors (Strapi sleeping), use stale cache instead of caching empty
      next: { revalidate },
    });

    if (!res.ok) {
      console.error(`Strapi fetch error [${res.status}]: ${url}`);
      // For server errors (503 = sleeping), throw so Next.js keeps the stale cache
      if (res.status >= 500) throw new Error(`Strapi unavailable: ${res.status}`);
      return null;
    }

    return res.json() as Promise<T>;
  } catch (err) {
    console.error(`Strapi network error: ${url}`, err);
    // Re-throw so Next.js ISR keeps serving the last successful cached response
    throw err;
  }
}

// ─── Image URL Helper ──────────────────────────────────────────────────────────

export function getStrapiImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

// ─── Categories ────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const res = await fetchStrapi<StrapiResponse<Category[]>>(
    "/categories?populate=image&sort=order:asc"
  );
  return res?.data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const res = await fetchStrapi<StrapiResponse<Category[]>>(
    `/categories?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=image`
  );
  return res?.data?.[0] ?? null;
}

// ─── Products ──────────────────────────────────────────────────────────────────

export async function getProducts(params?: {
  categorySlug?: string;
  limit?: number;
  page?: number;
}): Promise<Product[]> {
  const qs = new URLSearchParams();
  qs.set("populate", "*");
  qs.set("sort", "createdAt:asc");

  if (params?.categorySlug) {
    qs.set("filters[category][slug][$eq]", params.categorySlug);
  }
  if (params?.limit) {
    qs.set("pagination[pageSize]", String(params.limit));
  }
  if (params?.page) {
    qs.set("pagination[page]", String(params.page));
  }

  const res = await fetchStrapi<StrapiResponse<Product[]>>(
    `/products?${qs.toString()}`
  );
  return res?.data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetchStrapi<StrapiResponse<Product[]>>(
    `/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  return res?.data?.[0] ?? null;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return getProducts({ limit });
}

// ─── Site Settings ─────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSetting | null> {
  const res = await fetchStrapi<StrapiResponse<SiteSetting>>(
    "/site-setting?populate=*",
    { revalidate: 300 }
  );
  return res?.data ?? null;
}

// ─── Format Currency ───────────────────────────────────────────────────────────

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
