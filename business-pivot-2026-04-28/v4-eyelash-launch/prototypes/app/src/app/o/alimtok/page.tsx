"use client";

import { motion } from "framer-motion";
import { Bell, Send } from "lucide-react";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";

const templates = [
  { id: "A1", name: "예약 확정", channel: "알림톡", trigger: "즉시", color: "pink" },
  { id: "A2", name: "방문 1일 전", channel: "알림톡", trigger: "18:00", color: "pink" },
  { id: "A3", name: "방문 당일", channel: "알림톡", trigger: "09:00", color: "pink" },
  { id: "A4", name: "D+1 후기 요청", channel: "알림톡", trigger: "11:00", color: "pink" },
  { id: "A5", name: "D+28 재방문", channel: "친구톡", trigger: "11:00", color: "lavender" },
  { id: "B", name: "단골 환영", channel: "알림톡", trigger: "즉시", color: "pink" },
  { id: "C1", name: "노쇼 follow-up", channel: "알림톡", trigger: "19:00", color: "pink" },
  { id: "C2", name: "변경 응답", channel: "알림톡", trigger: "즉시", color: "pink" },
  { id: "C3", name: "휴무 안내", channel: "알림톡", trigger: "사전", color: "pink" },
  { id: "D1", name: "메디핑크 추천", channel: "친구톡", trigger: "수 14:00", color: "lavender" },
  { id: "D2", name: "영양제 D+42", channel: "친구톡", trigger: "11:00", color: "lavender" },
  { id: "D3", name: "이탈 단골 안부", channel: "친구톡", trigger: "월 09:00", color: "lavender" },
];

export default function AlimtokPage() {
  return (
    <>
      <TopAppBar title="📢 알림톡 매트릭스" />
      <div className="px-5 py-5">
        <p className="text-sm text-muted-foreground mb-4">
          12종 자동 발송 — 알리고 무료 1000건/월
        </p>

        <div className="grid grid-cols-2 gap-2 mb-5">
          {templates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    t.color === "pink"
                      ? "bg-pink-100 text-pink-700"
                      : "bg-lavender-100 text-lavender-700"
                  }`}
                >
                  {t.id}
                </span>
                <span className="text-[9px] text-muted-foreground">
                  {t.channel}
                </span>
              </div>
              <div className="text-xs font-semibold text-foreground mb-0.5">
                {t.name}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {t.trigger}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 테스트 발송 */}
        <div className="bg-gradient-to-br from-pink-50 to-lavender-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-bold text-pink-700">테스트 발송</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            사장님 본인 폰으로 친구톡 1건 발송 (데모용)
          </p>
          <Button className="w-full h-11 rounded-xl">
            <Send className="w-4 h-4 mr-2" />
            내 폰으로 친구톡 보내기
          </Button>
        </div>

        <div className="text-center text-[11px] text-muted-foreground pt-4">
          🚧 Stage 2.8에서 알리고 API 연결
        </div>
      </div>
    </>
  );
}
