# M7 카드뉴스 디자인 레퍼런스 분석 + 역프롬프트 (v2 — 텍스트-인-이미지)

> Day 3 산출물 — v1 2026-05-05 / **v2 2026-05-08** (텍스트-인-이미지 전환)
> Input: `prototypes/디자인reference/` 14장 (메뉴판 3장 + 클립아트코리아 11장)
> 사용처: GPT image gen 한 번에 완성 — 영문 prompt에 한국어 텍스트 직접 명시
> 모듈 통합 위치: `02-target-uareline-prototype.md` §3 M7

---

## 0. 작업 개요

### 0-1. 무엇을 했나
- 레퍼런스 14장을 4그룹으로 분류
- 각 장에 대해:
  - **역프롬프트 v2** (영문 + 한국어 텍스트 임베드 — overlay 없이 GPT 한 번에 완성)
  - **컬러 팔레트** (hex)
  - **타이포그래피 힌트** (스타일 단어로 변환 — handwritten / clean sans / display 등)
  - **유어라인 매핑** (세트 1·2·3 어디 적용)
- 디자인 시스템 5종 추출 (컬러·타이포·레이아웃·여백·아이콘)
- 한국어 텍스트-인-이미지 4-원칙

### 0-2. 핵심 결론 (v2 — 2026-05-08 갱신)
**GPT-5.5 image gen은 한국어 텍스트를 정확히 렌더링한다.** 따라서 워크플로우는 **1단계**:

1. **GPT** — 영문 프롬프트에 한국어 텍스트를 그대로 임베드 → 배경 + 모델 + 텍스트가 한 번에 완성

이전 v1에서는 한국어 깨짐을 우려해 GPT 배경만, Pillow로 텍스트 overlay라는 2단계였음. 최근 GPT-5.5/Sora·Imagen 계열의 한글 렌더링이 안정화되어 1단계로 단축.

**예외 케이스 (Pillow overlay fallback 권장)**:
- 메뉴 11종 이상의 매우 dense한 가격표 (Card 1A, 1B2 등) — 한 번에 정확 렌더링 어려움. 2~3 variation으로도 안 되면 §3-2 fallback
- 가격 숫자 — GPT가 가끔 "44,000" → "44,oOO"로 흘림. 결과물 1장씩 검수 필수
- 8pt 미만 매우 작은 폰트 — GPT 흐림. 푸터·노트는 11pt 이상 명시

이 1단계 워크플로우가 14개 레퍼런스 중 ~12개에 적용 가능.

---

## 1. 레퍼런스 14장 — 그룹별 역프롬프트 v2 (텍스트 임베드)

### 그룹 A — 메뉴판/가격표 (3장, 세트 1 직접 reference)

#### A1. `메뉴판1/스크린샷 2026-05-05 오후 9.25.20.png`

**관찰**: 가로형 레이아웃. 핑크 점선 보더. 손글씨 헤드라인 "오늘도 반하다". 좌측엔 시술 디자인 일러스트(눈썹 4종+), 우측엔 가격 테이블. 정보 밀도 매우 높음. 흰 배경. 시술 결과 일러스트가 카탈로그형.

**역프롬프트 v2 (영문 + 한국어 임베드)**:
```
Wide rectangular menu layout, 16:9 aspect ratio (1920x1080),
soft white background #FFFAFC.
Decorative pink dotted border frame around the composition
(1px dashed, color #E89BAE).
Top decorations: small pink floral ornaments and tiny stars.

Top center HEADLINE — Korean handwritten calligraphy, render exactly:
  "오늘도 반하다"
  elegant hand-drawn pink script (#E89BAE), ~64pt.

Left half: 6 photo-realistic eyelash design illustrations
arranged in a 2x3 grid. Below each illustration, a clean
Korean/English sans-serif label (Pretendard-like, 12pt, #666666):
  Row 1: "Natural"   "Cute"   "Sexy"
  Row 2: "Mix"   "Glamorous"   "디자인 이름"

Right half: clean two-column price table, thin gray dividers (#999999).
English serif italic section header (16pt, #B8868F): "EYELASH"
Followed by Korean menu rows — left column Pretendard Medium 13pt
(#5A4A4A), right column right-aligned Bold 13pt prices:
  글루연장 하프 (50%)              44,000원
  글루연장 맥스 (90%)              66,000원
  LED연장 변경 추가                +11,000원
  펌포인트 / 마스카라 연장          66,000원
  디자인 추가 (부분 볼륨)          +11,000원
  디자인 추가 (전체 볼륨)          +22,000원
  타샵 연장 제거                    11,000원

Section header: "EYELASH PERM"
  유어라인 클리닉 영양펌            33,000원
  영양 블랙 틴팅펌                  44,000원
  펌포인트 연장 (펌+연장)           66,000원

Bottom footer — light gray Korean text (#999999, 11pt):
  "100% 예약제 및 1:1 단독시술 · 0507-1320-6511"

All Korean characters MUST be rendered crisp, accurate, legible.
Mood: feminine, delicate, soft pastel-pink Korean beauty salon menu.
Style: Korean magazine editorial meets pastel beauty branding.
```

