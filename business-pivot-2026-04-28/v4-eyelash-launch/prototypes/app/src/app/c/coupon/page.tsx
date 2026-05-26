"use client";

import { motion } from "framer-motion";
import { Gift, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TopAppBar } from "@/components/common/TopAppBar";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";

export default function CouponPage() {
  const [copied, setCopied] = useState(false);
  const code = "URE-DEMO-5000";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("쿠폰 코드 복사됨!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <TopAppBar title="🎁 쿠폰" showBack />

      <div className="px-5 py-6">
        {/* 쿠폰 카드 — 티켓 모양 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative mx-auto max-w-sm"
        >
          {/* 메인 티켓 */}
          <div className="relative bg-gradient-to-br from-pink-500 via-pink-400 to-pink-300 rounded-3xl p-6 shadow-2xl overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/20" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />

            {/* 펀치 hole 효과 (좌우) */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-pink-50" />
            <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-pink-50" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-white/30 backdrop-blur flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white/80 text-[10px] font-medium uppercase tracking-wider">
                    First Visit Only
                  </div>
                  <div className="text-white text-sm font-bold">
                    첫 방문 쿠폰
                  </div>
                </div>
              </div>

              <div className="text-white text-5xl font-bold mb-1 tracking-tight">
                5,000
                <span className="text-2xl ml-1">원</span>
              </div>
              <div className="text-white/90 text-sm font-medium mb-6">
                할인
              </div>

              {/* dashed separator */}
              <div className="border-t-2 border-dashed border-white/40 my-4" />

              <div className="text-white/80 text-xs mb-1">
                쿠폰 코드
              </div>
              <div
                onClick={handleCopy}
                className="flex items-center justify-between gap-3 bg-white/20 backdrop-blur rounded-xl p-3 cursor-pointer hover:bg-white/30 transition-colors"
              >
                <span className="font-mono font-bold text-white text-lg tracking-wider">
                  {code}
                </span>
                {copied ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Copy className="w-5 h-5 text-white/80" />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 사용 방법 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-2xl p-5 border border-pink-100"
        >
          <h2 className="text-base font-bold mb-3">사용 방법</h2>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-pink-600">1.</span>
              방문 시 사장님께 쿠폰 코드 보여주기
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-pink-600">2.</span>
              첫 시술 가격에서 5,000원 자동 차감
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-pink-600">3.</span>
              시술 후 후기 작성 시 영양제 미니 사이즈 증정 (선택)
            </li>
          </ol>

          <div className="mt-4 pt-4 border-t border-pink-100 text-xs text-muted-foreground space-y-1">
            <div>• 유효 기간: 발급 후 30일</div>
            <div>• 사용처: 모든 시술 (메뉴 1건)</div>
            <div>• ⚠️ 신규 손님만 / 중복 사용 X</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4"
        >
          <Link
            href="/c/reserve"
            className={buttonVariants({ size: "lg", className: "w-full h-12 rounded-2xl" })}
          >
            바로 예약하기 →
          </Link>
        </motion.div>
      </div>
    </>
  );
}
