import type { WithContext, Organization, WebSite, WebPage, Article, NewsArticle, Person, BreadcrumbList, ItemList } from "schema-dts";

const BASE = "https://towardagi.com";

interface JsonLdProps {
  type: "organization" | "website" | "webpage" | "article" | "newsarticle" | "person" | "breadcrumb" | "itemlist";
  data?: Record<string, unknown>;
}

function OrganizationJsonLd() {
  const json: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "Toward AGI",
    url: BASE,
    description: "Dispatches from the road to AGI.",
    logo: `${BASE}/icon.svg`,
    sameAs: ["https://x.com/towardagi", "https://github.com/towardagi"],
    foundingDate: "2026",
    knowsAbout: ["Artificial Intelligence", "Machine Learning", "AGI"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

function WebsiteJsonLd() {
  const json: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: "Toward AGI",
    description: "Dispatches from the road to AGI.",
    publisher: { "@id": `${BASE}/#organization` },
    potentialAction: [{ "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${BASE}/search?q={search_term_string}` }, "query-input": "required name=search_term_string" }] as any,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

function WebPageJsonLd({ title, description, url }: { title: string; description: string; url: string }) {
  const json: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title, description, url,
    isPartOf: { "@id": `${BASE}/#website` },
    publisher: { "@id": `${BASE}/#organization` },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

function ArticleJsonLd({ headline, description, datePublished, dateModified, authors, image, url, keywords }: { headline: string; description: string; datePublished: string; dateModified?: string; authors: Array<{ name: string; url?: string }>; image?: string; url: string; keywords?: string[] }) {
  const json: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline, description, datePublished, dateModified: dateModified ?? datePublished,
    author: authors.map((a) => ({ "@type": "Person", name: a.name, url: a.url })),
    image: image ?? `${BASE}/api/og?title=${encodeURIComponent(headline)}`,
    url, keywords: keywords?.join(", "), inLanguage: "en",
    publisher: { "@id": `${BASE}/#organization` },
    isPartOf: { "@id": `${BASE}/#website` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

function NewsArticleJsonLd({ headline, description, datePublished, dateModified, authors, image, url, keywords, section }: { headline: string; description: string; datePublished: string; dateModified?: string; authors: Array<{ name: string; url?: string }>; image?: string; url: string; keywords?: string[]; section: string }) {
  const json: WithContext<NewsArticle> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline, description, datePublished, dateModified: dateModified ?? datePublished,
    author: authors.map((a) => ({ "@type": "Person", name: a.name, url: a.url })),
    image: image ?? `${BASE}/api/og?title=${encodeURIComponent(headline)}`,
    url, keywords: keywords?.join(", "), articleSection: section, inLanguage: "en",
    publisher: { "@id": `${BASE}/#organization` },
    isPartOf: { "@id": `${BASE}/#website` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

function PersonJsonLd({ name, description, url, sameAs }: { name: string; description?: string; url: string; sameAs?: string[] }) {
  const json: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name, description, url, sameAs,
    affiliation: { "@id": `${BASE}/#organization` },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const json: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.url })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

function ItemListJsonLd({ name, items }: { name: string; items: Array<{ name: string; url: string }> }) {
  const json: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: item.url })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

export function JsonLd({ type, data }: JsonLdProps) {
  switch (type) {
    case "organization": return <OrganizationJsonLd />;
    case "website": return <WebsiteJsonLd />;
    case "webpage": return <WebPageJsonLd {...(data as { title: string; description: string; url: string })} />;
    case "article": return <ArticleJsonLd {...(data as React.ComponentProps<typeof ArticleJsonLd>)} />;
    case "newsarticle": return <NewsArticleJsonLd {...(data as React.ComponentProps<typeof NewsArticleJsonLd>)} />;
    case "person": return <PersonJsonLd {...(data as React.ComponentProps<typeof PersonJsonLd>)} />;
    case "breadcrumb": return <BreadcrumbJsonLd {...(data as { items: Array<{ name: string; url: string }> })} />;
    case "itemlist": return <ItemListJsonLd {...(data as { name: string; items: Array<{ name: string; url: string }> })} />;
    default: return null;
  }
}
