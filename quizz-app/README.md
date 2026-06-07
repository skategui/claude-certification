# Claude Cert Quizz

A Next.js app to prepare for the Anthropic Claude certification. Three sections:

- **🧠 Quizz** — 50 questions drawn at random from a bank of 520. Score at the end, replay any time.
- **📝 Examen blanc** — mock exam built from the official guide: 5 domains, 6 scenarios, 42 corrected questions, an anti-patterns cheatsheet, and a prep plan.
- **📚 Contenu** — all the study material: 11 course modules (+ index) rendered as Markdown, plus an audiobook player.

## ⚠️ Data lives in the parent directory

The app reads its study data **from the directory that contains `quizz-app/`**, not from inside it. `loadQuizz()` and the content loader resolve paths against `process.cwd()/..`:

```
claude_certif/            ← parent (data root)
├── quiz.json             ← 520 questions  (required by /quizz)
├── content/              ← 11 module .md files + index.md  (read by /content)
├── quizz/                ← extra .md assessments  (read by /content)
└── quizz-app/            ← this Next.js app  (run from here)
```

Run the app from the `quizz-app/` directory. If `quiz.json` is missing, `/api/quizz` returns a 500 and the quizz page shows an error. The audiobook MP3 is served from `public/audiobook.fr.mp3`.

## No API key required

Everything is powered by **static data** — `quiz.json` and the hand-authored `src/lib/exam-blanc*.ts`. There is **no LLM call at runtime**, so the app needs no environment variable to run.

## Stack

- **Next.js 16.2.5** (App Router, `src/app/`) · **React 19** · **TypeScript**
- **Tailwind CSS v4** + `@tailwindcss/typography`
- **framer-motion** (animations) · **react-markdown** + **remark-gfm** (content rendering) · **zod** (quiz validation)

## Getting started

This project uses **Bun** (`bun.lock` is the lockfile — no npm/yarn/pnpm lockfile present).

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

Edit pages under `src/app/`; the home screen is `src/app/page.tsx`. Pages auto-update on save.

## Routes

| Route | What it does |
|-------|--------------|
| `/` | Home — links to the three sections |
| `/quizz` | Random 50-question quizz (calls `POST /api/quizz`) |
| `/api/quizz` | Samples 50 questions from `quiz.json` |
| `/exam-blanc` | Mock-exam overview: domains, scenarios, patterns, anti-patterns, scope, prep plan |
| `/exam-blanc/quizz` | The 42-question mock exam with per-scenario breakdown |
| `/content` | List of course modules + audiobook player |
| `/content/[slug]` | A single module rendered from Markdown |

## Scripts

```bash
bun dev      # next dev
bun run build # next build
bun start    # next start
```

## Working in this repo

See [`AGENTS.md`](./AGENTS.md): this is Next.js 16, which has breaking changes versus older versions — read the relevant guide in `node_modules/next/dist/docs/` before writing code.
