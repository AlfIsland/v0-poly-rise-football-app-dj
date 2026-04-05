// ─────────────────────────────────────────────────────────────────────────────
// PolyRISE Football Ratings Engine
// Position-specific percentile benchmarks based on national HS football data
// ─────────────────────────────────────────────────────────────────────────────

export interface AthleteMetrics {
  fortyYard?: number       // seconds (lower = better)
  shuttle?: number         // 20-yard shuttle, seconds (lower = better)
  threeCone?: number       // seconds (lower = better)
  verticalJump?: number    // inches (higher = better)
  broadJump?: number       // inches (higher = better)
  benchPress?: number      // 225 lb reps (higher = better)
  height?: number
  weight?: number
  gpa?: number
}

export interface MetricResult {
  label: string
  value: number
  unit: string
  percentile: number
  rank: string
}

export interface RatingResult {
  stars: number
  label: string
  overallPercentile: number
  metrics: MetricResult[]
  description: string
  positionGroup: string
}

// ─── Position Groups ──────────────────────────────────────────────────────────

export type PositionGroup = "SPEED" | "SKILL" | "BIG" | "GENERAL"

export function getPositionGroup(position: string): PositionGroup {
  const p = position.toUpperCase().trim()

  const speedPositions = [
    "WR", "WIDE RECEIVER", "CB", "CORNERBACK", "CORNER",
    "RB", "RUNNING BACK", "HB", "HALFBACK", "TAILBACK",
    "S", "SAFETY", "FS", "FREE SAFETY", "SS", "STRONG SAFETY",
    "DB", "DEFENSIVE BACK", "PR", "KR", "K", "KICKER", "P", "PUNTER",
    "SLOT", "SLOT WR", "SLOT RECEIVER",
  ]

  const skillPositions = [
    "QB", "QUARTERBACK",
    "TE", "TIGHT END",
    "LB", "LINEBACKER", "OLB", "ILB", "MLB", "MIDDLE LINEBACKER",
    "DE", "DEFENSIVE END", "EDGE", "PASS RUSHER",
    "FB", "FULLBACK",
  ]

  const bigPositions = [
    "OL", "OFFENSIVE LINE", "OFFENSIVE LINEMAN",
    "OT", "OFFENSIVE TACKLE", "TACKLE",
    "OG", "OFFENSIVE GUARD", "GUARD",
    "C", "CENTER",
    "DL", "DEFENSIVE LINE", "DEFENSIVE LINEMAN",
    "DT", "DEFENSIVE TACKLE", "NT", "NOSE TACKLE",
    "IOL", "INTERIOR OFFENSIVE LINE",
  ]

  if (speedPositions.some(sp => p.includes(sp) || sp.includes(p))) return "SPEED"
  if (skillPositions.some(sp => p.includes(sp) || sp.includes(p))) return "SKILL"
  if (bigPositions.some(sp => p.includes(sp) || sp.includes(p))) return "BIG"
  return "GENERAL"
}

export function getPositionGroupLabel(group: PositionGroup): string {
  switch (group) {
    case "SPEED": return "Speed/Skill (WR · CB · RB · DB)"
    case "SKILL": return "Hybrid Skill (QB · TE · LB · DE)"
    case "BIG":   return "Linemen (OL · DL)"
    default:      return "General"
  }
}

// ─── Benchmark Tables ─────────────────────────────────────────────────────────
// [metricValue, percentile] — sorted by value ascending

type Benchmark = [number, number][]

// 40-Yard Dash (lower = better)
const FORTY: Record<PositionGroup, Benchmark> = {
  SPEED: [
    [5.10, 5], [4.90, 15], [4.78, 30], [4.68, 50],
    [4.58, 65], [4.48, 80], [4.40, 88], [4.33, 93],
    [4.26, 96], [4.18, 98], [4.10, 99],
  ],
  SKILL: [
    [5.30, 5], [5.10, 15], [4.95, 30], [4.85, 50],
    [4.75, 65], [4.65, 80], [4.57, 88], [4.50, 93],
    [4.43, 96], [4.36, 98], [4.28, 99],
  ],
  BIG: [
    [5.80, 5], [5.60, 15], [5.42, 30], [5.28, 50],
    [5.14, 65], [5.02, 80], [4.93, 88], [4.85, 93],
    [4.77, 96], [4.69, 98], [4.60, 99],
  ],
  GENERAL: [
    [5.50, 5], [5.30, 10], [5.10, 20], [4.95, 30], [4.85, 40],
    [4.75, 50], [4.65, 60], [4.55, 70], [4.45, 80], [4.38, 85],
    [4.32, 90], [4.25, 93], [4.18, 96], [4.10, 98], [4.00, 99],
  ],
}

