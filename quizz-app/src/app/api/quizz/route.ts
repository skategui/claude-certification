import { loadQuizz } from "@/lib/quizz";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST() {
  try {
    const quizz = await loadQuizz();
    return Response.json(quizz);
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    console.error("[/api/quizz]", e);
    return Response.json({ error: message }, { status: 500 });
  }
}
