// ─────────────────────────────────────────────────────────────────────────────
// PolyRISE Football Ratings Engine
// Position + Class Year specific benchmarks (National & Texas)
// ─────────────────────────────────────────────────────────────────────────────

export interface AthleteMetrics {
  fortyYard?: number       // seconds (lower = better)
  shuttle?: number         // 20-yard shuttle / 5-10-5, seconds (lower = better)
  threeCone?: number       // L-drill / 3-cone, seconds (lower = better)
  verticalJump?: number    // inches (higher = better)
  broadJump?: number       // inches (higher = better)
  benchPress?: number      // reps (higher = better)
  height?: number
  weight?: number
  gpa?: number
}

export interface MetricResult {
  label: string
  value: number
  unit: string
  nationalPercentile: number
  texasPercentile: number
  rank: string
}

export interface RatingResult {
  stars: number
  texasStars: number
  label: string
  texasLabel: string
  overallPercentile: number
  texasPercentile: number
  metrics: MetricResult[]
  description: string
  positionGroup: string
  classYear: string
  comparedAgainst: string
}

// ─── Position Groups ──────────────────────────────────────────────────────────

export type PositionGroup = "SPEED" | "SKILL" | "BIG" | "GENERAL"

export function getPositionGroup(position: string): PositionGroup {
  const p = (position || "").toUpperCase().trim()
  const SPEED = ["WR","WIDE RECEIVER","CB","CORNERBACK","CORNER","RB","RUNNING BACK",
    "HB","HALFBACK","TAILBACK","S","SAFETY","FS","FREE SAFETY","SS","STRONG SAFETY",
    "DB","DEFENSIVE BACK","SLOT","SLOT WR","SLOT RECEIVER","KR","PR","K","KICKER","P","PUNTER"]
  const SKILL = ["QB","QUARTERBACK","TE","TIGHT END","LB","LINEBACKER","OLB","ILB",
    "MLB","MIDDLE LINEBACKER","DE","DEFENSIVE END","EDGE","PASS RUSHER","FB","FULLBACK"]
  const BIG = ["OL","OFFENSIVE LINE","OFFENSIVE LINEMAN","OT","OFFENSIVE TACKLE","TACKLE",
    "OG","OFFENSIVE GUARD","GUARD","C","CENTER","DL","DEFENSIVE LINE","DT",
    "DEFENSIVE TACKLE","NT","NOSE TACKLE","IOL"]

  if (SPEED.some(s => p === s || p.includes(s))) return "SPEED"
  if (SKILL.some(s => p === s || p.includes(s))) return "SKILL"
  if (BIG.some(s => p === s || p.includes(s))) return "BIG"
  return "GENERAL"
}

export function getPositionGroupLabel(group: PositionGroup): string {
  switch (group) {
    case "SPEED": return "WR · CB · RB · DB · Safety"
    case "SKILL": return "QB · TE · LB · DE"
    case "BIG":   return "OL · DL"
    default:      return "All Positions"
  }
}

// ─── Class Year → Grade Level ─────────────────────────────────────────────────
// Current year is 2026. Class of 2026 = Seniors (Grade 12), etc.

function classToGrade(classYear: string): "FRESHMAN" | "SOPHOMORE" | "JUNIOR" | "SENIOR" | "MIDDLE" | "UNKNOWN" {
  const year = parseInt(classYear)
  if (isNaN(year)) return "UNKNOWN"
  const currentYear = new Date().getFullYear()
  const yearsUntilGrad = year - currentYear
  // yearsUntilGrad: 0=Senior, 1=Junior, 2=Sophomore, 3=Freshman, 4+=Middle School
  switch (yearsUntilGrad) {
    case 0:  return "SENIOR"
    case 1:  return "JUNIOR"
    case 2:  return "SOPHOMORE"
    case 3:  return "FRESHMAN"
    default: return yearsUntilGrad > 3 ? "MIDDLE" : "SENIOR"
  }
}

