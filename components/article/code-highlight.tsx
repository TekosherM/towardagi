import { codeToHtml } from "shiki";

interface CodeHighlightProps {
  code: string;
  lang?: string;
}

export async function CodeHighlight({ code, lang = "text" }: CodeHighlightProps) {
  const html = await codeToHtml(code, {
    lang: ["js", "ts", "tsx", "jsx", "json", "bash", "python", "mdx", "html", "css", "yaml", "toml"].includes(lang) ? lang : "text",
    theme: "github-dark-dimmed",
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} className="shiki-code" />;
}
