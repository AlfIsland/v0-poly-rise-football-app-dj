"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useState } from "react"

const NAV = [
  {
    section: "Athletes",
    items: [
      { label: "Training Roster",     href: "/training",              icon: "🏈" },
      { label: "Add Athlete",         href: "/training/new",          icon: "➕" },
      { label: "PR-V Athletes",       href: "/admin/athletes",        icon: "✅" },
      { label: "Add PR-V Seal",       href: "/admin/athletes/new",    icon: "🔖" },
      { label: "Seal Generator",      href: "/admin/seal-generator",  icon: "🛡️" },
    ],
  },
  {
    section: "Parents & Subs",
    items: [
      { label: "Manage Access",       href: "/admin/parents",         icon: "👪" },
      { label: "Subscriber Roster",   href: "/admin/roster",          icon: "📋" },
      { label: "Registrations",       href: "/admin/registrations",   icon: "📝" },
    ],
  },
  {
    section: "Business",
    items: [
      { label: "Camp Manager",        href: "/admin/camps",           icon: "⛺" },
      { label: "Discounts",           href: "/admin/discounts",       icon: "🏷️" },
      { label: "CRM / Leads",         href: "/admin/crm",             icon: "📞" },
    ],
  },
  {
    section: "Public Pages",
    items: [
      { label: "Main Website",        href: "/",                      icon: "🌐", external: true },
      { label: "Plans & Pricing",     href: "/plans",                 icon: "💳", external: true },
      { label: "Program Overview",    href: "/program-overview",      icon: "📄", external: true },
      { label: "Parent Guide",        href: "/parent-guide",          icon: "📖", external: true },
      { label: "Parent Portal",       href: "/parent/portal",         icon: "🔐", external: true },
    ],
  },
]

export default function AdminNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/poly-rise-logo.png" alt="PolyRISE" width={32} height={32} className="object-contain" />
          <div>
            <p className="text-white font-black text-sm leading-tight">PolyRISE</p>
            <p className="text-gray-500 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Dashboard link */}
      <div className="px-3 pt-3">
        <Link href="/admin" onClick={() => setOpen(false)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            pathname === "/admin" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}>
          <span>🏠</span> Dashboard
        </Link>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {NAV.map(section => (
          <div key={section.section}>
            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest px-3 mb-1">{section.section}</p>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={"external" in item && item.external ? "_blank" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-red-950/60 text-red-300 border border-red-800/40"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {"external" in item && item.external && (
                      <span className="text-gray-600 text-xs">↗</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin ID footer */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-xs text-gray-600">polyrisefootball.com/admin</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/poly-rise-logo.png" alt="PolyRISE" width={28} height={28} className="object-contain" />
          <span className="text-white font-black text-sm">Admin</span>
        </Link>
        <button onClick={() => setOpen(!open)}
          className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-[#0d0d12] border-r border-white/10 h-full pt-14 overflow-y-auto">
            {navContent}
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-[#0d0d12] border-r border-white/10 fixed top-0 left-0 h-screen z-30 overflow-y-auto">
        {navContent}
      </aside>
    </>
  )
}
