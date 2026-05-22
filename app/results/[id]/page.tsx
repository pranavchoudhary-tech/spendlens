import { Metadata } from "next";
import { notFound } from "next/navigation";
import ResultsClient from "./results-client";

interface AuditData {
  id: string;
  total_monthly_savings: number;
  total_annual_savings: number;
  recommendations: Array<{
    toolName: string;
    currentPlan: string;
    currentSpend: number;
    recommendedAction: string;
    monthlySavings: number;
    annualSavings: number;
    reason: string;
    isOptimal: boolean;
  }>;
  use_case: string;
  team_size: number;
  ai_summary: string;
  created_at: string;
}

async function fetchAudit(id: string): Promise<AuditData | null> {
  try {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://spendlens.vercel.app";
    const res = await fetch(`${appUrl}/api/results/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const audit = await fetchAudit(id);

  if (!audit) {
    return { title: "Audit not found — SpendLens" };
  }

  const savings = audit.total_monthly_savings;
  const title =
    savings > 0
      ? `AI Spend Audit: $${savings.toLocaleString()}/mo in savings found — SpendLens`
      : "AI Spend Audit: Optimized stack — SpendLens";

  const description =
    savings > 0
      ? `This AI spend audit identified $${savings.toLocaleString()}/mo ($${(savings * 12).toLocaleString()}/yr) in potential savings. See the full breakdown.`
      : "This AI spend audit shows a well-optimized AI tool stack. See the full breakdown.";

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://spendlens.vercel.app";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${appUrl}/results/${id}`,
      type: "website",
      images: [
        {
          url: `${appUrl}/api/og?savings=${savings}&id=${id}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${appUrl}/api/og?savings=${savings}&id=${id}`],
    },
  };
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const audit = await fetchAudit(id);

  if (!audit) {
    notFound();
  }

  return <ResultsClient audit={audit} auditId={id} />;
}
