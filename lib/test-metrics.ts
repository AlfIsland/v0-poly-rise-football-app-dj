import type { MetricKey } from "@/app/api/training/route"

export const TIMED_METRICS: MetricKey[] = ["fortyYard", "twentyYard", "shuttle", "threeCone"]
export const MEASURED_METRICS: MetricKey[] = ["verticalJump", "broadJump", "benchPress"]

export const METRIC_LABELS: Record<MetricKey, string> = {
  fortyYard: "40-Yard Dash",
  twentyYard: "20-Yard Dash",
  shuttle: "5-10-5 Shuttle",
  threeCone: "3-Cone Drill",
  verticalJump: "Vertical Jump",
  broadJump: "Broad Jump",
  benchPress: "Bench Press (135 lb reps)",
}

export const METRIC_UNITS: Record<MetricKey, string> = {
  fortyYard: "s",
  twentyYard: "s",
  shuttle: "s",
  threeCone: "s",
  verticalJump: '"',
  broadJump: '"',
  benchPress: " reps",
}