// 20-Yard Shuttle (lower = better)
const SHUTTLE: Record<PositionGroup, Benchmark> = {
  SPEED: [
    [4.80, 5], [4.65, 15], [4.52, 30], [4.40, 50],
    [4.30, 65], [4.20, 80], [4.12, 88], [4.05, 93],
    [3.98, 96], [3.92, 98], [3.85, 99],
  ],
  SKILL: [
    [4.95, 5], [4.78, 15], [4.65, 30], [4.53, 50],
    [4.43, 65], [4.33, 80], [4.25, 88], [4.18, 93],
    [4.11, 96], [4.05, 98], [3.98, 99],
  ],
  BIG: [
    [5.20, 5], [5.00, 15], [4.86, 30], [4.73, 50],
    [4.62, 65], [4.51, 80], [4.43, 88], [4.36, 93],
    [4.29, 96], [4.23, 98], [4.16, 99],
  ],
  GENERAL: [
    [5.00, 5], [4.80, 10], [4.65, 20], [4.55, 30], [4.45, 40],
    [4.38, 50], [4.28, 60], [4.18, 70], [4.10, 80], [4.05, 85],
    [3.98, 90], [3.92, 93], [3.86, 96], [3.80, 98], [3.72, 99],
  ],
}

// 3-Cone / L-Drill (lower = better)
const THREE_CONE: Record<PositionGroup, Benchmark> = {
  SPEED: [
    [7.80, 5], [7.50, 15], [7.22, 30], [6.98, 50],
    [6.78, 65], [6.62, 80], [6.50, 88], [6.40, 93],
    [6.30, 96], [6.20, 98], [6.08, 99],
  ],
  SKILL: [
    [8.00, 5], [7.70, 15], [7.42, 30], [7.18, 50],
    [6.98, 65], [6.80, 80], [6.67, 88], [6.57, 93],
    [6.47, 96], [6.37, 98], [6.22, 99],
  ],
  BIG: [
    [8.50, 5], [8.20, 15], [7.92, 30], [7.68, 50],
    [7.48, 65], [7.28, 80], [7.14, 88], [7.04, 93],
    [6.92, 96], [6.79, 98], [6.64, 99],
  ],
  GENERAL: [
    [8.20, 5], [7.90, 10], [7.60, 20], [7.40, 30], [7.20, 40],
    [7.05, 50], [6.90, 60], [6.75, 70], [6.60, 80], [6.50, 85],
    [6.40, 90], [6.28, 93], [6.18, 96], [6.05, 98], [5.90, 99],
  ],
}

// Vertical Jump (higher = better)
const VERTICAL: Record<PositionGroup, Benchmark> = {
  SPEED: [
    [20, 5], [24, 15], [28, 30], [32, 50],
    [35, 65], [38, 80], [40, 88], [42, 93],
    [44, 96], [46, 98], [48, 99],
  ],
  SKILL: [
    [18, 5], [22, 15], [26, 30], [30, 50],
    [33, 65], [36, 80], [38, 88], [40, 93],
    [42, 96], [44, 98], [46, 99],
  ],
  BIG: [
    [14, 5], [17, 15], [20, 30], [24, 50],
    [27, 65], [30, 80], [32, 88], [34, 93],
    [36, 96], [38, 98], [40, 99],
  ],
  GENERAL: [
    [16, 5], [18, 10], [21, 20], [23, 30], [25, 40],
    [27, 50], [29, 60], [31, 70], [33, 80], [35, 85],
    [37, 90], [39, 93], [41, 96], [43, 98], [45, 99],
  ],
}

// Broad Jump (higher = better)
const BROAD: Record<PositionGroup, Benchmark> = {
  SPEED: [
    [84, 5], [90, 15], [96, 30], [103, 50],
    [108, 65], [113, 80], [117, 88], [120, 93],
    [123, 96], [126, 98], [130, 99],
  ],
  SKILL: [
    [78, 5], [84, 15], [90, 30], [97, 50],
    [102, 65], [108, 80], [112, 88], [115, 93],
    [118, 96], [121, 98], [125, 99],
  ],
  BIG: [
    [66, 5], [72, 15], [78, 30], [85, 50],
    [91, 65], [97, 80], [101, 88], [105, 93],
    [109, 96], [113, 98], [118, 99],
  ],
  GENERAL: [
    [78, 5], [84, 10], [88, 20], [92, 30], [95, 40],
    [98, 50], [102, 60], [106, 70], [110, 80], [113, 85],
    [116, 90], [119, 93], [122, 96], [125, 98], [128, 99],
  ],
}

