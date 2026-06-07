# Domaine 4 — Prompt Engineering & Structured Output

> Claude Certified Architect — Foundations · Domaine 4 · ~20% de l'examen
> Source : https://claudecertifications.com/claude-certified-architect/domains/prompt-engineering

## Overview

This domain covers how to design **production-grade prompts** that produce reliable, verifiable output from Claude. The four pillars:

1. **Explicit Criteria & Instruction Design** — write measurable criteria, not vague instructions; understand how false positives erode developer trust.
2. **Few-Shot Prompting** — guide output format and reasoning with 2-4 examples; know when and how many.
3. **Tool Use for Structured Output** — use `tool_use` to guarantee JSON schema compliance, and understand the gap between **schema compliance** and **semantic correctness**.
4. **Validation-Retry Loops & Multi-Pass Review** — production patterns for improving output quality with specific error feedback and separate-session review.

### The four Exam Tips for Domain 4 (memorize these)

1. **Explicit, measurable criteria > vague instructions (always).**
2. **2-4 few-shot examples is the sweet spot for ambiguous tasks.**
3. **`tool_use` = structural compliance, NOT semantic correctness.**
4. **Same-session self-review is an anti-pattern — use separate sessions.**

---

## 1. Explicit Criteria & Instruction Design

Write prompts with **explicit, measurable criteria** instead of vague instructions. Understand how false positives impact developer trust. This is a fundamental principle tested across multiple exam scenarios.

### Key concepts

- **Explicit criteria over vague instructions**: `flag functions over 50 lines` vs `flag long functions`.
- **False positive impact**: too many false positives erode developer trust in the system.
- **Specificity reduces ambiguity** and improves consistency across runs.
- **Measurable criteria enable automated validation** of output quality.

### Why vagueness fails in production

- "Make it better" — better how? Faster? Cleaner? Shorter?
- "Find issues" — what counts as an issue? Every style nit? Only bugs?
- "Be thorough" — leads to over-flagging, false positives, eroded trust.

### The false positive problem (alert fatigue)

When a code review tool flags too many non-issues, developers start ignoring **ALL** flags — including real problems. This is called **alert fatigue** and is directly tested on the exam.

### The fix — measurable criteria

Instead of "flag long functions," specify "flag functions exceeding 50 lines of code." Instead of "find security issues," specify "identify hardcoded strings matching patterns for API keys, passwords, or connection strings."

Measurable criteria:

- Enable consistent results across runs.
- Allow **automated validation** (you can verify flagged functions are actually >50 lines).
- Reduce false positives by narrowing scope.
- Build developer trust in the system.

### Expected patterns / ✅ Correct

- Use explicit, numeric, measurable thresholds (e.g. "functions exceeding 50 lines", "hardcoded strings matching API-key/password/connection-string patterns").
- Narrow scope to reduce false positives and preserve developer trust.
- Define criteria you can automatically validate.

### Anti-patterns / ❌ Avoid

- Vague instructions like **"make it better"** or **"improve the code"**.
- **Not considering the downstream impact of false positives** (alert fatigue → developers ignore all flags, including real bugs).

### Code example — `explicit-criteria.py` (Vague vs Explicit Prompts)

```python
# VAGUE: Results are inconsistent and over-flag
vague_prompt = """
Review this code and flag any long functions and security issues.
"""

# EXPLICIT: Measurable, automatable, fewer false positives
explicit_prompt = """
Flag functions exceeding 50 lines of code.
Identify hardcoded strings matching patterns for API keys,
passwords, or connection strings.
"""
```

---

## 2. Few-Shot Prompting

Use few-shot examples to guide Claude's **output format** and **reasoning**. Know **when** and **how many** examples to provide.

### Few-shot prompting techniques (key concepts)

- **2-4 examples**: optimal for ambiguous cases to establish format and reasoning patterns.
- **Format consistency**: all examples should follow the same output structure.
- **Edge case coverage**: include at least one example that handles an edge case.
- Few-shot is **most valuable when the task has ambiguous boundaries**.

### The golden rules of few-shot prompting

- **2-4 examples** — Fewer than 2 doesn't establish a pattern; more than 4-6 bloats the prompt without proportional benefit.
- **Format consistency** — All examples must follow the **identical** output structure.
- **Edge case coverage** — At least one example should demonstrate an ambiguous or edge case.
- **Diversity** — Cover different categories (positive/negative/neutral, simple/complex).

### When few-shot is most valuable

