"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Quizz, Question } from "@/lib/quizz";

type Phase = "idle" | "loading" | "playing" | "results" | "error";

export default function QuizzPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string>("");
  const [quizz, setQuizz] = useState<Quizz | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const start = async () => {
    setPhase("loading");
    setError("");
    setIndex(0);
    setScore(0);
    setPicked(null);
    setRevealed(false);
    try {
      const r = await fetch("/api/quizz", { method: "POST" });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${r.status}`);
      }
      const data: Quizz = await r.json();
      setQuizz(data);
      setPhase("playing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setPhase("error");
    }
  };

  const pick = (i: number) => {
    if (revealed) return;
    setPicked(i);
    setRevealed(true);
    if (quizz && i === quizz.questions[index].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    if (!quizz) return;
    if (index + 1 >= quizz.questions.length) {
      setPhase("results");
      return;
    }
    setIndex((n) => n + 1);
    setPicked(null);
    setRevealed(false);
  };

  if (phase === "idle") return <Idle onStart={start} />;
  if (phase === "loading") return <Loading />;
  if (phase === "error") return <ErrorView msg={error} onRetry={start} />;
  if (phase === "results" && quizz)
    return <Results score={score} total={quizz.questions.length} onRedo={start} />;
  if (phase === "playing" && quizz) {
    const q = quizz.questions[index];
    return (
      <Playing
        q={q}
        index={index}
        total={quizz.questions.length}
        picked={picked}
        revealed={revealed}
        score={score}
        onPick={pick}
        onNext={next}
      />
    );
  }
  return null;
}

const Idle = ({ onStart }: { onStart: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="text-center py-16"
  >
    <div className="text-6xl sm:text-7xl mb-6">🧠</div>
    <h1 className="text-3xl sm:text-4xl font-bold mb-3">Prêt pour le quizz ?</h1>
    <p className="text-[var(--color-muted)] mb-8 max-w-xl mx-auto">
      50 questions tirées au hasard depuis la banque de 520. Une seule bonne réponse parmi 4. Bonne chance !
    </p>
    <button
      onClick={onStart}
      className="px-8 py-4 rounded-full bg-[var(--color-primary)] text-white font-semibold text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all duration-200"
    >
      🚀 Démarrer
    </button>
  </motion.div>
);

const Loading = () => (
  <div className="flex flex-col items-center justify-center py-24">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
      className="text-6xl mb-6"
    >
      ⚙️
    </motion.div>
    <h2 className="text-2xl font-bold mb-2">Chargement du quizz…</h2>
    <p className="text-[var(--color-muted)]">Tirage de 50 questions au hasard.</p>
  </div>
);

const ErrorView = ({ msg, onRetry }: { msg: string; onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-16"
  >
    <div className="text-6xl mb-4">😬</div>
    <h2 className="text-2xl font-bold mb-2">Échec de génération</h2>
    <p className="text-[var(--color-error)] mb-6 max-w-xl mx-auto break-words">{msg}</p>
    <button
      onClick={onRetry}
      className="px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:scale-105 transition-transform"
    >
      Réessayer
    </button>
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
  q: Question;
  index: number;
  total: number;
  picked: number | null;
  revealed: boolean;
  score: number;
  onPick: (i: number) => void;
  onNext: () => void;
}) => {
  const pct = ((index + (revealed ? 1 : 0)) / total) * 100;
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
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 leading-snug">{q.question}</h2>
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              #{q.topic}
            </span>
          </div>
          <div className="grid gap-3">
            {q.options.map((opt, i) => {
              const isPicked = picked === i;
              const isCorrect = i === q.correctIndex;
              let cls =
                "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 font-medium";
              if (!revealed) {
                cls += " border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] cursor-pointer";
              } else if (isCorrect) {
                cls += " border-[var(--color-success)] bg-emerald-50 text-emerald-900";
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
                  <span className="inline-block w-7 h-7 mr-3 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-sm font-bold leading-7 text-center">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {revealed && isCorrect && <span className="ml-2">✅</span>}
                  {revealed && isPicked && !isCorrect && <span className="ml-2">❌</span>}
                </motion.button>
              );
            })}
          </div>

          {revealed && q.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 rounded-xl bg-[var(--color-primary-soft)] text-sm"
            >
              💡 {q.explanation}
            </motion.div>
          )}

          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex justify-end"
            >
              <button
                onClick={onNext}
                className="px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:scale-105 transition-transform"
              >
                {index + 1 >= total ? "Voir résultat 🎉" : "Question suivante →"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Results = ({
  score,
  total,
  onRedo,
}: {
  score: number;
  total: number;
  onRedo: () => void;
}) => {
  const pct = Math.round((score / total) * 100);
  const tier =
    pct >= 90
      ? { emoji: "🏆", title: "Excellent !", color: "text-emerald-600" }
      : pct >= 70
      ? { emoji: "🎉", title: "Bien joué !", color: "text-indigo-600" }
      : pct >= 50
      ? { emoji: "💪", title: "Pas mal", color: "text-amber-600" }
      : { emoji: "📚", title: "À retravailler", color: "text-rose-600" };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="text-center py-16"
    >
      <div className="text-7xl sm:text-8xl mb-6">{tier.emoji}</div>
      <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${tier.color}`}>{tier.title}</h1>
      <p className="text-2xl mb-1">
        Score : <span className="font-bold">{score}</span> / {total}
      </p>
      <p className="text-[var(--color-muted)] mb-10">{pct}%</p>
      <button
        onClick={onRedo}
        className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[var(--color-primary)] text-white font-semibold text-base sm:text-lg shadow-lg shadow-indigo-200 hover:scale-105 transition-transform"
      >
        🔄 Refaire un quizz (50 nouvelles)
      </button>
    </motion.div>
  );
};
