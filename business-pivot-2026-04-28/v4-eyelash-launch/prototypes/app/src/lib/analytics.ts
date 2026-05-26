/**
 * 단골 분석·매출 기여 추정 함수.
 */

import type { Customer, DailyKPI } from "./data";

/** 이탈 위험 점수 (0~100) */
export function churnScore(c: Customer): number {
  let s = 0;
  const d = c.미방문일수;
  if (d > 60) s += 40;
  else if (d > 45) s += 30;
  else if (d > 35) s += 15;

  const v = c.누적방문;
  if (v >= 10) s += 30;
  else if (v >= 5) s += 20;
  else if (v >= 2) s += 10;

  const remaining =
    typeof c.회원권잔여 === "number"
      ? c.회원권잔여
      : parseInt(String(c.회원권잔여)) || 0;
  if (remaining >= 3) s += 20;

  if (c.메디핑크시술 === "Y" && d > 30) s += 10;
  return s;
}

/** 등급 매핑 */
export function assignTier(visits: number): string {
  if (visits >= 10) return "VIP (10+)";
  if (visits >= 5) return "단골 (5~9)";
  if (visits >= 2) return "Regular (2~4)";
  return "신규 (1)";
}

/** 매출 기여 추정 (베타 누적) */
export interface RevenueAttribution {
  AI시뮬: number;
  챗봇: number;
  답글: number;
  알림톡: number;
  합계: number;
}

export function computeRevenue(daily: DailyKPI[]): RevenueAttribution {
  const avgPrice = 55000;
  const simRev = daily.reduce((a, d) => a + d.시뮬예약전환, 0) * avgPrice;
  const chatRev = daily.reduce((a, d) => a + d.챗봇예약전환, 0) * avgPrice;
  const replyRev = daily.reduce((a, d) => a + d.답글자동, 0) * 30000;
  const noshowRec = Math.floor(daily.reduce((a, d) => a + d.알림톡정보성, 0) / 4);
  const alimRev = noshowRec * 20000;
  return {
    AI시뮬: simRev,
    챗봇: chatRev,
    답글: replyRev,
    알림톡: alimRev,
    합계: simRev + chatRev + replyRev + alimRev,
  };
}

/** Tier별 LTV */
export function ltvByTier(customers: Customer[]) {
  const tiers = ["VIP (10+)", "단골 (5~9)", "Regular (2~4)", "신규 (1)"];
  return tiers.map((tier) => {
    const filtered = customers.filter((c) => assignTier(c.누적방문) === tier);
    const sum = filtered.reduce((a, c) => a + c.누적매출, 0);
    return {
      tier,
      count: filtered.length,
      sum,
      avg: filtered.length ? Math.floor(sum / filtered.length) : 0,
    };
  });
}

/** 이탈 위험 TOP N */
export function topChurnRisk(customers: Customer[], n = 5) {
  return customers
    .map((c) => ({ ...c, score: churnScore(c) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

/** 베타 N일 계산 */
export function betaDays(start: Date, today: Date = new Date()): number {
  return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

/** 한국어 통화 포맷 */
export function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(n);
}

export function formatManwon(n: number): string {
  return `${Math.floor(n / 10000)}만원`;
}
