import Link from "next/link";
import { BarChart3, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalNotFound() {
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
          Page not found
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist. Head back home or
          run a new AI spend audit.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" id="not-found-home">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go home
            </Button>
          </Link>
          <Link href="/audit" id="not-found-audit">
            <Button size="lg" className="w-full sm:w-auto">
              Run free audit
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
