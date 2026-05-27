import { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  CHATBOT_SYSTEM_PROMPT,
  ESCALATE_REPLY,
  detectEscalation,
} from "@/lib/chatbot-prompts";

export const runtime = "nodejs";
export const maxDuration = 30;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    const messages = body.messages ?? [];

    const last = messages[messages.length - 1];
    if (!last || last.role !== "user" || !last.content.trim()) {
      return Response.json({ error: "user message required" }, { status: 400 });
    }

    const hit = detectEscalation(last.content);
    if (hit) {
      return Response.json({
        reply: ESCALATE_REPLY,
        escalated: true,
        keyword: hit,
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 280,
      messages: [
        { role: "system", content: CHATBOT_SYSTEM_PROMPT },
        ...messages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!reply) {
      return Response.json(
        { error: "empty response from model" },
        { status: 502 },
      );
    }

    return Response.json({ reply, escalated: false });
  } catch (err) {
    console.error("[/api/chat]", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
