// Converts a grade string like "7th", "8th", "10th" into an approximate class year
// Used to feed the ratings engine for training athletes
export function gradeToClassYear(grade: string): string {
  const currentYear = new Date().getFullYear()
  const gradeMap: Record<string, number> = {
    "k": 12, "kindergarten": 12,
    "1st": 11, "1": 11,
    "2nd": 10, "2": 10,
    "3rd": 9,  "3": 9,
    "4th": 8,  "4": 8,
    "5th": 7,  "5": 7,
    "6th": 6,  "6": 6,
    "7th": 5,  "7": 5,
    "8th": 4,  "8": 4,
    "9th": 3,  "9": 3,
    "10th": 2, "10": 2,
    "11th": 1, "11": 1,
    "12th": 0, "12": 0,
  }
  const key = grade.toLowerCase().trim()
  const yearsLeft = gradeMap[key]
  if (yearsLeft == null) return String(currentYear + 2) // default
  return String(currentYear + yearsLeft)
}
