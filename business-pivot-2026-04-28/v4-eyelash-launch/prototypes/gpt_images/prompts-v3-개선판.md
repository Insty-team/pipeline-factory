# 🎨 GPT 이미지 재생성 prompt v3 — 11장 (피드백 반영)

> **변경 요약**: v2 결과물 검토 후 메인 한글 헤드라인 폰트 톤이 "둥글둥글 카카오 이모티콘 느낌"으로 일관 출력되어, 사장 톤(7년차 1:1 단독시술 프리미엄)과 매칭되는 **에디토리얼 매거진 톤**으로 재생성 필요.
>
> **세트 1 (5장) — 채택 완료** → `final/` 폴더 이동
> **세트 2 (6장) — B-1 적용 재생성**: 모던 에디토리얼 sharp sans-serif
> **세트 3 (5장) — B-2 적용 재생성**: 프리미엄 클리닉 serif display
>
> 작성: 2026-05-10

---

## 🎯 폰트 표현 가이드 (3 카테고리)

### A. 손글씨 캘리그래피 (브랜드명·캠페인명·인용)
```
"Korean handwritten brush calligraphy with natural stroke variation,
 organic ink flow, slightly imperfect like real hand-drawn brush,
 NOT digital rounded script, NOT regular fonts"
```

### B-1. 모던 에디토리얼 디스플레이 (세트 2 메인 헤드)
```
"modern Korean editorial display sans-serif, sharp and confident,
 slightly condensed, magazine headline weight (like G마켓 산스 Bold
 or Pretendard ExtraBold), NOT rounded, NOT playful, NOT cute,
 NOT kakao emoticon-style, professional editorial typography"
```

### B-2. 프리미엄 클리닉 헤드 (세트 3 메인 헤드)
```
"elegant Korean serif display font, premium editorial weight
 (like Noto Serif KR Bold or 본명조 Bold), refined and sophisticated,
 high-end clinic magazine ad typography, NOT rounded sans-serif,
 NOT playful, NOT cute kakao-style, premium aesthetic clinic feel"
```

### C. 본문·라벨 (가격·메뉴·bullet·테이블)
```
"clean Korean sans-serif (Pretendard-like), regular/medium/bold weight"
```

---

## 🚀 사용 방법

1. 각 카드의 English prompt를 GPT-5.5에 그대로 paste
2. **세트 단위로 같은 GPT 세션** 권장 (시리즈 일관성 ↑)
3. 2~3 variation 생성 → 한국어 정확도 + 폰트 톤 둘 다 검수
4. 채택 1장 → `gpt_images/` (덮어쓰기) 또는 `final/`로 이동

---

# 🎨 세트 2 — 컬·디자인 비교 6장 (B-1 적용)

> **세트 2 시리즈 일관성**: 같은 GPT 세션에서 6장 연속 생성 권장.
> 모델은 1명으로 통일 (2A 표지 모델을 2B·2C·2D 사진에도 사용 가능하면 ↑).

---

### Card 2A — 표지 (4:5)

**저장: `2A_cover.png`**

```
Vertical Instagram cover card, 4:5 aspect ratio (1080x1350).
Soft pink-to-cream gradient background, top #FFE4EC fading to bottom #FFF5F8.

Center: large oval portrait photo of young Korean woman with soft natural
makeup, gentle smile, eyes closed showing eyelash extensions clearly.
Soft thin pink border (#E89BAE, 1px) around oval frame.

Top center — handwritten English script, Italianno-style 32pt,
dark pink (#B85A75), render exactly:
  "your line beauty guide"

Below the oval — large Korean main HEADLINE in 2-line stack, render
exactly using MODERN KOREAN EDITORIAL DISPLAY SANS-SERIF, sharp and
confident, slightly condensed, magazine headline weight (like G마켓 산스
Bold or Pretendard ExtraBold) — NOT rounded, NOT playful, NOT cute,
NOT kakao emoticon-style. Color dark gray (#5A4A4A), ~44pt, centered:
  "내 눈매에"
  "맞는 컬은?"

Bottom decoration: thin pink line + small floral ornament.
Below — small footer text in 2 lines, Pretendard Regular 13pt, #5A4A4A:
  "1:1 단독시술 · 유어라인"
  "@ure.line"

Tiny scattered heart/sparkle decorations in soft pink (3-4 small).
All Korean and English text rendered crisp and accurate.
Mood: K-beauty editorial cover, refined, premium, magazine-quality,
NOT cute or playful, professional Vogue Korea pink edition aesthetic.
```

