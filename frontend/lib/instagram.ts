// Pulls the latest reels from the Innovation Instagram account (Graph API).
// Needs two server-only env vars (see .env.local.example):
//   INSTAGRAM_USER_ID       numeric Instagram business account id
//   INSTAGRAM_ACCESS_TOKEN  long-lived token with instagram_basic access
// If either is missing or Meta errors, we return [] and the section hides itself.

export type Reel = {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  permalink: string;
  caption: string;
};

type GraphMedia = {
  id: string;
  media_type: string;
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
};

const GRAPH = "https://graph.facebook.com/v21.0";

export async function getLatestReels(limit = 8): Promise<Reel[]> {
  const userId = process.env.INSTAGRAM_USER_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!userId || !token) return [];

  const fields = "id,media_type,media_product_type,media_url,thumbnail_url,permalink,caption";
  const url = `${GRAPH}/${userId}/media?fields=${fields}&limit=30&access_token=${token}`;

  try {
    // Instagram media URLs expire, so refresh hourly.
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error("[instagram] fetch failed", res.status);
      return [];
    }
    const json = (await res.json()) as { data?: GraphMedia[] };
    return (json.data ?? [])
      .filter((m) => m.media_type === "VIDEO" && m.media_url && m.thumbnail_url)
      .slice(0, limit)
      .map((m) => ({
        id: m.id,
        videoUrl: m.media_url!,
        thumbnailUrl: m.thumbnail_url!,
        permalink: m.permalink,
        caption: firstLine(m.caption),
      }));
  } catch (err) {
    console.error("[instagram] fetch error", err);
    return [];
  }
}

// Captions end in hashtags and contact lines; keep only the hook.
function firstLine(caption?: string): string {
  return (caption ?? "").split("\n").map((l) => l.trim()).find(Boolean) ?? "";
}
