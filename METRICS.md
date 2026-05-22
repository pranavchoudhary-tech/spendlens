# METRICS — SpendLens

## North Star Metric

**Audits with email captured per week**

This is the right North Star for a B2B lead-gen tool at this stage. It captures two things simultaneously:
1. The user got enough value to complete the audit (not just landed and bounced)
2. They trusted the product enough to share their email

It's downstream of traffic and upstream of revenue — a direct input to the number of qualified leads Credex receives. "Audit completions" alone is too weak (someone could complete an audit and find zero savings, which isn't a win). "Revenue" is too far downstream for early product decisions. Email capture rate after a completed audit is the one number that tells you whether the product is working.

## 3 Input Metrics That Drive the North Star

**1. Audit completion rate (visitors → audit completed)**
Target: >15%. If this drops below 10%, the form is too long or the landing page isn't setting the right expectations. This is a form-friction problem, not a product problem.

**2. Email capture rate (audit completed → email captured)**
Target: >25%. If this drops below 20%, the results page isn't showing enough value before asking for the email, or the savings numbers are too low to motivate sharing. This is an audit-quality problem.

**3. High-savings audit rate (% of audits showing >$500/mo savings)**
Target: >30%. This metric tells you whether you're reaching the right users. If less than 30% of audits surface significant savings, either the pricing data is stale, the user base is already optimized, or you're reaching the wrong audience.

## What to Instrument First

1. **Audit funnel events:** `page_view` (landing), `form_started` (step 1 opened), `form_completed` (step 3 submitted), `audit_created` (API success), `results_viewed`, `email_captured`, `credex_cta_clicked`
2. **Savings distribution:** Track `total_monthly_savings` as a histogram — understand what savings buckets users fall into to tune the audit engine and the copywriting
3. **Share URL clicks:** How many users click the share link, how many copied URLs are subsequently visited by other users (second-order virality)
4. **Tool distribution:** Which tools appear most often in audits — informs which pricing data to verify most frequently and which tool comparisons to improve

Use Vercel Analytics (free, zero config) for page-level metrics and a small events table in Supabase for funnel events. No third-party analytics dependency needed at this stage.

## What Number Triggers a Pivot Decision

**If audit completion rate falls below 8% for 2 consecutive weeks**, the tool has a form-friction problem that can't be fixed by copywriting alone. Trigger: shorten the form to a single-step calculator (just tool, plan, seats) and validate whether simplicity improves completion.

**If email capture rate falls below 15%**, the results page isn't delivering enough perceived value. Trigger: run an A/B test between showing savings first vs. showing a comparison table first. If neither reaches 20%, reconsider the email gate entirely (shift to a shareable URL as the primary value capture mechanism).

**If the high-savings rate falls below 15%**, the audience is the wrong fit. Trigger: segment by team size — if solo developers dominate the audit mix, add team-size-based copy on the landing page to pre-qualify the traffic toward teams of 5+.
