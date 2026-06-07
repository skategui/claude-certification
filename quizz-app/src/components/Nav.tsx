"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/quizz", label: "Quizz", emoji: "🧠" },
  { href: "/exam-blanc", label: "Exam blanc", emoji: "📝" },
  { href: "/content", label: "Contenu", emoji: "📚" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">✨</span>
          <span>Claude Cert</span>
        </Link>
        <nav className="flex items-center gap-1">
          {items.map((it) => {
            const active = pathname?.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[var(--color-primary)] text-white shadow-md shadow-indigo-200"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                }`}
              >
                <span className="sm:mr-1.5">{it.emoji}</span>
                <span className="hidden sm:inline">{it.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
