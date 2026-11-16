import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/sanity";
import { SITE_URL } from "@/lib/seo";

const slugOf = (s: { current: string } | string) => (typeof s === "string" ? s : s.current);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  // lastModified comes from Sanity's real edit time — never "now", which search engines learn to ignore.
  const productUrls = products.map((p) => ({
    url: `${SITE_URL}/products/${slugOf(p.slug)}`,
    ...(p._updatedAt && { lastModified: new Date(p._updatedAt) }),
  }));

  const categoryUrls = categories.map((cat) => {
    const slug = slugOf(cat.slug);
    const times = products
      .filter((p) => p.category && slugOf(p.category.slug) === slug)
      .map((p) => p._updatedAt)
      .concat(cat._updatedAt)
      .filter((t): t is string => Boolean(t))
      .sort();
    const latest = times[times.length - 1];
    return {
      url: `${SITE_URL}/category/${slug}`,
      ...(latest && { lastModified: new Date(latest) }),
    };
  });

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/furniture-store-mumbai` },
    { url: `${SITE_URL}/furniture-store-pune` },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/contact` },
    ...categoryUrls,
    ...productUrls,
  ];
}
