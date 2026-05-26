# 유어라인 데모 앱 — 디자인 시스템 (2026)

> 작성: 2026-05-26
> 적용 대상: `prototypes/app/` (Next.js 15 + Tailwind CSS v4 + shadcn/ui)
> 목표: 2026년 모던 모바일 앱 톤 — 사장이 "와 진짜 앱이네" 반응 유도

---

## 0. 핵심 원칙

| 원칙 | 적용 |
|---|---|
| **Mobile-first** | 핵심 UI는 모바일 (375~430px). 데스크탑은 centered narrow column |
| **Bento Grid** | 사장 대시보드 — 다양한 크기 카드 grid |
| **Soft Gradients** | 핑크·라벤더 부드러운 그라데이션 (sharp X) |
| **Glassmorphism** | 카드 frosted glass 효과 (subtle) |
| **Generous Whitespace** | Apple HIG·Material You 톤 |
| **Micro-interactions** | hover·tap·loading 부드러운 transition (Framer Motion) |
| **Korean Beauty** | 사장 워터마크 #E89BAE 베이스 + 라벤더·크림·골드 액센트 |
| **Bottom Tab Bar** | 모바일 navigation — 손님 5탭 / 사장 6탭 |

---

## 1. 레퍼런스 분석 (7개)

### 1-1. Booksy (booksy.com) — 뷰티 booking 1인 자영업
- **인사이트**: 카드 기반 시술 메뉴 + 큰 photo·rating 우선
- **채택**: 메뉴 카드 layout, 별점 표시, 후기 인용 형식

### 1-2. Vagaro (vagaro.com) — 살롱 운영 SaaS
- **인사이트**: 사장 백오피스 — 캘린더·예약·고객 DB 통합
- **채택**: 사장 대시보드의 받은 요청 inbox 패턴

### 1-3. Cal.com (cal.com) — 모던 booking
- **인사이트**: 미니멀, 깔끔한 시간 슬롯 선택, 다크 모드
- **채택**: 예약 페이지 시간대 선택 UX (4타임 — 11/13/15/17시)

### 1-4. Linear (linear.app) — 모던 SaaS dashboard
- **인사이트**: 키보드 단축키, 미니멀 사이드바, 모노 폰트 액센트
- **채택**: 사장 대시보드 컴팩트 layout, micro-interaction

### 1-5. Glossier app — K-beauty 톤
- **인사이트**: 핑크 그라데이션, 부드러운 셰이프, 친밀한 카피
- **채택**: 손님 view 전반 톤 — 따뜻한 핑크, 라운드 corner

### 1-6. 올리브영 app — 한국 뷰티 모바일
- **인사이트**: bottom tab bar, 큰 image card, 한국어 typography
- **채택**: navigation 패턴 (모바일), 한글 폰트 hierarchy

### 1-7. shadcn/ui demos — 컴포넌트 패턴
- **인사이트**: Radix UI 기반, Tailwind 토큰화, 접근성 우선
- **채택**: 모든 base 컴포넌트 (Button·Card·Dialog·Sheet·Form 등)

---

## 2. 컬러 시스템

### 2-1. Primary Palette (사장 워터마크 베이스)

```css
/* Pink (브랜드) */
--pink-50:  #FFF5F8;  /* 배경 */
--pink-100: #FFE4EC;  /* 카드 fill */
--pink-200: #FFC8D6;  /* hover */
--pink-300: #FF9FB5;  /* secondary */
--pink-400: #E89BAE;  /* 사장 워터마크 — main accent */
--pink-500: #D67B95;  /* primary action */
--pink-600: #B85A75;  /* hover primary */
--pink-700: #8B3F58;  /* heading dark */

/* Lavender (메디핑크·세컨더리) */
--lavender-100: #F5E5F2;
--lavender-300: #DCC9DD;
--lavender-500: #9B7BC9;
--lavender-700: #6B4C8A;

/* Cream (가격표·미니멀) */
--cream-100: #FFFAF5;
--cream-300: #F5EFE3;
--cream-500: #C9B89A;
--cream-700: #6B5544;

/* Neutral (텍스트·보더) */
--gray-50:  #FAFAFA;
--gray-100: #F5F5F5;
--gray-300: #D4D4D4;
--gray-500: #737373;
--gray-700: #404040;
--gray-900: #171717;

/* Semantic */
--success: #10B981;
--warning: #F59E0B;
--danger:  #EF4444;
--info:    #3B82F6;

/* Gold accent (premium·VIP) */
--gold-400: #E5C77F;
--gold-600: #C9A960;
```

