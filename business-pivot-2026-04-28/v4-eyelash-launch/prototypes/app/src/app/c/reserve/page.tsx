"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
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
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const menu = menus.find((m) => m.id === selMenu)!;
  const dateLabel = dates[selDate];

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reservation",
          actor: "손님",
          summary: `예약 신청 — ${menu.name} · ${dateLabel} ${selTime}`,
          link: "/o/inbox",
          meta: {
            menuId: menu.id,
            menuName: menu.name,
            price: menu.price,
            date: dateLabel,
            time: selTime,
          },
        }),
      });
      if (!res.ok) throw new Error("예약 신청 실패");
      toast.success("✅ 예약 신청 보냈어요. 곧 사장님이 확정해드릴게요♡");
      setDone(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "예약 실패";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

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

        {/* 요약 + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sticky bottom-24 pt-4"
        >
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-5 text-center shadow-lg"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-base font-bold text-emerald-700 mb-1">
                  예약 신청 보냈어요♡
                </div>
                <div className="text-[12px] text-emerald-700/80 leading-relaxed">
                  {menu.name}
                  <br />
                  {dateLabel} · {selTime}
                </div>
                <div className="text-[11px] text-emerald-700/60 mt-2">
                  사장님이 곧 확정하시면 인박스로 알림이 와요
                </div>
                <Link
                  href="/c/inbox"
                  className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-emerald-700 hover:underline"
                >
                  📥 인박스로 가기
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-white rounded-2xl border border-pink-100 p-3 mb-3 text-[12px] text-foreground/70 flex items-center justify-between">
                  <span>
                    {menu.name} · {dateLabel} {selTime}
                  </span>
                  <span className="font-bold text-pink-600">
                    {menu.price.toLocaleString()}원
                  </span>
                </div>
                <Button
                  size="lg"
                  onClick={submit}
                  disabled={submitting}
                  className="w-full h-14 rounded-2xl text-base font-bold shadow-xl"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      신청 중...
                    </>
                  ) : (
                    "예약 신청"
                  )}
                </Button>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  📥 사장님 대시보드 실시간 활동에 즉시 표시됩니다
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