---

### Card 2B — J컬 소개 (4:5)

**저장: `2B_jcurl.png`**

```
Vertical card, 4:5 (1080x1350), pastel pink background #FFF5F8.
Layout: top 60% photo zone (rounded-rectangle frame, 32px radius,
soft shadow) showing close-up eye with J-curl natural eyelash extensions
on a Korean woman. Bottom 40% text zone.
Pagination dots (6 dots total, dot 2 active) at bottom right.

Top right corner of photo: small circular badge (40px, pink outline
#E89BAE 2px, white fill). Inside: number "01" in modern Korean
editorial sans, sharp Bold 24pt, pink (#E89BAE).

Text zone — main Korean HEADLINE rendered exactly using MODERN KOREAN
EDITORIAL DISPLAY SANS-SERIF, sharp and confident, slightly condensed,
magazine headline weight (like G마켓 산스 Bold or Pretendard ExtraBold)
— NOT rounded, NOT playful, NOT cute. ~28pt, dark gray (#5A4A4A):
  "J컬 — 가장 자연스러운 라인"

Below: 3 bullet items, each with a small filled pink dot (#E89BAE)
and Korean text in clean Korean sans-serif (Pretendard Medium 15pt,
#5A4A4A, line-height 1.6):
  • 자연스러운 차분한 인상
  • 평소에 거의 안 한 듯한 무드
  • 신부 메이크업·면접·일상 추천

Bottom corner — small line illustration showing a subtle J-shaped
curve drawn in pink (#E89BAE), representing the natural J curl.

All Korean text rendered crisp and accurate.
Mood: clean, professional comparison guide, premium pink K-beauty
editorial, NOT cute, NOT cartoonish.
```

---

### Card 2C — C컬 소개 (4:5)

**저장: `2C_ccurl.png`**

```
Same layout and style as 2B (4:5, pink #FFF5F8, 60/40 split).
Pagination dot at position 3.
Top photo: close-up eye with C-curl bold eyelash extensions on a
Korean woman (same model as 2B if possible).

Badge in top right of photo: number "02" in modern editorial sans-serif
Bold 24pt, pink (#E89BAE).

Main Korean HEADLINE — MODERN KOREAN EDITORIAL DISPLAY SANS-SERIF,
sharp and confident, NOT rounded, NOT cute (like G마켓 산스 Bold or
Pretendard ExtraBold), 28pt, #5A4A4A:
  "C컬 — 또렷한 인형 같은 눈매"

3 bullets (filled pink dots + Korean Pretendard Medium 15pt, #5A4A4A):
  • 볼륨감과 또렷한 인상
  • 눈을 더 크게 보이게 하는 효과
  • 데일리·셀카·여행 추천

Bottom corner: medium C-shaped curve illustration in pink (#E89BAE),
representing the C curl.

All Korean text crisp and accurate.
Mood: same series consistency as 2B, professional editorial.
```

---

### Card 2D — D컬 소개 (4:5)

**저장: `2D_dcurl.png`**

