"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";

const samples = [
  {
    nickname: "Soominnnn",
    visits: 10,
    review: "속눈썹 연장 유목민이었는데 드디어 정착한 곳…✨ 벌써 10번 넘게 방문한 유어라인 찐후기 남겨요!",
    reply: "Soominnnn님~ 10번째 방문 정착하셨다니 너무 감동입니당♡♡\n한 올 한 올 봐드린 거 마음에 드신다니 다행이네요~\n건조한 날씨 영양제 꼭 챙겨서 발라주세욤~!!",
  },
  {
    nickname: "에츄19",
    visits: 3,
    review: "내돈내산 3번째 방문이에요ㅎㅎㅎ 속눈썹펌 유목민이였는데 사장님 만나고 정착햇어요...",
    reply: "에츄19님~ 3번째 방문 감사합니다♡\n마음에 드셨다니 저도 너무 기쁘네요 ㅎㅎ\n환절기 영양제 꼭 발라주시구~ 이쁘게 하고 다니세용~!!",
  },
];

export default function ReplyPage() {
  return (
    <>
      <TopAppBar title="💌 답글 자동" />
      <div className="px-5 py-5 space-y-4">
        <div className="bg-gradient-to-br from-pink-50 to-cream-100 rounded-2xl p-4">
          <div className="text-sm font-semibold text-pink-700 mb-1">
            ✨ 신규 후기 감지 → 답글 시안 → 사장님 1탭 게시
          </div>
          <p className="text-xs text-muted-foreground">
            8개월 백필 10건 일회성 완료 · 신규 후기는 매시간 감지
          </p>
        </div>

        {samples.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
          >
            {/* 후기 */}
            <div className="p-4 bg-cream-100/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-semibold text-sm">{s.nickname}</div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-medium">
                  {s.visits}번째 방문
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {s.review}
              </p>
            </div>

            {/* 답글 시안 */}
            <div className="p-4 border-t border-gray-100">
              <div className="text-[10px] font-bold text-pink-600 uppercase mb-2">
                ✨ 답글 시안 (사장님 톤 자동 생성)
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line mb-3">
                {s.reply}
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  네이버에 게시
                </Button>
                <Button size="sm" variant="outline">
                  수정
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="text-center text-[11px] text-muted-foreground pt-2">
          🚧 Stage 2.9에서 Apify scraper + Claude Haiku 시안 자동 생성
        </div>
      </div>
    </>
  );
}
