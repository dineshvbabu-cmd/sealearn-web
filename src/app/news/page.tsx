import Image from "next/image";
import { newsItems } from "@/lib/data";
import { Calendar, MapPin } from "lucide-react";

const upcomingEvents = [
  { date: "15", month: "APR", title: "June 2025 Intake Orientation", time: "9:00 AM", venue: "Main Auditorium", color: "bg-navy" },
  { date: "07", month: "MAY", title: "Sea Day Celebration 2025", time: "All day", venue: "Apapa Port & Campus", color: "bg-ocean" },
  { date: "25", month: "SEP", title: "World Maritime Day 2025", time: "All day", venue: "SeaLearn Campus, Lagos", color: "bg-teal" },
  { date: "10", month: "OCT", title: "September Intake Graduation", time: "10:00 AM", venue: "Main Auditorium", color: "bg-jade" },
];

export default function NewsPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-navy via-ocean to-teal text-white px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-gold/20 border border-gold/35 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Module 12 · Public
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold mb-3">News & Events</h1>
          <p className="text-white/55 text-base max-w-xl">
            Institutional news, NIMASA updates, upcoming events and media from SeaLearn Nigeria.
          </p>
        </div>
      </div>
      <div className="divbar" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* News articles */}
          <div className="lg:col-span-2">
            <h2 className="font-cinzel text-xl text-navy font-bold mb-6">Latest News</h2>
            <div className="flex flex-col gap-6">
              {newsItems.map((item) => (
                <article
                  key={item.slug}
                  className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col sm:flex-row gap-0 hover:shadow-md transition-shadow"
                >
                  <div className="relative h-44 sm:h-auto sm:w-52 shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wide ${item.categoryColor}`}>
                        {item.categoryLabel}
                      </span>
                      <h3 className="font-bold text-navy text-base leading-snug mt-1 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted text-sm leading-relaxed line-clamp-3">
                        {item.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs text-muted">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} />
                        {item.publishedAt}
                      </div>
                      {item.eventVenue && (
                        <div className="flex items-center gap-1">
                          <MapPin size={11} />
                          {item.eventVenue}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar — upcoming events */}
          <div>
            <h2 className="font-cinzel text-xl text-navy font-bold mb-6">Upcoming Events</h2>
            <div className="flex flex-col gap-3">
              {upcomingEvents.map((e) => (
                <div
                  key={e.title}
                  className="bg-white rounded-xl border border-border shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={`${e.color} text-white rounded-xl px-3 py-2 text-center shrink-0 min-w-[52px]`}>
                    <div className="text-lg font-bold leading-none">{e.date}</div>
                    <div className="text-[10px] opacity-60 uppercase mt-0.5">{e.month}</div>
                  </div>
                  <div>
                    <div className="font-bold text-navy text-sm leading-tight">{e.title}</div>
                    <div className="text-muted text-xs mt-0.5">{e.time} · {e.venue}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter sign-up */}
            <div className="mt-6 bg-navy rounded-xl p-5">
              <h3 className="font-cinzel text-gold text-base font-bold mb-2">Stay Updated</h3>
              <p className="text-white/50 text-xs mb-4">
                Get NIMASA updates, new intake dates and events delivered to your inbox.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/30 outline-none focus:border-gold mb-2"
              />
              <button className="w-full bg-gold text-navy font-bold text-sm py-2.5 rounded-lg hover:bg-yellow-400 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Contact card */}
            <div className="mt-4 bg-surface rounded-xl border border-border p-4 text-sm">
              <div className="font-bold text-navy mb-2">Media & Press Enquiries</div>
              <div className="text-muted text-xs leading-relaxed">
                For press releases, interview requests or event coverage, please contact our
                communications team.
              </div>
              <div className="mt-3 text-xs">
                <div className="text-ocean font-semibold">+234 701 234 5678</div>
                <div className="text-muted">info@sealearn.edu.ng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
