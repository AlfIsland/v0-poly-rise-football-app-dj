export interface Accolade {
  id: string
  title: string
  year: string
  organization?: string
  type: "mvp" | "offensive" | "defensive" | "academic" | "character" | "team"
}

export interface EducationAccolade {
  id: string
  title: string
  year: string
  detail?: string  // e.g. "3.9 GPA", "Top 5%", "800 Math"
}

export const EDUCATION_PRESETS: { title: string; placeholder: string }[] = [
  { title: "Honor Roll",                    placeholder: "e.g. 3.8 GPA" },
  { title: "Principal's List",              placeholder: "e.g. 4.0 GPA" },
  { title: "National Honor Society",        placeholder: "e.g. NHS Member" },
  { title: "Valedictorian",                 placeholder: "e.g. Class of 2026" },
  { title: "Salutatorian",                  placeholder: "e.g. Class of 2026" },
  { title: "AP Scholar",                    placeholder: "e.g. 4 AP courses" },
  { title: "Academic All-District",         placeholder: "e.g. District 25-5A" },
  { title: "Academic All-State",            placeholder: "e.g. THSCA" },
  { title: "Academic Scholarship",          placeholder: "e.g. $10,000 award" },
  { title: "Perfect Attendance",            placeholder: "" },
  { title: "Student Athlete of the Month",  placeholder: "" },
  { title: "Community Service Award",       placeholder: "" },
]

export const ACCOLADE_PRESETS: { title: string; type: Accolade["type"]; emoji: string }[] = [
  { title: "League MVP",                    type: "mvp",       emoji: "🏆" },
  { title: "Player of the Year",            type: "mvp",       emoji: "🏆" },
  { title: "Offensive Player of the Year",  type: "offensive", emoji: "🏈" },
  { title: "Defensive Player of the Year",  type: "defensive", emoji: "🛡️" },
  { title: "All-State 1st Team",            type: "team",      emoji: "⭐" },
  { title: "All-State 2nd Team",            type: "team",      emoji: "⭐" },
  { title: "All-District 1st Team",         type: "team",      emoji: "🌟" },
  { title: "All-District 2nd Team",         type: "team",      emoji: "🌟" },
  { title: "Honorable Mention",             type: "team",      emoji: "✨" },
  { title: "All-American",                  type: "mvp",       emoji: "🇺🇸" },
  { title: "All-Conference",                type: "team",      emoji: "🌟" },
  { title: "Offensive Lineman of the Year", type: "offensive", emoji: "🏈" },
  { title: "Academic All-District",         type: "academic",  emoji: "📚" },
  { title: "Academic All-State",            type: "academic",  emoji: "📚" },
  { title: "Team Captain",                  type: "character", emoji: "💪" },
  { title: "Character Award",               type: "character", emoji: "🎖️" },
]

export function accoladeEmoji(type: Accolade["type"]): string {
  switch (type) {
    case "mvp":       return "🏆"
    case "offensive": return "🏈"
    case "defensive": return "🛡️"
    case "academic":  return "📚"
    case "character": return "🎖️"
    case "team":      return "⭐"
  }
}

export function accoladeColors(type: Accolade["type"]): { bg: string; border: string; text: string; badge: string } {
  switch (type) {
    case "mvp":
      return { bg: "bg-yellow-950/50", border: "border-yellow-600/50", text: "text-yellow-300", badge: "bg-yellow-900/60 text-yellow-300" }
    case "offensive":
      return { bg: "bg-red-950/40", border: "border-red-700/50", text: "text-red-300", badge: "bg-red-900/60 text-red-300" }
    case "defensive":
      return { bg: "bg-blue-950/40", border: "border-blue-700/50", text: "text-blue-300", badge: "bg-blue-900/60 text-blue-300" }
    case "academic":
      return { bg: "bg-green-950/40", border: "border-green-700/50", text: "text-green-300", badge: "bg-green-900/60 text-green-300" }
    case "character":
      return { bg: "bg-purple-950/40", border: "border-purple-700/50", text: "text-purple-300", badge: "bg-purple-900/60 text-purple-300" }
    case "team":
      return { bg: "bg-gray-800/80", border: "border-gray-600/60", text: "text-white", badge: "bg-gray-700 text-gray-300" }
  }
}
