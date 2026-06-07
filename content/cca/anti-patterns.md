# Anti-Patterns Cheatsheet

> The most common wrong answers and distractors on the **Claude Certified Architect** exam. Learn to spot them instantly and eliminate 2-3 options before even reading the correct answer.

**Totals:** 10 critical · 7 high priority · 18 total patterns across 5 domains.

Memorizing these anti-patterns lets you instantly eliminate 2-3 wrong answers on most exam questions. Each entry follows the shape: **Trap (❌ what to avoid) → Correct (✅ what to do) → Why**.

## Domains

| # | Domain | Patterns |
|---|--------|----------|
| D1 | Agentic Architecture | 5 |
| D2 | Tool Design & MCP | 4 |
| D3 | Claude Code Config | 3 |
| D4 | Prompt Engineering | 3 |
| D5 | Context & Reliability | 3 |

---

## D1 — Agentic Architecture (5 patterns)

### 1. Parsing natural language for loop termination — `Critical`

- ❌ **Trap (avoid):** Parsing the model's natural-language text output to decide whether the agentic loop should stop.
- ✅ **Correct:** Check the `stop_reason` field (`tool_use` vs `end_turn`).
- **Why:** Text content is for the user, not control flow. The model may phrase completion differently each time. `stop_reason` is a structured, deterministic field that reliably signals whether the agent needs to continue.

### 2. Arbitrary iteration caps as primary stopping mechanism — `Critical`

- ❌ **Trap (avoid):** Using a fixed iteration count (e.g., "stop after 10 loops") as the *primary* stopping mechanism.
- ✅ **Correct:** Let the agentic loop terminate naturally via `stop_reason`.
- **Why:** An arbitrary cap may cut off the agent mid-task or allow it to loop pointlessly. It does not reflect task completion. The model decides when it is done based on task state, not an arbitrary number.

### 3. Prompt-based enforcement for critical business rules — `Critical`

- ❌ **Trap (avoid):** Enforcing critical business rules by writing instructions in the prompt.
- ✅ **Correct:** Use programmatic hooks (`PreToolUse` / `PostToolUse`) for deterministic enforcement.
- **Why:** Prompts are probabilistic — the model CAN and WILL sometimes ignore critical instructions. Hooks run as code, not suggestions, so they provide 100% reliable enforcement.

### 4. Sentiment-based escalation to human agents — `High`

- ❌ **Trap (avoid):** Escalating to a human agent based on customer sentiment (e.g., "the customer sounds angry").
- ✅ **Correct:** Escalate based on policy gaps, capability limits, explicit requests, or business thresholds.
- **Why:** An angry customer with a simple request does NOT need a human. Sentiment does not equal task complexity. Objective criteria prevent unnecessary escalations while still catching genuine edge cases.

### 5. Self-reported confidence scores for decision-making — `High`

- ❌ **Trap (avoid):** Using the model's self-reported confidence score to drive production decisions (e.g., when to escalate).
- ✅ **Correct:** Use structured criteria and programmatic checks for escalation decisions.
- **Why:** Model confidence scores are not well-calibrated and cannot be relied upon for production decisions. Programmatic checks based on observable facts are reliable and auditable.

---

## D2 — Tool Design & MCP (4 patterns)

### 6. Generic error messages ('Operation failed') — `Critical`

- ❌ **Trap (avoid):** Returning generic error strings like `'Operation failed'` from a tool.
- ✅ **Correct:** Return structured errors: `isError`, `errorCategory`, `isRetryable`, and `context`.
- **Why:** The agent cannot decide whether to retry, try an alternative, or escalate without details. Structured errors give the agent enough information to make intelligent recovery decisions.

```json
{
  "isError": true,
  "errorCategory": "RATE_LIMIT",
  "isRetryable": true,
  "context": "Retry after 30s; quota resets at 14:05 UTC"
}
```

### 7. Silently returning empty results for access failures — `Critical`

- ❌ **Trap (avoid):** Returning an empty result set when the tool could not even perform the lookup (e.g., a permissions/access failure).
- ✅ **Correct:** Distinguish access failures (`isError: true`) from genuinely empty results (`isError: false, results: []`).
- **Why:** The agent thinks "no results found" when the real problem is "could not even check." This leads to catastrophic misunderstandings. With the distinction, the agent knows whether data is missing because it was not found vs. because the search failed.

### 8. Giving one agent 18+ tools — `High`

- ❌ **Trap (avoid):** Loading a single agent with a large tool set (18+ tools).
- ✅ **Correct:** Keep 4-5 tools per agent. Distribute the rest across specialized subagents.
- **Why:** Tool selection accuracy degrades rapidly above 5 tools. Similar tools create ambiguity. Focused agents with fewer tools make better selections and produce higher-quality results.

### 9. Hardcoding API keys in .mcp.json configuration — `Critical`

- ❌ **Trap (avoid):** Hardcoding API keys / secrets directly in `.mcp.json`.
- ✅ **Correct:** Use `${ENV_VAR}` environment variable expansion in the MCP config.
- **Why:** Configuration files are committed to git. Hardcoded secrets get leaked. With env-var expansion, secrets stay in the environment, not in version-controlled files.

```json
{
  "mcpServers": {
    "example": {
      "env": { "API_KEY": "${EXAMPLE_API_KEY}" }
    }
  }
}
```

---

## D3 — Claude Code Config (3 patterns)

### 10. Putting personal preferences in project-level CLAUDE.md — `Medium`

