"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Send, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";

type TemplateColor = "pink" | "lavender";
type Category = "reservation" | "post-visit" | "loyalty" | "marketing";

type Template = {
  id: string;
  name: string;
  channel: "알림톡" | "친구톡";
  trigger: string;
  color: TemplateColor;
  category: Category;
  defaultMessage: string;
  cta?: { label: string; href: string };
};

const templates: Template[] = [
  {
    id: "A1",
    name: "예약 확정",
    channel: "알림톡",
    trigger: "즉시",
    color: "pink",
    category: "reservation",
    defaultMessage: "○○님 예약이 확정되었어요♡\n시간: __월 __일 __시\n메뉴: __\n변경 필요 시 앱에서 바로 알려주세요~",
    cta: { label: "예약 상세 보기", href: "/c/reserve" },
  },
  {
    id: "A2",
    name: "방문 1일 전",
    channel: "알림톡",
    trigger: "18:00",
    color: "pink",
    category: "reservation",
    defaultMessage: "○○님 내일 __시 예약이에요~ 컨디션 잘 챙기시구 편안하게 와주세요♡",
    cta: { label: "예약 확인", href: "/c/reserve" },
  },
  {
    id: "A3",
    name: "방문 당일",
    channel: "알림톡",
    trigger: "09:00",
    color: "pink",
    category: "reservation",
    defaultMessage: "○○님 오늘 __시 예약 다시 한 번 안내드려요~ 안경·콘택트는 미리 빼주세요♡",
    cta: { label: "위치·전화", href: "/c/menu" },
  },
  {
    id: "A4",
    name: "D+1 후기 요청",
    channel: "알림톡",
    trigger: "11:00",
    color: "pink",
    category: "post-visit",
    defaultMessage: "○○님 어제 시술 만족스러우셨길 바라요♡ 잠깐 시간 되시면 후기 한 줄 부탁드려요~ 다음 시술 때 영양제 챙겨드릴게요!",
    cta: { label: "후기 남기기", href: "/c/menu" },
  },
  {
    id: "A5",
    name: "D+28 재방문",
    channel: "친구톡",
    trigger: "11:00",
    color: "lavender",
    category: "loyalty",
    defaultMessage: "○○님 어느덧 4주 지났네요♡ 결 차분히 정리해드릴 시간이에요~ 편하신 날짜 알려주시면 자리 잡아드릴게요!",
    cta: { label: "재방문 예약하기", href: "/c/reserve" },
  },
  {
    id: "B",
    name: "단골 환영",
    channel: "알림톡",
    trigger: "즉시",
    color: "pink",
    category: "loyalty",
    defaultMessage: "○○님 환영합니다♡ 단골 분들께만 안내드리는 멤버십·이벤트는 앱으로 먼저 알려드릴게요~",
    cta: { label: "쿠폰 보기", href: "/c/coupon" },
  },
  {
    id: "C1",
    name: "노쇼 follow-up",
    channel: "알림톡",
    trigger: "19:00",
    color: "pink",
    category: "post-visit",
    defaultMessage: "○○님 오늘 예약 시간 지나도 못 오셨네요~ 컨디션 안 좋으신가요? 편하실 때 앱에서 새로 잡아주세요♡",
    cta: { label: "다시 예약", href: "/c/reserve" },
  },
  {
    id: "C2",
    name: "변경 응답",
    channel: "알림톡",
    trigger: "즉시",
    color: "pink",
    category: "reservation",
    defaultMessage: "○○님 변경 요청 확인했어요~ __월 __일 __시로 자리 잡아드릴까요? 답장 부탁드려요♡",
    cta: { label: "예약 변경", href: "/c/reserve" },
  },
  {
    id: "C3",
    name: "휴무 안내",
    channel: "알림톡",
    trigger: "사전",
    color: "pink",
    category: "post-visit",
    defaultMessage: "사장님 개인 일정으로 __월 __일 휴무예요~ 미리 양해 부탁드리고 예약 잡아두신 분께는 별도 안내드릴게요♡",
  },
  {
    id: "D1",
    name: "메디핑크 추천",
    channel: "친구톡",
    trigger: "수 14:00",
    color: "lavender",
    category: "marketing",
    defaultMessage: "○○님~ 출산·마찰로 어두워진 컬러 케어, 통증 거의 없는 메디컬 멜라닌 케어 한번 받아보세요♡ 첫 방문 상담은 무료예요!",
    cta: { label: "메디핑크 보기", href: "/c/sim" },
  },
  {
    id: "D2",
    name: "영양제 D+42",
    channel: "친구톡",
    trigger: "11:00",
    color: "lavender",
    category: "loyalty",
    defaultMessage: "○○님 영양제 다 쓰셨을 시기예요~ 다음 방문 때 1개 새로 챙겨드릴게요♡ 매일 한 번씩 발라주세욤!",
    cta: { label: "예약 잡기", href: "/c/reserve" },
  },
  {
    id: "D3",
    name: "이탈 단골 안부",
    channel: "친구톡",
    trigger: "월 09:00",
    color: "lavender",
    category: "loyalty",
    defaultMessage: "○○님 오랜만이에요♡ 잘 지내시죠? 다음 시술 생각 있으시면 편하게 앱에서 잡아주세요~ 결 봐드리고 싶어요!",
    cta: { label: "AI 시뮬 미리 보기", href: "/c/sim" },
  },
];

