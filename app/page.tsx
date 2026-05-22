import Link from "next/link";
import {
  ArrowRight,
  TrendingDown,
  Zap,
  Shield,
  BarChart3,
  Check,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SUPPORTED_TOOLS = [
  { name: "Cursor", color: "#1a1a2e" },
  { name: "GitHub Copilot", color: "#1a1a2e" },
  { name: "Claude", color: "#1a1a2e" },
  { name: "ChatGPT", color: "#1a1a2e" },
  { name: "Anthropic API", color: "#1a1a2e" },
  { name: "OpenAI API", color: "#1a1a2e" },
  { name: "Gemini", color: "#1a1a2e" },
  { name: "Windsurf", color: "#1a1a2e" },
];

const STEPS = [
  {
    number: "01",
    title: "Enter your AI stack",
    description:
      "Tell us which tools you pay for, your plan, monthly spend, and team size. Takes 2 minutes.",
    icon: Zap,
  },
  {
    number: "02",
    title: "Get your audit",
    description:
      "Our engine compares your spend against optimal configurations, pricing tiers, and use-case fit.",
    icon: BarChart3,
  },
  {
    number: "03",
    title: "See your savings",
    description:
      "Get a per-tool breakdown with specific actions: downgrade this, switch that, cut these.",
    icon: TrendingDown,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We were paying for 3 overlapping AI coding tools. SpendLens showed us we could cut $1,200/mo with zero capability loss.",
    author: "Sarah M.",
    role: "CTO, Series A startup",
    savings: "$14,400/yr",
    isMocked: true,
  },
  {
    quote:
      "Finally a tool that actually runs the math instead of giving me vague advice. Switched from ChatGPT Team to Claude and saved $480/mo.",
    author: "James T.",
    role: "Engineering Manager",
    savings: "$5,760/yr",
    isMocked: true,
  },
  {
    quote:
      "Our team of 8 was on every enterprise plan by default. SpendLens flagged 4 unnecessary upgrades.",
    author: "Priya K.",
    role: "Founder, B2B SaaS",
    savings: "$3,200/yr",
    isMocked: true,
  },
];

const WHY_FREE = [
  "No login required to run your audit",
  "Results shown before any email is asked",
  "Finance-grade reasoning, not marketing fluff",
  "Pricing data verified against official vendor pages",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#060c18] overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#060c18]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            SpendLens
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            How it works
          </a>
          <a
            href="#tools"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Tools covered
          </a>
          <a
            href="#testimonials"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Results
          </a>
        </div>
        <Link href="/audit">
          <Button size="md" id="nav-cta-button">
            Run Free Audit
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </nav>

      <section className="relative pt-32 pb-24 px-6 hero-glow">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Free · No login · Results in 2 minutes
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            Stop overpaying
            <br />
            <span className="gradient-text">for AI tools</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            Free audit of your AI stack. See exactly where your team is wasting
            money — and get a specific plan to fix it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <Link href="/audit" id="hero-primary-cta">
              <Button size="xl" className="animate-pulse-glow">
                Audit My AI Spend
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a
              href="#how-it-works"
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
            >
              See how it works
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up delay-300">
            <div className="text-center">
              <p className="text-3xl font-bold text-white savings-number">8</p>
              <p className="text-sm text-slate-500 mt-1">Tools covered</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-3xl font-bold text-teal-400 savings-number">
                60%
              </p>
              <p className="text-sm text-slate-500 mt-1">Avg. savings found</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white savings-number">
                2min
              </p>
              <p className="text-sm text-slate-500 mt-1">To complete audit</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs text-slate-600 uppercase tracking-widest mb-8">
            Covering all major AI tools
          </p>
          <div
            id="tools"
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {SUPPORTED_TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-slate-300 text-sm font-medium hover:border-teal-400/30 hover:text-teal-400 transition-all duration-200"
              >
                {tool.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How SpendLens works
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Three steps from landing on this page to knowing exactly where
              your AI budget is leaking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative p-6 rounded-2xl border border-white/8 bg-[#0d1424] card-hover"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <span className="text-teal-400/50 font-mono text-sm font-bold">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 z-10">
                      <ChevronRight className="w-6 h-6 text-teal-400/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why is this free?
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              SpendLens is built by{" "}
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:underline"
              >
                Credex
              </a>
              , a marketplace for discounted AI infrastructure credits. We show
              you the savings. For users with significant overspend, we offer a
              way to capture even more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {WHY_FREE.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-400/10 border border-teal-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-teal-400" />
                  </div>
                  <p className="text-slate-300 text-sm">{item}</p>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl border border-teal-400/20 bg-teal-400/5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-teal-400" />
                <span className="text-teal-400 font-semibold text-sm">
                  The honest pitch
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                If your audit shows &gt;$500/mo in savings, we'll let you know
                that Credex sells the same AI credits at up to 60% off retail.
                No pressure. The audit is useful either way.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Real savings, real teams
            </h2>
            <p className="text-slate-500 text-sm">
              * Testimonials are illustrative examples — results vary by stack
              and team size
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="p-6 rounded-2xl border border-white/8 bg-[#0d1424] card-hover flex flex-col"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-teal-400 text-teal-400"
                    />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {t.author}
                    </p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-teal-400 font-bold text-sm">
                      {t.savings}
                    </p>
                    <p className="text-slate-600 text-xs">saved</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-12 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent gradient-border">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto mb-6 animate-float">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to see your number?
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Most teams find at least $200/mo in savings. Takes 2 minutes.
              Free. No signup required.
            </p>
            <Link href="/audit" id="bottom-cta-button">
              <Button size="xl">
                Start Free Audit
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="text-slate-600 text-xs mt-4">
              No credit card. No account. Just your AI spend.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <BarChart3 className="w-3 h-3 text-white" />
            </div>
            <span className="text-slate-400 text-sm">
              SpendLens by{" "}
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:underline"
              >
                Credex
              </a>
            </span>
          </div>
          <p className="text-slate-600 text-xs text-center">
            Pricing data verified against official vendor pages weekly. Not
            affiliated with Cursor, Anthropic, OpenAI, or GitHub.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/audit"
              className="text-slate-500 hover:text-white text-sm transition-colors"
            >
              Run Audit
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
