# Hooks

## Here are the key takeaways from the "Introducing Hooks" lesson:

**What Hooks Are**
Hooks let you run custom commands either before or after Claude Code executes a tool, allowing you to inject your own logic into Claude's workflow.

**Two Types of Hooks**

- **PreToolUse** — runs *before* a tool is called. You can allow the operation to proceed normally or block it entirely and send an error back to Claude.
- **PostToolUse** — runs *after* a tool is called. Since the action already happened, you can't block it, but you can run follow-up operations or provide feedback to Claude.

**Configuration**
Hooks are defined in Claude settings files at three levels: global (`~/.claude/settings.json`), project-shared (`.claude/settings.json`), or project-local (`.claude/settings.local.json`). You can write them by hand or use the `/hooks` command inside Claude Code.

**How They Work**
Each hook uses a "matcher" to target specific tools (e.g., `"Read"`, `"Write|Edit|MultiEdit"`), then runs a specified command when that tool is triggered. The hook command receives details about the tool call.

**Common Use Cases**
Hooks are useful for auto-formatting files after edits, running tests when files change, blocking access to sensitive files, running linters/type-checkers, logging file access, and enforcing naming or coding standards.

**The Core Insight**
PreToolUse hooks give you *control* over what Claude can do; PostToolUse hooks let you *enhance* what Claude has done — together they let you deeply integrate your own tools and processes into Claude Code's workflow.

![1.png](Hooks/1.png)

## Here are the key takeaways from the **"Defining Hooks"** lesson:

**What Hooks Are**
Hooks let you intercept and control Claude Code's tool calls either before or after they execute, giving you fine-grained control over what Claude can and cannot do in your environment.

**Two Hook Types**

- **PreToolUse** — runs *before* the tool executes; can block the operation entirely.
- **PostToolUse** — runs *after* the tool has already executed; cannot prevent it.

**Four Steps to Build a Hook**

1. Choose PreToolUse or PostToolUse based on whether you need to prevent actions.
2. Specify which tools should trigger your hook.
3. Write a command that receives tool call data via **standard input** as JSON.
4. Use the command's **exit code** to communicate back to Claude.

**Exit Codes**

- `0` → Allow the tool call to proceed.
- `2` → Block the tool call (PreToolUse only). Any message written to stderr is sent to Claude as an explanation.

**Tool Call JSON Structure**
When a hook fires, Claude passes context including the `session_id`, `hook_event_name`, `tool_name`, and `tool_input` (e.g., the file path being read).

**Practical Example**
A common use case is blocking Claude from reading sensitive files like `.env`. You'd watch both the `Read` and `Grep` tools, check the file path in the JSON input, and exit with code `2` if a restricted path is detected — providing clear feedback to Claude about why it was blocked.

![instructor_a46l9irobhg0f5webscixp0bs_public_1752618154_011_-_Defining_Hooks_16.1752618154725.png](Hooks/instructor_a46l9irobhg0f5webscixp0bs_public_1752618154_011_-_Defining_Hooks_16.1752618154725.png)

## Here are the key takeaways from the "Implementing a Hook" lesson:

**What it covers:** Building a `PreToolUse` hook in Claude Code to block access to sensitive files like `.env`.

**Setup:** The hook is configured in `.claude/settings.local.json` with two required pieces — a **matcher** (which tools to intercept, e.g., `"Read|Grep"`) and a **command** (the script to run, e.g., `node ./hooks/read_hook.js`).

**How it works:** When Claude tries to use a matched tool, it passes JSON data about the tool call (session ID, tool name, file path, etc.) to your hook script via standard input. The script reads this data and decides whether to allow or block the action.

**Blocking mechanism:** Exiting with code `2` blocks the operation and sends an error message back to Claude, which it understands as a hook-enforced restriction.

**Core logic pattern:** The script reads `stdin` → parses the JSON → checks the file path for a sensitive pattern (like `.env`) → exits with code `2` if matched.

**Key benefits:**

- **Proactive** — blocks access *before* any sensitive data is read
- **Transparent** — Claude understands why the operation failed
- **Flexible** — one hook can cover multiple tools using `|` as an OR operator
- **Extensible** — the same pattern can be adapted to protect any sensitive files or directories, not just `.env`

## Here are the key takeaways from the "Gotchas Around Hooks" lesson:

**Two files are created on setup:** When you run `npm run dev`, you'll notice two files appear in the `.claude` directory — `settings.json` and `settings.local.json`. This is intentional and worth understanding.

**Use absolute paths for hook scripts:** The Claude Code documentation recommends using absolute paths (not relative paths) when pointing to hook scripts. This is a security best practice that guards against attacks like **path interception** and **binary planting**, where a malicious script could be substituted if a relative path is used.

