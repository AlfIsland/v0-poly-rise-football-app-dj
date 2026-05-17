"use client"

import { useState } from "react"
import { EducationAccolade, EDUCATION_PRESETS } from "@/lib/accolades"

interface Props {
  accolades: EducationAccolade[]
  onChange: (accolades: EducationAccolade[]) => void
}

const CURRENT_YEAR = new Date().getFullYear().toString()

export default function EducationAccoladesEditor({ accolades, onChange }: Props) {
  const [customTitle,  setCustomTitle]  = useState("")
  const [customYear,   setCustomYear]   = useState(CURRENT_YEAR)
  const [customDetail, setCustomDetail] = useState("")
  const [showCustom,   setShowCustom]   = useState(false)

  function addPreset(preset: typeof EDUCATION_PRESETS[number]) {
    onChange([...accolades, { id: crypto.randomUUID(), title: preset.title, year: CURRENT_YEAR }])
  }

  function addCustom() {
    if (!customTitle.trim() || !customYear.trim()) return
    onChange([
      ...accolades,
      { id: crypto.randomUUID(), title: customTitle.trim(), year: customYear.trim(), detail: customDetail.trim() || undefined },
    ])
    setCustomTitle(""); setCustomYear(CURRENT_YEAR); setCustomDetail(""); setShowCustom(false)
  }

  function remove(id: string) {
    onChange(accolades.filter(a => a.id !== id))
  }

  function update(id: string, field: "year" | "detail", val: string) {
    onChange(accolades.map(a => a.id === id ? { ...a, [field]: val || undefined } : a))
  }

  return (
    <div className="space-y-4">

      {accolades.length > 0 && (
        <div className="space-y-2">
          {accolades.map(a => (
            <div key={a.id} className="flex items-start gap-2 bg-gray-800 rounded-xl p-3 border border-gray-700">
              <span className="text-xl mt-0.5 shrink-0">📚</span>
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="text-sm font-semibold text-white truncate">{a.title}</p>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text" value={a.year}
                    onChange={e => update(a.id, "year", e.target.value)}
                    placeholder="Year"
                    className="w-20 bg-gray-700 text-white rounded-lg px-2 py-1 border border-gray-600 focus:border-green-500 focus:outline-none text-xs"
                  />
                  <input
                    type="text" value={a.detail ?? ""}
                    onChange={e => update(a.id, "detail", e.target.value)}
                    placeholder="Detail (e.g. 3.9 GPA, Top 5%)"
                    className="flex-1 min-w-28 bg-gray-700 text-white rounded-lg px-2 py-1 border border-gray-600 focus:border-green-500 focus:outline-none text-xs placeholder-gray-500"
                  />
                </div>
              </div>
              <button type="button" onClick={() => remove(a.id)}
                className="text-gray-500 hover:text-red-400 transition-colors text-lg leading-none shrink-0 mt-0.5">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="text-xs text-gray-500 mb-2">Quick Add</p>
        <div className="flex flex-wrap gap-1.5">
          {EDUCATION_PRESETS.map(p => (
            <button key={p.title} type="button" onClick={() => addPreset(p)}
              className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-2.5 py-1.5 rounded-lg transition-colors">
              📚 {p.title}
            </button>
          ))}
        </div>
      </div>

      {!showCustom ? (
        <button type="button" onClick={() => setShowCustom(true)}
          className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors">
          + Add custom education achievement
        </button>
      ) : (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Custom Achievement</p>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Title <span className="text-red-400">*</span></label>
            <input type="text" value={customTitle} onChange={e => setCustomTitle(e.target.value)}
              placeholder="e.g. Superintendent's Honor Roll"
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-green-500 focus:outline-none placeholder-gray-500 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Year <span className="text-red-400">*</span></label>
              <input type="text" value={customYear} onChange={e => setCustomYear(e.target.value)}
                placeholder="2025"
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-green-500 focus:outline-none placeholder-gray-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Detail (optional)</label>
              <input type="text" value={customDetail} onChange={e => setCustomDetail(e.target.value)}
                placeholder="e.g. 4.0 GPA"
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-green-500 focus:outline-none placeholder-gray-500 text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={addCustom} disabled={!customTitle.trim() || !customYear.trim()}
              className="flex-1 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg py-2 text-sm transition-colors">
              Add
            </button>
            <button type="button" onClick={() => setShowCustom(false)}
              className="px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
