// Weekly Instagram report for Innovation Designer Furniture.
// Run: node tools/weekly-report.mjs   (reads frontend/.env.local)
// Writes tools/reports/report-YYYY-MM-DD.html and prints a short summary.
//
// Uses INSTAGRAM_USER_ID + INSTAGRAM_ACCESS_TOKEN (likes, comments, keyword enquiries).
// If INSTAGRAM_REPORT_TOKEN is set (a token with instagram_manage_insights), it also
// pulls views, reach, saves and shares per reel.

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "tools", "reports");
const GRAPH = "https://graph.facebook.com/v21.0";

// Keywords promised in captions, grouped the same way as the comment auto-replies.
const KEYWORDS = {
  Sofas: ["SOFA", "CURVE", "CREAM", "COLOUR", "COLOR", "TUFT", "CHESTERFIELD"],
  Chairs: ["CHAIR", "OTTOMAN", "ARMCHAIR"],
  Beds: ["BED", "SOFABED", "SOFA CUM BED"],
  General: ["HOME", "PRICE", "DETAILS", "DESIGN", "INTERESTED"],
};

function loadEnv() {
  const env = {};
  for (const line of readFileSync(join(ROOT, "frontend", ".env.local"), "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

const env = loadEnv();
const USER = env.INSTAGRAM_USER_ID;
const TOKEN = env.INSTAGRAM_ACCESS_TOKEN;
const STATS_TOKEN = env.INSTAGRAM_REPORT_TOKEN;
if (!USER || !TOKEN) throw new Error("INSTAGRAM_USER_ID / INSTAGRAM_ACCESS_TOKEN missing in frontend/.env.local");

async function get(path, params, token = TOKEN) {
  const res = await fetch(`${GRAPH}/${path}?${new URLSearchParams({ ...params, access_token: token })}`);
  const json = await res.json();
  if (json.error) throw new Error(`${path}: ${json.error.message}`);
  return json;
}

async function allPages(path, params) {
  let out = [], page = await get(path, params);
  while (true) {
    out = out.concat(page.data ?? []);
    if (!page.paging?.next) return out;
    page = await (await fetch(page.paging.next)).json();
  }
}

function matchGroup(text) {
  const t = ` ${text.toUpperCase()} `;
  for (const [group, words] of Object.entries(KEYWORDS)) {
    if (words.some((w) => t.includes(w))) return group;
  }
  return null;
}

const hook = (caption = "") => caption.split("\n").map((l) => l.trim()).find(Boolean) ?? "(no caption)";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

async function main() {
  const now = new Date();
  const weekAgo = new Date(now - 7 * 864e5);

  const media = await allPages(`${USER}/media`, {
    fields: "id,caption,media_type,media_product_type,like_count,comments_count,permalink,timestamp",
    limit: 50,
  });

  const rows = [];
  for (const m of media) {
    const comments = m.comments_count ? await allPages(`${m.id}/comments`, { fields: "text,timestamp", limit: 50 }) : [];
    const enquiries = comments.map((c) => matchGroup(c.text)).filter(Boolean);
    const weekEnquiries = comments.filter((c) => new Date(c.timestamp) >= weekAgo && matchGroup(c.text)).length;

    let stats = null;
    if (STATS_TOKEN && m.media_product_type === "REELS") {
      try {
        const s = await get(`${m.id}/insights`, { metric: "views,reach,saved,shares" }, STATS_TOKEN);
        stats = Object.fromEntries(s.data.map((d) => [d.name, d.values?.[0]?.value ?? d.total_value?.value ?? 0]));
      } catch { /* stats are optional */ }
    }

    rows.push({
      date: m.timestamp,
      isNew: new Date(m.timestamp) >= weekAgo,
      type: m.media_product_type === "REELS" ? "Reel" : m.media_type === "CAROUSEL_ALBUM" ? "Carousel" : "Post",
      hook: hook(m.caption),
      likes: m.like_count ?? 0,
      comments: m.comments_count ?? 0,
      enquiries: enquiries.length,
      weekEnquiries,
      groups: enquiries,
      stats,
      link: m.permalink,
    });
  }

  const week = rows.filter((r) => r.isNew);
  const sum = (arr, k) => arr.reduce((a, r) => a + r[k], 0);
  const weekEnq = sum(rows, "weekEnquiries");
  const byGroup = {};
  for (const r of rows) for (const g of r.groups) byGroup[g] = (byGroup[g] ?? 0) + 1;
  const ranked = [...rows].sort((a, b) => b.enquiries - a.enquiries || b.likes + b.comments - (a.likes + a.comments));
  const best = ranked.find((r) => r.enquiries > 0) ?? ranked[0];
  const topGroup = Object.entries(byGroup).sort((a, b) => b[1] - a[1])[0];

  const summary = [
    `Posts this week: ${week.length} (${week.filter((r) => r.type === "Reel").length} reels)`,
    `Keyword enquiries this week: ${weekEnq}`,
    `Likes on this week's posts: ${sum(week, "likes")}, comments: ${sum(week, "comments")}`,
    best ? `Best post so far: "${best.hook}" (${fmtDate(best.date)}) with ${best.enquiries} enquiries` : "",
    topGroup ? `Most-asked product: ${topGroup[0]} (${topGroup[1]} enquiries in total)` : "No keyword enquiries yet",
  ].filter(Boolean);

  const statCols = STATS_TOKEN ? "<th>Views</th><th>Reach</th><th>Saves</th><th>Shares</th>" : "";
  const tr = (r) => `<tr${r.isNew ? ' class="new"' : ""}>
    <td>${fmtDate(r.date)}</td><td>${r.type}</td>
    <td><a href="${esc(r.link)}">${esc(r.hook)}</a></td>
    <td>${r.likes}</td><td>${r.comments}</td><td class="enq">${r.enquiries}</td>
    ${STATS_TOKEN ? ["views", "reach", "saved", "shares"].map((k) => `<td>${r.stats?.[k] ?? "–"}</td>`).join("") : ""}
  </tr>`;

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Weekly Instagram Report</title>
<style>
  :root { --bg:#1A1410; --panel:#231B15; --line:rgba(201,169,110,.18); --gold:#C9A96E; --cream:#F5EFE4; --muted:#A99A88; }
  body { margin:0; background:var(--bg); color:var(--cream); font:15px/1.5 Georgia, "Times New Roman", serif; }
  main { max-width:1000px; margin:0 auto; padding:32px 16px 64px; }
  .eyebrow { font:600 11px/1 system-ui, sans-serif; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); }
  h1 { font-weight:400; font-size:30px; margin:10px 0 4px; }
  .sub { color:var(--muted); font-family:system-ui, sans-serif; font-size:13px; }
  .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; margin:28px 0; }
  .card { background:var(--panel); border:1px solid var(--line); padding:16px; }
  .card b { display:block; font-size:28px; font-weight:400; color:var(--gold); }
  .card span { font:12px system-ui, sans-serif; color:var(--muted); }
  ul { padding-left:18px; } li { margin:4px 0; }
  .wrap { overflow-x:auto; border:1px solid var(--line); }
  table { width:100%; border-collapse:collapse; font:13px system-ui, sans-serif; }
  th, td { padding:9px 10px; border-bottom:1px solid var(--line); text-align:left; white-space:nowrap; }
  td:nth-child(3) { white-space:normal; min-width:220px; }
  th { color:var(--gold); font-weight:600; font-size:11px; letter-spacing:.08em; text-transform:uppercase; }
  tr.new td:first-child { border-left:3px solid var(--gold); }
  td.enq { color:var(--gold); font-weight:700; }
  a { color:var(--cream); }
  .note { color:var(--muted); font:12px system-ui, sans-serif; margin-top:14px; }
</style></head><body><main>
<div class="eyebrow">Innovation Designer Furniture · Instagram</div>
<h1>Weekly report</h1>
<div class="sub">${fmtDate(weekAgo)} – ${fmtDate(now)} ${now.getFullYear()} · generated ${now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</div>
<div class="cards">
  <div class="card"><b>${week.length}</b><span>posts this week</span></div>
  <div class="card"><b>${weekEnq}</b><span>keyword enquiries this week</span></div>
  <div class="card"><b>${sum(week, "likes")}</b><span>likes on this week's posts</span></div>
  <div class="card"><b>${sum(week, "comments")}</b><span>comments on this week's posts</span></div>
</div>
<ul>${summary.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
<h2 class="eyebrow" style="margin:32px 0 12px">All posts, most enquiries first</h2>
<div class="wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Post</th><th>Likes</th><th>Comments</th><th>Enquiries</th>${statCols}</tr></thead>
<tbody>${ranked.map(tr).join("")}</tbody></table></div>
<p class="note">Enquiries = comments containing a caption keyword (SOFA, CHAIR, BED, HOME…). Gold edge = posted this week.${STATS_TOKEN ? "" : " Views, reach, saves and shares need a stats token (INSTAGRAM_REPORT_TOKEN)."}</p>
</main></body></html>`;

  mkdirSync(OUT_DIR, { recursive: true });
  const file = join(OUT_DIR, `report-${now.toISOString().slice(0, 10)}.html`);
  writeFileSync(file, html);
  console.log(summary.join("\n"));
  console.log(`\nReport: ${file}`);
}

main().catch((e) => { console.error("Report failed:", e.message); process.exit(1); });