**컬러 팔레트**: `#FFF5F8` (배경) / `#E89BAE` (핑크) / `#5A4A4A` (텍스트) / `#999999` (보조선)
**타이포 힌트**: 헤드 — handwritten Korean calligraphy / 본문 — clean Korean sans-serif / 가격 — Bold
**유어라인 매핑**: **세트 1 카드 1번 (가로형 메뉴 11종)** ⭐ 1순위. 워터마크 핑크 일치.
**주의**: dense table — variation 3~5회 권장. 가격 숫자 1개씩 정확도 검수.

---

#### A2. `메뉴판2/스크린샷 2026-05-05 오후 9.26.08.png`

**관찰**: 세로형 (인스타 1080×1350 적합). 베이지·크림 배경. 손글씨 헤드 "에쁘티". 가격 단순 텍스트 + 소요시간(min) + 가격(우측 정렬). 라인이 매우 가늘고 여백 풍부. 군더더기 없음. 정보 hierarchy 깔끔.

**역프롬프트 v2**:
```
Vertical Instagram carousel card, 4:5 aspect ratio (1080x1350).
Soft beige/cream background #F5EFE3 with subtle paper grain.
Thin horizontal divider lines (1px, light gray #C9B89A).
Generous white space, minimalist Korean beauty salon menu aesthetic.
Top center: small ornamental flourish (curved leaf or floral motif).

Top center HEADLINE — Korean handwritten calligraphy, render exactly:
  "에쁘티"
  in dark brown (#6B5544), elegant calligraphic style, ~36pt.

Section header — italic English serif (Cormorant Italic 16pt, #6B5544):
  "Eyelash Extensions"

Below: 5 menu rows — Korean menu name (Pretendard 13pt, #6B5544, left),
small time in min (light gray #999, 11pt, center),
price right-aligned bold (Pretendard Bold 13pt, #6B5544):
  자연눈썹                   60min     35,000원
  볼륨 1:2~3                 90min     50,000원
  볼륨 1:4~6                 90min     55,000원
  믹스 디자인               120min     65,000원
  속눈썹 펌                  60min     30,000원

Section header: "Eyelash Perm"
  케라틴 펌                  60min     40,000원
  글로우 케라틴 펌           90min     55,000원

Bottom footer note (10pt, #999999):
  "*가격은 부가세 별도 / 1:1 예약제"

All Korean characters rendered crisp and accurate.
Mood: refined, premium, Vogue Korea editorial, no decoration overload.
Color: dusty cream #F5EFE3, brown text #6B5544, ivory white space.
Style: high-end Korean cafe/salon menu.
```

**컬러 팔레트**: `#F5EFE3` (베이지) / `#6B5544` (다크 브라운) / `#C9B89A` (보조선) / `#FFFFFF` (포인트)
**타이포 힌트**: 헤드 — Korean calligraphy / 본문 — clean Korean sans / 영문 — Cormorant Italic
**유어라인 매핑**: **세트 1 카드 2번 (가격표 세로형 = 인스타 캐러셀 최적)** ⭐⭐ 1순위 fallback.

---

#### A3. `메뉴판2/스크린샷 2026-05-05 오후 9.26.14.png`

**관찰**: A2 시리즈 두 번째. 헤드 "에쁘티", 섹션 "Semipermanent" / "Waxing". 동일 톤 유지. 좌측에 작은 ◀ 슬라이드 화살표. 아래에 노트 3줄 (이벤트·할인 안내).

**역프롬프트 v2**:
```
Same beige/cream background and minimalist style as A2 reference.
Vertical 4:5 (1080x1350), background #F5EFE3, paper grain.
Small left-pointing chevron icon at vertical mid-left (carousel indicator).
Pagination dots at bottom center (3 dots, second active).

Top HEADLINE — same calligraphy style: "에쁘티" (#6B5544, ~36pt).

Section header: "Semipermanent"
Korean menu rows (Pretendard 13pt) + min + price (Bold 13pt):
  자연눈썹                  120min     250,000원
  콤보 (자연+그라데이션)    150min     280,000원
  음영 (수채화 기법)        120min     250,000원

Section header: "Waxing"
  눈썹 왁싱                  20min      15,000원
  헤어라인 왁싱              30min      25,000원

Bottom — 3 small footer note lines (10pt, #999999):
  "*눈썹 기법에 따른 추가금은 없습니다"
  "*동반 방문은 미리 알려주세요"
  "*이벤트&할인 가격은 현금 결제가 입니다"

All Korean characters crisp and accurate.
Mood: premium, calm, paginated carousel page 2 of 3.
```

**컬러**: A2와 동일.
**유어라인 매핑**: **세트 1 카드 3번 (메디핑크·웩싱·기타 보조 메뉴 별도 카드)** + 카드 4·5번 시리즈 일관성.

---

### 그룹 B — 단일 캠페인 광고 (5장 — 메디핑크·캠페인 ref, 세트 3)

#### B1. `9.29.41.png` — Tokoro Winter Cream

**관찰**: 모델 (한국 여성) + 화장품 용기. 블루·실버 톤. "겨울엔 수분보습" 큰 한글. 작은 아이콘 4개 (혜택). 크롭 박스 우측에 화이트 배경 + 큰 텍스트.

