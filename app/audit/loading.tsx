import SkeletonBlock from "@/components/ui/skeleton";

export default function AuditLoading() {
  return (
    <div className="min-h-screen bg-[#060c18] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-lg bg-teal-400/20 animate-pulse" />
          <SkeletonBlock className="w-24 h-5" />
        </div>

        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <SkeletonBlock className="w-7 h-7 rounded-full" />
              {s < 3 && <SkeletonBlock className="h-px w-12" />}
            </div>
          ))}
        </div>

        <SkeletonBlock className="w-56 h-8 mb-2" />
        <SkeletonBlock className="w-80 h-5 mb-8" />

        <div className="space-y-4">
          <SkeletonBlock className="w-full h-12 rounded-xl" />
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <SkeletonBlock key={i} className="w-full h-16 rounded-xl" />
            ))}
          </div>
        </div>

        <SkeletonBlock className="w-full h-12 rounded-xl mt-8" />
      </div>
    </div>
  );
}
