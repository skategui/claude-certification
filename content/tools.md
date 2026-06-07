# Tools

## Here are the key takeaways from the "Introducing Tool Use" lesson:

**What Tool Use Solves:** By default, Claude is limited to knowledge from its training data and can't access real-time or external information. Tool use bridges this gap.

**How It Works (the flow):** Tool use is a structured back-and-forth process — your app sends Claude a question along with tool instructions → Claude requests specific data it needs → your server fetches that data from an external API or database → Claude uses the returned data to generate a final response.

**Key Benefits:**

- **Real-time information** — access current data (weather, stock prices, etc.) that wasn't available at training time
- **External system integration** — connect Claude to databases, APIs, and other services
- **Dynamic responses** — answers are based on the latest available information
- **Structured interaction** — Claude knows exactly what to ask for and how

**The big picture:** Tool use transforms Claude from a static knowledge base into a dynamic assistant capable of working with live data, unlocking a much wider range of real-world application use cases.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623644_06_-_001_-_Introducing_Tool_Use_14.1748623643863.png](Tools/instructor_a46l9irobhg0f5webscixp0bs_public_1748623644_06_-_001_-_Introducing_Tool_Use_14.1748623643863.png)

## Here are the key takeaways from the "Tool Functions" lesson:

**What Tool Functions Are:** Plain Python functions that get executed automatically when Claude determines it needs additional data to respond to a user. They're the building blocks that give Claude access to real-time info or the ability to perform actions.

**Best Practices for Writing Tool Functions:**

- **Use descriptive names** — function and parameter names should clearly communicate their purpose
- **Validate inputs** — always check that required parameters aren't empty or invalid, and raise errors when they are
- **Provide meaningful error messages** — Claude can read error messages and may retry the function call with corrected parameters, so clear errors help it self-correct

**Why Validation Matters:** Claude learns from errors. A clear message like `"Location cannot be empty"` can prompt Claude to retry with a valid value, making the whole system more robust.

**The Bigger Workflow:** Writing the function is just step one. You also need to create a JSON schema that describes the function to Claude, and then integrate it into your chat system — that's covered in subsequent lessons.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623641_06_-_003_-_Tool_Functions_06.1748623640850.png](Tools/instructor_a46l9irobhg0f5webscixp0bs_public_1748623641_06_-_003_-_Tool_Functions_06.1748623640850.png)

## Here are the key takeaways from the "Tool Schemas" lesson:

**What a Tool Schema Is:** A JSON schema that acts as documentation for Claude, telling it what arguments a function expects, when to use it, and what it returns. It's the bridge between your Python function and Claude's understanding of how to call it.

**Three Required Parts of a Tool Spec:**

- `name` — a clear, descriptive identifier for the tool
- `description` — what it does, when to use it, and what it returns
- `input_schema` — the JSON schema describing the function's parameters

**Writing Good Descriptions:** Aim for 3–4 sentences covering what the tool does, when Claude should use it, what data it returns, and detailed descriptions for each argument. The description is critical — it's how Claude decides when to call your tool.

**Pro Tip — Let Claude Write the Schema:** Rather than crafting JSON schemas by hand, you can paste your function into Claude and ask it to generate a properly formatted schema, optionally providing the Anthropic tool use docs as context.

