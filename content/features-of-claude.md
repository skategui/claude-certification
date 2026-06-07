# Features of Claude

## Here are the key takeaways from the **Extended Thinking** lesson:

**What it is:** Extended thinking is Claude's advanced reasoning feature that lets the model "think out loud" before giving a final answer — essentially a scratch pad for working through complex problems. The response includes both a reasoning block and a final answer.

**Key benefits:**

- Better reasoning on complex tasks
- Higher accuracy on difficult problems
- Transparency into Claude's thought process

**Important trade-offs:**

- Higher cost (thinking tokens are billed)
- Increased latency
- More complex response handling in code

**When to use it:** Don't default to it. First run your prompts without thinking, optimize them, and only enable extended thinking if accuracy still falls short. It's a last resort tool, not a first step.

**Security — Signature system:** Thinking blocks include a cryptographic signature to prevent tampering. Modifying the thinking text could push the model toward unsafe behavior, so the signature ensures integrity.

**Redacted thinking:** Sometimes Claude's internal safety systems flag parts of its reasoning, returning encrypted "redacted" thinking blocks instead of readable text. These can still be passed back to Claude in follow-up messages to preserve context.

**Implementation basics:** You enable it by adding `thinking=True` and setting a `thinking_budget` (minimum 1,024 tokens). Your `max_tokens` must exceed the thinking budget.

**Compatibility note:** Extended thinking is **not compatible** with some features, including message pre-filling and custom temperature settings.

## Here are the key takeaways from the **"Image Support"** lesson:

**Vision Capabilities**
Claude can analyze images in many ways — describing content, comparing multiple images, counting objects, and performing complex visual tasks.

**Image Handling Limits**

- Up to 100 images per request, with a max of 5MB per image.
- Single image: max 8,000px per side; multiple images: max 2,000px per side.
- Images can be sent as base64-encoded data or a URL.
- Token cost is calculated as: `(width × height) / 750`.

**Message Structure**
Images are passed as "image blocks" alongside "text blocks" in the user message. The flow works the same as text-only conversations.

**Prompting is Everything**
Simple prompts lead to poor results. The same prompt engineering techniques used for text apply to images:

- Provide detailed instructions and step-by-step methodologies.
- Use one-shot or multi-shot examples (e.g., show Claude an image with a known answer before asking about the target image).
- Break complex tasks into smaller, structured steps.

**Real-World Example — Fire Risk Assessment**
A well-structured prompt that walks Claude through specific steps (residence identification → tree overhang → fire risk factors → defensible space → final rating) produces far more accurate and actionable results than a vague prompt like "give me a fire risk score."

**Core Principle:** Invest time in crafting detailed, structured prompts for image tasks — don't expect reliable results from simple, one-line questions.

## Here are the key takeaways from the **"PDF Support"** lesson:

**PDF Processing Works Like Image Processing**
The code structure for sending a PDF to Claude is nearly identical to sending an image — the main differences are just a few field values.

**Key Code Changes from Image to PDF**
When adapting image-processing code for PDFs, you need to:

- Change the file extension to `.pdf`
- Set the block `type` to `"document"` (instead of `"image"`)
- Set the `media_type` to `"application/pdf"` (instead of `"image/png"`)
- Update variable names for clarity (e.g., `file_bytes` instead of `image_bytes`)

**What Claude Can Extract from PDFs**
Claude goes beyond simple text extraction — it can understand and analyze text content, embedded images and charts, tables and their data relationships, and overall document structure and formatting.

**Core Principle:** Claude is essentially a one-stop solution for PDF document processing, whether you need summaries, specific data extraction, or analysis of complex content like tables and charts.

## Here are the key takeaways from the **"Citations"** lesson:

**What Citations Do**
Citations allow Claude to reference specific parts of your source documents in its responses, creating a clear, verifiable trail from Claude's answers back to the original material — transforming it from a "black box" into a transparent research assistant.

**How to Enable Citations**
Add two fields to your document block: a `title` (a readable name for the document) and `"citations": {"enabled": True}`. This works for both PDF and plain text sources.

**What Citation Data Includes**
When enabled, each citation in Claude's structured response contains the exact quoted text (`cited_text`), which document it came from (`document_index` and `document_title`), and the location within the document — page numbers for PDFs, or character positions for plain text.

**Building UIs with Citations**
The real power comes from building interactive interfaces where users can hover over citation markers to see the source, verify information against the original document, and explore context around specific facts.

**When to Use Citations
Citations are most valuable when accuracy verification is important, when working with authoritative sources, when your application requires transparency, or when users may want to dive deeper into the source material.**

**Core Principle:** Citations turn Claude into a transparent, trustworthy research tool by grounding every response in traceable source material, which builds user confidence and enables deeper exploration.

## Here are the key takeaways from the **"Prompt Caching"** lesson:

**What Prompt Caching Does**
Instead of discarding all preprocessing work after each request, Claude saves it in a cache so it can be reused when the same content appears in subsequent requests — speeding up responses and reducing costs.

**How Normal Processing Works (Without Caching)**
Every request goes through substantial preprocessing: tokenization, embedding creation, and context analysis — all of which gets thrown away after the response is sent. This becomes wasteful when follow-up requests contain the same content.

**How Caching Fixes This**
On the initial request, Claude performs preprocessing as usual but stores the results in a cache. Follow-up requests that include the same content can skip that preprocessing work entirely by reading from the cache.

**Key Benefits**

