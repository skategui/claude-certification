"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  sampleQuestions,
  scenarios,
  domains,
  type SampleQuestion,
} from "@/lib/exam-blanc";
import { extraQuestions } from "@/lib/exam-blanc-extra";

const allQuestions: SampleQuestion[] = [...sampleQuestions, ...extraQuestions];

type Phase = "idle" | "playing" | "results";

type Answer = {
  questionId: number;
  picked: number;
  correct: boolean;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

export default function ExamBlancQuizzPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [order, setOrder] = useState<SampleQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const start = (shuffled: boolean) => {
    setOrder(shuffled ? shuffle(allQuestions) : allQuestions);
    setIndex(0);
    setPicked(null);
    setRevealed(false);
    setAnswers([]);
    setPhase("playing");
  };

  const pick = (i: number) => {
    if (revealed) return;
    setPicked(i);
    setRevealed(true);
    const q = order[index];
    setAnswers((prev) => [
      ...prev,
      { questionId: q.id, picked: i, correct: i === q.correctIndex },
    ]);
  };

  const next = () => {
    if (index + 1 >= order.length) {
      setPhase("results");
      return;
    }
    setIndex((n) => n + 1);
    setPicked(null);
    setRevealed(false);
  };

  if (phase === "idle") return <Idle onStart={start} />;
  if (phase === "results")
    return <Results answers={answers} order={order} onRedo={start} />;
  if (phase === "playing" && order.length > 0) {
    return (
      <Playing
        q={order[index]}
        index={index}
        total={order.length}
        picked={picked}
        revealed={revealed}
        score={answers.filter((a) => a.correct).length}
        onPick={pick}
        onNext={next}
      />
    );
  }
  return null;
}

