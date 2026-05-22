# SpendLens

SpendLens is a free AI spend audit tool for startup founders and engineering managers — input your AI tool subscriptions, get an instant breakdown of where you're overspending, and see a specific action plan to save money. Built as a lead-generation asset for [Credex](https://credex.rocks), a marketplace for discounted AI infrastructure credits.

## Screenshots

> _Add 3+ screenshots or a Loom/YouTube recording link here before submission._

<!-- Example:
![Landing page](./docs/screenshots/landing.png)
![Audit form](./docs/screenshots/form.png)
![Results page](./docs/screenshots/results.png)
-->

## Live URL

> _Add your Vercel deployment URL here before submission._

## Quick Start

### Install & run locally

```bash
git clone https://github.com/pranavchoudhary-tech/spendlens
cd spendlens
npm install
cp .env.local.example .env.local
# Fill in your API keys in .env.local (see setup guide below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | [supabase.com](https://supabase.com) → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as above |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `RESEND_API_KEY` | [resend.com](https://resend.com) |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL (or `http://localhost:3000` for local) |

The app runs in mock mode (no real database, templated AI summaries) if any key is set to `placeholder`.

### Run tests

```bash
npm run test
```

### Deploy to Vercel

```bash
npx vercel --prod
```

Add all environment variables in the Vercel dashboard under Project → Settings → Environment Variables.

## Decisions

1. **Next.js App Router over Vite SPA** — Server components enable per-audit OG metadata generation at the route level without a separate metadata service. The `generateMetadata` function in `app/results/[id]/page.tsx` reads the audit server-side and returns OG tags specific to that result, which is essential for the viral-loop share feature.

2. **Rules-based audit engine, not AI** — The assignment explicitly tests knowing when not to use AI. Hardcoded rules (`lib/audit-engine.ts`) are deterministic, testable, and explainable to a finance person. AI is reserved for the summary paragraph where creativity and natural language matter, not arithmetic.

3. **In-memory fallback when Supabase is unconfigured** — Rather than crashing on missing credentials, the app stores audit results in a `Map` in the API route module. This means the tool is fully functional for demos and local development without any external service setup.

4. **Email gate after value, never before** — The lead capture form appears only on the results page, after the user has already seen their savings number. This follows the assignment spec and increases conversion — users have a concrete reason to share their email.

5. **SVG-based OG images over @vercel/og** — The OG endpoint returns an inline SVG, avoiding the `@vercel/og` dependency and its edge runtime constraints. SVG is universally supported by link-preview crawlers and keeps the bundle small.
