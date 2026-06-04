import { markAlimtokRead } from "@/lib/ops-queue";

export const runtime = "nodejs";

export async function POST() {
  const count = await markAlimtokRead();
  return Response.json({ ok: true, count });
}
