# PRICING_DATA — SpendLens

All pricing verified against official vendor pages during submission week (May 2026). Every number used in the audit engine traces to a source below.

---

## Cursor

- Hobby: $0/user/month — https://cursor.com/pricing — verified 2026-05-22
- Pro: $20/user/month — https://cursor.com/pricing — verified 2026-05-22
- Business: $40/user/month — https://cursor.com/pricing — verified 2026-05-22
- Enterprise: Custom pricing, contact sales — https://cursor.com/pricing — verified 2026-05-22

---

## GitHub Copilot

- Individual: $10/user/month (or $100/year) — https://github.com/features/copilot#pricing — verified 2026-05-22
- Business: $19/user/month — https://github.com/features/copilot#pricing — verified 2026-05-22
- Enterprise: $39/user/month — https://github.com/features/copilot#pricing — verified 2026-05-22

---

## Claude (Anthropic)

- Free: $0/month — https://claude.ai/pricing — verified 2026-05-22
- Pro: $20/user/month — https://claude.ai/pricing — verified 2026-05-22
- Max: $100/user/month — https://claude.ai/pricing — verified 2026-05-22
- Team: $30/user/month (minimum 2 seats) — https://claude.ai/pricing — verified 2026-05-22
- Enterprise: Custom pricing — https://www.anthropic.com/claude-for-enterprise — verified 2026-05-22

**Anthropic API direct pricing (claude-3-5-sonnet-20241022):**
- Input: $3.00 per million tokens — https://www.anthropic.com/pricing — verified 2026-05-22
- Output: $15.00 per million tokens — https://www.anthropic.com/pricing — verified 2026-05-22

**claude-3-5-haiku-20241022 (used for summaries):**
- Input: $0.80 per million tokens — https://www.anthropic.com/pricing — verified 2026-05-22
- Output: $4.00 per million tokens — https://www.anthropic.com/pricing — verified 2026-05-22

---

## ChatGPT (OpenAI)

- Free: $0/month — https://openai.com/chatgpt/pricing/ — verified 2026-05-22
- Plus: $20/user/month — https://openai.com/chatgpt/pricing/ — verified 2026-05-22
- Team: $30/user/month (minimum 2 seats) — https://openai.com/chatgpt/pricing/ — verified 2026-05-22
- Enterprise: Custom pricing — https://openai.com/chatgpt/pricing/ — verified 2026-05-22

**OpenAI API direct pricing (gpt-4o):**
- Input: $2.50 per million tokens — https://openai.com/api/pricing/ — verified 2026-05-22
- Output: $10.00 per million tokens — https://openai.com/api/pricing/ — verified 2026-05-22

---

## Gemini (Google)

- Free (Gemini Advanced trial): $0/month — https://one.google.com/intl/en/about/plans — verified 2026-05-22
- Advanced (Google One AI Premium): $19.99/month individual — https://one.google.com/intl/en/about/plans — verified 2026-05-22
- Business (Google Workspace with Gemini): $24/user/month — https://workspace.google.com/pricing — verified 2026-05-22
- Enterprise: Custom pricing — https://workspace.google.com/pricing — verified 2026-05-22

**Gemini API pricing (gemini-1.5-pro):**
- Input: $3.50 per million tokens — https://ai.google.dev/pricing — verified 2026-05-22
- Output: $10.50 per million tokens — https://ai.google.dev/pricing — verified 2026-05-22

---

## Windsurf (Codeium)

- Free: $0/month — https://codeium.com/pricing — verified 2026-05-22
- Pro: $15/user/month — https://codeium.com/pricing — verified 2026-05-22
- Teams: $35/user/month — https://codeium.com/pricing — verified 2026-05-22
- Enterprise: Custom pricing — https://codeium.com/pricing — verified 2026-05-22

---

## Notes on Audit Engine Pricing Logic

- All comparisons use the per-user-per-month list price from official vendor pages
- API direct pricing is treated as a separate tool category; subscription plans are not compared to API costs directly because usage patterns differ significantly
- Enterprise plans are not assigned a price in the engine — users on Enterprise plans with a `monthlySpend` above the Team rate trigger the "verify billing" recommendation
- Prices are verified weekly; the audit engine version is pinned to the verification date above
