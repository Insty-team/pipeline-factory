"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TopAppBar } from "@/components/common/TopAppBar";
import { Button } from "@/components/ui/button";

type GenResult = {
  service_type?: string;
  eye_analysis?: string;
  instagram_caption?: string;
  instagram_hashtags?: string[];
  blog_title?: string;
  blog_body?: string;
  blog_hashtags?: string[];
  image_data_url?: string;
  menu_hint?: string;
};

type Published = {
  channel: "instagram" | "naver";
  url: string;
};

export default function ContentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [menuHint, setMenuHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<GenResult | null>(null);
  const [publishing, setPublishing] = useState<"instagram" | "naver" | null>(null);
  const [published, setPublished] = useState<Published[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) {
      setElapsed(0);
      return;
    }
    const startedAt = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);
    return () => clearInterval(id);
  }, [loading]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
    setPublished([]);
  }

  async function handleGenerate() {
    if (!file) return toast.error("먼저 사진을 업로드해주세요");
    if (!menuHint.trim()) return toast.error("시술명 한 단어를 입력해주세요");
    setLoading(true);
    setResult(null);
    setPublished([]);
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("menuHint", menuHint.trim());
      const res = await fetch("/api/content/generate", { method: "POST", body: form });
      const json = (await res.json()) as GenResult & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "생성 실패");
      setResult(json);
      toast.success("생성 완료! 미리보기 확인하세요");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "알 수 없는 에러");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish(channel: "instagram" | "naver") {
    if (!result?.image_data_url) return;
    setPublishing(channel);
    try {
      const res = await fetch("/api/content/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          channel,
          imageDataUrl: result.image_data_url,
          serviceLabel: menuHint,
          caption: result.instagram_caption,
          hashtags:
            channel === "instagram" ? result.instagram_hashtags : result.blog_hashtags,
          blogTitle: result.blog_title,
          blogBody: result.blog_body,
        }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "게시 실패");
      setPublished((prev) => [...prev, { channel, url: json.url! }]);
      toast.success(
        channel === "instagram" ? "📸 인스타 게시 완료!" : "📝 네이버 블로그 게시 완료!"
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "게시 실패");
    } finally {
      setPublishing(null);
    }
  }

  const progressPct = Math.min(95, Math.round((elapsed / 15) * 100));
  const stageLabel =
    elapsed < 3
      ? "사진 분석 중..."
      : elapsed < 8
        ? "캡션·블로그 생성 중..."
        : elapsed < 14
          ? "사장 톤으로 다듬는 중..."
          : "마무리 중...";

  return (
    <>
      <TopAppBar title="📸 콘텐츠 자동" showBack />
      <div className="px-5 py-5 space-y-5 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-5 bg-gradient-to-br from-pink-50 to-pink-100/60 border border-pink-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span className="text-xs font-semibold text-pink-700">
              사진 1장 + 시술명 → 인스타·블로그 자동 생성·게시
            </span>
          </div>
          <p className="text-sm text-pink-900/80 leading-relaxed">
            인스타 캡션 + 블로그 700자 + 해시태그 자동 생성.
            <br />
            <span className="text-pink-600 font-semibold">사장님 노동 6h/주 → 5분/주 (-99%)</span>
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl border border-pink-100/60 p-5 space-y-4 shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />
          {!previewUrl ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video bg-pink-50 rounded-xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              <Upload className="w-9 h-9 text-pink-400" />
              <div className="text-sm font-medium text-pink-700">시술 사진 업로드</div>
              <div className="text-xs text-muted-foreground">JPG · PNG · 최대 20MB</div>
            </button>
          ) : (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-pink-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="업로드 사진" className="w-full h-full object-cover" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-2 top-2 px-3 py-1.5 text-xs font-medium bg-white/90 backdrop-blur rounded-full shadow"
              >
                <Camera className="w-3.5 h-3.5 inline mr-1" /> 변경
              </button>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-pink-900/70">시술명 (1단어)</label>
            <input
              value={menuHint}
              onChange={(e) => setMenuHint(e.target.value)}
              placeholder="예: C컬 펌 / LED 연장 / 글루연장"
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-pink-200/60 bg-pink-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-pink-50/70 border border-pink-200/60 p-3 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-pink-900/80">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-600" />
                  {stageLabel}
                </span>
                <span className="tabular-nums text-pink-700">{elapsed}s</span>
              </div>
              <div className="h-2 bg-white/70 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-400 to-pink-600"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading || !file}
            className="w-full h-12 rounded-2xl text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> 생성 중...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" /> 게시물 생성
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="text-xs font-semibold text-pink-900/70 px-1 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                자동 분석: {result.service_type ?? "?"} · {result.eye_analysis ?? "—"}
              </div>

              {/* 인스타 미리보기 */}
              <div className="bg-white rounded-2xl border border-pink-100/60 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-pink-50">
                  <span className="text-xs font-bold text-pink-700">📸 인스타 캡션</span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                    {result.instagram_caption}
                  </p>
                  {result.instagram_hashtags && result.instagram_hashtags.length > 0 && (
                    <div className="text-xs text-pink-600/80 leading-relaxed">
                      {result.instagram_hashtags.join(" ")}
                    </div>
                  )}
                  {published.find((p) => p.channel === "instagram") ? (
                    <Link
                      href={published.find((p) => p.channel === "instagram")!.url}
                      className="flex items-center justify-between w-full h-12 px-4 mt-1 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md active:scale-[0.98] transition"
                    >
                      <span className="flex items-center gap-2 text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        인스타에 게시 완료
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold">
                        게시물 열기 <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublish("instagram")}
                      disabled={publishing === "instagram"}
                      className="w-full mt-1"
                    >
                      {publishing === "instagram" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> 게시 중...
                        </>
                      ) : (
                        <>📸 인스타 게시</>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* 블로그 미리보기 */}
              <div className="bg-white rounded-2xl border border-pink-100/60 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-pink-50">
                  <span className="text-xs font-bold text-green-700">📝 네이버 블로그</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="text-sm font-bold text-foreground">{result.blog_title}</div>
                  <p className="text-[13px] leading-relaxed whitespace-pre-line text-foreground/85 max-h-60 overflow-y-auto">
                    {result.blog_body}
                  </p>
                  {result.blog_hashtags && result.blog_hashtags.length > 0 && (
                    <div className="text-xs text-green-700/80 leading-relaxed">
                      {result.blog_hashtags.join(" ")}
                    </div>
                  )}
                  {published.find((p) => p.channel === "naver") ? (
                    <Link
                      href={published.find((p) => p.channel === "naver")!.url}
                      className="flex items-center justify-between w-full h-12 px-4 mt-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md active:scale-[0.98] transition"
                    >
                      <span className="flex items-center gap-2 text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        블로그에 게시 완료
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold">
                        포스트 열기 <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublish("naver")}
                      disabled={publishing === "naver"}
                      className="w-full mt-1"
                    >
                      {publishing === "naver" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> 게시 중...
                        </>
                      ) : (
                        <>📝 네이버 블로그 게시</>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-pink-900/60 text-center px-2">
                ⚠️ 데모: 게시 클릭 시 앱 내 모의 페이지로 발행됩니다. 실 운영 시 Meta Graph
                API / 네이버 블로그 OpenAPI로 자동 게시.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
