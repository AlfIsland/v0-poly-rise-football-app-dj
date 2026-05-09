/**
 * Grad Year utilities
 *
 * Store the athlete's expected graduation year (e.g. 2029) once.
 * Grade is then computed automatically every year — no manual updates needed.
 *
 * Rule: on May 25 each year the school year is considered over and the athlete
 * advances to the next grade.
 */

export function currentSchoolYearEnd(): number {
  const today = new Date()
  const cutoff = new Date(today.getFullYear(), 4, 25) // May 25 (month is 0-indexed)
  return today >= cutoff ? today.getFullYear() + 1 : today.getFullYear()
}

export function gradeNumFromGradYear(gradYear: number): number {
  const yearEnd = currentSchoolYearEnd()
  const yearsLeft = gradYear - yearEnd
  return 12 - yearsLeft
}

const GRADE_LABELS: Record<number, string> = {
  0: "Kindergarten",
  1: "1st Grade",
  2: "2nd Grade",
  3: "3rd Grade",
  4: "4th Grade",
  5: "5th Grade",
  6: "6th Grade",
  7: "7th Grade",
  8: "8th Grade",
  9: "9th Grade (Freshman)",
  10: "10th Grade (Sophomore)",
  11: "11th Grade (Junior)",
  12: "12th Grade (Senior)",
}

export function gradeStringFromGradYear(gradYear: number): string {
  const n = gradeNumFromGradYear(gradYear)
  if (n <= 0) return GRADE_LABELS[0] ?? "Kindergarten"
  if (n > 12) return "Graduated"
  return GRADE_LABELS[n] ?? `Grade ${n}`
}

export function tierFromGradYear(gradYear: number): number {
  const n = gradeNumFromGradYear(gradYear)
  if (n <= 7) return 1
  if (n === 8) return 2
  if (n <= 10) return 3
  if (n === 11) return 4
  return 5
}

/** Returns an array of grad years for the dropdown (current graduating class through 13 years out) */
export function gradYearOptions(): number[] {
  const yearEnd = currentSchoolYearEnd()
  return Array.from({ length: 14 }, (_, i) => yearEnd + i)
}
