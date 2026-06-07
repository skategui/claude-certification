import Link from "next/link";
import { getAllContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ContentIndex() {
  const items = await getAllContent();
  const courses = items.filter((i) => i.source === "content");

  return (
    <div className="py-8 animate-float-in">
      <h1 className="text-4xl font-bold mb-2">📚 Contenu</h1>
      <p className="text-[var(--color-muted)] mb-10">
        {courses.length} fichier(s) — clique pour lire.
      </p>

      <Section title="📖 Cours" items={courses} />

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">🎧 Audiobook</h2>
        <div className="p-5 rounded-2xl bg-[var(--color-card)] ring-1 ring-[var(--color-border)]">
          <audio controls preload="metadata" className="w-full">
            <source src="/audiobook.fr.mp3" type="audio/mpeg" />
            Ton navigateur ne supporte pas la lecture audio.
          </audio>
        </div>
      </section>
    </div>
  );
}

const Section = ({
  title,
  items,
}: {
  title: string;
  items: { slug: string; title: string }[];
}) => {
  if (!items.length) return null;
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <Link
            key={it.slug}
            href={`/content/${encodeURIComponent(it.slug)}`}
            className="block p-5 rounded-2xl bg-[var(--color-card)] ring-1 ring-[var(--color-border)] hover:ring-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="font-medium">{it.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
