# Domaine 2 — Tool Design & MCP Integration

> Study/rework artifact for the **Claude Certified Architect – Foundations** exam.
> Source: https://claudecertifications.com/claude-certified-architect/domains/tool-design-mcp
>
> Some JSON code blocks were truncated mid-line during source extraction. Truncated
> spots are marked `// … (truncated in source extraction)`. Nothing below is invented —
> only what the page contains.

## Overview

This domain covers how to design tools that Claude can select and use reliably, how to
return failures the agent can act on, and how to wire external capabilities through the
**Model Context Protocol (MCP)**. It also covers Claude Code's six built-in tools and when
to use each.

The page is organized into five subtopics plus exam tips:

1. **Tool Distribution & Selection** — how many tools per agent, scoping, `tool_choice`.
2. **Tool Description Best Practices** — descriptions as documentation for the model.
3. **Structured Error Responses** — `isError`, `errorCategory`, `isRetryable`, `context`.
4. **MCP Server Configuration** — `.mcp.json` (project) vs `~/.claude.json` (user).
5. **Built-in Tools** — Read, Write, Edit, Bash, Grep, Glob.

---

## 1. Tool Distribution & Selection

Distribute tools across agents effectively. The number of tools given to a single agent
**directly impacts its ability to select the correct one.** Research shows **4-5 tools per
agent is optimal.**

### Key concepts

- **4-5 tools per agent is optimal**; too many tools (e.g., 18) degrades selection quality.
- **Scoped tool access**: each agent only gets the tools relevant to its task.
- **Tool grouping**: organize related tools and assign them to specialized agents.
- **`tool_choice` options:**
  - `"auto"` — Claude decides whether and which tool to use (default).
  - `"any"` — Claude must use a tool (but can choose which one).
  - `{"type": "tool", "name": "X"}` — force a specific tool.

### Why too many tools is a problem

- With 18+ tools, Claude must evaluate each one against the current task.
- Similar tools create ambiguity (`search_customers` vs `find_customer` vs `lookup_user`).
- Selection accuracy degrades as the option space grows.
- More tool descriptions consume valuable context window space.

### The solution: distribute tools across specialized subagents

Instead of one agent with 18 tools, create a **coordinator with 3-4 subagents**, each having
4-5 focused tools:

| Subagent | Tools |
|---|---|
| **Customer Agent** | `lookup_customer`, `update_account`, `check_status`, `verify_identity` |
| **Order Agent** | `find_order`, `process_refund`, `update_shipping`, `track_package` |
| **Communication Agent** | `send_email`, `send_sms`, `create_ticket`, `escalate_human` |
| **Coordinator** | `Task` (to delegate), `summarize`, `format_response` |

### ✅ Expected patterns (Correct)

- Keep each agent to **4-5 relevant tools**.
- Split a large tool set across **specialized subagents** behind a coordinator.
- Use **`tool_choice`** to constrain selection when the task is clear (`any` to force a tool,
  or a named tool to force a specific one).
- Give each agent **only** the tools its task needs (scoped access).

### ❌ Anti-patterns to avoid

- Giving an agent **18+ tools** when only 4-5 are relevant to its task.
- **Not using `tool_choice`** to constrain tool selection when the task is clear.
- Creating **near-duplicate tools** (`search_customers` / `find_customer` / `lookup_user`)
  that introduce selection ambiguity.

---

## 2. Tool Description Best Practices

Tool descriptions are the **primary mechanism Claude uses to decide *when* and *how* to use
a tool.** Think of them as documentation written specifically for the model — more detail is
better.

### What makes a great tool description

- **Clear purpose** — what the tool does in one sentence.
- **Input specifications** — exact types, formats, ranges, and constraints.
- **Examples** — show expected input/output pairs for common cases.
- **Edge cases** — document what happens with empty inputs, invalid data, boundary values.
- **When NOT to use** — clarify tool boundaries to prevent misuse.

