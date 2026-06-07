"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const cards = [
  {
    href: "/quizz",
    emoji: "🧠",
    title: "Quizz",
    desc: "50 questions tirées au hasard parmi 520. Score à la fin, possibilité de rejouer.",
    gradient: "from-indigo-100 to-purple-100",
  },
  {
    href: "/exam-blanc",
    emoji: "📝",
    title: "Examen blanc",
    desc: "Guide officiel: 5 domaines, 6 scénarios, 42 questions corrigées, cheatsheet anti-patterns + plan de prep.",
    gradient: "from-amber-100 to-yellow-100",
  },
  {
    href: "/content",
    emoji: "📚",
    title: "Contenu",
    desc: "Tout le matériel de préparation : 11 modules + index + audiobook.",
    gradient: "from-pink-100 to-orange-100",
  },
];

export default function Home() {
  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Préparation Claude Cert
        </h1>
        <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
          Réviser intelligemment. Quizz adaptatif, contenu structuré.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div
            key={c.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
          >
            <Link
              href={c.href}
              className={`block p-8 rounded-3xl bg-gradient-to-br ${c.gradient} hover:scale-[1.02] hover:shadow-xl transition-all duration-300 ring-1 ring-white/60`}
            >
              <div className="text-5xl mb-4">{c.emoji}</div>
              <h2 className="text-2xl font-bold mb-2">{c.title}</h2>
              <p className="text-[var(--color-muted)]">{c.desc}</p>
              <div className="mt-6 inline-flex items-center text-[var(--color-primary)] font-semibold">
                Commencer →
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
