"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Camera,
  AlertCircle,
  Upload,
  Eraser,
  Loader2,
  ArrowLeftRight,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";
import { MaskCanvas, type MaskCanvasHandle } from "@/components/sim/MaskCanvas";
import {
  SERVICES,
  MODEL_LABELS,
  type ServiceKey,
  type ModelKey,
} from "@/lib/sim-prompts";

const PRESET_SELFIES = [
  "/demo-selfies/1.jpg",
  "/demo-selfies/2.jpg",
  "/demo-selfies/3.jpg",
];

export default function SimPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [service, setService] = useState<ServiceKey>("glue-half");
  const [model, setModel] = useState<ModelKey>("gpt-image-2");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [showBefore, setShowBefore] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<MaskCanvasHandle>(null);

  async function handlePreset(src: string) {
    setResultUrl(null);
    setImageUrl(src);
    try {
      const r = await fetch(src);
      const b = await r.blob();
      const ext = src.split(".").pop() || "jpg";
      setImageFile(new File([b], `preset.${ext}`, { type: b.type || "image/jpeg" }));
    } catch {
      toast.error("프리셋 사진 로드 실패");
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setResultUrl(null);
    setImageFile(f);
    setImageUrl(URL.createObjectURL(f));
  }

  async function handleGenerate() {
    if (!imageFile) return toast.error("먼저 사진을 선택해주세요");
    const hasMask = canvasRef.current?.hasStrokes() ?? false;
    setLoading(true);
    setResultUrl(null);
    try {
      const form = new FormData();
      form.append("image", imageFile);
      if (hasMask) {
        const maskBlob = await canvasRef.current!.exportMaskPng();
        form.append("mask", new File([maskBlob], "mask.png", { type: "image/png" }));
      }
      form.append("service", service);
      form.append("model", model);

      const res = await fetch("/api/sim", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "생성 실패");
      }
      const url = json.url ?? (json.b64 ? `data:image/png;base64,${json.b64}` : null);
      if (!url) throw new Error("결과 이미지 없음");
      setResultUrl(url);
      setShowBefore(false);
      toast.success(`${MODEL_LABELS[model].label} 완료!`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "알 수 없는 에러";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopAppBar title="AI 시술 시뮬" showBack />

      <div className="bg-gradient-sim min-h-screen">
        <div className="px-5 py-6 space-y-5">
          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-white/60 backdrop-blur shadow-lg mb-3">
              <Sparkles className="w-7 h-7 text-pink-600" />
            </div>
            <h1 className="text-xl font-bold text-pink-700 mb-1">
              내 얼굴에 어울리는 시술은?
            </h1>
            <p className="text-xs text-pink-900/70 leading-relaxed px-4">
              셀카 한 장 → 시술 6종 미리보기 ♡
            </p>
          </motion.div>

          {/* Step 1: 사진 선택 */}
          {!imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/85 backdrop-blur-lg rounded-3xl p-5 shadow-xl border border-white/60 space-y-4"
            >
              <div className="text-sm font-semibold text-pink-900/80">
                1️⃣ 데모 셀카 선택 또는 본인 사진 업로드
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_SELFIES.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => handlePreset(src)}
                    className="aspect-square rounded-2xl overflow-hidden bg-pink-50 border-2 border-white shadow active:scale-95 transition-transform"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`데모 ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </button>
                ))}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFile}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-12 rounded-2xl text-base font-semibold"
              >
                <Upload className="w-4 h-4" /> 내 셀카 업로드
              </Button>
              <div className="text-[11px] text-pink-900/60 text-center">
                정면·자연광 권장 · 안경 X
              </div>
            </motion.div>
          )}

          {/* Step 2: 마스크 그리기 */}
          {imageUrl && !resultUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/85 backdrop-blur-lg rounded-3xl p-5 shadow-xl border border-white/60 space-y-4"
            >
              <div className="text-sm font-semibold text-pink-900/80">
                2️⃣ 눈썹 위치를 표시해주세요 (양쪽 눈가에 손가락으로 그리기)
              </div>
              <MaskCanvas ref={canvasRef} imageUrl={imageUrl} />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => canvasRef.current?.clear()}
                  className="flex-1 h-10 rounded-xl"
                >
                  <Eraser className="w-4 h-4" /> 다시 그리기
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setImageUrl(null);
                    setImageFile(null);
                    setResultUrl(null);
                  }}
                  className="flex-1 h-10 rounded-xl"
                >
                  <Camera className="w-4 h-4" /> 다른 사진
                </Button>
              </div>
              <div className="text-[11px] text-pink-900/60 leading-relaxed bg-pink-50/60 rounded-lg p-2">
                💡 마스크 없이도 생성 가능하지만, 눈가를 표시하면 더 정확해요.
              </div>
            </motion.div>
          )}

          {/* Step 3: 시술 + 모델 + 생성 */}
          {imageUrl && !resultUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/85 backdrop-blur-lg rounded-3xl p-5 shadow-xl border border-white/60 space-y-4"
            >
              <div className="text-sm font-semibold text-pink-900/80">
                3️⃣ 시술 종류 (6)
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SERVICES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setService(s.key)}
                    className={`p-2.5 rounded-2xl text-center text-xs font-medium transition-all ${
                      service === s.key
                        ? "bg-pink-500 text-white shadow-md"
                        : "bg-pink-50/80 text-pink-900/70"
                    }`}
                  >
                    <div className="font-bold mb-0.5 text-[11px]">{s.label}</div>
                    <div className="text-[9px] opacity-80">{s.sub}</div>
                  </button>
                ))}
              </div>

              <div className="text-sm font-semibold text-pink-900/80 pt-2">
                4️⃣ 모델 (비교 데모)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(MODEL_LABELS) as ModelKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setModel(k)}
                    className={`p-3 rounded-2xl text-left transition-all ${
                      model === k
                        ? "bg-pink-100 ring-2 ring-pink-400 text-pink-900"
                        : "bg-pink-50/60 text-pink-900/70"
                    }`}
                  >
                    <div className="font-bold text-xs">{MODEL_LABELS[k].label}</div>
                    <div className="text-[10px] opacity-70">{MODEL_LABELS[k].desc}</div>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full h-12 rounded-2xl text-base font-semibold mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> 생성 중... (10~30초)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> 시뮬 생성하기
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Step 4: 결과 */}
          <AnimatePresence>
            {resultUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-lg rounded-3xl p-5 shadow-xl border border-white/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-pink-900/80">
                    ✨ {SERVICES.find((s) => s.key === service)?.label} ·{" "}
                    {MODEL_LABELS[model].label}
                  </div>
                  <button
                    onClick={() => setShowBefore((v) => !v)}
                    className="flex items-center gap-1 text-[11px] text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full"
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    {showBefore ? "After" : "Before"}
                  </button>
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-pink-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={showBefore ? imageUrl! : resultUrl}
                    alt="결과"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setResultUrl(null)}
                    className="flex-1 h-10 rounded-xl"
                  >
                    다른 시술 시도
                  </Button>
                  <Button
                    onClick={() => {
                      setImageUrl(null);
                      setImageFile(null);
                      setResultUrl(null);
                    }}
                    className="flex-1 h-10 rounded-xl"
                  >
                    처음으로
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 디스클레이머 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-3 rounded-xl bg-white/60 backdrop-blur border border-pink-100 flex gap-2"
          >
            <AlertCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-pink-900/70 leading-relaxed">
              AI 시뮬은 참고용이에요. 실제 결과는 손님 모질·뿌리 방향에 따라 차이
              있을 수 있어요. 방문 시 사장님이 1:1로 정확히 봐드려요!
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
