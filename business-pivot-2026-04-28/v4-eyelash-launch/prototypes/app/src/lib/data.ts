/**
 * 데이터 로더 — prototype 가상 데이터.
 * 운영 시 fetch('/api/customers') 등으로 교체.
 */

import customersJson from "./data/customers.json";
import dailyJson from "./data/daily.json";

export interface Customer {
  손님ID: string;
  닉네임: string;
  첫방문일: string;
  누적방문: number;
  마지막방문일: string;
  미방문일수: number;
  다음예상방문: string;
  주요시술: string;
  누적매출: number;
  회원권종류: string;
  회원권잔여: number | string;
  메디핑크시술: string;
  어디서보고: string;
  이탈위험: string;
}

export interface DailyKPI {
  날짜: string;
  예약: number;
  노쇼: number;
  신규손님: number;
  재방문손님: number;
  신규후기: number;
  답글자동: number;
  챗봇응대: number;
  챗봇예약전환: number;
  시뮬요청: number;
  시뮬예약전환: number;
  시뮬컨설팅도구: number;
  알림톡정보성: number;
  친구톡광고성: number;
  인스타게시: number;
  블로그게시: number;
}

export const customers = customersJson as Customer[];
export const daily = dailyJson as DailyKPI[];

export const BETA_START = new Date("2026-05-17");
