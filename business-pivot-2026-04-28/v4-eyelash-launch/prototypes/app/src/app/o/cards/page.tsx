"use client";

import Link from "next/link";
import {
  Sparkles,
  Heart,
  FileText,
  MessageCircle,
  ChevronRight,
  Wand2,
  Clock,
  Hash,
} from "lucide-react";

type CardItem = { src: string; alt: string };

type CardSet = {
  id: string;
  num: string;
  chip: string;
  title: string;
  subtitle: string;
  accent: "pink" | "rose" | "fuchsia";
  cards: CardItem[];
  bonus?: { src: string; alt: string; label: string };
};

const SETS: CardSet[] = [
  {
    id: "set1",
    num: "01",
    chip: "💰",
    title: "가격표 · 멤버십",
    subtitle: "메뉴 11종 + 멤버십 4종을 인스타 캐러셀 4장으로",
    accent: "pink",
    cards: [
      { src: "/cards/1B1_cover_vertical.jpg", alt: "표지 — 시술 안내 가격표" },
      { src: "/cards/1B2_eyelash_extensions.jpg", alt: "연장 가격표 7종" },
      { src: "/cards/1B3_eyelash_perm.jpg", alt: "펌 가격표 3종 + 올인원 영양펌" },
      { src: "/cards/1B4_membership_medipink.jpg", alt: "멤버십 4종 + 메디핑크" },
    ],
    bonus: {
      src: "/cards/1A_menu_landscape.jpg",
      alt: "가로형 PDF 메뉴판 (16:9)",
      label: "📄 PDF · 인쇄용 가로 메뉴판 (별도 1장)",
    },
  },
  {
    id: "set2",
    num: "02",
    chip: "👁",
    title: "컬 디자인 비교",
    subtitle: "손님이 직접 J·C·D컬과 눈매를 매칭하도록 6장",
    accent: "rose",
    cards: [
      { src: "/cards/2A_cover.jpg", alt: "표지 — 내 눈매에 맞는 컬은?" },
      { src: "/cards/2B_jcurl.jpg", alt: "J컬 — 가장 자연스러운 라인" },
      { src: "/cards/2C_ccurl.jpg", alt: "C컬 — 또렷한 인형 같은 눈매" },
      { src: "/cards/2D_dcurl.jpg", alt: "D컬 — 가장 강한 컬링" },
      { src: "/cards/2E_eyetype_match.jpg", alt: "눈매별 추천 컬 매칭표" },
      { src: "/cards/2F_cta.jpg", alt: "상담 CTA — 궁금하신 점은 편하게" },
    ],
  },
  {
    id: "set3",
    num: "03",
    chip: "💎",
    title: "메디핑크 캠페인",
    subtitle: "프리미엄 USP를 라벤더 톤 캠페인 5장으로",
    accent: "fuchsia",
    cards: [
      { src: "/cards/3A_cover_campaign.jpg", alt: "캠페인 표지 — 잃어버린 자신감" },
      { src: "/cards/3B_effect_5steps.jpg", alt: "메디핑크 5단계 케어" },
      { src: "/cards/3C_pricing_package.jpg", alt: "패키지 가격 (Light · Full)" },
      { src: "/cards/3D_before_after.jpg", alt: "실제 손님 변화 사례 Before/After" },
      { src: "/cards/3E_cta_event.jpg", alt: "CTA — 첫 상담 무료 캠페인" },
    ],
  },
];

