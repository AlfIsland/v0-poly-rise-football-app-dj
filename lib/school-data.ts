export type Division = "D1" | "D2" | "D3" | "NAIA" | "JuCo"
export type Sport = "football" | "soccer" | "basketball" | "baseball" | "track" | "softball"
export type PositionGroup = "speed" | "athletic" | "lineman"

// ─── Position group classification ────────────────────────────────────────────
export function getPositionGroup(position?: string): PositionGroup {
  if (!position) return "speed"
  const p = position.toLowerCase()
  if (["ol","og","ot","oc","c","g","t","dl","de","dt","nt","tackle","guard","center","lineman","end"].some(x => p.includes(x))) return "lineman"
  if (["qb","lb","te","quarterback","linebacker","tight end","fb","fullback"].some(x => p.includes(x))) return "athletic"
  return "speed" // WR, CB, DB, S, RB, KR, etc.
}

// ─── 40-yard dash benchmarks by position group and division ───────────────────
// Lower = faster = better. These are the target times to COMPETE at each level.
export const FORTY_BENCHMARKS: Record<PositionGroup, Record<Division, number>> = {
  speed:    { D1: 4.50, D2: 4.65, D3: 4.80, NAIA: 4.85, JuCo: 4.90 },
  athletic: { D1: 4.75, D2: 4.90, D3: 5.00, NAIA: 5.10, JuCo: 5.15 },
  lineman:  { D1: 5.30, D2: 5.40, D3: 5.55, NAIA: 5.60, JuCo: 5.65 },
}

export type MatchQuality = "elite" | "strong" | "possible" | "reach"

export function getMatchQuality(fortyYard: number, posGroup: PositionGroup, division: Division): MatchQuality | null {
  const bench = FORTY_BENCHMARKS[posGroup][division]
  const diff = fortyYard - bench  // positive = slower than benchmark
  if (diff <= -0.10) return "elite"
  if (diff <=  0.00) return "strong"
  if (diff <=  0.10) return "possible"
  if (diff <=  0.20) return "reach"
  return null
}

export const MATCH_META: Record<MatchQuality, { label: string; color: string; order: number }> = {
  elite:    { label: "Elite Fit",   color: "bg-green-900/60 text-green-300 border-green-700/50",   order: 1 },
  strong:   { label: "Strong Fit",  color: "bg-blue-900/60 text-blue-300 border-blue-700/50",      order: 2 },
  possible: { label: "Possible Fit",color: "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",order: 3 },
  reach:    { label: "Reach",       color: "bg-orange-900/60 text-orange-300 border-orange-700/50",order: 4 },
}

export interface School {
  name: string
  city: string
  state: string
  division: Division
  conference?: string
  sports: Sport[]
  url: string
}

