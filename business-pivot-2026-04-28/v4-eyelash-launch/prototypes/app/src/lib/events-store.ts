import { promises as fs } from "node:fs";
import path from "node:path";

export type EventType =
  | "sim"
  | "chat"
  | "chat-escalated"
  | "inbox-open"
  | "inbox-cta"
  | "review-new"
  | "review-approved"
  | "review-posted"
  | "content-published"
  | "alimtok-sent"
  | "loyalty-care";

export type ActivityEvent = {
  id: string;
  type: EventType;
  emoji: string;
  actor: string;
  summary: string;
  link?: string;
  createdAt: string;
  meta?: Record<string, unknown>;
};

const EVENTS_DIR = path.join(process.cwd(), ".queue");
const EVENTS_FILE = path.join(EVENTS_DIR, "events.json");
const MAX_EVENTS = 200;

const TYPE_EMOJI: Record<EventType, string> = {
  sim: "✨",
  chat: "💬",
  "chat-escalated": "⚠️",
  "inbox-open": "📥",
  "inbox-cta": "👆",
  "review-new": "⭐",
  "review-approved": "✅",
  "review-posted": "📝",
  "content-published": "📸",
  "alimtok-sent": "📢",
  "loyalty-care": "💎",
};

async function ensureFile() {
  await fs.mkdir(EVENTS_DIR, { recursive: true });
  try {
    await fs.access(EVENTS_FILE);
  } catch {
    await fs.writeFile(EVENTS_FILE, "[]", "utf8");
  }
}

export async function readEvents(): Promise<ActivityEvent[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(EVENTS_FILE, "utf8");
    return JSON.parse(raw) as ActivityEvent[];
  } catch {
    return [];
  }
}

async function writeEvents(events: ActivityEvent[]) {
  await ensureFile();
  const capped = events.slice(0, MAX_EVENTS);
  await fs.writeFile(EVENTS_FILE, JSON.stringify(capped, null, 2), "utf8");
}

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function addEvent(
  type: EventType,
  actor: string,
  summary: string,
  options?: { link?: string; meta?: Record<string, unknown> },
): Promise<ActivityEvent> {
  const events = await readEvents();
  const event: ActivityEvent = {
    id: newId(),
    type,
    emoji: TYPE_EMOJI[type] ?? "•",
    actor,
    summary,
    link: options?.link,
    meta: options?.meta,
    createdAt: new Date().toISOString(),
  };
  events.unshift(event);
  await writeEvents(events);
  return event;
}
