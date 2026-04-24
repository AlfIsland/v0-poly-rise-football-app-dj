"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"
import { type Camp } from "@/app/api/camps/route"

const TYPE_LABELS = { polyrise: "PolyRISE", college: "College", elite: "Elite/Showcase", regional: "Regional" }
const TYPE_COLORS = {
  polyrise: "bg-red-900/60 text-red-300 border-red-700/50",
  college:  "bg-blue-900/60 text-blue-300 border-blue-700/50",
  elite:    "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",
  regional: "bg-green-900/60 text-green-300 border-green-700/50",
}

const BLANK: Omit<Camp, "id" | "createdAt" | "active"> = {
  name: "", organizer: "", type: "elite", sports: ["football"],
  grades: [], date: "", location: "", description: "", registrationUrl: "", featured: false,
}

export default function AdminCampsPage() {
  const [camps, setCamps] = useState<Camp[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Camp | null>(null)
  const [form, setForm] = useState({ ...BLANK })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCamps() }, [])

  async function loadCamps() {
    setLoading(true)
    const res = await fetch("/api/admin/camps")
    const data = await res.json()
    if (data.success) setCamps(data.camps)
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setForm({ ...BLANK })
    setShowForm(true)
  }

  function openEdit(camp: Camp) {
    setEditing(camp)
    setForm({
      name: camp.name, organizer: camp.organizer, type: camp.type,
      sports: camp.sports, grades: camp.grades, date: camp.date,
      location: camp.location, description: camp.description,
      registrationUrl: camp.registrationUrl, featured: camp.featured,
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    const method = editing ? "PUT" : "POST"
    const body = editing ? { ...form, id: editing.id } : form
    const res = await fetch("/api/admin/camps", {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    })
    const data = await res.json()
    if (data.success) { setShowForm(false); await loadCamps() }
    setSaving(false)
  }

  async function toggleActive(camp: Camp) {
    await fetch("/api/admin/camps", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: camp.id, active: !camp.active }),
    })
    await loadCamps()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this camp?")) return
    await fetch("/api/admin/camps", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    await loadCamps()
  }

  function toggleSport(sport: string) {
    setForm(f => ({
      ...f, sports: f.sports.includes(sport) ? f.sports.filter(s => s !== sport) : [...f.sports, sport]
    }))
  }

  const SPORTS = ["football", "soccer", "basketball", "baseball", "softball", "track"]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Admin</Link>
          <div>
            <h1 className="text-xl font-bold">Camp Manager</h1>
            <p className="text-xs text-gray-500">{camps.filter(c => c.active).length} active camps</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openNew}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
            + Add Camp
          </button>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Add/Edit form */}
        {showForm && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">
              {editing ? "Edit Camp" : "Add New Camp"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Camp Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Nike The Opening"
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500 placeholder-gray-600" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Organizer *</label>
                <input value={form.organizer} onChange={e => setForm(f => ({ ...f, organizer: e.target.value }))}
                  placeholder="e.g. Nike, PolyRISE, Under Armour"
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500 placeholder-gray-600" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Date</label>
                <input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  placeholder="e.g. June 14, 2026 or Summer 2026"
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500 placeholder-gray-600" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Location</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Dripping Springs, TX"
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500 placeholder-gray-600" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Registration URL *</label>
                <input value={form.registrationUrl} onChange={e => setForm(f => ({ ...f, registrationUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500 placeholder-gray-600" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2} placeholder="Brief description of what this camp offers..."
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500 placeholder-gray-600 resize-none" />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Camp Type</label>
              <div className="flex gap-2 flex-wrap">
                {(Object.entries(TYPE_LABELS) as [Camp["type"], string][]).map(([t, label]) => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-colors ${form.type === t ? TYPE_COLORS[t] : "border-gray-700 text-gray-500 hover:text-white"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sports */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Sports</label>
              <div className="flex gap-2 flex-wrap">
                {SPORTS.map(s => (
                  <button key={s} type="button" onClick={() => toggleSport(s)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-semibold capitalize transition-colors ${form.sports.includes(s) ? "bg-red-900/60 text-red-300 border-red-700/50" : "border-gray-700 text-gray-500 hover:text-white"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-300">Feature this camp (shows at top of list)</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={!form.name || !form.registrationUrl || saving}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors">
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Camp"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white text-sm px-4 py-2.5 rounded-xl border border-gray-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading && <p className="text-center text-gray-500 py-12">Loading...</p>}

        {!loading && camps.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <p className="text-lg font-bold mb-2">No camps yet</p>
            <p className="text-sm">Click &quot;+ Add Camp&quot; to add your first camp recommendation</p>
          </div>
        )}

        {!loading && camps.length > 0 && (
          <div className="space-y-3">
            {camps.map(camp => (
              <div key={camp.id} className={`bg-gray-900 border ${camp.active ? "border-white/10" : "border-white/5 opacity-50"} rounded-2xl p-5`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-white font-bold">{camp.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${TYPE_COLORS[camp.type]}`}>
                        {TYPE_LABELS[camp.type]}
                      </span>
                      {camp.featured && <span className="text-xs bg-yellow-500 text-black font-black px-2 py-0.5 rounded-full">FEATURED</span>}
                      {!camp.active && <span className="text-xs text-gray-500 border border-gray-700 px-2 py-0.5 rounded-full">Inactive</span>}
                    </div>
                    <p className="text-gray-400 text-xs">{camp.organizer}{camp.date ? ` · ${camp.date}` : ""}{camp.location ? ` · ${camp.location}` : ""}</p>
                    {camp.description && <p className="text-gray-500 text-xs mt-1 leading-relaxed">{camp.description}</p>}
                    <p className="text-blue-400 text-xs mt-1 truncate">{camp.registrationUrl}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {camp.sports.map(s => (
                        <span key={s} className="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-full capitalize">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => openEdit(camp)}
                      className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                    <button onClick={() => toggleActive(camp)}
                      className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
                      {camp.active ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => handleDelete(camp.id)}
                      className="text-xs bg-red-900/40 hover:bg-red-900/70 text-red-400 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
