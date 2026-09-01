import { getPosts } from "@/lib/content";

export async function GET() {
  const posts = getPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: p.date,
    tags: p.tags,
    readingTime: p.readingTime,
  }));

  return Response.json(posts, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
