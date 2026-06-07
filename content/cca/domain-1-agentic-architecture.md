# Domaine 1 — Agentic Architecture & Orchestration

> Source: [claudecertifications.com — Domain 1: Agentic Architecture](https://claudecertifications.com/claude-certified-architect/domains/agentic-architecture)
> Weight on exam: **~25%**

## Overview

Design and implement agentic systems using Claude's **Agent SDK**. This domain covers
agentic loops, multi-agent orchestration, hooks, workflows, session management, and
task decomposition patterns for production-grade AI applications.

### Sub-topics in this domain

| ID | Topic |
|----|-------|
| d1.1 | Agentic Loops & Core API |
| d1.2 | Multi-Agent Orchestration |
| d1.3 | Hooks & Programmatic Enforcement |
| d1.4 | Session Management & Workflows |

### Domain 1 — Exam Tips (master list)

1. Always check `stop_reason` for loop control, never parse natural language.
2. Programmatic **hooks** for business rules, **prompts** for preferences.
3. Subagents need **explicit context** — don't assume they inherit coordinator knowledge.
4. Understand `fork_session` vs `--resume` and when to use each.

---

## d1.1 — Agentic Loops & Core API

Understand how agentic loops work using the Claude Agent SDK. Learn to manage the
lifecycle of agentic interactions, including the `stop_reason` signals, tool result
appending, and the control flow of agent execution.

### Core concepts you must master

- **Agentic loop lifecycle:** `stop_reason` values (`'tool_use'` vs `'end_turn'`) control loop continuation.
- **Tool result appending:** after each tool call, results are appended to the conversation for the next iteration.
- **Agent SDK control flow:** the SDK handles the loop automatically, but you must understand the mechanics.
- The agent continues looping **as long as `stop_reason` is `'tool_use'`**; it terminates on `'end_turn'`.

### How the loop works

1. You send a message to Claude with a set of available tools.
2. Claude responds — either with text (done) or a tool call (needs to act).
3. If Claude called a tool, you execute it and append the result to the conversation.
4. You send the updated conversation back to Claude.
5. Repeat until Claude responds with text only (no more tool calls).

The `stop_reason` field in the API response is the **only reliable signal** for controlling the loop:

- `"tool_use"` → Claude wants to call a tool → **continue** the loop.
- `"end_turn"` → Claude is done → **exit** the loop and return the response.

The Agent SDK handles this loop automatically, but the exam tests *why* certain
approaches work and why alternatives fail.

### Code example — Core Loop Pattern

```python
# agentic-loop.py — Core Loop Pattern
import anthropic

client = anthropic.Anthropic()
tools = [{"name": "lookup_customer", "description": "...", "input_schema": {}}]
messages = [{"role": "user", "content": "Find customer John Smith"}]

# The Agentic Loop
while True:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        tools=tools,
        messages=messages
    )

    # KEY: Check stop_reason to control the loop
    if response.stop_reason == "end_turn":
        break  # Claude is done

    if response.stop_reason == "tool_use":
        tool_block = next(
            b for b in response.content if b.type == "tool_use"
        )
        result = execute_tool(tool_block.name, tool_block.input)

        messages.append({"role": "assistant", "content": response.content})
        messages.append({
            "role": "user",
            "content": [{"type": "tool_result",
                         "tool_use_id": tool_block.id,
                         "content": result}]
        })
```

### ✅ Correct — Check `stop_reason`

```python
# CORRECT: Check stop_reason field
while True:
    response = get_response()
    if response.stop_reason == "end_turn":
        break  # Claude decided it's done
    if response.stop_reason == "tool_use":
        execute_and_continue()
```

### ❌ Anti-patterns to avoid

- Parsing natural language output to decide whether to continue the loop instead of checking `stop_reason`.
- Setting arbitrary iteration caps as the *primary* stopping mechanism.
- Checking assistant text content to determine loop termination.

```python
# ANTI-PATTERN: Parsing natural language
while True:
    response = get_response()
    text = response.content[0].text
    if "task complete" in text.lower():
        break
    if "I'm done" in text.lower():
        break
```

> 🎯 **Exam Tip:** The exam will present 3-4 options for loop termination. The correct
> answer is **ALWAYS checking `stop_reason`**. Look for distractors like parsing text
> content, setting iteration limits, or monitoring token counts.

---

## d1.2 — Multi-Agent Orchestration

Design and implement multi-agent systems using **hub-and-spoke** architecture. Learn
coordinator roles, subagent context isolation, and parallel execution patterns.

### Multi-agent patterns tested on the exam

- **Hub-and-spoke architecture:** a central coordinator delegates tasks to specialized subagents.
- **Context isolation:** subagents have their own context and do not share state directly.
- **Task tool for spawning subagents:** `allowedTools` must include `'Task'` for subagent creation.
- **Parallel execution:** multiple `Task` calls in a single response enable parallel subagent work.
- **`fork_session`:** creates branched sessions for parallel exploration without context pollution.

### Why hub-and-spoke beats flat architectures

- **Context isolation:** Each subagent gets only context relevant to its task.
- **Focused tool access:** Each subagent has only **4-5 tools** relevant to its specialty.
- **Parallel execution:** Multiple subagents can work simultaneously.
- **Clean synthesis:** Coordinator combines results without exploration noise.

### The Task tool — critical configuration

- The coordinator's `allowedTools` must include `"Task"` to enable subagent spawning.
- Each `Task` call specifies the subagent's prompt, tools, and context.
- Multiple `Task` calls in a single response execute **in parallel**.

> **Context passing rule:** Pass ONLY the context specific to each subagent's task.
> Never share the full coordinator conversation history — it wastes tokens and confuses
> the subagent with irrelevant information.

### Code example — Multi-Agent Coordinator

```python
# hub-and-spoke.py — Multi-Agent Coordinator
from claude_agent import Agent, Task

coordinator = Agent(
    model="claude-sonnet-4-20250514",
    tools=[
        Task,              # Required for spawning subagents
        summarize_results, # Coordinator-level synthesis
        format_report,     # Final output formatting
    ]
)

# Subagent with scoped tool access (4 tools each)
market_researcher = Agent(
    model="claude-sonnet-4-20250514",
    tools=[web_search, read_doc, extract_data, format_citation],
)

tech_analyst = Agent(
    model="claude-sonnet-4-20250514",
    tools=[read_code, grep_patterns, analyze_deps, format_report],
)

# Coordinator delegates with EXPLICIT context per subtask
coordinator.run("""
Research AI infrastructure market. Delegate:
1. Market research → market_researcher
2. Technology analysis → tech_analyst
Pass each subagent ONLY the context relevant to their task.
""")
```

### ✅ Correct — Pass explicit, scoped context

```python
# Passing EXPLICIT relevant context per subtask
Task(
    prompt="Research AI infrastructure market size",
    context="Focus: market size in USD, YoY growth, top 3 vendors",
    # Only what this subagent needs
)
```

### ❌ Anti-patterns to avoid

- Overly narrow task decomposition leading to **coverage gaps** between subagents.
- Sharing **full coordinator context** with every subagent (context pollution).
- Not providing explicit context when delegating to subagents.

```python
# Sharing FULL coordinator context with subagent
Task(
    prompt="Research market size",
    context=coordinator.full_conversation_history,
    # 90% of this context is irrelevant
)
```

> 🎯 **Exam Tip:** The exam tests context isolation heavily. If an answer shares full
> coordinator context with subagents, it's **wrong**. Each subagent should receive only
> context specific to its assigned subtask.

---

## d1.3 — Hooks & Programmatic Enforcement

Use hooks for data normalization, tool call interception, and compliance enforcement.
Understand when to use **programmatic enforcement** vs **prompt-based guidance**.

### Hooks and enforcement concepts

- **PostToolUse hooks:** intercept and modify tool outputs for data normalization.
- **Programmatic enforcement** for critical business rules (deterministic, not probabilistic).
- **Prompt-based guidance** for soft preferences and style suggestions.
- **Hook-based blocking:** e.g., blocking refunds above $500 and redirecting to escalation.

### The critical distinction the exam tests

- **Hooks = Deterministic (100% reliable)** → Use for critical business rules, compliance, security.
- **Prompts = Probabilistic (model may ignore)** → Use for style preferences, soft guidelines.

### Types of hooks

- **PreToolUse:** Intercepts *before* tool execution — can block, modify params, add validation.
- **PostToolUse:** Intercepts *after* execution — can modify output, normalize data, trigger side effects.

> **Example:** A $500 refund limit is a critical business rule. If you put it in a
> prompt, the model might process a $700 refund anyway. A PostToolUse hook **guarantees**
> the block.

### Escalation triggers

**Valid escalation triggers:**

- Customer explicitly requests a human.
- Policy gap detected (no rule covers the situation).
- Task exceeds agent capabilities.
- Business threshold exceeded (e.g., refund > $500).

**Invalid triggers (anti-patterns):**

- Negative **sentiment** (sentiment does not equal task complexity).
- Self-reported **low confidence** (model confidence is unreliable).

### Code example — Programmatic Business Rule Enforcement

```python
# hooks.py — Programmatic Business Rule Enforcement
from claude_agent import Agent, Hook

# PostToolUse hook: Block refunds above $500
def refund_limit_hook(tool_name, tool_input, tool_output):
    if tool_name == "process_refund":
        amount = tool_input.get("amount", 0)
        if amount > 500:
            return {
                "blocked": True,
                "reason": f"Refund ${amount} exceeds $500 limit",
                "action": "escalate_to_human",
                "context": {
                    "customer_id": tool_input.get("customer_id"),
                    "requested_amount": amount,
                    "agent_limit": 500,
                }
            }
    return tool_output  # Allow all other tool calls

agent = Agent(
    model="claude-sonnet-4-20250514",
    tools=[lookup_customer, check_order, process_refund],
    hooks={"PostToolUse": [refund_limit_hook]},
)
```

### ✅ Correct — Hook-based enforcement

```python
# CORRECT: Hook-based enforcement
def refund_limit_hook(tool_name, tool_input, output):
    if tool_name == "process_refund":
        if tool_input["amount"] > 500:
            return {"blocked": True, "action": "escalate"}
    return output
# This runs as CODE, not as a suggestion
```

### ❌ Anti-patterns to avoid

- Using **prompt-based enforcement** for critical business rules (unreliable).
- **Self-reported confidence scores** for escalation decisions (model confidence is unreliable).
- **Sentiment-based escalation** (sentiment does not equal complexity).

```python
# ANTI-PATTERN: Prompt-based enforcement
system_prompt = """
IMPORTANT: Never process refunds above $500.
If a refund is above $500, escalate to a human.
"""
# This is probabilistic — the model CAN and
# WILL sometimes ignore this instruction
```

> 🎯 **Exam Tip:** When the exam asks about enforcing critical business rules (refund
> limits, data access, compliance), the correct answer is **ALWAYS programmatic hooks**,
> never prompt instructions.

---

## d1.4 — Session Management & Workflows

Manage agent sessions, including resuming, forking, and preventing stale context.
Understand task decomposition strategies from prompt chaining to dynamic adaptive
decomposition.

### Session and workflow management

- **`--resume` flag:** continue previous sessions with preserved context.
- **`fork_session`:** branch sessions for exploration without polluting the main context.
- **Named sessions** for organized multi-session workflows.
- **Stale context detection and mitigation** in long-running sessions.
- **Prompt chaining vs dynamic adaptive decomposition:** choose based on task predictability.

### Key session operations

- **Resume (`--resume`):** Continue a previous session with full context.
- **Fork (`fork_session`):** Create a branch for exploration without polluting the main session.
- **Named sessions (`--session-name`):** Organize multi-session workflows.

> **Stale context** is a critical risk in long-running sessions — data retrieved early
> may become outdated. **Mitigation:** periodically re-fetch critical data, use
> scratchpad files.

### Task decomposition strategies

- **Prompt chaining:** Predictable, linear tasks with a static sequence of steps.
- **Dynamic adaptive:** Unpredictable, complex tasks where the agent decides next steps based on results.

Dynamic adaptive decomposition is preferred when the task has **unknown complexity** or
intermediate results may change the approach. Prompt chaining works when the workflow is
**well-defined** and each step's input/output is predictable.

### Code example — Session Operations

```bash
# session-management.sh — Session Operations

# Resume a previous session (preserves full context)
claude --resume

# Resume a specific named session
claude --resume --session-name "feature-auth-redesign"

# Fork for exploration (inherits context, diverges)
# Changes in fork do NOT affect the main session
claude fork_session --reason "Exploring alternative API"

# Start a new named session
claude --session-name "sprint-47-backend"
```

### ✅ Correct — Dynamic adaptive decomposition

```python
# Dynamic adaptive decomposition
agent.run("""
Analyze the codebase for issues. For each:
1. Assess severity and complexity
2. If simple: fix directly
3. If complex: create a plan first
4. After each fix: run relevant tests
Adapt your approach based on what you find.
""")
```

### ❌ Anti-patterns to avoid

- Ignoring stale context in extended sessions.
- Using static prompt chains for tasks that require dynamic adaptation.

```python
# Static prompt chain for a DYNAMIC task
steps = [
    "Step 1: Read the codebase",
    "Step 2: Find all bugs",
    "Step 3: Fix each bug",
]
# What if step 2 finds no bugs?
# Static chains can't adapt
```

> 🎯 **Exam Tip:** If the task is unpredictable or has conditional branches, **dynamic
> adaptive decomposition** is correct. If it's a fixed, linear pipeline, **prompt
> chaining** works.

---

## Related Exam Scenarios

1. **Customer Support Resolution Agent** — Design an AI-powered customer support agent
   that handles inquiries, resolves issues, and escalates complex cases. Tests Agent SDK
   usage, MCP tools, and escalation logic.
2. **Multi-Agent Research System** — Build a coordinator-subagent system for parallel
   research tasks. Tests multi-agent orchestration, context passing, error propagation,
   and result synthesis.

---

## Quick revision cheat-sheet

| Decision | Correct answer | Wrong answer (anti-pattern) |
|----------|----------------|------------------------------|
| When to continue the agentic loop | Check `stop_reason == "tool_use"` | Parse text / iteration caps / token counts |
| When the loop ends | `stop_reason == "end_turn"` | "task complete" string matching |
| Context for subagents | Only task-specific context | Full coordinator history (pollution) |
| Tools per subagent | ~4-5 scoped tools | Every tool / coordinator's full toolset |
| Enabling subagent spawning | `allowedTools` includes `"Task"` | — |
| Parallel subagent work | Multiple `Task` calls in one response | Sequential one-at-a-time |
| Enforcing a $500 refund limit | PostToolUse **hook** (deterministic) | Prompt instruction (probabilistic) |
| Valid escalation trigger | Human requested / policy gap / over-capability / threshold | Negative sentiment / low self-confidence |
| Predictable linear workflow | Prompt chaining | — |
| Unpredictable / branching workflow | Dynamic adaptive decomposition | Static prompt chain |
| Continue an old session | `--resume` | — |
| Explore without polluting main | `fork_session` | — |
| Long-running session data risk | Stale context → re-fetch / scratchpad | Ignore staleness |
