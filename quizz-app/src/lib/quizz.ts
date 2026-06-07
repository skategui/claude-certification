import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

export const QuestionSchema = z.object({
  question: z.string().min(8),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  topic: z.string().min(1),
  explanation: z.string().optional(),
});

export const QuizzSchema = z.object({
  questions: z.array(QuestionSchema).length(50),
});

export type Question = z.infer<typeof QuestionSchema>;
export type Quizz = z.infer<typeof QuizzSchema>;

const RawEntrySchema = z.object({
  id: z.number(),
  topic: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.number().int().min(0).max(3),
  explanation: z.string().optional(),
});

const RawFileSchema = z.object({ quiz: z.array(RawEntrySchema) });

const QUIZ_PATH_CANDIDATES = [
  path.resolve(process.cwd(), "..", "quiz.json"),
  path.resolve(process.cwd(), "quiz.json"),
];

const readQuizFile = async (): Promise<z.infer<typeof RawFileSchema>> => {
  for (const p of QUIZ_PATH_CANDIDATES) {
    try {
      const raw = await fs.readFile(p, "utf8");
      const json = JSON.parse(raw);
      return RawFileSchema.parse(json);
    } catch {
      continue;
    }
  }
  throw new Error(
    `quiz.json not found. Looked in: ${QUIZ_PATH_CANDIDATES.join(", ")}`
  );
};

const sample = <T>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
};

export const loadQuizz = async (): Promise<Quizz> => {
  const file = await readQuizFile();
  if (file.quiz.length < 50) {
    throw new Error(`quiz.json has only ${file.quiz.length} questions; need >= 50.`);
  }
  const picked = sample(file.quiz, 50).map((q) => ({
    question: q.question,
    options: q.options,
    correctIndex: q.answer,
    topic: q.topic,
    explanation: q.explanation,
  }));
  return QuizzSchema.parse({ questions: picked });
};
