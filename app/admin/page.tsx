import Link from "next/link"
import LogoutButton from "@/components/logout-button"
import { getAllParents } from "@/lib/parent-store"
import Redis from "ioredis"

interface Athlete {
  id: string
  name: string
  position?: string
  grade?: string
  school?: string
  sessions: { date: string; fortyYard?: number; notes?: string }[]
  joinedAt: string
}

async function getStats() {
  try {
    const parents = await getAllParents()
    const pending  = parents.filter(p => p.approvalStatus === "pending").length
    const elite    = parents.filter(p => p.tier === "elite-recruit" && p.subscriptionStatus !== "canceled").length
    const recruit  = parents.filter(p => p.tier === "recruit"       && p.subscriptionStatus !== "canceled").length
    const passport = parents.filter(p => p.tier === "passport"      && p.subscriptionStatus !== "canceled").length
    const program  = parents.filter(p => p.tier === "program"       && p.approvalStatus === "approved").length
    const totalSubs = elite + recruit + passport

    // Revenue estimate
    const monthlyRevenue = (elite * 49.99) + (recruit * 29.99) + (passport * 9.99)

    let athleteCount = 0
    let totalSessions = 0
    let sessionsThisWeek = 0
    let recentActivity: { athleteId: string; name: string; date: string; sessionNum: number }[] = []
    let athletes: Athlete[] = []

    if (process.env.REDIS_URL) {
      const r = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 2, connectTimeout: 4000 })
      const ids = await r.smembers("training:roster")
      athleteCount = ids.length

      if (ids.length) {
        const values = await r.mget(...ids.map(id => `training:athlete:${id}`))
        athletes = values.filter(Boolean).map(v => JSON.parse(v!))

        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        for (const a of athletes) {
          const sessions = a.sessions ?? []
          totalSessions += sessions.length
          for (const s of sessions) {
            if (new Date(s.date) >= oneWeekAgo) sessionsThisWeek++
          }
          if (sessions.length > 0) {
            const last = sessions[sessions.length - 1]
            recentActivity.push({
              athleteId: a.id,
              name: a.name,
              date: last.date,
              sessionNum: sessions.length,
            })
          }
        }

        // Sort recent by date desc, take top 6
        recentActivity = recentActivity
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 6)
      }

      await r.quit()
    }

    return {
      pending, elite, recruit, passport, program,
      totalSubs, monthlyRevenue,
      parents: parents.length,
      athletes: athleteCount,
      totalSessions, sessionsThisWeek,
      recentActivity,
    }
  } catch {
    return {
      pending: 0, elite: 0, recruit: 0, passport: 0, program: 0,
      totalSubs: 0, monthlyRevenue: 0,
      parents: 0, athletes: 0,
      totalSessions: 0, sessionsThisWeek: 0,
      recentActivity: [],
    }
  }
}