- Faster response times for cached content
- Lower costs — you pay less for the cached portions of your requests
- Automatic optimization — the first request writes to the cache, subsequent ones read from it

**Important Limitations**

- Cache lifespan is only **one hour** — cached content expires after that
- Only useful when the **same content is sent repeatedly** and at **high frequency**
- Not beneficial for one-off or highly varied requests

**Best Use Cases**
Prompt caching shines in document analysis workflows (asking multiple questions about the same large document) and iterative editing tasks where the base content stays constant while specific parts are refined.

**Core Principle:** Prompt caching is a targeted optimization — it pays off most when you're repeatedly processing the same large content within a short time window.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748542540_08_-_005_-_Prompt_Caching_19.1748542540458.jpg](Features%20of%20Claude/instructor_a46l9irobhg0f5webscixp0bs_public_1748542540_08_-_005_-_Prompt_Caching_19.1748542540458.jpg)

## Here are the key takeaways from the **"Rules of Prompt Caching"** lesson:

**Caching is Not Automatic**
You must manually add a **cache breakpoint** to specific blocks in your messages. Everything before and including the breakpoint gets cached; content after it is processed normally.

**How Cache Breakpoints Work**
To add a breakpoint, use the longhand (expanded) form for text blocks and include a `cache_control` field set to `{"type": "ephemeral"}`. The shorthand form doesn't support this field.

**Exact Match Required**
For the cache to be used on follow-up requests, the content up to and including the breakpoint must be **completely identical**. Even a small change (like adding "please") invalidates the cache and forces full reprocessing.

**Cross-Message Caching**
Cache breakpoints can span multiple messages and message types. Placing a breakpoint in a later message will include all prior messages (user, assistant, etc.) in the cached content — useful for caching entire conversation contexts.

**What Can Be Cached**
Breakpoints can be added to text blocks, system prompts, tool definitions, image blocks, and tool use/result blocks. System prompts and tool definitions are the best candidates since they rarely change between requests.

**Cache Processing Order**
Claude processes components in this order: tools → system prompt → messages. Understanding this helps with strategic breakpoint placement. You can add up to **4 cache breakpoints** per request.

**Minimum Token Threshold**
Content must be at least **1,024 tokens** (combined across all blocks being cached) to qualify for caching. Short messages won't meet this threshold.

**Core Principle:** Effective prompt caching comes down to identifying the parts of your requests that stay consistent across calls, then placing breakpoints strategically to maximize cache reuse and minimize invalidation.

## Here are the key takeaways from the **"Prompt Caching in Action"** lesson:

**Best Candidates for Caching**
The biggest gains come from caching large, stable content that repeats across requests — specifically large system prompts (e.g., a 6K token coding assistant prompt) and complex tool schemas (e.g., ~1.7K tokens for multiple tools).

**How to Cache Tool Schemas**
Add a `cache_control: {"type": "ephemeral"}` field to the **last tool** in your tools list. Best practice is to work on a copy of the tools list and last tool rather than modifying the originals directly, to avoid bugs if tool order ever changes.

**How to Cache System Prompts**
Convert the system prompt from a plain string into a structured text block with a `cache_control` field. This switches it from the shorthand format to the longhand format that supports caching.

**Reading the Cache in API Responses**
The response's usage data tells you what happened:

- `cache_creation_input_tokens` — first request, Claude wrote to the cache
- `cache_read_input_tokens` — follow-up request, Claude read from the cache
- New creation tokens appearing — cache was invalidated and rewritten

**Cache is Extremely Sensitive**
Even a single character change in your tools or system prompt invalidates the cache for that component entirely.

**Granular, Ordered Caching**
Multiple cache breakpoints are processed in order: tools → system prompt → messages. If only the system prompt changes, the tools cache is still read (partial hit) while only the system prompt is rewritten — you only pay to reprocess what actually changed.

**Core Principle:** Prompt caching delivers the most value in applications with consistent tool schemas and stable system prompts that are called frequently. It's optimized for high-frequency, short-window reuse — not long-term storage.

## Here are the key takeaways from the "Code Execution and the Files API" lesson:

**Files API**
Rather than encoding files as base64 directly in every message, you upload files once, get back a unique file ID, and reference that ID in future requests. This is especially efficient when reusing the same file multiple times or working with large files.

**Code Execution Tool**
This is a server-side tool that lets Claude run Python in an isolated Docker container — no setup needed on your end. Important constraints: the container has no network access, but Claude can execute code multiple times within a single conversation, iterating as needed.

**Why Combining Them Is Powerful**
Since the Docker container can't reach the internet, the Files API becomes the essential bridge for getting data *in* (via container upload blocks) and getting generated outputs *out* (plots, reports, etc. are stored as files you can download via their file IDs).

**Typical Workflow**
Upload your data file → reference it in a message with a `container_upload` block → ask Claude to analyze or transform it → Claude writes and runs code → download any generated outputs (charts, reports) using the Files API.

**Response Structure to Expect**
Claude's response will contain multiple block types: text explanations, the actual code it ran (server tool use blocks), and the code execution results. Claude may run code several times in one response, building up its analysis iteratively.

**Use Cases Beyond Data Analysis**
The pattern works for image processing, document parsing, mathematical modeling, and custom report generation — essentially any task that benefits from real computation rather than just text generation.

The core insight is that this combination lets you delegate complex computational work to Claude while keeping full control over inputs and outputs through the Files API.