function getGradeLabel(grade: ReturnType<typeof classToGrade>): string {
  switch (grade) {
    case "SENIOR":    return "Senior (Grade 12)"
    case "JUNIOR":    return "Junior (Grade 11)"
    case "SOPHOMORE": return "Sophomore (Grade 10)"
    case "FRESHMAN":  return "Freshman (Grade 9)"
    case "MIDDLE":    return "Middle School (K-8)"
    default:          return "High School"
  }
}

// ─── Benchmark Type ───────────────────────────────────────────────────────────
// [metricValue, percentile]

type Benchmark = [number, number][]
type GradeBenchmarks = Record<"SENIOR" | "SOPHOMORE" | "JUNIOR" | "FRESHMAN" | "MIDDLE" | "UNKNOWN", Benchmark>
type PositionBenchmarks = Record<PositionGroup, GradeBenchmarks>

// ─────────────────────────────────────────────────────────────────────────────
// NATIONAL BENCHMARKS
// Lower = better for time metrics; Higher = better for jump/strength
// Based on aggregated national HS combine data (Nike, Rivals, On3, Hudl)
// ─────────────────────────────────────────────────────────────────────────────

// Helper: shift a benchmark by a factor (used to derive grade-level variants)
function shiftBenchmark(base: Benchmark, shift: number, lowerIsBetter: boolean): Benchmark {
  return base.map(([v, p]) => [lowerIsBetter ? v + shift : v + shift, p])
}

// ── 40-YARD DASH (lower = better) ────────────────────────────────────────────

const FORTY_SENIOR_SPEED: Benchmark = [
  [5.10,5],[4.90,15],[4.78,30],[4.68,50],
  [4.58,65],[4.48,80],[4.40,88],[4.33,93],
  [4.26,96],[4.18,98],[4.10,99],
]
const FORTY_SENIOR_SKILL: Benchmark = [
  [5.30,5],[5.10,15],[4.95,30],[4.85,50],
  [4.75,65],[4.65,80],[4.57,88],[4.50,93],
  [4.43,96],[4.36,98],[4.28,99],
]
const FORTY_SENIOR_BIG: Benchmark = [
  [5.80,5],[5.60,15],[5.42,30],[5.28,50],
  [5.14,65],[5.02,80],[4.93,88],[4.85,93],
  [4.77,96],[4.69,98],[4.60,99],
]

function buildForty(senior: Benchmark, shifts: number[]): GradeBenchmarks {
  const [jr, so, fr, ms] = shifts
  return {
    SENIOR:    senior,
    JUNIOR:    shiftBenchmark(senior, jr, true),
    SOPHOMORE: shiftBenchmark(senior, so, true),
    FRESHMAN:  shiftBenchmark(senior, fr, true),
    MIDDLE:    shiftBenchmark(senior, ms, true),
    UNKNOWN:   senior,
  }
}

const FORTY_NATIONAL: PositionBenchmarks = {
  SPEED:   buildForty(FORTY_SENIOR_SPEED,   [0.06, 0.12, 0.18, 0.28]),
  SKILL:   buildForty(FORTY_SENIOR_SKILL,   [0.06, 0.12, 0.18, 0.28]),
  BIG:     buildForty(FORTY_SENIOR_BIG,     [0.06, 0.12, 0.18, 0.28]),
  GENERAL: buildForty(FORTY_SENIOR_SPEED,   [0.06, 0.12, 0.18, 0.28]),
}

// ── 20-YD SHUTTLE / 5-10-5 (lower = better) ──────────────────────────────────

const SHUTTLE_SENIOR_SPEED: Benchmark = [
  [4.80,5],[4.65,15],[4.52,30],[4.40,50],
  [4.30,65],[4.20,80],[4.12,88],[4.05,93],
  [3.98,96],[3.92,98],[3.85,99],
]
const SHUTTLE_SENIOR_SKILL: Benchmark = [
  [4.95,5],[4.78,15],[4.65,30],[4.53,50],
  [4.43,65],[4.33,80],[4.25,88],[4.18,93],
  [4.11,96],[4.05,98],[3.98,99],
]
const SHUTTLE_SENIOR_BIG: Benchmark = [
  [5.20,5],[5.00,15],[4.86,30],[4.73,50],
  [4.62,65],[4.51,80],[4.43,88],[4.36,93],
  [4.29,96],[4.23,98],[4.16,99],
]

