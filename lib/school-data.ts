export type Division = "D1" | "D2" | "D3" | "NAIA" | "JuCo"
export type Sport = "football" | "soccer" | "basketball" | "baseball" | "track" | "softball"
export type PositionGroup = "speed" | "athletic" | "lineman"
export type MatchQuality = "elite" | "strong" | "possible" | "reach"

// ─── Position group classification ────────────────────────────────────────────
export function getPositionGroup(position?: string): PositionGroup {
  if (!position) return "speed"
  const p = position.toLowerCase()
  if (["ol","og","ot","oc","c","g","t","dl","de","dt","nt","tackle","guard","center","lineman","end","nt"].some(x => p.includes(x))) return "lineman"
  if (["qb","lb","te","quarterback","linebacker","tight end","fb","fullback"].some(x => p.includes(x))) return "athletic"
  return "speed" // WR, CB, DB, S, RB, KR, etc.
}

// ─── Speed benchmarks (40-yard dash) ─────────────────────────────────────────
// Lower is faster/better. These are times needed to COMPETE at each level.
export const FORTY_BENCHMARKS: Record<PositionGroup, Record<Division, number>> = {
  speed:    { D1: 4.50, D2: 4.65, D3: 4.80, NAIA: 4.85, JuCo: 4.90 },
  athletic: { D1: 4.75, D2: 4.90, D3: 5.00, NAIA: 5.10, JuCo: 5.15 },
  lineman:  { D1: 5.30, D2: 5.40, D3: 5.55, NAIA: 5.60, JuCo: 5.65 },
}

// ─── Weight benchmarks (lbs) by position group and division ──────────────────
// Typical size range coaches look for at each level
export const WEIGHT_BENCHMARKS: Record<PositionGroup, Record<Division, { min: number; max: number }>> = {
  speed: {
    D1:   { min: 170, max: 215 },
    D2:   { min: 160, max: 210 },
    D3:   { min: 155, max: 205 },
    NAIA: { min: 150, max: 200 },
    JuCo: { min: 145, max: 200 },
  },
  athletic: {
    D1:   { min: 215, max: 260 },
    D2:   { min: 205, max: 250 },
    D3:   { min: 200, max: 245 },
    NAIA: { min: 195, max: 240 },
    JuCo: { min: 190, max: 235 },
  },
  lineman: {
    D1:   { min: 280, max: 340 },
    D2:   { min: 265, max: 325 },
    D3:   { min: 255, max: 315 },
    NAIA: { min: 250, max: 310 },
    JuCo: { min: 245, max: 305 },
  },
}

// ─── Vertical jump benchmarks (inches) ───────────────────────────────────────
// Higher is better
export const VERTICAL_BENCHMARKS: Record<PositionGroup, Record<Division, number>> = {
  speed:    { D1: 38, D2: 34, D3: 32, NAIA: 30, JuCo: 28 },
  athletic: { D1: 34, D2: 30, D3: 28, NAIA: 27, JuCo: 26 },
  lineman:  { D1: 28, D2: 26, D3: 24, NAIA: 23, JuCo: 22 },
}

// ─── Match breakdown types ────────────────────────────────────────────────────
export interface SpeedBreakdown {
  value: number
  benchmark: number
  delta: number       // negative = faster = better
  label: string
  pass: boolean
}
export interface SizeBreakdown {
  value: number
  min: number
  max: number
  inRange: boolean
  delta: number       // 0 if in range, negative = under, positive = over
  label: string
  pass: boolean
}
export interface VerticalBreakdown {
  value: number
  benchmark: number
  delta: number       // positive = better
  label: string
  pass: boolean
}

export interface MatchBreakdown {
  speed?: SpeedBreakdown
  size?: SizeBreakdown
  vertical?: VerticalBreakdown
  score: number         // 0–100 composite
  metricsUsed: number
}

