"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, BarChart3, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-customer flex flex-col items-center justify-center px-6 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12 max-w-md"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass">
          <span className="text-pink-600 text-sm font-medium">
            💕 이수·사당 7년차 1:1 단독시술
          </span>
        </div>

        <h1 className="text-5xl font-bold text-pink-700 mb-3 tracking-tight">
          유어라인
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          모든 손님께 정성 하나, 시술 하나.
          <br />
          1인 단독시술 속눈썹 전문샵.
        </p>
      </motion.div>

      {/* 역할 선택 카드 2개 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-md grid grid-cols-1 gap-4"
      >
        {/* 손님 카드 */}
        <Link href="/c">
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-3xl bg-white border border-pink-100 p-6 shadow-md hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-sim opacity-60 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <div className="text-xs text-pink-500 font-medium uppercase tracking-wider">
                    For Customer
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    손님이에요
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                AI 시뮬레이션 · 챗봇 · 예약 · 메뉴
                <br />
                <span className="text-pink-600 font-medium">
                  🎁 첫 시술 5,000원 할인 쿠폰
                </span>
              </p>
              <div className="flex items-center gap-1 text-pink-600 text-sm font-medium group-hover:gap-2 transition-all">
                들어가기 <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* 사장 카드 */}
        <Link href="/o">
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-3xl bg-white border border-lavender-100 p-6 shadow-md hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-medipink opacity-60 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-lavender-100 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-lavender-700" />
                </div>
                <div>
                  <div className="text-xs text-lavender-500 font-medium uppercase tracking-wider">
                    For Owner
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    사장님이에요
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                대시보드 · 받은 요청 · 콘텐츠 · 답글
                <br />
                <span className="text-lavender-700 font-medium">
                  📊 단골 자산 1,517만 · 매출 기여 · 일간 1줄
                </span>
              </p>
              <div className="flex items-center gap-1 text-lavender-700 text-sm font-medium group-hover:gap-2 transition-all">
                들어가기 <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-muted-foreground mt-8 text-center"
      >
        데모용 통합 앱 · 손님·사장 둘 다 같은 앱에서 체험
      </motion.p>
    </main>
  );
}