export default function AlimtokPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  function open(t: Template) {
    setOpenId(t.id);
    setCustomerName("");
    setMessage(t.defaultMessage);
  }

  async function send(t: Template) {
    if (!message.trim()) {
      toast.error("메시지를 입력해주세요");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/ops/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "alimtok",
          shopName: "유어라인",
          payload: {
            templateId: t.id,
            templateName: t.name,
            channel: t.channel,
            category: t.category,
            customerName: customerName.trim() || undefined,
            message,
            cta: t.cta,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "발송 실패");
      setSentIds((prev) => new Set(prev).add(t.id));
      toast.success("📥 손님 앱 인박스에 도착했어요♡");
      setOpenId(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "발송 실패";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <TopAppBar title="📢 알림톡 · 친구톡" />
      <div className="px-5 py-5">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50/60 border border-pink-100 rounded-2xl p-4 mb-4">
          <div className="text-sm font-bold text-pink-700 mb-1">
            💌 12종 메시지 — 앱 인박스에 즉시 도착
          </div>
          <p className="text-[12px] text-pink-700/70 leading-relaxed">
            손님 앱 설치 시 알림 0원 + 풀 UX (예약·시뮬 버튼 포함). 미설치는 카카오 알림톡 fallback.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          {templates.map((t, i) => {
            const isOpen = openId === t.id;
            const isSent = sentIds.has(t.id);
            return (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => open(t)}
                className={`text-left bg-white rounded-2xl p-3 border shadow-sm transition-colors ${
                  isOpen
                    ? "border-pink-400 ring-2 ring-pink-200"
                    : isSent
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-gray-100 hover:border-pink-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      t.color === "pink"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-violet-100 text-violet-700"
                    }`}
                  >
                    {t.id}
                  </span>
                  {isSent ? (
                    <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> 요청됨
                    </span>
                  ) : (
                    <span className="text-[9px] text-muted-foreground">
                      {t.channel}
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-foreground mb-0.5">
                  {t.name}
                </div>
                <div className="text-[10px] text-muted-foreground">{t.trigger}</div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {openId && (() => {
            const t = templates.find((x) => x.id === openId)!;
            return (
              <motion.div
                key={openId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white rounded-2xl border border-pink-200 shadow-md p-4 mb-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-pink-600" />
                    <span className="text-sm font-bold text-pink-700">
                      [{t.id}] {t.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setOpenId(null)}
                    className="text-xs text-muted-foreground"
                  >
                    닫기
                  </button>
                </div>

                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  손님 닉네임 (선택)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="예: 윤지미니"
                  className="w-full mb-3 px-3 py-2 text-sm rounded-xl border border-pink-200 focus:border-pink-400 outline-none"
                />

                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  메시지 (사장님 톤 — 그대로 발송)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full mb-3 px-3 py-2 text-sm rounded-xl border border-pink-200 focus:border-pink-400 outline-none whitespace-pre-line"
                />

                <Button
                  onClick={() => send(t)}
                  disabled={sending}
                  className="w-full h-11 rounded-xl"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {sending ? "요청 중..." : "발송 요청"}
                </Button>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        <div className="text-center text-[11px] text-muted-foreground pt-2 leading-relaxed">
          📥 발송 즉시 손님 앱 인박스에 도착<br />
          /c/inbox 에서 손님 입장에서 확인 가능
        </div>
      </div>
    </>
  );
}
