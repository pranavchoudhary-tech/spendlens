import Link from "next/link";
import { BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060c18] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>

        <p className="text-teal-400 text-sm font-mono mb-3 uppercase tracking-widest">
          404
        </p>

        <h1 className="text-3xl font-bold text-white mb-3">
          Audit not found
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          This audit link may have expired or the ID is incorrect. Audit results
          are stored for 90 days.
        </p>

        <Link href="/audit" id="not-found-cta">
          <Button size="lg" className="w-full sm:w-auto">
            Run a new audit
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <p className="mt-4 text-slate-600 text-xs">
          <Link href="/" className="hover:text-slate-400 transition-colors">
            ← Back to SpendLens
          </Link>
        </p>
      </div>
    </div>
  );
}
