import { AuditFormData, ToolInput, ToolRecommendation, UseCase } from "./types";
import { getPricingForTool } from "./pricing-data";

const TOOL_NAMES: Record<string, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API",
  openai_api: "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

const USE_CASE_ALTERNATIVES: Record<UseCase, string[]> = {
  coding: ["cursor", "github_copilot", "claude", "windsurf"],
  writing: ["claude", "chatgpt", "gemini"],
  data: ["chatgpt", "claude", "openai_api", "anthropic_api"],
  research: ["claude", "chatgpt", "gemini", "anthropic_api"],
  mixed: ["claude", "chatgpt", "cursor"],
};

function getBestPlanForTeamSize(toolId: string, seats: number, useCase: UseCase): string | null {
  const tool = getPricingForTool(toolId);
  if (!tool) return null;

  const affordablePlans = tool.plans.filter((p) => !p.isEnterprise);

  if (toolId === "cursor") {
    if (seats === 1) return "Pro";
    return "Business";
  }

  if (toolId === "github_copilot") {
    if (seats === 1) return "Individual";
    if (seats <= 20) return "Business";
    return "Enterprise";
  }

  if (toolId === "claude") {
    if (seats === 1 && useCase === "writing") return "Pro";
    if (seats === 1 && useCase === "research") return "Max";
    if (seats === 1) return "Pro";
    return "Team";
  }

  if (toolId === "chatgpt") {
    if (seats === 1) return "Plus";
    return "Team";
  }

  if (toolId === "gemini") {
    if (seats === 1) return "Advanced";
    return "Business";
  }

  if (toolId === "windsurf") {
    if (seats === 1) return "Pro";
    return "Teams";
  }

  return affordablePlans[0]?.name ?? null;
}

function computeExpectedMonthlyCost(toolId: string, plan: string, seats: number): number {
  const tool = getPricingForTool(toolId);
  if (!tool) return 0;
  const matchedPlan = tool.plans.find(
    (p) => p.name.toLowerCase() === plan.toLowerCase()
  );
  if (!matchedPlan) return 0;
  return matchedPlan.pricePerUserPerMonth * seats;
}

function isOverkillPlan(toolId: string, plan: string, seats: number): boolean {
  if (toolId === "cursor" && plan === "Business" && seats === 1) return true;
  if (toolId === "github_copilot" && plan === "Business" && seats === 1) return true;
  if (toolId === "github_copilot" && plan === "Enterprise" && seats <= 10) return true;
  if (toolId === "claude" && plan === "Team" && seats === 1) return true;
  if (toolId === "claude" && plan === "Max" && seats > 1) return true;
  if (toolId === "chatgpt" && plan === "Team" && seats === 1) return true;
  if (toolId === "windsurf" && plan === "Teams" && seats === 1) return true;
  if (toolId === "gemini" && plan === "Business" && seats === 1) return true;
  return false;
}

function getCrossToolAlternative(
  toolId: string,
  useCase: UseCase,
  currentSpend: number,
  seats: number
): { toolName: string; estimatedSavings: number; reason: string } | null {
  const preferredTools = USE_CASE_ALTERNATIVES[useCase];

  if (toolId === "cursor" && useCase === "writing") {
    const claudeCost = 20 * seats;
    const savings = currentSpend - claudeCost;
    if (savings > 0) {
      return {
        toolName: "Claude Pro",
        estimatedSavings: savings,
        reason: `Writing workflows don't need an IDE-native AI. Claude Pro at $20/user delivers stronger writing quality at ${Math.round((savings / currentSpend) * 100)}% lower cost.`,
      };
    }
  }

  if (toolId === "chatgpt" && useCase === "coding" && currentSpend > 30 * seats) {
    const cursorCost = 20 * seats;
    const savings = currentSpend - cursorCost;
    if (savings > 0) {
      return {
        toolName: "Cursor Pro",
        estimatedSavings: savings,
        reason: `Cursor is purpose-built for coding with inline edits, codebase context, and tab completion. At $20/user it outperforms ChatGPT for dev workflows at lower cost.`,
      };
    }
  }

  if (
    (toolId === "github_copilot" || toolId === "cursor") &&
    preferredTools.includes("windsurf") &&
    currentSpend > 15 * seats
  ) {
    const windsurfCost = 15 * seats;
    const savings = currentSpend - windsurfCost;
    if (savings > 5 * seats) {
      return {
        toolName: "Windsurf Pro",
        estimatedSavings: savings,
        reason: `Windsurf Pro at $15/user offers comparable AI coding assistance for most teams at ${Math.round((savings / currentSpend) * 100)}% lower cost.`,
      };
    }
  }

  if (toolId === "gemini" && useCase === "coding") {
    const cursorCost = 20 * seats;
    const savings = currentSpend - cursorCost;
    if (savings > 0) {
      return {
        toolName: "Cursor Pro",
        estimatedSavings: savings,
        reason: `Gemini is a general-purpose model. Cursor Pro at $20/user is purpose-built for coding with repo context, inline edits, and tab completion — better fit for your use case.`,
      };
    }
  }

  return null;
}

