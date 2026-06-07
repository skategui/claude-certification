# MCP

## Here are the key takeaways from this MCP Clients lesson:

**What an MCP Client Does:** It acts as the communication bridge between your application (server) and MCP servers, handling all protocol details so your app doesn't have to manage that complexity directly.

**Transport Agnostic:** MCP clients aren't locked into one communication method. They can talk to servers via stdio (standard input/output, the most common local setup), HTTP, WebSockets, or other network protocols — giving flexibility in how you deploy.

**Two Core Message Types:** The client-server interaction boils down to two main exchanges: asking what tools are available (`ListToolsRequest/Result`) and calling a specific tool (`CallToolRequest/Result`).

**The End-to-End Flow:** When a user asks a question, the process goes through many steps — your server discovers tools via the MCP client, passes them to Claude, Claude decides which tool to call, the MCP client executes it against an external service (e.g., GitHub), and results flow back to Claude to generate a final answer.

**The Big Picture:** While the flow has many steps, each component has a clear, single responsibility. The MCP client specifically abstracts away server communication complexity, letting developers focus on application logic while still leveraging powerful external tools and data sources.

![instructor_a46l9irobhg0f5webscixp0bs_public_1749849232_09_-_002_-_MCP_Clients_19.1749849231568.png](MCP/instructor_a46l9irobhg0f5webscixp0bs_public_1749849232_09_-_002_-_MCP_Clients_19.1749849231568.png)

## Here are the key takeaways from the **"Defining Tools with MCP"** lesson:

**Use the Python SDK to simplify server creation.** You can spin up an MCP server with just one line of code using `FastMCP`, eliminating the need to manually write complex JSON schemas.

**Define tools with decorators, not raw JSON.** The `@mcp.tool()` decorator lets you register tools cleanly, while Python type hints and Pydantic's `Field` class automatically generate the proper schema that Claude can understand.

**Parameter descriptions are crucial.** Each argument should have a clear `Field(description=...)` so Claude understands what the parameter expects and how to use the tool correctly.

**Error handling works naturally.** You can raise standard Python exceptions (e.g., `ValueError`) for cases like missing documents — the SDK integrates this naturally into the tool's behavior.

**Tool registration is automatic.** There's no separate registration step; decorating a function is all it takes to make it available as an MCP tool.

**The big picture:** The SDK turns tool creation from a complex schema-writing exercise into simple Python function definitions, making MCP servers much faster to build and easier to maintain.

## Here are the key takeaways from the **"The Server Inspector"** lesson:

**The Python MCP SDK includes a built-in browser-based inspector.** You can launch it with `mcp dev mcp_server.py`, which spins up a local dev server — no need to connect to a full application just to test your tools.

**Connect first, then explore.** Once you open the inspector URL in your browser, you must click the **Connect** button to initialize your server before you can interact with it. The status changes from "Disconnected" to "Connected."

**You can list, inspect, and run tools directly.** Navigate to the Tools tab, click "List Tools" to see everything registered on your server, select a tool, fill in its inputs, and run it — all from the UI.

**State persists between tool calls.** If you use an edit tool to modify data and then run a read tool, the inspector maintains server state so you can verify the changes actually took effect end-to-end.

**It replaces the need for separate test scripts.** The inspector gives you a fast feedback loop for iterating on implementations, testing edge cases, verifying tool interactions, and debugging issues — all in real-time during development.

**The UI is actively evolving.** The interface may look different over time, but the core functionality (Connect, Resources, Tools, Prompts tabs) remains consistent.

## Here are the key takeaways from the **"Implementing a Client"** lesson:

**In real-world projects, you typically build either a client or a server — not both.** This lesson builds both only for learning purposes, so you can see how the two sides interact.

**The client has two main components.** A custom wrapper class (for ease of use and automatic cleanup) and the underlying **Client Session** from the MCP Python SDK (the actual connection to the server). Proper resource management and cleanup is important when working with sessions.

**Two core functions are all you need.** The client only needs to implement `list_tools()` (to fetch available tools from the server) and `call_tool()` (to execute a specific tool by name with input parameters). Both are thin wrappers around the SDK's built-in session methods.

