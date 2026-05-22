"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  TrendingDown,
  Check,
  Copy,
  Share2,
  Mail,
  ExternalLink,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatAnnual } from "@/lib/utils";

interface Recommendation {
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  isOptimal: boolean;
}

interface AuditData {
  id: string;
  total_monthly_savings: number;
  total_annual_savings: number;
  recommendations: Recommendation[];
  use_case: string;
  team_size: number;
  ai_summary: string;
  created_at: string;
}

interface ResultsClientProps {
  audit: AuditData;
  auditId: string;
}

export default function ResultsClient({ audit, auditId }: ResultsClientProps) {
  const [aiSummary, setAiSummary] = useState<string>(audit.ai_summary);
  const [summaryLoading, setSummaryLoading] = useState(!audit.ai_summary);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const isHighSavings = audit.total_monthly_savings > 500;
  const isOptimal = audit.total_monthly_savings < 100;
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://spendlens.vercel.app/results/${auditId}`;

  useEffect(() => {
    if (audit.ai_summary) return;

    async function fetchSummary() {
      setSummaryLoading(true);
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recommendations: audit.recommendations,
            totalMonthlySavings: audit.total_monthly_savings,
            useCase: audit.use_case,
            teamSize: audit.team_size,
          }),
        });
        if (res.ok) {
          const { summary } = await res.json();
          setAiSummary(summary);
        }
      } catch {
        /* fallback stays blank */
      } finally {
        setSummaryLoading(false);
      }
    }

    fetchSummary();
  }, [audit]);

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLeadSubmitting(true);
    setLeadError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName,
          role,
          auditId,
          totalMonthlySavings: audit.total_monthly_savings,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Something went wrong");
      }

      setLeadSubmitted(true);
    } catch (err) {
      setLeadError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setLeadSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060c18]">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-white" />
          </div>
          <Link
            href="/"
            className="text-white font-bold text-base tracking-tight"
          >
            SpendLens
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="share-button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-teal-400" />
                <span className="text-teal-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Share
              </>
            )}
          </button>
          <Link href="/audit">
            <Button size="sm" variant="secondary">
              New Audit
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-sm text-slate-500 mb-4 uppercase tracking-widest">
            Audit complete
          </p>

          {isOptimal ? (
            <div>
              <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-teal-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                You&apos;re spending well
              </h1>
              <p className="text-slate-400">
                Less than $100/mo in optimization opportunities found.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-slate-400 mb-2">You could be saving</p>
              <h1 className="text-5xl md:text-7xl font-bold savings-number mb-2">
                <span className="gradient-text">
                  {formatCurrency(audit.total_monthly_savings)}
                </span>
                <span className="text-2xl text-slate-400 font-normal">/mo</span>
              </h1>
              <p className="text-slate-400 text-lg">
                <span className="text-white font-semibold">
                  {formatAnnual(audit.total_monthly_savings)}
                </span>{" "}
                per year
              </p>
            </div>
          )}
        </div>

        {aiSummary || summaryLoading ? (
          <div className="mb-8 p-5 rounded-2xl border border-white/8 bg-[#0d1424]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-teal-400/10 flex items-center justify-center">
                <TrendingDown className="w-3 h-3 text-teal-400" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-widest">
                AI Summary
              </span>
            </div>
            {summaryLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating personalized summary...
              </div>
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed">
                {aiSummary}
              </p>
            )}
          </div>
        ) : null}

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Per-tool breakdown
          </h2>
          <div className="space-y-3">
            {audit.recommendations.map((rec, i) => (
              <div
                key={i}
                className={`p-5 rounded-2xl border transition-all ${
                  rec.isOptimal
                    ? "border-white/8 bg-[#0d1424]"
                    : "border-teal-400/20 bg-teal-400/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm">
                        {rec.toolName}
                      </span>
                      <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                        {rec.currentPlan}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Current: {formatCurrency(rec.currentSpend)}/mo
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {rec.isOptimal ? (
                      <div className="flex items-center gap-1 text-teal-400">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-medium">Optimal</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-teal-400 font-bold text-sm">
                          -{formatCurrency(rec.monthlySavings)}/mo
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatCurrency(rec.annualSavings)}/yr
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-400 mb-2 leading-relaxed">
                  {rec.reason}
                </div>

                {!rec.isOptimal && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-teal-400">
                    <ArrowRight className="w-3 h-3" />
                    {rec.recommendedAction}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {isHighSavings && (
          <div className="mb-8 p-6 rounded-2xl border border-teal-400/30 bg-gradient-to-b from-teal-400/10 to-transparent">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-400/20 flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Capture more of this savings with Credex
                </h3>
                <p className="text-slate-400 text-sm mb-3">
                  Credex sells discounted AI credits — the same Cursor, Claude,
                  and ChatGPT you&apos;re already using — at up to 60% off
                  retail. For teams saving {formatCurrency(audit.total_monthly_savings)}
                  /mo through plan optimization, credits compound that further.
                </p>
                <a
                  id="credex-cta-link"
                  href="https://credex.rocks"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm">
                    Book a Credex consultation
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-[#0d1424]">
          {leadSubmitted ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-1">
                Audit sent to your inbox
              </h3>
              <p className="text-slate-400 text-sm">
                Check your email for a permanent link to this report.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-5 h-5 text-teal-400" />
                <h3 className="text-white font-semibold">
                  {isOptimal
                    ? "Get notified when new optimizations apply to your stack"
                    : "Email me this report"}
                </h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                {isOptimal
                  ? "AI tool pricing changes frequently. We'll let you know when new savings apply."
                  : "Permanent link to this audit. No spam. One email."}
              </p>
              <form
                id="lead-capture-form"
                onSubmit={handleLeadSubmit}
                className="space-y-3"
              >
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    id="lead-company"
                    type="text"
                    placeholder="Company (optional)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <Input
                    id="lead-role"
                    type="text"
                    placeholder="Your role (optional)"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  name="website"
                  className="hidden"
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                />
                {leadError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {leadError}
                  </div>
                )}
                <Button
                  id="lead-submit-button"
                  type="submit"
                  className="w-full"
                  disabled={leadSubmitting || !email}
                >
                  {leadSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send report to my email"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>

        <div className="p-5 rounded-2xl border border-white/8 bg-[#0d1424]">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Share this audit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-400 text-xs font-mono truncate">
              {shareUrl}
            </div>
            <button
              id="copy-link-button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all text-xs"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-teal-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            This URL is public but contains no personal information.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/audit">
            <Button variant="ghost" size="sm">
              Run a new audit
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
