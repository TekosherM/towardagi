import { getAuthors } from "@/lib/content";

export async function GET() {
  const authors = getAuthors();

  const lines = [
    "/* TEAM */",
    `Site: Toward AGI (towardagi.com)`,
    `Location: The internet`,
    ``,
    ...authors.map((a) => `Author: ${a.name} — ${a.role}`),
    ``,
    "/* THANKS */",
    "Name: Every open-weights lab publishing in the open",
    ``,
    "/* SITE */",
    "Last update: " + new Date().toISOString().split("T")[0],
    "Language: English",
    "Standards: HTML5, CSS3, TypeScript, Next.js",
    "Components: React, Three.js, GSAP, Tailwind CSS",
    "Software: Next.js 16, Vercel",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