- ❌ **Trap (avoid):** Putting personal preferences (editor settings, themes) in the project-level `.claude/CLAUDE.md`.
- ✅ **Correct:** Use `~/.claude/CLAUDE.md` for personal prefs, `.claude/CLAUDE.md` for team standards.
- **Why:** Personal preferences should not be imposed on the whole team. Each configuration layer has a specific purpose and audience.

### 11. Using commands for complex tasks that need context isolation — `High`

- ❌ **Trap (avoid):** Using slash commands for complex tasks that require context isolation.
- ✅ **Correct:** Use skills with `context: fork` and `allowed-tools` restrictions.
- **Why:** Commands run in the current session context, polluting it with exploration noise. Forked context keeps exploration separate, and tool restrictions prevent accidental side effects.

### 12. Same-session self-review in CI/CD pipelines — `Critical`

- ❌ **Trap (avoid):** Having the same session both generate code and review it in a CI/CD pipeline.
- ✅ **Correct:** Use separate sessions for code generation and code review.
- **Why:** The reviewer retains the generator's reasoning context, creating confirmation bias. A fresh session reviews the code objectively with no preconceptions.

---

## D4 — Prompt Engineering (3 patterns)

### 13. Vague instructions like 'be thorough' or 'find all issues' — `Critical`

- ❌ **Trap (avoid):** Vague instructions such as `'be thorough'` or `'find all issues'`.
- ✅ **Correct:** Provide explicit, measurable criteria: `'flag functions exceeding 50 lines'`.
- **Why:** Vague instructions lead to over-flagging, false positives, and alert fatigue — developers stop trusting the tool. Specific criteria produce consistent, actionable results that build trust.

### 14. Assuming tool_use guarantees semantic correctness — `High`

- ❌ **Trap (avoid):** Assuming that a successful `tool_use` means the extracted values are semantically correct.
- ✅ **Correct:** Validate extracted values after `tool_use` with business rule checks.
- **Why:** `tool_use` guarantees STRUCTURE only. Values inside the JSON may still be wrong. Schema compliance + semantic validation together ensure both correct format AND correct content.

### 15. Generic retry messages: 'There were errors, please try again' — `High`

- ❌ **Trap (avoid):** Sending generic retry prompts like `'There were errors, please try again'`.
- ✅ **Correct:** Append specific error details: which field, what was wrong, expected vs actual.
- **Why:** Without specific error details, the model has no signal for what to fix. Specific feedback gives the model a clear correction target.

---

## D5 — Context & Reliability (3 patterns)

### 16. Progressive summarization of critical customer details — `Critical`

- ❌ **Trap (avoid):** Progressively summarizing context that contains critical customer details.
- ✅ **Correct:** Use immutable "case facts" blocks positioned at the start of context.
- **Why:** Each round of summarization loses specifics: names, IDs, amounts, dates. Case facts are never summarized and sit in a high-recall position (the beginning of context).

### 17. Aggregate accuracy metrics only (e.g., '95% overall') — `Critical`

- ❌ **Trap (avoid):** Tracking only aggregate accuracy metrics (e.g., "95% overall").
- ✅ **Correct:** Track accuracy per document type (stratified metrics).
- **Why:** Aggregate metrics mask per-category failures. Invoices at 70% while receipts at 99% still averages 95%. Per-type tracking reveals hidden failures that aggregate metrics conceal.

### 18. No provenance tracking for multi-agent data — `High`

- ❌ **Trap (avoid):** Not tracking provenance for data produced by multiple agents.
- ✅ **Correct:** Track source, confidence level, timestamp, and agent ID for all data.
- **Why:** When subagents provide conflicting data, there is no way to determine which source to trust. Provenance metadata enables informed conflict resolution and audit trails.

---

## Quick Reference Summary

- **10 Critical Patterns** — most likely to appear on the exam.
- **7 High Priority** — frequently seen as distractors.
- **18 Total Patterns** — across all 5 domains.

| # | Pattern | Domain | Severity |
|---|---------|--------|----------|
| 1 | Parsing natural language for loop termination | D1 Agentic | Critical |
| 2 | Arbitrary iteration caps as primary stopping mechanism | D1 Agentic | Critical |
| 3 | Prompt-based enforcement for critical business rules | D1 Agentic | Critical |
| 4 | Sentiment-based escalation to human agents | D1 Agentic | High |
| 5 | Self-reported confidence scores for decision-making | D1 Agentic | High |
| 6 | Generic error messages ('Operation failed') | D2 Tools/MCP | Critical |
| 7 | Silently returning empty results for access failures | D2 Tools/MCP | Critical |
| 8 | Giving one agent 18+ tools | D2 Tools/MCP | High |
| 9 | Hardcoding API keys in .mcp.json configuration | D2 Tools/MCP | Critical |
| 10 | Putting personal preferences in project-level CLAUDE.md | D3 Claude Code | Medium |
| 11 | Using commands for complex tasks needing context isolation | D3 Claude Code | High |
| 12 | Same-session self-review in CI/CD pipelines | D3 Claude Code | Critical |
| 13 | Vague instructions like 'be thorough' / 'find all issues' | D4 Prompt | Critical |
| 14 | Assuming tool_use guarantees semantic correctness | D4 Prompt | High |
| 15 | Generic retry messages: 'There were errors, please try again' | D4 Prompt | High |
| 16 | Progressive summarization of critical customer details | D5 Context | Critical |
| 17 | Aggregate accuracy metrics only (e.g., '95% overall') | D5 Context | Critical |
| 18 | No provenance tracking for multi-agent data | D5 Context | High |

> **Exam tip:** When you see a distractor that matches one of these traps, eliminate it immediately. The correct answer is almost always the structured / deterministic / objective / per-category / fresh-session option.