```
Same layout and style as 2B/2C. Pagination dot at position 4.
Top photo: close-up eye with D-curl dramatic eyelash extensions
on a Korean woman (same model series as 2B/2C if possible).

Badge in top right: number "03" same style.

Main Korean HEADLINE — MODERN KOREAN EDITORIAL DISPLAY SANS-SERIF,
sharp and confident, NOT rounded, NOT cute, 28pt, #5A4A4A:
  "D컬 — 가장 강한 컬링"

3 bullets (filled pink dots + Pretendard Medium 15pt, #5A4A4A):
  • 드라마틱한 라인 + 풍성한 볼륨
  • 결혼식·파티·이벤트에 강추
  • 짧은 속눈썹도 길어 보이게

Bottom corner: strong D-shaped curve illustration in pink (#E89BAE),
more dramatic curl than 2C.

All Korean text crisp and accurate.
Mood: same series consistency.
```

---

### Card 2E — 눈매별 매칭 표 (4:5)

**저장: `2E_eyetype_match.png`**

```
Vertical card, 4:5 (1080x1350), pink #FFF5F8 background.
Pagination dot at position 5.

Top — main Korean HEADLINE, render exactly using MODERN KOREAN
EDITORIAL DISPLAY SANS-SERIF, sharp Bold and confident, slightly
condensed (like G마켓 산스 Bold or Pretendard ExtraBold) — NOT rounded,
NOT cute. ~30pt, #5A4A4A, centered:
  "내 눈매별 추천 컬"

Center: 4x4 matrix table with soft rounded square cells (16px radius),
white fill, thin pink border (#E89BAE, 1px).

Top header row (Pretendard Bold 13pt, #5A4A4A, centered):
  "눈매"   "J컬"   "C컬"   "D컬"

4 data rows — leftmost Korean eye-type label (Pretendard Medium 12pt,
#5A4A4A), 3 cells with marks (Cafe24 단정해 or similar 18pt, pink
#E89BAE):
  쌍커풀 또렷       ◎      ◎      ◎
  홑꺼풀·무쌍       ◎      ⭐⭐    ◎
  처진 눈매          ×       ⭐⭐    ⭐⭐
  긴 속눈썹          ⭐⭐    ◎      ×

Below the table, small note (Pretendard Light 11pt, #999999, italic):
  "* 1:1 상담 후 손님 결·길이까지 봐서 정확히 잡아드려요♡"

All Korean text and symbols rendered crisp and accurate.
Marks (◎ ⭐⭐ ×) clearly distinguishable.
Mood: clean professional comparison infographic, K-beauty editorial,
NOT cute, NOT cartoonish.
```

---

### Card 2F — 상담 CTA (4:5)

**저장: `2F_cta.png`**

```
Vertical card, 4:5 (1080x1350), pink #FFF5F8 background.
Pagination dots: 6 dots, last (6th) active.
3-4 floating heart and sparkle decorations in soft pink, scattered.

Top — Korean handwritten brush calligraphy with natural stroke
variation, organic ink flow (NOT digital rounded), 22pt, #B85A75,
centered, render exactly:
  "궁금하신 점은 편하게 물어보세요♡"

Center — large rounded rectangle (32px radius, white fill, 2px pink
outline #E89BAE), containing 3 stacked elements:

Top of box — main Korean HEADLINE using MODERN KOREAN EDITORIAL
DISPLAY SANS-SERIF, sharp Bold (like G마켓 산스 Bold or Pretendard
ExtraBold) — NOT rounded, NOT cute, 22pt, #5A4A4A, centered:
  "1:1 상담 → 디자인 결정"

Row 1 — phone emoji 📞 + Korean text (Pretendard Medium 16pt,
#5A4A4A, centered):
  "📞 0507-1320-6511 (네이버 예약)"

Row 2 — message emoji 💬 + Korean text (Pretendard Medium 16pt,
#5A4A4A, centered):
  "💬 @ure.line 인스타 DM 또는 카카오 채널"

All Korean characters and numbers rendered crisp and accurate.
Mood: warm, inviting, professional CTA, NOT cute or playful.
```

---

# 🎨 세트 3 — 메디핑크 캠페인 5장 (B-2 적용)

