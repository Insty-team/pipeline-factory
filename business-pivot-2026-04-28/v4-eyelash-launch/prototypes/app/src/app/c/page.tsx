"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  MessageCircle,
  CalendarDays,
  Gift,
  ImageIcon,
  ArrowRight,
  Inbox,
} from "lucide-react";

const menuItems = [
  {
    href: "/c/sim",
    label: "AI 시뮬",
    desc: "셀카로 J·C·D컬 5초 미리보기",
    icon: Sparkles,
    gradient: "from-pink-200 to-lavender-200",
    accent: "text-pink-600",
    bg: "bg-pink-50",
    badge: "⭐ 무료",
  },
  {
    href: "/c/chat",
    label: "챗봇",
    desc: "가격·디자인 즉시 답변",
    icon: MessageCircle,
    gradient: "from-pink-100 to-pink-200",
    accent: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    href: "/c/inbox",
    label: "받은 알림",
    desc: "유어라인 알림 — 예약·재방문·혜택",
    icon: Inbox,
    gradient: "from-rose-200 to-pink-200",
    accent: "text-rose-600",
    bg: "bg-rose-50",
    badge: "📥",
  },
  {
    href: "/c/reserve",
    label: "예약하기",
    desc: "4타임 1:1 단독시술",
    icon: CalendarDays,
    gradient: "from-cream-200 to-cream-300",
    accent: "text-cream-700",
    bg: "bg-cream-100",
  },
  {
    href: "/c/menu",
    label: "메뉴·디자인",
    desc: "가격표·컬 비교·메디핑크 16장",
    icon: ImageIcon,
    gradient: "from-lavender-200 to-pink-200",
    accent: "text-lavender-700",
    bg: "bg-lavender-100",
  },
];

export default function CustomerHomePage() {
  return (
    <div className="pt-safe">
      {/* Hero */}
      <div className="px-5 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs text-pink-500 font-semibold uppercase tracking-wider mb-1">
            Welcome to
          </div>
          <h1 className="text-4xl font-bold text-pink-700 mb-1 tracking-tight">
            유어라인
          </h1>
          <p className="text-sm text-muted-foreground">
            이수·사당 7년차 1:1 단독시술 ♡
          </p>
        </motion.div>
      </div>

      {/* 쿠폰 배너 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="px-5 mb-5"
      >
        <Link href="/c/coupon">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-pink-400 p-5 shadow-lg cursor-pointer"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20" />
            <div className="absolute right-8 bottom-2 w-16 h-16 rounded-full bg-white/10" />
            <div className="relative flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white/90 text-xs font-medium mb-0.5">
                  첫 방문 손님 한정
                </div>
                <div className="text-white text-lg font-bold leading-tight">
                  첫 시술 5,000원 할인 쿠폰
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* 메뉴 그리드 — 2x2 */}
      <div className="px-5">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          메뉴
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative overflow-hidden rounded-2xl ${item.bg} p-4 h-36 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                  >
                    {item.badge && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-pink-600">
                        {item.badge}
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-sm`}>
                      <Icon className={`w-5 h-5 ${item.accent}`} />
                    </div>
                    <div>
                      <div className="text-base font-bold text-foreground mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground leading-tight">
                        {item.desc}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 정보 카드 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="px-5 mt-6"
      >
        <div className="glass rounded-2xl p-4 border border-pink-100">
          <div className="text-xs font-semibold text-pink-600 mb-2">
            영업 안내
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">평일</div>
              <div className="font-medium">10:00 – 20:00</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">주말</div>
              <div className="font-medium">10:00 – 17:30</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">시술 시간대</div>
              <div className="font-medium">11 · 13 · 15 · 17시</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">예약 전화</div>
              <div className="font-medium">0507-1320-6511</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
