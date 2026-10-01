import { Fragment, type ReactNode } from "react";

/**
 * Tiny, safe Markdown-lite renderer (no dangerouslySetInnerHTML).
 * Supports: ## / ### headings, paragraphs, - and 1. lists, > quotes,
 * **bold**, *italic*, [links](https://...), ![images](/api/images/...), and --- rules.
 */

function safeHref(url: string): string | null {
  const u = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(u) || u.startsWith("/") || u.startsWith("#")) return u;
  return null;
}

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(!\[([^\]]*)\]\(([^)\s]+)\))|(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    if (m[1]) {
      const src = safeHref(m[3]);
      if (src)
        out.push(
          // eslint-disable-next-line @next/next/no-img-element
          <img key={k} src={src} alt={m[2]} className="my-6 w-full rounded-xl" loading="lazy" />
        );
    } else if (m[4]) {
      const href = safeHref(m[6]);
      const external = href && /^https?:/i.test(href);
      out.push(
        href ? (
          <a key={k} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
             className="font-medium text-water-700 underline underline-offset-2 hover:text-gold-600">
            {m[5]}
          </a>
        ) : (
          m[5]
        )
      );
    } else if (m[7]) out.push(<strong key={k}>{m[8]}</strong>);
    else if (m[9]) out.push(<em key={k}>{m[10]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function RichText({ content }: { content: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="prose-rf">
      {blocks.map((raw, bi) => {
        const block = raw.trim();
        if (!block) return null;
        const k = `b${bi}`;
        if (block === "---") return <hr key={k} />;
        if (block.startsWith("### ")) return <h3 key={k}>{inline(block.slice(4), k)}</h3>;
        if (block.startsWith("## ")) return <h2 key={k}>{inline(block.slice(3), k)}</h2>;
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*]\s+/.test(l)))
          return (
            <ul key={k}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*[-*]\s+/, ""), `${k}-${li}`)}</li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l)))
          return (
            <ol key={k}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""), `${k}-${li}`)}</li>
              ))}
            </ol>
          );
        if (lines.every((l) => l.startsWith(">")))
          return <blockquote key={k}>{inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "), k)}</blockquote>;
        return (
          <p key={k}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, `${k}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