[https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

**Code Organization:** Use a consistent naming pattern — `function_name` paired with `function_name_schema` — to keep functions and their schemas easy to match.

**Type Safety:** Import `ToolParam` from the Anthropic library and wrap your schema with it. It's not strictly required for functionality, but it prevents type errors and makes your code more robust when interacting with the API.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623701_06_-_004_-_Tool_Schemas_02.1748623700746.png](Tools/instructor_a46l9irobhg0f5webscixp0bs_public_1748623701_06_-_004_-_Tool_Schemas_02.1748623700746.png)

## Here are the key takeaways from the "Handling Message Blocks" lesson:

**A New Response Structure:** When tools are enabled, Claude no longer returns simple single text responses. Instead, it returns multi-block messages containing both text and tool usage information.

**Two Types of Blocks in a Tool Response:**

- **Text Block** — human-readable text explaining what Claude is doing (e.g., "Let me find that information for you")
- **ToolUse Block** — instructions for your code specifying which tool to call, the input parameters, and a unique ID for tracking the call

**Enabling Tools in API Calls:** You pass your tool schemas via a `tools` parameter in the API call. Claude will then decide when and how to use them based on the user's message.

**The Complete Tool Usage Flow:**

1. Send user message + tool schema to Claude
2. Receive multi-block response (text + tool use block)
3. Extract tool info and execute the actual function
4. Send the tool result back to Claude along with full conversation history
5. Receive Claude's final response

**Conversation History Is Critical:** Claude doesn't store history itself — you manage it. When appending assistant messages, you must preserve the entire `response.content` (all blocks), not just the text. Losing the ToolUse block breaks the conversation context.

**Update Your Helper Functions:** If you have existing `add_user_message()` or `add_assistant_message()` helpers, they likely only handle single text blocks and will need to be updated to support the more complex multi-block structure.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623695_06_-_005_-_Handling_Message_Blocks_07.1748623695372.png](Tools/instructor_a46l9irobhg0f5webscixp0bs_public_1748623695_06_-_005_-_Handling_Message_Blocks_07.1748623695372.png)

## Here are the key takeaways from the **"Sending Tool Results"** lesson:

**Executing the Tool & Returning Results**
After Claude requests a tool call, you must run the corresponding function using the input parameters Claude provides (via `response.content[1].input`) and send the output back to Claude.

**Tool Result Block Structure**
The results are sent back inside a `user` message using a `tool_result` block with three key properties: `tool_use_id` (must match Claude's original request ID), `content` (the function's output as a string), and `is_error` (set to `True` if something went wrong).

**Handling Multiple Tool Calls**
Claude can request multiple tools in one response, each with a unique ID. You must match each result to its corresponding ID so Claude can correctly associate results with requests.

**Complete Conversation History is Required**
Your follow-up request must include the full message history — original user message, Claude's assistant message with the tool use block, and the new user message with the tool result.

**Always Include the Tool Schema**
Even in the follow-up request (when you don't expect another tool call), you must still pass the tool schema so Claude can properly interpret the tool references in the conversation history.

**Final Response**
Once Claude receives the tool results, it generates a natural language response incorporating that information — completing the full tool use workflow.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623704_06_-_006_-_Sending_Tool_Results_04.1748623704156.png](Tools/instructor_a46l9irobhg0f5webscixp0bs_public_1748623704_06_-_006_-_Sending_Tool_Results_04.1748623704156.png)

## Here are the key takeaways from this lesson on **Multi-turn Conversations with Tools**:

**The Core Problem**
When a user asks a question that requires multiple steps (e.g., "What day is 103 days from today?"), Claude may need to call several tools in sequence before it can give a final answer. Your app must handle this automatically.

**The Multi-Turn Tool Pattern**
Claude and your server go back and forth in a loop: Claude requests a tool → your server runs it and returns the result → Claude may request another tool → repeat until Claude has enough info to answer.

**Build a Conversation Loop**
You need a `while True` loop that keeps running as long as Claude is requesting tools, and only breaks when Claude returns a final text response.

**Refactor Your Helper Functions**

- `add_user_message` should handle multiple input types (plain strings, block lists, or full Message objects), not just plain text.
- `chat` should accept a `tools` parameter and return the **full message object**, not just extracted text.

**Add a Text Extraction Helper**
Since `chat` now returns full message objects, create a `text_from_message` helper to pull out readable text from complex message structures when you need to display results to users.

**The Big Picture**
These changes make your code flexible enough to support any number of sequential tool calls — giving Claude the ability to handle complex, multi-step questions seamlessly.

## Here are the key takeaways from the "Implementing Multiple Turns" lesson:

**The Conversation Loop**
Building a multi-turn tool system requires a `while True` loop that keeps calling Claude until it signals it's done. The loop sends messages, processes responses, runs any requested tools, and feeds results back — repeating until Claude provides a final answer.

**Detecting When Claude is Finished**
The `stop_reason` field in Claude's response is the key signal. When it equals `"tool_use"`, Claude wants to call a tool and the loop should continue. Any other value means Claude has a final answer ready and the loop should break.

**Handling Multiple Tool Calls at Once**
Claude can request multiple tools in a single response. The response content is a list of blocks, so you must filter for `tool_use` blocks and process each one individually.