### 2-2. Gradient Library

```css
/* 손님 view 배경 (soft) */
--gradient-customer: linear-gradient(180deg, #FFF5F8 0%, #FFFFFF 100%);

/* 사장 view 배경 (clean) */
--gradient-owner: linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%);

/* AI 시뮬 페이지 (hero) */
--gradient-sim: linear-gradient(135deg, #FFE4EC 0%, #DCC9DD 50%, #FFF5F8 100%);

/* 메디핑크 캠페인 */
--gradient-medipink: linear-gradient(135deg, #DCC9DD 0%, #F5DCEA 100%);

/* VIP·프리미엄 */
--gradient-vip: linear-gradient(135deg, #FFF5E6 0%, #E5C77F 100%);
```

### 2-3. Dark Mode (옵션)

```css
[data-theme="dark"] {
  --bg: #0A0A0A;
  --surface: #1A1A1A;
  --text: #FAFAFA;
  --pink-400: #FF9FB5;  /* 더 밝게 */
}
```

---

## 3. 타이포그래피

### 3-1. Font Stack

```css
/* 본문 — 한글·영문 통합 */
--font-sans: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Display·헤딩 — 더 sharp */
--font-display: 'Gmarket Sans', 'Pretendard Variable', sans-serif;

/* 손글씨·캘리그래피 (브랜드명) */
--font-script: 'Cafe24 단정해', cursive;

/* 영문 액센트 (인용·날짜) */
--font-serif: 'Cormorant Garamond', 'Times New Roman', serif;

/* Monospace (코드·숫자) */
--font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
```

### 3-2. Scale (Mobile-first, rem)

```css
--text-xs:   0.75rem;   /* 12 — caption */
--text-sm:   0.875rem;  /* 14 — body small */
--text-base: 1rem;      /* 16 — body */
--text-lg:   1.125rem;  /* 18 — body large */
--text-xl:   1.25rem;   /* 20 — h4 */
--text-2xl:  1.5rem;    /* 24 — h3 */
--text-3xl:  1.875rem;  /* 30 — h2 */
--text-4xl:  2.25rem;   /* 36 — h1 (모바일) */
--text-5xl:  3rem;      /* 48 — hero (데스크탑) */
--text-6xl:  3.75rem;   /* 60 — hero display */
```

### 3-3. Weight·Line-height

```css
font-weight: 400 | 500 | 600 | 700;
line-height: 1.2 (heading) | 1.5 (body) | 1.7 (long-form);
```

### 3-4. 사용 예시

| Role | Font | Weight | Size | 예 |
|---|---|---|---|---|
| Hero (랜딩) | display | 700 | 3rem | "유어라인" |
| Page Title | display | 700 | 1.875rem | "AI 시뮬" |
| Section Heading | sans | 600 | 1.25rem | "오늘 한눈에" |
| Body | sans | 400 | 1rem | 일반 텍스트 |
| Caption | sans | 400 | 0.75rem | 디스클레이머 |
| Metric Number | mono | 700 | 2.25rem | "1,517만" |
| Brand Script | script | 400 | 1.5rem | "U're Line" |

---

## 4. 컴포넌트 라이브러리

### 4-1. shadcn/ui Base (채택)

```
button, card, dialog, sheet, drawer, tabs, badge, alert,
input, textarea, select, toggle, switch, slider, calendar,
toast, sonner, popover, dropdown-menu, accordion, avatar
```

### 4-2. 커스텀 컴포넌트 (디자인 시스템 확장)

