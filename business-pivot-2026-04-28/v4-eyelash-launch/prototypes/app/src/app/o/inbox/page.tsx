"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  AlertTriangle,
  Star,
  Heart,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { TopAppBar } from "@/components/common/TopAppBar";
import type { ActivityEvent } from "@/lib/events-store";
import { customers } from "@/lib/data";
import { topChurnRisk } from "@/lib/analytics";
import { SEED_REVIEWS } from "@/lib/seed-reviews";
import { SCHEDULED_ALIMTOK, type ScheduledAlimtok } from "@/lib/seed-scheduled-alimtok";
import { Clock as ClockIcon, SendHorizonal, MinusCircle } from "lucide-react";

type ReplyQueueItem = {
  id: string;
  type: string;
  status: string;
  payload: { reviewId?: string; scheduledId?: string };
};

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

const churnTop = topChurnRisk(customers, 5);

export default function OwnerInboxPage() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [queueItems, setQueueItems] = useState<ReplyQueueItem[]>([]);
  const [careCustomer, setCareCustomer] = useState<
    | null
    | { 닉네임: string; 미방문일수: number; 손님ID: string }
  >(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [sendingScheduledId, setSendingScheduledId] = useState<string | null>(null);
  const [skippedScheduled, setSkippedScheduled] = useState<Set<string>>(new Set());

  const fetchAll = useCallback(async () => {
    try {
      const [ev, q] = await Promise.all([
        fetch("/api/events", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/ops/queue", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setEvents(ev.events ?? []);
      setQueueItems(q.items ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchAll();
    const t = setInterval(fetchAll, 8000);
    return () => clearInterval(t);
  }, [fetchAll]);

  const pendingReservations = useMemo(
    () =>
      events.filter(
        (e) => e.type === "reservation" && !e.handled,
      ),
    [events],
  );

  const pendingEscalations = useMemo(
    () =>
      events.filter(
        (e) => e.type === "chat-escalated" && !e.handled,
      ),
    [events],
  );

  const approvedReviewIds = useMemo(() => {
    const set = new Set<string>();
    for (const item of queueItems) {
      if (item.type === "reply" && item.payload?.reviewId) {
        set.add(item.payload.reviewId);
      }
    }
    return set;
  }, [queueItems]);

  const pendingReviews = SEED_REVIEWS.filter(
    (r) => !approvedReviewIds.has(r.id),
  );

  const careSentNames = useMemo(() => {
    const set = new Set<string>();
    for (const e of events) {
      if (e.type === "loyalty-care") {
        const m = e.summary.match(/^([^\s]+)/);
        if (m) set.add(m[1]);
      }
    }
    return set;
  }, [events]);

  const pendingChurn = churnTop.filter((c) => !careSentNames.has(c.닉네임));

  const sentScheduledIds = useMemo(() => {
    const set = new Set<string>();
    for (const item of queueItems) {
      if (item.type === "alimtok" && item.payload?.scheduledId) {
        set.add(item.payload.scheduledId);
      }
    }
    return set;
  }, [queueItems]);

  const pendingScheduled = SCHEDULED_ALIMTOK.filter(
    (s) => !sentScheduledIds.has(s.id) && !skippedScheduled.has(s.id),
  );

  const totalPending =
    pendingReservations.length +
    pendingScheduled.length +
    pendingEscalations.length +
    pendingReviews.length +
    pendingChurn.length;

  async function sendScheduledNow(s: ScheduledAlimtok) {
    setSendingScheduledId(s.id);
    try {
      const res = await fetch("/api/ops/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "alimtok",
          shopName: "유어라인",
          payload: {
            templateId: s.templateId,
            templateName: s.templateName,
            channel: s.channel,
            category: s.category,
            customerName: s.customerName,
            message: s.message,
            cta: s.cta,
            scheduledId: s.id,
          },
        }),
      });
      if (!res.ok) throw new Error("발송 실패");
      toast.success(`📥 ${s.customerName} 인박스로 발송됐어요♡`);
      await fetchAll();
    } catch {
      toast.error("발송 실패");
    } finally {
      setSendingScheduledId(null);
    }
  }

  function skipScheduled(s: ScheduledAlimtok) {
    setSkippedScheduled((prev) => new Set(prev).add(s.id));
    toast(`이번엔 안 보내요 — ${s.templateName}`);
  }

  async function confirmReservation(ev: ActivityEvent) {
    setConfirmingId(ev.id);
    try {
      const meta = (ev.meta ?? {}) as Record<string, string>;
      await fetch("/api/ops/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "alimtok",
          shopName: "유어라인",
          payload: {
            templateId: "A1",
            templateName: "예약 확정",
            channel: "알림톡",
            category: "reservation",
            customerName: "손님",
            message: `예약 확정됐어요♡\n시간: ${meta.date ?? ""} ${meta.time ?? ""}\n메뉴: ${meta.menuName ?? ""}\n변경 필요 시 앱에서 바로 알려주세요~`,
            cta: {
              label: "예약 상세 보기",
              href: `/c/reserve?confirmed=1&menu=${encodeURIComponent(meta.menuName ?? "")}&date=${encodeURIComponent(meta.date ?? "")}&time=${encodeURIComponent(meta.time ?? "")}&price=${encodeURIComponent(meta.price ?? "")}`,
            },
          },
        }),
      });
      await fetch(`/api/events/${ev.id}/handle`, { method: "POST" });
      toast.success("✅ 확정 + A1 알림톡 발송됨");
      await fetchAll();
    } catch {
      toast.error("확정 실패");
    } finally {
      setConfirmingId(null);
    }
  }

  async function resolveEvent(ev: ActivityEvent) {
    setResolvingId(ev.id);
    try {
      await fetch(`/api/events/${ev.id}/handle`, { method: "POST" });
      toast.success("처리 완료로 표시");
      await fetchAll();
    } catch {
      toast.error("처리 실패");
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <>
      <TopAppBar title="📥 할 일 인박스" />
      <div className="px-5 py-5 space-y-5">
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="text-[10px] font-bold text-white/85 uppercase tracking-wider mb-1">
              Today&apos;s Action Items
            </div>
            <div className="text-2xl font-black">
              {totalPending === 0
                ? "🌷 비어있어요 — 다 처리됐어요!"
                : `처리할 일 ${totalPending}건`}
            </div>
            <div className="text-[11px] text-white/85 mt-1.5 leading-relaxed">
              실시간 흐름은 <Link href="/o" className="underline">대시보드</Link>에서. 여기는 사장님 액션이 필요한 것만.
            </div>
          </div>
        </div>

        {/* 📅 예약 확정 대기 */}
        <Section
          icon={<Calendar className="w-4 h-4 text-pink-600" />}
          title="예약 확정 대기"
          count={pendingReservations.length}
          empty="대기 중인 예약 없음"
        >
          {pendingReservations.map((ev) => {
            const meta = (ev.meta ?? {}) as Record<string, string>;
            return (
              <div
                key={ev.id}
                className="bg-white border border-pink-100 rounded-2xl p-4 space-y-3"
              >
                <div>
                  <div className="text-sm font-bold text-foreground">
                    {meta.menuName ?? "예약 신청"}
                  </div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">
                    {meta.date ?? ""} {meta.time ?? ""}
                    {meta.price && ` · ${Number(meta.price).toLocaleString()}원`}
                  </div>
                  <div className="text-[10px] text-muted-foreground/70 mt-0.5">
                    {timeAgo(ev.createdAt)} 손님이 신청
                  </div>
                </div>
                <button
                  onClick={() => confirmReservation(ev)}
                  disabled={confirmingId === ev.id}
                  className="w-full bg-pink-500 text-white text-sm font-bold py-2.5 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {confirmingId === ev.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {confirmingId === ev.id
                    ? "확정 중..."
                    : "✓ 확정 + A1 알림톡 발송"}
                </button>
              </div>
            );
          })}
        </Section>

        {/* 🤝 오늘 발송 예정 알림톡 */}
        <Section
          icon={<ClockIcon className="w-4 h-4 text-violet-600" />}
          title="오늘 발송 예정 알림톡"
          count={pendingScheduled.length}
          empty="오늘 예정 알림톡 모두 처리됨"
        >
          {pendingScheduled
            .slice()
            .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
            .map((s) => (
              <div
                key={s.id}
                className={`bg-white rounded-2xl p-4 border ${
                  s.channel === "친구톡"
                    ? "border-violet-100"
                    : "border-pink-100"
                } space-y-3`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl px-2.5 py-1.5 min-w-[3.4rem] flex-shrink-0">
                    <span className="text-[10px] text-slate-500 font-bold">자동</span>
                    <span className="text-sm font-black text-slate-800 tabular-nums">
                      {s.scheduledAt}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          s.channel === "친구톡"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {s.templateId}
                      </span>
                      <span className="text-[12px] font-bold text-foreground">
                        {s.templateName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        · {s.channel}
                      </span>
                    </div>
                    <div className="text-[12px] font-semibold text-foreground/80">
                      → {s.customerName}
                    </div>
                    {s.customerNote && (
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {s.customerNote}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl px-3 py-2 text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">
                  {s.message}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => sendScheduledNow(s)}
                    disabled={sendingScheduledId === s.id}
                    className={`flex-1 text-[12px] font-bold py-2.5 rounded-xl text-white disabled:opacity-50 flex items-center justify-center gap-1.5 ${
                      s.channel === "친구톡"
                        ? "bg-violet-600 hover:bg-violet-700"
                        : "bg-pink-500 hover:bg-pink-600"
                    }`}
                  >
                    {sendingScheduledId === s.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <SendHorizonal className="w-3.5 h-3.5" />
                    )}
                    지금 보내기
                  </button>
                  <button
                    onClick={() => skipScheduled(s)}
                    className="flex-1 text-[12px] font-bold py-2.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 inline-flex items-center justify-center gap-1.5"
                  >
                    <MinusCircle className="w-3.5 h-3.5" />
                    이번엔 안 보내기
                  </button>
                </div>
                <div className="text-[10px] text-muted-foreground text-center">
                  ⏰ 그냥 두면 {s.scheduledAt}에 자동 발송됩니다
                </div>
              </div>
            ))}
        </Section>

        {/* ⚠️ 챗봇 escalate */}
        <Section
          icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
          title="챗봇 escalate — 사장님 응대"
          count={pendingEscalations.length}
          empty="응대 대기 escalate 없음"
        >
          {pendingEscalations.map((ev) => (
            <div
              key={ev.id}
              className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3"
            >
              <div>
                <div className="text-[11px] font-bold text-amber-700 uppercase mb-1">
                  위험 키워드 감지
                </div>
                <div className="text-sm text-foreground leading-snug">
                  {ev.summary}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {timeAgo(ev.createdAt)}
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://center-pf.kakao.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-[12px] font-bold text-amber-700 bg-white border border-amber-200 rounded-xl py-2.5 hover:bg-amber-50 inline-flex items-center justify-center gap-1"
                >
                  카카오 채널 열기 <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => resolveEvent(ev)}
                  disabled={resolvingId === ev.id}
                  className="flex-1 bg-amber-500 text-white text-[12px] font-bold py-2.5 rounded-xl disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {resolvingId === ev.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  응대 완료
                </button>
              </div>
            </div>
          ))}
        </Section>

        {/* 💌 답글 검토 대기 */}
        <Section
          icon={<Star className="w-4 h-4 text-emerald-600" />}
          title="후기 답글 검토 대기"
          count={pendingReviews.length}
          empty="모든 후기 답글 처리됨"
        >
          {pendingReviews.length > 0 && (
            <div className="bg-white border border-emerald-100 rounded-2xl p-4 space-y-3">
              <div>
                <div className="text-sm font-bold text-foreground">
                  Sam이 정리한 신규 후기 {pendingReviews.length}건
                </div>
                <div className="text-[12px] text-muted-foreground mt-0.5">
                  {pendingReviews.slice(0, 3).map((r) => r.nickname).join(" · ")}
                  {pendingReviews.length > 3 && ` 외 ${pendingReviews.length - 3}건`}
                </div>
              </div>
              <Link
                href="/o/reply"
                className="block w-full bg-emerald-600 text-white text-center text-sm font-bold py-2.5 rounded-xl hover:bg-emerald-700"
              >
                <span className="inline-flex items-center justify-center gap-1.5">
                  답글 페이지로 검토하러 가기{" "}
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          )}
        </Section>

        {/* 💎 위험 단골 안부 */}
        <Section
          icon={<Heart className="w-4 h-4 text-rose-600" />}
          title="위험 단골 안부 미발송"
          count={pendingChurn.length}
          empty="모든 위험 단골 안부 보내짐"
        >
          {pendingChurn.map((c) => (
            <button
              key={c.손님ID}
              onClick={() =>
                setCareCustomer({
                  닉네임: c.닉네임,
                  미방문일수: c.미방문일수,
                  손님ID: c.손님ID,
                })
              }
              className="w-full bg-white border border-rose-100 rounded-2xl p-4 flex items-center gap-3 hover:bg-rose-50/30 transition text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-rose-600">{c.score}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground">{c.닉네임}</div>
                <div className="text-[11px] text-muted-foreground">
                  {c.누적방문}회 · 미방문 {c.미방문일수}일
                  {c.회원권종류 && (
                    <span className="ml-1 text-pink-600 font-medium">
                      · {c.회원권종류}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded-full whitespace-nowrap">
                💌 안부 보내기
              </span>
            </button>
          ))}
        </Section>

        <div className="text-center text-[10px] text-muted-foreground py-3 leading-relaxed">
          이 페이지는 8초마다 자동 새로고침<br />
          처리한 항목은 자동으로 사라지고 활동 피드에 흔적이 남습니다
        </div>
      </div>

      <CareModal
        customer={careCustomer}
        onClose={() => setCareCustomer(null)}
        onSent={() => {
          setCareCustomer(null);
          fetchAll();
        }}
      />
    </>
  );
}

function Section({
  icon,
  title,
  count,
  empty,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        {count > 0 && (
          <span className="text-[10px] font-bold text-white bg-pink-500 px-1.5 py-0.5 rounded-full ml-auto">
            {count}
          </span>
        )}
      </div>
      {count === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center text-[12px] text-muted-foreground">
          ✓ {empty}
        </div>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </section>
  );
}

function CareModal({
  customer,
  onClose,
  onSent,
}: {
  customer: { 닉네임: string; 미방문일수: number; 손님ID: string } | null;
  onClose: () => void;
  onSent: () => void;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!customer) return;
    setMessage(
      `${customer.닉네임}님 오랜만이에요♡ 잘 지내시죠?\n마지막 방문하신 지 ${customer.미방문일수}일 됐네요~ 다음 시술 생각 있으시면 편하게 앱에서 잡아주세요. 결 봐드리고 싶어요!`,
    );
  }, [customer]);

  async function send() {
    if (!customer || !message.trim()) return;
    setSending(true);
    try {
      await fetch("/api/ops/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "alimtok",
          shopName: "유어라인",
          payload: {
            templateId: "D3",
            templateName: "이탈 단골 안부",
            channel: "친구톡",
            category: "loyalty",
            customerName: customer.닉네임,
            message,
            cta: { label: "AI 시뮬 미리 보기", href: "/c/sim" },
          },
        }),
      });
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "loyalty-care",
          actor: "사장",
          summary: `${customer.닉네임} 안부 메시지 → 인박스 도착 (D+${customer.미방문일수})`,
          link: "/c/inbox",
        }),
      });
      toast.success(`💎 ${customer.닉네임}님 인박스로 발송됐어요♡`);
      onSent();
    } catch {
      toast.error("발송 실패");
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence>
      {customer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center px-3 pt-3 pb-28 sm:pb-3"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl p-5 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <h3 className="text-sm font-bold text-pink-700">
                  💎 단골 안부 메시지
                </h3>
              </div>
              <button onClick={onClose} className="text-muted-foreground p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-amber-50/60 border border-amber-100 rounded-xl px-3 py-2 mb-3">
              <div className="text-[12px] font-bold text-amber-700">
                {customer.닉네임}
              </div>
              <div className="text-[10px] text-amber-700/70">
                마지막 방문 {customer.미방문일수}일 전 · D3 친구톡 자동 생성
              </div>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full text-sm leading-relaxed px-3 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 outline-none whitespace-pre-line mb-3"
            />
            <button
              onClick={send}
              disabled={sending}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {sending ? "발송 중..." : "손님 인박스로 발송"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
