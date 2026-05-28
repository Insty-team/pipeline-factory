import { readQueue, type AlimtokPayload, type QueueItem } from "@/lib/ops-queue";

export const runtime = "nodejs";

export type InboxMessage = {
  id: string;
  templateId: string;
  templateName: string;
  channel: "알림톡" | "친구톡";
  category?: AlimtokPayload["category"];
  message: string;
  cta?: { label: string; href: string };
  customerName?: string;
  receivedAt: string;
  read: boolean;
};

function isAlimtok(p: QueueItem["payload"]): p is AlimtokPayload {
  return "templateId" in p && "templateName" in p;
}

export async function GET() {
  const items = await readQueue();
  const messages: InboxMessage[] = items
    .filter((i) => i.type === "alimtok" && isAlimtok(i.payload))
    .map((i) => {
      const p = i.payload as AlimtokPayload;
      return {
        id: i.id,
        templateId: p.templateId,
        templateName: p.templateName,
        channel: p.channel,
        category: p.category,
        message: p.message ?? "",
        cta: p.cta,
        customerName: p.customerName,
        receivedAt: i.createdAt,
        read: Boolean(p.readAt),
      };
    });
  return Response.json({ messages });
}