export function auditTool(tool: ToolInput, teamSize: number, useCase: UseCase): ToolRecommendation {
  const toolName = TOOL_NAMES[tool.toolId] ?? tool.toolId;
  const expectedCost = computeExpectedMonthlyCost(tool.toolId, tool.plan, tool.seats);
  const isPayingRetail = tool.monthlySpend > expectedCost * 1.05;
  const effectiveSpend = tool.monthlySpend;

  const overkill = isOverkillPlan(tool.toolId, tool.plan, tool.seats);
  const betterPlan = getBestPlanForTeamSize(tool.toolId, tool.seats, useCase);
  const betterPlanCost = betterPlan
    ? computeExpectedMonthlyCost(tool.toolId, betterPlan, tool.seats)
    : effectiveSpend;

  const planSavings = overkill && betterPlan ? effectiveSpend - betterPlanCost : 0;

  const crossTool = getCrossToolAlternative(tool.toolId, useCase, effectiveSpend, tool.seats);

  const maxSavings = Math.max(planSavings, crossTool?.estimatedSavings ?? 0);
  const isAlreadyOptimal = maxSavings <= 0 && !isPayingRetail && !overkill;

  if (isAlreadyOptimal) {
    return {
      toolId: tool.toolId,
      toolName,
      currentPlan: tool.plan,
      currentSpend: effectiveSpend,
      recommendedAction: "Keep current plan",
      recommendedPlan: null,
      monthlySavings: 0,
      annualSavings: 0,
      reason: `Your ${toolName} ${tool.plan} plan at $${effectiveSpend}/mo is well-matched to your team size of ${tool.seats} and ${useCase} use case.`,
      isOptimal: true,
    };
  }

  if (crossTool && crossTool.estimatedSavings >= planSavings) {
    return {
      toolId: tool.toolId,
      toolName,
      currentPlan: tool.plan,
      currentSpend: effectiveSpend,
      recommendedAction: `Switch to ${crossTool.toolName}`,
      recommendedPlan: crossTool.toolName,
      monthlySavings: crossTool.estimatedSavings,
      annualSavings: crossTool.estimatedSavings * 12,
      reason: crossTool.reason,
      isOptimal: false,
    };
  }

  if (overkill && betterPlan) {
    return {
      toolId: tool.toolId,
      toolName,
      currentPlan: tool.plan,
      currentSpend: effectiveSpend,
      recommendedAction: `Downgrade to ${toolName} ${betterPlan}`,
      recommendedPlan: betterPlan,
      monthlySavings: planSavings,
      annualSavings: planSavings * 12,
      reason: `${toolName} ${tool.plan} is over-provisioned for ${tool.seats} seat${tool.seats > 1 ? "s" : ""}. ${betterPlan} covers your ${useCase} use case at $${betterPlanCost}/mo — saving $${planSavings}/mo.`,
      isOptimal: false,
    };
  }

  if (isPayingRetail) {
    const retailSavings = Math.round((effectiveSpend - expectedCost) * 0.8);
    return {
      toolId: tool.toolId,
      toolName,
      currentPlan: tool.plan,
      currentSpend: effectiveSpend,
      recommendedAction: "Verify billing or explore credits",
      recommendedPlan: tool.plan,
      monthlySavings: retailSavings,
      annualSavings: retailSavings * 12,
      reason: `You're paying $${effectiveSpend}/mo but the listed ${tool.plan} rate for ${tool.seats} seat${tool.seats > 1 ? "s" : ""} is $${expectedCost}/mo. Reconcile your billing or explore Credex credits for further savings.`,
      isOptimal: false,
    };
  }

  return {
    toolId: tool.toolId,
    toolName,
    currentPlan: tool.plan,
    currentSpend: effectiveSpend,
    recommendedAction: "Keep current plan",
    recommendedPlan: null,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `${toolName} ${tool.plan} is a reasonable fit for your current setup.`,
    isOptimal: true,
  };
}

export function detectDuplicateTools(tools: ToolInput[]): string[] {
  const warnings: string[] = [];

  const codingTools = tools.filter((t) =>
    ["cursor", "github_copilot", "windsurf"].includes(t.toolId) && t.monthlySpend > 0
  );
  if (codingTools.length >= 2) {
    const names = codingTools.map((t) => TOOL_NAMES[t.toolId]).join(" + ");
    warnings.push(`You're paying for ${names} — these overlap heavily. Most teams pick one AI coding assistant.`);
  }

  const chatTools = tools.filter((t) =>
    ["claude", "chatgpt"].includes(t.toolId) && t.monthlySpend > 0
  );
  if (chatTools.length >= 2) {
    const names = chatTools.map((t) => TOOL_NAMES[t.toolId]).join(" + ");
    warnings.push(`You're paying for both ${names}. Their capabilities overlap ~80% — consider consolidating to one.`);
  }

  const apiAndUi = tools.filter((t) =>
    ["anthropic_api", "claude"].includes(t.toolId) && t.monthlySpend > 0
  );
  if (apiAndUi.length === 2) {
    warnings.push(`You're paying for both Claude (UI) and Anthropic API. If your team only needs chat, the UI plan is cheaper. If building products, the API alone is sufficient.`);
  }

  const openAiAndChat = tools.filter((t) =>
    ["openai_api", "chatgpt"].includes(t.toolId) && t.monthlySpend > 0
  );
  if (openAiAndChat.length === 2) {
    warnings.push(`You're paying for both ChatGPT and OpenAI API. If your team only needs chat, ChatGPT Plus is cheaper. If building products, the API alone is sufficient.`);
  }

  return warnings;
}

export function runAudit(data: AuditFormData): {
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  duplicateWarnings: string[];
} {
  const recommendations = data.tools
    .filter((t) => t.monthlySpend > 0)
    .map((tool) => auditTool(tool, data.teamSize, data.useCase));

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );

  const duplicateWarnings = detectDuplicateTools(data.tools);

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    duplicateWarnings,
  };
}
