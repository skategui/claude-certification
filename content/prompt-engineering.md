# Prompt engineering

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623585_05_-_001_-_Prompt_Engineering_01.1748623585186.png](Prompt%20engineering/instructor_a46l9irobhg0f5webscixp0bs_public_1748623585_05_-_001_-_Prompt_Engineering_01.1748623585186.png)

## Here are the key takeaways from the **Prompt Engineering** lesson:

**Core Concept**
Prompt engineering is an *iterative* process of refining prompts to get more reliable, higher-quality outputs — not a one-shot effort.

**The Iterative Loop**
The improvement cycle is: Set a goal → Write an initial prompt → Evaluate → Apply engineering techniques → Re-evaluate → Repeat. Each pass should yield measurable improvement.

**Start Simple, Then Improve**
Begin with a naive, basic prompt to establish a baseline. A low initial score (e.g., 2.3/10) is completely normal and expected — it's just your starting point.

**Build an Evaluation Pipeline**
Use a structured evaluation system (like a `PromptEvaluator` class) that:

- Auto-generates test cases based on your prompt's input requirements
- Grades outputs against specific criteria
- Produces a detailed report explaining *why* each test case scored the way it did

**Practical Tips**

- Keep test cases small (2–3) during development to speed up iteration, then scale up for final validation.
- Start with low API concurrency (e.g., 3) to avoid rate limit errors.
- Define clear evaluation criteria upfront so scoring is meaningful.

**Key Mindset**
Make one change at a time, measure its impact, and build on what works. This systematic approach helps you understand *which* techniques actually move the needle for your specific use case.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623557_05_-_002_-_Being_Clear_and_Direct_02.1748623557175.png](Prompt%20engineering/instructor_a46l9irobhg0f5webscixp0bs_public_1748623557_05_-_002_-_Being_Clear_and_Direct_02.1748623557175.png)

## Here are the key takeaways from the **Being Clear and Direct** lesson:

**The First Line is Everything**
The opening line of your prompt is the most important part — it sets the stage for everything that follows. Get it right and your results improve dramatically.

**Two Core Principles: Clarity & Directness**

*Clarity* means using simple, unambiguous language that states exactly what you want without hedging or over-explaining.

*Directness* means structuring your request as an instruction, not a question. Lead with an action verb like "Write," "Create," "Generate," or "Identify."

**Practical Examples**

- Instead of: *"I need to know about those solar panel things on roofs..."*
→ Use: *"Write three paragraphs about how solar panels work."*
- Instead of: *"What countries use geothermal energy?"*
→ Use: *"Identify three countries that use geothermal energy. Include generation stats for each."*

**It Measurably Improves Results**
In the lesson's example, simply restructuring the opening line of a prompt (from *"What should this person eat?"* to *"Generate a one-day meal plan for an athlete that meets their dietary restrictions"*) boosted the evaluation score from 2.32 to 3.92.

**The Right Mental Model**
Treat Claude like a capable assistant who needs clear direction — not someone who should have to guess what you want. Be specific, lead with a verb, and you'll see better outputs right away.

## Here are the key takeaways from the **Being Specific** lesson:

**Why Specificity Matters**
Without specific guidelines, Claude has to guess — and it can go in countless directions. Adding specificity dramatically improves both the consistency and quality of outputs. In the lesson's example, adding guidelines to a meal planning prompt more than doubled the score (from 3.92 to 7.86).

**Two Types of Guidelines**

*Output Quality Guidelines* — Tell Claude what the output should look like. Use these to control length, structure, format, tone, and specific elements to include. Example: "Include daily calorie totals, macronutrient breakdown, meal timing, and all portion sizes in grams."

*Process Steps* — Tell Claude how to think through a problem. Break the task into sequential steps so Claude considers multiple angles before arriving at an answer. Example: "First brainstorm three options, then pick the best one, then outline the key scene."

**When to Use Each**

Use output guidelines in *almost every prompt* — they're your baseline safety net for consistent results. Add process steps when dealing with complex or multi-faceted problems: troubleshooting, decision-making, critical analysis, or any task where you want Claude to consider multiple perspectives before responding.

**Combine Both for Best Results**
In professional prompting, the two approaches are often used together — guidelines ensure the right format and content, while process steps ensure thorough reasoning. This gives you consistency *and* confidence in the quality of the output.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623572_05_-_003_-_Being_Specific_18.1748623572246.png](Prompt%20engineering/instructor_a46l9irobhg0f5webscixp0bs_public_1748623572_05_-_003_-_Being_Specific_18.1748623572246.png)

## Here are the key takeaways from the **Structure with XML Tags** lesson:

**The Core Problem XML Tags Solve**
When prompts include large amounts of content or mix different types of data, Claude can struggle to distinguish between your instructions and the actual data. XML tags create clear boundaries that eliminate this ambiguity.

**How It Works**
Wrap distinct content sections in descriptive XML tags (e.g., `<sales_records>...</sales_records>`, `<my_code>...</my_code>`, `<docs>...</docs>`). This tells Claude exactly what each block of content represents and how it relates to the rest of the prompt.

**Use Descriptive Tag Names**
You don't need to follow any official XML standard — just make the names meaningful. `<athlete_information>` is far more useful than `<data>`, and `<my_code>` paired with `<docs>` is much clearer than dumping everything together without labels.

**When to Use XML Tags**
They're most valuable when: including large amounts of context or data, mixing different content types (code, documentation, data), working with complex prompts that interpolate multiple variables, or any time you want to make content boundaries crystal clear.

**Scale Matters**
You may not see dramatic improvements on simple prompts, but XML tags become increasingly important as prompt complexity grows. They're a best practice for production-level prompting where clarity and reliability are critical.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623569_05_-_004_-_Structure_with_XML_Tags_06.1748623569098.png](Prompt%20engineering/instructor_a46l9irobhg0f5webscixp0bs_public_1748623569_05_-_004_-_Structure_with_XML_Tags_06.1748623569098.png)

## Here are the key takeaways from the **Providing Examples** lesson:

**What It Is**
Providing examples — known as "one-shot" (single example) or "multi-shot" (multiple examples) prompting — means giving Claude sample input/output pairs to guide its responses. It's one of the most effective prompt engineering techniques available.

**Show, Don't Just Tell**
Instead of trying to describe what you want in words, you demonstrate it directly. This is especially powerful for subtle requirements that are hard to articulate — like handling sarcasm, tone, or edge cases.

**When to Use Examples**
Examples are most useful for: capturing corner cases and edge scenarios, defining complex or exact output formats (e.g., specific JSON structures), establishing a desired style or tone, and showing how to handle ambiguous inputs.

**One-Shot vs. Multi-Shot**
Use one-shot when you just need to establish a basic pattern. Use multi-shot when you need to cover different edge cases or show multiple types of valid responses.

**Mine Your Evaluations for Examples**
Look at your highest-scoring evaluation outputs and use those input/output pairs as examples in your prompt. This gives Claude a concrete picture of what "perfect" looks like for your specific task.

**Add Context, Not Just the Example**
Don't just drop in an input/output pair — explain *why* the output is good. This helps Claude understand the reasoning behind ideal responses, not just the format.

**Best Practices**
Always wrap examples in XML tags (e.g., `<sample_input>`, `<ideal_output>`) for clarity, be explicit that you're showing an example, target your most common failure cases, and keep examples relevant to your specific task.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748623645_05_-_005_-_Providing_Examples_00.1748623645304.png](Prompt%20engineering/instructor_a46l9irobhg0f5webscixp0bs_public_1748623645_05_-_005_-_Providing_Examples_00.1748623645304.png)