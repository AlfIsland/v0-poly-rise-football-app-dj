"use client"

import Image from "next/image"

const STEPS = [
  {
    step: "1",
    title: "Create Your Account",
    body: "Go to polyrisefootball.com/parent/register and enter your name, your athlete's name, email address, and create a password.",
    note: null,
    color: "bg-red-600",
  },
  {
    step: "2",
    title: "Wait for Confirmation",
    body: "PolyRISE staff will receive a notification that you registered. You do not need to do anything — just wait for the email.",
    note: "Usually confirmed within 1 business day.",
    color: "bg-red-700",
  },
  {
    step: "3",
    title: "Check Your Email",
    body: "You will receive an email from noreply@polyrisefootball.com with the subject \"Your Athlete Profile Is Live\" — this means your athlete has been linked to your account.",
    note: "Check your spam folder if you don't see it.",
    color: "bg-red-800",
  },
  {
    step: "4",
    title: "Log In",
    body: "Go to polyrisefootball.com/parent/login and sign in with the email and password you created in Step 1.",
    note: "Forgot your password? Use the \"Forgot password?\" link on the login page.",
    color: "bg-gray-800",
  },
  {
    step: "5",
    title: "View Your Athlete's Profile",
    body: "You now have full access to your athlete's Tracking Passport — test results, progress charts, session history, coach notes, and a downloadable PDF progress report.",
    note: null,
    color: "bg-gray-900",
  },
]

export default function ParentGuidePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Print button */}
      <div className="print:hidden bg-gray-100 border-b px-6 py-3 flex items-center justify-between">
        <p className="text-sm text-gray-600">Share this link or print for parents & athletes</p>
        <button
          onClick={() => window.print()}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-10 print:max-w-full print:px-12 print:py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b-4 border-red-600 pb-6">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={60} height={60} className="object-contain" />
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest">PolyRISE Football</p>
              <h1 className="text-3xl font-black text-gray-900 leading-tight">Parent Setup Guide</h1>
              <p className="text-gray-500 text-sm mt-1">Athlete Training Tracking Passport</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400 uppercase tracking-wider">5 easy steps</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">to get started</p>
          </div>
        </div>

        {/* Intro */}
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          Follow these steps to create your parent account and access your athlete&apos;s
          full performance profile, progress charts, and training history on PolyRISE Football.
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.step} className="flex gap-4">
              {/* Step number + connector */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${s.color} text-white font-black text-lg flex items-center justify-center shrink-0`}>
                  {s.step}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-0.5 bg-gray-200 flex-1 mt-2 mb-0 min-h-[24px]" />
                )}
              </div>

              {/* Content */}
              <div className="pb-6 flex-1">
                <h2 className="font-black text-gray-900 text-base mb-1">{s.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
                {s.note && (
                  <p className="text-xs text-gray-400 mt-1.5 italic">💡 {s.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* What you'll see */}
        <div className="bg-gray-950 text-white rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-black text-red-400 uppercase tracking-widest mb-4">What You&apos;ll See Inside the Portal</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "📊", label: "Overview", desc: "Baseline vs. current with % improvement" },
              { icon: "📈", label: "Progress Chart", desc: "Month-by-month growth per drill" },
              { icon: "🏃", label: "Full History", desc: "Every session with dates & notes" },
              { icon: "⬅️➡️", label: "Lateral Analysis", desc: "Left vs. right shuttle split" },
              { icon: "📄", label: "PDF Report", desc: "Downloadable progress report" },
              { icon: "📝", label: "Coach Notes", desc: "Staff observations & goals" },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-2">
                <span className="text-base mt-0.5">{f.icon}</span>
                <div>
                  <p className="font-bold text-white text-xs">{f.label}</p>
                  <p className="text-gray-400 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="border border-gray-200 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Quick Links</h2>
          <div className="space-y-2">
            {[
              { label: "Create Account", url: "polyrisefootball.com/parent/register" },
              { label: "Log In", url: "polyrisefootball.com/parent/login" },
              { label: "Forgot Password", url: "polyrisefootball.com/parent/forgot-password" },
            ].map(l => (
              <div key={l.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{l.label}</span>
                <span className="text-sm font-bold text-red-600">{l.url}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer / contact */}
        <div className="border-t-4 border-red-600 pt-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Need Help?</p>
            <p className="text-gray-700 text-sm font-bold">(817) 658-3300</p>
            <p className="text-gray-500 text-sm">polyrise@polyrisefootball.com</p>
            <p className="text-gray-400 text-xs mt-3">PolyRISE Football · Dripping Springs, TX</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 mb-1">Also see:</p>
            <p className="text-xs font-bold text-red-600">polyrisefootball.com</p>
            <p className="text-xs text-gray-400">/training-passport</p>
            <p className="text-xs text-gray-400 mt-1">for full program details</p>
          </div>
        </div>

      </div>

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
