import { getPosts } from "@/lib/content";
import { categoryMeta } from "@/lib/categories";

const BASE = "https://towardagi.com";

export async function GET() {
  const posts = getPosts().slice(0, 30);

  const feed = {
    version: "https://jsonfeed.org/version/1",
    title: "Toward AGI",
    home_page_url: BASE,
    feed_url: `${BASE}/feed.json`,
    description: "Dispatches from the road to AGI — news, deep dives, and a live model radar.",
    icon: `${BASE}/icon.svg`,
    favicon: `${BASE}/icon.svg`,
    author: {
      name: "Toward AGI",
    },
    items: posts.map((post) => {
      const meta = categoryMeta(post.category);
      return {
        id: `${BASE}/articles/${post.slug}`,
        url: `${BASE}/articles/${post.slug}`,
        title: post.title,
        content_text: post.description,
        summary: post.description,
        date_published: post.date,
        tags: post.tags,
        author: {
          name: meta.label,
        },
      };
    }),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
