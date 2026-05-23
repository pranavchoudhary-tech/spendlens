import SkeletonBlock from "@/components/ui/skeleton";

export default function ResultsLoading() {
  return (
    <div className="min-h-screen bg-[#060c18]">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-400/20 animate-pulse" />
          <SkeletonBlock className="w-24 h-5" />
        </div>
        <SkeletonBlock className="w-20 h-8" />
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <SkeletonBlock className="w-28 h-4 mx-auto mb-4" />
          <SkeletonBlock className="w-48 h-4 mx-auto mb-4" />
          <SkeletonBlock className="w-64 h-16 mx-auto mb-2" />
          <SkeletonBlock className="w-40 h-5 mx-auto" />
        </div>

        <div className="mb-8 p-5 rounded-2xl border border-white/8 bg-[#0d1424]">
          <div className="flex items-center gap-2 mb-3">
            <SkeletonBlock className="w-5 h-5 rounded" />
            <SkeletonBlock className="w-20 h-3" />
          </div>
          <SkeletonBlock className="w-full h-4 mb-2" />
          <SkeletonBlock className="w-4/5 h-4 mb-2" />
          <SkeletonBlock className="w-3/5 h-4" />
        </div>

        <div className="mb-8">
          <SkeletonBlock className="w-40 h-6 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-white/8 bg-[#0d1424]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <SkeletonBlock className="w-24 h-4" />
                    <SkeletonBlock className="w-16 h-5 rounded-full" />
                  </div>
                  <SkeletonBlock className="w-20 h-4" />
                </div>
                <SkeletonBlock className="w-full h-3 mb-1" />
                <SkeletonBlock className="w-3/4 h-3" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#0d1424]">
          <SkeletonBlock className="w-40 h-5 mb-2" />
          <SkeletonBlock className="w-64 h-4 mb-4" />
          <SkeletonBlock className="w-full h-10 rounded-xl mb-3" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <SkeletonBlock className="h-10 rounded-xl" />
            <SkeletonBlock className="h-10 rounded-xl" />
          </div>
          <SkeletonBlock className="w-full h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
