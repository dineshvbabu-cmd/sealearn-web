import Image from "next/image";
import { newsItems as staticNews } from "@/lib/data";
import { Calendar, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSection } from "@/lib/site-config";
import SubscribeForm from "@/components/SubscribeForm";

const categoryColorMap: Record<string, string> = {
  achievement: "text-teal",
  event: "text-ocean",
  admissions: "text-jade",
  news: "text-amber",
  announcement: "text-steel",
};

const eventColors = ["bg-navy", "bg-ocean", "bg-teal", "bg-jade", "bg-steel", "bg-amber"];

export default async function NewsPage() {
  const [cfg, postsRaw, eventsRaw] = await Promise.all([
    getSiteSection("news"),
    prisma.post.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true, excerpt: true, category: true, publishedAt: true, imageUrl: true, eventVenue: true },
    }).catch(() => []),
    // Upcoming events = posts with category 'event' and a future eventDate
    prisma.post.findMany({
      where: { category: "event", publishedAt: { not: null }, eventDate: { gte: new Date() } },
      orderBy: { eventDate: "asc" },
      take: 6,
      select: { id: true, title: true, eventDate: true, eventVenue: true },
    }).catch(() => []),
  ]);

  const newsToShow = postsRaw.length > 0
    ? postsRaw.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? "",
        categoryLabel: p.category.charAt(0).toUpperCase() + p.category.slice(1),
        categoryColor: categoryColorMap[p.category] ?? "text-muted",
        publishedAt: p.publishedAt
          ? p.publishedAt.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })
          : "",
        imageUrl: p.imageUrl ?? "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=600&q=80",
        eventVenue: p.eventVenue,
      }))
    : staticNews;

  // Map DB events to display shape; fall back to static sample if none exist yet
  const upcomingEvents = eventsRaw.length > 0
    ? eventsRaw.map((e, i) => ({
        date: e.eventDate ? String(e.eventDate.getDate()).padStart(2, "0") : "—",
        month: e.eventDate ? e.eventDate.toLocaleString("en-NG", { month: "short" }).toUpperCase() : "",
        title: e.title,
        time: "",
        venue: e.eventVenue ?? "",
        color: eventColors[i % eventColors.length],
      }))
    : [
        { date: "15", month: "APR", title: "June 2025 Intake Orientation", time: "9:00 AM", venue: "Main Auditorium", color: "bg-navy" },
        { date: "07", month: "MAY", title: "Sea Day Celebration 2025", time: "All day", venue: "Apapa Port & Campus", color: "bg-ocean" },
        { date: "25", month: "SEP", title: "World Maritime Day 2025", time: "All day", venue: "SeaLearn Campus, Lagos", color: "bg-teal" },
        { date: "10", month: "OCT", title: "September Intake Graduation", time: "10:00 AM", venue: "Main Auditorium", color: "bg-jade" },
      ];

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-navy via-ocean to-teal text-white px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-gold/20 border border-gold/35 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Latest Updates
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold mb-3">News &amp; Events</h1>
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
              {newsToShow.map((item) => (
                <article
                  key={item.slug}
                  className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col sm:flex-row gap-0 hover:shadow-md transition-shadow"
                >
                  <div className="relative h-44 sm:h-auto sm:w-52 shrink-0">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wide ${item.categoryColor}`}>
                        {item.categoryLabel}
                      </span>
                      <h3 className="font-bold text-navy text-base leading-snug mt-1 mb-2">{item.title}</h3>
                      <p className="text-muted text-sm leading-relaxed line-clamp-3">{item.excerpt}</p>
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

          {/* Sidebar */}
          <div>
            <h2 className="font-cinzel text-xl text-navy font-bold mb-6">Upcoming Events</h2>
            <div className="flex flex-col gap-3">
              {upcomingEvents.map((e, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-border shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={`${e.color} text-white rounded-xl px-3 py-2 text-center shrink-0 min-w-[52px]`}>
                    <div className="text-lg font-bold leading-none">{e.date}</div>
                    <div className="text-[10px] opacity-60 uppercase mt-0.5">{e.month}</div>
                  </div>
                  <div>
                    <div className="font-bold text-navy text-sm leading-tight">{e.title}</div>
                    <div className="text-muted text-xs mt-0.5">
                      {[e.time, e.venue].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter sign-up */}
            <div className="mt-6 bg-navy rounded-xl p-5">
              <h3 className="font-cinzel text-gold text-base font-bold mb-2">{cfg.subscribe_title}</h3>
              <p className="text-white/50 text-xs mb-4">{cfg.subscribe_body}</p>
              <SubscribeForm />
            </div>

            {/* Press contact */}
            <div className="mt-4 bg-surface rounded-xl border border-border p-4 text-sm">
              <div className="font-bold text-navy mb-2">{cfg.press_title}</div>
              <div className="text-muted text-xs leading-relaxed">{cfg.press_body}</div>
              <div className="mt-3 text-xs space-y-1">
                {cfg.press_phone && (
                  <div>
                    <a href={`tel:${cfg.press_phone.replace(/\s/g, "")}`} className="text-ocean font-semibold hover:underline">
                      {cfg.press_phone}
                    </a>
                  </div>
                )}
                {cfg.press_email && (
                  <div>
                    <a href={`mailto:${cfg.press_email}`} className="text-muted hover:text-ocean transition-colors">
                      {cfg.press_email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