const accentMap = {
  pink: {
    chipBg: "bg-pink-50",
    chipText: "text-pink-700",
    chipBorder: "border-pink-200/70",
    headerText: "text-pink-700",
    border: "border-pink-100/70",
    ring: "ring-pink-100",
  },
  rose: {
    chipBg: "bg-rose-50",
    chipText: "text-rose-700",
    chipBorder: "border-rose-200/70",
    headerText: "text-rose-700",
    border: "border-rose-100/70",
    ring: "ring-rose-100",
  },
  fuchsia: {
    chipBg: "bg-fuchsia-50",
    chipText: "text-fuchsia-700",
    chipBorder: "border-fuchsia-200/70",
    headerText: "text-fuchsia-700",
    border: "border-fuchsia-100/70",
    ring: "ring-fuchsia-100",
  },
} as const;

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-fuchsia-50/40">
      {/* Hero */}
      <section className="relative px-5 pt-10 pb-10 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,114,182,0.18),_transparent_70%)] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-pink-200/60 text-[11px] font-semibold text-pink-700 mb-4">
            <Sparkles className="w-3 h-3" /> 카드뉴스 자동 — 16장 샘플
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-pink-900 leading-tight tracking-tight">
            🎨 인스타 카드뉴스
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
              16장 자동 제작
            </span>
          </h1>
          <p className="mt-4 text-sm text-pink-900/70 leading-relaxed px-2">
            사장님 메뉴·시술 정보 카톡 1장이면
            <br />
            <b className="text-pink-700">가격표 · 컬 비교 · 메디핑크</b> 3개 세트 16장이
            <br />
            <b className="text-rose-600">사장님 톤 그대로</b> 만들어집니다.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 max-w-md mx-auto">
            {[
              { Icon: Hash, k: "총", v: "16장" },
              { Icon: Clock, k: "소요", v: "24h" },
              { Icon: Heart, k: "사장 작업", v: "5분" },
            ].map(({ Icon, k, v }) => (
              <div
                key={k}
                className="bg-white/70 backdrop-blur rounded-2xl py-3 border border-pink-100/70 shadow-sm"
              >
                <Icon className="w-3.5 h-3.5 text-pink-500 mx-auto mb-1" />
                <div className="text-[10px] text-pink-700/60 font-medium">{k}</div>
                <div className="text-sm font-bold text-pink-700">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value strip */}
      <section className="px-5 pb-10">
        <div className="max-w-2xl mx-auto rounded-3xl p-5 bg-white border border-pink-100/70 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-bold text-pink-700">왜 자동 제작이 필요한가요?</span>
          </div>
          <ul className="space-y-2 text-[13px] text-foreground/80 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-pink-500 mt-0.5">•</span>
              <span>
                디자이너 외주 = 카드 1장당 평균 <b>3~5만</b> × 16장 = 48~80만 + 2주
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-pink-500 mt-0.5">•</span>
              <span>
                직접 디자인 = 캔바·미리캔버스 16장 손으로 <b>꼬박 2~3일</b>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-pink-500 mt-0.5">•</span>
              <span>
                자동 제작 = 사장님 정보 1장 + <b>24시간</b> 안에 16장 + 사장님 톤·핑크 일관
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* 3 Sets */}
      {SETS.map((set) => {
        const ac = accentMap[set.accent];
        return (
          <section key={set.id} className="px-5 pb-14">
            {/* Set header */}
            <div className="max-w-2xl mx-auto mb-5 flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-2xl ${ac.chipBg} border ${ac.chipBorder} flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}
              >
                {set.chip}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[10px] font-bold tracking-wider ${ac.chipText}`}>
                  SET {set.num}
                </div>
                <h2 className="text-xl font-black text-foreground mt-0.5 leading-tight">
                  {set.title}
                </h2>
                <p className="text-[12px] text-foreground/60 mt-1 leading-relaxed">
                  {set.subtitle}
                </p>
              </div>
              <span
                className={`text-[11px] font-bold ${ac.chipText} ${ac.chipBg} px-2 py-1 rounded-lg border ${ac.chipBorder} whitespace-nowrap`}
              >
                {set.cards.length}장
              </span>
            </div>

            {/* Cards vertical stack */}
            <div className="max-w-md mx-auto space-y-5">
              {set.cards.map((card, idx) => (
                <figure
                  key={card.src}
                  className={`bg-white rounded-3xl overflow-hidden border ${ac.border} shadow-md ring-1 ${ac.ring}`}
                >
                  <div className="aspect-[4/5] bg-gradient-to-br from-pink-50 to-rose-50 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.src}
                      alt={card.alt}
                      className="w-full h-full object-cover"
                      loading={idx < 2 ? "eager" : "lazy"}
                    />
                    <div className="absolute top-2 right-2 text-[10px] font-bold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {idx + 1} / {set.cards.length}
                    </div>
                  </div>
                  <figcaption className="px-4 py-3 text-[12px] text-foreground/70 leading-relaxed">
                    {card.alt}
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Bonus (Set 1 only) */}
            {set.bonus && (
              <div className="max-w-2xl mx-auto mt-6">
                <div className="rounded-3xl border border-pink-200/60 bg-gradient-to-br from-amber-50 to-pink-50/40 p-1 shadow-sm">
                  <div className="rounded-[20px] bg-white p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-amber-700" />
                      <span className="text-[12px] font-bold text-amber-800">
                        {set.bonus.label}
                      </span>
                    </div>
                    <div className="aspect-video bg-pink-50 rounded-2xl overflow-hidden border border-pink-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={set.bonus.src}
                        alt={set.bonus.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-foreground/60 leading-relaxed">
                      샵 안 거치대·문 앞 안내판·전단지에 그대로 인쇄해서 비치
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        );
      })}

      {/* CTA */}
      <section className="px-5 pb-16">
        <div className="max-w-2xl mx-auto rounded-3xl p-6 bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wide opacity-90">
              <MessageCircle className="w-3.5 h-3.5" /> 베타 4주에 포함
            </div>
            <h3 className="text-2xl font-black mt-2 leading-tight">
              사장님 메뉴 1장 보내주시면
              <br />
              24시간 안에 16장 완성
            </h3>
            <ul className="mt-4 space-y-2 text-[13px] opacity-95">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>핑크 워터마크·톤·구두점 모두 사장님 인스타 그대로 매칭</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>가격 바뀌면 해당 카드만 수정 — 1장 5분 안에 재생성</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>인쇄·PDF·인스타 캐러셀 모두 같은 16장에서 출력</span>
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/o/report"
                className="inline-flex items-center gap-1.5 bg-white text-rose-600 font-bold text-sm px-4 py-2.5 rounded-full hover:bg-pink-50 transition"
              >
                💕 4주 베타 진단 리포트 보기 <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/o"
                className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur text-white font-semibold text-sm px-4 py-2.5 rounded-full border border-white/30 hover:bg-white/25 transition"
              >
                대시보드로
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-[11px] text-foreground/50 leading-relaxed">
          본 16장은 GPT-image 모델로 자동 생성된 샘플입니다. <br />
          사장님 정보 0건 사용 — 동네 평균치·공개 후기만 활용했어요.
        </p>
      </section>
    </div>
  );
}
