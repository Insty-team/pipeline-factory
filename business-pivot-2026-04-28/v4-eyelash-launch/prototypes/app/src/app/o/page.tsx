"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, AlertTriangle, Sparkles, Wallet, Calendar, FileText, ArrowRight } from "lucide-react";
import { customers, daily, BETA_START } from "@/lib/data";
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

const simTotal = daily.reduce((a, d) => a + d.시뮬요청, 0);
const simConv = daily.reduce((a, d) => a + d.시뮬예약전환, 0);
const simConvRate = Math.round((simConv / simTotal) * 100);

const tiers = ltvByTier(customers);
const totalLtv = customers.reduce((a, c) => a + c.누적매출, 0);
const churn = topChurnRisk(customers, 5);
const revenue = computeRevenue(daily);

export default function OwnerDashboardPage() {
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

        {/* 일간 1줄 카드 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-pink-400 p-5 shadow-lg text-white">
            <div className="text-xs text-white/80 font-medium mb-1">
              📅 일간 1줄 — 어제 요약
            </div>
            <div className="text-base font-semibold leading-relaxed">
              예약 {today.예약} · 노쇼 {today.노쇼}{today.노쇼 === 0 && " ⭐"} · 신규 {today.신규손님}
              <br />
              ✨ 시뮬 {today.시뮬요청}건 → 예약 전환 {today.시뮬예약전환}
            </div>
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
              <div
                key={c.손님ID}
                className={`flex items-center gap-3 px-4 py-3 ${
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
                  </div>
                </div>
                <div className="text-right">
                  {c.회원권종류 && (
                    <div className="text-xs font-medium text-pink-600">
                      {c.회원권종류}
                    </div>
                  )}
                  {typeof c.회원권잔여 === "number" && (
                    <div className="text-[10px] text-muted-foreground">
                      잔여 {c.회원권잔여}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-muted-foreground text-center mt-2">
            D+45+ 미방문 · 회원권 잔여 — 즉시 안부 알림 권장
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
    </div>
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
