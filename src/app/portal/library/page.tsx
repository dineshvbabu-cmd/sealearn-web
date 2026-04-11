import { BookOpen, FileText, Video, ExternalLink, Search } from "lucide-react";

const resources = [
  { category: "STCW References", icon: "📋", items: [
    { title: "STCW 2010 Manila Amendments — Full Text", type: "pdf", size: "8.2 MB", tag: "Essential" },
    { title: "STCW Code — Part A & B", type: "pdf", size: "5.1 MB", tag: "Essential" },
    { title: "IMO Model Course 7.03 — Officer in Charge of a Navigation Watch", type: "pdf", size: "3.4 MB", tag: "Core" },
    { title: "IMO Model Course 7.06 — Master and Chief Mate", type: "pdf", size: "4.8 MB", tag: "Advanced" },
  ]},
  { category: "Navigation", icon: "🧭", items: [
    { title: "Admiralty Manual of Navigation Vol. 1", type: "pdf", size: "12 MB", tag: "Core" },
    { title: "Celestial Navigation — Sight Reduction Tables (HO 229)", type: "pdf", size: "6.3 MB", tag: "Core" },
    { title: "Chart Datum & Tidal Calculations", type: "pdf", size: "2.1 MB", tag: "Reference" },
    { title: "Radar Navigation Tutorial — Video Series", type: "video", size: "45 min", tag: "Video" },
  ]},
  { category: "Safety & Survival", icon: "⛑️", items: [
    { title: "SOLAS Convention — Consolidated Edition 2020", type: "pdf", size: "9.7 MB", tag: "Essential" },
    { title: "Personal Survival Techniques — Study Guide", type: "pdf", size: "1.8 MB", tag: "BST" },
    { title: "Fire Fighting Manual — STCW VI/1", type: "pdf", size: "3.2 MB", tag: "BST" },
    { title: "MARPOL 73/78 — Anti-Pollution Manual", type: "pdf", size: "4.5 MB", tag: "Reference" },
  ]},
  { category: "Ship Operations", icon: "⚓", items: [
    { title: "Thomas's Stowage — Cargo Handling Guide", type: "pdf", size: "7.1 MB", tag: "Core" },
    { title: "Ship Stability Calculations — Worked Examples", type: "pdf", size: "2.9 MB", tag: "Core" },
    { title: "Meteorology for Seafarers", type: "pdf", size: "3.6 MB", tag: "Reference" },
    { title: "Watchkeeping Duties at Sea — Practical Guide", type: "pdf", size: "1.4 MB", tag: "Core" },
  ]},
];

const tagColor: Record<string, string> = {
  Essential: "bg-danger/10 text-danger",
  Core: "bg-ocean/10 text-ocean",
  BST: "bg-jade/10 text-jade",
  Advanced: "bg-teal/10 text-teal",
  Reference: "bg-surface text-muted",
  Video: "bg-amber/10 text-amber",
};

export default function LibraryPage() {
  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Library</h1>
          <p className="text-muted text-sm mt-1">Study materials, IMO references & STCW manuals</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search library resources…"
          className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-ocean bg-white shadow-sm"
        />
      </div>

      {/* Resource categories */}
      <div className="space-y-6">
        {resources.map((cat) => (
          <div key={cat.category} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <span className="text-lg">{cat.icon}</span>
              <h2 className="font-bold text-navy">{cat.category}</h2>
              <span className="text-xs text-muted ml-auto">{cat.items.length} resources</span>
            </div>
            <div className="divide-y divide-border">
              {cat.items.map((item, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-surface/50 transition-colors group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.type === "video" ? "bg-amber/10" : "bg-ocean/10"
                  }`}>
                    {item.type === "video" ? (
                      <Video size={14} className="text-amber" />
                    ) : (
                      <FileText size={14} className="text-ocean" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy group-hover:text-ocean transition-colors truncate">{item.title}</p>
                    <p className="text-xs text-muted">{item.type.toUpperCase()} · {item.size}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${tagColor[item.tag] ?? "bg-surface text-muted"}`}>
                    {item.tag}
                  </span>
                  <button className="shrink-0 text-muted hover:text-ocean transition-colors opacity-0 group-hover:opacity-100">
                    <ExternalLink size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* External links */}
      <div className="mt-6 bg-navy rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-gold" />
          <h2 className="font-cinzel font-bold text-gold">External Resources</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { name: "IMO Official Website", desc: "International Maritime Organization", url: "#" },
            { name: "NIMASA Nigeria", desc: "Nigerian Maritime Administration", url: "#" },
            { name: "UK MCA Publications", desc: "Maritime & Coastguard Agency", url: "#" },
          ].map((link) => (
            <a key={link.name} href={link.url} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors group">
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold group-hover:text-gold transition-colors">{link.name}</p>
                <p className="text-white/40 text-[10px]">{link.desc}</p>
              </div>
              <ExternalLink size={12} className="text-white/30 shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
