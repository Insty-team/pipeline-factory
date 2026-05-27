"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Role = "user" | "assistant";

type Message = {
  id: string;
  role: Role;
  content: string;
  escalated?: boolean;
  error?: boolean;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "greet",
    role: "assistant",
    content:
      "안녕하세요! 유어라인이에요 ♡\n시술·메뉴·예약 등 궁금한 점 편하게 물어봐주세요~ 시술 중이면 사장님 대신 챗봇이 먼저 답변 드려요!",
  },
];

const QUICK_REPLIES = [
  "글루 연장 가격 알려주세요",
  "C컬·J컬·D컬 차이",
  "메디핑크가 뭐예요?",
  "세안 언제부터 가능?",
  "예약 어떻게 하나요?",
];

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function renderRichText(text: string) {
  const parts = text.split(/(\*\*[^*\n]+\*\*|__[^_\n]+__)/g);
  return parts.map((part, i) => {
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length > 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length > 4)
    ) {
      return (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { id: newId(), role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);

      const botMsg: Message = {
        id: newId(),
        role: "assistant",
        content: data.reply,
        escalated: Boolean(data.escalated),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "응답을 받지 못했어요";
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          content: `(연결 오류 — ${message})\n잠시 후 다시 시도해주세요♡`,
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <TopAppBar title="💬 유어라인 챗봇" showBack />

      <div className="flex flex-col h-[calc(100vh-3.5rem-5rem)] bg-gradient-to-b from-pink-50/30 to-rose-50/30">
        {/* 대화 영역 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.1) }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] px-4 py-2.5 rounded-3xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  m.role === "user"
                    ? "bg-pink-500 text-white rounded-br-md"
                    : m.error
                      ? "bg-rose-50 border border-rose-200 text-rose-700 rounded-bl-md"
                      : m.escalated
                        ? "bg-amber-50 border border-amber-200 text-amber-900 rounded-bl-md"
                        : "bg-white border border-pink-100 text-foreground rounded-bl-md"
                }`}
              >
                {m.escalated && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 mb-1 uppercase tracking-wider">
                    <AlertCircle className="w-3 h-3" /> 사장님 확인 요청 전달됨
                  </div>
                )}
                {renderRichText(m.content)}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-pink-100 rounded-3xl rounded-bl-md px-4 py-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-pink-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="text-xs">사장님 톤으로 답변 준비 중...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick replies */}
        {messages.length <= 2 && !isLoading && (
          <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-medium text-pink-700 hover:bg-pink-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* 입력 */}
        <div className="px-4 py-3 bg-white border-t border-pink-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="궁금한 점을 물어보세요..."
              disabled={isLoading}
              className="rounded-full border-pink-200 focus-visible:border-pink-400"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="rounded-full flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            🤖 gpt-4o-mini · 사장님 톤 학습 · 알러지·환불·휴무 등 escalate 자동 분기
          </p>
        </div>
      </div>
    </>
  );
}
