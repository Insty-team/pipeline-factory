import { NextRequest } from "next/server";
import {
  addQueueItem,
  readQueue,
  type AlimtokPayload,
  type QueueType,
  type ReplyPayload,
} from "@/lib/ops-queue";
import { addEvent } from "@/lib/events-store";

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

    if (item.type === "alimtok") {
      const p = item.payload as AlimtokPayload;
      await addEvent(
        "alimtok-sent",
        "사장",
        `${p.channel} ${p.templateName} → ${p.customerName ?? "손님"} 인박스 도착`,
        { link: "/c/inbox" },
      );
    } else if (item.type === "reply") {
      const p = item.payload as ReplyPayload;
      await addEvent(
        "review-approved",
        "사장",
        `${p.nickname} 후기 답글 승인 → Sam 게시 대기`,
        { link: "/ops" },
      );
    }

    return Response.json({ ok: true, item });
  } catch (err) {
    console.error("[/api/ops/queue POST]", err);
    const message = err instanceof Error ? err.message : "unknown";
    return Response.json({ error: message }, { status: 500 });
  }
}
