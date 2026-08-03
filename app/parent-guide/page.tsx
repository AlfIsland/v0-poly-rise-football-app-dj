"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import QRCode from "qrcode"

const PLANS = [
  {
    name: "Passport",
    price: "$9.99/mo",
    color: "bg-gray-700",
    features: ["Monthly progress reports", "Full session history", "Baseline vs. current comparisons", "Recruiting Roadmap"],
  },
  {
    name: "Recruit",
    price: "$29.99/mo",
    color: "bg-red-600",
    features: ["Everything in Passport", "PR-VERIFIED seal", "Shareable recruiting profile", "School Fit Finder", "Coach Outreach Templates", "Camp Suggestions", "1 Free Combine Camp/Month"],
  },
  {
    name: "Elite Recruit",
    price: "$49.99/mo",
    color: "bg-yellow-600",
    features: ["Everything in Recruit", "Quarterly PolyRISE Staff development report", "Prospect ranking by position & grade", "Early access to all PolyRISE camps & events"],
  },
]

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
    body: "Select Passport ($9.99/mo), Recruit ($29.99/mo), or Elite Recruit ($49.99/mo). Recruit and Elite Recruit unlock the full recruiting suite including your athlete's public profile and school matching.",
    note: "Program Members select \"Program Member\" — access is included with program enrollment.",
    color: "bg-red-700",
  },
  {
    step: "3",
    title: "Create Your Account",
    body: "Enter your name, your athlete's full name, email, and password. If you have your athlete's ID (TRN-XXXX), enter it — this links your account faster.",
    note: "Athlete ID is optional but speeds up the process. Ask your coach if you don't have it.",
    color: "bg-red-800",
  },
  {
    step: "4",
    title: "Complete Payment",
    body: "You'll be directed to a secure Stripe checkout page. Payment is encrypted — PolyRISE never stores your card information.",
    note: "Subscriptions renew monthly. Cancel anytime from your portal.",
    color: "bg-gray-700",
  },
  {
    step: "5",
    title: "PolyRISE Links Your Athlete",
    body: "PolyRISE staff will link your account to your athlete's training profile. You'll receive a notification email once it's ready — usually within 1 business day.",
    note: "Check your spam folder if you don't see the email.",
    color: "bg-gray-700",
  },
  {
    step: "6",
    title: "Log In & Access Everything",
    body: "Go to polyrisefootball.com/parent/login and sign in. Your full dashboard — metrics, recruiting tools, roadmap, and more — will be waiting.",
    note: "Forgot your password? Use the \"Forgot password\" link on the login page.",
    color: "bg-gray-800",
  },
]

const PORTAL_FEATURES = [
  { icon: "📊", label: "Performance Overview", desc: "Baseline vs. current with % improvement for every drill" },
  { icon: "📈", label: "Progress Chart", desc: "Month-by-month growth across all metrics" },
  { icon: "🏃", label: "Full Session History", desc: "Every test session with dates and coach notes" },
  { icon: "⬅️➡️", label: "Lateral Speed Analysis", desc: "Left vs. right shuttle split — identifies training weak side" },
  { icon: "🔴", label: "PR-VERIFIED Seal", desc: "Shareable verified athlete seal linked to your profile" },
  { icon: "🌐", label: "Public Recruiting Profile", desc: "Shareable page with metrics, Hudl film, and contact info" },
  { icon: "🏫", label: "School Fit Finder", desc: "Filters D1/D2/D3/NAIA/JuCo programs by sport, region, and position — matched to your athlete's 40-yard time" },
  { icon: "📍", label: "Camp Suggestions", desc: "PolyRISE camps + elite/college/regional camps with registration links" },
  { icon: "✉️", label: "Coach Outreach Templates", desc: "NCAA-compliant email templates pre-filled with your athlete's data" },
  { icon: "🗺️", label: "Recruiting Roadmap", desc: "Grade-by-grade action plan from 8th grade through signing day" },
  { icon: "📸", label: "Athlete Photo", desc: "Upload a profile photo for the recruiting profile" },
  { icon: "📄", label: "Downloadable PDF", desc: "Full progress report you can save or share" },
]