function buildShuttle(senior: Benchmark, shifts: number[]): GradeBenchmarks {
  const [jr, so, fr, ms] = shifts
  return {
    SENIOR:    senior,
    JUNIOR:    shiftBenchmark(senior, jr, true),
    SOPHOMORE: shiftBenchmark(senior, so, true),
    FRESHMAN:  shiftBenchmark(senior, fr, true),
    MIDDLE:    shiftBenchmark(senior, ms, true),
    UNKNOWN:   senior,
  }
}

const SHUTTLE_NATIONAL: PositionBenchmarks = {
  SPEED:   buildShuttle(SHUTTLE_SENIOR_SPEED,  [0.05, 0.10, 0.16, 0.25]),
  SKILL:   buildShuttle(SHUTTLE_SENIOR_SKILL,  [0.05, 0.10, 0.16, 0.25]),
  BIG:     buildShuttle(SHUTTLE_SENIOR_BIG,    [0.05, 0.10, 0.16, 0.25]),
  GENERAL: buildShuttle(SHUTTLE_SENIOR_SPEED,  [0.05, 0.10, 0.16, 0.25]),
}

// ── 3-CONE / L-DRILL (lower = better) ────────────────────────────────────────

const THREE_CONE_SENIOR_SPEED: Benchmark = [
  [7.80,5],[7.50,15],[7.22,30],[6.98,50],
  [6.78,65],[6.62,80],[6.50,88],[6.40,93],
  [6.30,96],[6.20,98],[6.08,99],
]
const THREE_CONE_SENIOR_SKILL: Benchmark = [
  [8.00,5],[7.70,15],[7.42,30],[7.18,50],
  [6.98,65],[6.80,80],[6.67,88],[6.57,93],
  [6.47,96],[6.37,98],[6.22,99],
]
const THREE_CONE_SENIOR_BIG: Benchmark = [
  [8.50,5],[8.20,15],[7.92,30],[7.68,50],
  [7.48,65],[7.28,80],[7.14,88],[7.04,93],
  [6.92,96],[6.79,98],[6.64,99],
]

function buildCone(senior: Benchmark, shifts: number[]): GradeBenchmarks {
  const [jr, so, fr, ms] = shifts
  return {
    SENIOR:    senior,
    JUNIOR:    shiftBenchmark(senior, jr, true),
    SOPHOMORE: shiftBenchmark(senior, so, true),
    FRESHMAN:  shiftBenchmark(senior, fr, true),
    MIDDLE:    shiftBenchmark(senior, ms, true),
    UNKNOWN:   senior,
  }
}

const THREE_CONE_NATIONAL: PositionBenchmarks = {
  SPEED:   buildCone(THREE_CONE_SENIOR_SPEED,  [0.08, 0.16, 0.24, 0.38]),
  SKILL:   buildCone(THREE_CONE_SENIOR_SKILL,  [0.08, 0.16, 0.24, 0.38]),
  BIG:     buildCone(THREE_CONE_SENIOR_BIG,    [0.08, 0.16, 0.24, 0.38]),
  GENERAL: buildCone(THREE_CONE_SENIOR_SPEED,  [0.08, 0.16, 0.24, 0.38]),
}

// ── VERTICAL JUMP (higher = better) ──────────────────────────────────────────

const VERT_SENIOR_SPEED: Benchmark = [
  [20,5],[24,15],[28,30],[32,50],
  [35,65],[38,80],[40,88],[42,93],
  [44,96],[46,98],[48,99],
]
const VERT_SENIOR_SKILL: Benchmark = [
  [18,5],[22,15],[26,30],[30,50],
  [33,65],[36,80],[38,88],[40,93],
  [42,96],[44,98],[46,99],
]
const VERT_SENIOR_BIG: Benchmark = [
  [14,5],[17,15],[20,30],[24,50],
  [27,65],[30,80],[32,88],[34,93],
  [36,96],[38,98],[40,99],
]

