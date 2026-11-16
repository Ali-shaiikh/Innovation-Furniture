export const SITE_URL = "https://www.innovationfurniture.in";

/** Trim text to a search-result-friendly length, cutting at a word boundary. */
export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.—-]+$/, "") + "…";
}

/** Shared Open Graph fields — pages that set their own openGraph must spread this, since Next replaces the whole object. */
export const baseOpenGraph = {
  type: "website" as const,
  siteName: "Innovation Designer Furniture",
  locale: "en_IN",
  images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Innovation Designer Furniture" }],
};
