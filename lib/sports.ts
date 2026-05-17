export const SPORTS = [
  { value: "football",      label: "Football",      emoji: "🏈", color: "red",    bg: "bg-red-900",    text: "text-red-300"    },
  { value: "flag-football", label: "Flag Football",  emoji: "🚩", color: "purple", bg: "bg-purple-900", text: "text-purple-300" },
  { value: "basketball",    label: "Basketball",     emoji: "🏀", color: "orange", bg: "bg-orange-900", text: "text-orange-300" },
  { value: "baseball",      label: "Baseball",       emoji: "⚾", color: "blue",   bg: "bg-blue-900",   text: "text-blue-300"   },
  { value: "softball",      label: "Softball",       emoji: "🥎", color: "pink",   bg: "bg-pink-900",   text: "text-pink-300"   },
  { value: "soccer",        label: "Soccer",         emoji: "⚽", color: "green",  bg: "bg-green-900",  text: "text-green-300"  },
  { value: "track",         label: "Track & Field",  emoji: "🏃", color: "teal",   bg: "bg-teal-900",   text: "text-teal-300"   },
  { value: "volleyball",    label: "Volleyball",     emoji: "🏐", color: "amber",  bg: "bg-amber-900",  text: "text-amber-300"  },
  { value: "wrestling",     label: "Wrestling",      emoji: "🤼", color: "rose",   bg: "bg-rose-900",   text: "text-rose-300"   },
  { value: "lacrosse",      label: "Lacrosse",       emoji: "🥍", color: "sky",    bg: "bg-sky-900",    text: "text-sky-300"    },
  { value: "swimming",      label: "Swimming",       emoji: "🏊", color: "cyan",   bg: "bg-cyan-900",   text: "text-cyan-300"   },
  { value: "cross-country", label: "Cross Country",  emoji: "🏃", color: "lime",   bg: "bg-lime-900",   text: "text-lime-300"   },
  { value: "golf",          label: "Golf",           emoji: "⛳", color: "emerald",bg: "bg-emerald-900",text: "text-emerald-300"},
  { value: "tennis",        label: "Tennis",         emoji: "🎾", color: "yellow", bg: "bg-yellow-900", text: "text-yellow-300" },
  { value: "other",         label: "Other",          emoji: "🏅", color: "gray",   bg: "bg-gray-800",   text: "text-gray-300"   },
] as const

export type SportValue = typeof SPORTS[number]["value"]

export function getSport(value?: string) {
  return SPORTS.find(s => s.value === value) ?? SPORTS[0]
}