> A vague description like *"Searches for customers"* forces Claude to guess. A detailed
> description removes all ambiguity:
> *"Search for customers by email, phone, or account ID. Email must include @. Phone must be
> E.164 format (+1XXXXXXXXXX). Returns max 10 results. Returns empty array if no matches
> found."*

### Code example — well-designed tool

```json
{
  "name": "lookup_customer",
  "description": "Search for a customer by email, phone number, or account ID. Returns customer profile including name, account status, and order history summary. Input: exactly ONE of email, phone, or account_id. Email must contain @. Phone must be E.164 format (e.g., +155512345...",
  // … (truncated in source extraction)
}
```

### ✅ Expected patterns (Correct)

- Include **input format specifications with examples** in the tool description.
- Specify **edge cases and boundary conditions** so the model handles them correctly.
- Give **clear parameter descriptions** with expected types, ranges, and constraints.
- Treat tool descriptions as **documentation for the model** — more detail is better.
- State **when NOT to use** the tool to prevent misuse.

### ❌ Anti-patterns to avoid

- **Vague tool descriptions** that leave ambiguity about when or how to use the tool.
- **Missing edge-case documentation**, leading to unexpected tool behavior.

---

## 3. Structured Error Responses

When a tool fails, the error response must give the agent enough information to decide what
to do next: **retry, try an alternative, or escalate.**

### Structured error response fields

- **`isError`** — signals this is a failure, not a result (`true`/`false`).
- **`errorCategory`** — classifies the error type (`"auth"`, `"not_found"`, `"rate_limit"`,
  `"timeout"`, `"validation"`).
- **`isRetryable`** — should the agent try again? (`true` for timeouts, `false` for auth
  failures).
- **`context`** — what was attempted and what specifically failed.

### Critical distinction — Access Failure vs Empty Result

> This is described as **one of the most tested concepts on the exam.**

- **Access Failure** — *"I couldn't check the database"* → `isError: true`
  (the search was **NOT** performed).
- **Empty Result** — *"I checked the database, found nothing"* → `isError: false`
  (the search **WAS** performed).

**Never silently suppress access failures by returning empty results.** If the database was
down, returning `[]` makes the agent think no customers exist — a catastrophic
misunderstanding.

### Code example — error response design

```json
{
  "access_failure_example": {
    "isError": true,
    "errorCategory": "t...",
    // … (truncated in source extraction)
  }
}
```

### ✅ Expected patterns (Correct)

- On a real failure, return **`isError: true`** with `errorCategory`, `isRetryable`, and
  `context`.
- Distinguish an **access failure** (`isError: true`) from a **genuinely empty result**
  (`isError: false`).
- Mark **timeouts as retryable** (`isRetryable: true`) and **auth failures as not retryable**
  (`isRetryable: false`).
- Give the agent enough context to **retry, fall back, or escalate**.

### ❌ Anti-patterns to avoid

- **Generic error messages** like `"Operation failed"` that hide useful context.
- **Silently suppressing errors** by returning empty results as success.
- **Not distinguishing** between access failures and genuinely empty results
  (e.g., returning `[]` when the database was unreachable).

---

## 4. MCP Server Configuration

**Model Context Protocol (MCP)** servers extend Claude's capabilities with custom tools and
data sources. Configuration happens at **two levels**.

### Configuration files

- **`.mcp.json`** (Project-level) — shared via version control; team tools, project-specific
  integrations.
- **`~/.claude.json`** (User-level) — personal, not shared; individual API keys.

> Know the **precedence** between project-level and user-level configs — mixing them without
> understanding precedence is an anti-pattern.

### Security — environment variable expansion

Never hardcode secrets in configuration files. Use **`${ENV_VAR}`** syntax:

- Secrets stay out of version control.
- Each developer uses their own credentials.
- CI/CD can inject environment-specific values.

### What MCP servers can provide

- **Tools** — custom functions Claude can call (e.g., Jira integration, database queries).
- **Resources** — static data or documentation (e.g., API specs, schema docs).
- **Prompts** — pre-built prompt templates for common tasks.

