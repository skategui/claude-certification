# API

![Capture d’écran 2026-04-25 à 21.30.41.png](API/Capture_decran_2026-04-25_a_21.30.41.png)

## Here are the key takeaways from the **Temperature** lesson:

**What temperature does:** It's a value between 0 and 1 that acts as a "creativity dial," controlling how deterministic or varied Claude's responses are. Lower values make Claude more predictable; higher values introduce more randomness and creativity.

**Choosing the right temperature for your use case:**

- **Low (0.0–0.3):** Best for factual responses, coding, data extraction, and content moderation — tasks where consistency matters.
- **Medium (0.4–0.7):** Good for summarization, educational content, problem-solving, and constrained creative writing.
- **High (0.8–1.0):** Ideal for brainstorming, open-ended creative writing, marketing copy, and joke generation.

**Important caveat:** Temperature doesn't *guarantee* different outputs — it only changes the *probability* of getting them. Even at high temperatures, Claude may occasionally produce similar responses.

**Implementation:** Adding temperature to your API calls is simple — just include it as a parameter (e.g., `temperature=1.0`) in your request dictionary.

The core principle is to **match temperature to your task**: precision tasks need low temperature, creative tasks benefit from higher temperature, and most general tasks fall comfortably in the middle range.

## Here are the key takeaways from the **Response Streaming** lesson:

**Why streaming matters:** Standard API calls make users wait 10–30 seconds staring at a spinner. Streaming solves this by sending text chunk-by-chunk as Claude generates it, making the experience feel much more responsive.

**How it works:** With streaming enabled, Claude immediately acknowledges the request and then sends a series of events containing small pieces of the response. Your server forwards these chunks to the client in real time, so users see text appear word by word — all within a single API request.

**Key stream event types:** The stream produces several events (MessageStart, ContentBlockStart, ContentBlockDelta, ContentBlockStop, MessageDelta, MessageStop). The most important one is **ContentBlockDelta**, which carries the actual generated text.

**Two implementation approaches:**

- **Manual event loop** — Use `stream=True` in `messages.create()` and iterate over raw events yourself.
- **Simplified text stream** — Use `client.messages.stream()` with `stream.text_stream`, which automatically filters out everything except the text content. This is the preferred approach for most use cases.

**Getting the full message after streaming:** Use `stream.get_final_message()` after the stream completes. This gives you the complete assembled message object, which is useful for saving to a database or further processing — so you get the best of both worlds: real-time UX and a complete response for your app logic.

## Here are the key takeaways from the **Structured Data** lesson:

**The Problem:** By default, Claude wraps structured outputs (like JSON) in markdown code blocks and adds explanatory text, which creates friction when you need clean, raw data for applications.

**The Solution — Assistant Message Prefilling + Stop Sequences:** You can combine two techniques to extract only the raw content:

- **Prefill the assistant message** with the opening of the format you expect (e.g., ````json`) so Claude "thinks" it already started that block.
- **Set a stop sequence** matching the closing delimiter (e.g., `````) so generation stops right before Claude would close the block and add extra commentary.

**How it works in practice:** The result is clean, unformatted output — just the JSON (or other data) with no markdown wrappers or explanations. You may need to call `.strip()` to clean up minor whitespace.

**This technique generalizes beyond JSON** — it works for any structured content where you want just the data: Python code snippets, CSV data, bulleted lists, or any formatted content. The key is identifying the delimiter Claude naturally uses to wrap that content type, then using it as both the prefill and the stop sequence.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623327_03_-_011_-_Structured_Data_15.1748623326804.png](API/instructor_a46l9irobhg0f5webscixp0bs_public_1748623327_03_-_011_-_Structured_Data_15.1748623326804.png)