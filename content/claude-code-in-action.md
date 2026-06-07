# Claude code on action

# **Key Takeaways**

Understanding coding assistants comes down to a few essential points:

- Coding assistants use language models to complete different tasks
- Language models need tools to handle most real-world programming tasks
- Not all language models use tools with the same skill level
- Claude's strong tool use enables better security, customization, and longevity in Claude Code

This tool-use capability is what transforms a simple text-generating model into a powerful coding assistant that can read your files, understand your codebase, and make meaningful changes to your projects.

![1.png](Claude%20code%20on%20action/1.png)

## Here are the key takeaways from the **"Adding Context"** lesson:

**Context Management Matters**
Give Claude only the *relevant* context it needs — too much irrelevant information actually hurts its performance.

**The `/init` Command**
Running `/init` at the start of a new project tells Claude to analyze your codebase and auto-generate a `CLAUDE.md` file summarizing the project's architecture, key files, and coding patterns.

**The `CLAUDE.md` File**
This file acts like a persistent system prompt for your project. It's included in every request you make to Claude. There are three locations for it:

- `CLAUDE.md` — shared with your team via source control
- `CLAUDE.local.md` — personal/private customizations
- `~/.claude/CLAUDE.md` — global instructions applied across all your projects

**Custom Instructions with `#` (Memory Mode)**
Use the `#` command to add or update instructions in `CLAUDE.md` intelligently. For example, typing `# Use comments sparingly` will merge that rule into the file automatically.

**File Mentions with `@`**
Type `@` followed by a file path to include a specific file's contents in your request. Claude will surface related files for you to choose from, ensuring it has exactly the right code to reference.

**Pinning Files in `CLAUDE.md`**
You can use `@` syntax inside `CLAUDE.md` itself to pin important files (like a database schema) so their contents are automatically included in *every* request, saving you from repeatedly pointing Claude to the same files.

## Here are the key takeaways from the "Making changes" lesson:

**Screenshots for Communication**
Use `Ctrl+V` (not Cmd+V on macOS) to paste screenshots directly into Claude Code. This helps Claude understand exactly what part of your UI you want to change.

**Planning Mode**
Activate with `Shift + Tab` twice (or once if already auto-accepting edits). Use this when tasks require broad codebase understanding — Claude will explore your project, create a detailed plan, and wait for your approval before making any changes.

**Thinking Modes**
Claude offers escalating levels of reasoning: "Think" → "Think more" → "Think a lot" → "Think longer" → "Ultrathink." Each level gives Claude more tokens to reason deeply about complex problems.

**When to Use Each**

- **Planning Mode** → broad tasks touching multiple files or components
- **Thinking Mode** → deep logic problems, debugging, or algorithmic challenges
- You can **combine both** for tasks requiring breadth *and* depth, but note that both consume extra tokens, so there's a cost tradeoff.

## Here are the key takeaways from the "Making changes" lesson:

**Screenshots for Communication**
Use `Ctrl+V` (not Cmd+V on macOS) to paste screenshots directly into Claude Code. This helps Claude understand exactly what part of your UI you want to change.

**Planning Mode**
Activate with `Shift + Tab` twice (or once if already auto-accepting edits). Use this when tasks require broad codebase understanding — Claude will explore your project, create a detailed plan, and wait for your approval before making any changes.

**Thinking Modes**
Claude offers escalating levels of reasoning: "Think" → "Think more" → "Think a lot" → "Think longer" → "Ultrathink." Each level gives Claude more tokens to reason deeply about complex problems.

**When to Use Each**

- **Planning Mode** → broad tasks touching multiple files or components
- **Thinking Mode** → deep logic problems, debugging, or algorithmic challenges
- You can **combine both** for tasks requiring breadth *and* depth, but note that both consume extra tokens, so there's a cost tradeoff.

## Here are the key takeaways from the **"Controlling Context"** lesson:

**Interrupting with Escape**
Press `Escape` to stop Claude mid-response when it's heading in the wrong direction or trying to tackle too much at once. This lets you redirect focus to one specific task at a time.

**Combining Escape with Memories**
When Claude repeatedly makes the same mistake, you can press `Escape` to stop it, then use `#` to add a memory with the correct approach. This prevents the error from recurring in future conversations.

