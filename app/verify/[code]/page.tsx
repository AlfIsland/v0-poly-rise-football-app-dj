import { Metadata } from "next"
import Image from "next/image"
import { calculateRatings } from "@/lib/athlete-ratings"

export const metadata: Metadata = {
  title: "PR-VERIFIED Athlete Profile | PolyRISE Football",
  description: "Verify an athlete's PR-VERIFIED seal and view their PolyRISE Football Ratings",
}

function isValidCode(code: string) {
  return /^PR-V[A-Z]{1,6}-\d{4}$/i.test(code)
}

async function getAthlete(code: string) {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

    const res = await fetch(`${base}/api/athletes?code=${code.toUpperCase()}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.success ? json.athlete : null
  } catch {
    return null
  }
}

function PercentileBar({ label, value, unit, percentile, rank }: {
  label: string; value: number; unit: string; percentile: number; rank: string
}) {
  const color =
    percentile >= 90 ? "bg-green-400" :
    percentile >= 75 ? "bg-blue-400" :
    percentile >= 50 ? "bg-yellow-400" : "bg-red-400"

  const textColor =
    percentile >= 90 ? "text-green-400" :
    percentile >= 75 ? "text-blue-400" :
    percentile >= 50 ? "text-yellow-400" : "text-red-400"

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-end">
        <span className="text-sm text-gray-300 font-medium">{label}</span>
        <div className="text-right">
          <span className="text-white font-bold text-sm">{value}{unit === "in" ? '"' : ` ${unit}`}</span>
          <span className={`ml-2 text-xs font-semibold ${textColor}`}>{percentile}th %ile</span>
        </div>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentile}%` }} />
      </div>
      <p className={`text-xs ${textColor} text-right`}>{rank}</p>
    </div>
  )
}

function StarDisplay({ stars }: { stars: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-2xl ${i < stars ? "text-yellow-400" : "text-gray-700"}`}>★</span>
      ))}
    </div>
  )
}

export default async function VerifyPage({ params }: { params: { code: string } }) {
  const raw = decodeURIComponent(params.code).toUpperCase()
  const valid = isValidCode(raw)
  const athlete = valid ? await getAthlete(raw) : null

  const ratings = athlete?.metrics && Object.keys(athlete.metrics).length > 0
    ? calculateRatings(athlete.metrics)
    : null

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-5">

        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={140} height={52} className="object-contain" />
        </div>

        {!valid ? (
          // ── Invalid code ──
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <div className="bg-red-800 px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-white font-bold">Seal Not Recognized</p>
                <p className="text-red-200 text-xs">Code does not match PR-VERIFIED format</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-gray-400 text-sm">
                Valid codes look like <span className="font-mono text-red-400">PR-VJMW-0027</span>.
                Contact PolyRISE Football if you believe this is an error.
              </p>
              <p className="text-gray-400 text-sm">📞 512-593-3933 · coachjonathan@polyrisefootball.com</p>
            </div>
          </div>

        ) : !athlete ? (
          // ── Valid format but not in DB yet ──
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <div className="bg-yellow-700 px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <p className="text-white font-bold">Seal Format Valid</p>
                <p className="text-yellow-100 text-xs">Athlete profile not yet registered in the system</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-gray-300 font-mono text-lg font-bold text-yellow-400">{raw}</p>
              <p className="text-gray-400 text-sm">
                This seal code is properly formatted but the athlete&apos;s profile hasn&apos;t been saved yet.
                Contact PolyRISE Football to verify.
              </p>
              <p className="text-gray-400 text-sm">📞 512-593-3933 · coachjonathan@polyrisefootball.com</p>
            </div>
          </div>

        ) : (
          // ── Full verified profile ──
          <>
            {/* Verified banner */}
            <div className="bg-green-700 rounded-2xl px-6 py-4 flex items-center gap-3">
              <svg className="w-8 h-8 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-white font-bold text-lg">PR-VERIFIED</p>
                <p className="text-green-100 text-xs">Officially verified by PolyRISE Football</p>
              </div>
            </div>

            {/* Seal + athlete header */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              <div className="bg-black flex justify-center py-5">
                <Image src="/pr-verified-seal.png" alt="PR-VERIFIED Seal" width={200} height={200} className="object-contain" />
              </div>

              <div className="px-6 py-5 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Athlete</p>
                  <p className="text-2xl font-bold text-white">{athlete.athleteName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {athlete.position && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Position</p>
                      <p className="text-white font-semibold">{athlete.position}</p>
                    </div>
                  )}
                  {athlete.school && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">School</p>
                      <p className="text-white font-semibold">{athlete.school}</p>
                    </div>
                  )}
                  {athlete.gradYear && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Class</p>
                      <p className="text-white font-semibold">{athlete.gradYear}</p>
                    </div>
                  )}
                  {athlete.height && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Height</p>
                      <p className="text-white font-semibold">{athlete.height}</p>
                    </div>
                  )}
                  {athlete.weight && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Weight</p>
                      <p className="text-white font-semibold">{athlete.weight} lbs</p>
                    </div>
                  )}
                  {athlete.gpa && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">GPA</p>
                      <p className="text-white font-semibold">{athlete.gpa}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-800 pt-3 flex justify-between text-xs text-gray-500">
                  <span>Code: <span className="font-mono text-red-400">{athlete.code}</span></span>
                  {athlete.issuedAt && (
                    <span>Issued: {new Date(athlete.issuedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>

            {/* PolyRISE Football Ratings */}
            {ratings && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="bg-gray-800 px-6 py-4">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">PolyRISE Football Ratings</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-lg">{ratings.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{ratings.overallPercentile}th percentile nationally</p>
                    </div>
                    <StarDisplay stars={ratings.stars} />
                  </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                  <p className="text-gray-400 text-sm italic">&ldquo;{ratings.description}&rdquo;</p>

                  <div className="space-y-4 pt-1">
                    {ratings.metrics.map((m) => (
                      <PercentileBar
                        key={m.label}
                        label={m.label}
                        value={m.value}
                        unit={m.unit}
                        percentile={m.percentile}
                        rank={m.rank}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-gray-600 pt-2 border-t border-gray-800">
                    Percentiles based on national high school football athlete combine data.
                    Ratings issued by PolyRISE Football coaching staff.
                  </p>
                </div>
              </div>
            )}

          </>
        )}

        <p className="text-center text-gray-700 text-xs pb-4">
          polyrisefootball.com · PR-VERIFIED Seal Program · Austin, TX
        </p>
      </div>
    </div>
  )
}
