import { requireEnrolment } from "@/lib/portal-guard";
import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";

const logEntries = [
  { id: 1, stcwRef: "Table A-II/1 Item 1", description: "Ability to determine ship's position using celestial means", hours: 8, date: "05 Mar 2026", status: "signed", signedBy: "Capt. Adeyemi" },
  { id: 2, stcwRef: "Table A-II/1 Item 3", description: "Watchkeeping duties and procedures at sea", hours: 16, date: "10 Mar 2026", status: "signed", signedBy: "Capt. Balogun" },
  { id: 3, stcwRef: "Table A-II/1 Item 5", description: "Use of ECDIS and electronic chart systems", hours: 6, date: "15 Mar 2026", status: "signed", signedBy: "Capt. Adeyemi" },
  { id: 4, stcwRef: "Table A-VI/1 Item 2", description: "Personal survival techniques — liferaft deployment", hours: 4, date: "20 Mar 2026", status: "signed", signedBy: "Mr. Eze" },
  { id: 5, stcwRef: "Table A-VI/1 Item 3", description: "Fire prevention and fire-fighting procedures", hours: 8, date: "25 Mar 2026", status: "pending", signedBy: null },
  { id: 6, stcwRef: "Table A-II/1 Item 7", description: "Cargo operations and planning cargo stowage", hours: 6, date: "01 Apr 2026", status: "pending", signedBy: null },
  { id: 7, stcwRef: "Table A-II/1 Item 9", description: "Meteorological observations and weather routing", hours: 4, date: "05 Apr 2026", status: "pending", signedBy: null },
  { id: 8, stcwRef: "Table A-VI/3 Item 1", description: "Crowd management and crisis situations", hours: 3, date: "08 Apr 2026", status: "draft", signedBy: null },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  signed: { label: "Signed Off", color: "bg-jade/10 text-jade border-jade/20", icon: <CheckCircle size={12} /> },
  pending: { label: "Awaiting Sign-off", color: "bg-amber/10 text-amber border-amber/20", icon: <Clock size={12} /> },
  draft: { label: "Draft", color: "bg-surface text-muted border-border", icon: <FileText size={12} /> },
};

const totalHours = logEntries.reduce((s, e) => s + e.hours, 0);
const signedHours = logEntries.filter((e) => e.status === "signed").reduce((s, e) => s + e.hours, 0);
const pendingCount = logEntries.filter((e) => e.status === "pending").length;

export default async function PracticalLogPage() {
  await requireEnrolment();
  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Practical Log Book</h1>
          <p className="text-muted text-sm mt-1">STCW Sea-Service & Competency Record</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-teal text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-teal/90 transition-colors">
          + Add Entry
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 border-t-4 border-t-jade">
          <div className="text-2xl font-bold text-jade font-cinzel">{signedHours}</div>
          <div className="text-xs text-muted mt-0.5">Hours Signed Off</div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 border-t-4 border-t-amber">
          <div className="text-2xl font-bold text-amber font-cinzel">{pendingCount}</div>
          <div className="text-xs text-muted mt-0.5">Awaiting Sign-off</div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 border-t-4 border-t-ocean">
          <div className="text-2xl font-bold text-ocean font-cinzel">{totalHours}</div>
          <div className="text-xs text-muted mt-0.5">Total Hours Logged</div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 border-t-4 border-t-teal">
          <div className="text-2xl font-bold text-teal font-cinzel">360</div>
          <div className="text-xs text-muted mt-0.5">Required Hours</div>
        </div>
      </div>

      {/* Progress toward requirement */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-5 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-bold text-navy">Sea Service Progress</span>
          <span className="text-muted">{signedHours} / 360 hrs required</span>
        </div>
        <div className="h-3 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-jade to-teal rounded-full transition-all" style={{ width: `${Math.min((signedHours / 360) * 100, 100)}%` }} />
        </div>
        <p className="text-xs text-muted mt-2">
          {pendingCount > 0 && (
            <span className="text-amber font-semibold">{pendingCount} entries pending instructor sign-off · </span>
          )}
          {360 - signedHours} hours remaining to meet STCW requirement
        </p>
      </div>

      {/* Log entries */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-navy">Log Entries ({logEntries.length})</h2>
          {pendingCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber">
              <AlertCircle size={14} />
              {pendingCount} pending sign-off
            </div>
          )}
        </div>
        <div className="divide-y divide-border">
          {logEntries.map((entry) => {
            const s = statusConfig[entry.status];
            return (
              <div key={entry.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-ocean bg-ocean/10 px-2 py-0.5 rounded">{entry.stcwRef}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.color}`}>
                        {s.icon} {s.label}
                      </span>
                    </div>
                    <p className="text-sm text-navy font-medium">{entry.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted">
                      <span>{entry.date}</span>
                      <span>{entry.hours} hrs</span>
                      {entry.signedBy && <span className="text-jade">✓ {entry.signedBy}</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-navy">{entry.hours}</div>
                    <div className="text-[10px] text-muted">hrs</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
