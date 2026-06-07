# Claude Certification — Study Kit

An open-source, **free** preparation kit for the **Anthropic Claude certification**.

It bundles three things in one repo:

1. A **question bank** of 520 questions across every exam topic.
2. A set of **study modules** (Markdown) covering the full syllabus.
3. A small **Next.js web app** (`quizz-app/`) that turns all of it into an interactive study experience — random quizzes, a mock exam, a content reader, and an audiobook player.

No account, no API key, no paywall. Clone it and study.

---

## What's inside

```
claude_certif/                  ← repo root = the data root
├── quiz.json                   ← 520-question bank  { id, topic, question, options, answer }
├── content/                    ← 11 study modules (+ index.md), one Markdown file per topic
├── quizz/                      ← 3 long-form assessments (final exam, MCP exam, Claude Code quiz)
├── audiobook.md                ← study notes (EN source)
├── audiobook.fr.md             ← study notes (FR) → narrated below
├── audiobook.fr.mp3            ← ~15 min French audiobook of the notes
├── audiobook_chunks/           ← per-chapter MP3s (intermediate TTS output)
├── generate_audiobook.py       ← regenerates the audiobook via ElevenLabs TTS
└── quizz-app/                  ← the Next.js study app (deployable)
```

### Study topics (`content/`)

Skills · MCP · Claude Code in Action · Hooks · API · Prompt Evaluation · Prompt Engineering · Tools · RAG · Features of Claude · Agents & Workflows.

---

## The web app (`quizz-app/`)

A **Next.js 16 / React 19 / Tailwind v4** app with three sections:

| Section | What it does |
|---------|--------------|
| 🧠 **Quizz** | 50 questions drawn at random from the 520-question bank. Score at the end, replay anytime. |
| 📝 **Examen blanc** | A mock exam built from the official guide: 5 domains, 6 scenarios, 42 corrected questions, an anti-patterns cheatsheet, and a prep plan. |
| 📚 **Contenu** | All study modules rendered as Markdown, plus the French audiobook player. |

> **No runtime API key.** The app is fully static-data driven (`quiz.json` + hand-authored exam files). There are **no LLM calls at runtime**, so it runs with zero environment variables.

> **The app reads its data from the repo root**, not from inside `quizz-app/`. Paths resolve against `process.cwd()/..`. Keep `quizz-app/` as a subfolder of this repo and run it from there.

---

## Quick start

The app uses **[Bun](https://bun.sh)** (`bun.lock` is the lockfile).

```bash
git clone https://github.com/skategui/claude-certification.git
cd claude-certification/quizz-app
bun install
bun dev
```

Open **http://localhost:3000**.

| Script | Command |
|--------|---------|
| Dev server | `bun dev` |
| Production build | `bun run build` |
| Start built app | `bun start` |

---

## Deploy (Vercel)

This is a monorepo-style layout: the deployable app lives in `quizz-app/`, not the repo root.

1. Import the repo into Vercel.
2. Set **Root Directory** = `quizz-app`.
3. Framework preset: **Next.js** (auto-detected).
4. Deploy. No environment variables required.

---

## Regenerating the audiobook (optional)

`generate_audiobook.py` reads `audiobook.fr.md`, splits it by chapter, sends each chapter to **ElevenLabs** TTS, caches per-chapter MP3s in `audiobook_chunks/`, then concatenates them with **ffmpeg** into `audiobook.fr.mp3`.

```bash
export ELEVENLABS_API_KEY=your_key_here   # only needed to (re)generate audio
python3 generate_audiobook.py
```

Requirements: `python3`, `ffmpeg`, and an ElevenLabs API key. **This is the only part that needs a key** — the web app and quizzes never do.

---

## Contributing

Contributions welcome — especially:

- **New / corrected questions** in `quiz.json` (keep the `{ id, topic, question, options, answer }` shape).
- **Study-module fixes** in `content/`.
- **App improvements** in `quizz-app/` (Next.js 16 — read `quizz-app/AGENTS.md` first; it has breaking changes vs older Next versions).

Open an issue or a PR.

---

## License

Open source and free to use for your own certification prep. MIT — do whatever you want, no warranty.
