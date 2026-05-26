"use client";

import { motion } from "framer-motion";
import { Calendar, Sparkles, MessageSquare, AlertTriangle } from "lucide-react";
import { TopAppBar } from "@/components/common/TopAppBar";

const items = [
  {
    icon: <Calendar className="w-5 h-5" />,
    type: "예약",
    title: "신규 예약 — C컬 펌",
    desc: "내일 13시 · 윤지미니",
    time: "방금",
    accent: "pink",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    type: "AI 시뮬",
    title: "셀카 → J·C·D컬 시뮬 회신",
    desc: "손님이 시뮬 받음 · 예약 chip 노출",
    time: "10분 전",
    accent: "pink",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    type: "답글 시안",
    title: "신규 후기 답글 시안",
    desc: "효효29님 · 자동 생성 답글 확인 → 1탭 게시",
    time: "30분 전",
    accent: "lavender",
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    type: "Escalate",
    title: "챗봇 escalate — '임산부 가능?'",
    desc: "사장님 직접 응대 요청",
    time: "1시간 전",
    accent: "warn",
  },
];

export default function InboxPage() {
  return (
    <>
      <TopAppBar title="📥 받은 요청" />
      <div className="px-5 py-5 space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-3"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                item.accent === "pink"
                  ? "bg-pink-50 text-pink-600"
                  : item.accent === "lavender"
                  ? "bg-lavender-100 text-lavender-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {item.type}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  · {item.time}
                </span>
              </div>
              <div className="font-semibold text-sm mb-0.5">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
          </motion.div>
        ))}

        <div className="text-center text-[11px] text-muted-foreground pt-4">
          🚧 Stage 2.7에서 실제 예약·시뮬·답글·escalate 통합
        </div>
      </div>
    </>
  );
}
