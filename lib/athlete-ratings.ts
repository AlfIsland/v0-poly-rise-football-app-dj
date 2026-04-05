// ─────────────────────────────────────────────────────────────────────────────
// PolyRISE Football Ratings Engine
// Percentile benchmarks based on national high school football athlete data
// ─────────────────────────────────────────────────────────────────────────────

export interface AthleteMetrics {
  fortyYard?: number       // seconds (lower = better)
  shuttle?: number         // 20-yard shuttle, seconds (lower = better)
  threeCone?: number       // seconds (lower = better)
  verticalJump?: number    // inches (higher = better)
  broadJump?: number       // inches (higher = better)
  benchPress?: number      // 225 lb reps (higher = better)
  height?: number          // inches
  weight?: number          // lbs
  gpa?: number             // 0.0 - 4.0
}

export interface MetricResult {
  label: string
  value: number
  unit: string
  percentile: number
  rank: string   // "Elite" | "Excellent" | "Above Average" | "Average" | "Below Average"
}

export interface RatingResult {
  stars: number           // 1–5
  label: string           // "5-Star Prospect" etc.
  overallPercentile: number
  metrics: MetricResult[]
  description: string
}

// ─── Percentile lookup tables ─────────────────────────────────────────────────
// Each array is [value, percentile] pairs.
// For "lower is better" metrics, lower value = higher percentile.
// Source: aggregated from Nike Football camps, Hudl combine data,
//         and HS football recruiting databases (national male HS averages).

type Benchmark = [number, number][] // [metricValue, percentile]

const FORTY_BENCHMARKS: Benchmark = [
  [5.50, 5],  [5.30, 10], [5.10, 20], [4.95, 30], [4.85, 40],
  [4.75, 50], [4.65, 60], [4.55, 70], [4.45, 80], [4.38, 85],
  [4.32, 90], [4.25, 93], [4.18, 96], [4.10, 98], [4.00, 99],
]

const SHUTTLE_BENCHMARKS: Benchmark = [
  [5.00, 5],  [4.80, 10], [4.65, 20], [4.55, 30], [4.45, 40],
  [4.38, 50], [4.28, 60], [4.18, 70], [4.10, 80], [4.05, 85],
  [3.98, 90], [3.92, 93], [3.86, 96], [3.80, 98], [3.72, 99],
]

const THREE_CONE_BENCHMARKS: Benchmark = [
  [8.20, 5],  [7.90, 10], [7.60, 20], [7.40, 30], [7.20, 40],
  [7.05, 50], [6.90, 60], [6.75, 70], [6.60, 80], [6.50, 85],
  [6.40, 90], [6.28, 93], [6.18, 96], [6.05, 98], [5.90, 99],
]

const VERTICAL_BENCHMARKS: Benchmark = [
  [16, 5],  [18, 10], [21, 20], [23, 30], [25, 40],
  [27, 50], [29, 60], [31, 70], [33, 80], [35, 85],
  [37, 90], [39, 93], [41, 96], [43, 98], [45, 99],
]

const BROAD_BENCHMARKS: Benchmark = [
  [78, 5],  [84, 10], [88, 20], [92, 30], [95, 40],
  [98, 50], [102, 60], [106, 70], [110, 80], [113, 85],
  [116, 90], [119, 93], [122, 96], [125, 98], [128, 99],
]

const BENCH_BENCHMARKS: Benchmark = [
  [1, 5],  [2, 10], [4, 20], [6, 30], [8, 40],
  [10, 50], [13, 60], [16, 70], [19, 80], [21, 85],
  [23, 90], [25, 93], [27, 96], [29, 98], [32, 99],
]

// ─── Interpolation helper ─────────────────────────────────────────────────────

