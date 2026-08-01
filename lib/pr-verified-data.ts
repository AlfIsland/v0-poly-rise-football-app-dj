export type Metric = "40yd" | "broad" | "bench" | "vertical" | "shuttle" | "score"
export type WeightClass = "under200" | "over200"

export interface AthleteResult {
  name: string
  school?: string
  score: number
  metric: Metric
  weightClass: WeightClass
}

export const COMBINE_INFO = {
  name: "POLYRISE ATHLETIX COMBINE",
  season: "2026 COMBINE SERIES",
}

export const METRICS: Metric[] = ["40yd", "broad", "bench", "vertical", "shuttle", "score"]

export const WEIGHT_CLASSES: WeightClass[] = ["under200", "over200"]

export const METRIC_LABELS: Record<Metric, string> = {
  "40yd":     "40 Yard Dash",
  "broad":    "Broad Jump",
  "bench":    "Bench Press",
  "vertical": "Vertical Jump",
  "shuttle":  "Shuttle",
  "score":    "PR Score",
}

export const METRIC_UNIT: Record<Metric, string> = {
  "40yd":     "s",
  "broad":    " ft",
  "bench":    " reps",
  "vertical": '"',
  "shuttle":  "s",
  "score":    " pts",
}

export const WEIGHT_CLASS_LABELS: Record<WeightClass, string> = {
  "under200": "UNDER 200 LBS",
  "over200":  "OVER 200 LBS",
}

/** Metrics where a lower score is better (e.g. faster dash times) */
export const LOWER_IS_BETTER = new Set<Metric>(["40yd", "shuttle"])

// ── ADD NEW ATHLETE RESULTS HERE ──────────────────────────────────────────────
export const ATHLETE_RESULTS: AthleteResult[] = [
  { name: "Gabriel Peach",    score: 4.50, metric: "40yd", weightClass: "over200" },
  { name: "Kingston Sanchez", score: 4.57, metric: "40yd", weightClass: "over200" },
]
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the top 3 athletes for a given metric + weight class, sorted best first. */
export function getLeaderboard(metric: Metric, weightClass: WeightClass): AthleteResult[] {
  return ATHLETE_RESULTS
    .filter(r => r.metric === metric && r.weightClass === weightClass)
    .sort((a, b) =>
      LOWER_IS_BETTER.has(metric) ? a.score - b.score : b.score - a.score
    )
    .slice(0, 3)
}

export function formatScore(score: number, metric: Metric): string {
  let raw: string
  if (metric === "40yd" || metric === "shuttle") {
    raw = score.toFixed(2)
  } else if (metric === "broad" || metric === "vertical") {
    raw = score.toFixed(1)
  } else {
    raw = String(score)
  }
  return raw + METRIC_UNIT[metric]
}
