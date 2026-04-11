const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const schedule: Record<string, { subject: string; room: string; instructor: string; type: string } | null> = {
  "Mon-08:00": { subject: "Nautical Science & Navigation", room: "Room 2A", instructor: "Capt. Adeyemi", type: "lecture" },
  "Mon-10:00": { subject: "Ship Stability & Construction", room: "Room 3B", instructor: "Engr. Okonkwo", type: "lecture" },
  "Mon-14:00": { subject: "GMDSS / Radio Operations", room: "Radio Lab", instructor: "Mr. Fashola", type: "practical" },
  "Tue-08:00": { subject: "Radar Navigation & ARPA", room: "Sim Lab 1", instructor: "Capt. Balogun", type: "simulator" },
  "Tue-11:00": { subject: "Meteorology & Oceanography", room: "Room 2A", instructor: "Dr. Nwosu", type: "lecture" },
  "Tue-14:00": { subject: "Cargo Handling & Stowage", room: "Deck Workshop", instructor: "Capt. Adeyemi", type: "practical" },
  "Wed-08:00": { subject: "Bridge Resource Management", room: "Sim Lab 1", instructor: "Capt. Balogun", type: "simulator" },
  "Wed-11:00": { subject: "Celestial Navigation", room: "Room 3B", instructor: "Capt. Adeyemi", type: "lecture" },
  "Wed-14:00": { subject: "Fire Fighting & Safety", room: "Drill Ground", instructor: "Mr. Eze", type: "practical" },
  "Thu-08:00": { subject: "Maritime Law & Conventions", room: "Room 4A", instructor: "Barr. Olawale", type: "lecture" },
  "Thu-11:00": { subject: "Ship Stability & Construction", room: "Room 3B", instructor: "Engr. Okonkwo", type: "lecture" },
  "Thu-14:00": { subject: "Watchkeeping Duties", room: "Sim Lab 2", instructor: "Capt. Balogun", type: "simulator" },
  "Fri-08:00": { subject: "Radar Navigation & ARPA", room: "Sim Lab 1", instructor: "Capt. Balogun", type: "simulator" },
  "Fri-11:00": { subject: "Medical First Aid at Sea", room: "Medical Room", instructor: "Dr. Adeleke", type: "practical" },
  "Fri-14:00": { subject: "Personal Survival Techniques", room: "Pool Area", instructor: "Mr. Eze", type: "practical" },
};

const times = ["08:00", "10:00", "11:00", "14:00", "16:00"];

const typeColors: Record<string, string> = {
  lecture: "bg-ocean/10 border-ocean/30 text-ocean",
  simulator: "bg-jade/10 border-jade/30 text-jade",
  practical: "bg-amber/10 border-amber/30 text-amber",
};

const typeLabels: Record<string, string> = {
  lecture: "Lecture",
  simulator: "Simulator",
  practical: "Practical",
};

export default function TimetablePage() {
  const today = days[new Date().getDay() - 1] ?? "Mon";

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl font-bold text-navy">Timetable</h1>
        <p className="text-muted text-sm mt-1">Pre-Sea Deck Cadet Programme — Week 14 · Apr 2026</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(typeLabels).map(([type, label]) => (
          <span key={type} className={`text-xs font-bold px-3 py-1 rounded-full border ${typeColors[type]}`}>{label}</span>
        ))}
      </div>

      {/* Weekly grid */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wide w-20">Time</th>
                {days.map((d) => (
                  <th key={d} className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wide ${d === today ? "text-ocean" : "text-muted"}`}>
                    {d === today ? `${d} ✦` : d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {times.map((time) => (
                <tr key={time} className="hover:bg-surface/30">
                  <td className="px-4 py-3 text-xs font-bold text-muted">{time}</td>
                  {days.map((day) => {
                    const cell = schedule[`${day}-${time}`];
                    return (
                      <td key={day} className={`px-3 py-2 ${day === today ? "bg-ocean/3" : ""}`}>
                        {cell ? (
                          <div className={`rounded-lg border p-2.5 ${typeColors[cell.type]}`}>
                            <p className="font-semibold text-xs leading-tight mb-1">{cell.subject}</p>
                            <p className="text-[10px] opacity-75">{cell.instructor}</p>
                            <p className="text-[10px] opacity-60">{cell.room}</p>
                          </div>
                        ) : (
                          <div className="h-2" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming exams */}
      <div className="mt-6 bg-white rounded-xl border border-border shadow-sm p-5">
        <h2 className="font-cinzel font-bold text-navy mb-4">Upcoming Assessments</h2>
        <div className="space-y-3">
          {[
            { date: "18 Apr 2026", subject: "Radar Navigation & ARPA", type: "Written Exam", room: "Hall A", duration: "2 hrs" },
            { date: "22 Apr 2026", subject: "Ship Stability & Construction", type: "Written Exam", room: "Hall A", duration: "2.5 hrs" },
            { date: "25 Apr 2026", subject: "Bridge Simulator Assessment", type: "Practical", room: "Sim Lab 1", duration: "3 hrs" },
            { date: "02 May 2026", subject: "Personal Survival Techniques", type: "Practical", room: "Pool Area", duration: "4 hrs" },
          ].map((exam) => (
            <div key={exam.date} className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
              <div className="text-center bg-navy rounded-lg px-3 py-2 shrink-0">
                <div className="text-gold text-xs font-bold">{exam.date.split(" ")[1]}</div>
                <div className="text-white text-lg font-bold leading-none">{exam.date.split(" ")[0]}</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy text-sm">{exam.subject}</p>
                <p className="text-xs text-muted">{exam.type} · {exam.room} · {exam.duration}</p>
              </div>
              <span className="text-xs font-bold text-amber bg-amber/10 border border-amber/20 px-2 py-0.5 rounded-full shrink-0">Upcoming</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