export default async function AdminHomePage() {
  const s = await getStats()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Dashboard</h1>
        <LogoutButton />
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        {/* Pending alert */}
        {s.pending > 0 && (
          <Link href="/admin/parents"
            className="flex items-center justify-between bg-yellow-950/60 border border-yellow-700/50 rounded-xl px-5 py-3 hover:bg-yellow-950 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-yellow-400 text-lg">⚠️</span>
              <div>
                <p className="text-yellow-300 font-bold text-sm">{s.pending} parent{s.pending !== 1 ? "s" : ""} waiting for approval</p>
                <p className="text-yellow-600 text-xs">Tap to review and approve access</p>
              </div>
            </div>
            <span className="text-yellow-600 font-bold">→</span>
          </Link>
        )}

        {/* Top stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/training"
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors">
            <div className="text-3xl font-black text-red-400">{s.athletes}</div>
            <div className="text-xs text-gray-500 mt-1">Total Athletes</div>
          </Link>
          <Link href="/admin/roster"
            className="bg-white/5 border border-green-700/30 rounded-xl p-4 text-center hover:bg-white/10 transition-colors">
            <div className="text-3xl font-black text-green-400">{s.totalSubs}</div>
            <div className="text-xs text-gray-500 mt-1">Active Subscribers</div>
          </Link>
          <div className="bg-white/5 border border-blue-700/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-blue-400">{s.totalSessions}</div>
            <div className="text-xs text-gray-500 mt-1">Total Sessions</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-white">{s.sessionsThisWeek}</div>
            <div className="text-xs text-gray-500 mt-1">Sessions This Week</div>
          </div>
        </div>

        {/* Revenue + Tier breakdown */}
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Revenue */}
          <div className="bg-white/5 border border-green-700/30 rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Monthly Revenue (Est.)</p>
            <p className="text-4xl font-black text-green-400">
              ${s.monthlyRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-600 mt-1">Based on active paid subscribers</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-400 font-semibold">Elite Recruit × {s.elite}</span>
                <span className="text-gray-400">${(s.elite * 49.99).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-400 font-semibold">Recruit × {s.recruit}</span>
                <span className="text-gray-400">${(s.recruit * 29.99).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300 font-semibold">Passport × {s.passport}</span>
                <span className="text-gray-400">${(s.passport * 9.99).toFixed(2)}</span>
              </div>
              {s.program > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-400 font-semibold">Program Members × {s.program}</span>
                  <span className="text-gray-500">Free</span>
                </div>
              )}
            </div>
          </div>

          {/* Subscriber breakdown visual */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Subscriber Breakdown</p>
            <div className="space-y-3">
              {[
                { label: "Elite Recruit", count: s.elite, total: s.totalSubs || 1, color: "bg-yellow-500" },
                { label: "Recruit",       count: s.recruit, total: s.totalSubs || 1, color: "bg-red-500" },
                { label: "Passport",      count: s.passport, total: s.totalSubs || 1, color: "bg-gray-500" },
              ].map(t => (
                <div key={t.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{t.label}</span>
                    <span className="text-white font-bold">{t.count}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${t.color} rounded-full transition-all`}
                      style={{ width: `${Math.round((t.count / t.total) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-500">Total Parents Registered</span>
              <span className="text-white font-bold">{s.parents}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {s.recentActivity.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <p className="text-sm font-bold text-white">Recent Sessions</p>
              <Link href="/training" className="text-xs text-red-400 hover:text-red-300">View all →</Link>
            </div>
            <div className="divide-y divide-white/5">
              {s.recentActivity.map(a => (
                <Link key={a.athleteId} href={`/training/${a.athleteId}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-900/50 border border-red-700/50 flex items-center justify-center text-xs font-black text-red-400">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-red-300 transition-colors">{a.name}</p>
                      <p className="text-xs text-gray-500">Session #{a.sessionNum} · {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                  <span className="text-gray-600 group-hover:text-gray-300 text-sm transition-colors">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "+ Add Athlete",    href: "/training/new",    color: "bg-red-600 hover:bg-red-700" },
            { label: "+ Add Session",    href: "/training",         color: "bg-red-800 hover:bg-red-700" },
            { label: "Approve Parents",  href: "/admin/parents",    color: "bg-green-700 hover:bg-green-600" },
            { label: "Subscriber Roster",href: "/admin/roster",     color: "bg-blue-700 hover:bg-blue-600" },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className={`${a.color} text-white font-bold text-sm text-center py-3 px-4 rounded-xl transition-colors`}>
              {a.label}
            </Link>
          ))}
        </div>

        {/* Nav sections */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Athletes", icon: "🏈", color: "border-red-700/50", headerColor: "bg-red-950/40",
              links: [
                { label: "Training Roster",          desc: "View & manage all athletes",        href: "/training",              highlight: true },
                { label: "Add New Athlete",           desc: "Create a new athlete profile",      href: "/training/new" },
                { label: "All Athletes (PR-V + ATP)", desc: "Combined athlete roster",           href: "/admin/athletes" },
                { label: "Add PR-V Seal",             desc: "Issue a new PR-VERIFIED seal",      href: "/admin/athletes/new" },
                { label: "Seal Generator",            desc: "Generate PR-V seal certificates",   href: "/admin/seal-generator" },
              ],
            },
            {
              title: "Parents & Subscribers", icon: "👪", color: "border-green-700/50", headerColor: "bg-green-950/40",
              links: [
                { label: "Subscriber Roster",   desc: "All parents + plans + linked athletes", href: "/admin/roster",          highlight: true },
                { label: "Manage Access",        desc: "Approve, deny, link athletes",          href: "/admin/parents" },
                { label: "Parent Register Page", desc: "Send to parents to sign up",            href: "/parent/register",       external: true },
                { label: "Plans Page",           desc: "Show parents tier options",             href: "/plans",                 external: true },
              ],
            },
            {
              title: "Business", icon: "💼", color: "border-blue-700/50", headerColor: "bg-blue-950/40",
              links: [
                { label: "Registrations", desc: "Program sign-up payments",  href: "/admin/registrations" },
                { label: "Camp Manager",  desc: "Add & manage camps",         href: "/admin/camps",         highlight: true },
                { label: "Discounts",     desc: "Manage discount codes",      href: "/admin/discounts" },
                { label: "CRM",           desc: "Contacts & leads",           href: "/admin/crm" },
              ],
            },
            {
              title: "Public Pages", icon: "🌐", color: "border-gray-700/50", headerColor: "bg-gray-800/40",
              links: [
                { label: "Main Website",      desc: "polyrisefootball.com",       href: "/",                 external: true },
                { label: "Program Overview",  desc: "Public program info page",   href: "/program-overview", external: true },
                { label: "Plans & Pricing",   desc: "Parent-facing pricing page", href: "/plans",            external: true },
                { label: "Parent Guide",      desc: "How-to guide for parents",   href: "/parent-guide",     external: true },
              ],
            },
          ].map(section => (
            <div key={section.title} className={`border ${section.color} rounded-2xl overflow-hidden`}>
              <div className={`${section.headerColor} px-5 py-3 flex items-center gap-2 border-b ${section.color}`}>
                <span className="text-lg">{section.icon}</span>
                <p className="font-bold text-white text-sm">{section.title}</p>
              </div>
              <div className="divide-y divide-white/5">
                {section.links.map(link => (
                  <Link key={link.href} href={link.href}
                    target={"external" in link && link.external ? "_blank" : undefined}
                    className={`flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors group ${"highlight" in link && link.highlight ? "bg-white/5" : ""}`}>
                    <div>
                      <p className={`text-sm font-semibold ${"highlight" in link && link.highlight ? "text-white" : "text-gray-200"} group-hover:text-white transition-colors`}>
                        {link.label}
                      </p>
                      <p className="text-xs text-gray-500">{link.desc}</p>
                    </div>
                    <span className="text-gray-600 group-hover:text-gray-300 transition-colors text-sm">
                      {"external" in link && link.external ? "↗" : "→"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-700 text-xs pb-4">PolyRISE Athletix · Admin · polyrisefootball.com</p>
      </main>
    </div>
  )
}
