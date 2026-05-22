import { ToolPricing } from "./types";

export const PRICING_DATA: ToolPricing[] = [
  {
    toolId: "cursor",
    toolName: "Cursor",
    plans: [
      { name: "Hobby", pricePerUserPerMonth: 0, maxSeats: 1 },
      { name: "Pro", pricePerUserPerMonth: 20 },
      { name: "Business", pricePerUserPerMonth: 40 },
      { name: "Enterprise", pricePerUserPerMonth: 0, isEnterprise: true },
    ],
  },
  {
    toolId: "github_copilot",
    toolName: "GitHub Copilot",
    plans: [
      { name: "Individual", pricePerUserPerMonth: 10, maxSeats: 1 },
      { name: "Business", pricePerUserPerMonth: 19 },
      { name: "Enterprise", pricePerUserPerMonth: 39 },
    ],
  },
  {
    toolId: "claude",
    toolName: "Claude",
    plans: [
      { name: "Free", pricePerUserPerMonth: 0, maxSeats: 1 },
      { name: "Pro", pricePerUserPerMonth: 20, maxSeats: 1 },
      { name: "Max", pricePerUserPerMonth: 100, maxSeats: 1 },
      { name: "Team", pricePerUserPerMonth: 30, minSeats: 2 },
      { name: "Enterprise", pricePerUserPerMonth: 0, isEnterprise: true },
    ],
    apiPricing: "claude-3-5-sonnet: $3/MTok input, $15/MTok output",
  },
  {
    toolId: "chatgpt",
    toolName: "ChatGPT",
    plans: [
      { name: "Free", pricePerUserPerMonth: 0, maxSeats: 1 },
      { name: "Plus", pricePerUserPerMonth: 20, maxSeats: 1 },
      { name: "Team", pricePerUserPerMonth: 30, minSeats: 2 },
      { name: "Enterprise", pricePerUserPerMonth: 0, isEnterprise: true },
    ],
    apiPricing: "gpt-4o: $2.50/MTok input, $10/MTok output",
  },
  {
    toolId: "anthropic_api",
    toolName: "Anthropic API",
    plans: [
      { name: "Pay-as-you-go", pricePerUserPerMonth: 0 },
    ],
    apiPricing: "claude-3-5-sonnet: $3/MTok input, $15/MTok output",
  },
  {
    toolId: "openai_api",
    toolName: "OpenAI API",
    plans: [
      { name: "Pay-as-you-go", pricePerUserPerMonth: 0 },
    ],
    apiPricing: "gpt-4o: $2.50/MTok input, $10/MTok output",
  },
  {
    toolId: "gemini",
    toolName: "Gemini",
    plans: [
      { name: "Free", pricePerUserPerMonth: 0, maxSeats: 1 },
      { name: "Advanced", pricePerUserPerMonth: 20, maxSeats: 1 },
      { name: "Business", pricePerUserPerMonth: 24 },
      { name: "Enterprise", pricePerUserPerMonth: 0, isEnterprise: true },
    ],
    apiPricing: "gemini-1.5-pro: $3.50/MTok input, $10.50/MTok output",
  },
  {
    toolId: "windsurf",
    toolName: "Windsurf",
    plans: [
      { name: "Free", pricePerUserPerMonth: 0, maxSeats: 1 },
      { name: "Pro", pricePerUserPerMonth: 15, maxSeats: 1 },
      { name: "Teams", pricePerUserPerMonth: 35 },
      { name: "Enterprise", pricePerUserPerMonth: 0, isEnterprise: true },
    ],
  },
];

export function getPricingForTool(toolId: string): ToolPricing | undefined {
  return PRICING_DATA.find((t) => t.toolId === toolId);
}

export function getPlanPrice(toolId: string, planName: string): number {
  const tool = getPricingForTool(toolId);
  if (!tool) return 0;
  const plan = tool.plans.find(
    (p) => p.name.toLowerCase() === planName.toLowerCase()
  );
  return plan?.pricePerUserPerMonth ?? 0;
}