```
<BentoGrid>          — 사장 대시보드 카드 grid
<BentoCard>          — 카드 (size: sm/md/lg/xl, variant: pink/lavender/gold)
<MetricCard>         — KPI 표시 (label·value·delta·trend)
<GlassCard>          — frosted glass 카드
<BottomTabBar>       — 모바일 navigation (5~6 탭)
<HeroSection>        — 랜딩 hero (그라데이션 배경 + 큰 헤드)
<ChatBubble>         — 챗봇 대화 UI
<SimResultCard>      — AI 시뮬 4분할 비교
<CouponCard>         — 쿠폰 (티켓 모양, dashed border)
<ReservationSlot>    — 4타임 시간대 선택
<ReviewCard>         — 후기·답글 시안
<AlimtokTemplate>    — 알림톡 12종 카드
<TierBadge>          — VIP / 단골 / Regular / 신규
<ChurnRiskBadge>     — 이탈 위험 점수 시각화
```

### 4-3. 컴포넌트 디자인 패턴 (예시)

**MetricCard** (사장 대시보드 핵심)
```tsx
<MetricCard
  label="예약"
  value={4}
  delta="+1 vs 어제"
  trend="up"
  icon={<Calendar />}
  variant="pink"
/>
```

**BentoCard** (다양한 사이즈)
```tsx
<BentoGrid>
  <BentoCard size="lg" gradient="pink">
    {/* 큰 카드: 이탈 위험 TOP 5 */}
  </BentoCard>
  <BentoCard size="md">
    {/* 중간 카드: 단골 자산 */}
  </BentoCard>
  <BentoCard size="sm">
    {/* 작은 카드: AI 시뮬 누적 */}
  </BentoCard>
</BentoGrid>
```

---

## 5. Layout·Spacing

### 5-1. Spacing Scale (Tailwind 기본)

```
0, 0.5(2px), 1(4), 1.5(6), 2(8), 3(12), 4(16), 6(24), 8(32),
12(48), 16(64), 24(96), 32(128)
```

### 5-2. 모바일 레이아웃 (375~430px)

```
┌──────────────────────────────────┐
│  Status bar (시스템)              │
├──────────────────────────────────┤
│  Top App Bar (60px)               │
│  [← / 메뉴]  타이틀  [⋯ / 설정]    │
├──────────────────────────────────┤
│                                    │
│  Main content                      │
│  padding: 16~24px                  │
│  max-w: 375~430px                  │
│                                    │
│                                    │
├──────────────────────────────────┤
│  Bottom Tab Bar (64px)             │
│  [홈][시뮬][챗봇][예약][메뉴]      │
└──────────────────────────────────┘
```

### 5-3. 데스크탑 레이아웃 (>768px)

```
┌────────────────────────────────────────────────┐
│  Top Nav (64px) — 가운데 좁은 logo + 우측 user  │
├──────────┬──────────────────────────────────┤
│ Sidebar  │  Main content (centered narrow)        │
│ 240px    │  max-w: 720px                          │
│          │                                          │
│          │                                          │
└──────────┴──────────────────────────────────┘
```

### 5-4. 사장 view (Bento)

```
모바일:                  데스크탑:
[큰 카드      ]          [큰  ][중 ]
[중] [중]                [중  ][작][작]
[작][작][작]              [큰 wide          ]
```

---

## 6. 애니메이션·인터랙션

### 6-1. Framer Motion 패턴

```tsx
// 페이지 진입
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: "easeOut" }}

// 카드 hover
whileHover={{ scale: 1.02, y: -4 }}
whileTap={{ scale: 0.98 }}

// AI 시뮬 결과 reveal
staggerChildren: 0.1  // 4장 순차 등장

// Bottom tab 전환
layoutId="active-tab"  // 부드러운 indicator 이동
```

### 6-2. Loading States

- Skeleton (회색 박스 shimmer)
- Spinner (핑크 톤)
- Progress bar (이미지 생성 진행)

### 6-3. Toast Notifications

```
✓ 예약 완료!         (success — 핑크 + 체크 아이콘)
⚠ 셀카 다시 보내주세요  (warning)
✕ 시뮬 실패            (error)
```

---

## 7. 접근성 (Accessibility)

