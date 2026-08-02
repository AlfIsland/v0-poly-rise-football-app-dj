import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Redis from "ioredis"
import { cookies } from "next/headers"
import { ATHLETE_COOKIE, getAthleteIdFromSession } from "@/lib/athlete-auth"
import type { PendingVideoTest } from "@/app/api/training/route"
import VideoTestUploadForm from "@/components/video-test-upload-form"

async function getAthlete(id: string) {
  try {
    if (!process.env.REDIS_URL) return null
    const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    const raw = await redis.get(`training:athlete:${id.toUpperCase()}`)
    await redis.quit()
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const STATUS_STYLE: Record<PendingVideoTest["status"], string> = {
  pending: "bg-yellow-900/50 text-yellow-400 border-yellow-700/40",
  verified: "bg-green-900/50 text-green-400 border-green-700/40",
  rejected: "bg-red-900/50 text-red-400 border-red-700/40",
}

export default async function UploadTestPage({ params }: { params: { id: string } }) {
  const athlete = await getAthlete(params.id)
  if (!athlete) notFound()

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(ATHLETE_COOKIE)?.value
  const adminToken = cookieStore.get("pr_admin_session")?.value
  const isAdmin = !!adminToken && !!process.env.ADMIN_SESSION_TOKEN && adminToken === process.env.ADMIN_SESSION_TOKEN
  const loggedInAthleteId = sessionToken ? await getAthleteIdFromSession(sessionToken) : null
  const isOwner = !!loggedInAthleteId && loggedInAthleteId.toUpperCase() === params.id.toUpperCase()

  if (!isOwner && !isAdmin) {
    redirect(`/athlete/login?from=/athlete/${params.id}/upload-test`)
  }

  const tests: PendingVideoTest[] = [...(athlete.pendingVideoTests ?? [])].reverse()

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-lg mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-red-500 font-black uppercase tracking-widest">PolyRISE Athletix</p>
            <h1 className="text-xl font-black text-white mt-0.5">Upload Test Video</h1>
            <p className="text-sm text-gray-500 mt-0.5">{athlete.name}</p>
          </div>
          <Link href={`/athlete/${athlete.id}`} className="text-xs text-gray-500 hover:text-gray-300">
            ← Back to profile
          </Link>
        </div>

        <VideoTestUploadForm athleteId={athlete.id} />

        {tests.length > 0 && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5">
              <h2 className="text-xs font-black text-white uppercase tracking-widest">Your Uploads</h2>
            </div>
            <div className="divide-y divide-white/5">
              {tests.map(t => (
                <div key={t.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-300">{t.metric}</p>
                    <p className="text-xs text-gray-600">{new Date(t.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[t.status]}`}>
                    {t.status === "pending" ? "Awaiting Review" : t.status === "verified" ? "Verified" : "Rejected"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-600 text-center">
          Videos are reviewed by PolyRISE Staff before a verified result is added to your profile.
        </p>
      </div>
    </div>
  )
}
