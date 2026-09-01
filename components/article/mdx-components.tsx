import type { ReactNode } from "react";
import { Children, isValidElement } from "react";
import { slugify } from "@/lib/utils";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children);
  return "";
}

function Heading({ depth, children }: { depth: 2 | 3; children?: ReactNode }) {
  const id = slugify(textOf(children));
  const Tag = depth === 2 ? "h2" : "h3";
  return (
    <Tag id={id} className="group relative">
      <a
        href={`#${id}`}
        className="absolute -left-6 text-signal opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Link to section"
      >
        #
      </a>
      {children}
    </Tag>
  );
}

const CALLOUT_STYLES: Record<string, { color: string; label: string }> = {
  note: { color: "#6bc7ff", label: "Note" },
  signal: { color: "#35f0d0", label: "Signal" },
  warning: { color: "#ffb454", label: "Caution" },
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: "note" | "signal" | "warning";
  title?: string;
  children: ReactNode;
}) {
  const style = CALLOUT_STYLES[type] ?? CALLOUT_STYLES.note;
  return (
    <aside
      className="my-8 border-l-2 bg-panel/60 px-6 py-5"
      style={{ borderColor: style.color }}
    >
      <p
        className="mb-2 font-mono text-[0.62rem] tracking-[0.22em] uppercase"
        style={{ color: style.color }}
      >
        {title ?? style.label}
      </p>
      <div className="text-[0.95rem] leading-relaxed text-bone/80">{children}</div>
    </aside>
  );
}

function CopyCodeButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-3 top-3 border border-line bg-void/80 px-2 py-1 font-mono text-[0.6rem] tracking-[0.1em] uppercase text-fog transition-colors hover:border-signal/50 hover:text-signal"
      aria-label="Copy code"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

import React from "react";

export const mdxComponents = {
  h2: (props: { children?: ReactNode }) => <Heading depth={2} {...props} />,
  h3: (props: { children?: ReactNode }) => <Heading depth={3} {...props} />,
  a: (props: { href?: string; children?: ReactNode }) => {
    const external = props.href?.startsWith("http");
    return (
      <a
        {...props}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      />
    );
  },
  pre: (props: { children?: ReactNode }) => {
    let lang = "";
    let codeText = "";
    try {
      const child = Children.only(props.children);
      if (isValidElement(child)) {
        const cls = String((child.props as { className?: string }).className ?? "");
        lang = /language-([\w-]+)/.exec(cls)?.[1] ?? "";
        // Extract text content for copy button
        const codeEl = child.props as { children?: string };
        codeText = codeEl.children ?? "";
      }
    } catch {
      lang = "";
    }
    return (
      <pre data-lang={lang} className="relative">
        <CopyCodeButton text={codeText} />
        {props.children}
      </pre>
    );
  },
  Callout,
};
