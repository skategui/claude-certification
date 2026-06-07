# Domaine 3 — Claude Code Configuration & Workflows

> Claude Certified Architect — Foundations · **Domaine 3 · ~20 % de l'examen**
> Source : https://claudecertifications.com/claude-certified-architect/domains/claude-code-config

---

## Overview

Domain 3 covers **how to configure Claude Code and orchestrate effective workflows**: the
CLAUDE.md configuration hierarchy, extension mechanisms (custom commands vs skills), planning
strategies (plan mode vs direct execution, TDD iteration), and integrating Claude into automated
pipelines (CI/CD headless mode, Batch API). The recurring theme is **choosing the right mechanism
for the task** — modular config over monoliths, skills over commands when isolation is needed,
plan mode only when complexity warrants it, and **session isolation** to avoid confirmation bias.

### Subtopics

| ID    | Subtopic |
|-------|----------|
| d3.1  | CLAUDE.md Hierarchy & Configuration |
| d3.2  | Custom Commands & Skills |
| d3.3  | Skills with Forked Context & Tool Restriction |
| d3.4  | Plan Mode & Iterative Refinement |
| d3.5  | CI/CD Integration & Batch Processing |

### Exam Tips for Domain 3 (page summary)

1. Know the **CLAUDE.md hierarchy: user > project > directory** (precedence direction).
2. Understand **when to use plan mode vs direct execution**.
3. **CI/CD uses the `-p` flag with `--output-format json`** for automation.
4. **Batch API offers 50 % savings** — know when to use synchronous vs batch.

---

## d3.1 — CLAUDE.md Hierarchy & Configuration

> Understand the CLAUDE.md configuration hierarchy and how project, user, and directory-level
> settings interact.

Claude Code uses a **hierarchical configuration system** with three layers that merge together.
Understanding the precedence and purpose of each layer is essential.

### The three configuration layers

| Layer | Location | Purpose | Example |
|-------|----------|---------|---------|
| **User** | `~/.claude/CLAUDE.md` | Personal preferences, **not shared** | editor prefs, terminal settings |
| **Project** | `.claude/CLAUDE.md` | Team standards, **shared via git** | language, framework, coding standards |
| **Directory** | `src/api/CLAUDE.md` | Scoped to that directory and below | API-specific rules, module conventions |

### Precedence (key fact)

> **More specific configs override more general ones.**
> **Directory-level > Project-level > User-level.**

### Modular configuration with `@import` and `.claude/rules/`

- Split rules into **topic-specific files** instead of one massive CLAUDE.md.
- `@import ./rules/typescript.md` pulls in TypeScript-specific rules (modular include syntax).
- Files in the `.claude/rules/` directory are **auto-loaded** as rule sets.
- Rules can have **path-specific scope** using YAML frontmatter with `paths` glob patterns.

This modular approach makes rules easier to find, maintain, and lets different team members own
different rule files.

### Configuration layers — summary list

- **User-level**: `~/.claude/CLAUDE.md` (personal preferences across all projects)
- **Project-level**: `.claude/CLAUDE.md` (shared team configuration)
- **Directory-level**: `CLAUDE.md` in any directory (scoped to that directory and below)
- **`@import` syntax**: include external markdown files for modular configuration
- **`.claude/rules/` directory**: topic-specific rule files for organized configuration

### Code example — Configuration Hierarchy (file structure)

```text
~/.claude/
  CLAUDE.md                 # User-level: personal prefs across all projects

<project>/
  .claude/
    CLAUDE.md               # Project-level: team standards, shared via git
    rules/                  # Auto-loaded topic-specific rule files
      typescript.md
      testing.md            # Can use YAML frontmatter `paths:` glob scope
  src/
    api/
      CLAUDE.md             # Directory-level: scoped to src/api and below
```

```markdown
# .claude/CLAUDE.md  (project-level)
@import ./rules/typescript.md
@import ./rules/testing.md
```

### Expected patterns / ✅ Correct

