export type Tier = "Elite" | "Above Average" | "Average" | "Below Average"

interface Thresholds {
  elite: number
  aboveAvg: number
  average: number
  lower: boolean // true = lower value is better (speed); false = higher is better (jumps)
}

// Age groups: index 0 = ≤11, 1 = 12, 2 = 13, 3 = 14, 4 = 15, 5 = 16, 6 = 17, 7 = 18+
// For "lower" metrics: elite < aboveAvg < average (faster is better)
// For "higher" metrics: elite > aboveAvg > average (bigger is better)

const AGE_BENCHMARKS: Record<string, Thresholds[]> = {
  fortyYard: [
    // ≤11   12     13     14     15     16     17     18+
    { elite: 5.40, aboveAvg: 5.70, average: 6.10, lower: true },
    { elite: 5.20, aboveAvg: 5.50, average: 5.90, lower: true },
    { elite: 5.10, aboveAvg: 5.40, average: 5.80, lower: true },
    { elite: 5.00, aboveAvg: 5.30, average: 5.70, lower: true },
    { elite: 4.80, aboveAvg: 5.10, average: 5.50, lower: true },
    { elite: 4.70, aboveAvg: 5.00, average: 5.40, lower: true },
    { elite: 4.65, aboveAvg: 4.90, average: 5.30, lower: true },
    { elite: 4.55, aboveAvg: 4.85, average: 5.20, lower: true },
  ],
  twentyYard: [
    { elite: 2.90, aboveAvg: 3.10, average: 3.30, lower: true },
    { elite: 2.80, aboveAvg: 3.00, average: 3.20, lower: true },
    { elite: 2.70, aboveAvg: 2.90, average: 3.10, lower: true },
    { elite: 2.65, aboveAvg: 2.85, average: 3.05, lower: true },
    { elite: 2.60, aboveAvg: 2.80, average: 3.00, lower: true },
    { elite: 2.55, aboveAvg: 2.75, average: 2.95, lower: true },
    { elite: 2.50, aboveAvg: 2.70, average: 2.90, lower: true },
    { elite: 2.45, aboveAvg: 2.65, average: 2.85, lower: true },
  ],
  shuttle: [
    { elite: 4.60, aboveAvg: 4.90, average: 5.20, lower: true },
    { elite: 4.45, aboveAvg: 4.75, average: 5.05, lower: true },
    { elite: 4.30, aboveAvg: 4.60, average: 4.90, lower: true },
    { elite: 4.20, aboveAvg: 4.50, average: 4.80, lower: true },
    { elite: 4.10, aboveAvg: 4.40, average: 4.70, lower: true },
    { elite: 4.05, aboveAvg: 4.30, average: 4.60, lower: true },
    { elite: 4.00, aboveAvg: 4.25, average: 4.55, lower: true },
    { elite: 3.90, aboveAvg: 4.15, average: 4.45, lower: true },
  ],
  threeCone: [
    { elite: 7.20, aboveAvg: 7.70, average: 8.20, lower: true },
    { elite: 7.00, aboveAvg: 7.50, average: 8.00, lower: true },
    { elite: 6.80, aboveAvg: 7.30, average: 7.80, lower: true },
    { elite: 6.60, aboveAvg: 7.10, average: 7.60, lower: true },
    { elite: 6.50, aboveAvg: 7.00, average: 7.50, lower: true },
    { elite: 6.30, aboveAvg: 6.80, average: 7.30, lower: true },
    { elite: 6.20, aboveAvg: 6.70, average: 7.20, lower: true },
    { elite: 6.15, aboveAvg: 6.65, average: 7.15, lower: true },
  ],
  verticalJump: [
    { elite: 22, aboveAvg: 18, average: 14, lower: false },
    { elite: 24, aboveAvg: 20, average: 16, lower: false },
    { elite: 26, aboveAvg: 22, average: 18, lower: false },
    { elite: 28, aboveAvg: 24, average: 20, lower: false },
    { elite: 30, aboveAvg: 26, average: 22, lower: false },
    { elite: 33, aboveAvg: 28, average: 24, lower: false },
    { elite: 35, aboveAvg: 30, average: 26, lower: false },
    { elite: 36, aboveAvg: 31, average: 27, lower: false },
  ],
  broadJump: [
    { elite: 84,  aboveAvg: 72,  average: 60,  lower: false },
    { elite: 90,  aboveAvg: 78,  average: 66,  lower: false },
    { elite: 96,  aboveAvg: 84,  average: 72,  lower: false },
    { elite: 100, aboveAvg: 88,  average: 76,  lower: false },
    { elite: 106, aboveAvg: 94,  average: 82,  lower: false },
    { elite: 110, aboveAvg: 98,  average: 86,  lower: false },
    { elite: 114, aboveAvg: 102, average: 90,  lower: false },
    { elite: 116, aboveAvg: 104, average: 92,  lower: false },
  ],
  // Age 14+ = reps at 135 lbs. Under 14 = reps at lighter bar (rated generously).
  benchPress: [
    { elite: 11, aboveAvg: 8,  average: 5,  lower: false }, // ≤11 (lighter bar)
    { elite: 11, aboveAvg: 8,  average: 5,  lower: false }, // 12  (lighter bar)
    { elite: 10, aboveAvg: 7,  average: 4,  lower: false }, // 13  (lighter bar, +2)
    { elite: 11, aboveAvg: 8,  average: 5,  lower: false }, // 14 — reps at 135 lbs
    { elite: 15, aboveAvg: 11, average: 7,  lower: false }, // 15
    { elite: 18, aboveAvg: 13, average: 9,  lower: false }, // 16
    { elite: 21, aboveAvg: 16, average: 11, lower: false }, // 17
    { elite: 25, aboveAvg: 19, average: 13, lower: false }, // 18+
  ],
}

function getAgeIndex(age: number): number {
  if (age <= 11) return 0
  if (age >= 18) return 7
  return age - 11 // 12→1, 13→2, 14→3, 15→4, 16→5, 17→6
}

export function getAgeTier(metricKey: string, value: number, age: number): Tier | null {
  const benchmarkRows = AGE_BENCHMARKS[metricKey]
  if (!benchmarkRows) return null
  const idx = getAgeIndex(age)
  const b = benchmarkRows[idx]
  if (b.lower) {
    if (value <= b.elite)   return "Elite"
    if (value <= b.aboveAvg) return "Above Average"
    if (value <= b.average)  return "Average"
    return "Below Average"
  } else {
    if (value >= b.elite)   return "Elite"
    if (value >= b.aboveAvg) return "Above Average"
    if (value >= b.average)  return "Average"
    return "Below Average"
  }
}

export function tierStyle(tier: Tier): string {
  switch (tier) {
    case "Elite":         return "bg-yellow-900/60 text-yellow-300 border border-yellow-700/60"
    case "Above Average": return "bg-green-900/50 text-green-300 border border-green-700/50"
    case "Average":       return "bg-blue-900/40 text-blue-300 border border-blue-700/40"
    case "Below Average": return "bg-gray-800 text-gray-400 border border-gray-700"
  }
}
