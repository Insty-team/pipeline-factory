"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Wallet,
  Calendar,
  FileText,
  ArrowRight,
  Palette,
  Activity,
  Bell,
  Loader2,
  Send,
  X,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { customers, daily, BETA_START } from "@/lib/data";
import type { ActivityEvent } from "@/lib/events-store";
import {
  topChurnRisk,
  ltvByTier,
  computeRevenue,
  betaDays,
  formatKRW,
  formatManwon,
} from "@/lib/analytics";

const today = daily[daily.length - 1];
const beta = betaDays(BETA_START, new Date(today.날짜));

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

const simTotal = daily.reduce((a, d) => a + d.시뮬요청, 0);
const simConv = daily.reduce((a, d) => a + d.시뮬예약전환, 0);
const simConvRate = Math.round((simConv / simTotal) * 100);

const tiers = ltvByTier(customers);
const totalLtv = customers.reduce((a, c) => a + c.누적매출, 0);
const churn = topChurnRisk(customers, 5);
const revenue = computeRevenue(daily);

export default function OwnerDashboardPage() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [careCustomer, setCareCustomer] = useState<
    null | { 닉네임: string; 미방문일수: number; 손님ID: string }
  >(null);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchEvents();
    const t = setInterval(fetchEvents, 8000);
    return () => clearInterval(t);
  }, [fetchEvents]);

  return (
    <div className="pt-safe">
      {/* 헤더 */}
      <header className="px-5 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-pink-500 font-semibold uppercase tracking-wider mb-0.5">
                💼 Owner Dashboard
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                대시보드
              </h1>
            </div>
            <div className="text-right">
              <div className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">
                D+{beta} 베타 진행
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {today.날짜}
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <div className="px-5 space-y-5">
        {/* 진단 리포트 배너 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
        >
          <Link href="/o/report">
            <div className="group flex items-center gap-3 rounded-2xl bg-white border border-pink-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-pink-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-pink-500 font-semibold uppercase tracking-wider">
                  Diagnosis Report
                </div>
                <div className="text-sm font-bold text-foreground">
                  💕 사장님 4주 베타 진단 리포트
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  강점 8 · 약점 8 · 9 모듈 · KPI · Commission
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-pink-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </div>
          </Link>
        </motion.section>

        {/* 카드뉴스 샘플 배너 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.03 }}
        >
          <Link href="/o/cards">
            <div className="group flex items-center gap-3 rounded-2xl bg-white border border-fuchsia-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-100 to-rose-100 flex items-center justify-center flex-shrink-0">
                <Palette className="w-5 h-5 text-fuchsia-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-fuchsia-500 font-semibold uppercase tracking-wider">
                  Cards Demo
                </div>
                <div className="text-sm font-bold text-foreground">
                  🎨 인스타 카드뉴스 16장 샘플
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  가격표 4 · 컬 비교 6 · 메디핑크 5 + 가로 메뉴판 1
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-fuchsia-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </div>
          </Link>
        </motion.section>

        {/* 일간 1줄 — 아침 자동 도착 카톡 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 p-5 shadow-lg text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/85 mb-1.5">
                <Bell className="w-3 h-3" />
                <span>오늘 아침 8시 · 카톡 자동 도착</span>
              </div>
              <div className="text-[11px] text-white/70 font-medium mb-2">
                📅 일간 1줄 — 어제 요약
              </div>
              <div className="text-base font-bold leading-relaxed">
                예약 {today.예약} · 노쇼 {today.노쇼}{today.노쇼 === 0 && " ⭐"} · 신규 {today.신규손님}
                <br />
                ✨ 시뮬 {today.시뮬요청}건 → 예약 전환 {today.시뮬예약전환}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ⚡ 실시간 활동 피드 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <Activity className="w-4 h-4 text-pink-600" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <h2 className="text-sm font-bold text-foreground">
              실시간 활동 (오늘)
            </h2>
            <span className="ml-auto text-[10px] text-muted-foreground">
              8초마다 새로고침
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {events.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  아직 오늘 활동이 없어요♡<br />
                  손님이 시뮬·챗봇·인박스 쓰거나<br />사장님이 알림 발송하면 여기에 흐릅니다
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {events.slice(0, 12).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-pink-50/30"
                  >
                    <div className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 text-sm">
                      {e.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-foreground leading-tight">
                        {e.summary}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {e.actor} · {timeAgo(e.createdAt)}
                      </div>
                    </div>
                    {e.link && (
                      <Link
                        href={e.link}
                        className="text-[10px] font-bold text-pink-600 hover:underline flex-shrink-0"
                      >
                        보기 →
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.section>

        {/* 오늘 한눈에 — 4 metric */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-bold text-foreground mb-3">
            📊 오늘 한눈에
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              icon={<Calendar className="w-4 h-4" />}
              label="예약"
              value={today.예약}
              accent="pink"
            />
            <MetricCard
              icon={<AlertTriangle className="w-4 h-4" />}
              label="노쇼"
              value={today.노쇼}
              accent={today.노쇼 === 0 ? "success" : "warn"}
              suffix={today.노쇼 === 0 ? "좋아요" : undefined}
            />
            <MetricCard
              icon={<Sparkles className="w-4 h-4" />}
              label="AI 시뮬"
              value={today.시뮬요청}
              suffix={`→ 예약 ${today.시뮬예약전환}`}
              accent="pink"
            />
            <MetricCard
              icon={<TrendingUp className="w-4 h-4" />}
              label="챗봇"
              value={today.챗봇응대}
              suffix={`→ 예약 ${today.챗봇예약전환}`}
              accent="lavender"
            />
          </div>
        </motion.section>

        {/* AI 시뮬 누적 — Bento large card */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="rounded-2xl bg-gradient-sim p-5 shadow-md border border-white/40">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/60 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <div className="text-xs text-pink-600 font-semibold uppercase tracking-wider">
                  AI Simulation
                </div>
                <div className="text-sm font-bold text-foreground">
                  베타 {beta}일 누적
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <BentoStat label="요청" value={simTotal} />
              <BentoStat label="예약 전환" value={simConv} accent />
              <BentoStat label="전환율" value={`${simConvRate}%`} accent />
            </div>
          </div>
        </motion.section>

        {/* 이탈 위험 TOP 5 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-foreground">
              이탈 위험 단골 TOP 5
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {churn.map((c, i) => (
              <button
                key={c.손님ID}
                onClick={() =>
                  setCareCustomer({
                    닉네임: c.닉네임,
                    미방문일수: c.미방문일수,
                    손님ID: c.손님ID,
                  })
                }
                className={`w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-amber-50/40 transition ${
                  i < churn.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-amber-600">
                    {c.score}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {c.닉네임}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.누적방문}회 · 미방문 {c.미방문일수}일
                    {c.회원권종류 && (
                      <span className="ml-1 text-pink-600 font-medium">
                        · {c.회원권종류}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full whitespace-nowrap">
                  💌 안부 보내기
                </span>
              </button>
            ))}
          </div>
          <div className="text-[11px] text-muted-foreground text-center mt-2">
            카드 탭하면 사장님 톤 안부 메시지 미리보기 + 인박스 발송
          </div>
        </motion.section>

        {/* 단골 자산 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-pink-600" />
            <h2 className="text-sm font-bold text-foreground">
              단골 자산
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="space-y-2 mb-4">
              {tiers.map((t) => (
                <div
                  key={t.tier}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="font-medium">{t.tier}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {t.count}명
                    </span>
                    <span className="font-bold text-foreground tabular-nums w-24 text-right">
                      {formatKRW(t.sum)}원
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                💰 7년 누적 자산
              </span>
              <span className="font-bold text-lg text-pink-600 tabular-nums">
                {formatKRW(totalLtv)}원
              </span>
            </div>
          </div>
        </motion.section>

        {/* 매출 기여 추정 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-bold text-foreground mb-3">
            📈 베타 {beta}일 매출 기여 (추정)
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-2">
            <RevenueRow label="✨ AI 시뮬" amount={revenue.AI시뮬} />
            <RevenueRow label="💬 챗봇" amount={revenue.챗봇} />
            <RevenueRow label="💌 답글" amount={revenue.답글} />
            <RevenueRow label="📢 알림톡" amount={revenue.알림톡} />
            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold">💎 합계 (추정)</span>
              <span className="font-bold text-pink-600 text-base tabular-nums">
                +{formatManwon(revenue.합계)}
              </span>
            </div>
          </div>
        </motion.section>

        <p className="text-[10px] text-muted-foreground text-center pt-2">
          매일 새벽 자동 새로고침 · 가상 데이터 (영업 데모)
        </p>
      </div>

      <LoyaltyCareModal
        customer={careCustomer}
        onClose={() => setCareCustomer(null)}
        onSent={() => {
          setCareCustomer(null);
          fetchEvents();
        }}
      />
    </div>
  );
}

function LoyaltyCareModal({
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
      const res = await fetch("/api/ops/queue", {
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
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "발송 실패");

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
    } catch (err) {
      const msg = err instanceof Error ? err.message : "발송 실패";
      toast.error(msg);
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
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
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
                마지막 방문 {customer.미방문일수}일 전 · D3 친구톡 템플릿 자동 생성
              </div>
            </div>

            <label className="block text-[10px] font-bold text-muted-foreground mb-1">
              메시지 (사장님 톤 — 그대로 손님 인박스에)
            </label>
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
            <div className="text-[10px] text-muted-foreground text-center mt-2">
              📥 손님 앱 인박스에 즉시 도착 · AI 시뮬 미리보기 CTA 포함
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MetricCard({
  icon,
  label,
  value,
  suffix,
  accent = "pink",
}: {
  icon?: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
  accent?: "pink" | "lavender" | "success" | "warn";
}) {
  const accentClasses = {
    pink: "bg-pink-50 text-pink-600",
    lavender: "bg-lavender-100 text-lavender-700",
    success: "bg-green-50 text-green-700",
    warn: "bg-amber-50 text-amber-700",
  }[accent];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium mb-2 ${accentClasses}`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold text-foreground tabular-nums">
        {value}
      </div>
      {suffix && (
        <div className="text-[10px] text-muted-foreground mt-1">{suffix}</div>
      )}
    </div>
  );
}

function BentoStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="bg-white/60 backdrop-blur rounded-xl p-3 text-center">
      <div className="text-[10px] text-pink-900/70 font-medium uppercase tracking-wider mb-1">
        {label}
      </div>
      <div
        className={`text-xl font-bold tabular-nums ${
          accent ? "text-pink-600" : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function RevenueRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <span className="font-semibold text-foreground tabular-nums">
        +{formatManwon(amount)}
      </span>
    </div>
  );
}
