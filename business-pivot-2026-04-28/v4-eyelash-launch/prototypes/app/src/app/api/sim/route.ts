import { NextRequest } from "next/server";
import OpenAI, { toFile } from "openai";
import { SERVICES, type ServiceKey, type ModelKey } from "@/lib/sim-prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const image = form.get("image");
    const mask = form.get("mask");
    const serviceKey = form.get("service") as ServiceKey | null;
    const modelKey = (form.get("model") as ModelKey | null) ?? "gpt-image-2";

    if (!(image instanceof File)) {
      return Response.json({ error: "image file is required" }, { status: 400 });
    }
    if (!serviceKey) {
      return Response.json({ error: "service key is required" }, { status: 400 });
    }

    const service = SERVICES.find((s) => s.key === serviceKey);
    if (!service) {
      return Response.json({ error: "unknown service" }, { status: 400 });
    }

    const imageFile = await toFile(image, image.name || "selfie.png", { type: image.type });
    const maskFile =
      mask instanceof File
        ? await toFile(mask, mask.name || "mask.png", { type: mask.type })
        : undefined;

    const result = await client.images.edit({
      model: modelKey,
      image: imageFile,
      mask: maskFile,
      prompt: service.prompt,
      n: 1,
      size: modelKey === "dall-e-2" ? "1024x1024" : "1024x1024",
    });

    const first = result.data?.[0];
    if (!first) {
      return Response.json({ error: "no result" }, { status: 502 });
    }

    return Response.json({
      url: first.url ?? null,
      b64: first.b64_json ?? null,
      model: modelKey,
      service: service.label,
    });
  } catch (err) {
    const e = err as { status?: number; message?: string };
    console.error("[/api/sim] error", e);
    return Response.json(
      {
        error: e.message ?? "unknown",
        status: e.status,
      },
      { status: e.status ?? 500 }
    );
  }
}