> **세트 3 시리즈 일관성**: 같은 GPT 세션에서 5장 연속 생성. 모델은 1명 통일.
> 3A → 3B·3C·3E는 동일 모델 / 3D Before/After는 별도 (다른 손님)
> **3D 추가 지시**: After 톤이 Before보다 명확히 밝고 균일하게 표현

---

### Card 3A — 캠페인 표지 (4:5)

**저장: `3A_cover_campaign.png`**

```
Vertical Instagram poster, 4:5 (1080x1350).
Lavender to soft pink gradient background — top #DCC9DD fading to
bottom #F5DCEA. Soft sparkle bokeh and tiny star particles scattered.

Center-right: shoulder-up portrait of young Korean woman, calm
confident expression, soft makeup, glowing skin, soft oval mask edges
(no hard cut). Premium clinic photography quality.

Left side TOP — handwritten English script, Italianno-style 28pt,
white (#FFFFFF), render exactly:
  "Your Line · Medi Pink"

Left center — large 2-line Korean HEADLINE rendered exactly using
ELEGANT KOREAN SERIF DISPLAY FONT, premium editorial weight
(like Noto Serif KR Bold or 본명조 Bold), refined and sophisticated,
high-end clinic magazine ad typography — NOT rounded sans-serif,
NOT playful, NOT cute kakao-style. White (#FFFFFF), ~36pt:
  "잃어버린 자신감,"
  "다시 핑크빛으로"

Bottom-left small flourish: thin curved line + 2 tiny lavender stars.

Bottom — small footer text (Pretendard Light 14pt, white opacity 80%):
  "유어라인 · 메디핑크 캠페인"

All Korean and English text rendered crisp and accurate.
Mood: premium clinic magazine ad, dreamy yet sophisticated, K-beauty
medical aesthetic, feminine confidence, editorial quality, NOT cute.
Color: lavender #DCC9DD, pink-cream #F5DCEA, white highlights,
deep purple #6B4C8A accents.
```

---

### Card 3B — 5단계 효과 (4:5)

**저장: `3B_effect_5steps.png`**

```
Vertical card, 4:5 (1080x1350), lavender background #DCC9DD with
subtle sparkle bokeh.

Top — Korean HEADLINE rendered exactly using ELEGANT KOREAN SERIF
DISPLAY FONT, premium editorial weight (like Noto Serif KR Bold or
본명조 Bold), refined — NOT rounded sans-serif, NOT cute. White
(#FFFFFF), 30pt, centered:
  "메디핑크 5단계 케어"

Center: 5 horizontally aligned circular icons (each ~80px diameter,
2px white outline, semi-transparent fill). Inside each circle a small
representative icon (drop, ampoule, hand, leaf, cream jar).

Below each circle, Korean label in clean Korean sans-serif
(Pretendard Medium 13pt, white):
  "1.클렌징"  "2.앰플"  "3.딥케어"  "4.멜라닌 분해"  "5.마무리 크림"

Below the icons — 1-line description (Pretendard Regular 15pt, white,
opacity 90%, centered):
  "통증 거의 없는 메디컬 멜라닌 케어 — 4~6회 권장"

Bottom-center: small rounded box (24px radius, white outline 1px,
transparent fill). Inside, Korean handwritten brush calligraphy
with natural stroke variation, 16pt, white:
  "좋은 재료 · 엄격한 기준 · 안전한 시술"

All Korean text rendered crisp and accurate.
Mood: clean medical aesthetic infographic, premium clinic, soft and
professional, NOT cute.
```

---

### Card 3C — 패키지 가격 (4:5)

**저장: `3C_pricing_package.png`**