**역프롬프트 v2**:
```
Vertical beauty product advertisement poster, 4:5 (1080x1350).
Cool blue/silver winter palette, glittering bokeh background.

Left half: confident young Korean woman, mid-twenties, applying
cream to cheek with index finger, soft natural makeup, clean skin,
calm gaze toward camera, white tank top.

Right half: clean white/silver area with floating cosmetic jar
(frosted glass, silver lid, small "TOKORO" label).

Top right English badge — Montserrat Light 14pt (#B0C4D6):
  "TOKORO WINTER CREAM"

Center-right large Korean HEADLINE — bold display sans, render exactly:
  "겨울엔 수분보습"
  in dark navy (#1F3A5F), G마켓 산스 Bold style, ~48pt.

Bottom row: 4 thin circular icons (24px outline each) evenly spaced.
Below each icon, small Korean label (Pretendard 12pt, #1F3A5F):
  "수분"   "탄력"   "광채"   "보호"

All Korean text rendered crisp and accurate.
Mood: clean, premium, K-beauty winter campaign.
Lighting: soft cool daylight, gentle bokeh sparkles.
Color: light blue #D0E1EE, navy #1F3A5F, silver #B0C4D6, white.
```

**컬러**: `#D0E1EE` / `#1F3A5F` / `#B0C4D6` / `#FFFFFF`
**유어라인 매핑**: **세트 3 카드 1번 (메디핑크 표지·시즌 캠페인)** — 단 메디핑크는 핑크/라벤더 톤으로 변환.

---

#### B2. `9.29.51.png` — 수분·물광 윈터

**관찰**: 모델 + 손에 크림. 아쿠아 그린 배경. 큰 텍스트 두 줄 강조. 하단 5 아이콘. 텍스트가 주인공.

**역프롬프트 v2**:
```
Vertical beauty campaign poster, 4:5 (1080x1350).
Aqua-mint pastel green background #C8E6E0 with soft sparkle bokeh.

Center: young Korean woman, fresh minimal makeup, holding cosmetic
tube near chin, subtle smile, shoulder-up framing.

Upper-middle large Korean HEADLINE — bold display, render exactly,
2-line stack, white (#FFFFFF), Cafe24 Ohsquare Bold style:
  "수분과 물광"   (~60pt, line 1)
  "한 번에"       (~40pt, line 2, slightly indented right)

Bottom row: 5 small circular icons (thin white outline).
Below each, small Korean label (Pretendard 11pt, #FFFFFF):
  "약물사용"  "수분보충"  "탄력케어"  "마무리효과"  "5분이내"

All Korean text crisp, accurate, legible.
Mood: K-beauty hydration campaign, fresh, dewy, "glass skin".
Color: mint #C8E6E0, white text, soft cream highlights, accent #7BAB9F.
```

**컬러**: `#C8E6E0` / `#FFFFFF` / `#7BAB9F`
**유어라인 매핑**: **세트 3 카드 2번 (메디핑크 5단계 process)** — 핑크 톤으로 변환. 5 아이콘 cycle.

---

#### B3. `9.30.19.png` — Winter Best Gift

**관찰**: 모델 정면. 블루·실버 그라데이션. 손글씨 영문 "Winter Best Gift". 가운데 큰 한글 "겨울 피부를 위한 완벽한 레이어링". 하단 가격 박스.

**역프롬프트 v2**:
```
Vertical campaign poster, 4:5 (1080x1350).
Frosty winter atmosphere, dark navy-to-blue gradient background
with falling snow particles and sparkle bokeh.

Center: long-haired young Korean woman, elegant gentle smile,
natural makeup, soft glowing skin, soft side gaze, flat lighting
with subtle blue undertone.

Top — handwritten English script, render exactly:
  "Winter Best Gift"
  in white, Italianno or Pinyon Script style, ~36pt.

Middle — large Korean HEADLINE, bold display, 2-line stack,
white (#FFFFFF), Cafe24 Ohsquare Bold style ~32pt, render exactly:
  "겨울 피부를 위한"
  "완벽한 레이어링"

Bottom — clean rectangular pricing box with thin gold/silver outline
(#E5C77F, 1px). Inside: 2 stacked rows, light gray label + bold price:
  Row 1: "1회"      "119,000원"
  Row 2: "10회"   "1,190,000원"
Pretendard Bold 18pt prices, Light 12pt labels, all white.

Subtle decorative snowflake icons in corners (small, sparse).
All Korean and English text rendered crisp and accurate.
Mood: Korean dermatology/aesthetic clinic premium winter campaign.
Color: deep blue #1A2B4D, ice silver #C5D5E5, soft white, gold #E5C77F.
```

**컬러**: `#1A2B4D` / `#C5D5E5` / `#FFFFFF` / `#E5C77F`
**유어라인 매핑**: **세트 3 카드 3번 (메디핑크 패키지 가격 카드)** — 가격 박스 레이아웃 직접 활용.

---

#### B4. `9.30.26.png` — 잃어버린 피부, 밸런스를 되찾다

