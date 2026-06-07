"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  examMeta,
  domains,
  scenarios,
  inScope,
  outOfScope,
  prepSteps,
  keyPatterns,
  sampleQuestions,
} from "@/lib/exam-blanc";
import { antiPatterns, extraQuestions } from "@/lib/exam-blanc-extra";

const totalQuestions = sampleQuestions.length + extraQuestions.length;

type Tab =
  | "overview"
  | "domains"
  | "scenarios"
  | "patterns"
  | "antipatterns"
  | "scope"
  | "plan";

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "overview", label: "Vue d'ensemble", emoji: "🎯" },
  { id: "domains", label: "Domaines", emoji: "🗂️" },
  { id: "scenarios", label: "Scénarios", emoji: "🎬" },
  { id: "patterns", label: "Patterns clés", emoji: "🔑" },
  { id: "antipatterns", label: "Anti-patterns", emoji: "⚠️" },
  { id: "scope", label: "Scope", emoji: "✅" },
  { id: "plan", label: "Plan de prep", emoji: "📋" },
];

export default function ExamBlancPage() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="py-8 animate-float-in">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-3">📝</div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Examen blanc</h1>
        <p className="text-[var(--color-muted)] max-w-2xl mx-auto">
          {examMeta.name} — réviser comme un jeu, comprendre les pièges,
          démarrer un mock exam.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center mb-8 sticky top-16 z-20 bg-white/70 backdrop-blur-md py-3 -mx-4 sm:-mx-6 px-4 sm:px-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              tab === t.id
                ? "bg-[var(--color-primary)] text-white shadow-md shadow-indigo-200"
                : "text-[var(--color-muted)] bg-white ring-1 ring-[var(--color-border)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
            }`}
          >
            <span className="mr-1.5">{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {tab === "overview" && <Overview />}
          {tab === "domains" && <Domains />}
          {tab === "scenarios" && <Scenarios />}
          {tab === "patterns" && <Patterns />}
          {tab === "antipatterns" && <AntiPatterns />}
          {tab === "scope" && <Scope />}
          {tab === "plan" && <Plan />}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 text-center">
        <Link
          href="/exam-blanc/quizz"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-primary)] text-white font-semibold text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all duration-200"
        >
          🚀 Démarrer l'examen blanc ({totalQuestions} questions)
        </Link>
        <p className="text-sm text-[var(--color-muted)] mt-3">
          Questions tirées du guide officiel, avec explications après chaque
          réponse.
        </p>
      </div>
    </div>
  );
}

const Stat = ({
  value,
  label,
  emoji,
}: {
  value: string;
  label: string;
  emoji: string;
}) => (
  <div className="p-5 rounded-2xl bg-[var(--color-card)] ring-1 ring-[var(--color-border)] text-center">
    <div className="text-3xl mb-1">{emoji}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-[var(--color-muted)] mt-1">{label}</div>
  </div>
);

const Overview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Stat
        emoji="🎯"
        value={String(examMeta.passingScore)}
        label="Score requis (sur 1000)"
      />
      <Stat emoji="📊" value={examMeta.scoreRange} label="Échelle scaled" />
      <Stat
        emoji="🎬"
        value={`${examMeta.scenariosOnExam}/${examMeta.totalScenarios}`}
        label="Scénarios tirés"
      />
      <Stat emoji="📝" value="QCM" label="1 bonne / 4" />
    </div>

    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100">
      <h2 className="text-xl font-bold mb-3">🧭 Comment l'exam fonctionne</h2>
      <ul className="space-y-2 text-sm">
        <li>
          ✅ <b>QCM</b>: 1 bonne réponse, 3 distracteurs. Pas de pénalité au
          mauvais.
        </li>
        <li>
          ✅ <b>Scaled scoring</b>: 100–1000, passage à 720 (équilibre entre
          formes d'examen).
        </li>
        <li>
          ✅ <b>4 scénarios sur 6</b> tirés au hasard pour ta session.
        </li>
        <li>
          ✅ <b>Cible candidat</b>: {examMeta.experienceTarget}.
        </li>
        <li>
          ✅ <b>Hors-scope strict</b>: pas de fine-tuning, infra, vision, OAuth
          (voir onglet Scope).
        </li>
      </ul>
    </div>

    <div className="p-6 rounded-2xl bg-[var(--color-card)] ring-1 ring-[var(--color-border)]">
      <h2 className="text-xl font-bold mb-3">⚖️ Poids des domaines</h2>
      <div className="space-y-2">
        {domains.map((d) => (
          <div key={d.id}>
            <div className="flex items-center justify-between mb-1 text-sm">
              <span className="font-medium">
                {d.emoji} {d.title}
              </span>
              <span className="font-bold text-[var(--color-primary)]">
                {d.weight}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--color-primary-soft)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.weight * 3.7}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-[var(--color-primary)]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Domains = () => (
  <div className="grid sm:grid-cols-2 gap-4">
    {domains.map((d, i) => (
      <motion.div
        key={d.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
        className={`p-6 rounded-2xl bg-gradient-to-br ${d.color} ring-1 ring-white/60`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{d.emoji}</div>
          <span className="px-3 py-1 rounded-full bg-white/70 text-xs font-bold">
            {d.weight}%
          </span>
        </div>
        <h3 className="text-lg font-bold mb-1">
          Domaine {d.index} — {d.title}
        </h3>
        <p className="text-sm text-[var(--color-muted)] mb-4">{d.summary}</p>
        <details className="text-sm">
          <summary className="cursor-pointer font-semibold text-[var(--color-primary)]">
            Concepts clés ({d.keyConcepts.length})
          </summary>
          <ul className="mt-3 space-y-1.5 list-disc list-inside">
            {d.keyConcepts.map((k, j) => (
              <li key={j}>{k}</li>
            ))}
          </ul>
        </details>
      </motion.div>
    ))}
  </div>
);

const Scenarios = () => (
  <div className="grid sm:grid-cols-2 gap-4">
    {scenarios.map((s, i) => (
      <motion.div
        key={s.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
        className="p-6 rounded-2xl bg-[var(--color-card)] ring-1 ring-[var(--color-border)] hover:ring-[var(--color-primary)] transition-all"
      >
        <div className="text-4xl mb-3">{s.emoji}</div>
        <h3 className="text-lg font-bold mb-2">{s.title}</h3>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          {s.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {s.domains.map((domId) => {
            const d = domains.find((x) => x.id === domId);
            if (!d) return null;
            return (
              <span
                key={domId}
                className="px-2 py-1 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-xs font-medium"
              >
                {d.emoji} {d.title.split(" ")[0]}
              </span>
            );
          })}
        </div>
      </motion.div>
    ))}
  </div>
);

const Patterns = () => (
  <div className="grid sm:grid-cols-2 gap-4">
    {keyPatterns.map((p, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: i * 0.04 }}
        className="p-5 rounded-2xl bg-[var(--color-card)] ring-1 ring-[var(--color-border)]"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">{p.emoji}</div>
          <h3 className="font-bold">{p.title}</h3>
        </div>
        <p className="text-sm text-[var(--color-muted)]">{p.rule}</p>
      </motion.div>
    ))}
  </div>
);

const sevMeta = {
  critical: {
    label: "Critique",
    ring: "ring-rose-200",
    bg: "bg-rose-50",
    dot: "bg-rose-500",
    text: "text-rose-900",
  },
  high: {
    label: "Élevé",
    ring: "ring-amber-200",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
    text: "text-amber-900",
  },
  medium: {
    label: "Moyen",
    ring: "ring-slate-200",
    bg: "bg-slate-50",
    dot: "bg-slate-400",
    text: "text-slate-700",
  },
} as const;

const AntiPatterns = () => {
  const order = ["critical", "high", "medium"] as const;
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 ring-1 ring-rose-100">
        <h2 className="text-lg font-bold mb-1">
          ⚠️ Anti-patterns — les distracteurs classiques
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          Les {antiPatterns.length} mauvaises réponses les plus fréquentes de
          l&apos;exam. Repère le piège, élimine 2-3 options avant même de lire
          la bonne réponse. (Source : cheatsheet officielle des anti-patterns.)
        </p>
      </div>
      {order.map((sev) => {
        const items = antiPatterns.filter((p) => p.severity === sev);
        if (!items.length) return null;
        const m = sevMeta[sev];
        return (
          <div key={sev}>
            <h3 className={`font-bold mb-3 flex items-center gap-2 ${m.text}`}>
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${m.dot}`}
              />
              {m.label} ({items.length})
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((p, i) => {
                const d = domains.find((x) => x.id === p.domainId);
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className={`p-4 rounded-2xl ${m.bg} ring-1 ${m.ring}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-sm leading-snug">
                        {p.title}
                      </h4>
                      {d && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-white/70 text-[10px] font-bold">
                          {d.emoji} D{d.index}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-1.5">
                      <span className="font-bold text-rose-700">
                        ❌ Piège :{" "}
                      </span>
                      {p.trap}
                    </p>
                    <p className="text-sm mb-1.5">
                      <span className="font-bold text-emerald-700">
                        ✅ Correct :{" "}
                      </span>
                      {p.correct}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">
                      <span className="font-semibold">Pourquoi : </span>
                      {p.why}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Scope = () => (
  <div className="space-y-6">
    {inScope.map((s, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
        className="p-5 rounded-2xl bg-emerald-50 ring-1 ring-emerald-200"
      >
        <h3 className="font-bold mb-3 text-emerald-900">✅ {s.title}</h3>
        <ul className="space-y-1.5 text-sm">
          {s.items.map((it, j) => (
            <li key={j} className="flex gap-2">
              <span className="text-emerald-600 mt-0.5">•</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    ))}
    {outOfScope.map((s, i) => (
      <motion.div
        key={`out-${i}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="p-5 rounded-2xl bg-rose-50 ring-1 ring-rose-200"
      >
        <h3 className="font-bold mb-3 text-rose-900">🚫 {s.title}</h3>
        <ul className="space-y-1.5 text-sm">
          {s.items.map((it, j) => (
            <li key={j} className="flex gap-2">
              <span className="text-rose-600 mt-0.5">•</span>
              <span className="text-rose-900/80">{it}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    ))}
  </div>
);

const Plan = () => (
  <div className="space-y-3">
    {prepSteps.map((s, i) => (
      <motion.div
        key={s.step}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: i * 0.04 }}
        className="p-5 rounded-2xl bg-[var(--color-card)] ring-1 ring-[var(--color-border)] flex gap-4"
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center">
          {s.step}
        </div>
        <div className="flex-1">
          <h3 className="font-bold mb-1">
            {s.emoji} {s.title}
          </h3>
          <p className="text-sm text-[var(--color-muted)]">{s.description}</p>
        </div>
      </motion.div>
    ))}
  </div>
);
