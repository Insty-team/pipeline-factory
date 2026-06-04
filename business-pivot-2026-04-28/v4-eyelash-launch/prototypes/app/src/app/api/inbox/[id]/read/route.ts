import { markAlimtokReadById } from "@/lib/ops-queue";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const item = await markAlimtokReadById(id);
  if (!item) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ ok: true, item });
}
