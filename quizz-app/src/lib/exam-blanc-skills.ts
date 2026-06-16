import type { SampleQuestion } from "./exam-blanc";
import data from "./exam-blanc-skills.json";

// 240 questions — une par ligne "Knowledge of" / "Skills in" du guide officiel
// (5 domaines × task statements). Généré depuis study-guide/cca-bullets.json.
// taskRef = référence de la task statement source (ex. "D3.6").
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
