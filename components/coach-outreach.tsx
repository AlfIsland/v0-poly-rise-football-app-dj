"use client"

import { useState } from "react"

interface Athlete {
  id: string
  name: string
  position?: string
  grade?: string
  school?: string
  videoLink?: string
  sessions?: {
    fortyYard?: number
    verticalJump?: number
    broadJump?: number
    shuttle?: number
    threeCone?: number
    weight?: number
    height?: string
  }[]
}

interface Props {
  athlete: Athlete
  parentName: string
  parentEmail: string
  parentPhone?: string
}

type TemplateType = "initial" | "followup" | "camp"

function gradYear(grade?: string) {
  const num = parseInt((grade ?? "").replace(/\D/g, ""))
  if (!num) return "20XX"
  const current = new Date().getFullYear()
  const yearsLeft = 12 - num
  return String(current + yearsLeft)
}

function buildMetrics(sessions?: Athlete["sessions"]) {
  if (!sessions || sessions.length === 0) return ""
  const latest = sessions[sessions.length - 1]
  const lines: string[] = []
  if (latest.fortyYard)    lines.push(`  • 40-Yard Dash: ${latest.fortyYard}s`)
  if (latest.verticalJump) lines.push(`  • Vertical Jump: ${latest.verticalJump}"`)
  if (latest.broadJump)    lines.push(`  • Broad Jump: ${latest.broadJump}"`)
  if (latest.shuttle)      lines.push(`  • 5-10-5 Shuttle: ${latest.shuttle}s`)
  if (latest.threeCone)    lines.push(`  • 3-Cone Drill: ${latest.threeCone}s`)
  if (latest.height)       lines.push(`  • Height: ${latest.height}`)
  if (latest.weight)       lines.push(`  • Weight: ${latest.weight} lbs`)
  return lines.join("\n")
}

function buildTemplate(
  type: TemplateType,
  athlete: Athlete,
  parentName: string,
  parentEmail: string,
  parentPhone: string,
  coachName: string,
  schoolName: string,
): { subject: string; body: string } {
  const yr = gradYear(athlete.grade)
  const pos = athlete.position ?? "[Position]"
  const hs = athlete.school ?? "[High School]"
  const metrics = buildMetrics(athlete.sessions)
  const profileUrl = `polyrisefootball.com/athlete/${athlete.id}`
  const hudl = athlete.videoLink ?? null
  const coach = coachName || "Coach"
  const school = schoolName || "[School Name]"

  if (type === "initial") {
    return {
      subject: `${pos} Prospect – ${athlete.name} | Class of ${yr} | ${hs}`,
      body: `${coach},

My name is ${parentName}, and I am reaching out on behalf of my athlete ${athlete.name}, a Class of ${yr} ${pos} at ${hs}.

${athlete.name} has a strong interest in ${school} and your program. Below are their current coach-verified athletic metrics from PolyRISE Athletix:

${metrics || "  [Metrics will appear here once sessions are recorded]"}

Full verified recruiting profile:
${profileUrl}
${hudl ? `\nHudl Film: ${hudl}` : ""}

${athlete.name} is committed to competing at the next level both athletically and academically. We would love to learn more about your program, any upcoming camps, and how ${athlete.name} can get on your radar.

Thank you for your time and consideration.

Respectfully,
${parentName}
${parentPhone ? parentPhone + "\n" : ""}${parentEmail}`.trim(),
    }
  }

  if (type === "followup") {
    return {
      subject: `Follow-Up – ${athlete.name} | ${pos} | Class of ${yr}`,
      body: `${coach},

I wanted to follow up on my previous email regarding ${athlete.name}, a ${pos} in the Class of ${yr} from ${hs}.

${athlete.name} continues to develop and remains very interested in ${school}. Their updated recruiting profile with current verified metrics is available here:
${profileUrl}
${hudl ? `\nHudl Film: ${hudl}` : ""}

If there is an upcoming camp or any opportunity for ${athlete.name} to connect with your staff, we would love to make that happen. Please don't hesitate to reach out.

Thank you,
${parentName}
${parentPhone ? parentPhone + "\n" : ""}${parentEmail}`.trim(),
    }
  }

  // camp
  return {
    subject: `Camp Registration Interest – ${athlete.name} | ${pos} | Class of ${yr}`,
    body: `${coach},

My name is ${parentName}. My athlete ${athlete.name} is a Class of ${yr} ${pos} at ${hs} and would like to attend one of your upcoming camps.

You can view ${athlete.name}'s full verified recruiting profile here:
${profileUrl}
${hudl ? `\nHudl Film: ${hudl}` : ""}

Please let us know the details on how to register for your next camp. We are eager to get ${athlete.name} in front of your coaching staff.

Thank you,
${parentName}
${parentPhone ? parentPhone + "\n" : ""}${parentEmail}`.trim(),
  }
}

