export type ToolId =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolInput {
  toolId: ToolId;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
}

export interface ToolRecommendation {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan: string | null;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  isOptimal: boolean;
}

export interface AuditResult {
  id: string;
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
  createdAt: string;
}

export interface LeadData {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
}

export interface PricingPlan {
  name: string;
  pricePerUserPerMonth: number;
  minSeats?: number;
  maxSeats?: number;
  isEnterprise?: boolean;
}

export interface ToolPricing {
  toolId: ToolId;
  toolName: string;
  plans: PricingPlan[];
  apiPricing?: string;
}
