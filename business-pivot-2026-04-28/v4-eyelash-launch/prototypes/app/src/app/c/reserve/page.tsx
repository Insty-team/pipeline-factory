"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";

const menus = [
  { id: "g-half", name: "글루연장 하프 (50%)", price: 44000, time: "1.5h" },
  { id: "g-max", name: "글루연장 맥스 (90%)", price: 66000, time: "2.5h" },
  { id: "led", name: "LED연장 변경 추가", price: 11000, time: "+0", suffix: "+" },
  { id: "perm-point", name: "펌포인트 연장", price: 66000, time: "2.5h" },
  { id: "perm", name: "유어라인 영양펌", price: 33000, time: "1.5h" },
  { id: "perm-black", name: "영양 블랙 틴팅펌", price: 44000, time: "1.5h" },
];

const timeSlots = ["11:00", "13:00", "15:00", "17:00"];
const dates = ["오늘", "내일", "+2일", "+3일", "+4일"];

export default function ReservePage() {
  const [selMenu, setSelMenu] = useState("g-max");
  const [selDate, setSelDate] = useState(1);
  const [selTime, setSelTime] = useState("13:00");

  return (
    <>
      <TopAppBar title="📅 예약하기" showBack />

      <div className="px-5 py-5 space-y-6">
        {/* 시술 선택 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-sm font-bold text-foreground mb-3">
            시술 메뉴
          </h2>
          <div className="space-y-2">
            {menus.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelMenu(m.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                  selMenu === m.id
                    ? "border-pink-400 bg-pink-50 shadow-md"
                    : "border-transparent bg-white hover:border-pink-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{m.name}</div>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {m.time}
                    </div>
                  </div>
                  <div className="text-pink-600 font-bold">
                    {m.suffix ?? ""}
                    {m.price.toLocaleString()}원
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* 날짜 선택 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> 날짜
          </h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {dates.map((d, i) => (
              <button
                key={d}
                onClick={() => setSelDate(i)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  selDate === i
                    ? "bg-pink-500 text-white shadow-md"
                    : "bg-white border border-pink-200 text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </motion.section>

        {/* 시간 선택 — 4타임 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> 시술 시간대 (4타임)
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((t) => (
              <button
                key={t}
                onClick={() => setSelTime(t)}
                className={`py-4 rounded-2xl text-sm font-bold transition-all ${
                  selTime === t
                    ? "bg-pink-500 text-white shadow-md scale-105"
                    : "bg-white border border-pink-200 text-foreground hover:bg-pink-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sticky bottom-24 pt-4"
        >
          <Button
            size="lg"
            className="w-full h-14 rounded-2xl text-base font-bold shadow-xl"
          >
            예약 신청
          </Button>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            🚧 Stage 2.7에서 예약 → 사장 받은 요청으로 전달
          </p>
        </motion.div>
      </div>
    </>
  );
}