// ─── Composite match scoring ──────────────────────────────────────────────────
// Speed = 45pts, Size = 35pts, Vertical = 20pts
export function getDetailedMatch(
  metrics: { fortyYard?: number; weight?: number; verticalJump?: number },
  posGroup: PositionGroup,
  division: Division
): { quality: MatchQuality | null; breakdown: MatchBreakdown } {
  const breakdown: MatchBreakdown = { score: 0, metricsUsed: 0 }
  let totalPoints = 0
  let maxPoints = 0

  // Speed (40-yard dash) ── 45 pts
  if (metrics.fortyYard != null) {
    const bench = FORTY_BENCHMARKS[posGroup][division]
    const delta = metrics.fortyYard - bench
    let pts = 0
    if (delta <= -0.15) pts = 45
    else if (delta <= -0.05) pts = 36
    else if (delta <=  0.05) pts = 27
    else if (delta <=  0.15) pts = 18
    else if (delta <=  0.25) pts = 9
    const label = delta <= 0
      ? `${Math.abs(delta).toFixed(2)}s faster than D${division} benchmark`
      : `${delta.toFixed(2)}s slower than D${division} benchmark`
    breakdown.speed = { value: metrics.fortyYard, benchmark: bench, delta, label, pass: delta <= 0.05 }
    totalPoints += pts
    maxPoints += 45
    breakdown.metricsUsed++
  }

  // Weight / Size ── 35 pts
  if (metrics.weight != null) {
    const range = WEIGHT_BENCHMARKS[posGroup][division]
    const inRange = metrics.weight >= range.min && metrics.weight <= range.max
    const delta = inRange ? 0 : metrics.weight < range.min ? metrics.weight - range.min : metrics.weight - range.max
    let pts = 0
    if (inRange)                pts = 35
    else if (Math.abs(delta) <= 10) pts = 28
    else if (Math.abs(delta) <= 20) pts = 20
    else if (Math.abs(delta) <= 30) pts = 10
    const label = inRange
      ? `${metrics.weight} lbs — in typical range (${range.min}–${range.max})`
      : delta < 0
        ? `${Math.abs(delta)} lbs under typical ${division} range (${range.min}–${range.max})`
        : `${delta} lbs over typical ${division} range (${range.min}–${range.max})`
    breakdown.size = { value: metrics.weight, min: range.min, max: range.max, inRange, delta, label, pass: inRange || Math.abs(delta) <= 15 }
    totalPoints += pts
    maxPoints += 35
    breakdown.metricsUsed++
  }

  // Vertical Jump ── 20 pts
  if (metrics.verticalJump != null) {
    const bench = VERTICAL_BENCHMARKS[posGroup][division]
    const delta = metrics.verticalJump - bench
    let pts = 0
    if (delta >= 4)      pts = 20
    else if (delta >= 2) pts = 16
    else if (delta >= 0) pts = 12
    else if (delta >= -3) pts = 6
    const label = delta >= 0
      ? `${delta.toFixed(0)}" above ${division} benchmark (${bench}")`
      : `${Math.abs(delta).toFixed(0)}" below ${division} benchmark (${bench}")`
    breakdown.vertical = { value: metrics.verticalJump, benchmark: bench, delta, label, pass: delta >= -2 }
    totalPoints += pts
    maxPoints += 20
    breakdown.metricsUsed++
  }

  if (maxPoints === 0) return { quality: null, breakdown }

  const score = Math.round((totalPoints / maxPoints) * 100)
  breakdown.score = score

  let quality: MatchQuality | null = null
  if (score >= 75) quality = "elite"
  else if (score >= 55) quality = "strong"
  else if (score >= 38) quality = "possible"
  else if (score >= 22) quality = "reach"

  return { quality, breakdown }
}

// ─── Legacy single-metric match (keep for compatibility) ─────────────────────
export function getMatchQuality(fortyYard: number, posGroup: PositionGroup, division: Division): MatchQuality | null {
  return getDetailedMatch({ fortyYard }, posGroup, division).quality
}

