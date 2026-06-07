# Claude Certification Prep — A 10-Minute Audiobook

> Target runtime: ~10 minutes at ~150 words per minute (~1,500 words).
> Twelve short chapters covering every topic on the certification: prompt engineering, prompt evaluation, tools, Claude features, the API, RAG, MCP, agents and workflows, Claude Code in action, hooks, and skills.

---

## Chapter 0 — Welcome and How to Use This Audiobook

Welcome. Over the next ten minutes you will hear a structured walkthrough of every topic on the Claude certification. Each chapter is short, dense, and self-contained, so you can listen end to end before the exam, or replay a single chapter when you need a refresher. The certification rewards two things: knowing the underlying concepts, and knowing how those concepts are wired together inside real Claude applications. Keep that in mind as you listen — every chapter ends with a small mental anchor you can carry into the test.

---

## Chapter 1 — Prompt Engineering

Prompt engineering is iterative, not one-shot. The loop is: set a goal, write a naive baseline prompt, evaluate it, apply a technique, then re-evaluate. A starting score around two out of ten is normal — it is your floor, not your failure. Two techniques move the needle the most. First, "be clear and direct": tell Claude exactly what role to play, what task to perform, and what constraints apply. Second, "be specific": provide output guidelines that govern length, structure, format, and tone, and process steps that walk Claude through how to think — for example, "first brainstorm three options, then pick the best, then outline." Output guidelines belong in nearly every prompt. Process steps belong in complex, multi-faceted tasks. Add structure with XML tags so sections of context, instructions, and examples never blur into each other. Change one thing at a time and measure.

---

## Chapter 2 — Prompt Evaluation

Prompt engineering crafts the prompt; prompt evaluation measures whether it actually works. Most engineers fall into two traps: testing once and shipping, or patching a few obvious edge cases. Both leave you exposed in production. The right approach is an evaluation pipeline. Build three core functions: `run_prompt` merges a test case with a prompt template and calls Claude; `run_test_case` calls `run_prompt` and grades the output; `run_eval` loops over an entire dataset and aggregates results. Grading is where the real work lives. You can use code-based checks for deterministic outputs, or **model-based grading**, where a second Claude call scores the first against explicit criteria. Keep test sets small while iterating, then scale up. An eval-first mindset lets you compare prompt versions objectively, catch regressions, and turn "it works on my machine" into measurable confidence.

---

## Chapter 3 — Tools

Tools let Claude break out of its training data. The pattern is a structured loop: your app sends Claude a question plus a list of tools; Claude responds with a tool-use request; your server executes the function and returns the result; Claude generates a final answer. A tool has three pieces — a Python function, a JSON schema describing it, and the integration into your message loop. Best practices: use descriptive function and parameter names, validate inputs, and raise clear errors. Claude reads error messages and will retry with corrected parameters, so good errors make the system self-correcting. The schema declares the tool's name, description, and input shape using JSON Schema. When handling responses, watch the message blocks: text blocks contain prose, tool-use blocks contain requests, and you must reply with a matching tool-result block before Claude can continue.

---

## Chapter 4 — Features of Claude

Four features show up repeatedly. **Extended thinking** lets Claude reason through hard problems before answering, trading latency for quality on math, planning, and analysis tasks. **Image support** accepts up to one hundred images per request, five megabytes each; tokens cost roughly width times height divided by 750. The same prompt-engineering rules apply to vision: vague prompts give vague answers, so walk Claude through structured visual steps. **PDF support** lets Claude read documents directly, combining text and visual layout. **Citations** ground answers in source documents, returning the exact spans Claude used so users can verify claims. Together these features turn Claude from a chat model into a multi-modal analyst. On the exam, remember which limits apply where, and remember that prompt quality matters as much for images and PDFs as it does for plain text.

---

## Chapter 5 — The API

Three API behaviors matter most. **Temperature** controls randomness: zero gives deterministic, repeatable outputs ideal for evaluation and extraction; higher values produce creative, varied outputs ideal for brainstorming. **Response streaming** removes the long spinner. Instead of waiting ten to thirty seconds, your server forwards chunks as Claude generates them. The key event is `ContentBlockDelta`, which carries the text. Use the simplified `client.messages.stream()` with `stream.text_stream` for most cases, and call `get_final_message` afterward to retrieve the full assembled object for storage. **Structured data** extraction asks Claude to return JSON matching a schema, often using tool-use as a forcing function — define a tool whose only job is to receive the structured object, and the response arrives parsed and validated.

---

## Chapter 6 — RAG, Retrieval-Augmented Generation

