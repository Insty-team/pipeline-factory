"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  MessageCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Loader2,
  ExternalLink,
} from "lucide-react";
import type {
  AlimtokPayload,
  QueueItem,
  ReplyPayload,
} from "@/lib/ops-queue";

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
}

function isAlimtok(p: AlimtokPayload | ReplyPayload): p is AlimtokPayload {
  return "templateId" in p;
}

export default function OpsPage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "done" | "all">("pending");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ops/queue", { cache: "no-store" });
      const data = await res.json();
      setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    const t = setInterval(fetchItems, 8000);
    return () => clearInterval(t);
  }, [fetchItems]);

  async function handleDone(id: string) {
    setDoneId(id);
    try {
      await fetch(`/api/ops/queue/${id}/done`, { method: "POST" });
      await fetchItems();
    } finally {
      setDoneId(null);
    }
  }

  const filtered = items.filter((i) =>
    filter === "all" ? true : i.status === filter,
  );
  const pendingCount = items.filter((i) => i.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-5 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Operator Console
            </div>
            <h1 className="text-lg font-black text-slate-900">📥 운영 큐</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded-full">
              대기 {pendingCount}
            </span>
            <button
              onClick={fetchItems}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
              title="새로고침"
            >
              <RefreshCw
                className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-2 flex gap-1">
          {(["pending", "done", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[12px] px-3 py-1 rounded-full font-semibold ${
                filter === f
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {f === "pending" ? "대기" : f === "done" ? "처리됨" : "전체"}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-5 space-y-3">
        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-slate-400 text-sm">
            {filter === "pending"
              ? "🌷 대기 중인 요청이 없어요"
              : "기록이 없습니다"}
          </div>
        )}

        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
              item.status === "done"
                ? "border-slate-200 opacity-70"
                : item.type === "alimtok"
                  ? "border-pink-200"
                  : "border-amber-200"
            }`}
          >
            <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                {item.type === "alimtok" ? (
                  <Bell className="w-4 h-4 text-pink-600 flex-shrink-0" />
                ) : (
                  <MessageCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                )}
                <span className="text-xs font-bold text-slate-700">
                  {item.type === "alimtok" ? "알림톡" : "답글"}
                </span>
                <span className="text-[10px] text-slate-400">
                  · {item.shopName}
                </span>
                <span className="text-[10px] text-slate-400">
                  · {timeAgo(item.createdAt)}
                </span>
              </div>
              {item.status === "done" ? (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 완료
                </span>
              ) : (
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 대기
                </span>
              )}
            </div>

            <div className="px-4 py-3 space-y-2">
              {isAlimtok(item.payload) ? (
                <>
                  <div className="text-sm font-semibold text-slate-900">
                    [{item.payload.templateId}] {item.payload.templateName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    채널: {item.payload.channel}
                    {item.payload.customerName &&
                      ` · 손님: ${item.payload.customerName}`}
                    {item.payload.customerHandle &&
                      ` (${item.payload.customerHandle})`}
                  </div>
                  {item.payload.message && (
                    <pre className="text-xs whitespace-pre-wrap bg-pink-50/60 border border-pink-100 rounded-xl p-3 leading-relaxed text-slate-700 font-sans">
                      {item.payload.message}
                    </pre>
                  )}
                  <a
                    href="https://center-pf.kakao.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-700 hover:underline"
                  >
                    카카오 채널 관리자 열기{" "}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              ) : (
                <>
                  <div className="text-xs text-slate-500">
                    {item.payload.nickname}
                    {item.payload.visits && ` · ${item.payload.visits}번째 방문`}
                    {` · ${item.payload.channel === "naver" ? "네이버" : "인스타그램"}`}
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">
                    원본 후기
                  </div>
                  <pre className="text-xs whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-xl p-3 leading-relaxed text-slate-700 font-sans">
                    {item.payload.reviewText}
                  </pre>
                  <div className="text-[11px] font-bold text-amber-600 uppercase mt-2">
                    답글 시안 (복사해서 게시)
                  </div>
                  <pre className="text-xs whitespace-pre-wrap bg-amber-50/60 border border-amber-100 rounded-xl p-3 leading-relaxed text-slate-800 font-sans">
                    {item.payload.replyText}
                  </pre>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          (item.payload as ReplyPayload).replyText,
                        )
                      }
                      className="text-[11px] font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-full"
                    >
                      답글 복사
                    </button>
                    <a
                      href={
                        item.payload.channel === "naver"
                          ? "https://m.smartplace.naver.com/"
                          : "https://www.instagram.com/"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full"
                    >
                      {item.payload.channel === "naver" ? "네이버 플레이스" : "인스타"} 열기{" "}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </>
              )}

              {item.status === "pending" && (
                <button
                  onClick={() => handleDone(item.id)}
                  disabled={doneId === item.id}
                  className="w-full mt-2 bg-slate-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {doneId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {doneId === item.id ? "처리 중..." : "처리완료 표시"}
                </button>
              )}
              {item.status === "done" && item.doneAt && (
                <div className="text-[11px] text-slate-400 text-center">
                  ✓ {timeAgo(item.doneAt)}에 처리 완료
                </div>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
