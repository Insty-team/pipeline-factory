import { markEventHandled } from "@/lib/events-store";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const event = await markEventHandled(id);
  if (!event) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ ok: true, event });
}
