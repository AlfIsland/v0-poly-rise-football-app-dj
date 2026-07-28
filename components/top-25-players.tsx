"use client"

import { useState } from "react"
import { Trophy } from "lucide-react"

interface Player {
  rank: number
  name: string
  position: string
  classYear: string
  rating: number
}

const westlakePlayers: Player[] = [
  { rank: 1, name: "Jaden Greathouse", position: "WR", classYear: "2025", rating: 98 },
  { rank: 2, name: "Colton Clark", position: "QB", classYear: "2026", rating: 96 },
  { rank: 3, name: "Marcus Johnson", position: "RB", classYear: "2026", rating: 95 },
  { rank: 4, name: "Derek Williams", position: "LB", classYear: "2027", rating: 94 },
  { rank: 5, name: "Ryan Mitchell", position: "OL", classYear: "2027", rating: 93 },
]

const lakeTravisPlayers: Player[] = [
  { rank: 1, name: "Kadyn Leon", position: "QB", classYear: "2026", rating: 97 },
  { rank: 2, name: "Caleb Burton Jr.", position: "WR", classYear: "2025", rating: 96 },
  { rank: 3, name: "Trey Martinez", position: "DB", classYear: "2026", rating: 95 },
  { rank: 4, name: "Jaylen Thompson", position: "RB", classYear: "2027", rating: 94 },
  { rank: 5, name: "Austin Reed", position: "DL", classYear: "2027", rating: 92 },
]

const drippingSpringPlayers: Player[] = [
  { rank: 1, name: "Lemanatele Kneubuhl", position: "DE", classYear: "2028", rating: 99 },
  { rank: 2, name: "Austin Black", position: "QB", classYear: "2026", rating: 95 },
  { rank: 3, name: "Brayden Smith", position: "WR", classYear: "2026", rating: 94 },
  { rank: 4, name: "Cole Anderson", position: "LB", classYear: "2027", rating: 93 },
  { rank: 5, name: "Jake Rivera", position: "OL", classYear: "2027", rating: 92 },
]

type SchoolKey = "westlake" | "lakeTravis" | "drippingSprings"

const schoolData: Record<SchoolKey, { name: string; city: string; players: Player[]; color: string }> = {
  westlake: {
    name: "Westlake High School",
    city: "Austin, TX",
    players: westlakePlayers,
    color: "bg-purple-600",
  },
  lakeTravis: {
    name: "Lake Travis High School",
    city: "Austin, TX",
    players: lakeTravisPlayers,
    color: "bg-red-600",
  },
  drippingSprings: {
    name: "Dripping Springs High School",
    city: "Dripping Springs, TX",
    players: drippingSpringPlayers,
    color: "bg-orange-600",
  },
}

export function Top25Players() {
  const [selectedSchool, setSelectedSchool] = useState<SchoolKey>("westlake")

  const currentSchool = schoolData[selectedSchool]

  return (
    <section className="py-8 lg:py-12 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold">Top 5 Football Players</h2>
            <p className="text-xs text-muted-foreground">Central Texas High School Football</p>
          </div>
        </div>

        {/* School Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedSchool("westlake")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedSchool === "westlake"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Westlake
          </button>
          <button
            onClick={() => setSelectedSchool("lakeTravis")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedSchool === "lakeTravis"
                ? "bg-red-600 text-white shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Lake Travis
          </button>
          <button
            onClick={() => setSelectedSchool("drippingSprings")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedSchool === "drippingSprings"
                ? "bg-orange-600 text-white shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Dripping Springs
          </button>
        </div>

        {/* School Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className={`w-3 h-8 rounded-full ${currentSchool.color}`} />
          <div>
            <h3 className="text-lg font-bold text-foreground">{currentSchool.name}</h3>
            <p className="text-xs text-muted-foreground">{currentSchool.city}</p>
          </div>
        </div>

        {/* Players Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Rank
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Name
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Position
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                    Class
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentSchool.players.map((player) => (
                  <tr key={`${selectedSchool}-player-${player.rank}`} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold ${currentSchool.color}`}>
                          {player.rank}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-foreground text-sm">{player.name}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                        {player.position}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">{player.classYear}</span>
                    </td>
                    <td className="py-2.5 px-3 hidden md:table-cell">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${currentSchool.color}`} style={{ width: `${player.rating}%` }} />
                        </div>
                        <span className="text-xs font-bold text-foreground w-6">{player.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