function buildVert(senior: Benchmark, shifts: number[]): GradeBenchmarks {
  const [jr, so, fr, ms] = shifts
  return {
    SENIOR:    senior,
    JUNIOR:    shiftBenchmark(senior, -jr, false),
    SOPHOMORE: shiftBenchmark(senior, -so, false),
    FRESHMAN:  shiftBenchmark(senior, -fr, false),
    MIDDLE:    shiftBenchmark(senior, -ms, false),
    UNKNOWN:   senior,
  }
}

const VERTICAL_NATIONAL: PositionBenchmarks = {
  SPEED:   buildVert(VERT_SENIOR_SPEED,  [1.5, 3, 5, 8]),
  SKILL:   buildVert(VERT_SENIOR_SKILL,  [1.5, 3, 5, 8]),
  BIG:     buildVert(VERT_SENIOR_BIG,    [1.5, 3, 5, 8]),
  GENERAL: buildVert(VERT_SENIOR_SPEED,  [1.5, 3, 5, 8]),
}

// ── BROAD JUMP (higher = better) ─────────────────────────────────────────────

const BROAD_SENIOR_SPEED: Benchmark = [
  [84,5],[90,15],[96,30],[103,50],
  [108,65],[113,80],[117,88],[120,93],
  [123,96],[126,98],[130,99],
]
const BROAD_SENIOR_SKILL: Benchmark = [
  [78,5],[84,15],[90,30],[97,50],
  [102,65],[108,80],[112,88],[115,93],
  [118,96],[121,98],[125,99],
]
const BROAD_SENIOR_BIG: Benchmark = [
  [66,5],[72,15],[78,30],[85,50],
  [91,65],[97,80],[101,88],[105,93],
  [109,96],[113,98],[118,99],
]

function buildBroad(senior: Benchmark, shifts: number[]): GradeBenchmarks {
  const [jr, so, fr, ms] = shifts
  return {
    SENIOR:    senior,
    JUNIOR:    shiftBenchmark(senior, -jr, false),
    SOPHOMORE: shiftBenchmark(senior, -so, false),
    FRESHMAN:  shiftBenchmark(senior, -fr, false),
    MIDDLE:    shiftBenchmark(senior, -ms, false),
    UNKNOWN:   senior,
  }
}

const BROAD_NATIONAL: PositionBenchmarks = {
  SPEED:   buildBroad(BROAD_SENIOR_SPEED,  [2, 4, 7, 11]),
  SKILL:   buildBroad(BROAD_SENIOR_SKILL,  [2, 4, 7, 11]),
  BIG:     buildBroad(BROAD_SENIOR_BIG,    [2, 4, 7, 11]),
  GENERAL: buildBroad(BROAD_SENIOR_SPEED,  [2, 4, 7, 11]),
}

// ── BENCH PRESS (higher = better) ────────────────────────────────────────────

const BENCH_SENIOR_SPEED: Benchmark = [
  [1,5],[2,15],[4,30],[7,50],
  [10,65],[13,80],[16,88],[18,93],
  [21,96],[24,98],[27,99],
]
const BENCH_SENIOR_SKILL: Benchmark = [
  [1,5],[3,15],[6,30],[10,50],
  [13,65],[17,80],[20,88],[23,93],
  [26,96],[28,98],[31,99],
]
const BENCH_SENIOR_BIG: Benchmark = [
  [5,5],[8,15],[12,30],[16,50],
  [20,65],[24,80],[27,88],[30,93],
  [33,96],[36,98],[40,99],
]

function buildBench(senior: Benchmark, shifts: number[]): GradeBenchmarks {
  const [jr, so, fr, ms] = shifts
  return {
    SENIOR:    senior,
    JUNIOR:    shiftBenchmark(senior, -jr, false),
    SOPHOMORE: shiftBenchmark(senior, -so, false),
    FRESHMAN:  shiftBenchmark(senior, -fr, false),
    MIDDLE:    shiftBenchmark(senior, -ms, false),
    UNKNOWN:   senior,
  }
}

