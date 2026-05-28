"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Sparkles,
  Loader2,
  CheckCircle2,
  Edit3,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";
import { SEED_REVIEWS, type SeededReview } from "@/lib/seed-reviews";

type ApprovedRecord = {
  reviewId: string;
  queueId: string;
  approvedAt: string;
  doneAt?: string;
  replyText: string;
};

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

export default function ReplyPage() {
  const reviews = SEED_REVIEWS;
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(reviews.map((r) => [r.id, r.draftReply])),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [approved, setApproved] = useState<Record<string, ApprovedRecord>>({});

  const fetchApproved = useCallback(async () => {
    try {
      const res = await fetch("/api/ops/queue", { cache: "no-store" });
      const data = await res.json();
      const map: Record<string, ApprovedRecord> = {};
      for (const item of data.items ?? []) {
        if (item.type === "reply" && item.payload?.reviewId) {
          map[item.payload.reviewId] = {
            reviewId: item.payload.reviewId,
            queueId: item.id,
            approvedAt: item.payload.approvedAt ?? item.createdAt,
            doneAt: item.status === "done" ? item.doneAt : undefined,
            replyText: item.payload.replyText,
          };
        }
      }
      setApproved(map);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchApproved();
    const t = setInterval(fetchApproved, 10000);
    return () => clearInterval(t);
  }, [fetchApproved]);

  async function approve(r: SeededReview) {
    const text = drafts[r.id]?.trim();
    if (!text) {
      toast.error("답글 내용을 작성해주세요");
      return;
    }
    setSubmittingId(r.id);
    try {
      const res = await fetch("/api/ops/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reply",
          shopName: "유어라인",
          payload: {
            reviewId: r.id,
            nickname: r.nickname,
            visits: r.visits,
            rating: r.rating,
            reviewText: r.reviewText,
            replyText: text,
            channel: r.channel,
            approvedAt: new Date().toISOString(),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "승인 실패");
      toast.success("✅ 승인 완료 — Sam이 네이버에 5분 안에 게시합니다");
      setEditingId(null);
      await fetchApproved();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "승인 실패";
      toast.error(msg);
    } finally {
      setSubmittingId(null);
    }
  }

  const pendingCount = useMemo(
    () => reviews.filter((r) => !approved[r.id]).length,
    [reviews, approved],
  );
  const approvedCount = reviews.length - pendingCount;

  return (
    <>
      <TopAppBar title="💌 후기 답글" />
      <div className="px-5 py-5 space-y-4">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50/60 border border-pink-100 rounded-2xl p-4">
          <div className="text-sm font-bold text-pink-700 mb-1">
            🌅 오늘 아침 Sam이 정리한 신규 후기 {reviews.length}건
          </div>
          <p className="text-[12px] text-pink-700/70 leading-relaxed">
            네이버 플레이스에 올라온 후기를 매일 캡처·정리해서 사장님 톤 시안과 함께
            드려요. 사장님은 시안 검토만 하시면 됩니다♡
          </p>
          <div className="flex gap-2 mt-3 text-[11px] font-bold">
            <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
              대기 {pendingCount}
            </span>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              승인 {approvedCount}
            </span>
            <button
              onClick={fetchApproved}
              className="ml-auto text-pink-600 flex items-center gap-1 hover:text-pink-700"
            >
              <RefreshCw className="w-3 h-3" /> 새로고침
            </button>
          </div>
        </div>

        {reviews.map((r, i) => {
          const approvedItem = approved[r.id];
          const isApproved = Boolean(approvedItem);
          const isPosted = Boolean(approvedItem?.doneAt);
          const isEditing = editingId === r.id;
          const isSubmitting = submittingId === r.id;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white rounded-2xl border overflow-hidden shadow-sm ${
                isPosted
                  ? "border-emerald-200"
                  : isApproved
                    ? "border-amber-200"
                    : "border-gray-100"
              }`}
            >
              {/* 원본 후기 — 네이버 스타일 */}
              <div className="p-4 bg-slate-50/60 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                    NAVER
                  </div>
                  <div className="font-semibold text-sm">{r.nickname}</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-medium">
                    {r.visits}번째 방문
                  </span>
                  <div className="flex">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-3 h-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {timeAgo(r.collectedAt)} 수집
                  </span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {r.reviewText}
                </p>
              </div>

              {/* 답글 시안 */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                  <div className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">
                    AI 답글 시안 — 사장님 톤 학습
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    value={drafts[r.id] ?? ""}
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))
                    }
                    rows={6}
                    className="w-full text-sm leading-relaxed px-3 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 outline-none whitespace-pre-line mb-3"
                  />
                ) : (
                  <pre className="text-sm leading-relaxed whitespace-pre-line mb-3 bg-pink-50/40 border border-pink-100 rounded-xl p-3 font-sans">
                    {drafts[r.id] ?? r.draftReply}
                  </pre>
                )}

                {isPosted ? (
                  <div className="space-y-2">
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-[12px] font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      네이버에 게시 완료 · {timeAgo(approvedItem!.doneAt!)}
                    </div>
                    <Link
                      href={`/mock/naver-review/${r.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700 hover:underline"
                    >
                      네이버에서 보기 <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ) : isApproved ? (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-[12px] font-bold text-amber-700 flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    승인됨 · Sam이 네이버에 게시 중 (5분 이내)
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approve(r)}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting ? "요청 중..." : "승인 후 게시 요청"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setEditingId(isEditing ? null : r.id)
                      }
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      {isEditing ? "보기" : "수정"}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        <div className="text-center text-[11px] text-muted-foreground pt-2 leading-relaxed">
          📝 베타 운영 — Sam이 매일 아침 새 후기 수집 + 시안 생성<br />
          사장님 승인 → Sam이 사장님 대신 네이버에 게시 (계정 위임 X, 신뢰 쌓일 때까지)
        </div>
      </div>
    </>
  );
}
