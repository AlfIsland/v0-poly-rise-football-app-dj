import Redis from "ioredis"
import Image from "next/image"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"
import SendContactButtons from "@/components/send-contact-buttons"

async function getAllAthletes() {
  try {
    if (!process.env.REDIS_URL) return []
    const redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
    })
    const keys = await redis.keys("athlete:*")
    if (keys.length === 0) { await redis.quit(); return [] }
    const values = await redis.mget(...keys)
    await redis.quit()
    return values
      .filter(Boolean)
      .map(v => JSON.parse(v!))
      .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
  } catch (err) {
    console.error("[athletes roster]", err)
    return []
  }
}

export default async function AthletesRosterPage() {
  const athletes = await getAllAthletes()

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={40} height={40} className="object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-white">PR-VERIFIED Athlete Roster</h1>
              <p className="text-gray-400 text-sm">{athletes.length} athlete{athletes.length !== 1 ? "s" : ""} registered</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/seal-generator"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              + New Seal
            </Link>
            <LogoutButton />
          </div>
        </div>

        {athletes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600 gap-3">
            <p className="text-lg">No athletes registered yet.</p>
            <Link href="/admin/seal-generator" className="text-red-400 underline text-sm">Generate your first seal</Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-6 py-4">#</th>
                    <th className="text-left px-6 py-4">Athlete</th>
                    <th className="text-left px-6 py-4">Seal Code</th>
                    <th className="text-left px-6 py-4">Position</th>
                    <th className="text-left px-6 py-4">School</th>
                    <th className="text-left px-6 py-4">Class</th>
                    <th className="text-left px-6 py-4">Issued</th>
                    <th className="text-left px-6 py-4">Expires</th>
                    <th className="text-left px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.map((a, i) => (
                    <tr key={a.code} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{athletes.length - i}</td>
                      <td className="px-6 py-4 font-semibold text-white">{a.athleteName}</td>
                      <td className="px-6 py-4 font-mono text-red-400 font-bold">{a.code}</td>
                      <td className="px-6 py-4 text-gray-300">{a.position || "—"}</td>
                      <td className="px-6 py-4 text-gray-300">{a.school || "—"}</td>
                      <td className="px-6 py-4 text-gray-300">{a.gradYear || "—"}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {a.issuedAt ? new Date(a.issuedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          if (!a.expiresAt) return <span className="text-gray-600">—</span>
                          const now = new Date()
                          const exp = new Date(a.expiresAt)
                          const days = Math.ceil((exp.getTime() - now.getTime()) / 86400000)
                          if (days <= 0) return <span className="text-red-400 font-semibold text-xs">EXPIRED</span>
                          if (days <= 30) return <span className="text-yellow-400 text-xs font-semibold">{exp.toLocaleDateString()} <span className="text-yellow-600">({days}d)</span></span>
                          return <span className="text-gray-400 text-xs">{exp.toLocaleDateString()}</span>
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/athletes/edit?code=${a.code}`}
                            className="text-xs bg-red-700 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors text-white"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/verify/${a.code}`}
                            className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors"
                            target="_blank"
                          >
                            View
                          </Link>
                          <SendContactButtons athlete={a} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {athletes.map((a, i) => (
                <div key={a.code} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-white">{a.athleteName}</p>
                      <p className="font-mono text-red-400 text-sm font-bold">{a.code}</p>
                    </div>
                    <span className="text-gray-600 text-xs">#{athletes.length - i}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                    <p>Position: <span className="text-gray-300">{a.position || "—"}</span></p>
                    <p>Class: <span className="text-gray-300">{a.gradYear || "—"}</span></p>
                    <p className="col-span-2">School: <span className="text-gray-300">{a.school || "—"}</span></p>
                    <p>Issued: <span className="text-gray-300">{a.issuedAt ? new Date(a.issuedAt).toLocaleDateString() : "—"}</span></p>
                    <p>Expires: {(() => {
                      if (!a.expiresAt) return <span className="text-gray-600">—</span>
                      const now = new Date()
                      const exp = new Date(a.expiresAt)
                      const days = Math.ceil((exp.getTime() - now.getTime()) / 86400000)
                      if (days <= 0) return <span className="text-red-400 font-semibold">EXPIRED</span>
                      if (days <= 30) return <span className="text-yellow-400">{exp.toLocaleDateString()} ({days}d left)</span>
                      return <span className="text-gray-300">{exp.toLocaleDateString()}</span>
                    })()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/athletes/edit?code=${a.code}`}
                      className="flex-1 text-center text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/verify/${a.code}`}
                      className="flex-1 text-center text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
                      target="_blank"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
