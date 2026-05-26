"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, BarChart3, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AuditFormData, ToolInput, UseCase, ToolId } from "@/lib/types";

const STORAGE_KEY = "spendlens_audit_form";

const TOOL_OPTIONS: { value: ToolId; label: string }[] = [
  { value: "cursor", label: "Cursor" },
  { value: "github_copilot", label: "GitHub Copilot" },
  { value: "claude", label: "Claude" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "anthropic_api", label: "Anthropic API (direct)" },
  { value: "openai_api", label: "OpenAI API (direct)" },
  { value: "gemini", label: "Gemini" },
  { value: "windsurf", label: "Windsurf" },
];

const PLAN_OPTIONS: Record<ToolId, { value: string; label: string }[]> = {
  cursor: [
    { value: "Hobby", label: "Hobby (Free)" },
    { value: "Pro", label: "Pro ($20/mo)" },
    { value: "Business", label: "Business ($40/mo)" },
    { value: "Enterprise", label: "Enterprise (custom)" },
  ],
  github_copilot: [
    { value: "Individual", label: "Individual ($10/mo)" },
    { value: "Business", label: "Business ($19/mo)" },
    { value: "Enterprise", label: "Enterprise ($39/mo)" },
  ],
  claude: [
    { value: "Free", label: "Free" },
    { value: "Pro", label: "Pro ($20/mo)" },
    { value: "Max", label: "Max ($100/mo)" },
    { value: "Team", label: "Team ($30/user/mo)" },
    { value: "Enterprise", label: "Enterprise (custom)" },
  ],
  chatgpt: [
    { value: "Free", label: "Free" },
    { value: "Plus", label: "Plus ($20/mo)" },
    { value: "Team", label: "Team ($30/user/mo)" },
    { value: "Enterprise", label: "Enterprise (custom)" },
  ],
  anthropic_api: [
    { value: "Pay-as-you-go", label: "Pay-as-you-go" },
  ],
  openai_api: [
    { value: "Pay-as-you-go", label: "Pay-as-you-go" },
  ],
  gemini: [
    { value: "Free", label: "Free" },
    { value: "Advanced", label: "Advanced ($20/mo)" },
    { value: "Business", label: "Business ($24/user/mo)" },
    { value: "Enterprise", label: "Enterprise (custom)" },
  ],
  windsurf: [
    { value: "Free", label: "Free" },
    { value: "Pro", label: "Pro ($15/mo)" },
    { value: "Teams", label: "Teams ($35/user/mo)" },
    { value: "Enterprise", label: "Enterprise (custom)" },
  ],
};

const USE_CASE_OPTIONS: { value: UseCase; label: string; description: string }[] = [
  { value: "coding", label: "Software development", description: "Writing, reviewing, and debugging code" },
  { value: "writing", label: "Writing & content", description: "Docs, emails, marketing copy, reports" },
  { value: "data", label: "Data & analysis", description: "Data processing, SQL, spreadsheet analysis" },
  { value: "research", label: "Research", description: "Literature review, summarization, Q&A" },
  { value: "mixed", label: "Mixed / general", description: "Combination of the above use cases" },
];

function createDefaultTool(): ToolInput {
  return {
    toolId: "cursor",
    plan: "Pro",
    monthlySpend: 0,
    seats: 1,
  };
}

