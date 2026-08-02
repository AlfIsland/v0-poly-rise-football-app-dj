export type Division = "HS" | "MS"
// [name, school, value, rank]  —  rank is not always sequential (ties are valid)
export type BoardRow = [string, string, string, number]
export interface Board { event: string; div: Division; rows: BoardRow[] }

// ── UPDATE AFTER EACH COMBINE ─────────────────────────────────────────────────
// Add/edit rows here. Rank values may repeat (ties). Values are display strings.
export const BOARDS: Board[] = [
  {
    event: "40 Yard Dash", div: "HS",
    rows: [
      ["Gabriel Peach",        "Hays H.S",              "4.48", 1],
      ["Kingston Sanchez",     "PolyRISE Athletix",     "4.57", 2],
      ["Connor Schulenberg",   "Lake Travis H.S",       "4.79", 3],
      ["Jackson Schorsch",     "Hays H.S",              "4.81", 4],
      ["Brayden Ramirez",      "Marble Falls H.S",      "4.82", 5],
    ],
  },
  {
    event: "40 Yard Dash", div: "MS",
    rows: [
      ["Dalton Medford",       "PolyRISE Athletix",     "4.91", 1],
      ["Chris Moreno",         "Paredes MS",            "5.04", 2],
      ["Quincy Rodriquez",     "Burnet M.S",            "5.09", 3],
      ["Jrake Ramirez",        "Marble Falls M.S",      "5.15", 4],
    ],
  },
  {
    event: "Broad Jump", div: "HS",
    rows: [
      ["Gabriel Peach",        "Hays H.S",              "120.0", 1],
      ["Carter Brown",         "Dripping Springs H.S",  "105.0", 2],
      ["Connor Schulenberg",   "Lake Travis H.S",       "101.5", 3],
      ["Cooper Mills",         "Buda Johnson H.S",      "100.8", 4],
    ],
  },
  {
    event: "Broad Jump", div: "MS",
    rows: [
      ["Chris Moreno",         "Paredes MS",            "101.0", 1],
      ["Hayden Vu",            "SSMS",                  "95.0",  2],
      ["Elijah Sanchez",       "Marble Falls M.S",      "91.0",  3],
      ["Aundra Hawkins",       "PolyRISE Athletix",     "88.0",  4],
      ["Jrake Ramirez",        "Marble Falls M.S",      "87.5",  5],
    ],
  },
  {
    event: "Vertical Jump", div: "HS",
    rows: [
      ["Gabriel Peach",        "Hays H.S",              "36.0",  1],
      ["Jackson Schorsch",     "Hays H.S",              "30.0",  2],
      ["Jaxen Garza",          "Dripping Springs H.S",  "29.0",  3],
      ["Cruz Launey",          "St. Michael's H.S",     "28.0",  4],
      ["Connor Schulenberg",   "Lake Travis H.S",       "28.0",  4],
      ["Carter Brown",         "Dripping Springs H.S",  "27.0",  6],
    ],
  },
  {
    event: "Vertical Jump", div: "MS",
    rows: [
      ["Chris Moreno",         "Paredes MS",            "30.0",  1],
      ["Jrake Ramirez",        "Marble Falls M.S",      "24.0",  2],
      ["Elijah Sanchez",       "Marble Falls M.S",      "23.0",  3],
      ["Aundra Hawkins",       "PolyRISE Athletix",     "23.0",  3],
      ["Hayden Vu",            "SSMS",                  "23.0",  3],
      ["Noah Cohn",            "PolyRISE Athletix",     "23.0",  3],
      ["Jaxon Villa",          "Sycamore Springs M.S",  "23.0",  3],
    ],
  },
  {
    event: "Bench · Over 200 lbs", div: "HS",
    rows: [
      ["Lemanatele Kneubuhl",  "Dripping Springs H.S",  "185 x 35", 1],
      ["Santiago Navea",       "Hays H.S",              "185 x 25", 2],
      ["Cruz Launey",          "St. Michael's H.S",     "185 x 16", 3],
    ],
  },
  {
    event: "Bench · Under 200 lbs", div: "HS",
    rows: [
      ["Gabriel Peach",        "Hays H.S",              "185 x 30", 1],
      ["Jaxen Garza",          "Dripping Springs H.S",  "185 x 22", 2],
      ["Atanas Ivanov",        "Bowie H.S",             "185 x 20", 3],
      ["Jackson Schorsch",     "Hays H.S",              "185 x 15", 4],
      ["Ryker Beck",           "Dripping Springs H.S",  "185 x 13", 5],
    ],
  },
  {
    event: "5-10-5 Shuttle", div: "HS",
    rows: [
      ["Cooper Mills",         "Buda Johnson H.S",      "4.58",  1],
      ["Jackson Schorsch",     "Hays H.S",              "4.72",  2],
      ["Wilder Marsh",         "PolyRISE Athletix",     "4.73",  3],
      ["Gabriel Peach",        "Hays H.S",              "4.75",  4],
    ],
  },
  {
    event: "5-10-5 Shuttle", div: "MS",
    rows: [
      ["Chris Moreno",         "Paredes MS",            "4.68",  1],
      ["Quincy Rodriquez",     "Burnet M.S",            "4.88",  2],
      ["Jrake Ramirez",        "Marble Falls M.S",      "4.89",  3],
      ["Elijah Sanchez",       "Marble Falls M.S",      "4.90",  4],
      ["Jackson Boswell",      "Sycamore Springs M.S",  "4.91",  5],
    ],
  },
  {
    event: "L-Drill", div: "HS",
    rows: [
      ["Brayden Ramirez",      "Marble Falls H.S",      "7.41",  1],
      ["Gabriel Peach",        "Hays H.S",              "7.80",  2],
      ["Carter Brown",         "Dripping Springs H.S",  "7.85",  3],
      ["Ryker Beck",           "Dripping Springs H.S",  "7.86",  4],
    ],
  },
  {
    event: "L-Drill", div: "MS",
    rows: [
      ["Quincy Rodriquez",     "Burnet M.S",            "7.75",  1],
      ["Chris Moreno",         "Paredes MS",            "7.81",  2],
      ["Jrake Ramirez",        "Marble Falls M.S",      "7.91",  3],
      ["Elijah Sanchez",       "Marble Falls M.S",      "8.05",  4],
    ],
  },
]
// ─────────────────────────────────────────────────────────────────────────────

export const TOTAL_EVENTS  = 6
export const TOTAL_BOARDS  = BOARDS.length

/** Count of unique schools across all boards (excludes PolyRISE Athletix house entries) */
export function uniqueSchoolCount(boards: Board[]): number {
  const s = new Set<string>()
  boards.forEach(b => b.rows.forEach(([, school]) => {
    if (school && school !== "PolyRISE Athletix") s.add(school)
  }))
  return s.size
}

/** Filter boards by athlete name or school, filtering rows within each matching board. */
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
