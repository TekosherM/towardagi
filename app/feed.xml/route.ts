import { getPosts } from "@/lib/content";
import { categoryMeta } from "@/lib/categories";

const BASE = "https://towardagi.com";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = getPosts().slice(0, 30);

  const items = posts
    .map((post) => {
      const meta = categoryMeta(post.category);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE}/articles/${post.slug}</link>
      <guid isPermaLink="true">${BASE}/articles/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(meta.label)}</category>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Toward AGI</title>
    <link>${BASE}</link>
    <description>Dispatches from the road to AGI — news, deep dives, and a live model radar.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
