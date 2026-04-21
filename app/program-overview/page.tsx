"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import QRCode from "qrcode"

export default function ProgramOverviewPage() {
  const [qrRegister, setQrRegister] = useState("")

  useEffect(() => {
    QRCode.toDataURL("https://polyrisefootball.com/parent/register", {
      width: 160, margin: 1,
      color: { dark: "#111111", light: "#ffffff" },
    }).then(setQrRegister).catch(console.error)
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

      <div className="max-w-2xl mx-auto px-8 py-10 print:max-w-full print:px-12 print:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-2 border-b-4 border-red-600 pb-6">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={64} height={64} className="object-contain" />
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest">PolyRISE Football</p>
              <h1 className="text-3xl font-black text-gray-900 leading-tight">Get Recruited. Get Verified. Get Noticed.</h1>
              <p className="text-gray-500 text-sm mt-1">Player Development & Recruiting · Powered by PolyRISE</p>
            </div>
          </div>
          {qrRegister && (
            <div className="text-center shrink-0">
              <img src={qrRegister} alt="Scan to register" width={72} height={72} className="rounded-lg border border-gray-200" />
              <p className="text-xs text-gray-400 mt-1">Scan to register</p>
            </div>
          )}
        </div>

        {/* Multi-sport + Kevin Garrett banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 mt-4">
          <div className="bg-gray-950 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">🏅</span>
            <div>
              <p className="text-white font-black text-sm">Built for Every Athlete.</p>
              <p className="text-gray-400 text-xs">Football · Soccer · Track & Field · Basketball · Baseball · and more</p>
            </div>
          </div>
          <div className="bg-yellow-950 border border-yellow-700/40 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-700 flex items-center justify-center text-white font-black text-sm shrink-0">KG</div>
            <div>
              <p className="text-yellow-300 font-black text-sm">Kevin Garrett · Former NFL</p>
              <p className="text-yellow-600 text-xs">Director of Player Development @ PolyRISE</p>
            </div>
          </div>
        </div>

        {/* Intro */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          At PolyRISE, every athlete we train is tracked — every session, every drill, every improvement.
          Parents get full visibility into their athlete&apos;s development, and athletes get the verified credentials
          and recruiting exposure they need to get noticed by coaches and college programs.
        </p>

        {/* Two-column features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">

          {/* ATP */}
          <div className="bg-gray-950 text-white rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shrink-0">ATP</div>
              <h2 className="font-black text-white text-base">Athlete Training Passport</h2>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              A digital performance record that captures everything your athlete does in training —
              speed, agility, strength, and more. Every session is logged so you can see growth over time.
            </p>
            <div className="space-y-2">
              {[
                { icon: "📊", text: "Baseline vs. current with % improvement" },
                { icon: "📈", text: "Month-by-month progress charts" },
                { icon: "🏃", text: "Full session history with dates" },
                { icon: "📝", text: "Coach notes per session" },
                { icon: "📄", text: "Downloadable PDF progress report" },
                { icon: "🎬", text: "Hudl film linked to athlete profile" },
              ].map(f => (
                <div key={f.text} className="flex items-start gap-2">
                  <span className="text-sm mt-0.5 shrink-0">{f.icon}</span>
                  <p className="text-gray-300 text-xs leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PR-VERIFIED */}
          <div className="bg-gray-950 text-white rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                <span className="text-white font-black text-xs">PR-V</span>
              </div>
              <h2 className="font-black text-white text-base">PR-VERIFIED Seal</h2>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              A verified performance credential issued by PolyRISE to athletes who meet a measurable standard.
              Coach-verified proof that your athlete&apos;s numbers are real — shareable with coaches and recruiters.
            </p>
            <div className="space-y-2">
              {[
                { icon: "🔴", text: "Issued by PolyRISE coaching staff" },
                { icon: "✅", text: "Athlete name, position, grade, school" },
                { icon: "⚡", text: "Top metrics stamped on the seal" },
                { icon: "🔗", text: "Unique QR code links to athlete profile" },
                { icon: "📤", text: "Shareable — social media, recruiting profiles" },
                { icon: "🏆", text: "Coach-verified athletic performance" },
              ].map(f => (
                <div key={f.text} className="flex items-start gap-2">
                  <span className="text-sm mt-0.5 shrink-0">{f.icon}</span>
                  <p className="text-gray-300 text-xs leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly camps section */}
        <div className="border-2 border-red-600 rounded-2xl p-5 mb-6">
          <h2 className="text-base font-black text-gray-900 mb-1">Monthly Combine Camps = Monthly Updates</h2>
          <p className="text-gray-500 text-xs mb-4 leading-relaxed">
            PolyRISE runs PR-VERIFIED Athlete Training Combine Camps on a monthly cycle.
            Every camp updates your athlete&apos;s numbers — new metrics, new charts, new progress.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "📅", title: "Monthly Sessions", desc: "New test data recorded every camp cycle" },
              { icon: "📬", title: "Monthly Reports", desc: "Updated passport delivered after each camp" },
              { icon: "📍", title: "Dripping Springs, TX", desc: "Ask about upcoming camp enrollment dates" },
              { icon: "📞", title: "Call to Enroll", desc: "(817) 658-3300 · polyrise@polyrisefootball.com" },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-2 bg-red-50 rounded-xl p-3">
                <span className="text-lg shrink-0">{f.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 text-xs">{f.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription tiers */}
        <div className="bg-gray-950 text-white rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-black text-red-400 uppercase tracking-widest mb-1">Choose Your Plan</h2>
          <p className="text-gray-400 text-xs mb-4 leading-relaxed">
            Every plan gives parents direct access to their athlete&apos;s full training record — anytime, on any device.
            Recruiting plans unlock full visibility with college coaches.
          </p>
          <div className="space-y-3 mb-4">
            {[
              {
                label: "Elite Recruit",
                price: "$49.99/mo",
                group: "High School Athletes",
                tag: "MOST POPULAR",
                tagColor: "bg-yellow-500 text-black",
                color: "border-yellow-500",
                tcolor: "text-yellow-300",
                features: "Full metrics + PR-V seal + recruiting profile + X spotlight + Kevin Garrett quarterly report + college fit list + 1 free combine camp/month",
              },
              {
                label: "Recruit",
                price: "$29.99/mo",
                group: "High School Athletes",
                tag: null,
                tagColor: "",
                color: "border-red-500",
                tcolor: "text-red-300",
                features: "Full metrics + PR-V seal + recruiting profile + Hudl on profile + monthly X spotlight + 1 free combine camp/month",
              },
              {
                label: "Passport",
                price: "$9.99/mo",
                group: "Middle School & Younger",
                tag: null,
                tagColor: "",
                color: "border-blue-500",
                tcolor: "text-blue-300",
                features: "Full metrics tracking + progress reports + session history + downloadable PDF reports",
              },
            ].map(p => (
              <div key={p.label} className={`border ${p.color} rounded-xl p-3`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-black text-base ${p.tcolor}`}>{p.label}</p>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{p.group}</span>
                    {p.tag && <span className={`text-xs font-black px-2 py-0.5 rounded-full ${p.tagColor}`}>{p.tag}</span>}
                  </div>
                  <p className="text-white font-black text-sm shrink-0">{p.price}</p>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{p.features}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">
            Already in a PolyRISE program? Ask your coach about Program Member access — included with enrollment.
          </p>
        </div>

        {/* Why it matters */}
        <div className="border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Why Tracking Matters</h2>
          <div className="space-y-2.5">
            {[
              { q: "Accountability", a: "Athletes perform better when they know their numbers are being tracked and compared over time." },
              { q: "Visibility", a: "You see exactly what your athlete is working on — not just \"practice was good today.\"" },
              { q: "Recruiting", a: "Verified metrics and a PR-VERIFIED seal give coaches and college programs real data to evaluate your athlete." },
              { q: "Player Development", a: "Kevin Garrett (Former NFL) oversees athlete development — your athlete has a professional eye on their progress." },
              { q: "Motivation", a: "Seeing a 15% speed improvement in three months is a powerful motivator for any young athlete." },
            ].map(item => (
              <div key={item.q} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-gray-800 text-sm">{item.q} — </span>
                  <span className="text-gray-500 text-sm">{item.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA + QR */}
        <div className="border border-red-200 bg-red-50 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-black text-red-700 uppercase tracking-widest mb-3">Get Started Today</h2>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              {[
                { label: "Create Parent Account / Subscribe", url: "polyrisefootball.com/parent/register" },
                { label: "Log In to Parent Portal", url: "polyrisefootball.com/parent/login" },
                { label: "Recruiting inquiries", url: "kg@polyrisefootball.com" },
              ].map(l => (
                <div key={l.label} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-600 font-medium">{l.label}</span>
                  <span className="text-xs font-bold text-red-600 shrink-0">{l.url}</span>
                </div>
              ))}
            </div>
            {qrRegister && (
              <div className="text-center shrink-0">
                <img src={qrRegister} alt="Scan to register" width={72} height={72} className="rounded-lg border border-red-200" />
                <p className="text-xs text-gray-400 mt-1">Scan to register</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-red-600 pt-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Questions? We&apos;re Here.</p>
            <p className="text-gray-700 text-sm font-bold">(817) 658-3300</p>
            <p className="text-gray-500 text-sm">polyrise@polyrisefootball.com</p>
            <p className="text-gray-400 text-xs mt-1">Recruiting: kg@polyrisefootball.com</p>
            <p className="text-gray-400 text-xs mt-3">PolyRISE Football · Dripping Springs, TX · polyrisefootball.com</p>
          </div>
          <div className="text-right text-xs text-gray-400 shrink-0">
            <p className="font-bold text-gray-600">Follow us:</p>
            <p className="text-red-600 font-bold">@PolyRISEFB</p>
            <p className="text-gray-500 mt-1 text-xs">x.com/PolyRISEFB</p>
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
