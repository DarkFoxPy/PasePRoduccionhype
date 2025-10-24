import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/client"
import { getUserFromRequest } from "@/lib/auth/session"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const { eventId, registrationId, responses } = await request.json()

    const db = getDb()
    const user = await getUserFromRequest(request)

    // Insert form response
    const responseId = nanoid()
    db.prepare(
      `INSERT INTO form_responses (id, event_id, registration_id, user_id, responses, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(
      responseId,
      eventId,
      registrationId || null,
      user?.id || null,
      JSON.stringify(responses),
      new Date().toISOString(),
    )

    console.log("[v0] Form response saved successfully")

    return NextResponse.json({ success: true, id: responseId })
  } catch (error) {
    console.error("[v0] Error submitting form response:", error)
    return NextResponse.json({ error: "Failed to submit form response" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")

    console.log("[DEBUG] Fetching registrations for event:", eventId)

    if (!eventId) {
      return NextResponse.json({ error: "Event ID required" }, { status: 400 })
    }

    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify event exists and user is the organizer
    const event = db.prepare("SELECT id, organizer_id, title FROM events WHERE id = ?").get(eventId) as any

    if (!event) {
      console.log("[DEBUG] Event not found for ID:", eventId)
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    console.log("[DEBUG] Event found:", event.title, "Organizer:", event.organizer_id, "User:", user.id)

    if (event.organizer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized - Not event organizer" }, { status: 403 })
    }

    const registrations = db
      .prepare(`
      SELECT 
        id,
        event_id,
        user_id,
        user_name,
        user_email,
        phone,
        status,
        custom_answers,
        registered_at
      FROM registrations
      WHERE event_id = ?
      ORDER BY registered_at DESC
    `)
      .all(eventId)

    console.log("[DEBUG] Raw registrations from DB:", registrations)

    // Parse custom_answers JSON
    const parsedRegistrations = registrations.map((r: any) => ({
      ...r,
      responses: r.custom_answers ? (typeof r.custom_answers === 'string' ? JSON.parse(r.custom_answers) : r.custom_answers) : {},
    }))

    console.log("[DEBUG] Parsed registrations:", parsedRegistrations)

    return NextResponse.json({ 
      responses: parsedRegistrations,
      event: { title: event.title }
    })
  } catch (error) {
    console.error("[v0] Error fetching registrations:", error)
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}