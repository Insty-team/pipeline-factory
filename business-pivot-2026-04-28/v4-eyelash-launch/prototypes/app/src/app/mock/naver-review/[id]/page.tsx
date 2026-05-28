import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, MapPin, Phone, ChevronLeft } from "lucide-react";
import { SEED_REVIEWS } from "@/lib/seed-reviews";

export default async function MockNaverReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = SEED_REVIEWS.find((r) => r.id === id);
  if (!review) notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Naver Place top bar */}
      <header className="sticky top-0 z-10 bg-emerald-600 text-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <Link href="/o/reply" className="opacity-90">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="text-sm font-bold">N 플레이스 · 유어라인 속눈썹</div>
        <div className="ml-auto text-[10px] opacity-70">모의 페이지</div>
      </header>

      {/* Shop summary */}
      <section className="bg-white border-b border-slate-200 px-4 py-4">
        <h1 className="text-lg font-black text-slate-900">유어라인 속눈썹 · 메디핑크</h1>
        <div className="flex items-center gap-1.5 mt-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-slate-800">4.93</span>
          <span className="text-xs text-slate-500">· 후기 120</span>
        </div>
        <div className="text-[12px] text-slate-600 mt-2 space-y-1">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> 동작구 이수·사당
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" /> 0507-1320-6511
          </div>
        </div>
      </section>

      {/* Review */}
      <article className="bg-white mt-2 px-4 py-4 border-y border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center text-white text-sm font-bold">
            {review.nickname.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-slate-900">
              {review.nickname}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(review.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-amber-400 text-amber-400"
                />
              ))}
              <span className="text-[10px] text-slate-500 ml-1">
                · {review.visits}번째 방문 · 2026-05-29
              </span>
            </div>
          </div>
        </div>
        <p className="text-[13px] leading-relaxed text-slate-800 whitespace-pre-line">
          {review.reviewText}
        </p>
      </article>

      {/* Owner reply */}
      <section className="px-4 py-4">
        <div className="ml-6 rounded-2xl bg-pink-50 border border-pink-100 p-4 relative">
          <div className="absolute -left-3 top-3 w-3 h-3 bg-pink-50 border-l border-b border-pink-100 transform rotate-45" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-[10px] font-black">
              U
            </div>
            <div>
              <div className="text-[12px] font-bold text-pink-700">
                유어라인 사장님
              </div>
              <div className="text-[10px] text-pink-700/60">
                답글 · 방금 전 · ♥ 사장님 직접 작성
              </div>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed text-slate-800 whitespace-pre-line">
            {review.draftReply}
          </p>
        </div>
      </section>

      {/* Footer note */}
      <div className="px-4 py-6 text-center text-[10px] text-slate-400 leading-relaxed">
        ✨ 이 페이지는 데모용 모의 페이지입니다.
        <br />
        실제 운영에서는 사장님 승인 후 운영팀이 네이버 플레이스에 직접 게시합니다.
      </div>

      <div className="px-4 pb-8">
        <Link
          href="/o/reply"
          className="block text-center text-[12px] font-bold text-pink-600 bg-pink-50 border border-pink-100 rounded-2xl py-3"
        >
          ← 답글 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}