// ─── Match quality display metadata ──────────────────────────────────────────
export const MATCH_META: Record<MatchQuality, { label: string; color: string; order: number; desc: string }> = {
  elite:    { label: "Elite Fit",    color: "bg-green-900/60 text-green-300 border-green-700/50",    order: 1, desc: "Athlete exceeds benchmarks — strong scholarship candidate" },
  strong:   { label: "Strong Fit",   color: "bg-blue-900/60 text-blue-300 border-blue-700/50",       order: 2, desc: "Athlete meets benchmarks — likely to receive interest" },
  possible: { label: "Possible Fit", color: "bg-yellow-900/60 text-yellow-300 border-yellow-700/50", order: 3, desc: "Close to benchmarks — needs development or strong film" },
  reach:    { label: "Reach",        color: "bg-orange-900/60 text-orange-300 border-orange-700/50", order: 4, desc: "Below benchmarks — significant development needed" },
}

// ─── Scholarship info by division ────────────────────────────────────────────
export function getScholarshipNote(division: Division): { note: string; color: string } {
  switch (division) {
    case "D1":   return { note: "Full athletic scholarships",           color: "text-green-400" }
    case "D2":   return { note: "Partial athletic scholarships",        color: "text-blue-400" }
    case "D3":   return { note: "Academic aid only — no athletic $",    color: "text-gray-400" }
    case "NAIA": return { note: "Athletic scholarships available",       color: "text-yellow-400" }
    case "JuCo": return { note: "Athletic aid + 2-yr transfer path",    color: "text-purple-400" }
  }
}

// ─── School data ──────────────────────────────────────────────────────────────
export interface School {
  name: string
  city: string
  state: string
  division: Division
  conference?: string
  sports: Sport[]
  url: string
}

