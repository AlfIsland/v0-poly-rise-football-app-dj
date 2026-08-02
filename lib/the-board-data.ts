export type Division = "HS" | "MS"
// [name, school, value, rank]  —  rank is not always sequential (ties are valid)
export type BoardRow = [string, string, string, number]
export interface Board { event: string; div: Division; rows: BoardRow[] }

// ── UPDATE AFTER EACH COMBINE ─────────────────────────────────────────────────
// Add/edit rows here. Rank values may repeat (ties). Values are display strings.
// Leave school as "" if unknown; it will not render.
export const BOARDS: Board[] = [
  {
    event: "40 Yard Dash", div: "HS",
    rows: [
      ["Gabriel Peach",    "", "4.50", 1],
      ["Kingston Sanchez", "", "4.57", 2],
    ],
  },
  { event: "40 Yard Dash",          div: "MS", rows: [] },
  { event: "Broad Jump",            div: "HS", rows: [] },
  { event: "Broad Jump",            div: "MS", rows: [] },
  { event: "Vertical Jump",         div: "HS", rows: [] },
  { event: "Vertical Jump",         div: "MS", rows: [] },
  { event: "Bench — Over 200 lbs",  div: "HS", rows: [] },
  { event: "Bench — Under 200 lbs", div: "HS", rows: [] },
  { event: "5-10-5 Shuttle",        div: "HS", rows: [] },
  { event: "5-10-5 Shuttle",        div: "MS", rows: [] },
  { event: "L-Drill",               div: "HS", rows: [] },
  { event: "L-Drill",               div: "MS", rows: [] },
]
// ─────────────────────────────────────────────────────────────────────────────

export const TOTAL_EVENTS  = 6
export const TOTAL_BOARDS  = BOARDS.length

/** Count of unique non-empty schools across all boards */
export function uniqueSchoolCount(boards: Board[]): number {
  const s = new Set<string>()
  boards.forEach(b => b.rows.forEach(([, school]) => { if (school) s.add(school) }))
  return s.size
}

/** Filter boards by athlete name or school. Empty-row boards always show when no query. */
export function filterBoards(boards: Board[], query: string): Board[] {
  if (!query.trim()) return boards
  const q = query.toLowerCase()
  return boards
    .map(b => ({
      ...b,
      rows: b.rows.filter(([name, school]) =>
        name.toLowerCase().includes(q) || school.toLowerCase().includes(q)
      ),
    }))
    .filter(b => b.rows.length > 0)
}
