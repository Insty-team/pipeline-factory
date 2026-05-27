import {
  AlertTriangle,
  ArrowRight,
  Award,
  Calendar,
  Camera,
  CheckCircle2,
  CircleHelp,
  Gift,
  Heart,
  Image as ImageIcon,
  LayoutDashboard,
  MessageCircle,
  Palette,
  Phone,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

export const dynamic = "force-static";

const STRENGTHS = [
  { id: "S1", label: "인스타 운영", proof: "283건 누적 · 팔로워 777 · 주 1~3회", icon: Camera },
  { id: "S2", label: "블로그 운영", proof: "월 2건 꾸준 (네이버)", icon: ImageIcon },
  { id: "S3", label: "시술 실력", proof: "별점 4.93 · 무쌍 펌 키워드 8+", icon: Star },
  { id: "S4", label: "회원권 운영", proof: "단골 lock-in 인프라 구축", icon: Wallet },
  { id: "S5", label: "5년 답글 운영", proof: "2020~25.08 30+ 샘플 · 사장 톤 명확", icon: MessageCircle },
  { id: "S6", label: "브랜드 시각 일관성", proof: '"U\'re Line" 워터마크 100%', icon: Palette },
  { id: "S7", label: "B2B 네트워크", proof: "뷰티샵·아카데미 좋아요 多", icon: Users },
  { id: "S8", label: "4타임 운영", proof: "오전 11 / 오후 1·3·5시 1:1 단독", icon: Calendar },
];

const WEAKNESSES = [
  { id: "W1", label: "후기 답글 8개월 중단", data: "25.8.10 이후 0건", loss: "단골 이탈 + 신규 후기 ↓", critical: true },
  { id: "W2", label: "4주 재방문 알림 X", data: "단골 cycle 28일 추정", loss: "단골 cycle 깨짐" },
  { id: "W3", label: "카카오 자동응답 X", data: "시술 중 DM 놓침", loss: "신규 예약 손실" },
  { id: "W4", label: "통합 리포트 X", data: "데이터 의사결정 부재", loss: "—" },
  { id: "W5", label: "단골 LTV 분석 X", data: "회원권 DB 있지만 활용 X", loss: "이탈 위험 단골 발견 못 함" },
  { id: "W6", label: "블로그 SEO 태그 89% 누락", data: "28건 중 24건 태그 0~1개", loss: "검색 노출 추정 -3~8건/월", critical: true },
  { id: "W7", label: "인스타·블로그 비동기", data: "콘텐츠 노동 중복", loss: "시간 ↓" },
  { id: "W8", label: "메디핑크 push vs 인지 gap", data: "블로그 6건 push, 후기 키워드 X", loss: "신메뉴 매출 정체", critical: true },
];

const MODULES = [
  { icon: "📸", name: "콘텐츠 자동", value: "사진 1장 카톡 → 5초 만에 캡션·해시태그·블로그 700자 자동", load: "사진 1장 (시술 후 늘 찍던 거)" },
  { icon: "💬", name: "챗봇 응답", value: "시술 중 카톡 DM 70% 자동 응대 (가격·디자인·알러지 30Q&A)", load: "0 (시술 집중)" },
  { icon: "✨", name: "AI 시뮬 ⭐", value: "손님 셀카 → J·C·D컬 비교 카드 5초 자동 회신", load: "0 (자동)" },
  { icon: "📢", name: "알림톡 발송", value: "예약 확정·1일 전·당일·후기·재방문 12종 자동", load: "카톡 채널 1회 셋업" },
  { icon: "💌", name: "답글 자동", value: "신규 후기 → 사장님 톤으로 답글 자동 + 8개월 백필 10건", load: "1주차 검수 1탭/일" },
  { icon: "🎨", name: "카드뉴스", value: "가격표·컬 비교·메디핑크 16장 영구 자산", load: "검수 5분" },
  { icon: "💎", name: "단골 분석", value: "이탈 위험 단골 식별 + 4주 재방문 알림 트리거", load: "0" },
  { icon: "📊", name: "대시보드", value: "매일 모바일 1탭 KPI 확인 (오늘·이탈 위험·매출 기여)", load: "0 (URL 즐겨찾기)" },
  { icon: "📅", name: "일간 1줄 카톡", value: "매일 8시 어제 1줄 요약 받기", load: "0 (받기만)" },
];

const KPIS = [
  { name: "콘텐츠 작성 시간", before: "6h/주", after: "5분/주", delta: "-99%" },
  { name: "후기 답글 작성", before: "0건 (8개월)", after: "30건+ 자동", delta: "+30+" },
  { name: "노쇼", before: "월 ~10건", after: "월 ~5~7건", delta: "-30~50%" },
  { name: "4주 재방문률", before: "비측정", after: "+15~30%", delta: "+15~30%" },
  { name: "DM 응답 시간", before: "시술 중 30분~", after: "챗봇 5초 (70%)", delta: "-99%" },
  { name: "메디핑크 신규", before: "월 1~2건", after: "월 3~5건", delta: "+1~3건" },
];

const REVENUE = [
  { name: "AI 시뮬 → 신규 예약", value: "+15~30만" },
  { name: "챗봇 → 시술 중 놓침 회수", value: "+25~50만" },
  { name: "알림톡 → 노쇼 감소·재방문", value: "+30~80만" },
  { name: "답글 자동 → 단골 회복", value: "+20~50만" },
  { name: "카드뉴스 → 메디핑크 인지", value: "+10~20만" },
];

const COMMISSION = [
  { module: "✨ AI 시뮬 → 신규 예약", amount: "발생 매출의 7% (1회)" },
  { module: "💬 챗봇 → 시술 중 놓침 회수", amount: "회수 매출의 7% (1회)" },
  { module: "📢 알림톡 → 노쇼 회수", amount: "회수 매출의 10%" },
  { module: "💎 단골 회복 (이탈→재방문)", amount: "향후 3개월 매출의 5%" },
  { module: "🎨 메디핑크 신규 시술", amount: "발생 매출의 7%" },
];

const COMMISSION_FREE = ["💌 답글 자동", "📸 콘텐츠 자동", "📊 대시보드", "📅 일간 1줄"];

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-fuchsia-50/40">
      {/* Hero */}
      <section className="relative px-5 pt-10 pb-12 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,114,182,0.18),_transparent_70%)] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-pink-200/60 text-[11px] font-semibold text-pink-700 mb-4">
            <Heart className="w-3 h-3" /> 유어라인 사장님께 드리는 4주 베타 진단
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-pink-900 leading-tight tracking-tight">
            💕 유어라인
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
              4주 베타 진단
            </span>
          </h1>
          <p className="mt-4 text-sm text-pink-900/70 leading-relaxed px-2">
            7년차 이수·사당 1인 단독시술 속눈썹 전문샵 <b className="text-pink-700">유어라인</b>을
            며칠간 깊이 살펴봤습니다.
            <br />
            <span className="text-pink-600 font-semibold">
              별점 4.93 · 후기 120건 · 인스타 283건 · 블로그 28건
            </span>{" "}
            의 운영을 보면서 사장님의 정성과 실력에 감탄했어요. ♡
          </p>
          <p className="mt-3 text-sm text-pink-900/70 leading-relaxed">
            데이터로 보이는 <b className="text-rose-600">작은 새는 곳들</b>과
            <br />
            <b className="text-pink-600">4주 베타 제안</b>을 정리했습니다. 5분만 읽어주세요.
          </p>

          <div className="mt-6 grid grid-cols-4 gap-2 max-w-md mx-auto">
            {[
              { k: "별점", v: "4.93" },
              { k: "후기", v: "120건" },
              { k: "인스타", v: "283건" },
              { k: "블로그", v: "28건" },
            ].map((s) => (
              <div
                key={s.k}
                className="bg-white/70 backdrop-blur rounded-2xl py-3 border border-pink-100/70 shadow-sm"
              >
                <div className="text-[10px] text-pink-700/60 font-medium">{s.k}</div>
                <div className="text-base font-bold text-pink-700">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. 강점 */}
      <section className="px-5 pb-12">
        <SectionHeader
          num="1"
          title="사장님 강점"
          subtitle="이미 잘 하시는 것 — 자산이 두텁습니다"
          icon={Award}
          accent="emerald"
        />
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-3 mt-5">
          {STRENGTHS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-4 border border-emerald-100/70 shadow-sm flex gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {s.id}
                    </span>
                    <span className="text-sm font-bold text-foreground">{s.label}</span>
                  </div>
                  <div className="text-[11px] text-foreground/60 mt-1 leading-relaxed">
                    ✅ {s.proof}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-5 max-w-2xl mx-auto text-center text-sm font-semibold text-emerald-700 bg-emerald-50/70 rounded-xl px-4 py-3">
          → 7년 단골 누적 매출 자산 <span className="text-emerald-800">추정 1,500만원+</span>
        </p>
      </section>

      {/* 2. 약점 */}
      <section className="px-5 pb-12">
        <SectionHeader
          num="2"
          title="작은 새는 곳들"
          subtitle="데이터로 본 약점 — 4주 베타로 모두 채울 수 있어요"
          icon={AlertTriangle}
          accent="rose"
        />
        <div className="max-w-3xl mx-auto space-y-2 mt-5">
          {WEAKNESSES.map((w) => (
            <div
              key={w.id}
              className={`bg-white rounded-2xl p-4 border shadow-sm ${
                w.critical ? "border-rose-200/80 bg-rose-50/30" : "border-pink-100/60"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    w.critical
                      ? "text-rose-700 bg-rose-100"
                      : "text-pink-700 bg-pink-50"
                  }`}
                >
                  {w.id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    {w.critical && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                    {w.label}
                  </div>
                  <div className="text-[11px] text-foreground/60 mt-1">
                    📊 {w.data}
                  </div>
                  <div className="text-[11px] text-rose-600/90 mt-0.5 font-medium">
                    📉 추정 손실: {w.loss}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 풀패키지 — 9 모듈 */}
      <section className="px-5 pb-12">
        <SectionHeader
          num="3"
          title="풀패키지 적용 시"
          subtitle="9 모듈 — 사장님 노동 ↓ + 새는 곳 막기"
          icon={Sparkles}
          accent="pink"
        />
        <div className="max-w-3xl mx-auto mt-5 space-y-2">
          {MODULES.map((m) => (
            <div
              key={m.name}
              className="bg-white rounded-2xl p-4 border border-pink-100/60 shadow-sm flex items-start gap-3"
            >
              <span className="text-2xl flex-shrink-0">{m.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground">{m.name}</div>
                <div className="text-[12px] text-foreground/70 mt-1 leading-relaxed">
                  💡 {m.value}
                </div>
                <div className="text-[11px] text-pink-600 mt-1 font-medium">
                  ⚡ 사장님 추가 노동: {m.load}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-2xl mx-auto text-center text-base font-bold text-pink-700 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 rounded-2xl px-4 py-4 border border-pink-100">
          총 사장님 추가 노동: <span className="text-pink-600">약 30초/일 카톡 1줄</span>
        </p>
      </section>

      {/* 4. 4주 베타 KPI */}
      <section className="px-5 pb-12">
        <SectionHeader
          num="4"
          title="4주 베타 추정 효과"
          subtitle="현재 vs 베타 후 KPI 비교"
          icon={TrendingUp}
          accent="fuchsia"
        />
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-3 mt-5">
          {KPIS.map((k) => (
            <div
              key={k.name}
              className="bg-white rounded-2xl p-4 border border-fuchsia-100/60 shadow-sm"
            >
              <div className="text-[11px] font-bold text-foreground/60 mb-2">{k.name}</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-foreground/50">현재</div>
                  <div className="text-sm font-medium text-foreground/70 line-through">
                    {k.before}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-fuchsia-400" />
                <div>
                  <div className="text-[10px] text-fuchsia-600 font-semibold">베타 후</div>
                  <div className="text-sm font-bold text-fuchsia-700">{k.after}</div>
                </div>
              </div>
              <div className="mt-2 text-center text-[11px] font-bold text-fuchsia-600 bg-fuchsia-50/60 rounded-md py-1">
                {k.delta}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 매출 기여 */}
      <section className="px-5 pb-12">
        <SectionHeader
          num="5"
          title="누적 매출 기여 (4주 추정)"
          subtitle="모듈별 추정 효과 합산"
          icon={Wallet}
          accent="emerald"
        />
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-5 border border-emerald-100/70 shadow-sm mt-5">
          <div className="space-y-2.5">
            {REVENUE.map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between py-2 border-b border-emerald-50 last:border-0"
              >
                <span className="text-[13px] text-foreground/80">{r.name}</span>
                <span className="text-sm font-bold text-emerald-700 tabular-nums">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t-2 border-emerald-100 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">추정 합계 (4주)</span>
            <span className="text-2xl font-black text-emerald-600 tabular-nums">+100~230만</span>
          </div>
        </div>
        <p className="mt-3 max-w-2xl mx-auto text-center text-[11px] text-foreground/60 px-2">
          → 4주 후 사장님과 같이 측정값 확인 → <b>실제 발생·회수된 매출에만 commission 정산</b>
        </p>
      </section>

      {/* 6. USP — AI 시뮬 */}
      <section className="px-5 pb-12">
        <div className="max-w-2xl mx-auto rounded-3xl p-6 bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wide opacity-90">
              <Sparkles className="w-3.5 h-3.5" /> UNIQUE SELLING POINT
            </div>
            <h3 className="text-2xl font-black mt-2 leading-tight">
              ✨ AI 시술 시뮬레이션
            </h3>
            <p className="text-sm mt-2 leading-relaxed opacity-95">
              동네 경쟁샵·체인 모두 미보유. 손님 카톡 셀카 →
              <br />
              <b>J·C·D컬 시뮬 5~10초 자동 회신</b>.
            </p>
            <div className="mt-4 text-[12px] bg-white/15 rounded-xl px-3 py-2.5 backdrop-blur">
              <div className="opacity-90">신규 손님 첫 시술 frustration ↓</div>
              <div className="opacity-90">사장님 컨설팅 시간 30분 → 10분</div>
            </div>
            <div className="mt-3 text-sm italic font-semibold">
              💬 "AI로 미리 보여드린대요!" — 입소문 핵심 hook
            </div>
          </div>
        </div>
      </section>

      {/* 7. 4주 베타 운영 */}
      <section className="px-5 pb-12">
        <SectionHeader
          num="6"
          title="4주 베타 운영 방식"
          subtitle="사장님 입장에서 본 노동 — 총 약 2~3시간"
          icon={Calendar}
          accent="pink"
        />
        <div className="max-w-2xl mx-auto mt-5 space-y-2">
          {[
            { when: "D-Day 미팅", task: "30분 — 카카오 채널 개설 5분 + 회원권 데이터 카톡 1장 + 카드뉴스 검수 5분 + 합의" },
            { when: "매일", task: "30초 — 카톡 1줄 (\"어제 노쇼 1, 신규 2\") + 일간 1줄 대시보드 1탭 (옵션)" },
            { when: "매주 (선택)", task: "3분 — 주간 5줄 리포트 보기 + 답장 1줄 (피드백)" },
            { when: "4주 종료", task: "1시간 — 결과 리포트 검수 + 발생·회수 매출 확인 후 commission 정산" },
          ].map((s) => (
            <div
              key={s.when}
              className="bg-white rounded-2xl p-4 border border-pink-100/60 shadow-sm"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded whitespace-nowrap">
                  {s.when}
                </span>
                <span className="text-sm text-foreground/80 leading-relaxed">{s.task}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Commission */}
      <section className="px-5 pb-12">
        <SectionHeader
          num="7"
          title="Commission 모델"
          subtitle="베타 4주 무료 · 유료 전환 의무 없음 · 4주 후 사장님이 결정"
          icon={Gift}
          accent="rose"
        />
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-5 border border-rose-100/70 shadow-sm mt-5">
          <div className="text-center text-sm font-bold text-rose-700 mb-4 bg-rose-50/60 rounded-xl py-2">
            💝 매출 늘어난 만큼만, 그것도 아주 일부만 받습니다
          </div>
          <div className="space-y-2">
            {COMMISSION.map((c) => (
              <div
                key={c.module}
                className="flex items-center justify-between gap-3 py-2 border-b border-rose-50 last:border-0"
              >
                <span className="text-[13px] text-foreground/80">{c.module}</span>
                <span className="text-sm font-semibold text-rose-700 whitespace-nowrap">
                  {c.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 px-4 py-3">
            <div className="text-[12px] font-bold text-emerald-700 mb-1.5">
              🎁 패키지 가입 시 무료 — commission 0
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMISSION_FREE.map((m) => (
                <span
                  key={m}
                  className="text-[11px] font-medium text-emerald-700 bg-white/70 border border-emerald-100 rounded-full px-2 py-0.5"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-rose-100 space-y-2">
            <div className="rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 px-4 py-3 text-center">
              <div className="text-[13px] font-bold text-rose-700">
                🌸 베타 4주 동안 사장님 부담 0원
              </div>
              <div className="text-[11px] text-rose-700/80 mt-0.5 leading-relaxed">
                도구·운영·인프라 모두 저희가 제공합니다
              </div>
            </div>
            <div className="rounded-xl bg-emerald-50/70 border border-emerald-100 px-4 py-3 text-center">
              <div className="text-[13px] font-bold text-emerald-700">
                📌 베타 결과 적자면 저희는 돈을 받지 않습니다
              </div>
              <div className="text-[11px] text-emerald-700/80 mt-0.5 leading-relaxed">
                실제로 매출이 늘었을 때만 commission. 마이너스면 0원.
              </div>
            </div>
            <div className="rounded-xl bg-indigo-50/70 border border-indigo-100 px-4 py-3 text-center">
              <div className="text-[13px] font-bold text-indigo-700">
                💙 4주 끝나고 유료 전환은 사장님 선택이에요
              </div>
              <div className="text-[11px] text-indigo-700/80 mt-0.5 leading-relaxed">
                의무 없음. 효과 충분히 느끼셨다 싶을 때만 commission 정산을 시작합니다.
                <br />
                마음 안 드시면 그냥 4주로 마무리해도 부담 없어요. ♡
              </div>
            </div>
            <div className="text-[11px] text-foreground/60 text-center pt-1 leading-relaxed">
              🤝 4주 끝나면 사장님과 함께 결과 보고 결정 — 강제·자동 전환 없습니다
              <br />
              <span className="text-foreground/50">
                (단골 회복 5%는 재방문 후 3개월 누적 매출 기준)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. 데모 시연 */}
      <section className="px-5 pb-12">
        <SectionHeader
          num="8"
          title="데모 시연 가능"
          subtitle="DM 답장 시 즉시 시연 — 사장님 정보 0건 사용"
          icon={LayoutDashboard}
          accent="fuchsia"
        />
        <div className="max-w-2xl mx-auto mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { i: "✨", n: "AI 시뮬" },
            { i: "📸", n: "콘텐츠 자동" },
            { i: "💬", n: "챗봇" },
            { i: "🎨", n: "카드뉴스" },
            { i: "📊", n: "대시보드" },
            { i: "📅", n: "일간 1줄" },
          ].map((d) => (
            <div
              key={d.n}
              className="bg-white rounded-2xl py-4 border border-fuchsia-100/60 shadow-sm text-center"
            >
              <div className="text-2xl">{d.i}</div>
              <div className="text-xs font-semibold text-foreground/80 mt-1">{d.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. CTA */}
      <section className="px-5 pb-12">
        <SectionHeader
          num="9"
          title="시작하는 법"
          subtitle="이 진단에 답장 1줄 부탁드려요"
          icon={Send}
          accent="pink"
        />
        <div className="max-w-2xl mx-auto mt-5 space-y-2.5">
          <CTACard
            color="emerald"
            emoji="🟢"
            title="관심 있어요"
            desc="1주 안에 30분 미팅 — 영상통화·전화·방문 무엇이든"
          />
          <CTACard
            color="amber"
            emoji="🟡"
            title="좀 더 생각해볼게요"
            desc="1개월 뒤 다시 연락드릴게요. 부담 없으세요♡"
          />
          <CTACard
            color="rose"
            emoji="🔴"
            title="지금은 아니에요"
            desc="사장님과 비슷한 1인샵 사장님 1분만 소개 부탁드려요"
          />
        </div>
        <div className="max-w-2xl mx-auto mt-5 bg-white rounded-2xl p-4 border border-pink-100/60 shadow-sm flex items-start gap-3">
          <Phone className="w-4 h-4 text-pink-600 mt-0.5" />
          <div className="text-[12px] text-foreground/80 leading-relaxed">
            답장이 어려우시면 인스타 DM <b>@ure.line</b> 또는 카톡 채널 그대로 부탁드려요!
          </div>
        </div>
      </section>

      {/* 부록 */}
      <section className="px-5 pb-16">
        <details className="max-w-2xl mx-auto bg-white/60 backdrop-blur rounded-2xl p-4 border border-pink-100/40">
          <summary className="text-xs font-bold text-pink-700/80 cursor-pointer flex items-center gap-2">
            <CircleHelp className="w-3.5 h-3.5" /> 부록 — 데이터 출처
          </summary>
          <div className="mt-3 space-y-1.5 text-[11px] text-foreground/70 leading-relaxed">
            <div>• 네이버 후기 65건 + 답글 30+ — 네이버 플레이스 공개 (2026-05-03)</div>
            <div>• 블로그 28건 크롤링 — blog.naver.com/uareline (2026-05-03)</div>
            <div>• 인스타 31장 vision 분석 — instagram.com/ure.line 공개 (2026-05-03)</div>
            <div>• 메뉴 11종 + 가격 — 위 자료에서 추출 (2026-05-04)</div>
            <div>• 단골 cycle 28일 가설 — 후기 빈도 + 회원권 분포 (2026-05-21)</div>
            <div>• 매출 기여 추정 — 모듈별 전환 × 평균 가격 (2026-05-21)</div>
          </div>
          <div className="mt-3 text-[11px] text-pink-700 font-semibold bg-pink-50/60 rounded-lg px-3 py-2">
            → 사장님 정보 0건 사용. 모두 공개 데이터에서 도출. ♡
          </div>
        </details>
      </section>

      {/* Footer */}
      <footer className="px-5 pb-12 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 rounded-3xl p-6 text-white shadow-xl">
          <Heart className="w-7 h-7 mx-auto mb-3" />
          <p className="text-base font-bold leading-relaxed">
            유어라인 사장님의 7년 노력이
            <br />더 빛나게 도와드리고 싶습니다.
          </p>
          <p className="text-sm mt-3 opacity-90 font-semibold">답장 기다리겠습니다 ♡</p>
          <p className="text-[11px] mt-4 opacity-75">— 유어라인 풀패키지 팀</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({
  num,
  title,
  subtitle,
  icon: Icon,
  accent,
}: {
  num: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "emerald" | "rose" | "pink" | "fuchsia";
}) {
  const colors: Record<typeof accent, string> = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    pink: "text-pink-600 bg-pink-50 border-pink-100",
    fuchsia: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
  };
  return (
    <div className="max-w-3xl mx-auto text-center">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold ${colors[accent]}`}
      >
        <Icon className="w-3.5 h-3.5" /> {num}. {title}
      </div>
      <p className="mt-2 text-sm text-foreground/60">{subtitle}</p>
    </div>
  );
}

function CTACard({
  color,
  emoji,
  title,
  desc,
}: {
  color: "emerald" | "amber" | "rose";
  emoji: string;
  title: string;
  desc: string;
}) {
  const colors: Record<typeof color, string> = {
    emerald: "border-emerald-200/80 bg-emerald-50/40",
    amber: "border-amber-200/70 bg-amber-50/40",
    rose: "border-rose-200/70 bg-rose-50/30",
  };
  return (
    <div
      className={`rounded-2xl p-4 border shadow-sm ${colors[color]} flex items-start gap-3`}
    >
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-foreground">{title}</div>
        <div className="text-[12px] text-foreground/70 mt-1 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}