const TEMPLATE_LABELS: Record<TemplateType, { label: string; desc: string; color: string }> = {
  initial:  { label: "Initial Contact",  desc: "First email to a coach",         color: "border-blue-500 text-blue-300" },
  followup: { label: "Follow-Up",        desc: "No response after 2–3 weeks",    color: "border-yellow-500 text-yellow-300" },
  camp:     { label: "Camp Interest",    desc: "Ask about attending their camp",  color: "border-green-500 text-green-300" },
}

export default function CoachOutreach({ athlete, parentName, parentEmail, parentPhone }: Props) {
  const [type, setType] = useState<TemplateType>("initial")
  const [coachName, setCoachName] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [phone, setPhone] = useState(parentPhone ?? "")
  const [copied, setCopied] = useState<"subject" | "body" | "all" | null>(null)
  const [generated, setGenerated] = useState(false)

  const template = buildTemplate(type, athlete, parentName, parentEmail, phone, coachName, schoolName)

  function copy(what: "subject" | "body" | "all") {
    const text = what === "subject" ? template.subject
      : what === "body" ? template.body
      : `Subject: ${template.subject}\n\n${template.body}`
    navigator.clipboard.writeText(text)
    setCopied(what)
    setTimeout(() => setCopied(null), 2500)
  }

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-950/60 to-gray-900 px-6 py-4 border-b border-white/10">
        <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-0.5">PolyRISE Recruiting</p>
        <h2 className="text-white font-black text-lg">Coach Outreach Templates</h2>
        <p className="text-gray-400 text-xs mt-0.5">NCAA-compliant emails ready to send — just fill in the coach and school</p>
      </div>

      <div className="p-6 space-y-5">

        {/* Template type picker */}
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(TEMPLATE_LABELS) as [TemplateType, typeof TEMPLATE_LABELS[TemplateType]][]).map(([t, info]) => (
            <button key={t} onClick={() => { setType(t); setGenerated(false) }}
              className={`rounded-xl p-3 text-left border-2 transition-all ${type === t ? info.color + " bg-gray-800" : "border-gray-700 bg-gray-800/50 hover:border-gray-500"}`}>
              <p className={`text-xs font-black ${type === t ? "" : "text-gray-400"}`}>{info.label}</p>
              <p className="text-gray-600 text-xs mt-0.5 leading-tight">{info.desc}</p>
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Coach Name</label>
            <input value={coachName} onChange={e => setCoachName(e.target.value)} placeholder='e.g. "Coach Johnson"'
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-green-500 placeholder-gray-600" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">School Name</label>
            <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. Texas A&M University"
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-green-500 placeholder-gray-600" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Your Phone (optional)</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(817) 555-1234"
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-green-500 placeholder-gray-600" />
          </div>
        </div>

        <button onClick={() => setGenerated(true)}
          className="w-full bg-green-700 hover:bg-green-600 text-white font-bold text-sm py-3 rounded-xl transition-colors">
          Generate Email
        </button>

        {/* Template output */}
        {generated && (
          <div className="space-y-3">

            {/* Subject */}
            <div className="bg-gray-800 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Subject Line</p>
                <button onClick={() => copy("subject")}
                  className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-lg transition-colors font-semibold">
                  {copied === "subject" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <p className="text-white text-sm font-medium">{template.subject}</p>
            </div>

            {/* Body */}
            <div className="bg-gray-800 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Email Body</p>
                <button onClick={() => copy("body")}
                  className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-lg transition-colors font-semibold">
                  {copied === "body" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">{template.body}</pre>
            </div>

            {/* Copy all */}
            <button onClick={() => copy("all")}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-sm py-3 rounded-xl transition-colors">
              {copied === "all" ? "✓ Copied — Paste into your email app" : "Copy Full Email (Subject + Body)"}
            </button>

            {/* NCAA note */}
            <div className="bg-yellow-950/30 border border-yellow-800/40 rounded-xl px-4 py-3">
              <p className="text-yellow-400 text-xs font-bold mb-1">NCAA Contact Rules</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Athletes and parents can contact college coaches at any time. Coaches have restrictions on when they can respond — this varies by division and sport. Don&apos;t be discouraged by silence — follow up after 2–3 weeks.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