- Ambiguous classification tasks (sentiment with sarcasm, mixed reviews).
- Custom output formats that aren't standard.
- Domain-specific reasoning patterns.
- Tasks where the boundary between categories is fuzzy.

### When few-shot is unnecessary

- Simple, well-defined tasks (e.g., "extract the email address").
- Tasks with clear, objective criteria.
- Standard output formats (JSON, XML) that Claude handles natively.

### Expected patterns / ✅ Correct

- Provide **2-4** examples for ambiguous boundary tasks.
- Keep output structure identical across all examples.
- Include at least one edge case example (e.g. sarcasm masking sentiment).
- Skip few-shot entirely for simple, objective extraction tasks.

### Anti-patterns / ❌ Avoid

- **Too many examples (>6)** that bloat the prompt without adding value.
- **Inconsistent formatting** across examples that confuses the model.

### Code example — `few-shot.py` (Well-Structured Examples)

```python
few_shot_prompt = """
Classify customer reviews. Provide sentiment and reasoning.

Example 1 (Clear positive):
Input: "Absolutely love this product! Best purchase this year."
Output: {"sentiment": "positive", "confidence": "high",
         "reasoning": "Strong positive language, superlative"}

Example 2 (Edge case — sarcasm):
Input: "Oh great, another broken update. Just what I needed."
Output: {"sentiment": "negative", "confidence": "high",
         "reasoning": "Sarcastic positive masking frustration"}

Now classify this review:
Input: "{user_review}"
"""
```

> 🎯 **Exam Tip:** The exam tests whether you know the **optimal number of examples** (2-4 for ambiguous tasks) — not "more is always better."

---

## 3. Tool Use for Structured Output

Use `tool_use` to **guarantee JSON schema compliance**. Understand the difference between **schema compliance** and **semantic correctness**. `tool_use` is the most reliable way to get structured output from Claude: by defining a tool with a JSON schema, you guarantee the output matches the schema structure.

### Structured output via `tool_use` (key concepts)

- `tool_use` **guarantees JSON schema compliance** — the output will match the defined structure.
- **Semantic errors are still possible**: the structure is correct but the content may be wrong.
- `tool_choice` options: `'auto'`, `'any'`, or a forced specific tool for guaranteed invocation.
- Schema design: required vs optional fields, enums with `'other'` + detail, nullable fields.

### Critical distinction — structure vs semantics

- **`tool_use` guarantees STRUCTURE** — all required fields present, correct types, valid enum values.
- **`tool_use` does NOT guarantee SEMANTICS** — the values might be wrong (wrong name extracted, wrong date, etc.).

This means you **still need validation after extraction**. The schema ensures you get a valid JSON object, but the content inside might contain errors.

### `tool_choice` parameter

- **`"auto"`** — Claude decides whether to use a tool (default, general-purpose).
- **`"any"`** — Claude must use a tool but can choose which.
- **`{"type":"tool","name":"X"}`** — Force a specific tool (for extraction, guarantees schema compliance / guaranteed invocation).

### Schema design best practices

- Always include `"required"` for mandatory fields.
- Use `"enum"` for categorical fields with known values.
- Include an `"other"` category in enums **+ a detail field** for edge cases.
- Use `["string", "null"]` for fields that might be missing (nullable fields).
- Add `"description"` to each property for clarity.

### Expected patterns / ✅ Correct

- Force a specific tool (`{"type":"tool","name":"extract_invoice"}`) for guaranteed schema-compliant extraction.
- Validate the **content** after extraction — never assume the values are semantically correct.
- Add `other` + detail to enums to capture unexpected values gracefully.
- Use nullable `["string","null"]` types for fields that may be missing.

### Anti-patterns / ❌ Avoid

- **Assuming `tool_use` eliminates all errors** (it only guarantees **structural** compliance, not semantic correctness).
- **Not using enums with an `'other'` category** for fields that may have unexpected values.

### Code example — `tool-use-extraction.py` (Structured Output via `tool_use`)

```python
extract_tool = {
    "name": "extract_invoice",
    "description": "Extract structured invoice data",
    "input_schema": {
        "type": "object",
        "properties": {
            "invoice_number": {"type": "string",
                "description": "Invoice identifier"},
            "total": {"type": "number"},
            "status": {"type": "string",
                "enum": ["paid", "pending", "overdue", "other"]},
            "status_detail": {"type": ["string", "null"],
                "description": "Detail when status is 'other'"},
        },
        "required": ["invoice_number", "total", "status"],
    },
}

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    tools=[extract_tool],
    # Force the tool → guarantees schema compliance
    tool_choice={"type": "tool", "name": "extract_invoice"},
    messages=[{"role": "user", "content": f"Extract: {document}"}],
)
# Structure guaranteed — but verify content (semantics) afterwards.
```

