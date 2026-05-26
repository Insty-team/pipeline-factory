"use client";

import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";

export default function ContentPage() {
  return (
    <>
      <TopAppBar title="📸 콘텐츠 자동" />
      <div className="px-5 py-5 space-y-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-pink-50 to-lavender-50 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span className="text-xs font-semibold text-pink-700">
              사진 1장 + 시술명 → 5초 자동 생성·게시
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            인스타 캡션 + 블로그 long-form 700자 + 해시태그 + 워터마크 자동.
            <br />사장님 노동 6h/주 → 5분/주 (-99%)
          </p>
        </motion.div>

        {/* 사진 업로드 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="aspect-video bg-pink-50 rounded-xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center mb-4">
            <Camera className="w-10 h-10 text-pink-400 mb-2" />
            <div className="text-sm font-medium text-pink-700">
              시술 사진 업로드
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              JPG · PNG
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                시술명
              </label>
              <input
                placeholder="예: C컬 펌"
                className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-sm"
              />
            </div>
            <Button className="w-full h-11 rounded-xl">
              🚀 게시물 생성
            </Button>
          </div>
        </div>

        {/* 미리보기 mockup */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground px-1">
            ▼ 자동 생성된 게시물 미리보기
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="text-[10px] font-bold text-pink-600 uppercase mb-2">
              인스타 캡션
            </div>
            <p className="text-sm leading-relaxed mb-3 whitespace-pre-line">
              {`C컬 펌 — 단골님 재방문!
이번에도 자연스럽게 컬 잡아드렸네요~

영양가득 넣어서 펌하기~♡
영양제 관리는 필수입니다!!

♡♡ 사진동의 감사드립니다♡♡

#유어라인 #C컬펌 #속눈썹펌 #이수역속눈썹펌 #영양펌`}
            </p>
            <Button variant="outline" size="sm" className="w-full">
              📸 인스타 게시
            </Button>
          </div>
        </div>

        <div className="text-center text-[11px] text-muted-foreground pt-2">
          🚧 Stage 1.3에서 Meta Graph API + 네이버 블로그 OpenAPI 연동
        </div>
      </div>
    </>
  );
}
