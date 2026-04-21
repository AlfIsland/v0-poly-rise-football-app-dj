import Link from "next/link"
import LogoutButton from "@/components/logout-button"
import { getAllParents } from "@/lib/parent-store"
import Redis from "ioredis"

async function getStats() {
  try {
    const parents = await getAllParents()
    const pending = parents.filter(p => p.approvalStatus === "pending").length
    const paidTiers = ["elite-recruit", "recruit", "passport", "monthly", "quarterly"]
    const subscribers = parents.filter(p => paidTiers.includes(p.tier)).length

    let athleteCount = 0
    if (process.env.REDIS_URL) {
      const r = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 2, connectTimeout: 4000 })
      const keys = await r.keys("training:athlete:*")
      athleteCount = keys.length
      await r.quit()
    }

    return { pending, subscribers, parents: parents.length, athletes: athleteCount }
  } catch {
    return { pending: 0, subscribers: 0, parents: 0, athletes: 0 }
  }
}

export default async function AdminHomePage() {
  const stats = await getStats()

  const sections = [
    {
      title: "Athletes",
      color: "border-red-700/50",
      headerColor: "bg-red-950/40",
      icon: "🏈",
      links: [
        { label: "Training Roster", desc: "View & manage all athletes", href: "/training", highlight: true },
        { label: "Add New Athlete", desc: "Create a new athlete profile", href: "/training/new" },
        { label: "All Athletes (PR-V + ATP)", desc: "Combined athlete roster", href: "/admin/athletes" },
        { label: "Add PR-V Seal", desc: "Issue a new PR-VERIFIED seal", href: "/admin/athletes/new" },
        { label: "Seal Generator", desc: "Generate PR-V seal certificates", href: "/admin/seal-generator" },
      ],
    },
    {
      title: "Parents & Subscribers",
      color: "border-green-700/50",
      headerColor: "bg-green-950/40",
      icon: "👪",
      links: [
        { label: "Subscriber Roster", desc: "All parents + plans + linked athletes", href: "/admin/roster", highlight: true },
        { label: "Manage Access", desc: "Approve, deny, link athletes", href: "/admin/parents" },
        { label: "Parent Register Page", desc: "Send this to parents to sign up", href: "/parent/register", external: true },
        { label: "Parent Login", desc: "Send this to parents to log in", href: "/parent/login", external: true },
      ],
    },
    {
      title: "Business",
      color: "border-blue-700/50",
      headerColor: "bg-blue-950/40",
      icon: "💼",
      links: [
        { label: "Registrations", desc: "Program sign-up payments", href: "/admin/registrations" },
        { label: "Discounts", desc: "Manage discount codes", href: "/admin/discounts" },
        { label: "CRM", desc: "Contacts & leads", href: "/admin/crm" },
      ],
    },
    {
      title: "Public Pages",
      color: "border-gray-700/50",
      headerColor: "bg-gray-800/40",
      icon: "🌐",
      links: [
        { label: "Main Website", desc: "polyrisefootball.com", href: "/", external: true },
        { label: "Program Overview", desc: "Public program info page", href: "/program-overview", external: true },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/poly-rise-logo.png" alt="PolyRISE" className="h-9 w-auto" />
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">PolyRISE Football · One stop shop</p>
          </div>
        </div>
        <LogoutButton />
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Athletes", value: stats.athletes, color: "text-red-400" },
            { label: "Total Parents", value: stats.parents, color: "text-white" },
            { label: "Paid Subscribers", value: stats.subscribers, color: "text-green-400" },
            { label: "Pending Approval", value: stats.pending, color: stats.pending > 0 ? "text-yellow-400" : "text-gray-500",
              alert: stats.pending > 0 },
          ].map(s => (
            <Link key={s.label} href={s.label === "Pending Approval" ? "/admin/parents" : s.label === "Paid Subscribers" ? "/admin/roster" : "/training"}
              className={`bg-white/5 border ${s.alert ? "border-yellow-600/50" : "border-white/10"} rounded-xl p-4 text-center hover:bg-white/10 transition-colors`}>
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              {s.alert && <div className="text-xs text-yellow-400 font-bold mt-1">Needs action ↗</div>}
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "+ Add Athlete", href: "/training/new", color: "bg-red-600 hover:bg-red-700" },
            { label: "+ Add Session", href: "/training", color: "bg-red-800 hover:bg-red-700" },
            { label: "Approve Parents", href: "/admin/parents", color: "bg-green-700 hover:bg-green-600" },
            { label: "Subscriber Roster", href: "/admin/roster", color: "bg-blue-700 hover:bg-blue-600" },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className={`${a.color} text-white font-bold text-sm text-center py-3 px-4 rounded-xl transition-colors`}>
              {a.label}
            </Link>
          ))}
        </div>

        {/* Section cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {sections.map(section => (
            <div key={section.title} className={`border ${section.color} rounded-2xl overflow-hidden`}>
              <div className={`${section.headerColor} px-5 py-3 flex items-center gap-2 border-b ${section.color}`}>
                <span className="text-lg">{section.icon}</span>
                <p className="font-bold text-white text-sm">{section.title}</p>
              </div>
              <div className="divide-y divide-white/5">
                {section.links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    className={`flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors group ${link.highlight ? "bg-white/5" : ""}`}
                  >
                    <div>
                      <p className={`text-sm font-semibold ${link.highlight ? "text-white" : "text-gray-200"} group-hover:text-white transition-colors`}>
                        {link.label}
                      </p>
                      <p className="text-xs text-gray-500">{link.desc}</p>
                    </div>
                    <span className="text-gray-600 group-hover:text-gray-300 transition-colors text-sm">
                      {link.external ? "↗" : "→"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-700 text-xs pb-4">PolyRISE Football · Admin · polyrisefootball.com</p>
      </main>
    </div>
  )
}
