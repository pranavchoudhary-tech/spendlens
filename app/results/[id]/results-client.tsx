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
import { formatCurrency } from "@/lib/utils";

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
  duplicate_warnings?: string[];
  use_case: string;
  team_size: number;
  ai_summary: string;
  created_at: string;
}

interface ResultsClientProps {
  initialAudit: AuditData | null;
  auditId: string;
}

export default function ResultsClient({ initialAudit, auditId }: ResultsClientProps) {
  const [audit, setAudit] = useState<AuditData | null>(initialAudit);
  const [checkingLocal, setCheckingLocal] = useState(!initialAudit);
  const [notFoundState, setNotFoundState] = useState(false);

  const [aiSummary, setAiSummary] = useState<string>(initialAudit?.ai_summary ?? "");
  const [summaryLoading, setSummaryLoading] = useState(initialAudit ? !initialAudit.ai_summary : false);

  const [showAnnual, setShowAnnual] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  useEffect(() => {
    if (initialAudit) return;

    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(`spendlens_audit_${auditId}`);
        if (stored) {
          const parsed: AuditData = JSON.parse(stored);
          setAudit(parsed);
          setAiSummary(parsed.ai_summary);
          setSummaryLoading(!parsed.ai_summary);
        } else {
          setNotFoundState(true);
        }
      } catch {
        setNotFoundState(true);
      } finally {
        setCheckingLocal(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [initialAudit, auditId]);

  useEffect(() => {
    if (!audit || audit.ai_summary || aiSummary) return;

    async function fetchSummary() {
      if (!audit) return;
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
          try {
            const updatedAudit = { ...audit, ai_summary: summary };
            localStorage.setItem(`spendlens_audit_${auditId}`, JSON.stringify(updatedAudit));
          } catch (e) {
            console.error("Failed to update stored summary:", e);
          }
        }
      } catch {
        /* fallback stays blank */
      } finally {
        setSummaryLoading(false);
      }
    }

    fetchSummary();
  }, [audit, auditId, aiSummary]);

  const displaySavings = audit
    ? (showAnnual ? audit.total_annual_savings : audit.total_monthly_savings)
    : 0;
  const displaySuffix = showAnnual ? "/yr" : "/mo";

  const isHighSavings = audit ? audit.total_monthly_savings > 500 : false;
  const isOptimal = audit ? audit.total_monthly_savings < 100 : false;
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://spendlens.vercel.app/results/${auditId}`;

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !audit) return;
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

  if (checkingLocal) {
    return (
      <div className="min-h-screen bg-[#060c18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading your audit results...</p>
        </div>
      </div>
    );
  }

  if (notFoundState || !audit) {
    return (
      <div className="min-h-screen bg-[#060c18] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Audit Not Found</h1>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              This audit link may have expired or is incorrect. Audit results are stored for 90 days.
            </p>
          </div>
          <div>
            <Link href="/audit">
              <Button className="w-full shadow-lg shadow-teal-500/20 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-slate-950 font-semibold h-11">
                Run a New Audit
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
          <div className="text-xs text-slate-600">
            <Link href="/" className="hover:text-slate-400 transition-colors">
              ← Back to SpendLens
            </Link>
          </div>
        </div>
      </div>
    );
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
                  {formatCurrency(displaySavings)}
                </span>
                <span className="text-2xl text-slate-400 font-normal">{displaySuffix}</span>
              </h1>
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  id="toggle-monthly"
                  onClick={() => setShowAnnual(false)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    !showAnnual
                      ? "bg-teal-400 text-navy-950"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  id="toggle-annual"
                  onClick={() => setShowAnnual(true)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    showAnnual
                      ? "bg-teal-400 text-navy-950"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>
          )}
        </div>

        {audit.duplicate_warnings && audit.duplicate_warnings.length > 0 && (
          <div className="mb-8 space-y-2">
            {audit.duplicate_warnings.map((warning, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl border border-amber-400/20 bg-amber-400/5"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-200/80 text-sm leading-relaxed">{warning}</p>
              </div>
            ))}
          </div>
        )}

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
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Potential saving</span>
                      <span className="text-teal-400 font-semibold">
                        {Math.round((rec.monthlySavings / rec.currentSpend) * 100)}%
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-teal-300 rounded-full"
                        style={{
                          width: `${Math.min(
                            Math.round((rec.monthlySavings / rec.currentSpend) * 100),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-teal-400 mt-2">
                      <ArrowRight className="w-3 h-3" />
                      {rec.recommendedAction}
                    </div>
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
