export default function AdminLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-48 bg-border rounded-lg mb-2" />
          <div className="h-4 w-32 bg-border/60 rounded" />
        </div>
        <div className="h-9 w-28 bg-border rounded-lg" />
      </div>
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="border-b border-border px-5 py-3 flex gap-8">
          {[120, 80, 60, 80, 70, 60, 60].map((w, i) => (
            <div key={i} className={`h-3 bg-border/60 rounded w-${w < 100 ? `[${w}px]` : "[120px]"}`} style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-5 py-4 border-b border-border/50 flex gap-8 items-center">
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-48 bg-border/60 rounded" />
              <div className="h-2.5 w-28 bg-border/40 rounded" />
            </div>
            <div className="h-3 w-16 bg-border/50 rounded" />
            <div className="h-3 w-12 bg-border/40 rounded" />
            <div className="h-3 w-20 bg-border/50 rounded" />
            <div className="h-3 w-16 bg-border/40 rounded" />
            <div className="h-5 w-5 bg-border/50 rounded-full" />
            <div className="flex gap-2">
              <div className="h-6 w-14 bg-border/50 rounded-lg" />
              <div className="h-6 w-14 bg-border/50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