**Absolute paths make sharing harder:** The downside is that absolute paths are machine-specific, so you can't simply commit a `settings.json` with hardcoded paths and share it with teammates — the paths will be wrong on their machines.

**The solution — a template file with `$PWD`:** The project includes a `settings.example.json` file where script paths use `$PWD` as a placeholder for the current working directory. Running `npm run setup` (via `init-claude.js`) replaces `$PWD` with the actual absolute path and writes the result to `settings.local.json`.

**Bottom line:** This pattern lets you share hook configurations safely in version control (via `settings.example.json`) while still following the security recommendation of using absolute paths at runtime (via the generated `settings.local.json`).

## Here are the key takeaways from the **"Useful hooks!"** lesson:

**What Claude Code Hooks Do**
Hooks run automatically when Claude modifies your code, providing immediate feedback and catching issues that Claude often misses on its own — especially useful on larger projects.

**Hook #1: TypeScript Type Checking**
When Claude updates a function signature, it often forgets to update all the call sites elsewhere in the project. A post-tool-use hook solves this by running `tsc --noEmit` after every file edit, capturing type errors, and feeding them back to Claude so it can fix them immediately. This principle applies to any typed language — or you can use automated tests for untyped languages.

**Hook #2: Query Duplication Prevention**
On large projects, Claude tends to write new database queries instead of reusing existing ones. A hook that watches the `/queries` directory can trigger a *second* Claude instance to review changes and flag duplicates, prompting the original Claude to use existing functions instead. This keeps the codebase clean but comes at the cost of extra time and API usage, so it's best to monitor only critical directories.

**Broader Principles to Apply**

- Use compiler/linter output for instant, automated feedback
- Use separate Claude instances to implement "code review" workflows
- Focus monitoring on high-value directories, not everything
- Weigh the benefits of automation against the performance/cost overhead

The core idea is to **identify your specific development pain points and create targeted hooks** that catch and correct those issues automatically, before they compound into bigger problems.

## Here are the key takeaways from **"Another useful hook"**:

**More Hook Types Exist Beyond PreToolUse/PostToolUse**
Claude Code has several additional hooks you can leverage: `Notification` (when Claude needs permission for a tool), `Stop` (when Claude finishes responding), `SubagentStop` (when a sub-task/agent finishes), `PreCompact` (before context compaction), `UserPromptSubmit` (when a user submits a prompt), `SessionStart`, and `SessionEnd`.

**The Stdin Input Varies by Hook Type**
This is the tricky part — the data your hook script receives via stdin differs significantly depending on which hook is firing. For example, a `PostToolUse` hook watching `TodoWrite` will receive detailed todo data (content, status, priority, IDs), while a `Stop` hook receives much simpler session info. Additionally, for `PreToolUse`/`PostToolUse` hooks, the `tool_input` payload further changes based on *which tool* was called.

**Use a Logging Helper Hook to Understand Your Data**
To make it easier to figure out what data your hook is receiving, set up a simple helper hook with the command `jq . > post-log.json`. This writes the full stdin input to a file so you can inspect exactly what data structure your hook script should be parsing — making hook development much simpler.

**The Core Principle**
Before writing a real hook, understand its input format first. The shape of the data changes based on both the hook event type and the specific tool involved, so logging it out first saves a lot of guesswork.

## Here are the key takeaways from **The Claude Code SDK** page:

**What it is:** The Claude Code SDK lets you run Claude Code programmatically inside your own apps and scripts — rather than just at the terminal. It's available for TypeScript, Python, and via the CLI.

**Same Claude Code, programmatically:** The SDK runs the exact same Claude Code you're familiar with, with access to all the same tools — you're just triggering it from code instead of a terminal prompt.

**Default permissions are read-only:** Out of the box, the SDK can only read files, search directories, and run grep. To enable write/edit capabilities, you must explicitly pass `allowedTools` (e.g., `["Edit"]`) or configure permissions in the project's `.claude` settings file.

**Inherits project settings:** The SDK picks up settings from any Claude Code configuration already present in the same directory, making it easy to integrate into existing projects.

**Best suited for pipelines, not standalone use:** It's most powerful as part of larger workflows, such as:

- Git hooks for automatic code review
- Build scripts that analyze or optimize code
- CI/CD pipeline quality checks
- Automated documentation generation
- Custom helper/maintenance commands

**Simple to use:** Basic usage is just a few lines — pass a prompt to the `query()` function and iterate over the streamed messages. The final message contains Claude's complete response.

In short, the SDK is a way to embed AI-powered development intelligence anywhere in your tooling where programmatic access is more practical than a terminal session.