const FAQ = [
  { q: "I didn't get the confirmation email.", a: "Check your spam folder. If it's not there, call (817) 658-3300." },
  { q: "I forgot my password.", a: "Go to polyrisefootball.com/parent/forgot-password — enter your email and we'll send a reset link." },
  { q: "My athlete's profile isn't showing.", a: "Your account may still be pending staff review. Call or email us and we'll link it right away." },
  { q: "What is the Athlete ID (TRN-XXXX)?", a: "It's your athlete's unique training ID — ask your coach. It speeds up the account linking process." },
  { q: "What is the School Fit Finder?", a: "It's a tool that filters college programs by sport, division, and region — and if your athlete has been tested, matches schools to their actual 40-yard dash time." },
  { q: "What is a PR-VERIFIED seal?", a: "A digital badge issued by PolyRISE that certifies your athlete's metrics were tested at a PolyRISE combine camp. Coaches can verify it at polyrisefootball.com/verify/[CODE]." },
  { q: "What are Coach Outreach Templates?", a: "Pre-written NCAA-compliant email templates you can send to college coaches — auto-filled with your athlete's name, position, metrics, and recruiting profile link." },
  { q: "Can I cancel my subscription?", a: "Yes — cancel anytime from your portal under Manage Billing. You'll keep access through the end of your billing period." },
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
            <Image src="/poly-rise-logo.png" alt="PolyRISE Athletix" width={60} height={60} className="object-contain" />
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest">PolyRISE Athletix</p>
              <h1 className="text-3xl font-black text-gray-900 leading-tight">Parent Setup Guide</h1>
              <p className="text-gray-500 text-sm mt-1">Athlete Training Passport · Recruiting Portal · 6 Steps</p>
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
          PolyRISE Athletix tracks your athlete&apos;s performance from first combine test through signing day.
          This guide walks you through setting up your parent account and explains everything available inside your portal.
        </p>

        {/* Plans */}
        <div className="mb-10">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Choose Your Plan</h2>
          <div className="grid grid-cols-3 gap-3">
            {PLANS.map(p => (
              <div key={p.name} className="border border-gray-200 rounded-xl p-4">
                <div className={`${p.color} text-white text-xs font-black px-2 py-0.5 rounded-full inline-block mb-2`}>{p.name}</div>
                <p className="text-xl font-black text-gray-900 mb-3">{p.price}</p>
                <ul className="space-y-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-1 text-xs text-gray-600">
                      <span className="text-green-500 shrink-0 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 italic">Program Members: select &quot;Program Member&quot; at registration — access is included with your enrollment.</p>
        </div>

        {/* Steps */}
        <div className="mb-10">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">How to Get Started</h2>
          <div className="space-y-4">
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
                  <h3 className="font-black text-gray-900 text-base mb-1">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
                  {s.note && (
                    <p className="text-xs text-gray-400 mt-1.5 italic">💡 {s.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's inside the portal */}
        <div className="bg-gray-950 text-white rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-black text-red-400 uppercase tracking-widest mb-4">What&apos;s Inside Your Portal</h2>
          <div className="grid grid-cols-2 gap-3">
            {PORTAL_FEATURES.map(f => (
              <div key={f.label} className="flex items-start gap-2">
                <span className="text-base mt-0.5 shrink-0">{f.icon}</span>
                <div>
                  <p className="font-bold text-white text-xs">{f.label}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff banner */}
        <div className="border border-red-200 bg-red-50 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center text-white font-black text-sm shrink-0">PA</div>
            <div>
              <p className="font-black text-gray-900 text-sm">PolyRISE Athletix Staff · Player Development</p>
              <p className="text-gray-500 text-xs">Elite Recruit subscribers receive a quarterly personal development report from PolyRISE Staff</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">Questions about recruiting? Contact us: <strong>polyrise@polyrisefootball.com</strong></p>
        </div>

        {/* FAQ */}
        <div className="border border-gray-200 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Common Questions</h2>
          <div className="space-y-4">
            {FAQ.map(item => (
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
              { label: "Create Account / Subscribe", url: "polyrisefootball.com/parent/register" },
              { label: "Log In to Portal", url: "polyrisefootball.com/parent/login" },
              { label: "Reset Password", url: "polyrisefootball.com/parent/forgot-password" },
              { label: "Program Overview", url: "polyrisefootball.com/program-overview" },
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
            <p className="text-gray-400 text-xs mt-3">PolyRISE Athletix · Dripping Springs, TX · polyrisefootball.com</p>
          </div>
          <div className="text-right text-xs text-gray-400 shrink-0">
            <p className="font-bold text-gray-600">Program details:</p>
            <p className="text-red-600 font-bold">polyrisefootball.com/program-overview</p>
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