**관찰**: 모델 정면 (손가락 입가). 라벤더 톤. 큰 한글 헤드 "잃어버린 피부, 밸런스를 되찾다". 우측 가격 박스. 영문 보조 "VIRGINIA EDITION".

**역프롬프트 v2**:
```
Vertical premium campaign poster, 4:5 (1080x1350).
Lavender/dusty purple gradient background #C9B8DC with soft sparkle bokeh.

Center-left: young Korean woman, index finger touching cheek,
natural makeup, hair in soft updo, calm confident expression,
shoulders visible, premium photography.

Top right — italic English subtitle, render exactly,
Cormorant Italic 14pt, lavender white (#FFFFFF/95):
  "VIRGINIA EDITION"

Center large Korean HEADLINE — bold display, 2-line stack,
white (#FFFFFF), Cafe24 Ohsquare Bold style ~36pt:
  "잃어버린 피부,"
  "밸런스를 되찾다"

Right side pricing box — 2 rows, white outline:
  "1회"     "119,000원"
  "10회"  "1,190,000원"

Bottom: tiny brand name placeholder rendered as small white text:
  "your line · medi pink"

All Korean characters crisp and accurate.
Mood: aesthetic clinic, premium, balance-themed, regaining confidence.
Color: lavender #C9B8DC, deep purple #6B4C8A, white highlights.
```

**컬러**: `#C9B8DC` / `#6B4C8A` / `#FFFFFF`
**유어라인 매핑**: **세트 3 카드 4번 (메디핑크 변화 캠페인 — Before/After)**.

---

#### B5. `9.30.44.png` — 겨울 첫눈 성형

**관찰**: 모델 정면 (어깨까지). 퍼플·라일락 배경. 별·반짝이 데코. Before/After 작은 사진 2장 하단. 큰 한글 손글씨 톱. 의료 클리닉 톤.

**역프롬프트 v2**:
```
Vertical clinic campaign banner, 4:5 (1080x1350).
Dreamy purple-lilac gradient background #DDC3F0 with floating
star icons and soft glitter sparkles.

Right half: shoulder-up portrait of fresh young Korean woman,
long straight black hair, minimal/no makeup, smooth glowing skin,
small confident smile, looking at camera.

Left side TOP — handwritten Korean calligraphy, render exactly:
  "겨울 첫눈 성형"
  in white (#FFFFFF), 캘리그래피 style ~48pt.

Left side middle — body text, Pretendard Light 14pt, white:
  "1주 만에 변화의 시작"

Left side bottom — 2 small circular before/after photo placeholders
with thin labels rendered exactly:
  Left circle label:  "Before"
  Right circle label: "After"
  (Pretendard Medium 11pt, white)

Decorative element: small purple stars and sparkle lines scattered.
All Korean text crisp and accurate.
Mood: Korean medical aesthetic clinic, transformation, dreamy.
Color: lavender #DDC3F0, purple #9B7BC9, soft pink highlights, white.
```

**컬러**: `#DDC3F0` / `#9B7BC9` / `#FFFFFF`
**유어라인 매핑**: **세트 3 카드 5번 (Before/After 비교)** — 별 데코는 사장 인스타 ♡♡ 톤과 일치.

---

### 그룹 C — 카드뉴스 시리즈 (2장 — 시리즈 디자인 ref, 세트 2)

#### C1. `9.30.07.png` — 윈터 케어 6장 시리즈

**관찰**: 6장 카드 그리드 미리보기. 베이지·모브·연핑크 톤. 카드별 다른 주제. 통일성: 같은 폰트·여백·소품. 모델 + 일러스트·소품 혼합.

**역프롬프트 v2** (시리즈 6장의 톤 추출 — 카드별 텍스트 변형):
```
Series of 6 Instagram square carousel cards (1:1 each), 3x2 preview grid.
Cohesive Korean editorial winter beauty mood:
  - Soft beige #F5EBE0 and dusty mauve #D4B5B0 palette
  - Each card: portrait OR still-life flat lay OR typography-focused
  - Common props: dried flowers, white pebbles, cream fabric, jars
  - Generous white space, soft shadows, paper texture

Render Korean/English text on each card (Pretendard Bold 28pt headlines,
Light 14pt subtitles, color #5A4A4A):

  Card 1 (cover): English subtitle "Winter Beauty Guide"
                  + Korean headline "겨울 뷰티 6가지 팁"
  Card 2: "Winter Color Palette" + "이번 겨울 컬러 5"
  Card 3: "Winter Skincare Tips" + "보습 루틴 3단계"
  Card 4: "Winter Mood" + "분위기 있는 겨울 데이트룩"
  Card 5: "Winter Foot Care" + "발 관리도 잊지 말기"
  Card 6 (CTA): "Coming Soon" + "다음 시리즈 예고"

All Korean and English text rendered crisp, accurate, legible.
Mood: editorial magazine spread, calm, premium.
Color: cream #F5EBE0, mauve #D4B5B0, soft pink #F2DCDC, text #5A4A4A.
```

