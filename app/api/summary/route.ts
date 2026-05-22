import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ToolRecommendation, UseCase } from "@/lib/types";

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const isMockMode = !anthropicApiKey || anthropicApiKey === "placeholder";

function buildTemplatedSummary(
  recommendations: ToolRecommendation[],
  totalMonthlySavings: number,
  useCase: UseCase,
  teamSize: number
): string {
  if (totalMonthlySavings === 0) {
    return `Your team of ${teamSize} is running a well-optimized AI stack for ${useCase} work. You've avoided the common traps — duplicate tools, overkill plans, and mismatched use cases. Keep an eye on pricing changes as vendors adjust their tiers.`;
  }

  const topSaving = recommendations
    .filter((r) => !r.isOptimal)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  const annualSavings = totalMonthlySavings * 12;

  return `Your team of ${teamSize} is currently leaving $${totalMonthlySavings}/mo ($${annualSavings.toLocaleString()}/yr) in savings on the table. The biggest opportunity is ${topSaving?.toolName ?? "your current stack"}: ${topSaving?.reason ?? "an optimization exists that fits your use case better"}. For a ${useCase}-focused team, aligning your tool selection to actual usage patterns — rather than defaulting to the highest plan — typically delivers the sharpest savings without any capability loss.`;
}

export async function POST(req: NextRequest) {
  try {
    const {
      recommendations,
      totalMonthlySavings,
      useCase,
      teamSize,
    }: {
      recommendations: ToolRecommendation[];
      totalMonthlySavings: number;
      useCase: UseCase;
      teamSize: number;
    } = await req.json();

    if (isMockMode) {
      const summary = buildTemplatedSummary(
        recommendations,
        totalMonthlySavings,
        useCase,
        teamSize
      );
      return NextResponse.json({ summary });
    }

    const client = new Anthropic({ apiKey: anthropicApiKey });

    const toolSummary = recommendations
      .map(
        (r) =>
          `- ${r.toolName} (${r.currentPlan}): $${r.currentSpend}/mo, ${r.isOptimal ? "optimal" : `save $${r.monthlySavings}/mo by: ${r.recommendedAction}`}`
      )
      .join("\n");

    const prompt = `You are a financial analyst helping a startup understand their AI tool spend. Write a concise, specific 80-100 word summary paragraph for this audit result.

Team: ${teamSize} people, primary use case: ${useCase}
Total potential monthly savings: $${totalMonthlySavings}

Tool breakdown:
${toolSummary}

Write the summary in second person ("Your team..."). Be specific about the biggest opportunity. Do not use bullet points. Do not manufacture enthusiasm — if savings are low, say so honestly. End with one concrete next step.`;

    const message = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const summaryContent = message.content[0];
    const summary =
      summaryContent.type === "text"
        ? summaryContent.text
        : buildTemplatedSummary(recommendations, totalMonthlySavings, useCase, teamSize);

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("Summary generation error:", err);
    const { recommendations, totalMonthlySavings, useCase, teamSize } =
      await req.json().catch(() => ({
        recommendations: [],
        totalMonthlySavings: 0,
        useCase: "mixed" as UseCase,
        teamSize: 1,
      }));

    return NextResponse.json({
      summary: buildTemplatedSummary(
        recommendations,
        totalMonthlySavings,
        useCase,
        teamSize
      ),
    });
  }
}
