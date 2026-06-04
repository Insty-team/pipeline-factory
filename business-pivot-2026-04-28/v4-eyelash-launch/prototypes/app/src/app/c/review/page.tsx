"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";

export default function ReviewPage() {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (text.trim().length < 5) {
      toast.error("후기를 한 줄 이상 남겨주세요♡");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "review-new",
          actor: "손님",
          summary: `신규 후기 ${rating}★ — "${text.slice(0, 30)}${text.length > 30 ? "…" : ""}"`,
          link: "/o/reply",
          meta: { rating, text },
        }),
      });
      if (!res.ok) throw new Error("후기 등록 실패");
      toast.success("✨ 후기 남겨주셨네요♡ 감사합니다!");
      setDone(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "등록 실패";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <TopAppBar title="✍️ 후기 남기기" showBack />
      <div className="px-5 py-6">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 text-center"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <div className="text-lg font-black text-emerald-700 mb-1">
                후기 남겨주셨네요♡
              </div>
              <div className="text-[12px] text-emerald-700/80 leading-relaxed">
                사장님이 직접 답글로 인사드릴게요~<br />
                다음 방문 때 영양제 챙겨드릴게요!
              </div>
              <Link
                href="/c"
                className="mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-emerald-700 hover:underline"
              >
                메인으로 돌아가기 →
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="bg-gradient-to-br from-pink-50 to-rose-50/60 border border-pink-100 rounded-2xl p-4">
                <div className="text-sm font-bold text-pink-700 mb-1">
                  💕 시술 어떠셨나요?
                </div>
                <p className="text-[12px] text-pink-700/70 leading-relaxed">
                  솔직한 한 줄이면 사장님께 큰 힘이 돼요~ 다음 방문 때 영양제 챙겨드릴게요♡
                </p>
              </div>

              <section>
                <h2 className="text-sm font-bold text-foreground mb-3">별점</h2>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className="p-1.5"
                    >
                      <Star
                        className={`w-9 h-9 transition-all ${
                          n <= rating
                            ? "fill-amber-400 text-amber-400 scale-110"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-sm font-bold text-foreground mb-2">
                  후기 한 줄
                </h2>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  placeholder="예) 무쌍펌 진짜 잘 어울려요 ㅎㅎ 사장님 솜씨 짱!!!"
                  className="w-full text-sm leading-relaxed px-4 py-3 rounded-2xl border border-pink-200 focus:border-pink-400 outline-none resize-none bg-white"
                />
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  💌 후기는 곧 네이버 플레이스에도 같이 올라가요
                </p>
              </section>

              <Button
                size="lg"
                onClick={submit}
                disabled={submitting}
                className="w-full h-14 rounded-2xl text-base font-bold shadow-xl"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    등록 중...
                  </>
                ) : (
                  "후기 남기기"
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