```
Vertical card, 4:5 (1080x1350), lavender background #DCC9DD with
subtle sparkle.

Top — Korean HEADLINE rendered exactly using ELEGANT KOREAN SERIF
DISPLAY FONT, premium editorial weight (like Noto Serif KR Bold or
본명조 Bold), refined — NOT rounded sans-serif, NOT cute. White
(#FFFFFF), 30pt, centered:
  "메디핑크 패키지"

Center: 2 vertically stacked rectangular pricing boxes (20px radius,
1px outline #9B7BC9, semi-transparent white fill).

Box 1 (Light Care, on top) — 3-zone layout:
  Top label (Cormorant Italic 18pt, lavender #DCC9DD): "Light Care"
  Center large (Korean serif display, premium editorial weight, 32pt,
    white):  "4회"
  Right price (Pretendard Bold 28pt, white): "380,000원"
  Subtitle below (Pretendard Light 13pt, white opacity 80%):
    "초기 케어 / 부분 부위"

Box 2 (Full Care, below — slightly more saturated, recommended highlight)
— same 3-zone layout:
  Top label: "Full Care"
  Center: "6회"
  Right price: "540,000원"
  Subtitle: "완전 케어 / 추천 패키지"
  Plus small badge top-right corner of box 2 — Korean handwritten
    Cafe24 단정해 12pt, white text on pink #E89BAE pill:
    "추천"

Bottom footer — 2 lines small text (Pretendard Light 11pt, white
opacity 70%, centered):
  "* 정확한 가격은 부위·상태에 따라 방문 상담"
  "* 첫 시술 시 무료 상담 1회"

Tiny stars and thin lines decoration.
All Korean text and numbers rendered crisp and accurate.
Mood: premium clinic pricing card, sophisticated, NOT cute.
```

---

### Card 3D — Before/After (4:5) ⚠️ 톤 차이 강조

**저장: `3D_before_after.png`**

```
Vertical card, 4:5 (1080x1350), soft lavender background #DCC9DD.
Subtle sparkle decorations.

Top — Korean HEADLINE rendered exactly using ELEGANT KOREAN SERIF
DISPLAY FONT, premium editorial weight (like Noto Serif KR Bold or
본명조 Bold), refined — NOT rounded sans-serif, NOT cute. White
(#FFFFFF), 28pt, centered:
  "실제 손님 변화 사례"

Center: 2 large rounded square photo placeholder zones (24px radius,
2px lavender outline #9B7BC9), stacked vertically with 24px gap.

Photo 1 (top, Before) — close-up Korean woman's skin showing CLEARLY
DARKER, slightly uneven tone with visible discoloration (melanin
hyperpigmentation, soft realistic skin texture).

Photo 2 (bottom, After) — same area showing CLEARLY LIGHTER, MORE EVEN,
brighter and healthier skin tone with restored natural color and glow.
The contrast between Before and After must be VISUALLY OBVIOUS — the
After should look noticeably more luminous and uniform than Before.

Above each photo — small label pill (12px radius):
  Photo 1: gray-tone pill with white text "Before" (Cafe24 Ohsquare 14pt)
  Photo 2: lavender-tone pill with white text "After" (same style)

Below photos — description line (Pretendard Regular 14pt, white,
centered):
  "4회 시술 · 4주 간격 · 자연스러운 톤 회복"

Bottom — testimonial quote in Korean handwritten brush calligraphy
with natural stroke variation, 14pt, white, centered, 2 lines:
  "임신 후 어두워진 컬러가 회복돼서"
  "자신감이 돌아왔어요"
Below quote, small attribution (Pretendard Light 11pt, white
opacity 70%):
  "— 단골 손님 후기"

All Korean text rendered crisp and accurate.
Mood: convincing transformation, premium clinic Before/After,
hope and confidence, NOT cute.
Color: lavender #DCC9DD, white text, accent #9B7BC9.
```

---

### Card 3E — CTA + 캠페인 안내 (4:5)

**저장: `3E_cta_event.png`**

