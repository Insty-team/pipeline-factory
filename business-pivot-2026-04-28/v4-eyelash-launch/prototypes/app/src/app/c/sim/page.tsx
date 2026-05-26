"use client";

import { motion } from "framer-motion";
import { Sparkles, Camera, AlertCircle } from "lucide-react";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";

export default function SimPage() {
  return (
    <>
      <TopAppBar title="AI 시술 시뮬" showBack />

      <div className="bg-gradient-sim min-h-screen">
        <div className="px-5 py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/60 backdrop-blur shadow-lg mb-4">
              <Sparkles className="w-8 h-8 text-pink-600" />
            </div>
            <h1 className="text-2xl font-bold text-pink-700 mb-2">
              내 얼굴에 어울리는 컬은?
            </h1>
            <p className="text-sm text-pink-900/70 leading-relaxed px-4">
              셀카 한 장이면 J·C·D컬 비교 5초 안에 보여드려요 ♡
            </p>
          </motion.div>

          {/* 셀카 업로드 영역 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/60"
          >
            <div className="aspect-square bg-gradient-to-br from-pink-50 to-lavender-50 rounded-2xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center mb-3">
                <Camera className="w-8 h-8 text-pink-600" />
              </div>
              <div className="text-sm font-medium text-pink-700">
                셀카 업로드
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                정면·자연광 권장
              </div>
            </div>

            <Button className="w-full h-12 rounded-2xl text-base font-semibold">
              📷 사진 선택
            </Button>
          </motion.div>

          {/* 시뮬 종류 선택 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5"
          >
            <div className="text-sm font-semibold text-pink-900/80 mb-3">
              어떤 시뮬?
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "컬 비교", desc: "J · C · D", active: true },
                { label: "풍성도", desc: "50% · 90%" },
                { label: "메디핑크", desc: "Before · After" },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`p-3 rounded-2xl text-center text-xs font-medium transition-all cursor-pointer ${
                    s.active
                      ? "bg-pink-500 text-white shadow-md"
                      : "bg-white/60 text-pink-900/70 hover:bg-white"
                  }`}
                >
                  <div className="font-bold mb-0.5">{s.label}</div>
                  <div className="text-[10px] opacity-80">{s.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 디스클레이머 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-3 rounded-xl bg-white/60 backdrop-blur border border-pink-100 flex gap-2"
          >
            <AlertCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-pink-900/70 leading-relaxed">
              AI 시뮬은 참고용이에요. 실제 결과는 손님 모질·뿌리 방향에 따라
              차이 있을 수 있어요. 방문 시 사장님이 1:1로 정확히 봐드려요!
            </p>
          </motion.div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            🚧 Stage 1.2에서 GPT-image-1 inpainting 연동
          </div>
        </div>
      </div>
    </>
  );
}