**The client is the bridge between your app and Claude.** Your application uses it at two key points: first to get the list of available tools to send to Claude, and second to execute whichever tool Claude decides to call.

**You can test the client in isolation.** Running `uv run mcp_client.py` directly connects to the server and prints out available tools with their descriptions and schemas — without needing the full application running.

**The end-to-end flow works like this:** your app fetches tools → sends them to Claude with the user's question → Claude picks a tool → your app calls it via the client → the result goes back to Claude → Claude responds to the user.

## Here are the key takeaways from the **"Defining Resources"** lesson:

**Resources are for fetching data, not performing actions.** Think of them like GET request handlers in an HTTP server — ideal for read-only operations where a client needs to retrieve information.

**There are two types of resources.** Direct resources have static URIs (e.g., `docs://documents`) and require no parameters — great for things like listing all available items. Templated resources have dynamic URIs with parameters (e.g., `docs://documents/{doc_id}`) that the SDK automatically parses and passes as function arguments.

**Resources follow a request-response pattern.** The client sends a `ReadResourceRequest` with a URI, the server runs the matching function, and returns a `ReadResourceResult`. Your application code never has to handle this routing manually.

**Use `mime_type` to signal what kind of data you're returning.** Common values are `application/json` for structured data, `text/plain` for plain text, and `application/pdf` for binary files. This helps clients handle the response correctly.

**The SDK handles serialization automatically.** You just return a Python object (list, dict, string, etc.) and the SDK converts it — no need to manually serialize to JSON strings.

**A practical use case: document mentions.** When a user types `@document_name`, resources let your system automatically inject that document's contents into the prompt sent to Claude — so Claude receives the context directly without needing to call a tool to fetch it.

**Test resources with the MCP Inspector.** The inspector shows both static Resources and Resource Templates as separate sections, and lets you provide parameter values for templated resources to verify responses.

## Here are the key takeaways from the **"Accessing Resources"** lesson:

**Resources inject context directly into prompts — no tool calls needed.** Instead of having Claude make a separate tool call to fetch data, resource content is included upfront in the prompt, enabling faster and more seamless responses.

**The client needs a `read_resource()` function.** This async function takes a URI string, sends a `ReadResourceRequest` to the MCP server via the session, and returns the parsed content from the `ReadResourceResult`.

**MIME type determines how to process the response.** The function checks the content's MIME type: if it's `application/json`, it parses the text as JSON and returns a Python object; otherwise, it returns the raw text. This cleanly handles both structured and unstructured data.

**The response structure uses a `contents` list.** The result from the server contains a `contents` array — you typically access `contents[0]` since you're fetching one resource at a time.

**The `@mention` pattern drives the UX.** When a user types `@` followed by a resource name in the CLI, the system shows an autocomplete list of available resources, lets the user select one, and automatically injects its content into the prompt before sending it to Claude.

**This approach is more efficient than tool-based fetching.** Because the resource content is part of the initial context, Claude can respond immediately without needing a round-trip tool call to retrieve the data — making the overall experience faster and smoother.

![instructor_a46l9irobhg0f5webscixp0bs_public_1749849281_09_-_008_-_Accessing_Resources_00.1749849281584.png](MCP/instructor_a46l9irobhg0f5webscixp0bs_public_1749849281_09_-_008_-_Accessing_Resources_00.1749849281584.png)

## Here are the key takeaways from the **"Defining Prompts"** lesson:

**Prompts are pre-built, reusable instruction templates stored on the MCP server.** Instead of users writing their own prompts from scratch, they can invoke carefully crafted ones that have already been tested and optimized for consistent, high-quality results.

**The value is in expertise and testing.** Users could ask Claude to do a task directly and get decent results, but a well-engineered prompt — with edge cases handled and best practices baked in — will reliably outperform ad-hoc user inputs. As the server author, you do that work once so users don't have to.

**Prompts use the same decorator pattern as tools and resources.** The `@mcp.prompt()` decorator takes a name and description, and the function uses `Field()` for parameter descriptions — keeping the API consistent across all three MCP primitives.