export default function AuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [teamSize, setTeamSize] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return (JSON.parse(saved) as AuditFormData).teamSize ?? 1;
    } catch { /* ignore */ }
    return 1;
  });

  const [useCase, setUseCase] = useState<UseCase>(() => {
    if (typeof window === "undefined") return "coding";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return (JSON.parse(saved) as AuditFormData).useCase ?? "coding";
    } catch { /* ignore */ }
    return "coding";
  });

  const [tools, setTools] = useState<ToolInput[]>(() => {
    if (typeof window === "undefined") return [createDefaultTool()];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return (JSON.parse(saved) as AuditFormData).tools ?? [createDefaultTool()];
    } catch { /* ignore */ }
    return [createDefaultTool()];
  });

  useEffect(() => {
    const data: AuditFormData = { teamSize, useCase, tools };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [teamSize, useCase, tools]);


  function updateTool(index: number, field: keyof ToolInput, value: string | number) {
    setTools((prev) =>
      prev.map((tool, i) => {
        if (i !== index) return tool;
        if (field === "toolId") {
          const newToolId = value as ToolId;
          const firstPlan = PLAN_OPTIONS[newToolId]?.[0]?.value ?? "Pro";
          return { ...tool, toolId: newToolId, plan: firstPlan };
        }
        return { ...tool, [field]: value };
      })
    );
  }

  function addTool() {
    if (tools.length >= 8) return;
    setTools((prev) => [...prev, createDefaultTool()]);
  }

  function removeTool(index: number) {
    setTools((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamSize, useCase, tools }),
      });

      if (!response.ok) {
        throw new Error("Failed to run audit. Please try again.");
      }

      const auditData = await response.json();
      const { id } = auditData;
      
      try {
        localStorage.setItem(`spendlens_audit_${id}`, JSON.stringify(auditData));
      } catch (err) {
        console.error("Failed to save audit result in localStorage:", err);
      }

      localStorage.removeItem(STORAGE_KEY);
      router.push(`/results/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  }

  const totalSpend = tools.reduce((sum, t) => sum + (t.monthlySpend || 0), 0);

  return (
    <div className="min-h-screen bg-[#060c18] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-white" />
          </div>
          <Link href="/" className="text-white font-bold text-base tracking-tight">
            SpendLens
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  s === step
                    ? "bg-teal-400 text-[#060c18]"
                    : s < step
                    ? "bg-teal-400/30 text-teal-400"
                    : "bg-white/10 text-slate-500"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className={`h-px w-12 transition-all duration-500 ${
                    s < step ? "bg-teal-400/50" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
          <span className="ml-2 text-sm text-slate-500">
            {step === 1 && "Team info"}
            {step === 2 && "AI tools"}
            {step === 3 && "Review"}
          </span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-teal-300 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold text-white mb-2">
              Tell us about your team
            </h1>
            <p className="text-slate-400 mb-8">
              This helps us calibrate recommendations to your actual setup.
            </p>

            <div className="space-y-6">
              <Input
                id="team-size"
                label="Total team size"
                type="number"
                min={1}
                max={10000}
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                placeholder="e.g. 8"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Primary use case
                </label>
                <div className="grid gap-3">
                  {USE_CASE_OPTIONS.map((uc) => (
                    <button
                      key={uc.value}
                      id={`use-case-${uc.value}`}
                      onClick={() => setUseCase(uc.value)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                        useCase === uc.value
                          ? "border-teal-400/60 bg-teal-400/10"
                          : "border-white/8 bg-[#0d1424] hover:border-white/20"
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          useCase === uc.value ? "text-teal-400" : "text-white"
                        }`}
                      >
                        {uc.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {uc.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                id="step1-next"
                size="lg"
                onClick={() => setStep(2)}
                className="w-full"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold text-white mb-2">
              Your AI tools
            </h1>
            <p className="text-slate-400 mb-8">
              Add every tool you&apos;re paying for. Enter your actual monthly spend
              from the invoice.
            </p>

            <div className="space-y-4">
              {tools.map((tool, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-slate-300">
                        Tool {index + 1}
                      </span>
                      {tools.length > 1 && (
                        <button
                          id={`remove-tool-${index}`}
                          onClick={() => removeTool(index)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                          aria-label="Remove tool"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        id={`tool-name-${index}`}
                        label="Tool"
                        value={tool.toolId}
                        options={TOOL_OPTIONS}
                        onChange={(e) =>
                          updateTool(index, "toolId", e.target.value)
                        }
                      />
                      <Select
                        id={`tool-plan-${index}`}
                        label="Plan"
                        value={tool.plan}
                        options={PLAN_OPTIONS[tool.toolId] ?? []}
                        onChange={(e) =>
                          updateTool(index, "plan", e.target.value)
                        }
                      />
                      <Input
                        id={`tool-spend-${index}`}
                        label="Monthly spend ($)"
                        type="number"
                        min={0}
                        value={tool.monthlySpend || ""}
                        onChange={(e) =>
                          updateTool(
                            index,
                            "monthlySpend",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                      />
                      <Input
                        id={`tool-seats-${index}`}
                        label="Seats / users"
                        type="number"
                        min={1}
                        value={tool.seats || ""}
                        onChange={(e) =>
                          updateTool(
                            index,
                            "seats",
                            parseInt(e.target.value) || 1
                          )
                        }
                        placeholder="1"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {tools.length < 8 && (
                <button
                  id="add-tool-button"
                  onClick={addTool}
                  className="w-full py-3 rounded-xl border border-dashed border-white/15 text-slate-500 hover:border-teal-400/40 hover:text-teal-400 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add another tool
                </button>
              )}
            </div>

            {totalSpend > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/8 flex items-center justify-between">
                <span className="text-sm text-slate-400">Total monthly spend</span>
                <span className="text-white font-bold">${totalSpend.toLocaleString()}/mo</span>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <Button
                id="step2-back"
                variant="secondary"
                size="lg"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                id="step2-next"
                size="lg"
                onClick={() => setStep(3)}
                className="flex-2"
                disabled={tools.every((t) => !t.monthlySpend)}
              >
                Review
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold text-white mb-2">
              Review your audit
            </h1>
            <p className="text-slate-400 mb-8">
              Confirm your details, then we&apos;ll run the analysis.
            </p>

            <Card className="mb-4">
              <CardContent className="p-5">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
                  Team
                </p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-white font-semibold">{teamSize}</p>
                    <p className="text-xs text-slate-500">Total team size</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold capitalize">{useCase}</p>
                    <p className="text-xs text-slate-500">Primary use case</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3 mb-6">
              {tools.filter((t) => t.monthlySpend > 0).map((tool, i) => {
                const toolLabel = TOOL_OPTIONS.find((o) => o.value === tool.toolId)?.label ?? tool.toolId;
                return (
                  <Card key={i}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-semibold">{toolLabel}</p>
                        <p className="text-slate-500 text-xs">
                          {tool.plan} · {tool.seats} seat{tool.seats > 1 ? "s" : ""}
                        </p>
                      </div>
                      <p className="text-teal-400 font-bold text-sm">
                        ${tool.monthlySpend}/mo
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-teal-400/5 border border-teal-400/20 mb-6 flex justify-between items-center">
              <span className="text-slate-300 text-sm">Total monthly spend</span>
              <span className="text-white font-bold text-lg">${totalSpend.toLocaleString()}/mo</span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/30 text-red-400 text-sm mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                id="step3-back"
                variant="secondary"
                size="lg"
                onClick={() => setStep(2)}
                className="flex-1"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                id="run-audit-button"
                size="lg"
                onClick={handleSubmit}
                className="flex-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running audit...
                  </>
                ) : (
                  <>
                    Run Audit
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
