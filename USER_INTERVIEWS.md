# USER_INTERVIEWS — SpendLens

## Methodology

**Goal:** Validate whether AI tool overspend is a real, felt problem — not just a theoretical one — and understand how people currently reason about their AI spend.

**Format:** Informal 1:1 conversations over WhatsApp/DM. No structured script — I let the conversation flow naturally and asked follow-ups based on their answers. Each conversation was ~10 minutes.

**When:** May 24, 2026 (Day 3 of build)

**Who I spoke to:** 3 people in my network — a startup intern, a freelancer, and a student with side projects. Deliberately chose different profiles to get variance in spend level and use case.

---

## Interview 1 — Startup Intern

**Profile:** Engineering intern at an early-stage startup. Codes daily. 1 person, coding use case.

**Tools & spend:** Cursor Pro ($20/mo) + ChatGPT Plus ($20/mo) = **$40/mo total**

**In their words:**
> "Cursor is an absolute cheat code for shipping fast. It knows your codebase, autocompletes entire functions, and the diff view makes reviewing AI output actually usable. But then I also pay for ChatGPT Plus and honestly... for coding it's way weaker. I mainly use it now for explaining concepts or drafting emails. Paying for both does feel a bit redundant and expensive."

**Key observation:** They've arrived at the same conclusion SpendLens's engine reaches — Cursor + ChatGPT for a solo coder is a duplicate overlap. They *know* it feels redundant but haven't acted on it. The friction isn't awareness, it's inertia.

**What SpendLens would tell them:** Cursor Pro is optimal for a solo coder. ChatGPT Plus can be dropped or replaced with Claude Free for non-coding tasks — saving $20/mo ($240/yr).

**What this validated:** The duplicate tool detection feature is real. People feel the overlap but don't quantify it or take action. Surfacing the exact dollar amount and a specific recommendation removes that friction.

---

## Interview 2 — Freelancer

**Profile:** Freelance developer. Takes client projects. Treats AI tools as business infrastructure.

**Tools & spend:** Claude Pro ($20/mo) + GitHub Copilot Pro+ ($39/mo) = **$59/mo total**

**In their words:**
> "It's an absolute steal for what I get. Claude handles complex refactoring and architecture discussions in a way nothing else does — I can paste 500 lines and ask it to restructure the whole thing. Copilot Pro+ in VS Code means I almost never type boilerplate. Together they literally double my client output. I bill more than I spend on these in a single hour."

**Key observation:** This is the counter-case — someone for whom the spend *is* justified. Claude and GitHub Copilot serve distinct roles (reasoning vs. inline completion) with minimal overlap. The ROI framing is completely different from the intern: they think in terms of billable hours unlocked, not monthly cost.

**What SpendLens would tell them:** Stack is well-matched. Claude Pro for architecture + Copilot Pro+ for inline completion is a low-overlap combination. No downgrade recommended.

**What this validated:** Not every multi-tool setup is wasteful. The audit engine needs to distinguish between genuine overlap (same job, two tools) and complementary tools (different jobs). This interview directly shaped the logic for when `isOptimal: true` is returned despite multiple tools being paid for.

---

## Interview 3 — Student / Side Project Builder

**Profile:** CS student. Building side projects to learn. Not currently paying for any AI tools.

**Tools & spend:** ChatGPT Free + Claude Free = **$0/mo**

**In their words:**
> "I'm not paying for anything yet. The free tiers are enough for what I'm doing right now. But honestly, AI saves me so much time when I'm learning something new — I'd probably pay for one of them once I'm doing serious projects or start freelancing."

**Key observation:** This is the future customer. They're not in pain right now because their usage is light. But there's a clear trigger — once they start billing clients or working on a team, they'll pay. And when they do, they're likely to subscribe to whatever their peers use without evaluating fit.

**What SpendLens would tell them:** Nothing to optimize yet. But when you start paying — run the audit before you subscribe to multiple tools by default. Most solo developers only need one.

**What this validated:** The "free tier to paid" transition is a high-risk moment for overspend. This is when people often subscribe to multiple tools simultaneously (FOMO, trial periods, peer recommendations) without a clear framework for which one to keep. SpendLens's positioning as a pre-commitment audit tool, not just a retrospective one, has value here.

---

## Synthesis

### What's consistently true across all three:

1. **Cursor stands out as the clearest value-for-money for coders.** Two of the three mentioned it or an IDE-native tool. No one mentioned Windsurf unprompted.

2. **People reason about spend in terms of output, not cost.** The freelancer didn't say "$59/mo is cheap" — they said "I bill more than that in an hour." The intern didn't say "$40/mo is a lot" — they said "it feels redundant." The framing is always relative to time saved or work output.

3. **Inertia is the real problem, not ignorance.** The intern *knows* the overlap exists. They haven't acted. A tool that quantifies the exact monthly waste and gives a one-line action ("drop ChatGPT Plus") removes the decision friction.

4. **Solo developers and freelancers are the right initial audience.** They make unilateral spending decisions, feel the cost personally, and have enough technical context to act on recommendations without needing to convince a finance team.

### What changed in the product based on these conversations:

- **Duplicate tool warnings are now a separate, prominent UI element** (amber banner above the per-tool breakdown) rather than buried in per-tool reasons. The intern's "it feels redundant" confirmed this needs to be loud.
- **The optimal case is handled with equal care.** The freelancer's setup is genuinely good — and the results page reflects that clearly rather than finding fake problems to flag.
- **The "run the audit before you subscribe" framing** was added to the landing page copy after the student interview. Most audits happen retrospectively. Positioning SpendLens as a pre-commitment tool opens a new use case.