### Code example — `.mcp.json` (project-level)

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["@company/jira-mcp-server"],
      "env": {
        "JIRA_URL": "${JIRA_URL}",
        "JIRA_TOKEN": "${JIRA_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["@company/pg-mcp-server", "--read-only"
      // … (truncated in source extraction)
    }
  }
}
```

### ✅ Expected patterns (Correct)

- Put **shared / team / project-specific** server configs in `.mcp.json` (version-controlled).
- Put **personal config and individual API keys** in `~/.claude.json` (not shared).
- Reference secrets via **`${ENV_VAR}`** expansion, never hardcoded literals.
- Use flags like **`--read-only`** to scope what a server can do (e.g., the postgres server).
- Use MCP **Resources** for static docs/specs and **Prompts** for reusable templates.

### ❌ Anti-patterns to avoid

- **Hardcoding secrets** in `.mcp.json` instead of using environment variable expansion.
- **Mixing project-level and user-level configs** without understanding precedence.

---

## 5. Built-in Tools

Claude Code comes with **6 built-in tools.** Knowing **when to use each** is heavily tested.

### The 6 built-in tools

- **Read** — read file contents (understanding code, examining data).
- **Write** — create new files from scratch (**new files only!**).
- **Edit** — modify existing files with targeted changes.
- **Bash** — execute shell commands (tests, builds, installs).
- **Grep** — search for text patterns **inside** files.
- **Glob** — find files matching **name/path** patterns.

### Critical distinctions

1. **Write vs Edit** — use **Write** for *new files only*; use **Edit** for *modifying
   existing files*. Write replaces the entire file.
2. **Bash vs built-in tools** — never use Bash for operations that have dedicated tools.
   Don't use `cat file.txt` when **Read** exists.
3. **Grep vs Glob** — **Grep** searches *inside files* for content patterns; **Glob**
   searches *file names* for path patterns.

### Code example — correct tool selection

```text
Task: "Read the configuration file"
  Correct: Read("config.json")
  Wrong:   Bash("cat config.json")

Task: "Create a new test file"
  Correct: Write("tests/new-test.ts", content)
  Wrong:   Bash("echo '...' > tests/new-test.ts")

Task: "Fix a bug in line 42 of server.ts"
  // … (truncated in source extraction)
```

### ✅ Expected patterns (Correct)

- Use **Read** (not `Bash("cat ...")`) to read a file.
- Use **Write** for new files; use **Edit** for targeted changes to existing files.
- Use **Grep** to search *content inside* files; use **Glob** to find files *by name/path*.
- Reserve **Bash** for shell operations (tests, builds, installs) with no dedicated tool.

### ❌ Anti-patterns to avoid

- Using **Write when Edit would be more precise** for modifying existing files.
- Using **Bash for file operations** when Read/Write/Edit are available.

---

## Exam Tips for Domain 2 (verbatim)

1. Keep tools per agent to **4-5** for optimal selection quality.
2. Structured error responses are critical — always include **`isError`, `errorCategory`,
   `isRetryable`**.
3. Know the difference between **`.mcp.json` (project)** and **`~/.claude.json` (user)**.
4. Built-in tools: know **when to use Grep vs Glob vs Read**.

---

## Related Exam Scenarios

- **Customer Support Resolution Agent** — design an AI-powered customer support agent that
  handles inquiries, resolves issues, and escalates complex cases. Tests Agent SDK usage,
  MCP tools, and escalation logic. (This is the source of the Customer / Order /
  Communication / Coordinator subagent split shown above.)

---

## Quick self-check (high-signal discriminators)

- A DB-lookup tool **can't reach** the database → return `isError: true` (+ `errorCategory`,
  `isRetryable`, `context`), **not** `[]` with `isError: false`. Access failure ≠ empty result.
- One agent misfiring with **18 tools** → split into **3-4 subagents of 4-5 tools** behind a
  coordinator; don't just "improve descriptions" or remove them to save tokens.
- Secrets in MCP config → use **`${ENV_VAR}`** expansion, never hardcode.
- "Read the config file" → **Read**, not `Bash("cat ...")`. Modify existing file → **Edit**,
  not Write.