- **컬러 contrast**: WCAG AA 이상 (4.5:1 본문, 3:1 큰 글씨)
- **키보드 navigation**: 모든 액션 keyboard 접근 가능
- **Screen reader**: aria-label·role 모든 인터랙티브 요소
- **Focus indicator**: 핑크 outline (focus-visible)
- **Reduced motion**: prefers-reduced-motion 시 애니메이션 최소화

---

## 8. 반응형 Breakpoints

```
sm:  640px   (large phone)
md:  768px   (tablet)
lg:  1024px  (small desktop)
xl:  1280px  (desktop)
2xl: 1536px  (large desktop)
```

전략:
- **모바일 우선** (375~430px 기준 설계)
- 768px+ 에서 사이드바·multi-column 활성
- 1024px+ 에서 wide layout (centered max-width)

---

## 9. 페이지별 디자인 톤

### 9-1. 손님 view (5 페이지)

| 페이지 | 톤 | 특징 |
|---|---|---|
| 🏠 홈 | Hero + 카드 grid | 큰 그라데이션 hero + 5 메뉴 카드 |
| ✨ AI 시뮬 | 최고 화려 | 그라데이션 배경 + 카메라 UI + 결과 reveal 애니메이션 |
| 💬 챗봇 | iMessage 톤 | 대화 bubble + 빠른 답변 chip |
| 📅 예약 | Cal.com 톤 | 캘린더 + 4타임 슬롯 |
| 🎁 쿠폰 | Apple Wallet 톤 | 티켓 모양 카드 + dashed border |
| 🎨 메뉴 | 갤러리 | 16장 swipe carousel + zoom |

### 9-2. 사장 view (6 페이지)

| 페이지 | 톤 | 특징 |
|---|---|---|
| 📊 대시보드 | Bento grid | 다양한 크기 카드 + 그래프 |
| 📥 받은 요청 | iMessage inbox | 시간순 카드 리스트 + 액션 |
| 📸 콘텐츠 | 편집기 | 사진 업로드 + 미리보기 + 게시 |
| 📢 알림톡 | 매트릭스 | 12종 카드 + 테스트 발송 |
| 💌 답글 | 시안 카드 | 후기 + 답글 시안 + 게시 1탭 |
| 📅 일간 1줄 | 미니멀 | 큰 텍스트 1줄 + 복사 버튼 |

---

## 10. 디자인 토큰 (CSS variables)

```css
:root {
  /* Border Radius */
  --radius-sm:   0.5rem;   /* 8px */
  --radius-md:   0.75rem;  /* 12px */
  --radius-lg:   1rem;     /* 16px */
  --radius-xl:   1.5rem;   /* 24px */
  --radius-2xl:  2rem;     /* 32px */
  --radius-full: 9999px;

  /* Shadow */
  --shadow-sm:  0 1px 2px rgba(232, 155, 174, 0.05);
  --shadow-md:  0 4px 12px rgba(232, 155, 174, 0.10);
  --shadow-lg:  0 8px 24px rgba(232, 155, 174, 0.15);
  --shadow-xl:  0 16px 40px rgba(232, 155, 174, 0.20);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

---

## 11. 외부 폰트·아이콘 source

- **Pretendard**: https://github.com/orioncactus/pretendard (무료)
- **G마켓 산스**: https://corp.gmarket.com/fonts/ (무료)
- **Cafe24 단정해**: https://fonts.cafe24.com (무료)
- **Cormorant Garamond**: Google Fonts (무료)
- **Lucide Icons**: https://lucide.dev (shadcn 기본)
- **Phosphor Icons** (옵션): https://phosphoricons.com

---

## 12. 다음 단계 (Phase 2~6)

1. Phase 2: shadcn/ui init + 핵심 컴포넌트 셋업
2. Phase 3: 손님 view 5 페이지 (mobile-first)
3. Phase 4: 사장 view 6 페이지 (Bento grid)
4. Phase 5: 애니메이션 + 모바일 navigation
5. Phase 6: Vercel 배포

→ 본 문서는 **모든 페이지 구현 시 참조**.