**컬러**: `#F5EBE0` / `#D4B5B0` / `#F2DCDC` / `#5A4A4A`
**타이포 힌트**: Pretendard 한 패밀리만 (Bold·Regular·Light 세 굵기)
**유어라인 매핑**: **세트 2 전체 (컬·디자인 비교 6장)** ⭐⭐⭐ — 시리즈 톤·여백·소품 그대로 인용.

---

#### C2. `9.31.43.png` — Banner Design 4분할

**관찰**: 4장 카드 (눈썹·뷰티·피부·레이저). 각각 다른 컬러·다른 사진·다른 한글 헤드. "Banner Design" 라벨. 컬러 다양 (연블루·옐로·핑크·민트).

**역프롬프트 v2**:
```
Set of 4 square 1:1 Instagram banner cards in a 2x2 grid.
Top label rendered exactly in thin English serif (16pt, #5A4A4A):
  "BANNER DESIGN"

Each card different pastel theme + Korean headline:

  Card 1 (pale blue #D8E5EE bg): profile portrait of Korean woman
    in profile view (left), text right.
    Korean headline: "눈썹이 다 했다"
    (Cafe24 Ohsquare Bold 32pt, #2C4A6E)

  Card 2 (warm cream-yellow #F8E8B6 bg): eye-area close-up photo.
    Handwritten English script: "Beauty"
    + Korean headline: "눈썹미인"
    (Calligraphy + Cafe24 단정해 28pt, #6B4C2A)

  Card 3 (soft pink #F8DCE0 bg): woman with hand near face,
    confident pose.
    Korean headline: "피부에 빛나다"
    (Cafe24 Ohsquare Bold 32pt, #B85A75)

  Card 4 (pale mint #D4E8DD bg): leg/skin texture close-up.
    Korean headline: "매끈매끈해"
    sub-line: "레이저 제모"
    (Bold 32pt + Light 18pt, #4A7560)

All Korean and English text crisp and accurate.
Mood: K-beauty advertising banner template, varied yet cohesive.
```

**유어라인 매핑**: **컬러 배리에이션 시스템 ref** — 4종 컬러 셋업 직접 인용. 메디핑크 = 핑크, 디자인 비교 = 모브, 가격표 = 베이지·블루.

---

### 그룹 D — 단일 광고/배너 (4장 — 보조 inspirations)

#### D1. `9.32.18.png` — Beauty Make-up 다크

**관찰**: 모델 (눈웃음 + 검지 입가) + "BEAUTY MAKE-UP" 헤드 + 8개 아이콘. 다크 그레이·블랙 배경. 럭셔리 매거진 톤.

**역프롬프트 v2**:
```
Wide horizontal layout, 16:9 (1920x1080).
Dark charcoal/black gradient background #2C2C2C.
Center: half-body portrait of young Korean woman, smooth skin,
soft makeup, hand near face with index finger, gentle smile,
fashionable hair, premium glossy lighting.

Top center — minimalist serif title rendered exactly,
Cormorant Garamond 18pt, white, letter-spaced:
  "BEAUTY MAKE-UP"

Around figure: 8 thin circular icon placeholders (40px diameter,
1px white outline) arranged in wide oval (4 each side).
Beside each icon, small label in Pretendard Light 11pt, white:
  Left side (top to bottom):  "Eye Make-up"  "Nose"  "Cheek"  "Lip"
  Right side (top to bottom): "Brow"  "Skin"  "Hair"  "Lash"

Bottom right — faint signature in small italic script (#888888):
  "k-beauty editorial"

All Korean and English text rendered crisp and legible.
Mood: high-end magazine editorial spread, dark luxury, K-beauty.
Color: charcoal #2C2C2C, gold accents #C9A960, ivory highlights.
```

**컬러**: `#2C2C2C` / `#C9A960` / `#FFFFFF`
**유어라인 매핑**: **세트 2 표지 또는 진단 리포트 디자인 ref** — 8 아이콘 방사형 배치가 메디핑크·시술 메뉴 안내에 활용.

---

#### D2. `9.32.31.png` — Sale 50% off

**관찰**: 모델 (정면 미소). 베이지·옐로 배경 + 별·반짝이. 큰 빨간 원 "Sale 50% off". 하단 박스 "자연눈썹"/"앵클특가".

**역프롬프트 v2**:
```
Vertical promotional poster, 4:5 (1080x1350).
Warm beige/yellow background #F8E8B6 with sparkle stars decoration.

Center-right: bust portrait of Korean woman with bright smile,
natural makeup, casual bright atmosphere.

Top-left LARGE circular badge — coral red (#E85A4F) filled circle,
~280px diameter, white text inside (Italic Sans Bold ~24pt),
render exactly across 2 lines:
  "Sale"
  "50% off"

Center subtle handwritten Korean script — Cafe24 단정해 14pt,
soft gray (#6B4C2A), single line:
  "자연눈썹하고 휴가지에서 쌩얼로 인생샷!"

Bottom: 2 stacked pill-shaped buttons (cream filled, brown outline),
each containing centered Korean text (Pretendard Bold 16pt, #6B4C2A):
  Button 1: "자연눈썹"
  Button 2: "앵클특가"

All Korean text rendered crisp and accurate.
Mood: Korean event promotion poster, friendly, fresh, attention-grabbing.
Color: cream #F8E8B6, coral red #E85A4F, soft brown #6B4C2A.
```