- Use **modular rules** (`.claude/rules/`, `@import`) instead of one giant CLAUDE.md.
- Put **personal** prefs at user level, **team** standards at project level (shared via git), and
  **module-specific** conventions at directory level.
- Know the precedence direction: **directory overrides project overrides user**.
- Scope a rule to specific files with `paths:` glob patterns in YAML frontmatter.

### Anti-patterns / ❌ Avoid

- ❌ Putting **all configuration in one massive CLAUDE.md** instead of using modular rules.
- ❌ Not understanding the **precedence** of user vs project vs directory configs (e.g. assuming
  user-level wins — it does not; directory-level is most specific and wins).

---

## d3.2 — Custom Commands & Skills

> Create custom slash commands and skills to extend Claude Code's capabilities for your team.

Claude Code supports **two extension mechanisms** — custom commands and skills. Understanding
**when to use each** is critical (and a frequent exam discriminator).

### Custom Commands — `.claude/commands/`

- Simple **slash commands** like `/review`, `/deploy`, `/test`.
- Defined as **markdown files** with instructions.
- Run in the **current session context** (same context window).
- Good for **quick, one-step actions**.
- Shared with the team via version control.

### Skills — `.claude/skills/`

- **Complex, multi-step reusable behaviors.**
- Defined as **`SKILL.md`** files with **YAML frontmatter**.
- Can **fork context** (isolated execution without polluting the main session).
- Can **restrict tool access** via `allowed-tools`.
- Good for complex operations that **need isolation**.

### `SKILL.md` frontmatter fields

- `context: fork` — run in an **isolated context** (separate from the main session).
- `allowed-tools` — **restrict** which tools the skill can use (e.g. `[Read, Edit, Grep]`).
- `argument-hint` — describe the expected argument.

### Commands and skills system — summary list

- **Custom slash commands**: `.claude/commands/` directory for team-shareable shortcuts.
- **Skills**: `.claude/skills/` directory with `SKILL.md` for complex, reusable behaviors.
- **`SKILL.md` frontmatter**: `context: fork`, `allowed-tools`, `argument-hint`.
- **Path-specific rules**: YAML frontmatter with `paths` glob patterns for targeted configuration.

### When to use which

| Need | Use |
|------|-----|
| "Run lint and show me the errors" → simple, no isolation needed | **Command** |
| "Refactor this module to use dependency injection" → complex, needs context isolation | **Skill** |

### Expected patterns / ✅ Correct

- Use a **command** for quick, one-step, no-isolation actions.
- Use a **skill** for complex, multi-step work that needs **context isolation** and/or **tool
  restriction**.
- Always specify **`allowed-tools`** in skills to keep tool access tight.

### Anti-patterns / ❌ Avoid

- ❌ Using **commands when skills (with forked context) would be more appropriate**.
- ❌ **Not specifying `allowed-tools`** in skills, leaving overly broad tool access.

---

## d3.3 — Skills with Forked Context & Tool Restriction

> 🎯 **Exam Tip (d3.3):** If the task requires **context isolation** or **tool restriction**, the
> answer is a **skill (not a command)**. Look for **`context: fork`** and **`allowed-tools`** in
> the correct answer.

This subtopic concretizes d3.2 with the canonical contrast: a *command* that tries to do complex,
codebase-wide exploration (wrong) versus a *skill* that forks context and restricts tools (right).

### Anti-pattern vs Correct approach

```markdown
# ✗ Anti-Pattern — using a COMMAND for complex exploration
# .claude/commands/refactor.md
Refactor the given code to use dependency injection.
Look through all files and restructure the codebase.
```

Problem: it runs in the **current session context** (no isolation), and has **unrestricted tool
access** — a complex, multi-file exploration pollutes the main context window and can touch
anything.

```markdown
# ✓ Correct — using a SKILL with forked context + restricted tools
# .claude/skills/refactor/SKILL.md
---
context: fork          # Isolated from main context
allowed-tools:         # Restricted tool access
  - Read
  - Edit
  - Grep
argument-hint: "the module or function to refactor"
---
Refactor the given code to use DI.

## Steps
1. Read the target files.
2. Explore the structure with Grep.
3. Plan the refactoring approach before making changes.
4. Apply changes incrementally using Edit (never Write).
5. Verify each change maintains existing behavior.

## Rules
- Never delete existing tests.
- Preserve all public API signatures.
- Add JSDoc comments to refactored functions.
```

