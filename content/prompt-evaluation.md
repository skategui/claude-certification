# Prompt evaluation

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623382_04_-_001_-_Prompt_Evaluation_10.1748623382207.png](Prompt%20evaluation/instructor_a46l9irobhg0f5webscixp0bs_public_1748623382_04_-_001_-_Prompt_Evaluation_10.1748623382207.png)

## Here are the key takeaways from the **Prompt Evaluation** lesson:

**Prompt Engineering vs. Prompt Evaluation are distinct but complementary.** Prompt engineering is about *crafting* better prompts (using techniques like multishot prompting, XML tags, etc.), while prompt evaluation is about *measuring* how well those prompts actually perform through automated testing.

**Most engineers fall into one of two traps after writing a prompt:**

- Testing it once and calling it good enough (risky in production)
- Testing a few times and patching a couple edge cases (still leaves you exposed to unexpected user inputs)

**The right approach is an evaluation pipeline (Option 3).** Rather than manual spot-checking, you run your prompt through systematic, automated testing that scores performance across many test cases. It costs more upfront but gives you much higher confidence.

**An eval-first mindset helps you:** identify weaknesses before they hit production, objectively compare different prompt versions, and iterate based on measurable improvements rather than gut feel.

**The core insight** is that real users will interact with your prompt in ways you never anticipated. The gap between "works in my testing" and "works in production" is where most AI application failures happen — and evaluation pipelines are what bridge that gap.

## Here are the key takeaways from "A typical eval workflow":

**The 5-Step Eval Workflow**

1. **Draft a prompt** — Start with a baseline prompt to test and improve from.
2. **Create an eval dataset** — Assemble representative sample inputs (questions/requests) your prompt will encounter in production. These can be hand-crafted or Claude-generated, and can range from a handful to thousands of records.
3. **Feed through Claude** — Merge each dataset item with your prompt template and send it to Claude to collect responses.
4. **Feed through a grader** — Score each response (typically 1–10) to get an objective, numerical measurement of prompt quality. Average the scores for an overall baseline.
5. **Change the prompt and repeat** — Modify the prompt, re-run the pipeline, and compare scores to see if the change is an actual improvement.

**Core Benefit: Objective Measurement**

The whole point of this workflow is to remove guesswork from prompt engineering. Rather than relying on gut feel, you get a numeric score you can compare across prompt versions, giving you confidence that changes are genuine improvements — not just different.

**Practical Notes**

- You can start small and scale up as needed.
- Many open-source and paid tools exist to help assemble these workflows, but understanding the core process lets you build from first principles.
- Claude itself can be used as the grader in Step 4.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623393_04_-_002_-_A_Typical_Eval_Workflow_17.1748623393804.png](Prompt%20evaluation/instructor_a46l9irobhg0f5webscixp0bs_public_1748623393_04_-_002_-_A_Typical_Eval_Workflow_17.1748623393804.png)

## Here are the key takeaways from the "Running the eval" lesson:

**The Eval Pipeline Has Three Core Functions**

- `run_prompt` — merges a test case with a prompt template and sends it to Claude
- `run_test_case` — calls `run_prompt` and grades the result (currently a placeholder score of 10)
- `run_eval` — loops over the entire dataset, calling `run_test_case` for each entry and collecting results

**Start Simple, Iterate Later**
The initial prompt is intentionally minimal — no formatting instructions, no constraints. This causes Claude to return verbose output, but that's expected at this stage. Refinement comes later.

**Grading is the Missing Piece**
The hardcoded score of `10` is a placeholder. Replacing it with real grading logic is the next major step, and it's where much of the real complexity lives.

**Performance Expectations**
Even with Claude Haiku, running a full dataset can take ~30 seconds on the first pass. Optimization techniques are covered later in the course.

**The Big Picture**
Despite its simplicity, this pipeline captures the essence of most AI eval systems: feed test cases to a model, collect structured outputs (with the original test case, model output, and score), and evaluate. The complexity comes from better prompts, smarter grading, and performance tuning — not from the pipeline structure itself.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623397_04_-_004_-_Running_the_Eval_01.1748623397839.png](Prompt%20evaluation/instructor_a46l9irobhg0f5webscixp0bs_public_1748623397_04_-_004_-_Running_the_Eval_01.1748623397839.png)

## Here are the key takeaways from the **Model Based Grading** lesson:

**Three Types of Graders**
There are three main ways to evaluate model outputs: code graders (programmatic checks), model graders (using another AI to evaluate), and human graders (manual review). Each has tradeoffs between flexibility, speed, and cost.

**Code Graders are best for objective checks** — things like output length, keyword presence, JSON/Python syntax validation, or readability scores. They're fast and deterministic.

**Model Graders are best for subjective quality** — assessing things like instruction following, completeness, helpfulness, and safety. They're flexible but can be inconsistent ("capricious").

**Human Graders are most flexible but slowest** — useful for nuanced evaluation of depth, relevance, and comprehensiveness, but time-consuming to scale.

**Define criteria before building graders** — before implementing anything, you need clear evaluation criteria. Some criteria (format, syntax) suit code graders; others (task following, quality) suit model graders.

**Ask for reasoning, not just a score** — when using a model grader, always ask for strengths, weaknesses, and reasoning alongside the numeric score. Without this, models tend to default to middling scores around 6.

**Use average scores to track prompt improvements** — by running your grader across a dataset and calculating a mean score, you get an objective metric to measure whether prompt changes are actually improving output quality.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623451_04_-_005_-_Model_Based_Grading_03.1748623451557.png](Prompt%20evaluation/instructor_a46l9irobhg0f5webscixp0bs_public_1748623451_04_-_005_-_Model_Based_Grading_03.1748623451557.png)

## Here are the key takeaways from the **Code Based Grading** lesson:

**What it is:** Code-based grading goes beyond checking if an AI response "makes sense" — it also verifies that generated code has valid syntax and follows the correct format.

**Two-part evaluation system:**

- A **code grader** checks format (only the requested code type, no explanations) and valid syntax (the code actually parses correctly).
- A **model grader** checks task following and accuracy. Together, they give a comprehensive evaluation.

**Syntax validation:** You create simple helper functions using Python's built-in tools (`json.loads`, `ast.parse`, `re.compile`) to test whether the output is valid JSON, Python, or Regex. These return 10 for valid and 0 for invalid.

**Dataset format field:** Each test case should include a `"format"` field (e.g., `"python"`, `"json"`, `"regex"`) so the grader knows which validator to apply.

**Clearer prompts = better results:** Be explicit in your prompt — instruct the model to respond *only* with code, with no comments or explanation. You can also use a pre-filled assistant message like ````code` to nudge Claude into returning raw code immediately.

**Combining scores:** Average the model grader score and the syntax score to get a final score. You can adjust the weighting based on what matters more for your use case.

**The bigger picture:** The score itself isn't the goal — it's a baseline you can use to *measure improvement* as you refine your prompts, turning prompt engineering into a quantitative exercise rather than a subjective one.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623445_04_-_006_-_Code_Based_Grading_02.1748623445106.png](Prompt%20evaluation/instructor_a46l9irobhg0f5webscixp0bs_public_1748623445_04_-_006_-_Code_Based_Grading_02.1748623445106.png)