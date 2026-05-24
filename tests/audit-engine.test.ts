import { describe, it, expect } from "vitest";
import { auditTool, runAudit, detectDuplicateTools } from "@/lib/audit-engine";
import { ToolInput } from "@/lib/types";

describe("auditTool", () => {
  it("flags Cursor Business as overkill for a solo developer and recommends Pro", () => {
    const tool: ToolInput = {
      toolId: "cursor",
      plan: "Business",
      monthlySpend: 40,
      seats: 1,
    };

    const result = auditTool(tool, 1, "coding");

    expect(result.isOptimal).toBe(false);
    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(result.annualSavings).toBe(result.monthlySavings * 12);
  });

  it("marks Cursor Pro for a solo developer as optimal for coding use case", () => {
    const tool: ToolInput = {
      toolId: "cursor",
      plan: "Pro",
      monthlySpend: 20,
      seats: 1,
    };

    const result = auditTool(tool, 1, "coding");

    expect(result.isOptimal).toBe(true);
    expect(result.monthlySavings).toBe(0);
  });

  it("flags Claude Team plan for a single user and recommends downgrade to Pro", () => {
    const tool: ToolInput = {
      toolId: "claude",
      plan: "Team",
      monthlySpend: 30,
      seats: 1,
    };

    const result = auditTool(tool, 1, "writing");

    expect(result.isOptimal).toBe(false);
    expect(result.monthlySavings).toBeGreaterThan(0);
  });

  it("flags GitHub Copilot Business for a solo user and recommends Individual", () => {
    const tool: ToolInput = {
      toolId: "github_copilot",
      plan: "Business",
      monthlySpend: 19,
      seats: 1,
    };

    const result = auditTool(tool, 1, "coding");

    expect(result.isOptimal).toBe(false);
    expect(result.monthlySavings).toBe(9);
    expect(result.recommendedPlan).toBe("Individual");
  });

  it("recommends switching from ChatGPT to Cursor for a coding-focused team", () => {
    const tool: ToolInput = {
      toolId: "chatgpt",
      plan: "Team",
      monthlySpend: 90,
      seats: 2,
    };

    const result = auditTool(tool, 5, "coding");

    expect(result.isOptimal).toBe(false);
    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(result.recommendedAction).toContain("Cursor");
  });

  it("returns zero savings for an already-optimal multi-tool setup", () => {
    const tools: ToolInput[] = [
      { toolId: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
      { toolId: "github_copilot", plan: "Individual", monthlySpend: 10, seats: 1 },
    ];

    const result = runAudit({ teamSize: 1, useCase: "coding", tools });

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations.every((r) => r.isOptimal)).toBe(true);
  });

  it("correctly aggregates savings across multiple suboptimal tools", () => {
    const tools: ToolInput[] = [
      { toolId: "cursor", plan: "Business", monthlySpend: 40, seats: 1 },
      { toolId: "github_copilot", plan: "Business", monthlySpend: 19, seats: 1 },
      { toolId: "claude", plan: "Team", monthlySpend: 30, seats: 1 },
    ];

    const result = runAudit({ teamSize: 1, useCase: "coding", tools });

    expect(result.totalMonthlySavings).toBeGreaterThan(0);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it("skips tools with zero monthly spend from calculations", () => {
    const tools: ToolInput[] = [
      { toolId: "cursor", plan: "Pro", monthlySpend: 0, seats: 1 },
      { toolId: "claude", plan: "Pro", monthlySpend: 20, seats: 1 },
    ];

    const result = runAudit({ teamSize: 1, useCase: "writing", tools });

    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].toolName).toBe("Claude");
  });

  it("detects duplicate coding tools and returns an overlap warning", () => {
    const tools: ToolInput[] = [
      { toolId: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
      { toolId: "github_copilot", plan: "Individual", monthlySpend: 10, seats: 1 },
      { toolId: "windsurf", plan: "Pro", monthlySpend: 15, seats: 1 },
    ];

    const warnings = detectDuplicateTools(tools);

    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain("overlap");
  });

  it("detects duplicate chat tools (Claude + ChatGPT) and warns about consolidation", () => {
    const tools: ToolInput[] = [
      { toolId: "claude", plan: "Pro", monthlySpend: 20, seats: 1 },
      { toolId: "chatgpt", plan: "Plus", monthlySpend: 20, seats: 1 },
    ];

    const warnings = detectDuplicateTools(tools);

    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain("Claude");
  });

  it("recommends Cursor over Gemini for a coding use case", () => {
    const tool: ToolInput = {
      toolId: "gemini",
      plan: "Advanced",
      monthlySpend: 24,
      seats: 1,
    };

    const result = auditTool(tool, 1, "coding");

    expect(result.isOptimal).toBe(false);
    expect(result.recommendedAction).toContain("Cursor");
  });
});