> **Exploration stays in the fork. Restricted tools.** The skill keeps the heavy exploration out
> of the main session and limits the blast radius (Read/Edit/Grep only — no Write, no Bash).

### Expected patterns / ✅ Correct

- For complex exploration/refactor work, choose a **skill** with **`context: fork`**.
- Restrict the skill with **`allowed-tools`** (e.g. `Read`, `Edit`, `Grep`).
- Apply changes **incrementally with `Edit`** (not `Write`); preserve tests and public API
  signatures.

### Anti-patterns / ❌ Avoid

- ❌ Using a **command** for complex, multi-file exploration (no isolation, pollutes main context).
- ❌ Leaving tool access **unrestricted** when the task only needs read/edit/grep.

---

## d3.4 — Plan Mode & Iterative Refinement

**Plan mode** tells Claude to **think and outline an approach before executing**. It is critical
for complex tasks and wasteful for simple ones.

### When to use plan mode

- Multi-file architectural changes.
- Tasks affecting many interconnected components.
- Situations where mistakes are **expensive to undo**.
- New feature implementation requiring design decisions.

### When to use direct execution

- Simple, well-defined tasks (fix a typo, add a log statement).
- Single-file changes with clear scope.
- Tasks where the correct approach is obvious.

### Iterative refinement patterns

- **Concrete examples** — "Here's what I want: `[specific example]`" → good for formatting, style.
- **TDD iteration** — Write tests → implement → test → refine → repeat.
- **Interview pattern** — "Ask me 3 questions before you start" → good for **ambiguous
  requirements**.

### The TDD iteration cycle (preferred refinement pattern)

TDD iteration gives Claude a **concrete, verifiable goal at each step**:

1. **Write failing test** → defines expected behavior.
2. **Implement** → make the test pass.
3. **Run tests** → verify correctness.
4. **Refine** → improve code quality while keeping tests green.
5. **Repeat** for the next requirement.

This dramatically improves output quality compared to a single "implement this feature" prompt.

### Code example — TDD iteration session

```text
# Step 1: Write the failing tests first
You:   "Write 3 tests for a parseConnectionString() function"
Claude: [writes 3 failing tests defining expected behavior]

# Step 2: Implement to pass the tests
You:   "Now implement parseConnectionString() so those tests pass"
Claude: [implements the function]

# Step 3: Run tests again (should pass)
You:   "Run the tests"
Claude: "All 3 tests pass"

# Step 4: Refine while keeping tests green
You:   "Add input sanitization and connection pooling,
        keeping all tests green"
```

> 🎯 **Exam Tip (d3.4):** For complex multi-file tasks use **plan mode**. For simple fixes use
> **direct execution**. **TDD iteration** (write test, implement, verify) is the preferred
> refinement pattern.

### Expected patterns / ✅ Correct

- Use **plan mode** for multi-file / architectural / hard-to-undo work.
- Use **direct execution** for trivial, single-file, obvious tasks.
- Prefer **TDD iteration** to give Claude a concrete, verifiable goal each step.
- Use the **interview pattern** ("ask me 3 questions first") when requirements are ambiguous.

### Anti-patterns / ❌ Avoid

- ❌ Using **plan mode for simple, well-defined tasks** (unnecessary overhead).
- ❌ **Skipping planning for complex tasks** that need architectural thinking first.

---

## d3.5 — CI/CD Integration & Batch Processing

Claude Code integrates into CI/CD pipelines using the **`-p` flag** for non-interactive execution
and structured-output flags for automated processing.

### Key CI/CD flags

- **`-p`** — Non-interactive (headless) mode, **required for CI**.
- **`--output-format json`** — Structured JSON output for parsing/automation.
- **`--json-schema`** — Enforce a specific output shape.

### CI/CD and batch processing patterns — summary list

