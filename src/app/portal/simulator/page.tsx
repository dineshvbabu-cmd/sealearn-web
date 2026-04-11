import { Monitor, Clock, CheckCircle, AlertCircle } from "lucide-react";

const bookings = [
  { id: 1, date: "Tue, 15 Apr 2026", time: "08:00 – 11:00", lab: "Bridge Simulator Lab 1", scenario: "Port Approach — Lagos Harbour", instructor: "Capt. Balogun", status: "confirmed" },
  { id: 2, date: "Thu, 17 Apr 2026", time: "14:00 – 17:00", lab: "Bridge Simulator Lab 2", scenario: "Collision Avoidance — Open Sea", instructor: "Capt. Adeyemi", status: "confirmed" },
  { id: 3, date: "Tue, 22 Apr 2026", time: "08:00 – 11:00", lab: "Bridge Simulator Lab 1", scenario: "Restricted Visibility Navigation", instructor: "Capt. Balogun", status: "pending" },
];

const pastSessions = [
  { date: "04 Apr 2026", scenario: "Basic Ship Handling", lab: "Lab 1", hours: 3, score: 78, grade: "B+" },
  { date: "08 Apr 2026", scenario: "Radar Plotting & ARPA", lab: "Lab 2", hours: 3, score: 85, grade: "A" },
  { date: "10 Apr 2026", scenario: "Anchoring Procedures", lab: "Lab 1", hours: 2, score: 81, grade: "A-" },
];

const availableSlots = [
  { date: "Mon, 14 Apr", time: "14:00", lab: "Lab 2", available: 3 },
  { date: "Wed, 16 Apr", time: "08:00", lab: "Lab 1", available: 1 },
  { date: "Wed, 16 Apr", time: "11:00", lab: "Lab 2", available: 4 },
  { date: "Fri, 18 Apr", time: "08:00", lab: "Lab 1", available: 2 },
];

const statusConfig: Record<string, string> = {
  confirmed: "bg-jade/10 text-jade border-jade/20",
  pending: "bg-amber/10 text-amber border-amber/20",
};

export default function SimulatorPage() {
  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Simulator Booking</h1>
          <p className="text-muted text-sm mt-1">Bridge & Engine Room Simulator Sessions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 border-t-4 border-t-teal">
          <div className="text-2xl font-bold text-teal font-cinzel">8</div>
          <div className="text-xs text-muted mt-0.5">Hours Completed</div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 border-t-4 border-t-ocean">
          <div className="text-2xl font-bold text-ocean font-cinzel">24</div>
          <div className="text-xs text-muted mt-0.5">Required Hours</div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 border-t-4 border-t-jade">
          <div className="text-2xl font-bold text-jade font-cinzel">2</div>
          <div className="text-xs text-muted mt-0.5">Upcoming Bookings</div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 border-t-4 border-t-gold">
          <div className="text-2xl font-bold text-amber font-cinzel">81%</div>
          <div className="text-xs text-muted mt-0.5">Avg. Score</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Upcoming bookings */}
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Clock size={16} className="text-ocean" />
              <h2 className="font-bold text-navy">Upcoming Sessions</h2>
            </div>
            <div className="divide-y divide-border">
              {bookings.map((b) => (
                <div key={b.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                        <Monitor size={18} className="text-navy" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">{b.scenario}</p>
                        <p className="text-xs text-muted">{b.date} · {b.time}</p>
                        <p className="text-xs text-muted">{b.lab} · {b.instructor}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${statusConfig[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past sessions */}
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <CheckCircle size={16} className="text-jade" />
              <h2 className="font-bold text-navy">Completed Sessions</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left px-5 py-2 text-xs font-bold text-muted uppercase tracking-wide">Scenario</th>
                  <th className="text-left px-4 py-2 text-xs font-bold text-muted uppercase tracking-wide">Date</th>
                  <th className="text-center px-4 py-2 text-xs font-bold text-muted uppercase tracking-wide">Hours</th>
                  <th className="text-center px-4 py-2 text-xs font-bold text-muted uppercase tracking-wide">Score</th>
                  <th className="text-center px-4 py-2 text-xs font-bold text-muted uppercase tracking-wide">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pastSessions.map((s, i) => (
                  <tr key={i} className="hover:bg-surface/50">
                    <td className="px-5 py-3 font-medium text-navy">{s.scenario}</td>
                    <td className="px-4 py-3 text-muted text-xs">{s.date}</td>
                    <td className="px-4 py-3 text-center text-muted text-xs">{s.hours}</td>
                    <td className="px-4 py-3 text-center font-semibold text-ocean">{s.score}%</td>
                    <td className="px-4 py-3 text-center font-bold text-jade">{s.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available slots to book */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden h-fit">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-bold text-navy">Book a Session</h2>
            <p className="text-xs text-muted mt-0.5">Available slots this week</p>
          </div>
          <div className="divide-y divide-border">
            {availableSlots.map((slot, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-navy">{slot.date}</p>
                  <p className="text-xs text-muted">{slot.time} · {slot.lab}</p>
                  <p className="text-xs text-jade">{slot.available} seat{slot.available !== 1 ? "s" : ""} left</p>
                </div>
                <button className="shrink-0 text-xs font-bold text-ocean border border-ocean/30 px-3 py-1.5 rounded-lg hover:bg-ocean/10 transition-colors">
                  Book
                </button>
              </div>
            ))}
          </div>
          <div className="p-5 border-t border-border">
            <div className="bg-amber/5 border border-amber/20 rounded-lg p-3 flex items-start gap-2 text-xs text-amber">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              Bookings must be made at least 24 hours in advance. Cancellations within 12 hours may be penalised.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
