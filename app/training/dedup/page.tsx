"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"

interface Session { date: string; fortyYard?: number; verticalJump?: number }
interface Athlete {
  id: string; name: string; age: number; grade: string
  school: string; position?: string; joinedAt: string; sessions: Session[]
}

interface DuplicateGroup {
  name: string
  athletes: Athlete[]
}

export default function DedupPage() {
  const [groups, setGroups] = useState<DuplicateGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [msg, setMsg] = useState("")

  const fetchAndFindDupes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/training")
      const data = await res.json()
      if (!data.success) return

      const athletes: Athlete[] = data.athletes
      const map = new Map<string, Athlete[]>()
      for (const a of athletes) {
        const key = a.name.trim().toLowerCase()
        if (!map.has(key)) map.set(key, [])
        map.get(key)!.push(a)
      }

      const dupes: DuplicateGroup[] = []
      for (const [, group] of map) {
        if (group.length > 1) {
          dupes.push({
            name: group[0].name,
            athletes: group.sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()),
          })
        }
      }
      setGroups(dupes)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAndFindDupes() }, [fetchAndFindDupes])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name} (${id})? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch("/api/training/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) {
        setMsg(`✓ Deleted ${id}`)
        setTimeout(() => setMsg(""), 3000)
        await fetchAndFindDupes()
      }
    } catch { setMsg("Failed to delete.") }
    setDeleting(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Duplicate Cleaner</h1>
            <p className="text-gray-400 text-sm">Review and remove duplicate athlete entries</p>
            <Link href="/training" className="text-xs text-gray-600 hover:text-gray-400 underline mt-0.5 block">← Training Roster</Link>
          </div>
          <LogoutButton />
        </div>

        {msg && <div className="bg-green-950 border border-green-800 rounded-xl px-4 py-3 text-green-300 text-sm mb-6">{msg}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-600">Scanning roster...</div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-400 font-semibold text-lg">No duplicates found</p>
            <p className="text-gray-600 text-sm">Your roster is clean.</p>
            <Link href="/training" className="text-red-400 underline text-sm mt-2">← Back to Roster</Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-yellow-950 border border-yellow-800 rounded-xl px-4 py-3">
              <p className="text-yellow-300 font-semibold text-sm">Found {groups.length} duplicate name{groups.length !== 1 ? "s" : ""}</p>
              <p className="text-yellow-600 text-xs mt-0.5">Keep the entry with the most sessions. Delete the others.</p>
            </div>

            {groups.map((group) => (
              <div key={group.name} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
                  <p className="font-bold text-white">{group.name}</p>
                  <span className="text-xs text-yellow-400 font-semibold">{group.athletes.length} entries</span>
                </div>
                <div className="divide-y divide-gray-800">
                  {group.athletes.map((a, i) => {
                    const lastSession = a.sessions?.length ? a.sessions[a.sessions.length - 1] : null
                    const isFirst = i === 0
                    return (
                      <div key={a.id} className={`px-6 py-4 flex items-center justify-between gap-4 ${isFirst ? "bg-green-950/20" : ""}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-mono text-sm text-red-400 font-bold">{a.id}</p>
                            {isFirst && <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">Oldest — likely keep</span>}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-400">
                            <p>Age: <span className="text-gray-300">{a.age}</span></p>
                            <p>Grade: <span className="text-gray-300">{a.grade || "—"}</span></p>
                            <p>Sessions: <span className={`font-bold ${a.sessions?.length ? "text-white" : "text-gray-600"}`}>{a.sessions?.length ?? 0}</span></p>
                            <p>Last tested: <span className="text-gray-300">{lastSession ? new Date(lastSession.date).toLocaleDateString() : "Never"}</span></p>
                            <p>Joined: <span className="text-gray-300">{new Date(a.joinedAt).toLocaleDateString()}</span></p>
                            <p>School: <span className="text-gray-300">{a.school || "—"}</span></p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Link href={`/training/${a.id}`} target="_blank"
                            className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors">
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(a.id, a.name)}
                            disabled={deleting === a.id}
                            className="text-xs bg-red-900 hover:bg-red-700 disabled:bg-gray-700 text-red-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors font-semibold"
                          >
                            {deleting === a.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