// Bench Press 225 (higher = better)
const BENCH: Record<PositionGroup, Benchmark> = {
  SPEED: [
    [1, 5], [2, 15], [4, 30], [7, 50],
    [10, 65], [13, 80], [16, 88], [18, 93],
    [21, 96], [24, 98], [27, 99],
  ],
  SKILL: [
    [1, 5], [3, 15], [6, 30], [10, 50],
    [13, 65], [17, 80], [20, 88], [23, 93],
    [26, 96], [28, 98], [31, 99],
  ],
  BIG: [
    [5, 5], [8, 15], [12, 30], [16, 50],
    [20, 65], [24, 80], [27, 88], [30, 93],
    [33, 96], [36, 98], [40, 99],
  ],
  GENERAL: [
    [1, 5], [2, 10], [4, 20], [6, 30], [8, 40],
    [10, 50], [13, 60], [16, 70], [19, 80], [21, 85],
    [23, 90], [25, 93], [27, 96], [29, 98], [32, 99],
  ],
}

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

function getRank(p: number): string {
  if (p >= 90) return "Elite"
  if (p >= 75) return "Excellent"
  if (p >= 50) return "Above Average"
  if (p >= 25) return "Average"
  return "Below Average"
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function calcStars(avg: number, group: PositionGroup): { stars: number; label: string; description: string } {
  const groupName = group === "SPEED" ? "speed/skill positions"
    : group === "SKILL" ? "hybrid skill positions"
    : group === "BIG" ? "linemen"
    : "athletes"

  if (avg >= 85) return {
    stars: 5,
    label: "5-Star Prospect",
    description: `Elite national-level athlete among ${groupName}. Top-tier recruit across all measurable categories.`,
  }
  if (avg >= 70) return {
    stars: 4,
    label: "4-Star Prospect",
    description: `High-level performer well above national averages for ${groupName}. Strong college recruit.`,
  }
  if (avg >= 50) return {
    stars: 3,
    label: "3-Star Prospect",
    description: `Above-average athlete compared to ${groupName} nationally. Solid college potential with continued development.`,
  }
  if (avg >= 30) return {
    stars: 2,
    label: "2-Star Prospect",
    description: `Developing athlete near national averages for ${groupName}. PolyRISE training program recommended.`,
  }
  return {
    stars: 1,
    label: "1-Star Prospect",
    description: `Early development stage for ${groupName}. Strong PolyRISE training focus recommended to reach full potential.`,
  }
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function calculateRatings(metrics: AthleteMetrics, position = ""): RatingResult {
  const group = getPositionGroup(position)
  const results: MetricResult[] = []

  if (metrics.fortyYard != null)
    results.push({ label: "40-Yard Dash", value: metrics.fortyYard, unit: "sec",
      percentile: interpolate(metrics.fortyYard, FORTY[group], true),
      rank: getRank(interpolate(metrics.fortyYard, FORTY[group], true)) })

  if (metrics.shuttle != null)
    results.push({ label: "20-Yd Shuttle", value: metrics.shuttle, unit: "sec",
      percentile: interpolate(metrics.shuttle, SHUTTLE[group], true),
      rank: getRank(interpolate(metrics.shuttle, SHUTTLE[group], true)) })

  if (metrics.threeCone != null)
    results.push({ label: "3-Cone Drill", value: metrics.threeCone, unit: "sec",
      percentile: interpolate(metrics.threeCone, THREE_CONE[group], true),
      rank: getRank(interpolate(metrics.threeCone, THREE_CONE[group], true)) })

  if (metrics.verticalJump != null)
    results.push({ label: "Vertical Jump", value: metrics.verticalJump, unit: "in",
      percentile: interpolate(metrics.verticalJump, VERTICAL[group], false),
      rank: getRank(interpolate(metrics.verticalJump, VERTICAL[group], false)) })

  if (metrics.broadJump != null)
    results.push({ label: "Broad Jump", value: metrics.broadJump, unit: "in",
      percentile: interpolate(metrics.broadJump, BROAD[group], false),
      rank: getRank(interpolate(metrics.broadJump, BROAD[group], false)) })

  if (metrics.benchPress != null)
    results.push({ label: "Bench Press", value: metrics.benchPress, unit: "reps",
      percentile: interpolate(metrics.benchPress, BENCH[group], false),
      rank: getRank(interpolate(metrics.benchPress, BENCH[group], false)) })

  const avgPercentile = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.percentile, 0) / results.length)
    : 50

  const { stars, label, description } = calcStars(avgPercentile, group)

  return {
    stars, label, description,
    overallPercentile: avgPercentile,
    metrics: results,
    positionGroup: getPositionGroupLabel(group),
  }
}
