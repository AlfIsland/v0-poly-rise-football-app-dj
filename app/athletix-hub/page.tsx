"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const ANNOUNCEMENTS = [
  {
    id: 1,
    pinned: true,
    tag: "Community",
    tagColor: "bg-yellow-900 text-yellow-300",
    date: "Dec 10",
    title: "Toys 4 Tots Drive",
    body: "PolyRISE Athletix will have Toys 4 Tots boxes at 133 Glosson Ranch Rd. Additional drop-off location pending — check back for updates.",
  },
  {
    id: 2,
    pinned: false,
    tag: "Training",
    tagColor: "bg-red-900 text-red-300",
    date: "Dec 8",
    title: "December Combine Camp — Registration Open",
    body: "The next PR-VERIFIED Combine Camp is scheduled. Lock in your spot early — limited to 20 athletes. Earn your PR-VERIFIED seal and update your recruiting profile.",
  },
  {
    id: 3,
    pinned: false,
    tag: "Schedule",
    tagColor: "bg-blue-900 text-blue-300",
    date: "Dec 5",
    title: "Holiday Schedule — No Sessions Dec 23–Jan 1",
    body: "PolyRISE sessions will pause December 23rd through January 1st for the holiday break. Regular programming resumes January 2nd. Happy holidays from all the coaches!",
  },
  {
    id: 4,
    pinned: false,
    tag: "Recruiting",
    tagColor: "bg-purple-900 text-purple-300",
    date: "Dec 2",
    title: "Monthly X (Twitter) Spotlight Posted",
    body: "This month's recruiting spotlight has been posted to @PolyRISEFB. Recruit plan members — check your email for confirmation your profile was featured. College coaches are watching.",
  },
]

const EVENTS = [
  { date: "Dec 14", day: "Sat", title: "PR-VERIFIED Combine Camp", time: "9:00 AM", location: "Dripping Springs, TX", tag: "Camp", color: "border-red-600" },
  { date: "Dec 19", day: "Thu", title: "Player Development Session", time: "4:30 PM", location: "PolyRISE Training Facility", tag: "Training", color: "border-gray-600" },
  { date: "Dec 20", day: "Fri", title: "Toys 4 Tots Deadline", time: "All Day", location: "Bring to Session", tag: "Community", color: "border-yellow-600" },
  { date: "Jan 2",  day: "Thu", title: "Programs Resume", time: "Regular Schedule", location: "PolyRISE Training Facility", tag: "Schedule", color: "border-blue-600" },
]

const PLAYER_QUICK_LINKS = [
  { icon: "📊", label: "My Training Passport", href: "/training-passport", desc: "View metrics & session history" },
  { icon: "🏅", label: "My Athlete Profile", href: "/athlete/portal", desc: "Recruiting profile & PR-VERIFIED seal" },
  { icon: "📅", label: "Register for Camp", href: "/register?program=combine", desc: "Upcoming combine & events" },
  { icon: "🎬", label: "Hudl Film", href: "https://hudl.com", desc: "Link your game film" },
]

const PARENT_QUICK_LINKS = [
  { icon: "👤", label: "Parent Portal", href: "/parent/portal", desc: "Athlete progress & reports" },
  { icon: "💳", label: "Billing & Plans", href: "/plans", desc: "Manage your subscription" },
  { icon: "📝", label: "Register / Add Program", href: "/register", desc: "Enroll in camps or programs" },
  { icon: "📬", label: "Contact a Coach", href: "mailto:polyrise@polyrisefootball.com", desc: "polyrise@polyrisefootball.com" },
]

