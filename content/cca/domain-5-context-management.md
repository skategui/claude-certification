# Domaine 5 — Context Management & Reliability

> Claude Certified Architect — Exam Domain 5 · ~15% of the exam
> Source: https://claudecertifications.com/claude-certified-architect/domains/context-management

## Overview

Manage context effectively in production systems. This domain covers **progressive summarization risks, context positioning, escalation patterns, error propagation, context degradation, human review, and information provenance**.

The core tension: the context window is limited, but critical information must be preserved. Domain 5 is about making the most of that limited window **without silently destroying the details that matter**.

The four sub-tasks:

- **d5.1 — Context Optimization & Positioning** — strategic positioning, trimming, and summarization while avoiding common pitfalls.
- **d5.2 — Escalation & Error Propagation** — escalation patterns and error propagation that give enough context for recovery or human intervention.
- **d5.3 — Context Degradation & Extended Sessions** — handle quality loss in long-running sessions with scratchpad files, `/compact`, and subagent delegation.
- **d5.4 — Human Review & Information Provenance** — human-in-the-loop review systems and provenance via claim-source mappings and temporal data.

### Exam Tips for Domain 5 (top-level summary)

1. Progressive summarization loses critical details — use **'case facts' blocks** instead.
2. **Sentiment ≠ complexity** for escalation decisions.
3. Always distinguish **access failures** from genuinely **empty results**.
4. Track **accuracy per document type**, not just aggregate.

---

## d5.1 — Context Optimization & Positioning

Optimize context window usage with strategic positioning, trimming, and summarization techniques while avoiding common pitfalls.

### Context management techniques (key concepts)

- **Progressive summarization risks** — important details can be lost through repeated summarization.
- **'Lost in the middle' effect** — information in the middle of long contexts is less likely to be recalled.
- **'Case facts' blocks** — structured reference sections that preserve critical information.
- **Trimming verbose tool outputs** — remove noise while retaining essential data.
- **Position-aware ordering** — put the most important information at the **beginning and end** of context.

### Deep dive

Context management is about making the most of the limited context window while preserving critical information. Two key concepts dominate this domain.

#### 1. Progressive Summarization Risks

Progressive summarization compresses conversation history to save space. While it seems efficient, it **silently destroys critical details**:

```
Original:      "Customer John Smith (ACC-12345) called about order #98765.
                Charged $150.00 instead of promotional $99.99."
After 1st summary: "Customer called about billing issue with promotion."
After 2nd summary: "Customer has a billing issue."
```

The customer name, account number, order number, exact amounts, and promotion code — **all lost**.

By turn 10: name, account, order, and amounts are gone.

#### 2. The "Lost in the Middle" Effect

Research shows that information in the **middle** of long contexts is less likely to be recalled by the model. Information at the **beginning and end** gets more attention.

#### The solution: "Case Facts" blocks

Instead of summarizing, preserve critical information in an **immutable structured block** placed at the **beginning** of context (high-recall position). This block is **never summarized or compressed** and contains all essential reference data.

```markdown
## CASE FACTS (Do not summarize — reference directly)

| Field          | Value                              |
| -------------- | ---------------------------------- |
| Customer       | John Smith                         |
| Account        | ACC-12345                          |
| Order          | #98765                             |
| Issue          | Overcharged $50.01 (promo SUMMER2026) |
| Customer Since | 2019 (7-year tenure)               |
```

A minimal, always-available form of the same block:

```markdown
## CASE FACTS (immutable)
- Customer: John Smith (ACC-12345)
- Order: #98765
- Issue: Overcharged $50.01 (promo SUMMER2026)
```

This block stays intact **regardless of conversation length**.

### Expected patterns / ✅ Correct

- Preserve critical reference data in an **immutable "case facts" block** at the top of context.
- Place the **most important information at the beginning and end** of context (high-recall positions); less critical info goes in the middle.
- **Trim verbose tool outputs** — remove noise while retaining essential data.
- Keep the case-facts block **out of any summarization pass** — it is referenced directly, never compressed.

### Anti-patterns / ❌ Avoid

- **Progressive summarization of critical details without preserving originals** — silently loses names, account numbers, amounts, codes.
- **Ignoring the "lost in the middle" effect** — burying critical data in the middle of a long context where the model under-recalls it.

> 🎯 **Exam Tip:** If the exam asks how to preserve critical customer details in a long conversation, the answer is **ALWAYS 'case facts' blocks**, never progressive summarization.

---

## d5.2 — Escalation & Error Propagation

Design escalation patterns and error propagation strategies that provide enough context for recovery or human intervention.

### Escalation and error handling (key concepts)