- **`-p` flag**: run Claude Code in non-interactive mode for CI/CD pipelines.
- **`--output-format json`**: get structured output for automated processing.
- **`--json-schema`**: enforce specific output schemas.
- **Session context isolation in CI**: separate generator and reviewer contexts.
- **Message Batches API**: 50 % cost savings with a 24-hour processing window.
- **`custom_id`**: track individual requests in batch processing.

### Session isolation for code review (confirmation bias)

The **generator** session (that wrote the code) must be **completely separate** from the
**reviewer** session. Why? If the reviewer runs in the **same session**, it **retains the
generator's reasoning**, creating **confirmation bias**.

```bash
# ✓ Correct — Separate session for review (reviewer has NO context from generation)
claude -p "Write a new auth module"   # Session A (generator)
claude -p "Review this diff: ..."     # Session B (fresh — no generator context)
```

> **Reviewer retains reasoning context = confirmation bias.**
> **Reviewer has no context from generation = unbiased review.**

### Batch processing with the Message Batches API

- Processes within **24 hours** (non-blocking).
- **50 % cost savings** compared to synchronous requests.
- Each request gets a **`custom_id`** for tracking.
- **Use for**: nightly audits, weekly reviews, non-urgent analysis.
- **Don't use for**: blocking PR reviews, real-time feedback.

### Code example — `ci-review.yml` (CI/CD code review pipeline)

```yaml
name: Claude Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Use -p flag for non-interactive mode
      # Use a SEPARATE session from code generation
      - name: Review diff
        run: |
          claude -p "Review this diff: $(git diff origin/main)" \
            --output-format json
```

### Expected patterns / ✅ Correct

- Run Claude **headless with `-p`** in CI; parse results with **`--output-format json`** (and
  optionally **`--json-schema`**).
- Keep the **generator and reviewer in separate sessions** so the review is unbiased.
- Use the **Batch API** for non-urgent, non-blocking work (nightly audits, weekly reviews) to save
  **50 %**; track requests via **`custom_id`**.
- Use **synchronous** requests for **blocking PR reviews / real-time feedback**.

### Anti-patterns / ❌ Avoid

- ❌ Using **interactive mode in CI/CD pipelines** (must be non-interactive `-p`).
- ❌ **Same-session self-review** (retains reasoning context → confirmation bias).
- ❌ **Not isolating generator and reviewer** sessions in code-review pipelines.
- ❌ Using the **Batch API for blocking PR reviews or real-time feedback** (24-hour window makes it
  unsuitable) — and conversely paying full price synchronously for non-urgent nightly/weekly jobs.

---

## Quick-reference cheat sheet

| Question | Answer |
|----------|--------|
| CLAUDE.md precedence | **Directory > Project > User** (more specific wins) |
| Personal prefs vs team standards | User = personal (not shared); Project = team (shared via git) |
| One big CLAUDE.md? | No — use `.claude/rules/` + `@import` (modular) |
| Command vs Skill | Command = simple, same context. Skill = complex, **`context: fork`** + **`allowed-tools`** |
| Task needs isolation / tool restriction | **Skill**, not command |
| Complex multi-file change | **Plan mode** |
| Simple typo / one-file fix | **Direct execution** |
| Preferred refinement pattern | **TDD iteration** (write test → implement → verify → refine) |
| Ambiguous requirements | **Interview pattern** ("ask me 3 questions first") |
| Run Claude in CI | **`-p`** (non-interactive) + **`--output-format json`** |
| Code review in CI | **Separate generator/reviewer sessions** (avoid confirmation bias) |
| Non-urgent bulk work | **Batch API** — 50 % savings, 24h window, `custom_id` |
| Blocking PR review / real-time | **Synchronous**, not Batch API |

---

## Related exam scenarios

- **Developer Productivity with Claude** — build developer tools using the Claude Agent SDK with
  built-in tools and MCP servers; tests tool selection, codebase exploration, and code-generation
  workflows.

### Domain navigation

- Previous domain: **Tool Design & MCP**
- Next domain: **Prompt Engineering**
