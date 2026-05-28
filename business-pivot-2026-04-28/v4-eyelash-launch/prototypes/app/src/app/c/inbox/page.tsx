"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Sparkles,
  Heart,
  Calendar,
  Star,
  ChevronRight,
  Inbox as InboxIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { TopAppBar } from "@/components/common/TopAppBar";
import type { InboxMessage } from "@/app/api/inbox/route";

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
}

const CATEGORY_STYLES = {
  reservation: {
    label: "예약",
    Icon: Calendar,
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-700",
    borderClass: "border-pink-200/70",
    glowFrom: "from-pink-100/60",
  },
  "post-visit": {
    label: "시술 후",
    Icon: Heart,
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-700",
    borderClass: "border-rose-200/70",
    glowFrom: "from-rose-100/60",
  },
  loyalty: {
    label: "단골",
    Icon: Star,
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    borderClass: "border-amber-200/60",
    glowFrom: "from-amber-100/60",
  },
  marketing: {
    label: "혜택",
    Icon: Sparkles,
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-700",
    borderClass: "border-violet-200/60",
    glowFrom: "from-violet-100/60",
  },
} as const;

const DEFAULT_STYLE = {
  label: "알림",
  Icon: Bell,
  badgeBg: "bg-slate-100",
  badgeText: "text-slate-700",
  borderClass: "border-slate-200/70",
  glowFrom: "from-slate-100/60",
} as const;

function styleFor(msg: InboxMessage) {
  if (msg.category && msg.category in CATEGORY_STYLES) {
    return CATEGORY_STYLES[msg.category];
  }
  return DEFAULT_STYLE;
}

export default function CustomerInboxPage() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = useCallback(async () => {
    try {
      const res = await fetch("/api/inbox", { cache: "no-store" });
      const data = await res.json();
      setMessages(data.messages ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInbox();
    const t = setInterval(fetchInbox, 10000);
    return () => clearInterval(t);
  }, [fetchInbox]);

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <>
      <TopAppBar title="📥 받은 알림" />
      <div className="min-h-screen bg-gradient-to-b from-pink-50/40 via-rose-50/30 to-fuchsia-50/20">
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">
              YOUR LINE INBOX
            </div>
            <div className="text-sm font-bold text-foreground/80 mt-0.5">
              유어라인에서 보낸 알림 {messages.length}건
            </div>
          </div>
          {unreadCount > 0 && (
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
              읽지 않음 {unreadCount}
            </span>
          )}
        </div>

        <div className="px-4 pb-6 space-y-3">
          {loading && messages.length === 0 && (
            <div className="flex items-center justify-center py-16 text-pink-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> 알림 가져오는 중...
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="text-center py-16">
              <InboxIcon className="w-10 h-10 text-pink-200 mx-auto mb-3" />
              <p className="text-sm text-foreground/50 leading-relaxed">
                아직 받은 알림이 없어요♡
                <br />
                <span className="text-[11px] text-foreground/40">
                  예약 확정·재방문 알림 등이 여기로 도착합니다
                </span>
              </p>
            </div>
          )}

          {messages.map((m, idx) => {
            const s = styleFor(m);
            const Icon = s.Icon;
            return (
              <motion.article
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.2) }}
                className={`bg-white rounded-3xl border ${s.borderClass} shadow-sm overflow-hidden`}
              >
                <div
                  className={`px-4 pt-4 pb-3 bg-gradient-to-br ${s.glowFrom} to-white`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl ${s.badgeBg} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${s.badgeText}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold ${s.badgeBg} ${s.badgeText} px-1.5 py-0.5 rounded`}
                        >
                          {s.label}
                        </span>
                        <span className="text-[10px] text-foreground/40 font-medium">
                          · {m.channel}
                        </span>
                        <span className="text-[10px] text-foreground/40">
                          · {timeAgo(m.receivedAt)}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-foreground mt-0.5 leading-tight">
                        {m.templateName}
                      </div>
                    </div>
                    {!m.read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-line">
                    {m.message}
                  </p>
                  {m.cta && (
                    <Link
                      href={m.cta.href}
                      className="mt-3 inline-flex items-center justify-center gap-1.5 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold py-2.5 rounded-2xl hover:opacity-95 transition"
                    >
                      {m.cta.label} <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="text-center text-[11px] text-pink-700/50 pb-6 px-5 leading-relaxed">
          💌 유어라인 앱 알림은 카카오 알림톡보다 더 빠르고 풍성하게 도착해요
          <br />
          예약 확정·재방문·메디핑크 캠페인 모두 이 인박스 한 곳에서 확인하세요
        </div>
      </div>
    </>
  );
}