const Idle = ({ onStart }: { onStart: (shuffled: boolean) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="text-center py-12"
  >
    <div className="text-6xl sm:text-7xl mb-6">📝</div>
    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
      Examen blanc officiel
    </h1>
    <p className="text-[var(--color-muted)] mb-2 max-w-2xl mx-auto">
      {allQuestions.length} questions : 1 par compétence du guide officiel
      Anthropic + questions tirées des 6 pages de domaines, avec explication
      détaillée + takeaway après chaque réponse.
    </p>
    <p className="text-sm text-[var(--color-muted)] mb-8">
      Couvre les 6 scénarios. Score final + breakdown par scénario.
    </p>

    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
      <button
        onClick={() => onStart(true)}
        className="px-6 py-4 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg shadow-indigo-200 hover:scale-105 transition-all"
      >
        🎲 Démarrer (ordre mélangé)
      </button>
      <button
        onClick={() => onStart(false)}
        className="px-6 py-4 rounded-full bg-white ring-1 ring-[var(--color-border)] font-semibold hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-all"
      >
        📖 Ordre original
      </button>
    </div>

    <Link
      href="/exam-blanc"
      className="inline-block mt-8 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]"
    >
      ← Retour vue d'ensemble
    </Link>
  </motion.div>
);

const Playing = ({
  q,
  index,
  total,
  picked,
  revealed,
  score,
  onPick,
  onNext,
}: {
  q: SampleQuestion;
  index: number;
  total: number;
  picked: number | null;
  revealed: boolean;
  score: number;
  onPick: (i: number) => void;
  onNext: () => void;
}) => {
  const pct = ((index + (revealed ? 1 : 0)) / total) * 100;
  const scenario = scenarios.find((s) => s.id === q.scenarioId);
  const domain = domains.find((d) => d.id === q.domainId);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 text-sm font-medium">
          <span className="text-[var(--color-muted)]">
            Question {index + 1} / {total}
          </span>
          <span className="text-[var(--color-primary)]">
            Score: {score} / {index + (revealed ? 1 : 0)}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[var(--color-primary-soft)] overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="bg-[var(--color-card)] rounded-3xl p-5 sm:p-8 shadow-sm ring-1 ring-[var(--color-border)]"
        >
          {scenario && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                {scenario.emoji} Scénario : {scenario.title}
              </span>
            </div>
          )}

          <h2 className="text-lg sm:text-xl font-semibold mb-3 leading-snug">
            {q.question}
          </h2>

          {domain && (
            <div className="mb-6">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${domain.color} text-slate-700 ring-1 ring-black/5`}
              >
                {domain.emoji} Domaine {domain.index} · {domain.title}
              </span>
            </div>
          )}

          <div className="grid gap-3">
            {q.options.map((opt, i) => {
              const isPicked = picked === i;
              const isCorrect = i === q.correctIndex;
              let cls =
                "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 font-medium text-sm sm:text-base";
              if (!revealed) {
                cls +=
                  " border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] cursor-pointer";
              } else if (isCorrect) {
                cls +=
                  " border-[var(--color-success)] bg-emerald-50 text-emerald-900";
              } else if (isPicked) {
                cls += " border-[var(--color-error)] bg-red-50 text-red-900";
              } else {
                cls += " border-[var(--color-border)] opacity-60";
              }
              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: revealed ? 1 : 0.98 }}
                  onClick={() => onPick(i)}
                  disabled={revealed}
                  className={cls}
                >
                  <span className="inline-block w-7 h-7 mr-3 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-sm font-bold leading-7 text-center align-top">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="inline-block w-[calc(100%-2.75rem)] align-top">
                    {opt}
                    {revealed && isCorrect && <span className="ml-2">✅</span>}
                    {revealed && isPicked && !isCorrect && (
                      <span className="ml-2">❌</span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 space-y-3"
            >
              <div className="p-4 rounded-xl bg-[var(--color-primary-soft)] text-sm">
                <div className="font-bold mb-1.5">💡 Explication</div>
                <p className="leading-relaxed">{q.explanation}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 ring-1 ring-amber-200 text-sm">
                <div className="font-bold mb-1.5 text-amber-900">
                  🎯 À retenir
                </div>
                <p className="leading-relaxed text-amber-900">{q.takeaway}</p>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={onNext}
                  className="px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:scale-105 transition-transform"
                >
                  {index + 1 >= total
                    ? "Voir résultat 🎉"
                    : "Question suivante →"}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Results = ({
  answers,
  order,
  onRedo,
}: {
  answers: Answer[];
  order: SampleQuestion[];
  onRedo: (shuffled: boolean) => void;
}) => {
  const total = order.length;
  const score = answers.filter((a) => a.correct).length;
  const pct = Math.round((score / total) * 100);

  const tier = useMemo(() => {
    if (pct >= 90)
      return { emoji: "🏆", title: "Niveau certif", color: "text-emerald-600" };
    if (pct >= 75)
      return { emoji: "🎉", title: "Très bien !", color: "text-indigo-600" };
    if (pct >= 60)
      return { emoji: "💪", title: "En progrès", color: "text-amber-600" };
    return { emoji: "📚", title: "À retravailler", color: "text-rose-600" };
  }, [pct]);

  const byScenario = useMemo(() => {
    const map = new Map<string, { correct: number; total: number }>();
    order.forEach((q, i) => {
      const a = answers[i];
      const cur = map.get(q.scenarioId) ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (a?.correct) cur.correct += 1;
      map.set(q.scenarioId, cur);
    });
    return Array.from(map.entries()).map(([id, stats]) => ({
      scenario: scenarios.find((s) => s.id === id)!,
      ...stats,
    }));
  }, [answers, order]);

  const wrongOnes = order
    .map((q, i) => ({ q, a: answers[i] }))
    .filter((x) => x.a && !x.a.correct);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="py-8 space-y-8"
    >
      <div className="text-center">
        <div className="text-7xl sm:text-8xl mb-4">{tier.emoji}</div>
        <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${tier.color}`}>
          {tier.title}
        </h1>
        <p className="text-2xl mb-1">
          Score : <span className="font-bold">{score}</span> / {total}
        </p>
        <p className="text-[var(--color-muted)]">{pct}%</p>
        <p className="text-xs text-[var(--color-muted)] mt-2">
          (Cible certif officielle : 720/1000 = ~72%)
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[var(--color-card)] ring-1 ring-[var(--color-border)]">
        <h2 className="text-xl font-bold mb-4">📊 Breakdown par scénario</h2>
        <div className="space-y-3">
          {byScenario.map(({ scenario, correct, total }) => {
            const sPct = Math.round((correct / total) * 100);
            return (
              <div key={scenario.id}>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="font-medium">
                    {scenario.emoji} {scenario.title}
                  </span>
                  <span className="font-bold">
                    {correct}/{total} ({sPct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-primary-soft)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sPct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`h-full ${
                      sPct >= 75
                        ? "bg-emerald-500"
                        : sPct >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {wrongOnes.length > 0 && (
        <div className="p-6 rounded-2xl bg-rose-50 ring-1 ring-rose-200">
          <h2 className="text-xl font-bold mb-4 text-rose-900">
            🔁 À réviser ({wrongOnes.length})
          </h2>
          <div className="space-y-3">
            {wrongOnes.map(({ q }) => (
              <details
                key={q.id}
                className="bg-white rounded-xl p-4 ring-1 ring-rose-200"
              >
                <summary className="cursor-pointer font-semibold text-sm">
                  {q.question}
                </summary>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="p-3 rounded-lg bg-emerald-50">
                    <span className="font-bold text-emerald-900">
                      ✅ Bonne réponse :{" "}
                    </span>
                    {q.options[q.correctIndex]}
                  </div>
                  <p className="text-[var(--color-muted)]">{q.explanation}</p>
                  <p className="text-amber-800 font-medium">🎯 {q.takeaway}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => onRedo(true)}
          className="px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg shadow-indigo-200 hover:scale-105 transition-transform"
        >
          🔄 Refaire (mélangé)
        </button>
        <Link
          href="/exam-blanc"
          className="px-6 py-3 rounded-full bg-white ring-1 ring-[var(--color-border)] font-semibold text-center hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-all"
        >
          📚 Réviser les domaines
        </Link>
      </div>
    </motion.div>
  );
};
