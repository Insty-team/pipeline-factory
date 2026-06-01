import { NextRequest } from "next/server";
import { addEvent, readEvents, type EventType } from "@/lib/events-store";

export const runtime = "nodejs";

export async function GET() {
  const events = await readEvents();
  return Response.json({ events: events.slice(0, 50) });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type?: EventType;
      actor?: string;
      summary?: string;
      link?: string;
      meta?: Record<string, unknown>;
    };

    if (!body.type || !body.actor || !body.summary) {
      return Response.json(
        { error: "type, actor, summary required" },
        { status: 400 },
      );
    }

    const event = await addEvent(body.type, body.actor, body.summary, {
      link: body.link,
      meta: body.meta,
    });

    return Response.json({ ok: true, event });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return Response.json({ error: message }, { status: 500 });
  }
}