RAG has five steps: chunk text, embed each chunk, store embeddings alongside the original text, embed the user query, then retrieve the closest matches by cosine distance — lower distance means higher relevance. Chunking strategy matters more than people expect. Size-based chunking is simple and works on anything but can cut sentences. Structure-based chunking uses headers and paragraphs and gives the cleanest results when documents are well formatted. Sentence-based chunking is a strong general default. Semantic chunking groups by meaning and is the most accurate but the most expensive. Pure semantic search misses exact terms like incident IDs, so production systems use **hybrid search**: combine vector similarity with **BM25 lexical search**, then merge results with **Reciprocal Rank Fusion**, scoring each document by one over k plus its rank in each index. Documents strong in both rise to the top.

---

## Chapter 7 — MCP, the Model Context Protocol

MCP standardizes how Claude talks to external tools and data. A **server** exposes tools, resources, and prompts. A **client** is the bridge that handles transport — usually stdio for local servers, HTTP or WebSockets for remote ones — so your app does not manage protocol details. Two message types dominate: `ListTools` to discover what is available, and `CallTool` to execute one. The Python SDK makes servers trivial: `FastMCP` plus the `@mcp.tool()` decorator turns a typed Python function into a registered tool, with Pydantic `Field` descriptions feeding into the schema Claude sees. **Resources** expose read-only data via URIs and are accessed with `ReadResource` requests. The built-in inspector, launched with `mcp dev`, lets you connect, list, and run tools in the browser — a fast feedback loop that replaces hand-written test scripts.

---

## Chapter 8 — Agents and Workflows

A **workflow** is a predefined sequence of Claude calls — use it when you can draw the flow on a whiteboard. An **agent** gives Claude a goal plus tools and lets it decide the steps — use it when the path is unpredictable. Three workflow patterns recur on the exam. **Chaining** passes the output of one prompt as input to the next, narrowing focus at each step. **Routing** classifies the user request first, then dispatches to a specialized prompt — better than one giant generic prompt. **Parallelization** fans out independent subtasks and merges results, cutting latency. Finally, the **Evaluator-Optimizer** pattern pairs a Producer with a Grader: the Producer generates, the Grader scores, and feedback loops until the output passes. These are repeatable recipes, not code — knowing them speeds up every design discussion.

---

## Chapter 9 — Claude Code in Action

Claude Code is an agent tuned for software engineering. Three habits define expert use. **Adding context**: reference exact files, paste error output verbatim, and attach the relevant configs — Claude cannot read what it cannot see. **Making changes**: prefer surgical edits over rewrites, run the change, and verify it works before moving on. Build, run, fix, then move to the next module. **Controlling context**: use `CLAUDE.md` for always-on project standards, clear context when switching tasks, and dispatch subagents for independent research so the main window stays clean. The certification expects you to pick the right tool for the job: edit for known changes, search agents for exploration, planning mode for non-trivial work, and verification gates before declaring anything done.

---

## Chapter 10 — Hooks

Hooks intercept Claude Code's tool calls. Two types: **PreToolUse** runs before the tool and can block it; **PostToolUse** runs after and can only observe. Define them in `.claude/settings.local.json` with a matcher — the tools to intercept, like `Read|Grep` — and a command. Claude pipes JSON to the hook's standard input, including `session_id`, `hook_event_name`, `tool_name`, and `tool_input`. The hook script's exit code drives the decision: zero allows, two blocks, and any stderr message becomes Claude's explanation for why it was blocked. The classic example is protecting `.env` files: match `Read` and `Grep`, parse the file path, exit two if it matches a sensitive pattern. Hooks are proactive, transparent, and flexible — one hook can guard many tools using the pipe operator.

---

## Chapter 11 — Skills

Skills are on-demand expertise. Each skill is a directory containing a `SKILL.md` file: metadata in frontmatter — name and description — plus instructions in the body. Claude loads only names and descriptions at startup and matches them against your requests semantically. When a match fires, you get a confirmation prompt before the full skill content enters context. Priority on name conflicts goes Enterprise, then Personal, then Project, then Plugins. Compare to siblings: `CLAUDE.md` is always on, skills load on demand; subagents run in isolated contexts, skills enrich the current one; hooks are event-driven, skills are request-driven; MCP provides external tools, skills provide knowledge. Project skills in `.claude/skills` are shared via Git. If a skill does not trigger, the description is wrong — add the phrases users actually say.

---

## Chapter 12 — Final Tips for the Exam

Three closing reminders. First, every Claude topic eventually reduces to the same loop: write, evaluate, refine. Whether you are tuning a prompt, building a tool, or shipping an agent, the discipline is the same. Second, names matter — exit codes, message block types, schema fields, and hook events appear verbatim in questions, so memorize them precisely. Third, prefer the simplest mechanism that solves the problem: a clearer prompt before a tool, a tool before a workflow, a workflow before an agent. Walk in calm. You know this. Good luck.
