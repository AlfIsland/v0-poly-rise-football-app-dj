"use client"

import { useState } from "react"
import { Accolade, ACCOLADE_PRESETS, accoladeEmoji } from "@/lib/accolades"

interface Props {
  accolades: Accolade[]
  onChange: (accolades: Accolade[]) => void
}

const CURRENT_YEAR = new Date().getFullYear().toString()

export default function AccoladesEditor({ accolades, onChange }: Props) {
  const [customTitle, setCustomTitle] = useState("")
  const [customYear, setCustomYear]   = useState(CURRENT_YEAR)
  const [customOrg, setCustomOrg]     = useState("")
  const [customType, setCustomType]   = useState<Accolade["type"]>("team")
  const [showCustom, setShowCustom]   = useState(false)

  function addPreset(preset: typeof ACCOLADE_PRESETS[number]) {
    const id = crypto.randomUUID()
    onChange([...accolades, { id, title: preset.title, year: CURRENT_YEAR, type: preset.type }])
  }

  function addCustom() {
    if (!customTitle.trim() || !customYear.trim()) return
    const id = crypto.randomUUID()
    onChange([
      ...accolades,
      { id, title: customTitle.trim(), year: customYear.trim(), organization: customOrg.trim() || undefined, type: customType },
    ])
    setCustomTitle("")
    setCustomOrg("")
    setCustomYear(CURRENT_YEAR)
    setShowCustom(false)
  }

  function remove(id: string) {
    onChange(accolades.filter(a => a.id !== id))
  }

  function updateYear(id: string, year: string) {
    onChange(accolades.map(a => a.id === id ? { ...a, year } : a))
  }

  function updateOrg(id: string, org: string) {
    onChange(accolades.map(a => a.id === id ? { ...a, organization: org || undefined } : a))
  }

  return (
    <div className="space-y-4">

      {/* Current accolades list */}
      {accolades.length > 0 && (
        <div className="space-y-2">
          {accolades.map(a => (
            <div key={a.id} className="flex items-start gap-2 bg-gray-800 rounded-xl p-3 border border-gray-700">
              <span className="text-xl mt-0.5 shrink-0">{accoladeEmoji(a.type)}</span>
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="text-sm font-semibold text-white truncate">{a.title}</p>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    value={a.year}
                    onChange={e => updateYear(a.id, e.target.value)}
                    placeholder="Year"
                    className="w-20 bg-gray-700 text-white rounded-lg px-2 py-1 border border-gray-600 focus:border-red-500 focus:outline-none text-xs"
                  />
                  <input
                    type="text"
                    value={a.organization ?? ""}
                    onChange={e => updateOrg(a.id, e.target.value)}
                    placeholder="District / Organization (optional)"
                    className="flex-1 min-w-28 bg-gray-700 text-white rounded-lg px-2 py-1 border border-gray-600 focus:border-red-500 focus:outline-none text-xs placeholder-gray-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(a.id)}
                className="text-gray-500 hover:text-red-400 transition-colors text-lg leading-none shrink-0 mt-0.5"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick-add presets */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Quick Add</p>
        <div className="flex flex-wrap gap-1.5">
          {ACCOLADE_PRESETS.map(p => (
            <button
              key={p.title}
              type="button"
              onClick={() => addPreset(p)}
              className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              {p.emoji} {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Custom accolade */}
      {!showCustom ? (
        <button
          type="button"
          onClick={() => setShowCustom(true)}
          className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors"
        >
          + Add custom accolade
        </button>
      ) : (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Custom Accolade</p>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Award Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder="e.g. Comeback Player of the Year"
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none placeholder-gray-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Year <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={customYear}
                onChange={e => setCustomYear(e.target.value)}
                placeholder="2024"
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none placeholder-gray-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <select
                value={customType}
                onChange={e => setCustomType(e.target.value as Accolade["type"])}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none text-sm"
              >
                <option value="mvp">MVP / POY</option>
                <option value="offensive">Offensive</option>
                <option value="defensive">Defensive</option>
                <option value="team">All-Team</option>
                <option value="academic">Academic</option>
                <option value="character">Character</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Organization (optional)</label>
            <input
              type="text"
              value={customOrg}
              onChange={e => setCustomOrg(e.target.value)}
              placeholder="e.g. District 25-5A, THSCA"
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none placeholder-gray-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addCustom}
              disabled={!customTitle.trim() || !customYear.trim()}
              className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg py-2 text-sm transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCustom(false)}
              className="px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