**컬러**: `#F8E8B6` / `#E85A4F` / `#6B4C2A`
**유어라인 매핑**: **세트 3 카드 5번 (메디핑크 첫 시작 캠페인·상담 무료)** — Sale 원 디자인 그대로 인용 가능.

---

#### D3. `9.32.41.png` — 4분할 미니멀

**관찰**: 4분할 (입술·네일·머릿결·눈썹). 라벤더·소프트 핑크·블루·다크 베이지. 큰 한글 헤드 + 작은 본문. 미니멀 타이포 중심. 사진보다 텍스트가 주인공.

**역프롬프트 v2**:
```
Set of 4 square 1:1 cards in a 2x2 grid, each minimalist
(80% empty space, single photo accent, typography-focused).

Card 1 (lavender bg #DCC9DD): small lip close-up photo top-right.
  Korean headline (Cafe24 Ohsquare Bold 32pt, #5A4A6A):
    "촉촉입술"
  Small mini-copy below (Pretendard Light 12pt, #6B5C7A):
    "포토부스에서 쩝쩝쩝~"

Card 2 (cream bg #F5EFE3): English handwritten script center.
  Top: large quote mark "
  Korean inline quote (Cafe24 단정해 16pt, #6B5544):
    "네일아트가 더 중요해요"

Card 3 (dusty pink bg #E8C5C0): woman's neck/hair side profile right.
  Korean headline (Cafe24 Ohsquare Bold 30pt, #8B5560):
    "실키 머릿결"
  Mini-copy: "샴푸 후 한 줄로 정리"

Card 4 (dark beige bg #6B5544): shoulder portrait left.
  Vertical Korean text — characters stacked one per line
  (Pretendard Bold 36pt, white, vertical-rl layout):
    "눈"
    "썹"
    "미"
    "남"

All Korean and English text rendered crisp and accurate.
Mood: Korean editorial magazine, premium typography-driven.
```

**컬러**: 라벤더 #DCC9DD / 크림 #F5EFE3 / 핑크 #E8C5C0 / 다크 베이지 #6B5544
**유어라인 매핑**: **세트 2 카드 5·6번 (디자인 비교 미니멀)** — "눈/썹/미/남" 세로 분할이 컬·디자인 4분할 표기에 직접 인용.

---

### 그룹 E — 이벤트형 광고 (1장)

#### E1. `9.32.56.png` — 뷰티 노하우 대공개

**관찰**: 핑크·옐로 그라데이션. 마스카라·립스틱·아이라이너 일러스트 위·하단. 큰 한글 톱 "벚꽃보다 더 화려한" + "나만의 뷰티노하우 대공개 이벤트". 중앙 흰 박스.

**역프롬프트 v2**:
```
Vertical event poster, 4:5 (1080x1350).
Pink-to-yellow soft gradient background (#FFCBD8 top to #FFEE9F bottom)
with cherry blossom petals scattered.
Top: large flat illustration of cosmetic items (mascara, lipstick,
eyeliner) scattered diagonally. Bottom mirror illustration.

Top — handwritten Korean script, Cafe24 단정해 24pt,
dark pink (#B85A75), render exactly:
  "벚꽃보다 더 화려한"

Center main HEADLINE — Cafe24 Ohsquare Bold 32pt, dark pink, 1 line:
  "나만의 뷰티노하우 대공개 이벤트"

Center white rounded rectangle box (radius 24px, soft shadow) with
event details inside (Pretendard Regular 13pt, #5A4A4A, line-height 1.8):
  "참여 방법"
  "1. 인스타 @ure.line 팔로우"
  "2. 본인 뷰티노하우 사진 + 해시태그 #유어라인뷰티"
  "3. 추첨 5분께 시술 1회 무료 + 영양제 증정"
  "기간: 4월 1일 ~ 4월 30일"

Bottom — small CTA button (pill shape, dark pink fill, white text 14pt):
  "이벤트 참여하기"

All Korean text crisp and accurate.
Mood: Korean spring beauty campaign event, playful yet refined.
Color: cherry pink #FFCBD8, sunny yellow #FFEE9F, white center, accent #B85A75.
```

**유어라인 매핑**: **메디핑크 캠페인 보조 카드** (세트 3 추가). 봄 시즌 → "메디핑크 봄맞이 캠페인"으로 변환 가능.

---

## 2. 디자인 시스템 추출 (5종)

레퍼런스 14장에서 공통 패턴 추출 — 유어라인 카드뉴스 시스템 정의:

### 2-1. 컬러 시스템 (4 톤 분기)

| 톤 | 사용 세트 | 메인 hex | 보조 hex | 텍스트 |
|---|---|---|---|---|
| **라이트 핑크** ⭐ (사장 워터마크 일치) | 세트 1·2·3·일상 | `#FFE4EC` | `#E89BAE` | `#5A4A4A` |
| **베이지·크림** (고급·미니멀) | 세트 1 가격표 | `#F5EFE3` | `#C9B89A` | `#6B5544` |
| **모브·라벤더** (메디핑크·여성 케어) | 세트 3 메디핑크 | `#DCC9DD` | `#9B7BC9` | `#5A4A6A` |
| **다크 액센트** (강조·진단 리포트) | 진단 리포트 A | `#2C2C2C` | `#C9A960` (골드) | `#FFFFFF` |

