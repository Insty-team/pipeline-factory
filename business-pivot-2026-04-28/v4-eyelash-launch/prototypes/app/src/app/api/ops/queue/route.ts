import { NextRequest } from "next/server";
import {
  addQueueItem,
  readQueue,
  type AlimtokPayload,
  type QueueType,
  type ReplyPayload,
} from "@/lib/ops-queue";

export const runtime = "nodejs";

export async function GET() {
  const items = await readQueue();
  return Response.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type?: QueueType;
      shopName?: string;
      payload?: AlimtokPayload | ReplyPayload;
    };

    if (!body.type || (body.type !== "alimtok" && body.type !== "reply")) {
      return Response.json({ error: "type must be 'alimtok' or 'reply'" }, { status: 400 });
    }
    if (!body.payload) {
      return Response.json({ error: "payload required" }, { status: 400 });
    }

    const item = await addQueueItem(
      body.type,
      body.shopName ?? "유어라인",
      body.payload,
    );

    return Response.json({ ok: true, item });
  } catch (err) {
    console.error("[/api/ops/queue POST]", err);
    const message = err instanceof Error ? err.message : "unknown";
    return Response.json({ error: message }, { status: 500 });
  }
}
