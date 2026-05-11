import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ATHLETE_COOKIE, getAthleteIdFromSession } from "@/lib/athlete-auth"

export default async function AthletePortalPage() {
  const token     = cookies().get(ATHLETE_COOKIE)?.value
  const athleteId = token ? await getAthleteIdFromSession(token) : null

  if (!athleteId) redirect("/athlete/login")

  // Redirect straight to their profile — that IS the portal
  redirect(`/athlete/${athleteId}`)
}
