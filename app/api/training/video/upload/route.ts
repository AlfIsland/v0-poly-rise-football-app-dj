import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { getAthleteIdFromSession, ATHLETE_COOKIE } from "@/lib/athlete-auth"

// Generates a short-lived client token so the browser can upload the video file
// directly to Vercel Blob (server routes can't proxy large video bodies).
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayloadRaw) => {
        const clientPayload = clientPayloadRaw ? JSON.parse(clientPayloadRaw) : null
        const athleteId: string | undefined = clientPayload?.athleteId

        const cookieStore = await cookies()
        const isAdmin =
          !!cookieStore.get("pr_admin_session")?.value &&
          cookieStore.get("pr_admin_session")?.value === process.env.ADMIN_SESSION_TOKEN

        let isOwningAthlete = false
        const athleteToken = cookieStore.get(ATHLETE_COOKIE)?.value
        if (athleteToken && athleteId) {
          const loggedInId = await getAthleteIdFromSession(athleteToken)
          isOwningAthlete = !!loggedInId && loggedInId.toUpperCase() === athleteId.toUpperCase()
        }

        if (!athleteId || (!isAdmin && !isOwningAthlete)) {
          throw new Error("Unauthorized")
        }

        return {
          allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"],
          maximumSizeInBytes: 300 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ athleteId: athleteId.toUpperCase() }),
        }
      },
      onUploadCompleted: async () => {
        // No-op: the client registers the pending test via /api/training/video/register
        // right after upload() resolves, since this callback only fires when Vercel can
        // reach a public callback URL (not during local development).
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
