"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const messages = [
  {
    role: "bot",
    text: "안녕하세요! 유어라인이에요 ♡ 무엇을 도와드릴까요?",
    time: "방금",
  },
  {
    role: "user",
    text: "C컬 펌 가격 알려주세요",
    time: "방금",
  },
  {
    role: "bot",
    text: "펌은 두 가지에요~\n• 영양펌 33,000원\n• 영양 블랙 틴팅펌 44,000원\n\n펌+연장 동시 진행은 펌포인트 연장 66,000원이에요. 영양 가득 넣어서 펌해드려요♡",
    time: "방금",
  },
];

const quickReplies = [
  "글루연장 가격",
  "C컬 vs J컬",
  "예약 가능해요?",
  "주차 가능?",
];

export default function ChatPage() {
  return (
    <>
      <TopAppBar title="💬 유어라인 챗봇" showBack />

      <div className="flex flex-col h-[calc(100vh-3.5rem-5rem)]">
        {/* 대화 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-3xl text-sm leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-pink-500 text-white rounded-br-md"
                    : "bg-white border border-pink-100 text-foreground rounded-bl-md shadow-sm"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick replies */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {quickReplies.map((q) => (
            <button
              key={q}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-medium text-pink-700 hover:bg-pink-100 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* 입력 */}
        <div className="px-4 py-3 bg-white border-t border-pink-100">
          <div className="flex gap-2">
            <Input
              placeholder="궁금한 점을 물어보세요..."
              className="rounded-full border-pink-200 focus-visible:border-pink-400"
            />
            <Button size="icon" className="rounded-full flex-shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            🚧 Stage 2.6에서 Claude Haiku 4.5 연동
          </p>
        </div>
      </div>
    </>
  );
}