**Rewinding Conversations**
Double-tap `Escape` to view your message history and jump back to an earlier point in the conversation. This is useful for removing irrelevant or distracting back-and-forth (e.g., a long debugging detour) while preserving useful context.

**Context Management Commands**

- `/compact` — Summarizes the conversation history while keeping the key knowledge Claude has built up. Best for long conversations where Claude has learned a lot and you want to continue with related tasks.
- `/clear` — Wipes the conversation entirely for a fresh start. Best when switching to a completely unrelated task where prior context could confuse Claude.

**The Big Picture**
These tools aren't just conveniences — they're essential for productive AI-assisted development. Using them strategically during long sessions, task transitions, or when Claude keeps making errors helps maintain focus and keeps the workflow efficient.

## Here are the key takeaways from the **Custom Commands** lesson:

**What are Custom Commands?**
Beyond Claude Code's built-in slash commands, you can create your own custom commands to automate repetitive tasks.

**How to Create Them**
You set up a folder structure: inside your project's `.claude` folder, create a `commands` directory, then add a markdown file (e.g., `audit.md`). The filename becomes the command name (`/audit`). You must restart Claude Code after creating a new command.

**Using Arguments**
Commands can accept dynamic input using the `$ARGUMENTS` placeholder, making them flexible and reusable. For example, `/write_tests hooks/use-auth.ts` passes a file path as an argument.

**Key Benefits**

- **Automation** — Turn multi-step workflows into a single command.
- **Consistency** — Ensure the same steps are always followed.
- **Context** — Embed project-specific conventions (e.g., testing frameworks, file naming) directly into the command.
- **Flexibility** — Arguments let the same command work across different inputs.

**Best Use Cases**
Custom commands shine for project-specific workflows like running test suites, auditing dependencies, deploying code, or generating boilerplate that follows your team's standards.

## Here are the key takeaways from the **MCP Servers with Claude Code** lesson:

**What MCP Servers Are**
MCP (Model Context Protocol) servers extend Claude Code's capabilities by giving it new tools and abilities. They can run locally or remotely, and connect Claude to your broader development toolchain.

**Installing & Managing Them**
You add MCP servers via the terminal using `claude mcp add`. To avoid repeated permission prompts, you can pre-approve servers by adding them to the `allow` array in `.claude/settings.local.json` (note the double underscore format, e.g. `mcp__playwright`).

**The Playwright Example**
One of the most popular MCP servers is Playwright, which lets Claude control a real web browser. This means Claude can visually inspect your app — not just the code — enabling it to make far more informed decisions about things like UI/styling improvements.

**A Practical Workflow**
Rather than manually testing and tweaking, you can have Claude open your app, generate a component, analyze the visual output, and then update your generation prompts automatically — creating a feedback loop that improves results over time.

**The Broader Ecosystem**
Playwright is just the beginning. The MCP ecosystem includes servers for databases, API testing, file system operations, cloud services, and dev tool automation — effectively turning Claude into a comprehensive development partner across your entire toolchain.

## Here are the key takeaways from the **GitHub Integration** lesson:

**Setup is simple:** Run `/install-github-app` in Claude Code to kick off the setup. It walks you through installing the GitHub app, adding your API key, and auto-generating a pull request with the necessary workflow files.

**Two default workflows are included:**

- **Mention Action** — Tag `@claude` in any issue or PR, and Claude will analyze the request, work through your codebase, and reply with results directly in GitHub.
- **Pull Request Action** — Every new PR triggers an automatic Claude review that analyzes changes and posts a detailed report.

**Workflows are fully customizable:** After merging the initial PR, you can edit the workflow files to add project setup steps, provide custom instructions (e.g., telling Claude the server is already running or how to query the database), and configure MCP servers for extra capabilities like browser automation via Playwright.

**Tool permissions must be explicit:** Unlike local development, GitHub Actions requires you to individually list every tool Claude is allowed to use — there are no permission shortcuts. This is especially critical when using MCP servers.

**The big picture:** The integration turns Claude into an autonomous team member within your GitHub workflow — capable of handling tasks, reviewing code, and providing insights without manual intervention. The recommended approach is to start with defaults and customize gradually as you learn what your project needs.