export default function AthletixHubPage() {
  const [tab, setTab] = useState<"player" | "parent">("player")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const pinned = ANNOUNCEMENTS.filter(a => a.pinned)
  const general = ANNOUNCEMENTS.filter(a => !a.pinned)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={36} height={36} className="h-8 w-auto" />
            <div className="leading-none">
              <span className="font-black text-white text-sm tracking-wide">PolyRISE</span>
              <span className="font-black text-yellow-400 text-sm tracking-wide ml-1">Athletix</span>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/athlete/login" className="text-gray-400 hover:text-white transition-colors">Athlete Login</Link>
            <span className="text-gray-700">·</span>
            <Link href="/parent/login" className="text-gray-400 hover:text-white transition-colors">Parent Login</Link>
          </div>
        </div>
      </header>

      {/* Hero strip */}
      <div className="bg-gradient-to-b from-yellow-950/30 to-transparent border-b border-yellow-900/20 py-8 px-4 text-center">
        <p className="text-yellow-400 font-black text-xs uppercase tracking-[0.3em] mb-2">PolyRISE Football</p>
        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
          Athletix <span className="text-yellow-400">Hub</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2">Player & Parent Resource Center · Dripping Springs, TX</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Tab bar */}
        <div className="flex gap-2 bg-gray-900 p-1 rounded-xl border border-gray-800 w-fit">
          {(["player", "parent"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-lg text-sm font-black tracking-wide transition-all capitalize ${
                tab === t
                  ? t === "player"
                    ? "bg-red-600 text-white shadow"
                    : "bg-yellow-500 text-black shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t === "player" ? "⚡ Player Hub" : "👨‍👩‍👦 Parent Hub"}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left column — Announcements */}
          <div className="lg:col-span-2 space-y-5">

            {/* Pinned */}
            {pinned.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-400 text-sm">📌</span>
                  <p className="text-xs font-black text-yellow-400 uppercase tracking-widest">Pinned</p>
                </div>
                <div className="space-y-3">
                  {pinned.map(a => (
                    <AnnouncementCard key={a.id} a={a} expanded={expandedId === a.id} onToggle={() => setExpandedId(expandedId === a.id ? null : a.id)} />
                  ))}
                </div>
              </section>
            )}

            {/* General */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-500 text-sm">📣</span>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">General</p>
              </div>
              <div className="space-y-3">
                {general.map(a => (
                  <AnnouncementCard key={a.id} a={a} expanded={expandedId === a.id} onToggle={() => setExpandedId(expandedId === a.id ? null : a.id)} />
                ))}
              </div>
            </section>

            {/* Quick Links — tab-dependent */}
            <section>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                {tab === "player" ? "⚡ Player Quick Links" : "👨‍👩‍👦 Parent Quick Links"}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {(tab === "player" ? PLAYER_QUICK_LINKS : PARENT_QUICK_LINKS).map(link => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 flex items-start gap-3 transition-colors group"
                  >
                    <span className="text-xl mt-0.5">{link.icon}</span>
                    <div>
                      <p className="text-white font-bold text-sm group-hover:text-red-400 transition-colors">{link.label}</p>
                      <p className="text-gray-500 text-xs">{link.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </div>

          {/* Right column — Events + Contact */}
          <div className="space-y-5">

            {/* Upcoming Events */}
            <section className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Upcoming Events</p>
              </div>
              <div className="divide-y divide-gray-800">
                {EVENTS.map(e => (
                  <div key={e.title} className={`px-4 py-3 flex gap-3 border-l-2 ${e.color}`}>
                    <div className="text-center min-w-[40px]">
                      <p className="text-white font-black text-sm leading-none">{e.date.split(" ")[1]}</p>
                      <p className="text-gray-500 text-xs uppercase">{e.date.split(" ")[0]}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold leading-snug">{e.title}</p>
                      <p className="text-gray-500 text-xs">{e.time}</p>
                      <p className="text-gray-600 text-xs truncate">{e.location}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-800">
                <Link href="/register" className="block w-full text-center text-xs font-bold text-red-400 hover:text-red-300 transition-colors">
                  Register for an Event →
                </Link>
              </div>
            </section>

            {/* Tab-specific info panel */}
            {tab === "player" ? (
              <section className="bg-gray-900 rounded-2xl border border-gray-800 p-4 space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Development</p>
                <div className="space-y-2">
                  {[
                    { label: "Training Passport", action: "View", href: "/training-passport", color: "text-blue-400" },
                    { label: "Athlete Profile", action: "View", href: "/athlete/portal", color: "text-red-400" },
                    { label: "Combine Camp", action: "Register", href: "/register?program=combine", color: "text-green-400" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <p className="text-gray-300 text-xs">{item.label}</p>
                      <Link href={item.href} className={`text-xs font-bold ${item.color} hover:underline`}>{item.action} →</Link>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="bg-gray-900 rounded-2xl border border-gray-800 p-4 space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Parent Resources</p>
                <div className="space-y-2">
                  {[
                    { label: "View Plans & Pricing", action: "See Plans", href: "/plans", color: "text-yellow-400" },
                    { label: "Parent Portal Login", action: "Log In", href: "/parent/login", color: "text-red-400" },
                    { label: "Register for Program", action: "Register", href: "/register", color: "text-green-400" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <p className="text-gray-300 text-xs">{item.label}</p>
                      <Link href={item.href} className={`text-xs font-bold ${item.color} hover:underline`}>{item.action} →</Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Coach Contact */}
            <section className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Reach the Coaches</p>
              <div className="space-y-2">
                <div>
                  <p className="text-white text-xs font-bold">PolyRISE Staff</p>
                  <a href="mailto:polyrise@polyrisefootball.com" className="text-xs text-red-400 hover:text-red-300">polyrise@polyrisefootball.com</a>
                  <p className="text-xs text-gray-500 mt-0.5">(817) 658-3300</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-8 px-4 text-center space-y-2">
        <p className="text-gray-600 text-xs">PolyRISE Football · Dripping Springs, TX · polyrisefootball.com</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/terms" className="text-gray-700 hover:text-gray-500 text-xs underline">Terms</Link>
          <Link href="/privacy" className="text-gray-700 hover:text-gray-500 text-xs underline">Privacy</Link>
          <Link href="/plans" className="text-gray-700 hover:text-gray-500 text-xs underline">Plans</Link>
        </div>
      </footer>

    </div>
  )
}

function AnnouncementCard({
  a,
  expanded,
  onToggle,
}: {
  a: (typeof ANNOUNCEMENTS)[0]
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`bg-gray-900 rounded-xl border transition-colors cursor-pointer ${
        a.pinned ? "border-yellow-800/60 hover:border-yellow-700" : "border-gray-800 hover:border-gray-700"
      }`}
      onClick={onToggle}
    >
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.tagColor}`}>{a.tag}</span>
            <span className="text-gray-600 text-xs">{a.date}</span>
            {a.pinned && <span className="text-yellow-500 text-xs">📌</span>}
          </div>
          <p className="text-white font-bold text-sm leading-snug">{a.title}</p>
          {expanded && (
            <p className="text-gray-400 text-xs leading-relaxed mt-2">{a.body}</p>
          )}
        </div>
        <span className="text-gray-600 text-xs mt-1 shrink-0">{expanded ? "▲" : "▼"}</span>
      </div>
    </div>
  )
}
