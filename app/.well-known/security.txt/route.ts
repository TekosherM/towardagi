export async function GET() {
  const content = [
    "Contact: mailto:security@towardagi.com",
    "Expires: " + new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    "Preferred-Languages: en",
    "Canonical: https://towardagi.com/.well-known/security.txt",
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
