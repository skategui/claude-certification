import type { SampleQuestion } from "./exam-blanc";
import data from "./exam-blanc-skills.json";

// 257 questions : 240 atomiques — une par ligne "Knowledge of" / "Skills in"
// du guide (taskRef "D1.1"…"D5.6", depuis study-guide/cca-bullets.json) + 17
// questions scénarisées d'origine, dédupliquées contre le bank (taskRef "orig").
export type SkillQuestion = SampleQuestion & { taskRef: string };

export const skillQuestions: SkillQuestion[] = data as SkillQuestion[];

/** Tire `count` questions au hasard parmi le bank (sans remise). */
export const drawRandom = (count: number): SkillQuestion[] => {
  const pool = [...skillQuestions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
};
