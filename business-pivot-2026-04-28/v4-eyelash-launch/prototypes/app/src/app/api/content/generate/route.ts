import { NextRequest } from "next/server";
import OpenAI from "openai";
import { CONTENT_SYSTEM_PROMPT } from "@/lib/content-prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const image = form.get("image");
    const menuHint = ((form.get("menuHint") as string | null) ?? "").trim();

    if (!(image instanceof File)) {
      return Response.json({ error: "image file is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const mime = image.type || "image/jpeg";
    const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.8,
      messages: [
        { role: "system", content: CONTENT_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl } },
            {
              type: "text",
              text: `시술 메뉴 힌트: "${menuHint || "(없음 — 사진으로 추정해주세요)"}".\n사진을 보고 시술 종류(펌/연장/펌+연장)와 손님 눈매를 추론한 뒤 위 출력 JSON을 작성하세요.`,
            },
          ],
        },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      return Response.json(
        { error: "model returned invalid JSON", raw: text },
        { status: 502 }
      );
    }

    return Response.json({
      ...parsed,
      image_data_url: dataUrl,
      menu_hint: menuHint,
    });
  } catch (err) {
    const e = err as { status?: number; message?: string };
    console.error("[/api/content/generate]", e);
    return Response.json(
      { error: e.message ?? "unknown", status: e.status },
      { status: e.status ?? 500 }
    );
  }
}