→ **4 톤 시스템으로 통일**. 메인은 라이트 핑크, 메디핑크는 모브, 가격표는 베이지·핑크 분기.

### 2-2. 타이포그래피 시스템 (4 굵기 위계)

| 역할 | 스타일 단어 (GPT 프롬프트용) | 크기 (1080×1350) | 굵기 |
|---|---|---|---|
| 손글씨 헤드 (브랜드·캠페인명) | "handwritten Korean calligraphy" / "elegant hand-drawn script" | 36~60pt | Regular |
| 메인 헤드 (한글) | "bold Korean display font" / "Cafe24 Ohsquare Bold style" | 28~48pt | Bold |
| 부제 (영문) | "Cormorant Garamond Italic" / "Italianno Script" | 14~24pt | Italic |
| 본문·라벨 | "clean Korean sans-serif" / "Pretendard-like" | 11~16pt | 3 굵기 |

→ **3종 폰트 패밀리만**: 손글씨 + 메인 + Pretendard. **GPT 프롬프트에서는 폰트 파일명 대신 스타일 단어로 표현** (GPT가 자동 매칭).

### 2-3. 레이아웃 시스템 (3 캔버스 사이즈)

| 캔버스 | 용도 | 비율 |
|---|---|---|
| **1080×1350** (인스타 4:5) | 메인 캐러셀 카드 | 4:5 |
| **1080×1080** (인스타 1:1) | 보조 카드·아이콘 그리드 | 1:1 |
| **1920×1080** (가로 16:9) | 메뉴판 가로형 (PDF 첨부용) | 16:9 |

### 2-4. 여백 시스템 (8pt 그리드)

- 카드 외곽 마진: **80px** (1080 기준 7.4%)
- 섹션 간격: **40~64px**
- 텍스트 간격: **16~24px** (행간)
- 아이콘 간격: **24~32px**

### 2-5. 데코·아이콘 시스템

- **점선 보더** (메뉴판1) — 핑크 #E89BAE, 1px dashed
- **꽃·잎 ornament** (A1, A2) — 작은 라인 일러스트
- **별·반짝이** (B5, E1) — 캠페인 카드용 (사장 인스타 ♡♡ 톤과 일치)
- **얇은 원형 아이콘** (B1, B2, D1) — 1px outline, 24~40px 지름

---

## 3. GPT image gen 사용 가이드 (v2 — 텍스트-인-이미지)

### 3-1. 기본 워크플로우 — **GPT 한 번에 완성** ⭐ (v2 추천)

```
[Step 1] design-cards-prompts-for-gpt.md의 Card 프롬프트 복사
[Step 2] GPT-5.5 image gen에 그대로 paste
[Step 3] 2~3 variation 생성 → 한국어 정확도 검수
[Step 4] 채택 1장 저장 (PNG)
[Step 5] 마음에 안 들면 부분 수정 명령
         ("make pink more saturated", "shift headline up", etc.)
```

- **장점**: 1단계, 빠름, Pillow 코드 불필요
- **단점**: dense 텍스트는 정확도 흔들림 → variation 추가 또는 fallback

### 3-2. Pillow overlay fallback (예외 케이스만)

dense 텍스트 카드 (1A 메뉴 11종, 1B2·1B3 가격표, 2E 매트릭스 등)에서
GPT 한 번에 정확한 한국어 렌더링이 어려울 때:

```
[Step 1] GPT 프롬프트에서 Korean text 부분만 "BLANK placeholder" 로 변경
         → 배경·일러스트만 생성
[Step 2] Pillow 코드로 한국어 텍스트 overlay
         (폰트: Pretendard.otf, Cafe24-Ohsquare.ttf 사용)
[Step 3] PNG 출력
```

→ **예외 케이스에만 사용**. 16장 중 dense 3~4장 정도 예상.

### 3-3. GPT 프롬프트 작성 5-원칙 (v2)

레퍼런스 14장에서 추출한 패턴:
1. **"render Korean text exactly: '...'"** — 정확한 텍스트 명시
2. **레이아웃 정확히 묘사** — "left half", "top right", "below each icon"
3. **컬러 hex 또는 톤 단어** — `dusty cream`, `lavender`, `aqua mint`
4. **스타일 단어로 폰트 표현** — "Korean handwritten calligraphy", "bold Korean display font", "clean Korean sans-serif"
5. **검수 강조 문구** — "All Korean characters rendered crisp, accurate, legible"

### 3-4. 한국어 텍스트 정확도 검수 체크 (variation 1장씩)

- [ ] 헤드라인 글자 누락·오타 없음
- [ ] 가격 숫자 (44,000원 등) 정확
- [ ] 작은 라벨도 흐림·깨짐 없음
- [ ] 받침·모음 정확 (ㅁ→ㅂ, ㅓ→ㅡ 등 실수 잦음)
- [ ] 띄어쓰기·구두점 정확