**Tool Result Pairing via IDs**
Every tool use block must be matched with a corresponding tool result block using the same `tool_use_id`. This is how Claude knows which result belongs to which request.

**Error Handling**
Even when a tool fails, you must still return a result block to Claude — just set `"is_error": true` and include the error message as the content. This keeps the conversation intact.

**Scalable Tool Routing**
Use a dispatcher/routing function that maps tool names to their implementations. This keeps the core loop clean and makes adding new tools straightforward without touching the conversation logic.

**Overall Flow**
The complete pattern is: send message → Claude responds (text + tool requests) → execute tools → send results back → repeat until done.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623771_06_-_008_-_Implementing_Multiple_Turns_05.1748623771473.png](Tools/instructor_a46l9irobhg0f5webscixp0bs_public_1748623771_06_-_008_-_Implementing_Multiple_Turns_05.1748623771473.png)

## Here are the key takeaways from the "Fine Grained Tool Calling" lesson:

**Tool Use with Streaming**
When combining tool use with streaming, you handle a new event type called `InputJsonEvent`, which provides both a `partial_json` chunk and a running `snapshot` of the cumulative JSON built so far.

**Default Streaming Behavior (with validation)**
By default, the Anthropic API buffers chunks and validates complete top-level key-value pairs before sending them. This means you'll experience delays followed by bursts of data — the trade-off for receiving well-formed, schema-validated JSON.

**Fine-Grained Tool Calling**
Enabling `fine_grained=True` disables server-side JSON validation, so chunks arrive as soon as Claude generates them with no buffering. The critical downside is that you may receive invalid JSON (e.g., `undefined` values), so your code must handle `json.JSONDecodeError` gracefully.

**When to Use It**
Fine-grained tool calling is best when you need real-time progress updates for users, want to start processing partial results immediately, or when buffering delays hurt your UX. For most applications, the default validated behavior is sufficient.

**Bottom line:** Fine-grained tool calling trades JSON safety for speed — you get faster, more granular streaming, but you take on the responsibility of handling malformed JSON yourself.

## Here are the key takeaways from **"The Text Edit Tool"** lesson:

**It's a built-in tool** — Unlike other tools you create from scratch, the text editor tool comes pre-built into Claude. You don't need to define its full JSON schema yourself.

**What it can do** — It lets Claude view files/directories, read specific line ranges, replace text, create new files, insert text at specific lines, and undo recent edits.

**You still need to implement the backend** — Claude knows *how to ask* for file operations, but you must write the actual code that performs them (e.g., reading from disk, writing to disk, etc.).

**Schema stubs are model-dependent** — You do need to include a small schema stub when making API requests, and the correct version depends on the Claude model you're using (e.g., `text_editor_20250124` for Claude 3.7 Sonnet, `text_editor_20241022` for Claude 3.5 Sonnet).

**Primary use case** — It's most valuable when building applications that need programmatic file editing, working in environments without a full code editor, or integrating file manipulation directly into Claude-powered apps — essentially replicating AI-powered code editor functionality within your own system.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623830_06_-_012_-_The_Text_Edit_Tool_00.1748623830120.png](Tools/instructor_a46l9irobhg0f5webscixp0bs_public_1748623830_06_-_012_-_The_Text_Edit_Tool_00.1748623830120.png)

## Here are the key takeaways from this lesson on the **Web Search Tool**:

**Setup & Requirements**

- Your organization must enable web search in the Anthropic console settings before using it.
- To enable it, you pass a simple schema object with `type`, `name`, and `max_uses` fields — no custom implementation needed.

**How It Works**

- Claude handles the entire search process automatically; you just include the schema in your `tools` array.
- The `max_uses` field caps the number of searches per request, preventing excessive API calls (Claude may do follow-up searches on its own).

**Response Structure**

- Responses contain multiple block types: text blocks, `ServerToolUseBlock` (the query used), `WebSearchToolResultBlock` (results), and citation blocks.
- Citations show exactly which source text Claude used and from which URL, providing transparency.

**Domain Restriction**

- You can limit searches to specific domains via the `allowed_domains` field — useful for ensuring authoritative sources (e.g., restricting medical queries to `nih.gov`).

**Best Use Cases**

- Current events and recent developments
- Specialized or up-to-date information outside Claude's training data
- Fact-checking and research tasks requiring authoritative sources