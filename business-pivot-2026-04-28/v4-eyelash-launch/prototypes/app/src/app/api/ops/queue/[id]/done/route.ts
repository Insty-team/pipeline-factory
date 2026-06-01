import { markDone, type AlimtokPayload, type ReplyPayload } from "@/lib/ops-queue";
import { addEvent } from "@/lib/events-store";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const item = await markDone(id);
  if (!item) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  if (item.type === "reply") {
    const p = item.payload as ReplyPayload;
    await addEvent(
      "review-posted",
      "Sam",
      `${p.nickname} 후기 답글 네이버 게시 완료`,
      { link: `/mock/naver-review/${p.reviewId}` },
    );
  } else if (item.type === "alimtok") {
    const p = item.payload as AlimtokPayload;
    await addEvent(
      "alimtok-sent",
      "Sam",
      `${p.templateName} 처리 완료 (${p.channel})`,
    );
  }

  return Response.json({ ok: true, item });
}