function interpolatePercentile(
  value: number,
  benchmarks: Benchmark,
  lowerIsBetter: boolean
): number {
  const sorted = [...benchmarks].sort((a, b) => a[0] - b[0])

  if (lowerIsBetter) {
    // Lower value → higher percentile
    if (value <= sorted[0][0]) return 99
    if (value >= sorted[sorted.length - 1][0]) return 1

    for (let i = 0; i < sorted.length - 1; i++) {
      const [v1, p1] = sorted[i]
      const [v2, p2] = sorted[i + 1]
      if (value >= v1 && value <= v2) {
        const t = (value - v1) / (v2 - v1)
        return Math.round(p1 + t * (p2 - p1))
      }
    }
  } else {
    // Higher value → higher percentile
    if (value >= sorted[sorted.length - 1][0]) return 99
    if (value <= sorted[0][0]) return 1

    for (let i = 0; i < sorted.length - 1; i++) {
      const [v1, p1] = sorted[i]
      const [v2, p2] = sorted[i + 1]
      if (value >= v1 && value <= v2) {
        const t = (value - v1) / (v2 - v1)
        return Math.round(p1 + t * (p2 - p1))
      }
    }
  }

  return 50
}

function getRank(percentile: number): string {
  if (percentile >= 90) return "Elite"
  if (percentile >= 75) return "Excellent"
  if (percentile >= 50) return "Above Average"
  if (percentile >= 25) return "Average"
  return "Below Average"
}

// ─── Star rating ──────────────────────────────────────────────────────────────

function calculateStars(avgPercentile: number): { stars: number; label: string; description: string } {
  if (avgPercentile >= 85) return {
    stars: 5,
    label: "5-Star Prospect",
    description: "Elite national-level athlete. Top recruit across all measurable categories.",
  }
  if (avgPercentile >= 70) return {
    stars: 4,
    label: "4-Star Prospect",
    description: "High-level performer well above national averages. Strong college recruit.",
  }
  if (avgPercentile >= 50) return {
    stars: 3,
    label: "3-Star Prospect",
    description: "Above-average athlete with clear strengths. Solid college potential.",
  }
  if (avgPercentile >= 30) return {
    stars: 2,
    label: "2-Star Prospect",
    description: "Developing athlete near national averages. Room to grow with continued training.",
  }
  return {
    stars: 1,
    label: "1-Star Prospect",
    description: "Early development stage. PolyRISE training program recommended to reach potential.",
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function calculateRatings(metrics: AthleteMetrics): RatingResult {
  const results: MetricResult[] = []

  if (metrics.fortyYard != null) {
    const percentile = interpolatePercentile(metrics.fortyYard, FORTY_BENCHMARKS, true)
    results.push({
      label: "40-Yard Dash",
      value: metrics.fortyYard,
      unit: "sec",
      percentile,
      rank: getRank(percentile),
    })
  }

  if (metrics.shuttle != null) {
    const percentile = interpolatePercentile(metrics.shuttle, SHUTTLE_BENCHMARKS, true)
    results.push({
      label: "20-Yd Shuttle",
      value: metrics.shuttle,
      unit: "sec",
      percentile,
      rank: getRank(percentile),
    })
  }

  if (metrics.threeCone != null) {
    const percentile = interpolatePercentile(metrics.threeCone, THREE_CONE_BENCHMARKS, true)
    results.push({
      label: "3-Cone Drill",
      value: metrics.threeCone,
      unit: "sec",
      percentile,
      rank: getRank(percentile),
    })
  }

  if (metrics.verticalJump != null) {
    const percentile = interpolatePercentile(metrics.verticalJump, VERTICAL_BENCHMARKS, false)
    results.push({
      label: "Vertical Jump",
      value: metrics.verticalJump,
      unit: "in",
      percentile,
      rank: getRank(percentile),
    })
  }

  if (metrics.broadJump != null) {
    const percentile = interpolatePercentile(metrics.broadJump, BROAD_BENCHMARKS, false)
    results.push({
      label: "Broad Jump",
      value: metrics.broadJump,
      unit: "in",
      percentile,
      rank: getRank(percentile),
    })
  }

  if (metrics.benchPress != null) {
    const percentile = interpolatePercentile(metrics.benchPress, BENCH_BENCHMARKS, false)
    results.push({
      label: "Bench Press",
      value: metrics.benchPress,
      unit: "reps",
      percentile,
      rank: getRank(percentile),
    })
  }

  const avgPercentile =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentile, 0) / results.length)
      : 50

  const { stars, label, description } = calculateStars(avgPercentile)

  return {
    stars,
    label,
    overallPercentile: avgPercentile,
    metrics: results,
    description,
  }
}