**Prompt functions return a list of messages.** The return value is a list of `UserMessage` (or `AssistantMessage`) objects, which get sent directly to Claude. You can include multiple messages to create more complex conversation flows or multi-turn setups.

**The `/command` pattern drives the UX.** Users type `/` to see available prompt commands, select one (e.g., `/format`), provide any required arguments, and Claude executes the pre-built prompt — similar to how `@` works for resources.

**Test prompts with the MCP Inspector.** The inspector shows you exactly what messages will be sent to Claude — including how variables get interpolated — so you can verify correctness before users rely on them.

**Key benefits in summary:** consistency, encoded domain expertise, reusability across multiple client apps, and centralized maintenance (update once, improve everywhere).

![3.png](MCP/3.png)

## Here are the key takeaways from the **"Prompts in the Client"** lesson:

**Two client functions are needed to support prompts.** `list_prompts()` fetches all available prompts from the server, and `get_prompt()` retrieves a specific prompt with its variables filled in — both are thin wrappers around the underlying SDK session methods.

**`get_prompt()` handles variable interpolation.** You pass a dictionary of arguments (e.g., `{"doc_id": "plan.md"}`) alongside the prompt name, and the SDK forwards these as keyword arguments to the server-side prompt function, which interpolates them into the template before returning the final messages.

**The return value is a list of ready-to-send messages.** `get_prompt()` returns `result.messages` — fully constructed user/assistant messages that can be sent directly to Claude, with all variables already substituted in.

**The `/command` UX ties it all together.** Typing `/` in the CLI surfaces available prompts as commands. Selecting one walks the user through any required arguments (e.g., choosing a document), then sends the complete, pre-built prompt to Claude automatically.

**The end-to-end prompt workflow is:** write and evaluate the prompt → define it on the server with `@mcp.prompt` → clients call `list_prompts()` to discover it and `get_prompt()` with arguments to retrieve it → Claude receives properly structured instructions every time.

**The core benefit is reusable, parameterized consistency.** Prompts allow complex workflows to be standardized — every client gets the same high-quality instructions, customized only by the variables the user provides.

## Here are the key takeaways from this MCP review lesson:

**The three core MCP server primitives, each controlled by a different part of the stack:**

- **Tools (Model-Controlled):** Claude autonomously decides when to call these. Use them to give Claude new capabilities it can use on its own — e.g., running code, performing calculations.
- **Resources (App-Controlled):** Your application code decides when to fetch and use these. Best for populating UI elements (like autocomplete) or injecting additional context into conversations — similar to how "Add from Google Drive" works in Claude's interface.
- **Prompts (User-Controlled):** Triggered by user actions (button clicks, slash commands, menu selections). Ideal for predefined, repeatable workflows that users can kick off on demand.

**Quick decision guide:**

- Giving Claude new capabilities → **Tools**
- Getting data into your app for UI or context → **Resources**
- Creating predefined workflows for users → **Prompts**

The core insight is that each primitive serves a different audience: **tools serve the model, resources serve your app, and prompts serve your users.**

## Here are the key takeaways from this MCP review lesson:

**The three core MCP server primitives, each controlled by a different part of the stack:**

- **Tools (Model-Controlled):** Claude autonomously decides when to call these. Use them to give Claude new capabilities it can use on its own — e.g., running code, performing calculations.
- **Resources (App-Controlled):** Your application code decides when to fetch and use these. Best for populating UI elements (like autocomplete) or injecting additional context into conversations — similar to how "Add from Google Drive" works in Claude's interface.
- **Prompts (User-Controlled):** Triggered by user actions (button clicks, slash commands, menu selections). Ideal for predefined, repeatable workflows that users can kick off on demand.

**Quick decision guide:**

- Giving Claude new capabilities → **Tools**
- Getting data into your app for UI or context → **Resources**
- Creating predefined workflows for users → **Prompts**

The core insight is that each primitive serves a different audience: **tools serve the model, resources serve your app, and prompts serve your users.**