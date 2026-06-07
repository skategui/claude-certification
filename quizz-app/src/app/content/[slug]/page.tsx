import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getContentBySlug } from "@/lib/content";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ContentDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const item = await getContentBySlug(decoded);
  if (!item) notFound();

  const assetBase = decoded.replace(/^content__/, "").split("__")[0];

  return (
    <div className="py-8 animate-float-in">
      <Link
        href="/content"
        className="inline-flex items-center text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] mb-6"
      >
        ← Retour au sommaire
      </Link>
      <article className="prose prose-slate max-w-none bg-[var(--color-card)] rounded-3xl p-8 ring-1 ring-[var(--color-border)] shadow-sm
        prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
        prose-a:text-[var(--color-primary)] prose-code:text-pink-700 prose-code:bg-pink-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-slate-900 prose-pre:text-slate-100">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt }) => {
              const raw = typeof src === "string" ? src : "";
              const isExternal = /^https?:\/\//i.test(raw);
              const filename = decodeURIComponent(raw.split("/").pop() ?? "");
              const finalSrc = isExternal
                ? raw
                : `/content-assets/${assetBase}/${filename}`;
              // eslint-disable-next-line @next/next/no-img-element
              return <img src={finalSrc} alt={alt ?? ""} className="rounded-xl" />;
            },
          }}
        >
          {item.body}
        </ReactMarkdown>
      </article>
    </div>
  );
}