---

## 4. Validation-Retry Loops & Multi-Pass Review

**Validation-retry loops** and **multi-pass review** are production patterns for improving output quality. The structure is guaranteed (by `tool_use`), **but you must verify the content**.

### Validation and review patterns (key concepts)

- **Validation-retry loops**: append **specific** errors to the prompt and retry for self-correction.
- **`detected_pattern` fields**: track dismissal patterns to identify systematic issues.
- **Multi-pass review**: per-file local analysis + cross-file integration pass.
- **Self-review limitations**: the same session retains its reasoning context, reducing effectiveness.
- **Batch processing**: synchronous for blocking tasks, batch for latency-tolerant workloads.

### Validation-retry loop (steps)

1. Extract data using `tool_use`.
2. Validate the output against business rules.
3. If validation fails, **append specific error details** and retry.
4. The model corrects based on the explicit feedback.
5. Track systematic failures with `detected_pattern` fields.

### Key principle — specific error feedback, not generic

- ❌ **Wrong:** "There were errors, please try again."
- ✅ **Right:** "Line items total ($450) doesn't match subtotal ($500). Tax field contains a percentage (10%) instead of a dollar amount."

### Multi-pass review strategy

- **Pass 1 (Local)**: review each file independently — catches syntax, naming, missing error handling.
- **Pass 2 (Cross-file)**: review how files interact — catches broken imports, interface mismatches.

### Same-session self-review limitation

When the same session generates **and** reviews code, it retains the original reasoning context, creating a blind spot. **Fix: use separate sessions** for generation and review.

### Batch processing strategy

- **Blocking PR review** → use **synchronous** (latency matters, it blocks a human).
- **Nightly code audit / latency-tolerant compliance scan** → use the **Batch API** (~**50% savings**).

### Expected patterns / ✅ Correct

- On validation failure, append **specific, concrete** error details (which field, expected vs actual) and retry.
- Use **separate sessions** for generation vs review to avoid reasoning-context bias.
- Use a two-pass review: local per-file pass, then cross-file integration pass.
- Route blocking tasks to synchronous calls; route latency-tolerant batch jobs to the Batch API for cost savings.
- Track `detected_pattern` to surface systematic (per-type) failures.

### Anti-patterns / ❌ Avoid

- **Same-session self-review** (the model retains its reasoning context, creating bias).
- **Generic retry** without appending specific error information ("there were errors, please try again").
- **Aggregate accuracy metrics masking per-document-type failures** (one document type can fail silently behind a good overall number).

### Code example — `validation-retry.py` (Specific Error Feedback Loop)

```python
def extract_with_validation(document, max_retries=3):
    messages = [{"role": "user", "content": f"Extract: {document}"}]

    for attempt in range(max_retries):
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            tools=[extract_tool],
            tool_choice={"type": "tool", "name": "extract_invoice"},
            messages=messages,
        )

        data = parse_tool_response(response)
        errors = validate(data)

        if not errors:
            return data  # Valid — return results

        # CRITICAL: Append SPECIFIC errors for retry (not generic)
        messages.append({"role": "assistant", "content": response.content})
        messages.append({
            "role": "user",
            "content": f"Validation failed: {errors}. Re-extract correctly.",
        })

    raise ValueError("Max retries exceeded")
```

---

## Recap — Exam Tips for Domain 4

| # | Rule |
|---|------|
| 1 | **Explicit, measurable criteria > vague instructions** (always). Vague → false positives → alert fatigue → eroded developer trust. |
| 2 | **2-4 few-shot examples** is the sweet spot for ambiguous tasks. More than 6 bloats; fewer than 2 sets no pattern. |
| 3 | **`tool_use` = structural compliance, NOT semantic correctness.** Always validate content after extraction. |
| 4 | **Same-session self-review is an anti-pattern — use separate sessions** for generation and review. |

### Cross-cutting anti-patterns checklist

- ❌ "Make it better" / "improve the code" / "be thorough" (vague).
- ❌ Ignoring false-positive downstream impact (alert fatigue).
- ❌ >6 few-shot examples; inconsistent example formatting.
- ❌ Assuming `tool_use` makes content correct; enums without an `other` category.
- ❌ Generic retry feedback; same-session self-review; aggregate metrics hiding per-type failures.