```
Vertical card, 4:5 (1080x1350), lavender-pink gradient background
(top #DCC9DD fading to bottom #F5DCEA), with more sparkle decoration.
Floating decorations: small lavender + pink stars and hearts (4-5
scattered, varied sizes).

Top-left LARGE circular badge — coral pink (#E85A4F) filled circle,
~200px diameter, 2px white outline. Inside, white text in 2 lines,
modern editorial sans Bold 22pt (NOT rounded, NOT cute):
  "메디핑크"
  "첫 상담 무료"

Center: large rounded rectangle "event card" (24px radius, white fill
opacity 92%, 1px lavender outline #9B7BC9).

Top of box — Korean HEADLINE rendered exactly using ELEGANT KOREAN
SERIF DISPLAY FONT, premium editorial weight (like Noto Serif KR Bold
or 본명조 Bold), refined — NOT rounded sans-serif, NOT cute. Deep
purple (#6B4C8A), 24pt, centered:
  "메디핑크 캠페인 안내"

Inside box, 3 stacked rows in clean Korean sans-serif
(Pretendard Medium 14pt, #5A4A6A):
  📋  "방문 상담 후 부위·상태 맞춤 추천"
  📍  "유어라인 (이수·사당, 1:1 예약제)"
  💬  "0507-1320-6511 / @ure.line / 카카오 채널"

Bottom — small footer note (Pretendard Light 11pt, #6B4C8A opacity 80%,
centered):
  "* 단골 손님께 우선 안내 / 신규 손님도 환영합니다"

All Korean text and emojis rendered crisp and accurate.
Numbers exact (0507-1320-6511).
Mood: celebratory yet professional, premium clinic event announcement,
NOT cute, NOT playful kakao-style.
Color: lavender #DCC9DD, pink #F5DCEA, coral #E85A4F, white,
deep purple #6B4C8A.
```

---

## ✅ 검수 체크리스트 (생성 후)

각 카드 1장씩 확인:

### 폰트 톤 검수 (이번 v3 핵심)
- [ ] 메인 한글 헤드라인이 **둥글둥글 카카오 톤이 아닌가?**
- [ ] 세트 2 헤드: 모던 sharp 에디토리얼 sans인가?
- [ ] 세트 3 헤드: 프리미엄 serif display인가?
- [ ] 손글씨 부분이 brush-stroke 자연스러운가?

### 한국어 정확도 검수
- [ ] 헤드라인 글자 누락·오타 없음
- [ ] 가격 숫자 (380,000원·540,000원 등) 정확
- [ ] 작은 라벨도 흐림·깨짐 없음
- [ ] 띄어쓰기·구두점 정확

### 시리즈 일관성
- [ ] 세트 2 6장 톤 통일 (배경 핑크·모델·헤드 폰트)
- [ ] 세트 3 5장 톤 통일 (라벤더·모델·헤드 폰트)
- [ ] 3D Before/After 톤 차이 명확

→ 통과한 카드는 `gpt_images/`에 덮어쓰기 저장.
→ 만족스러우면 `final/`로 이동 (1A·1B1·1B2·1B3·1B4와 함께).

---

## 🎯 실패 시 대안

폰트 톤이 여전히 카카오스러우면 prompt에 강조 추가:
```
"AVOID Cafe24 Ohsquare style"
"AVOID rounded display fonts entirely"
"AVOID kakao emoticon typography"
"USE only sharp editorial magazine fonts (G마켓 산스, Pretendard ExtraBold)"
```

또는 reference 이미지 첨부:
- 세트 2 → `prototypes/디자인reference/다른레퍼런스_클립아트코리아/스크린샷 2026-05-05 오후 9.31.43.png` (Banner Design 4분할)
- 세트 3 → `prototypes/디자인reference/다른레퍼런스_클립아트코리아/스크린샷 2026-05-05 오후 9.30.26.png` (잃어버린 피부 - 프리미엄 클리닉 톤)

GPT-5.5에서 reference 이미지 업로드 후 "use this typography style for the headline" 명령.

---

## 📚 외부 참조

- 원본 prompt v2: `prototypes/uareline/design-cards-prompts-for-gpt.md`
- 디자인 시스템·역프롬프트 분석: `prototypes/uareline/design-cards-reference.md`
- 채택 5장: `gpt_images/final/`
- 재생성 대상 11장: 본 문서
