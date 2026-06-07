# Agents and workflows

## Here are the key takeaways from the **Agents and Workflows** lesson:

**Workflows vs. Agents — What's the difference?**

- **Workflows** are a predefined series of calls to Claude to solve a specific problem through known, fixed steps. Use them when you can clearly picture the exact flow ahead of time, or when your app constrains users to specific tasks.
- **Agents** give Claude a goal and a set of tools, letting Claude figure out *how* to complete the goal on its own. Use them when the task or parameters are unpredictable.

**You've already been using both** — any time you gave Claude tools and let it decide how to use them, that was an agent.

**The Evaluator-Optimizer Pattern** is a practical workflow pattern worth knowing:

- A **Producer** generates output (e.g., Claude models a 3D part)
- A **Grader** evaluates the output against criteria
- If the output isn't good enough, feedback loops back to the Producer
- This repeats until the output passes — great for quality-sensitive, iterative tasks

**Practical example:** An image-to-CAD workflow (user uploads a part photo → Claude describes it → Claude models it in CadQuery → a rendering is graded → fixes are applied if needed) is a textbook Evaluator-Optimizer use case.

**Key mindset:** Workflow patterns are *repeatable recipes* — they don't write the code for you, but they give you proven structures to build from. The more patterns you know, the faster you can design effective Claude-powered features.

## Here are the key takeaways from the **Parallelization Workflows** lesson:

**The Core Idea**
Instead of using one complex prompt to handle a multi-faceted task, split it into multiple parallel requests — each focused on a single aspect — then aggregate the results in a final step.

**How It Works**

1. Break a complex task into independent sub-tasks
2. Run all sub-tasks simultaneously (in parallel)
3. Feed all results into a final aggregation step for a combined decision

**Why It's Better Than One Big Prompt**

- **Focused attention** — Claude performs better when evaluating one specific thing at a time rather than juggling many competing criteria at once
- **Easier optimization** — you can tune and test each sub-task's prompt independently without affecting others
- **Better scalability** — adding new criteria or options is as simple as adding another parallel request
- **Improved reliability** — reducing cognitive load on the model leads to more consistent results

**Important Note**
The parallel sub-tasks don't need to be identical — each can have its own specialized prompt, tools, or evaluation criteria.

**When to Use This Pattern**
Look for tasks where you're asking Claude to consider multiple criteria, compare several options, or make decisions across different domains. The key signal is that the sub-tasks can operate independently of each other.

## Here are the key takeaways from the **Chaining Workflows** lesson:

**What it is:** Workflow chaining breaks a large, complex task into smaller, sequential subtasks — each handled by Claude one at a time, rather than all at once.

**Why it works better than one big prompt:** Giving Claude a single focused task lets it concentrate fully on that task, rather than juggling multiple requirements. This consistency improves overall output quality.

**The "long prompt problem":** When you load Claude with many constraints in one prompt (e.g., "don't use emojis, avoid mentioning AI, use a professional tone"), it often still violates some of them. Chaining solves this.

**The two-step chaining solution:**

- Step 1: Generate the initial output, accepting it may be imperfect.
- Step 2: Send a follow-up prompt specifically focused on revising and fixing constraint violations.

**Other advantages of chaining:**

- You can insert non-LLM processing steps between Claude calls (e.g., fetching data, formatting, API calls).
- It keeps each Claude interaction manageable and auditable.
- It's especially powerful for tasks that are inherently sequential and can't be parallelized.

**When to use it:** Complex multi-requirement tasks, situations where Claude consistently misses constraints, or workflows where you need to validate/transform outputs between steps.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748543144_11_-_003_-_Chaining_Workflows_03.1748543144730.jpg](Agents%20and%20workflows/instructor_a46l9irobhg0f5webscixp0bs_public_1748543144_11_-_003_-_Chaining_Workflows_03.1748543144730.jpg)

## Here are the key takeaways from the **Routing Workflows** lesson:

**Core Concept:** Routing workflows categorize incoming user requests and direct them to specialized processing pipelines, rather than relying on a single generic prompt for all inputs.

**How It Works (2 steps):**

1. **Categorization** — Send the user's input to Claude first, asking it to classify the request into a predefined category (e.g., Educational, Entertainment, Comedy).
2. **Specialized Processing** — Use that category to select the matching prompt template and generate the response.

**Key Architecture Points:**

- User input flows to a *router* first, then to *only one* specialized pipeline — not all of them.
- Each pipeline can have its own prompts, workflows, and tools optimized for that category.
- This "single pipeline" routing is what allows each path to be highly tuned for its use case.

**When to Use Routing:**

- Your app handles diverse request types that require meaningfully different responses.
- You can define clear, reliable categories upfront.
- Claude can handle the categorization step consistently.
- The gains from specialization outweigh the small overhead of the extra routing call.