export const SCHOOLS: School[] = [
  // ── Texas D1 ──────────────────────────────────────────────────────────────
  { name: "University of Texas at Austin",      city: "Austin",          state: "TX", division: "D1", conference: "SEC",       sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://texassports.com" },
  { name: "Texas A&M University",               city: "College Station", state: "TX", division: "D1", conference: "SEC",       sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://12thman.com" },
  { name: "TCU",                                city: "Fort Worth",      state: "TX", division: "D1", conference: "Big 12",    sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://gofrogs.com" },
  { name: "Baylor University",                  city: "Waco",            state: "TX", division: "D1", conference: "Big 12",    sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://baylorbears.com" },
  { name: "Texas Tech University",              city: "Lubbock",         state: "TX", division: "D1", conference: "Big 12",    sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://texastech.com" },
  { name: "SMU",                                city: "Dallas",          state: "TX", division: "D1", conference: "ACC",       sports: ["football","basketball","soccer","track"], url: "https://smumustangs.com" },
  { name: "Rice University",                    city: "Houston",         state: "TX", division: "D1", conference: "AAC",       sports: ["football","basketball","baseball","soccer","track"], url: "https://riceowls.com" },
  { name: "UTSA",                               city: "San Antonio",     state: "TX", division: "D1", conference: "AAC",       sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://utsaathletics.com" },
  { name: "University of North Texas",          city: "Denton",          state: "TX", division: "D1", conference: "AAC",       sports: ["football","basketball","soccer","track","softball"], url: "https://meangreensports.com" },
  { name: "Texas State University",             city: "San Marcos",      state: "TX", division: "D1", conference: "Sun Belt",  sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://txstatebobcats.com" },
  { name: "Sam Houston State University",       city: "Huntsville",      state: "TX", division: "D1", conference: "UAC",       sports: ["football","basketball","baseball","track","softball"], url: "https://gobearkats.com" },
  { name: "Stephen F. Austin State University", city: "Nacogdoches",     state: "TX", division: "D1", conference: "UAC",       sports: ["football","basketball","baseball","track","softball"], url: "https://sfajacks.com" },
  { name: "Lamar University",                   city: "Beaumont",        state: "TX", division: "D1", conference: "UAC",       sports: ["football","basketball","baseball","track","softball"], url: "https://lamarcardinals.com" },
  { name: "Prairie View A&M University",        city: "Prairie View",    state: "TX", division: "D1", conference: "SWAC",      sports: ["football","basketball","baseball","track","softball"], url: "https://pvpanthers.com" },
  { name: "Texas Southern University",          city: "Houston",         state: "TX", division: "D1", conference: "SWAC",      sports: ["football","basketball","baseball","track","softball"], url: "https://tsusports.com" },
  { name: "Abilene Christian University",       city: "Abilene",         state: "TX", division: "D1", conference: "UAC",       sports: ["football","basketball","baseball","track","softball"], url: "https://acuwildcats.com" },
  { name: "Tarleton State University",          city: "Stephenville",    state: "TX", division: "D1", conference: "UAC",       sports: ["football","basketball","baseball","track","softball"], url: "https://tarletonsports.com" },
  { name: "UTEP",                               city: "El Paso",         state: "TX", division: "D1", conference: "CUSA",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://utepminers.com" },
  { name: "University of Houston",              city: "Houston",         state: "TX", division: "D1", conference: "Big 12",    sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://uhcougars.com" },

  // ── Texas D2 ──────────────────────────────────────────────────────────────
  { name: "West Texas A&M University",          city: "Canyon",          state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://wtambuffs.com" },
  { name: "Texas A&M-Commerce",                 city: "Commerce",        state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://tamuc.edu/athletics" },
  { name: "Angelo State University",            city: "San Angelo",      state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","track","softball"], url: "https://angelosports.com" },
  { name: "Midwestern State University",        city: "Wichita Falls",   state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://msumustangs.com" },
  { name: "Texas A&M-Kingsville",               city: "Kingsville",      state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","track","softball"], url: "https://tamuk.edu/athletics" },
  { name: "Sul Ross State University",          city: "Alpine",          state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","track","softball"], url: "https://sulrossathletics.com" },

  // ── Texas D3 ──────────────────────────────────────────────────────────────
  { name: "Trinity University",                 city: "San Antonio",     state: "TX", division: "D3", conference: "SCAC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://trinitytigers.com" },
  { name: "Austin College",                     city: "Sherman",         state: "TX", division: "D3", conference: "SCAC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://austincollege.edu/athletics" },
  { name: "Texas Lutheran University",          city: "Seguin",          state: "TX", division: "D3", conference: "SCAC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://tlubulldogs.com" },
  { name: "McMurry University",                 city: "Abilene",         state: "TX", division: "D3", conference: "ASC",       sports: ["football","basketball","baseball","track","softball"], url: "https://mcmurrysports.com" },
  { name: "Hardin-Simmons University",          city: "Abilene",         state: "TX", division: "D3", conference: "ASC",       sports: ["football","basketball","baseball","track","softball"], url: "https://hsuathletics.com" },
  { name: "Howard Payne University",            city: "Brownwood",       state: "TX", division: "D3", conference: "ASC",       sports: ["football","basketball","baseball","track","softball"], url: "https://hpuyellowjackets.com" },
  { name: "East Texas Baptist University",      city: "Marshall",        state: "TX", division: "D3", conference: "ASC",       sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://etbutigers.com" },
  { name: "University of Mary Hardin-Baylor",   city: "Belton",          state: "TX", division: "D3", conference: "ASC",       sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://umhbcrusaders.com" },
  { name: "Southwestern University",            city: "Georgetown",      state: "TX", division: "D3", conference: "SCAC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://swusports.com" },

  // ── Texas NAIA ────────────────────────────────────────────────────────────
  { name: "Texas Wesleyan University",          city: "Fort Worth",      state: "TX", division: "NAIA", conference: "Sooner Athletic", sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://txwes.edu/athletics" },
  { name: "Wayland Baptist University",         city: "Plainview",       state: "TX", division: "NAIA", conference: "Sooner Athletic", sports: ["football","basketball","baseball","track","softball"], url: "https://wbuathletics.com" },
  { name: "SAGU",                               city: "Waxahachie",      state: "TX", division: "NAIA", conference: "Sooner Athletic", sports: ["football","basketball","baseball","track","softball"], url: "https://sagusports.com" },

  // ── Texas JuCo ───────────────────────────────────────────────────────────
  { name: "Blinn College",                      city: "Brenham",         state: "TX", division: "JuCo", conference: "NJCAA", sports: ["football","basketball","baseball","soccer","softball"], url: "https://blinnathletics.com" },
  { name: "Kilgore College",                    city: "Kilgore",         state: "TX", division: "JuCo", conference: "NJCAA", sports: ["football","basketball","baseball","track","softball"], url: "https://kilgorecollege.edu/athletics" },
  { name: "Tyler Junior College",               city: "Tyler",           state: "TX", division: "JuCo", conference: "NJCAA", sports: ["football","basketball","baseball","track","softball"], url: "https://tjc.edu/athletics" },
  { name: "Navarro College",                    city: "Corsicana",       state: "TX", division: "JuCo", conference: "NJCAA", sports: ["football","basketball","baseball","track","softball"], url: "https://navarrocollege.edu/athletics" },
  { name: "Trinity Valley Community College",   city: "Athens",          state: "TX", division: "JuCo", conference: "NJCAA", sports: ["football","basketball","baseball","track","softball"], url: "https://tvcc.edu/athletics" },
  { name: "Cisco College",                      city: "Cisco",           state: "TX", division: "JuCo", conference: "NJCAA", sports: ["football","basketball","baseball","track"], url: "https://cisco.edu/athletics" },
  { name: "Northeastern Oklahoma A&M",          city: "Miami",           state: "OK", division: "JuCo", conference: "NJCAA", sports: ["football","basketball","baseball","track","softball"], url: "https://neoam.edu/athletics" },

  // ── South / Southeast D1 ─────────────────────────────────────────────────
  { name: "Oklahoma State University",          city: "Stillwater",      state: "OK", division: "D1", conference: "Big 12",   sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://okstate.com" },
  { name: "University of Oklahoma",             city: "Norman",          state: "OK", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://soonersports.com" },
  { name: "LSU",                                city: "Baton Rouge",     state: "LA", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://lsusports.net" },
  { name: "University of Arkansas",             city: "Fayetteville",    state: "AR", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://arkansasrazorbacks.com" },
  { name: "University of Alabama",              city: "Tuscaloosa",      state: "AL", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://rolltide.com" },
  { name: "Florida State University",           city: "Tallahassee",     state: "FL", division: "D1", conference: "ACC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://seminoles.com" },
  { name: "University of Miami",                city: "Coral Gables",    state: "FL", division: "D1", conference: "ACC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://hurricanesports.com" },
  { name: "University of Georgia",              city: "Athens",          state: "GA", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://georgiadogs.com" },
  { name: "University of Tennessee",            city: "Knoxville",       state: "TN", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://utsports.com" },
  { name: "Auburn University",                  city: "Auburn",          state: "AL", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://auburntigers.com" },
  { name: "Mississippi State University",       city: "Starkville",      state: "MS", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://hailstate.com" },
  { name: "University of Mississippi",          city: "Oxford",          state: "MS", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://olemisssports.com" },
  { name: "University of South Carolina",       city: "Columbia",        state: "SC", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://gamecocksonline.com" },
  { name: "University of Florida",              city: "Gainesville",     state: "FL", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://floridagators.com" },
  { name: "Tulane University",                  city: "New Orleans",     state: "LA", division: "D1", conference: "AAC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://tulanegreenwave.com" },
  { name: "Memphis",                            city: "Memphis",         state: "TN", division: "D1", conference: "AAC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://gotigersgo.com" },

  // ── Nationwide D1 ─────────────────────────────────────────────────────────
  { name: "Ohio State University",              city: "Columbus",        state: "OH", division: "D1", conference: "Big Ten",  sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://ohiostatebuckeyes.com" },
  { name: "University of Southern California",  city: "Los Angeles",     state: "CA", division: "D1", conference: "Big Ten",  sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://usctrojans.com" },
  { name: "Penn State University",              city: "State College",   state: "PA", division: "D1", conference: "Big Ten",  sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://gopsusports.com" },
  { name: "Notre Dame",                         city: "South Bend",      state: "IN", division: "D1", conference: "ACC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://und.com" },
  { name: "University of Colorado",             city: "Boulder",         state: "CO", division: "D1", conference: "Big 12",   sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://cubuffs.com" },
  { name: "Arizona State University",           city: "Tempe",           state: "AZ", division: "D1", conference: "Big 12",   sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://thesundevils.com" },
  { name: "University of Michigan",             city: "Ann Arbor",       state: "MI", division: "D1", conference: "Big Ten",  sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://mgoblue.com" },
  { name: "Clemson University",                 city: "Clemson",         state: "SC", division: "D1", conference: "ACC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://clemsontigers.com" },
  { name: "University of Oregon",               city: "Eugene",          state: "OR", division: "D1", conference: "Big Ten",  sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://goducks.com" },
  { name: "University of Washington",           city: "Seattle",         state: "WA", division: "D1", conference: "Big Ten",  sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://gohuskies.com" },

  // ── South / Nationwide D2 ────────────────────────────────────────────────
  { name: "Valdosta State University",          city: "Valdosta",        state: "GA", division: "D2", conference: "Gulf South", sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://valdostastateathletics.com" },
  { name: "Delta State University",             city: "Cleveland",       state: "MS", division: "D2", conference: "Gulf South", sports: ["football","basketball","baseball","track","softball"], url: "https://deltastateathletics.com" },
  { name: "University of North Alabama",        city: "Florence",        state: "AL", division: "D1", conference: "CUSA",      sports: ["football","basketball","baseball","track","softball"], url: "https://roarlions.com" },
  { name: "Ouachita Baptist University",        city: "Arkadelphia",     state: "AR", division: "D2", conference: "GAC",       sports: ["football","basketball","baseball","track","softball"], url: "https://obutigers.com" },
  { name: "Henderson State University",         city: "Arkadelphia",     state: "AR", division: "D2", conference: "GAC",       sports: ["football","basketball","baseball","track","softball"], url: "https://hsuathletics.com" },
  { name: "Southeastern Oklahoma State",        city: "Durant",          state: "OK", division: "D2", conference: "GAC",       sports: ["football","basketball","baseball","track","softball"], url: "https://gosestorm.com" },
  { name: "Southwestern Oklahoma State",        city: "Weatherford",     state: "OK", division: "D2", conference: "GAC",       sports: ["football","basketball","baseball","track","softball"], url: "https://swosuathletics.com" },

  // ── South NAIA ───────────────────────────────────────────────────────────
  { name: "Langston University",                city: "Langston",        state: "OK", division: "NAIA", conference: "Red River", sports: ["football","basketball","baseball","track","softball"], url: "https://golions.langston.edu" },
  { name: "Bacone College",                     city: "Muskogee",        state: "OK", division: "NAIA", conference: "Red River", sports: ["football","basketball","baseball","track","softball"], url: "https://baconeathletics.com" },
  { name: "Lyon College",                       city: "Batesville",      state: "AR", division: "NAIA", conference: "Mid-South", sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://lyonsports.com" },
  { name: "Bethel University",                  city: "McKenzie",        state: "TN", division: "NAIA", conference: "Mid-South", sports: ["football","basketball","baseball","track","softball"], url: "https://bethelwildcats.com" },
]

// ─── Filter schools ───────────────────────────────────────────────────────────
export function filterSchools(opts: {
  sport?: Sport
  division?: Division | "Any"
  region?: "Texas" | "South" | "Nationwide"
}): School[] {
  const SOUTH = ["TX","OK","LA","AR","MS","AL","TN","GA","FL","SC","NC","VA","KY"]

  return SCHOOLS.filter(s => {
    if (opts.sport && !s.sports.includes(opts.sport)) return false
    if (opts.division && opts.division !== "Any" && s.division !== opts.division) return false
    if (opts.region === "Texas" && s.state !== "TX") return false
    if (opts.region === "South" && !SOUTH.includes(s.state)) return false
    return true
  })
}
