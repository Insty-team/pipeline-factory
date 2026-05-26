"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";
import { daily, BETA_START } from "@/lib/data";
import { betaDays } from "@/lib/analytics";
import { toast } from "sonner";

const today = daily[daily.length - 1];
const beta = betaDays(BETA_START, new Date(today.날짜));

const message = `[유어라인] 어제 요약 — ${today.날짜.slice(5).replace("-", "/")} (D+${beta})

📅 예약 ${today.예약} · 노쇼 ${today.노쇼}${today.노쇼 === 0 ? " ⭐ (베타 " + beta + "일째 노쇼 0)" : ""}
✨ AI 시뮬 ${today.시뮬요청}건 (${today.시뮬예약전환}건 예약 전환)
💌 신규 ${today.신규손님}명 · 재방문 ${today.재방문손님}

📊 자세히 → dashboard-uareline.streamlit.app`;

export default function DailyPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    toast.success("일간 1줄 복사됨!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <TopAppBar title="📅 일간 1줄" />
      <div className="px-5 py-5 space-y-5">
        <div className="bg-gradient-to-br from-pink-50 to-cream-100 rounded-2xl p-4">
          <div className="text-sm font-semibold text-pink-700 mb-1">
            매일 8시 자동 생성
          </div>
          <p className="text-xs text-muted-foreground">
            사장님 카톡으로 forward 또는 자동 발송 (사장님 동의 후)
          </p>
        </div>

        {/* 메시지 미리보기 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="text-[10px] font-bold text-pink-600 uppercase mb-3">
            ▼ 발송할 1줄 (사장님 카톡 forward 용)
          </div>
          <pre className="text-sm font-sans whitespace-pre-wrap leading-relaxed text-foreground mb-4 bg-pink-50/50 p-4 rounded-xl">
            {message}
          </pre>
          <Button onClick={handleCopy} className="w-full">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "복사됨!" : "메시지 복사"}
          </Button>
        </div>

        {/* 주차별 인사이트 안내 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-bold mb-3">주차별 인사이트 포커스</h3>
          <div className="space-y-2 text-xs">
            <div className="flex gap-2">
              <span className="font-bold text-pink-600 w-12 flex-shrink-0">
                1주차
              </span>
              <span className="text-muted-foreground">노쇼·신규 ("베타 X일째 노쇼 0 ⭐")</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-pink-600 w-12 flex-shrink-0">
                2주차
              </span>
              <span className="text-muted-foreground">이탈 위험 단골 ("이탈 위험 21명, 어제 -3")</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-pink-600 w-12 flex-shrink-0">
                3주차
              </span>
              <span className="text-muted-foreground">매출 기여 추정 ("누적 +180만")</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-pink-600 w-12 flex-shrink-0">
                4주차
              </span>
              <span className="text-muted-foreground">commission 협상 ("4 모듈 합산 +220만")</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