→ 1개라도 틀리면 variation 재생성. 반복해도 안 되면 §3-2 fallback.

---

## 4. 사용자 작업 워크플로우 (M7 진행 — v2)

### Phase 1 — 컨셉 결정 (사용자 결정 5분)
1. 본 문서의 **유어라인 매핑** 표 확인
2. 각 세트별 1순위 ref 결정 (이미 D1=c, D2=b, D3=d로 결정 완료)

### Phase 2 — 텍스트-인-이미지 프롬프트 작성 (Claude 자동, 30분)
- 본 문서 v2 역프롬프트 패턴을 적용해 16장 자체 prompt 작성
- 산출: `prototypes/uareline/design-cards-prompts-for-gpt.md` v2

### Phase 3 — GPT 이미지 생성 (사용자, 1~2h)
- 16장 각각 GPT-5.5에 영문 프롬프트 paste → 2~3 variation
- 한국어 텍스트 정확도 검수 (§3-4 체크리스트)
- 채택 1장씩 PNG 저장

### Phase 4 — Pillow overlay fallback (Claude 자동, 1h, dense 카드만)
- Phase 3에서 한국어 정확도 못 맞춘 카드만 (예상 3~4장)
- Pillow 코드로 텍스트 overlay → 최종 PNG 출력

### Phase 5 — 사장 검수 + 최종 다듬기 (베타 D-Day 미팅)
- 사장에게 16장 보여주고 톤·색상·텍스트 검수
- 정정 1라운드 (variation 재생성 또는 Pillow 수정)

**총 소요**: 사용자 1~2h (이미지 생성·검수) + Claude 1h (fallback overlay)
v1 대비 1~2h 단축 (Pillow 코드를 16장 모두에 쓰지 않아도 됨).

---

## 5. 한계 + 보완

### 5-1. GPT image gen v2 한계 (현실 인정)
- **dense 텍스트** (메뉴 11종, 매트릭스 4×4): 한 번에 100% 정확 어려움 — variation 3~5회 또는 Pillow fallback
- **숫자 정확도**: 가격 "44,000원" 같은 천 단위 콤마 자주 흐림 → 검수 필수
- **모델 사진 일관성**: 시리즈 내 같은 모델 유지 어려움 → "same Korean woman as previous image" 명시
- **화장품 제품 정확성**: 유어라인 영양제 제품 그대로 생성 X → 실제 제품 사진 합성 필요

### 5-2. 합성 시 사용자가 준비할 것
- **유어라인 워터마크 PNG** (사장 인스타에서 추출, 핑크 `U're Line`)
- **시술 결과 사진 5~10장** (이미 받은 3장 + 인스타 31장 활용 가능)
- **로고·브랜드 컬러 정확한 hex** (사장 확인 — 추정 #E89BAE)
- **(예외) 폰트 파일** — Pillow fallback 사용 시만 (Pretendard·Cafe24 단정해·G마켓 산스 — 모두 무료)

### 5-3. 시리즈 일관성 유지 팁
- Phase 3에서 모든 카드 배경을 **같은 GPT 세션 한 번에 생성** (시각 톤 일관성 ↑)
- 또는 1장 생성 후 "make 5 variations with same style" 명령
- 모델은 1~2명 고정 (다양성 너무 많으면 시리즈 흐트러짐)
- **세트별 첫 카드 (1A/2A/3A) → 다음 카드는 "same Korean woman, same color palette as previous" 명시**

---

## 6. 외부 참조

- 레퍼런스 14장 raw: `prototypes/디자인reference/`
- 사용자 시술 사진 4장: `sample_pictures_0505/`
- 사장 인스타 31장 (모델 sample): `Day1_data_collection/인스타 게시물/`
- 사장 톤 프롬프트 v3 (텍스트 콘텐츠 시드): `prototypes/uareline-prompts.md`
- M1+M2 통합: `prototypes/uareline/insta-blog-demo.md`
- (Pillow fallback용) Pretendard 무료 폰트: https://github.com/orioncactus/pretendard
- (Pillow fallback용) 카페24 무료 폰트: https://fonts.cafe24.com
- (Pillow fallback용) G마켓 산스 무료: https://corp.gmarket.com/fonts/

---

## 7. v1 → v2 변경 요약

| 항목 | v1 (2026-05-05) | v2 (2026-05-08) |
|---|---|---|
| 텍스트 처리 | GPT 배경만 + Pillow overlay 필수 | GPT 한 번에 텍스트 포함 (1단계) |
| 워크플로우 | 2단계 (GPT → Pillow) | 1단계 (GPT 만), dense는 fallback |
| 폰트 표현 | 폰트 파일명 (Pretendard.otf) | 스타일 단어 ("Korean sans-serif") |
| 14장 역프롬프트 | "NO TEXT" 명시 | 한국어 텍스트 직접 임베드 |
| 16장 prompt 파일 | overlay spec 별도 | 자체 완결 prompt |
| 총 작업시간 | 사용자 2h + Claude 3h | 사용자 1~2h + Claude 1h |
| Pillow 의존도 | 16장 모두 | 예외 3~4장만 |
