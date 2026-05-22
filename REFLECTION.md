# REFLECTION — SpendLens

## 1. The Hardest Bug — and How I Debugged It

The hardest bug was the audit results page rendering before the audit record existed in the database. When a user submitted the form, the API returned a `{ id }` response and the client immediately redirected to `/results/:id`. The server component at that route fetched `GET /api/results/:id` — but because the database write and the redirect happened within milliseconds of each other, the record sometimes wasn't committed yet, and the results page returned a 404.

My first hypothesis was a race condition in the Supabase insert — maybe it was batching writes. I added a `console.log` before and after the insert in the audit API route and confirmed the insert was completing successfully before the response was sent. So the insert timing wasn't the issue.

Second hypothesis: the results page server component was fetching from `localhost:3000` using `fetch()` with `cache: "no-store"`, but during local development, the API routes sometimes cold-start and add ~200ms. The redirect was faster than the cold start.

I tested this by adding a `setTimeout(500)` before the redirect on the client — the results page loaded correctly every time. Confirmed it was a cold-start race condition.

Fix: added a 300ms retry with exponential backoff in the `fetchAudit` function. If the first fetch returns 404, it waits 300ms and retries once. In production on Vercel, serverless functions are warm for the audit route since the same request just hit it, so the retry never fires. Locally, the retry resolves the race.

---

## 2. A Decision I Reversed Mid-Week

I originally planned to use `@vercel/og` for Open Graph image generation. It's the "official" solution for Next.js, well-documented, and produces pixel-perfect results. I installed it, wrote the OG route, and it worked perfectly locally.

I reversed this when I tested the deployed URL. The `@vercel/og` package requires the Edge runtime and uses custom font loading via `fetch()` at runtime. On Vercel's free tier, the edge function had a cold start of ~1.5 seconds the first time the OG image was requested — which meant Twitter's preview crawler sometimes timed out and showed no image.

I switched to returning an SVG directly from the `/api/og` route. SVGs are natively supported by all major link-preview crawlers (Twitter, LinkedIn, Slack), require zero font loading, have no cold start, and are smaller than PNG. The trade-off is that the typography is slightly less polished — browser-rendered SVG text isn't as precise as canvas-rendered text. But a fast, reliable OG image that always loads beats a beautiful one that sometimes doesn't.

---

## 3. What I Would Build in Week 2

**Priority 1: Benchmark mode.** The most common question users asked in interviews was "is my spend normal?" — not just "am I on the right plan?" A benchmark feature — "your AI spend per developer is $240/mo, companies your size (10–50 people) average $180/mo" — would make the tool dramatically more compelling. This requires collecting aggregate spend data from the audits that have already run, which is already in Supabase.

**Priority 2: PDF export.** The results page is the shareable artifact, but several users mentioned wanting to bring the audit to a finance review or board meeting. A PDF export of the full report — styled to match the app — would unlock the "send to your CFO" use case, which has a direct path to Credex consultation bookings.

**Priority 3: Webhook/Zapier integration for high-savings leads.** Right now, high-savings leads get flagged in the database and receive an email. But Credex's sales team needs to know about these leads immediately, in their CRM. A Zapier webhook fired on high-savings lead capture would automate this without requiring a custom CRM integration.

---

## 4. How I Used AI Tools

**Claude (claude.ai and API):** Used for the personalized summary generation feature (as specified in the assignment), for writing all 12 markdown documentation files (first drafts, then heavily edited), and for debugging the OG image race condition by describing the symptoms and getting hypotheses to test. Did not use AI for the audit engine logic — that required careful reasoning about pricing tiers and use-case fit that needed to be deliberately defensible, not generated.

**GitHub Copilot:** Used for TypeScript boilerplate — generating the API route handler structure, the Supabase client wrapper, and the zod schema patterns. Did not trust it for the audit engine logic or the pricing data (it hallucinated prices on two occasions I caught — a Cursor Business price of $45/user and a Claude Team price of $25/user, both wrong).

**One specific time AI was wrong:** I asked Claude to help me write the `getCrossToolAlternative` function. It generated a version that recommended switching from Cursor to GitHub Copilot for "data" use cases, reasoning that "GitHub Copilot integrates better with data science tools." This is factually questionable and would fail a finance review. Cursor Pro ($20) and Copilot Business ($19) are essentially the same price for one user, so the switch recommendation would save less than $1/mo. I caught this because I was running the test cases manually and the recommendation felt financially trivial. Rewrote the cross-tool logic by hand.

---

## 5. Self-Ratings

| Dimension | Rating | Reason |
|---|---|---|
| **Discipline** | 7/10 | Spread work across 5 days as planned; didn't cram everything into Day 5. Could have started the user interviews earlier — left them until Day 3. |
| **Code quality** | 8/10 | TypeScript types are clean and exhaustive, no `any` types, audit engine is readable and testable. Trade-off: the API routes could be more modular — the audit route does too many things (run audit, store result, return response). |
| **Design sense** | 7/10 | The results page achieves the "gets screenshotted and shared" goal — the savings number is big, clear, and visually dominant. The form is functional but not beautiful. I'd spend more time on the form polish with another day. |
| **Problem-solving** | 8/10 | The OG image race condition and the cold-start debugging showed good diagnostic thinking — formed hypotheses, tested them systematically, found the minimal fix. |
| **Entrepreneurial thinking** | 7/10 | I understand the business model (lead gen for Credex credits), built toward the viral loop (shareable URL), and wrote defensible economics. The GTM is specific. Where I could do better: the user interviews happened too late to meaningfully influence the design. |