**Best Use Cases:** Customer service bots, content generation tools, and any application where the "right" response depends on the *type* of request, not just its content.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748543145_11_-_004_-_Routing_Workflows_17.1748543145286.jpg](Agents%20and%20workflows/instructor_a46l9irobhg0f5webscixp0bs_public_1748543145_11_-_004_-_Routing_Workflows_17.1748543145286.jpg)

## Here are the key takeaways from the **Agents and Tools** lesson:

**Agents vs. Workflows**
Agents are best when you *don't* know the exact steps needed upfront. Unlike structured workflows, agents let Claude figure out how to reach a goal on its own using a set of available tools — but this flexibility comes with trade-offs in reliability and cost.

**The Power of Tool Chaining**
Simple tools become powerful when combined. Claude can chain multiple tools in sequence to handle complex, multi-step requests, and can even recognize when it needs to ask the user for more information before proceeding.

**Abstract Tools Over Specialized Ones**
The key design principle is to provide *generic, flexible* tools rather than hyper-specialized ones. Claude Code is a great example — it uses broad tools like `bash`, `read`, `write`, and `grep` rather than purpose-built tools like "refactor code." This lets the agent handle scenarios developers never explicitly planned for.

**Design for Combinability**
When building agents, give Claude tools that can be creatively combined. A well-chosen small set of composable tools (e.g., video processing, image generation, text-to-speech, media posting) can support both simple and highly interactive workflows, allowing the agent to adapt dynamically based on user feedback.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748543188_11_-_005_-_Agents_and_Tools_16.1748543188372.jpg](Agents%20and%20workflows/instructor_a46l9irobhg0f5webscixp0bs_public_1748543188_11_-_005_-_Agents_and_Tools_16.1748543188372.jpg)

## Here are the key takeaways from the **Environment Inspection** lesson:

**Claude Operates Blindly Without Feedback**
Claude has no inherent awareness of what its actions actually do. It must be able to *observe the results* of each action to understand the new state of its environment and decide what to do next.

**Always Read Before Writing**
Before modifying anything (a file, a config, code), Claude should first inspect the current state. This prevents breaking existing functionality and ensures changes are made with full context.

**Use System Prompts to Enforce Inspection**
You can instruct Claude via the system prompt to actively verify its work — for example, running a tool to check audio placement in a video, or extracting screenshots at intervals to visually confirm output quality.

**Key Benefits of Environment Inspection**
Giving Claude visibility into results improves four things: progress tracking, error detection, quality assurance, and adaptive behavior (adjusting its approach based on what it observes).

**The Core Design Question**
When building any agent, always ask: *"How will Claude know if this action worked?"* Then provide the tools and instructions needed to answer that question — whether that means reading file contents, checking API responses, taking screenshots, or validating generated output.

The bottom line: environment inspection transforms Claude from a blind command executor into an agent that can truly understand, verify, and adapt within its working environment.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748543182_11_-_006_-_Environment_Inspection_11.1748543182591.jpg](Agents%20and%20workflows/instructor_a46l9irobhg0f5webscixp0bs_public_1748543182_11_-_006_-_Environment_Inspection_11.1748543182591.jpg)

## Here are the key takeaways from the **Workflows vs. Agents** lesson:

**Workflows = Predefined, Structured Steps**
Use workflows when you know the exact sequence of steps needed to complete a task. By breaking a big task into smaller, focused subtasks, Claude can work more precisely — leading to higher accuracy, easier testing, and more predictable results.

**Agents = Flexible, Open-Ended Problem Solving**
Use agents when you *don't* know what tasks will come in. Agents receive a set of tools and figure out how to combine them creatively to handle novel, unpredictable situations — and can ask users for more input when needed.

**Workflows Win on Reliability**
Workflows are far easier to evaluate and test, more predictable, and better suited for well-defined production problems. Their main downside is limited flexibility — they require upfront planning and are constrained to specific use cases.

**Agents Win on Flexibility, But Come With Costs**
Agents can handle a wide variety of tasks, but they have a lower task completion rate, are harder to test (since you can't predict the steps they'll take), and behave less consistently.

**The Core Recommendation: Default to Workflows**
Users care about products that *work reliably*, not about architectural sophistication. The guidance is clear: **always prefer workflows where possible, and only use agents when truly necessary** — specifically when requirements are too unpredictable or varied for a workflow to handle.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748543217_11_-_007_-_Workflows_vs_Agents_00.1748543217764.jpg](Agents%20and%20workflows/instructor_a46l9irobhg0f5webscixp0bs_public_1748543217_11_-_007_-_Workflows_vs_Agents_00.1748543217764.jpg)