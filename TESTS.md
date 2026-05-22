# TESTS — SpendLens

## Test File: `tests/audit-engine.test.ts`

**Framework:** Vitest  
**How to run:** `npm run test`

All tests cover `lib/audit-engine.ts` — the rules-based audit logic. The audit engine is the most business-critical component: incorrect savings calculations would destroy user trust.

---

## Test Cases

### 1. `flags Cursor Business as overkill for a solo developer and recommends Pro`

**File:** `tests/audit-engine.test.ts`  
**Covers:** `auditTool()` — overkill plan detection for Cursor  
**Input:** Cursor Business plan, $40/mo, 1 seat  
**Expected:** `isOptimal: false`, `monthlySavings: 20`, `recommendedPlan: "Pro"`, `annualSavings: 240`  
**Why it matters:** Cursor Business ($40/user) for a solo developer when Pro ($20/user) provides the same features is the most common overspend pattern we identified in user research.

---

### 2. `marks Cursor Pro for a solo developer as optimal for coding use case`

**File:** `tests/audit-engine.test.ts`  
**Covers:** `auditTool()` — optimal path, no false positives  
**Input:** Cursor Pro plan, $20/mo, 1 seat, coding use case  
**Expected:** `isOptimal: true`, `monthlySavings: 0`  
**Why it matters:** False positives (recommending changes when none are needed) would erode trust. This test verifies the engine doesn't over-optimize.

---

### 3. `flags Claude Team plan for a single user and recommends downgrade to Pro`

**File:** `tests/audit-engine.test.ts`  
**Covers:** `auditTool()` — Claude Team overkill for solo user  
**Input:** Claude Team plan, $30/mo, 1 seat, writing use case  
**Expected:** `isOptimal: false`, `monthlySavings > 0`  
**Why it matters:** Claude Team requires a minimum of 2 seats but is often purchased solo. The engine must detect this.

---

### 4. `flags GitHub Copilot Business for a solo user and recommends Individual`

**File:** `tests/audit-engine.test.ts`  
**Covers:** `auditTool()` — Copilot plan overkill  
**Input:** GitHub Copilot Business, $19/mo, 1 seat  
**Expected:** `isOptimal: false`, `monthlySavings: 9`, `recommendedPlan: "Individual"`  
**Why it matters:** GitHub Copilot Individual ($10) vs Business ($19) for solo developers is a clear $9/mo saving with identical capability.

---

### 5. `recommends switching from ChatGPT to Cursor for a coding-focused team`

**File:** `tests/audit-engine.test.ts`  
**Covers:** `getCrossToolAlternative()` — use-case-based cross-tool recommendation  
**Input:** ChatGPT Team plan, $60/mo, 2 seats, coding use case  
**Expected:** `isOptimal: false`, `monthlySavings > 0`, `recommendedAction` contains "Cursor"  
**Why it matters:** A coding team on ChatGPT Team ($30/user) is likely better served by Cursor Pro ($20/user). This tests the use-case matching logic.

---

### 6. `returns zero savings for an already-optimal multi-tool setup`

**File:** `tests/audit-engine.test.ts`  
**Covers:** `runAudit()` — aggregation and no false positives across multiple tools  
**Input:** Cursor Pro ($20, 1 seat) + GitHub Copilot Individual ($10, 1 seat), coding  
**Expected:** `totalMonthlySavings: 0`, all recommendations `isOptimal: true`  
**Why it matters:** Tests that the engine correctly identifies an already-efficient stack and doesn't manufacture savings.

---

### 7. `correctly aggregates savings across multiple suboptimal tools`

**File:** `tests/audit-engine.test.ts`  
**Covers:** `runAudit()` — multi-tool savings aggregation  
**Input:** Cursor Business ($40, 1 seat) + Copilot Business ($19, 1 seat) + Claude Team ($30, 1 seat)  
**Expected:** `totalMonthlySavings > 0`, `totalAnnualSavings === totalMonthlySavings * 12`  
**Why it matters:** Tests that savings compound correctly across multiple tools and annual savings is computed accurately.

---

### 8. `skips tools with zero monthly spend from calculations`

**File:** `tests/audit-engine.test.ts`  
**Covers:** `runAudit()` — zero-spend filtering  
**Input:** Cursor Pro ($0, 1 seat) + Claude Pro ($20, 1 seat)  
**Expected:** `recommendations.length === 1`, recommendation is for Claude  
**Why it matters:** Users may add a tool to the form but enter $0 spend (tool they trialed but don't pay for). These must not appear in the audit output.

---

## Running the Tests

```bash
npm run test
```

Expected output:
```
✓ tests/audit-engine.test.ts (8)
  ✓ auditTool > flags Cursor Business as overkill for a solo developer and recommends Pro
  ✓ auditTool > marks Cursor Pro for a solo developer as optimal for coding use case
  ✓ auditTool > flags Claude Team plan for a single user and recommends downgrade to Pro
  ✓ auditTool > flags GitHub Copilot Business for a solo user and recommends Individual
  ✓ auditTool > recommends switching from ChatGPT to Cursor for a coding-focused team
  ✓ auditTool > returns zero savings for an already-optimal multi-tool setup
  ✓ auditTool > correctly aggregates savings across multiple suboptimal tools
  ✓ auditTool > skips tools with zero monthly spend from calculations

Test Files  1 passed (1)
Tests  8 passed (8)
```
