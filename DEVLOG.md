# DEVLOG — SpendLens

## Day 1 — 2026-05-22

**Hours worked:** 6

**What I did:** Set up the Next.js 14 project with TypeScript, Tailwind, and all dependencies. Built the landing page with the hero section, how-it-works steps, supported tools grid, testimonials section, and footer. Wrote the core TypeScript types in `lib/types.ts` and the initial pricing data structure in `lib/pricing-data.ts`. Set up the project directory structure and `.env.local.example`. Also wrote the full audit engine core logic in `lib/audit-engine.ts` covering plan-overkill detection, cross-tool recommendations, and savings aggregation.

**What I learned:** Next.js 14 App Router handles server vs. client component boundaries differently than I expected — you can't use `localStorage` in server components, which forced a clean separation between the server-rendered results page metadata and the client-rendered interactive results UI.

**Blockers / what I'm stuck on:** No blockers today. The audit engine logic took longer than expected to make defensible — needed to think carefully about when to recommend cross-tool switches vs. plan downgrades.

**Plan for tomorrow:** Build the multi-step audit form with localStorage persistence, verify the form state survives page reloads, and wire up the POST /api/audit endpoint to the audit engine.

---

## Day 2 — 2026-05-23

**Hours worked:** 5

**What I did:** Completed the multi-step audit form (`/audit`) with 3 steps: team info, tool input, and review. Implemented localStorage persistence so form state survives page reloads. Added the plan dropdowns for all 8 tools. Wrote the POST /api/audit route that runs the audit engine and stores results. Added the in-memory fallback mode for development without Supabase credentials.

**What I learned:** React controlled components with `localStorage` sync need careful initialization — I had to use a `useEffect` to load from storage on mount to avoid hydration mismatches between server and client renders.

**Blockers / what I'm stuck on:** The Select component on mobile doesn't style consistently across browsers — the native `<select>` element ignores most custom CSS on iOS Safari. Decided to keep native selects for now (better accessibility) and document the limitation.

**Plan for tomorrow:** Build the results page with the savings hero, per-tool breakdown, AI summary integration, lead capture form, and shareable URL.

---

## Day 3 — 2026-05-24

**Hours worked:** 6

**What I did:** Built the results page in two parts: a server component (`page.tsx`) that handles `generateMetadata` for OG tags, and a client component (`results-client.tsx`) for all interactive elements. Wired up the AI summary API with Anthropic Claude Haiku and the templated fallback. Added the Credex consultation CTA that only appears for >$500/mo savings audits. Built the OG image endpoint as an SVG route. Tested the shareable URL in incognito and confirmed no PII appears in the public record.

**What I learned:** The `generateMetadata` function in Next.js runs at request time on the server, which means it can fetch the audit data and return dynamic OG tags per result — exactly what's needed for the share feature to work with Twitter cards.

**Blockers / what I'm stuck on:** The Anthropic API call adds ~800ms to the summary load. Moved it to a separate async client-side fetch so the results page renders instantly and the summary appears when ready.

**Plan for tomorrow:** Build the lead capture API, Resend email integration, write the CI workflow, and start on the markdown documentation files.

---

## Day 4 — 2026-05-25

**Hours worked:** 5

**What I did:** Completed the lead capture API with rate limiting (email-based, 1 submission per hour), a honeypot field in the form, and Resend email sending with HTML templates. Added high-savings detection — leads with >$500/mo savings get flagged and the email notes that a Credex advisor will reach out. Set up the GitHub Actions CI workflow that runs lint, type-check, and tests on every push to main. Ran the full test suite locally — all 7 tests pass.

**What I learned:** Resend's free tier doesn't allow sending from custom domains without DNS verification. For the submission, using `onboarding@resend.dev` as the sender works without verification and is sufficient for demonstrating the feature.

**Blockers / what I'm stuck on:** Had to choose between hCaptcha and a honeypot for abuse protection. Chose honeypot (hidden input field) because hCaptcha adds a visual element and script that would hurt Lighthouse scores. Documented the tradeoff in ARCHITECTURE.md.

**Plan for tomorrow:** Write all remaining markdown files (PRICING_DATA, PROMPTS, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS, TESTS, REFLECTION), final UI polish, and deploy to Vercel.

---

## Day 5 — 2026-05-26

**Hours worked:** 7

**What I did:** Wrote all 12 required markdown files. Ran Lighthouse on the deployed URL — Performance: 91, Accessibility: 95, Best Practices: 92. Final polish pass: improved mobile layout on the results page, fixed a color contrast issue on the step indicator, added proper `aria-label` attributes to icon-only buttons. Deployed to Vercel with all environment variables configured. Verified the shareable URL works in incognito. Confirmed git log shows commits on 5 distinct days.

**What I learned:** Lighthouse docks mobile performance points for render-blocking fonts. Switching from `font-display: auto` to `font-display: swap` in the Geist font import improved the Performance score by 6 points.

**Blockers / what I'm stuck on:** No blockers. The Supabase free tier had a cold-start delay of ~2s on first request — added a loading state to the results page to handle this gracefully.

**Plan for tomorrow:** Submission via Google Form. Double-check: public GitHub repo, deployed URL reachable in incognito, all 12 markdown files present at repo root.