- **Escalation triggers**: customer demands, policy gaps — **not just sentiment**.
- **Structured error context vs generic errors**: always include **what was attempted**.
- **Access failures vs empty results**: distinguish between "could not check" and "checked and found nothing".
- **Local recovery before coordinator escalation**: try to fix locally first.
- **Partial results + what was attempted**: always report progress even on failure.

### Deep dive

Escalation and error propagation patterns determine how failures flow through a system. Getting this wrong means either **overwhelming humans with trivial issues** or **silently dropping critical failures**.

#### Valid escalation triggers

- Customer **explicitly requests** a human agent.
- **Policy gap** detected (situation not covered by existing rules).
- Task **exceeds agent capabilities** (needs access the agent doesn't have).
- **Business threshold** exceeded (e.g., refund > $500, handled by hooks).
- **Repeated failures** after reasonable recovery attempts.

#### Invalid escalation triggers (exam anti-patterns)

- **Negative sentiment** — An angry customer with a simple address change should **NOT** be escalated. **Sentiment does not equal task complexity.**
- **Self-reported confidence** — The model's own confidence assessment is **unreliable**.

#### Error propagation in multi-agent systems

When a subagent fails, it must report **structured context** to the coordinator:

- What was attempted.
- What error occurred (with **category** and **retryability**).
- Whether the failure is an **"access failure"** (couldn't check) or an **"empty result"** (checked, found nothing).
- The coordinator then decides: **retry, use alternative, or escalate**.

**Never silently drop subagent failures.** If a subagent can't access a database, the coordinator must know the data is **missing** — not assume the query returned nothing.

### Code example — `escalation-logic.py` (Structured Escalation)

```python
def should_escalate(context):
    """Determine if we need human intervention."""

    # VALID escalation triggers
    if context.customer_requested_human:
        return True, "Customer explicitly requested human agent"

    if context.policy_gap_detected:
        return True, "No policy covers this situation"

    if context.amount > AGENT_REFUND_LIMIT:
        return True, f"Amount {context.amount} exceeds limit"

    if context.retry_count >= MAX_RETRIES:
        return True, "Exhausted retry attempts"

    # INVALID triggers — DO NOT use these
    # if context.sentiment == "negative":   # WRONG!
    #     return True                        # Sentiment != complexity

    # if context.model_confidence < 0.7:     # WRONG!
    #     return True                        # Self-reported confidence unreliable

    return False, None
```

### Compare: Anti-Pattern vs Correct Approach

```python
# ✗ Anti-Pattern — Escalate based on sentiment (WRONG)
# An angry customer asking to change their address does NOT need a human agent
if customer_sentiment == "angry":
    escalate_to_human()

# ✗ Anti-Pattern — Escalate based on confidence (WRONG)
# Model self-reported confidence is unreliable
if model_confidence < 0.7:
    escalate_to_human()
```

```python
# ✓ Correct — Escalate based on objective criteria (RIGHT)
if customer.requested_human:
    escalate("Customer requested human")
if not policy_covers(situation):
    escalate("Policy gap detected")
if refund_amount > AGENT_LIMIT:
    escalate(f"Amount exceeds {AGENT_LIMIT} limit")
```

### Expected patterns / ✅ Correct

- Escalate on **objective criteria**: explicit customer request, policy gaps, capability limits, business thresholds, exhausted retries.
- Report **structured error context** — what was attempted, error category, retryability.
- Distinguish **access failure** ("could not check") from **empty result** ("checked, found nothing").
- **Try local recovery first**, then escalate to coordinator.
- Always report **partial results + what was attempted**, even on failure.

### Anti-patterns / ❌ Avoid

- **Sentiment-based escalation** — sentiment does not equal task complexity.
- **Confidence-based escalation** — model self-reported confidence is unreliable.
- **Generic error propagation** that loses the original error context.
- **Silently suppressing errors** instead of escalating with context.

> 🎯 **Exam Tip:** Sentiment-based and confidence-based escalation are **ALWAYS wrong** on the exam. Valid triggers are: explicit customer request, policy gaps, capability limits, and business thresholds.

---

## d5.3 — Context Degradation & Extended Sessions

Handle context degradation in long-running sessions. Use scratchpad files, `/compact`, and subagent delegation to maintain quality.

### Managing extended sessions (key concepts)

- **Context degradation**: quality decreases in extended sessions as context fills up.
- **Scratchpad files**: external files to persist important state across context resets.
- **`/compact`**: compress conversation history to reclaim context space.
- **Subagent delegation**: delegate verbose exploration to subagents to keep coordinator context clean.
- **Crash recovery manifests**: persistent state files that enable session recovery.

### Deep dive

Long-running agent sessions suffer from **context degradation** — the quality of responses decreases as the conversation grows longer and the context window fills up.

#### Symptoms of context degradation

- Agent forgets earlier instructions or constraints.
- Responses become less focused and more generic.
- Tool selection accuracy decreases.
- The agent may repeat work it already did.

#### Mitigation strategies (exam favorites)

1. **`/compact`** — Compress conversation history to reclaim context space. Use when the context is getting long **but the task isn't done yet**.
2. **Scratchpad files** — Persist critical intermediate state to external files. These **survive context compression and session boundaries**.
3. **Subagent delegation** — Delegate verbose exploration tasks to subagents. The subagent's context **absorbs the exploration noise**, and only the synthesized results come back to the coordinator.
4. **Position-aware context ordering** — Place the most important information at the **beginning and end** of context (high-recall positions). Less critical information goes in the middle.

Related concepts reinforced in this section:

- **Stratified metrics** (per-document-type tracking): aggregate accuracy can mask per-category failures (see d5.4).
- **Information provenance**: always preserve source and confidence so the coordinator can resolve conflicts (see d5.4).

### Code example — `context-management.py` (Degradation Mitigation)

```python
# Strategy 1: Scratchpad files for persistent state
agent.run("""
Before starting complex analysis:
1. Create a scratchpad file: progress.md
2. Record key findings as you discover them
3. Update progress.md after each major step
""")

# Strategy 2: Subagent delegation
agent.run("""
1. Delegate file-by-file analysis to a subagent
   (keeps verbose exploration out of coordinator context)
2. Subagent writes findings to scratchpad files
3. Coordinator reads summarized findings
4. Coordinator synthesizes final report
""")

# Strategy 3: Stratified metrics
def track_accuracy(results):
    """Track per-document-type, not just aggregate."""
    by_type = {}
    for r in results:
        doc_type = r["document_type"]
        if doc_type not in by_type:
            by_type[doc_type] = {"correct": 0, "total": 0}
        by_type[doc_type]["total"] += 1
        if r["is_correct"]:
            by_type[doc_type]["correct"] += 1

    # This reveals hidden failures per category
    for doc_type, stats in by_type.items():
        accuracy = stats["correct"] / stats["total"]
        # ... report per-type accuracy
```

### Expected patterns / ✅ Correct

- **Monitor for context degradation** in extended sessions (watch for forgotten constraints, generic responses, repeated work).
- Use **`/compact`** when context is long but the task is unfinished.
- Persist important intermediate state to **scratchpad files** that survive compression and session boundaries.
- **Delegate verbose exploration to subagents**; only synthesized results return to the coordinator.
- Maintain **crash recovery manifests** to enable session recovery.

### Anti-patterns / ❌ Avoid

- **Running extended sessions without monitoring context degradation.**
- **Not using scratchpad files** for important intermediate state.

---

## d5.4 — Human Review & Information Provenance

Design human-in-the-loop review systems and maintain information provenance through claim-source mappings and temporal data.

### Human review and provenance (key concepts)

- **Stratified sampling**: review samples across different categories, not just random selection.
- **Field-level confidence**: provide confidence indicators for individual data fields.
- **Accuracy by document type**: track performance per document category, not just aggregate.
- **Claim-source mappings**: link each output claim to its source for traceability.
- **Temporal data**: preserve timestamps and version information for currency.
- **Conflict annotation**: explicitly mark conflicting sources rather than silently choosing one.

### Deep dive

**Information provenance** means tracking where each piece of data came from and how reliable the source is. This is critical for multi-agent systems where different subagents contribute information from different sources.

#### Why provenance matters

- When two subagents provide **conflicting information**, the coordinator needs to know which source is more reliable.
- **Audit trails** require knowing which data came from which source.
- Downstream decisions depend on **data quality** — a number from a verified database is more reliable than one extracted from a PDF.

#### Provenance metadata to track

- **Source**: Where did this data come from? (API, database, document, web)
- **Confidence**: How reliable is this source? (verified, extracted, inferred, estimated)
- **Timestamp**: When was this data retrieved?
- **Agent**: Which subagent provided this data?

#### Human-in-the-loop checkpoints

For critical decisions, the system should **pause** and present the human with:

- The decision to be made.
- The data supporting each option (**with provenance**).
- The recommended action and why.
- A way to **approve, modify, or reject**.

This is especially important for:

- Financial decisions above certain thresholds.
- Legal or compliance-sensitive operations.
- Irreversible actions (deleting data, sending external communications).
- Cases where the agent detected ambiguity or conflicting information.

#### Stratified metrics — the aggregate hides the failure

Aggregate accuracy metrics can **mask per-category failures**. If invoices have 70% accuracy while receipts have 99%, the aggregate might still show 95%. Track accuracy **per document type** to reveal hidden failures.

```text
Aggregate (HIDES the problem):
  Overall accuracy: 95%

But actually:
  Invoices:  70/100  = 70%    (FAILING!)
  Receipts:  880/900 = 97.8%
The aggregate HIDES the invoice problem.
```

```text
✓ Correct — Per-document-type metrics (reveals failures):
  Invoice accuracy:  70.0%   # ALERT: Below threshold!
  Receipt accuracy:  97.8%   # OK
  Contract accuracy: 100.0%  # OK
Now we can see and fix the invoice problem.
```

### Code example — `provenance.py` (Information Source Tracking)

```python
from dataclasses import dataclass
from datetime import datetime
from typing import Literal

@dataclass
class DataWithProvenance:
    value: str | float | dict
    source: str                # "customer-db", "invoice-pdf", "web"
    confidence: Literal["verified", "extracted", "inferred", "estimated"]
    retrieved_at: datetime
    agent_id: str              # Which subagent provided this

def resolve_conflict(data_points: list[DataWithProvenance]):
    """When subagents disagree, use provenance to decide."""

    confidence_rank = {
        "verified":  4,   # From authoritative source
        "extracted": 3,   # Parsed from structured document
        "inferred":  2,   # Derived from context
        "estimated": 1,   # Best guess
    }

    # Pick the most reliable source
    best = max(data_points, key=lambda d: confidence_rank[d.confidence])

    # Log the conflict for audit trail
    log_conflict(
        chosen=best,
        alternatives=data_points,
        reason=f"Selected {best.source} (confidence: {best.confidence})"
    )

    return best
```

### Compare: Anti-Pattern vs Correct Approach

```python
# ✗ Anti-Pattern — No provenance tracking
# Two reviewers disagree... which one do we trust? We don't know!

# ✓ Correct — Trust the verified database over extracted PDF
final = resolve_conflict([rev_1, rev_2])
```

### Expected patterns / ✅ Correct

- Track **claim-source mappings** so each output claim is traceable to its source.
- Attach **provenance metadata** (source, confidence, timestamp, agent) to every data point.
- Resolve conflicts by **ranking confidence** (verified > extracted > inferred > estimated) and **logging** the decision for the audit trail.
- **Annotate conflicting sources** explicitly instead of silently choosing one.
- Use **stratified sampling** and **field-level confidence** in human review.
- Track **accuracy per document type** (stratified metrics) to surface hidden failures.
- Insert **human-in-the-loop checkpoints** for financial thresholds, legal/compliance, irreversible actions, and detected ambiguity.

### Anti-patterns / ❌ Avoid

- **Aggregate accuracy metrics that mask per-document-type failures.**
- **Not maintaining claim-source mappings** for traceability.
- **Silently resolving source conflicts** instead of annotating them.
- **Arbitrary selection without provenance** when subagents disagree.

> 🎯 **Exam Tip (stratified metrics):** Aggregate metrics masking per-category failures is a KEY exam concept. The correct answer always tracks accuracy **per document type** (stratified metrics), not just overall accuracy.

> 🎯 **Exam Tip (provenance):** When subagents provide conflicting data, the correct answer always involves **tracking information provenance** (source, confidence, timestamp) and using it to resolve conflicts. **Arbitrary selection without provenance is always wrong.**

---

## Related Exam Scenarios

- **Scenario 1 — Customer Support Resolution Agent**: Design an AI-powered customer support agent that handles inquiries, resolves issues, and escalates complex cases. Tests Agent SDK usage, MCP tools, and escalation logic.
- **Scenario 3 — Multi-Agent Research System**: Build a coordinator-subagent system for parallel research tasks. Tests multi-agent orchestration, context passing, error propagation, and result synthesis.
- **Scenario 6 — Structured Data Extraction**: Build a structured data extraction pipeline from unstructured documents. Tests JSON schemas, `tool_use`, validation-retry loops, and few-shot prompting.

---

## Quick Revision Checklist

| Situation | ❌ Wrong | ✅ Right |
| --- | --- | --- |
| Preserve customer details in a long chat | Progressive summarization | Immutable **case facts** block at top of context |
| Place critical info in a long context | Bury it in the middle | Beginning **and** end (high-recall) |
| Angry customer, simple request | Escalate (sentiment) | Handle it — sentiment ≠ complexity |
| Model says it's unsure | Escalate (confidence < 0.7) | Use objective triggers — self-reported confidence is unreliable |
| When to escalate | Sentiment / confidence | Customer request, policy gap, capability limit, business threshold, exhausted retries |
| Subagent DB lookup fails | Assume empty result | Report **access failure** ≠ empty result |
| Long session quality drops | Keep going unmonitored | `/compact`, scratchpad files, subagent delegation |
| Verbose exploration | Pollute coordinator context | Delegate to a subagent; return only synthesized findings |
| Measuring extraction quality | Aggregate accuracy | **Per-document-type** (stratified) metrics |
| Subagents disagree | Pick one arbitrarily | Resolve by **provenance** (verified > extracted > inferred > estimated) + log conflict |