export const SCHOOLS: School[] = [
  // ── Texas D1 ──────────────────────────────────────────────────────────────
  { name: "University of Texas at Austin",      city: "Austin",         state: "TX", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://texassports.com" },
  { name: "Texas A&M University",               city: "College Station", state: "TX", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://12thman.com" },
  { name: "TCU",                                city: "Fort Worth",     state: "TX", division: "D1", conference: "Big 12",   sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://gofrogs.com" },
  { name: "Baylor University",                  city: "Waco",           state: "TX", division: "D1", conference: "Big 12",   sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://baylorbears.com" },
  { name: "Texas Tech University",              city: "Lubbock",        state: "TX", division: "D1", conference: "Big 12",   sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://texastech.com" },
  { name: "SMU",                                city: "Dallas",         state: "TX", division: "D1", conference: "ACC",      sports: ["football","basketball","soccer","track"], url: "https://smumustangs.com" },
  { name: "Rice University",                    city: "Houston",        state: "TX", division: "D1", conference: "AAC",      sports: ["football","basketball","baseball","soccer","track"], url: "https://riceowls.com" },
  { name: "UTSA",                               city: "San Antonio",    state: "TX", division: "D1", conference: "AAC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://utsaathletics.com" },
  { name: "University of North Texas",          city: "Denton",         state: "TX", division: "D1", conference: "AAC",      sports: ["football","basketball","soccer","track","softball"], url: "https://meangreensports.com" },
  { name: "Texas State University",             city: "San Marcos",     state: "TX", division: "D1", conference: "Sun Belt", sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://txstatebobcats.com" },
  { name: "Sam Houston State University",       city: "Huntsville",     state: "TX", division: "D1", conference: "UAC",      sports: ["football","basketball","baseball","track","softball"], url: "https://gobearkats.com" },
  { name: "Stephen F. Austin State University", city: "Nacogdoches",    state: "TX", division: "D1", conference: "UAC",      sports: ["football","basketball","baseball","track","softball"], url: "https://sfajacks.com" },
  { name: "Lamar University",                   city: "Beaumont",       state: "TX", division: "D1", conference: "UAC",      sports: ["football","basketball","baseball","track","softball"], url: "https://lamarcardinals.com" },
  { name: "Prairie View A&M University",        city: "Prairie View",   state: "TX", division: "D1", conference: "SWAC",     sports: ["football","basketball","baseball","track","softball"], url: "https://pvpanthers.com" },
  { name: "Texas Southern University",          city: "Houston",        state: "TX", division: "D1", conference: "SWAC",     sports: ["football","basketball","baseball","track","softball"], url: "https://tsusports.com" },
  { name: "Abilene Christian University",       city: "Abilene",        state: "TX", division: "D1", conference: "UAC",      sports: ["football","basketball","baseball","track","softball"], url: "https://acuwildcats.com" },
  { name: "Tarleton State University",          city: "Stephenville",   state: "TX", division: "D1", conference: "UAC",      sports: ["football","basketball","baseball","track","softball"], url: "https://tarletonsports.com" },
  { name: "UTEP",                               city: "El Paso",        state: "TX", division: "D1", conference: "CUSA",     sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://utepminers.com" },
  { name: "University of Houston",              city: "Houston",        state: "TX", division: "D1", conference: "Big 12",   sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://uhcougars.com" },

  // ── Texas D2 ──────────────────────────────────────────────────────────────
  { name: "West Texas A&M University",          city: "Canyon",         state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://wtambuffs.com" },
  { name: "Texas A&M-Commerce",                 city: "Commerce",       state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://tamuc.edu/athletics" },
  { name: "Angelo State University",            city: "San Angelo",     state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","track","softball"], url: "https://angelosports.com" },
  { name: "Midwestern State University",        city: "Wichita Falls",  state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://msumustangs.com" },
  { name: "Texas A&M-Kingsville",               city: "Kingsville",     state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","track","softball"], url: "https://tamuk.edu/athletics" },
  { name: "Sul Ross State University",          city: "Alpine",         state: "TX", division: "D2", conference: "Lone Star", sports: ["football","basketball","baseball","track","softball"], url: "https://sulrossathletics.com" },
  { name: "UT Permian Basin",                   city: "Odessa",         state: "TX", division: "D2", conference: "Lone Star", sports: ["basketball","baseball","soccer","track","softball"], url: "https://utpbathletics.com" },

  // ── Texas D3 ──────────────────────────────────────────────────────────────
  { name: "Trinity University",                 city: "San Antonio",    state: "TX", division: "D3", conference: "SCAC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://trinitytigers.com" },
  { name: "Austin College",                     city: "Sherman",        state: "TX", division: "D3", conference: "SCAC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://austincollege.edu/athletics" },
  { name: "Texas Lutheran University",          city: "Seguin",         state: "TX", division: "D3", conference: "SCAC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://tlubulldogs.com" },
  { name: "McMurry University",                 city: "Abilene",        state: "TX", division: "D3", conference: "ASC",       sports: ["football","basketball","baseball","track","softball"], url: "https://mcmurrysports.com" },
  { name: "Hardin-Simmons University",          city: "Abilene",        state: "TX", division: "D3", conference: "ASC",       sports: ["football","basketball","baseball","track","softball"], url: "https://hsuathletics.com" },
  { name: "Howard Payne University",            city: "Brownwood",      state: "TX", division: "D3", conference: "ASC",       sports: ["football","basketball","baseball","track","softball"], url: "https://hpuyellowjackets.com" },
  { name: "East Texas Baptist University",      city: "Marshall",       state: "TX", division: "D3", conference: "ASC",       sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://etbutigers.com" },
  { name: "University of Mary Hardin-Baylor",   city: "Belton",         state: "TX", division: "D3", conference: "ASC",       sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://umhbcrusaders.com" },
  { name: "Southwestern University",            city: "Georgetown",     state: "TX", division: "D3", conference: "SCAC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://swusports.com" },

  // ── Texas NAIA ────────────────────────────────────────────────────────────
  { name: "Texas Wesleyan University",          city: "Fort Worth",     state: "TX", division: "NAIA", conference: "Sooner Athletic", sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://txwes.edu/athletics" },
  { name: "Wayland Baptist University",         city: "Plainview",      state: "TX", division: "NAIA", conference: "Sooner Athletic", sports: ["football","basketball","baseball","track","softball"], url: "https://wbuathletics.com" },
  { name: "SAGU",                               city: "Waxahachie",     state: "TX", division: "NAIA", conference: "Sooner Athletic", sports: ["football","basketball","baseball","track","softball"], url: "https://sagusports.com" },
  { name: "Paul Quinn College",                 city: "Dallas",         state: "TX", division: "NAIA", conference: "Red River",       sports: ["basketball","track"], url: "https://pqc.edu/athletics" },

  // ── Texas JuCo ───────────────────────────────────────────────────────────
  { name: "Blinn College",                      city: "Brenham",        state: "TX", division: "JuCo", conference: "NJCAA",   sports: ["football","basketball","baseball","soccer","softball"], url: "https://blinnathletics.com" },
  { name: "Kilgore College",                    city: "Kilgore",        state: "TX", division: "JuCo", conference: "NJCAA",   sports: ["football","basketball","baseball","track","softball"], url: "https://kilgorecollege.edu/athletics" },
  { name: "Tyler Junior College",               city: "Tyler",          state: "TX", division: "JuCo", conference: "NJCAA",   sports: ["football","basketball","baseball","track","softball"], url: "https://tjc.edu/athletics" },
  { name: "Navarro College",                    city: "Corsicana",      state: "TX", division: "JuCo", conference: "NJCAA",   sports: ["football","basketball","baseball","track","softball"], url: "https://navarrocollege.edu/athletics" },
  { name: "Trinity Valley Community College",   city: "Athens",         state: "TX", division: "JuCo", conference: "NJCAA",   sports: ["football","basketball","baseball","track","softball"], url: "https://tvcc.edu/athletics" },
  { name: "Cisco College",                      city: "Cisco",          state: "TX", division: "JuCo", conference: "NJCAA",   sports: ["football","basketball","baseball","track"], url: "https://cisco.edu/athletics" },
  { name: "Northeastern Oklahoma A&M",          city: "Miami",          state: "OK", division: "JuCo", conference: "NJCAA",   sports: ["football","basketball","baseball","track","softball"], url: "https://neoam.edu/athletics" },

  // ── Out-of-State Notable Programs ─────────────────────────────────────────
  { name: "Oklahoma State University",          city: "Stillwater",     state: "OK", division: "D1", conference: "Big 12",   sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://okstate.com" },
  { name: "University of Oklahoma",             city: "Norman",         state: "OK", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://soonersports.com" },
  { name: "LSU",                                city: "Baton Rouge",    state: "LA", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://lsusports.net" },
  { name: "University of Arkansas",             city: "Fayetteville",   state: "AR", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://arkansasrazorbacks.com" },
  { name: "University of Alabama",              city: "Tuscaloosa",     state: "AL", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://rolltide.com" },
  { name: "Florida State University",           city: "Tallahassee",    state: "FL", division: "D1", conference: "ACC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://seminoles.com" },
  { name: "University of Miami",                city: "Coral Gables",   state: "FL", division: "D1", conference: "ACC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://hurricanesports.com" },
  { name: "University of Georgia",              city: "Athens",         state: "GA", division: "D1", conference: "SEC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://georgiadogs.com" },
  { name: "Ohio State University",              city: "Columbus",       state: "OH", division: "D1", conference: "Big Ten",  sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://ohiostatebuckeyes.com" },
  { name: "University of Southern California",  city: "Los Angeles",    state: "CA", division: "D1", conference: "Big Ten",  sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://usctrojans.com" },
  { name: "Penn State University",              city: "State College",  state: "PA", division: "D1", conference: "Big Ten",  sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://gopsusports.com" },
  { name: "Notre Dame",                         city: "South Bend",     state: "IN", division: "D1", conference: "ACC",      sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://und.com" },
  { name: "University of Colorado",             city: "Boulder",        state: "CO", division: "D1", conference: "Big 12",   sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://cubuffs.com" },
  { name: "Arizona State University",           city: "Tempe",          state: "AZ", division: "D1", conference: "Big 12",   sports: ["football","basketball","baseball","soccer","track","softball"], url: "https://thesundevils.com" },
]

export function filterSchools(opts: {
  sport?: Sport
  division?: Division | "Any"
  region?: "Texas" | "South" | "Nationwide"
}): School[] {
  const SOUTH = ["TX","OK","LA","AR","MS","AL","TN","GA","FL","SC","NC","VA","KY"]

  return SCHOOLS.filter(s => {
    if (opts.sport && !s.sports.includes(opts.sport)) return false
    if (opts.division && opts.division !== "Any" && s.division !== opts.division) return false
    if (opts.region === "Texas" && s.state !== "TX") return false
    if (opts.region === "South" && !SOUTH.includes(s.state)) return false
    return true
  })
}