const BENCH_NATIONAL: PositionBenchmarks = {
  SPEED:   buildBench(BENCH_SENIOR_SPEED,  [1, 2, 3, 5]),
  SKILL:   buildBench(BENCH_SENIOR_SKILL,  [1, 2, 3, 5]),
  BIG:     buildBench(BENCH_SENIOR_BIG,    [1, 2, 3, 5]),
  GENERAL: buildBench(BENCH_SENIOR_SPEED,  [1, 2, 3, 5]),
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXAS STATE BENCHMARKS
// Texas is a top-5 football state — athletes are ~5-8% more competitive
// than national averages. Faster times, higher jumps required for same percentile.
// ─────────────────────────────────────────────────────────────────────────────

function buildTexasFromNational(
  national: PositionBenchmarks,
  speedBoost: number,    // seconds faster needed (for time metrics)
  jumpBoost: number,     // inches higher needed (for jump metrics)
  lowerIsBetter: boolean
): PositionBenchmarks {
  const result: Partial<PositionBenchmarks> = {}
  for (const pos of Object.keys(national) as PositionGroup[]) {
    const gradeBenchmarks: Partial<GradeBenchmarks> = {}
    for (const grade of Object.keys(national[pos]) as Array<keyof GradeBenchmarks>) {
      gradeBenchmarks[grade] = national[pos][grade].map(([v, p]): [number, number] =>
        lowerIsBetter
          ? [parseFloat((v - speedBoost).toFixed(3)), p]
          : [parseFloat((v + jumpBoost).toFixed(1)), p]
      )
    }
    result[pos] = gradeBenchmarks as GradeBenchmarks
  }
  return result as PositionBenchmarks
}

// Texas athletes need to be ~0.05s faster on speed drills, ~2" higher on jumps
// Texas is a top-3 football state. To earn the same percentile in Texas,
// athletes need to be meaningfully faster/stronger than the national average.
// 40-yd: ~0.12s faster | Shuttle/Cone: ~0.10s | Vertical: ~4" | Broad: ~6" | Bench: ~3 reps
const FORTY_TEXAS      = buildTexasFromNational(FORTY_NATIONAL,      0.12, 0,  true)
const SHUTTLE_TEXAS    = buildTexasFromNational(SHUTTLE_NATIONAL,    0.10, 0,  true)
const THREE_CONE_TEXAS = buildTexasFromNational(THREE_CONE_NATIONAL, 0.12, 0,  true)
const VERTICAL_TEXAS   = buildTexasFromNational(VERTICAL_NATIONAL,   0,    4,  false)
const BROAD_TEXAS      = buildTexasFromNational(BROAD_NATIONAL,      0,    6,  false)
const BENCH_TEXAS      = buildTexasFromNational(BENCH_NATIONAL,      0,    3,  false)

// ─── Interpolation ────────────────────────────────────────────────────────────

function interpolate(value: number, benchmarks: Benchmark, lowerIsBetter: boolean): number {
  const sorted = [...benchmarks].sort((a, b) => a[0] - b[0])

  if (lowerIsBetter) {
    if (value <= sorted[0][0]) return 99
    if (value >= sorted[sorted.length - 1][0]) return 1
    for (let i = 0; i < sorted.length - 1; i++) {
      const [v1, p1] = sorted[i]
      const [v2, p2] = sorted[i + 1]
      if (value >= v1 && value <= v2) {
        return Math.round(p1 + ((value - v1) / (v2 - v1)) * (p2 - p1))
      }
    }
  } else {
    if (value >= sorted[sorted.length - 1][0]) return 99
    if (value <= sorted[0][0]) return 1
    for (let i = 0; i < sorted.length - 1; i++) {
      const [v1, p1] = sorted[i]
      const [v2, p2] = sorted[i + 1]
      if (value >= v1 && value <= v2) {
        return Math.round(p1 + ((value - v1) / (v2 - v1)) * (p2 - p1))
      }
    }
  }
  return 50
}

function getBenchmark(
  table: PositionBenchmarks,
  group: PositionGroup,
  grade: ReturnType<typeof classToGrade>
): Benchmark {
  return table[group][grade] ?? table[group]["UNKNOWN"]
}

function getRank(p: number): string {
  if (p >= 90) return "Elite"
  if (p >= 75) return "Excellent"
  if (p >= 50) return "Above Average"
  if (p >= 25) return "Average"
  return "Below Average"
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function calcStars(avg: number): { stars: number; label: string } {
  if (avg >= 85) return { stars: 5, label: "5-Star Prospect" }
  if (avg >= 70) return { stars: 4, label: "4-Star Prospect" }
  if (avg >= 50) return { stars: 3, label: "3-Star Prospect" }
  if (avg >= 30) return { stars: 2, label: "2-Star Prospect" }
  return { stars: 1, label: "1-Star Prospect" }
}

function buildDescription(stars: number, group: PositionGroup, gradeLabel: string, position: string): string {
  const posLabel = position || getPositionGroupLabel(group)
  switch (stars) {
    case 5: return `Elite national-level ${posLabel} (${gradeLabel}). Top-tier recruit across all measurable categories.`
    case 4: return `High-level ${posLabel} well above national averages for ${gradeLabel}. Strong college recruit.`
    case 3: return `Above-average ${posLabel} for ${gradeLabel}. Solid college potential with continued PolyRISE development.`
    case 2: return `Developing ${posLabel} near national averages for ${gradeLabel}. PolyRISE training recommended.`
    default: return `Early development stage for ${gradeLabel} ${posLabel}. Strong PolyRISE training focus recommended.`
  }
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function calculateRatings(
  metrics: AthleteMetrics,
  position = "",
  classYear = ""
): RatingResult {
  const group = getPositionGroup(position)
  const grade = classToGrade(classYear)
  const gradeLabel = getGradeLabel(grade)
  const results: MetricResult[] = []

  function addMetric(
    label: string, value: number | undefined, unit: string,
    natTable: PositionBenchmarks, txTable: PositionBenchmarks, lowerIsBetter: boolean
  ) {
    if (value == null) return
    const natBench = getBenchmark(natTable, group, grade)
    const txBench  = getBenchmark(txTable,  group, grade)
    const natPct = interpolate(value, natBench, lowerIsBetter)
    const txPct  = interpolate(value, txBench,  lowerIsBetter)
    results.push({
      label, value, unit,
      nationalPercentile: natPct,
      texasPercentile: txPct,
      rank: getRank(natPct),
    })
  }

  addMetric("40-Yard Dash",   metrics.fortyYard,   "sec",  FORTY_NATIONAL,     FORTY_TEXAS,     true)
  addMetric("20-Yd Shuttle",  metrics.shuttle,     "sec",  SHUTTLE_NATIONAL,   SHUTTLE_TEXAS,   true)
  addMetric("3-Cone / L-Drill", metrics.threeCone, "sec",  THREE_CONE_NATIONAL, THREE_CONE_TEXAS, true)
  addMetric("Vertical Jump",  metrics.verticalJump, "in",  VERTICAL_NATIONAL,  VERTICAL_TEXAS,  false)
  addMetric("Broad Jump",     metrics.broadJump,   "in",   BROAD_NATIONAL,     BROAD_TEXAS,     false)
  addMetric("Bench Press",    metrics.benchPress,  "reps", BENCH_NATIONAL,     BENCH_TEXAS,     false)

  const natAvg = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.nationalPercentile, 0) / results.length)
    : 50
  const txAvg = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.texasPercentile, 0) / results.length)
    : 50

  const { stars, label }           = calcStars(natAvg)
  const { stars: txStars, label: txLabel } = calcStars(txAvg)

  return {
    stars, label,
    texasStars: txStars, texasLabel: txLabel,
    overallPercentile: natAvg,
    texasPercentile: txAvg,
    metrics: results,
    description: buildDescription(stars, group, gradeLabel, position),
    positionGroup: getPositionGroupLabel(group),
    classYear: classYear || "Unknown",
    comparedAgainst: `${position || getPositionGroupLabel(group)} · Class of ${classYear || "?"} · ${gradeLabel}`,
  }
}
