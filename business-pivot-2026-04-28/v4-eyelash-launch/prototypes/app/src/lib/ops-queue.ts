import { promises as fs } from "node:fs";
import path from "node:path";

export type QueueType = "alimtok" | "reply";
export type QueueStatus = "pending" | "done";

export type AlimtokPayload = {
  templateId: string;
  templateName: string;
  channel: "알림톡" | "친구톡";
  customerName?: string;
  customerHandle?: string;
  message?: string;
  category?: "reservation" | "post-visit" | "loyalty" | "marketing";
  cta?: { label: string; href: string };
  scheduledId?: string;
  delivered?: boolean;
  readAt?: string;
};

export type ReplyPayload = {
  reviewId: string;
  nickname: string;
  visits?: number;
  rating?: number;
  reviewText: string;
  replyText: string;
  channel: "naver" | "instagram";
  approvedAt?: string;
};

export type QueueItem = {
  id: string;
  type: QueueType;
  status: QueueStatus;
  createdAt: string;
  doneAt?: string;
  shopName: string;
  payload: AlimtokPayload | ReplyPayload;
};

const QUEUE_DIR = path.join(process.cwd(), ".queue");
const QUEUE_FILE = path.join(QUEUE_DIR, "items.json");

async function ensureFile() {
  await fs.mkdir(QUEUE_DIR, { recursive: true });
  try {
    await fs.access(QUEUE_FILE);
  } catch {
    await fs.writeFile(QUEUE_FILE, "[]", "utf8");
  }
}

export async function readQueue(): Promise<QueueItem[]> {
  await ensureFile();
  const raw = await fs.readFile(QUEUE_FILE, "utf8");
  try {
    return JSON.parse(raw) as QueueItem[];
  } catch {
    return [];
  }
}

async function writeQueue(items: QueueItem[]) {
  await ensureFile();
  await fs.writeFile(QUEUE_FILE, JSON.stringify(items, null, 2), "utf8");
}

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function addQueueItem(
  type: QueueType,
  shopName: string,
  payload: AlimtokPayload | ReplyPayload,
): Promise<QueueItem> {
  const items = await readQueue();
  const item: QueueItem = {
    id: newId(),
    type,
    status: "pending",
    createdAt: new Date().toISOString(),
    shopName,
    payload,
  };
  items.unshift(item);
  await writeQueue(items);
  return item;
}

export async function markDone(id: string): Promise<QueueItem | null> {
  const items = await readQueue();
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  item.status = "done";
  item.doneAt = new Date().toISOString();
  await writeQueue(items);
  return item;
}

export async function deleteItem(id: string): Promise<boolean> {
  const items = await readQueue();
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  await writeQueue(next);
  return true;
}

export function countPending(items: QueueItem[]) {
  return items.filter((i) => i.status === "pending").length;
}
