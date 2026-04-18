"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import QRCode from "qrcode"

const STEPS = [
  {
    step: "1",
    title: "Go to the Registration Page",
    body: "Open your phone or computer and go to polyrisefootball.com/parent/register — or scan the QR code on this sheet.",
    note: null,
    color: "bg-red-600",
  },
  {
    step: "2",
    title: "Choose Your Plan",
    body: "Select your plan: Monthly ($9.99/mo), Quarterly ($24.99), or PolyRISE Program Member (free — included with your program enrollment).",
    note: "If your athlete is enrolled in a PolyRISE program, select \"Program Member.\"",
    color: "bg-red-700",
  },
  {
    step: "3",
    title: "Create Your Account",
    body: "Enter your name, your athlete's full name, and your email and password. If you have your athlete's ID (TRN-XXXX), enter it in the Athlete ID field — this links your account instantly.",
    note: "Athlete ID is optional but speeds up the process. Ask your coach if you don't have it.",
    color: "bg-red-800",
  },
  {
    step: "4",
    title: "Wait for Confirmation Email",
    body: "PolyRISE staff will verify your account and link your athlete's profile. You will receive an email from noreply@polyrisefootball.com once it's ready.",
    note: "Usually confirmed within 1 business day. Check your spam folder if you don't see it.",
    color: "bg-gray-700",
  },
  {
    step: "5",
    title: "Log In & View Your Athlete",
    body: "Go to polyrisefootball.com/parent/login and sign in. You'll have full access to your athlete's Training Passport — stats, charts, history, coach notes, and more.",
    note: "Forgot your password? Use the \"Forgot password?\" link on the login page to reset it by email.",
    color: "bg-gray-800",
  },
]

export default function ParentGuidePage() {
  const [qrSrc, setQrSrc] = useState("")

  useEffect(() => {
    QRCode.toDataURL("https://polyrisefootball.com/parent/register", {
      width: 160, margin: 1,
      color: { dark: "#111111", light: "#ffffff" },
    }).then(setQrSrc).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* Print button */}
      <div className="print:hidden bg-gray-100 border-b px-6 py-3 flex items-center justify-between">
        <p className="text-sm text-gray-600">Print or save as PDF to hand out to parents</p>
        <button
          onClick={() => window.print()}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-10 print:max-w-full print:px-12 print:py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b-4 border-red-600 pb-6">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={60} height={60} className="object-contain" />
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest">PolyRISE Football</p>
              <h1 className="text-3xl font-black text-gray-900 leading-tight">Parent Setup Guide</h1>
              <p className="text-gray-500 text-sm mt-1">Athlete Training Tracking Passport · 5 Steps</p>
            </div>
          </div>
          {qrSrc && (
            <div className="text-center shrink-0">
              <img src={qrSrc} alt="Scan to register" width={80} height={80} className="rounded-lg border border-gray-200" />
              <p className="text-xs text-gray-400 mt-1">Scan to register</p>
            </div>
          )}
        </div>

        {/* Intro */}
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          Follow these 5 steps to create your parent account and access your athlete&apos;s
          full performance profile, progress charts, session history, and coach notes on PolyRISE Football.
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${s.color} text-white font-black text-lg flex items-center justify-center shrink-0`}>
                  {s.step}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-0.5 bg-gray-200 flex-1 mt-2 min-h-[24px]" />
                )}
              </div>
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
        <div className="bg-gray-950 text-white rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-black text-red-400 uppercase tracking-widest mb-4">What You&apos;ll See Inside the Portal</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "📊", label: "Performance Overview", desc: "Baseline vs. current with % improvement for every drill" },
              { icon: "📈", label: "Progress Chart", desc: "Month-by-month growth across all metrics" },
              { icon: "🏃", label: "Full Session History", desc: "Every test session with dates & coach notes" },
              { icon: "⬅️➡️", label: "Lateral Speed Analysis", desc: "Left vs. right shuttle split comparison" },
              { icon: "📄", label: "Downloadable PDF", desc: "Full progress report you can save or share" },
              { icon: "🔴", label: "PR-VERIFIED Seal", desc: "View & share your athlete's recruiting seal (if issued)" },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-2">
                <span className="text-base mt-0.5">{f.icon}</span>
                <div>
                  <p className="font-bold text-white text-xs">{f.label}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Common Questions</h2>
          <div className="space-y-3">
            {[
              { q: "I didn't get the confirmation email.", a: "Check your spam folder. If it's not there, call (817) 658-3300." },
              { q: "I forgot my password.", a: "Go to polyrisefootball.com/parent/forgot-password — enter your email and we'll send a reset link." },
              { q: "My athlete's profile isn't showing.", a: "Your account may still be pending. Call or email us and we'll link it right away." },
              { q: "What is the Athlete ID (TRN-XXXX)?", a: "It's your athlete's unique training ID. Ask your coach — it speeds up linking your account." },
            ].map(item => (
              <div key={item.q} className="text-sm">
                <p className="font-bold text-gray-800">Q: {item.q}</p>
                <p className="text-gray-500 text-xs mt-0.5">A: {item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="border border-red-100 bg-red-50 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-black text-red-700 uppercase tracking-widest mb-3">Important Links</h2>
          <div className="space-y-2">
            {[
              { label: "Create Account", url: "polyrisefootball.com/parent/register" },
              { label: "Log In", url: "polyrisefootball.com/parent/login" },
              { label: "Reset Password", url: "polyrisefootball.com/parent/forgot-password" },
            ].map(l => (
              <div key={l.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">{l.label}</span>
                <span className="text-sm font-bold text-red-600">{l.url}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-red-600 pt-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Need Help?</p>
            <p className="text-gray-700 text-sm font-bold">(817) 658-3300</p>
            <p className="text-gray-500 text-sm">polyrise@polyrisefootball.com</p>
            <p className="text-gray-400 text-xs mt-3">PolyRISE Football · Dripping Springs, TX · polyrisefootball.com</p>
          </div>
          <div className="text-right text-xs text-gray-400 shrink-0">
            <p className="font-bold text-gray-600">Full program details:</p>
            <p className="text-red-600 font-bold">polyrisefootball.com/training-passport</p>
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
