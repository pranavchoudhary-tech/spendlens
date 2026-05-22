# PROMPTS — SpendLens

## AI Summary Prompt

Used in `app/api/summary/route.ts` to generate the personalized 80-100 word summary paragraph on the results page.

### Final Prompt (as deployed)

```
You are a financial analyst helping a startup understand their AI tool spend. Write a concise, specific 80-100 word summary paragraph for this audit result.

Team: ${teamSize} people, primary use case: ${useCase}
Total potential monthly savings: $${totalMonthlySavings}

Tool breakdown:
${toolSummary}

Write the summary in second person ("Your team..."). Be specific about the biggest opportunity. Do not use bullet points. Do not manufacture enthusiasm — if savings are low, say so honestly. End with one concrete next step.
```

### Why this prompt works

**Second person ("Your team...")** makes the summary feel personal and actionable rather than generic. Users who see "your team" are more likely to take the recommended action than users who read a third-person analysis.

**"Do not manufacture enthusiasm"** — without this instruction, Claude tends to pad responses with filler phrases like "excellent job optimizing!" even when savings are high. The instruction forces the model to be direct, which is appropriate for a finance-adjacent tool.

**"End with one concrete next step"** — this replaces the natural model tendency to end with vague encouragement ("consider reviewing your stack regularly"). One specific next step has higher conversion to action.

**"Be specific about the biggest opportunity"** — without this, Claude sometimes gives equal weight to all recommendations in a bullet-point style. The instruction forces it to identify the single most important saving and lead with it.

### What I tried that didn't work

**Version 1 (too verbose):**
```
Generate a personalized audit summary for this AI spend analysis. Include all recommendations and be comprehensive.
```
Result: 300-word bullet-point lists that overwhelmed users. Scrapped after the first test run.

**Version 2 (too generic):**
```
Summarize this AI spend audit in 2-3 sentences.
```
Result: Summaries were accurate but read like auto-generated reports — "The analysis shows potential savings of $X across N tools." No personality, no reason to read.

**Version 3 (without the honesty instruction):**
Removing "Do not manufacture enthusiasm" caused Claude to add positive framing even for cases where savings were minimal: "While your stack is already well-optimized, you're doing great work controlling costs!" This felt patronizing and undermined trust.

### Model choice

Using `claude-3-5-haiku-20241022` rather than Sonnet or Opus. Haiku is fast enough (< 500ms average) and cheap enough ($0.0008 per summary at average token count) that it doesn't add meaningful latency or cost at early traction volumes. The summary task doesn't require complex reasoning — Haiku's quality is sufficient.

### Fallback behavior

If the Anthropic API returns an error (network failure, rate limit, invalid key), the `POST /api/summary` endpoint falls back to a templated summary generated in `buildTemplatedSummary()`. The user sees a valid summary in all cases. The fallback is documented in `ARCHITECTURE.md`.
