import Link from "next/link"
import Image from "next/image"
import Redis from "ioredis"
import LogoutButton from "@/components/logout-button"

async function getAllTrainingAthletes() {
  try {
    if (!process.env.REDIS_URL) return []
    const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    const ids = await redis.smembers("training:roster")
    if (!ids.length) { await redis.quit(); return [] }
    const values = await redis.mget(...ids.map(i => `training:athlete:${i}`))
    await redis.quit()
    return values.filter(Boolean).map(v => JSON.parse(v!))
      .sort((a: { joinedAt: string }, b: { joinedAt: string }) =>
        new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
  } catch (err) {
    console.error("[training roster]", err)
    return []
  }
}

export default async function TrainingRosterPage() {
  const athletes = await getAllTrainingAthletes()

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={40} height={40} className="object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-white">PolyRISE Training Tracker</h1>
              <p className="text-gray-400 text-sm">{athletes.length} athlete{athletes.length !== 1 ? "s" : ""} enrolled</p>
              <Link href="/admin/athletes" className="text-xs text-gray-600 hover:text-gray-400 underline mt-0.5 block">← PR-VERIFIED Roster</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/training/new" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
              + Add Athlete
            </Link>
            <LogoutButton />
          </div>
        </div>

        {athletes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600 gap-3">
            <p className="text-lg">No training athletes yet.</p>
            <Link href="/training/new" className="text-red-400 underline text-sm">Add your first athlete</Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-6 py-4">Athlete</th>
                    <th className="text-left px-6 py-4">Age / Grade</th>
                    <th className="text-left px-6 py-4">School</th>
                    <th className="text-left px-6 py-4">Position</th>
                    <th className="text-left px-6 py-4">Sessions</th>
                    <th className="text-left px-6 py-4">Last Tested</th>
                    <th className="text-left px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.map((a: {
                    id: string; name: string; age: number; grade: string
                    school: string; position?: string; sessions: { date: string }[]
                  }) => {
                    const lastSession = a.sessions?.length ? a.sessions[a.sessions.length - 1] : null
                    return (
                      <tr key={a.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-white">{a.name}</p>
                          <p className="text-xs text-gray-600 font-mono">{a.id}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{a.age} yrs · {a.grade}</td>
                        <td className="px-6 py-4 text-gray-300">{a.school || "—"}</td>
                        <td className="px-6 py-4 text-gray-300">{a.position || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-bold ${a.sessions?.length ? "text-white" : "text-gray-600"}`}>
                            {a.sessions?.length ?? 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {lastSession ? new Date(lastSession.date).toLocaleDateString() : "Never"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link href={`/training/${a.id}`}
                              className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors">
                              View
                            </Link>
                            <Link href={`/training/${a.id}/session`}
                              className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors">
                              + Test
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {athletes.map((a: {
                id: string; name: string; age: number; grade: string
                school: string; position?: string; sessions: { date: string }[]
              }) => {
                const lastSession = a.sessions?.length ? a.sessions[a.sessions.length - 1] : null
                return (
                  <div key={a.id} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-white">{a.name}</p>
                        <p className="text-xs text-gray-600 font-mono">{a.id}</p>
                      </div>
                      <span className="text-xs text-gray-500">{a.sessions?.length ?? 0} sessions</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                      <p>Age: <span className="text-gray-300">{a.age} · {a.grade}</span></p>
                      <p>Position: <span className="text-gray-300">{a.position || "—"}</span></p>
                      <p className="col-span-2">Last tested: <span className="text-gray-300">{lastSession ? new Date(lastSession.date).toLocaleDateString() : "Never"}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/training/${a.id}`} className="flex-1 text-center text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg">View</Link>
                      <Link href={`/training/${a.id}/session`} className="flex-1 text-center text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg">+ Test</Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
