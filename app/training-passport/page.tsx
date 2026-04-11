"use client"

import Image from "next/image"

export default function TrainingPassportPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Print button (hidden on print) ── */}
      <div className="print:hidden bg-gray-100 border-b px-6 py-3 flex items-center justify-between">
        <p className="text-sm text-gray-600">Share this link or print for parents & athletes</p>
        <button
          onClick={() => window.print()}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
        >
          Print / Save as PDF
        </button>
      </div>

      {/* ── Flier ── */}
      <div className="max-w-2xl mx-auto px-8 py-10 print:max-w-full print:px-12 print:py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b-4 border-red-600 pb-6">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={60} height={60} className="object-contain" />
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest">PolyRISE Football</p>
              <h1 className="text-3xl font-black text-gray-900 leading-tight">Athlete Training</h1>
              <h1 className="text-3xl font-black text-red-600 leading-tight">Tracking Passport</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Your athlete.</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Your data.</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Your progress.</p>
          </div>
        </div>

        {/* Intro */}
        <div className="mb-8">
          <p className="text-gray-700 text-base leading-relaxed">
            Every athlete we train at PolyRISE Football receives a <strong>personal digital Tracking Passport</strong> —
            a complete performance record that documents their journey from day one.
            Parents can log in anytime to see exactly how their athlete is developing.
          </p>
        </div>

        {/* What's tracked */}
        <div className="mb-8">
          <h2 className="text-sm font-black text-red-600 uppercase tracking-widest mb-4">What We Track</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "⚡", label: "40-Yard Dash", desc: "Speed off the line" },
              { icon: "🔀", label: "5-10-5 Shuttle", desc: "Lateral quickness + L/R split" },
              { icon: "📐", label: "3-Cone / L-Drill", desc: "Change of direction" },
              { icon: "🦘", label: "Vertical Jump", desc: "Explosive power" },
              { icon: "📏", label: "Broad Jump", desc: "Horizontal power" },
              { icon: "💪", label: "Bench Press", desc: "Upper body strength" },
              { icon: "⚖️", label: "Body Weight", desc: "Tracked over time" },
              { icon: "📝", label: "Coach Notes", desc: "Session observations" },
            ].map(m => (
              <div key={m.label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="text-xl">{m.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{m.label}</p>
                  <p className="text-gray-500 text-xs">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What parents see */}
        <div className="mb-8 bg-gray-950 text-white rounded-2xl p-6">
          <h2 className="text-sm font-black text-red-400 uppercase tracking-widest mb-4">What Parents See</h2>
          <div className="space-y-3">
            {[
              { icon: "📊", title: "Progress Overview", desc: "Baseline vs. current measurements with % improvement for every drill" },
              { icon: "📈", title: "Progress Chart", desc: "Month-by-month line chart showing growth across all metrics" },
              { icon: "🏃", title: "Full Session History", desc: "Every test session your athlete has completed with dates and notes" },
              { icon: "⬅️➡️", title: "Lateral Speed Analysis", desc: "Left vs. right shuttle comparison to identify and correct imbalances" },
              { icon: "📄", title: "Progress Report (PDF)", desc: "Downloadable report with full training history and coach notes" },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{f.icon}</span>
                <div>
                  <p className="font-bold text-white text-sm">{f.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-8">
          <h2 className="text-sm font-black text-red-600 uppercase tracking-widest mb-4">How to Access Your Passport</h2>
          <div className="flex gap-0">
            {[
              { step: "1", title: "Create Your Account", desc: "Register at polyrisefootball.com/parent/register" },
              { step: "2", title: "We Link Your Athlete", desc: "PolyRISE staff connects your account to your athlete's profile" },
              { step: "3", title: "View Anytime", desc: "Log in at polyrisefootball.com/parent/login" },
            ].map((s, i) => (
              <div key={s.step} className="flex-1 relative">
                {i < 2 && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 bg-red-200 z-0" />
                )}
                <div className="relative z-10 flex flex-col items-center text-center px-2">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white font-black text-lg flex items-center justify-center mb-2">
                    {s.step}
                  </div>
                  <p className="font-bold text-gray-900 text-xs mb-1">{s.title}</p>
                  <p className="text-gray-500 text-xs leading-tight">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription note */}
        <div className="mb-8 border border-red-200 bg-red-50 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl">🔐</span>
          <div>
            <p className="font-bold text-gray-900 text-sm">Portal Access</p>
            <p className="text-gray-600 text-xs leading-relaxed">
              The Athlete Tracking Passport is available to PolyRISE program members and subscribers.
              Monthly access starts at <strong>$9.99/month</strong>.
              PolyRISE program members receive access as part of their enrollment.
            </p>
          </div>
        </div>

        {/* CTA + Contact */}
        <div className="border-t-4 border-red-600 pt-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Get Started Today</p>
            <p className="font-bold text-gray-900 text-base">polyrisefootball.com/parent/register</p>
            <p className="text-gray-500 text-sm mt-3">(817) 658-3300</p>
            <p className="text-gray-500 text-sm">polyrise@polyrisefootball.com</p>
          </div>
          <div className="text-right shrink-0">
            <div className="w-24 h-24 bg-gray-900 rounded-xl flex items-center justify-center">
              {/* QR code placeholder — scan goes to register page */}
              <div className="text-center">
                <p className="text-white text-xs font-bold leading-tight">SCAN</p>
                <p className="text-white text-xs font-bold leading-tight">TO</p>
                <p className="text-red-400 text-xs font-bold leading-tight">REGISTER</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">polyrisefootball.com</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            PolyRISE Football · Dripping Springs, TX · polyrisefootball.com · (817) 658-3300
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Developing athletes through data-driven training and measurable progress.
          </p>
        </div>

      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white; }
          @page { margin: 0.5in; size: letter portrait; }
        }
      `}</style>
    </div>
  )
}
