# M7 카드뉴스 디자인 레퍼런스 분석 + 역프롬프트

> Day 3 산출물 — 2026-05-05
> Input: `prototypes/디자인reference/` 14장 (메뉴판 3장 + 클립아트코리아 11장)
> 사용처: GPT image gen·HTML/CSS·Canva 작업 시 콘셉트·프롬프트 직접 인용
> 모듈 통합 위치: `02-target-uareline-prototype.md` §3 M7

---

## 0. 작업 개요

### 0-1. 무엇을 했나
- 레퍼런스 14장을 4그룹으로 분류
- 각 장에 대해:
  - **역프롬프트** (영문 — GPT image gen 직접 입력용)
  - **한국어 텍스트 스펙** (overlay로 별도 처리 — GPT는 한국어 텍스트 깨짐)
  - **컬러 팔레트** (hex)
  - **타이포그래피 힌트** (한글 폰트 추천)
  - **유어라인 매핑** (세트 1·2·3 어디 적용)
- 디자인 시스템 5종 추출 (컬러·타이포·레이아웃·여백·아이콘)
- GPT image gen 한국어 텍스트 처리 전략 3가지

### 0-2. 핵심 결론
**한국어 큰 텍스트 = GPT 이미지 생성 X.** 워크플로우는 항상 **2단계**:
1. **GPT** — 배경·일러스트·모델·소품 (영문 프롬프트로 생성)
2. **HTML/Pillow/Canva** — 한국어 큰 텍스트·로고·가격표를 이미지 위에 overlay

이 2단계 워크플로우가 14개 레퍼런스 모두 적용 가능.

---

## 1. 레퍼런스 14장 — 그룹별 역프롬프트

### 그룹 A — 메뉴판/가격표 (3장, 세트 1 직접 reference)

#### A1. `메뉴판1/스크린샷 2026-05-05 오후 9.25.20.png`

**관찰**: 가로형 레이아웃. 핑크 점선 보더. 손글씨 헤드라인 "오늘도 반하다". 좌측엔 시술 디자인 일러스트(눈썹 4종+) 우측엔 가격 테이블. 정보 밀도 매우 높음. 흰 배경. 시술 결과 일러스트가 카탈로그형.

**역프롬프트 (GPT image gen, 영문)**:
```
Wide rectangular menu layout, 16:9 aspect ratio, soft white background.
Decorative pink dotted border frame around the entire composition.
Top center: floral pink ornaments and small decorative stars.
Left side: 6 small photo-realistic eyelash design illustrations 
  arranged in a 2x3 grid, each with a thin gray label below 
  (leave label area BLANK — Korean text will be overlaid separately).
Right side: clean two-column price table area on cream/white background 
  with thin gray dividers (leave numbers/text area BLANK).
Bottom: small footer area with light gray text placeholder lines.
Overall mood: feminine, delicate, soft pastel-pink tone, 
  minimalist Korean beauty salon menu, elegant.
NO TEXT — only background, decorations, and photo placeholders.
Style: Korean magazine editorial meets pastel beauty branding.
```

**한국어 텍스트 overlay 스펙**:
- 헤드라인: "오늘도 반하다" (손글씨체 — `카페24 단정해`, 크기 36pt, 핑크 #E89BAE)
- 좌측 라벨: Natural / Cute / Sexy / Mix / Glamorous / 디자인 이름
- 우측 헤더: "EYELASH" / "EYELASH PERM" — 영문 sans-serif 14pt
- 우측 테이블: 메뉴명·가격 11종 (Pretendard Medium 12pt, 가격 Bold)
- 하단: "1:1 예약제·KC인증·0507-1320-6511" 푸터

**컬러 팔레트**: `#FFF5F8` (배경) / `#E89BAE` (핑크) / `#666666` (텍스트) / `#999999` (보조선)
**타이포 힌트**: 헤드라인 — 카페24 단정해 / 본문 — Pretendard Medium / 가격 — Pretendard Bold
**유어라인 매핑**: **세트 1 카드 1번 (메뉴 11종 가격표 가로형)** ⭐ 매우 직접적 ref. **유어라인 워터마크 핑크와 톤 정확히 일치** — 1순위 채택 후보.

---

#### A2. `메뉴판2/스크린샷 2026-05-05 오후 9.26.08.png`

**관찰**: 세로형 (인스타 1080×1350 적합). 베이지·크림 배경. 손글씨 헤드 "에쁘티". 가격 단순 텍스트 + 소요시간(min) + 가격(우측 정렬). 라인이 매우 가늘고 여백 풍부. 군더더기 없음. 정보 hierarchy 깔끔.

**역프롬프트 (GPT image gen, 영문)**:
```
Vertical Instagram carousel card, 4:5 aspect ratio (1080x1350).
Soft beige/cream textured background, subtle paper grain.
Thin horizontal divider lines (very light gray, 1px).
Generous white space, minimalist Korean beauty salon menu aesthetic.
Top center: small ornamental flourish (curved leaf or thin floral motif).
Empty layout placeholders:
  - Top header band (handwritten brand name area, leave BLANK)
  - Two section header areas (English/Korean section titles, leave BLANK)
  - Multiple horizontal rows for menu+time+price (leave BLANK with thin separator lines)
  - Bottom note area (small text)
Mood: refined, premium, magazine editorial, no decoration overload.
Color: dusty cream #F5EFE3, brown text #6B5544, ivory white space.
NO TEXT IN IMAGE.
Style: high-end Korean cafe/salon menu, Vogue Korea editorial.
```

**한국어 텍스트 overlay 스펙**:
- 헤드라인: "에쁘티" 또는 "유어라인" (캘리그래피·손글씨, 크기 32pt, 다크 브라운 #6B5544)
- 섹션 헤더: "Eyelash Extensions" / "Eyelash Perm" / "Membership" (Italic English serif 16pt)
- 본문: 메뉴명 (Pretendard 13pt) + 시간(min) (Light gray 11pt) + 가격 (우측 정렬 Bold 13pt)
- 푸터 노트: "*가격은 부가세 별도 / 1:1 예약제" (10pt regular)

**컬러 팔레트**: `#F5EFE3` (베이지 배경) / `#6B5544` (다크 브라운 텍스트) / `#C9B89A` (보조선) / `#FFFFFF` (포인트 화이트)
**타이포 힌트**: 헤드라인 — `Italianno` 또는 `카페24 빛나는별` / 본문 — `Pretendard Regular/Bold` / 영문 섹션 — `Cormorant Garamond Italic`
**유어라인 매핑**: **세트 1 카드 2번 (가격표 세로형 = 인스타 캐러셀에 최적)** ⭐⭐ 매우 직접적 ref. 미니멀·고급 톤이라 7년차 1:1 단독시술 브랜드와 정합. 1순위 fallback.

---

#### A3. `메뉴판2/스크린샷 2026-05-05 오후 9.26.14.png`

**관찰**: A2와 같은 시리즈 두 번째 카드. 헤드 "에쁘티", 섹션 "Semipermanent" (눈썹 반영구) / "Waxing". 동일 톤 유지. 좌측에 작은 ◀ 슬라이드 화살표 보임 = 캐러셀 N장 중 일부. 아래에 노트 3줄 (이벤트·할인 안내).

**역프롬프트**: A2와 동일 (시리즈 일관성). **추가 사항**:
```
Same beige/cream background and minimalist style as previous card.
Add: small left-pointing chevron icon at vertical mid-left edge 
  (carousel navigation indicator).
Add: bottom 3-line note area for fine print (leave BLANK).
Pagination dots at bottom center (3 dots, second one active).
```

**한국어 텍스트 overlay 스펙**:
- 헤드라인 동일: "에쁘티"
- 섹션 헤더: "Semipermanent" / "Waxing" (Italic serif)
- 본문 동일 양식 (메뉴+시간+가격 우측 정렬)
- 하단 3줄 노트: "*눈썹 기법에 따른 추가금은 없습니다" / "*동반 방문은..." / "*이벤트&할인 가격은 현금 결제가 입니다" (10pt)

**유어라인 매핑**: **세트 1 카드 3번 (메디핑크·웩싱·기타 보조 메뉴 별도 카드)** + 카드 4·5번도 같은 시리즈로 (3장 시리즈 일관성).

---

### 그룹 B — 단일 캠페인 광고 (5장 — 메디핑크·캠페인 ref, 세트 3)

#### B1. `9.29.41.png` — Tokoro Winter Cream

**관찰**: 모델 (한국 여성) + 화장품 용기. 블루·실버 톤. "겨울엔 수분보습" 큰 한글. 작은 아이콘 4개 (혜택). 크롭 박스 우측에 화이트 배경 + 큰 텍스트. 시즌·기능 강조.

**역프롬프트 (영문)**:
```
Vertical beauty product advertisement poster, 4:5 aspect ratio.
Cool blue/silver winter palette, glittering bokeh background.
Left half: confident young Korean woman, mid-twenties, applying 
  cream to cheek with index finger, soft natural makeup, 
  clean skin, looking calmly toward camera, wearing white tank top.
Right half: clean white/silver area with floating cosmetic jar 
  (frosted glass, silver lid, single brand label area BLANK).
Top right: small badge "TOKORO WINTER CREAM" placeholder.
Bottom row: 4 thin circular icons evenly spaced 
  (representing benefits — leave label text BLANK).
Mood: clean, premium, K-beauty winter campaign.
Lighting: soft cool daylight, gentle bokeh sparkles.
NO LARGE TEXT IN IMAGE.
```

**한국어 텍스트 overlay**:
- 큰 헤드라인: "겨울엔 수분보습" (G마켓 산스 Bold 48pt, 다크 네이비 #1F3A5F)
- 보조: "TOKORO WINTER CREAM" (영문 sans-serif 14pt, 실버 #B0C4D6)
- 4 아이콘 라벨: "수분", "탄력", "광채", "보호" 등 (Pretendard 12pt)

**컬러 팔레트**: `#D0E1EE` (라이트 블루 배경) / `#1F3A5F` (다크 네이비) / `#B0C4D6` (실버) / `#FFFFFF` (포인트)
**타이포 힌트**: 헤드 — `G마켓 산스 TTF Bold` / 영문 — `Montserrat Light` / 본문 — `Pretendard`
**유어라인 매핑**: **세트 3 카드 1번 (메디핑크 표지·시즌 캠페인 톤)** — 모델·실제 시술 사진 사용 시 그대로. 단 메디핑크는 **핑크 톤**으로 변환 필요 (블루 → 핑크 그라데이션).

---

#### B2. `9.29.51.png` — 수분·물광 윈터

**관찰**: 모델 한국 여성 + 손에 크림. 아쿠아 그린 배경. 큰 텍스트 두 줄 강조 ("수분과", "물광"). 하단 5 아이콘. 가운데 큰 글자형 디자인 (텍스트가 주인공).

**역프롬프트 (영문)**:
```
Vertical beauty campaign poster, 4:5 aspect ratio.
Aqua-mint pastel green background with soft sparkle bokeh.
Center: young Korean woman, fresh minimal makeup, 
  holding a single cosmetic tube near her chin, smiling subtly,
  shoulder-up framing.
Empty large text placeholder zones across upper-middle 
  (where Korean headlines will be added — leave BLANK).
Bottom: row of 5 small icon placeholders evenly spaced 
  (each with thin circle outline, no fill icons yet).
Mood: K-beauty hydration campaign, fresh, dewy, "glass skin".
Color: mint green #C8E6E0, white, soft cream highlights.
NO TEXT.
```

**한국어 텍스트 overlay**:
- 메인 헤드 1: "수분과 물광" (Cafe24 Ohsquare Bold 60pt, 화이트)
- 메인 헤드 2: "한 번에" (40pt, 화이트)
- 5 아이콘 라벨: "약물사용" / "수분보충" / "탄력케어" / "마무리효과" / "5분이내" 같은 짧은 단어 5개 (Pretendard 11pt)

**컬러 팔레트**: `#C8E6E0` (민트 배경) / `#FFFFFF` (메인 텍스트) / `#7BAB9F` (포인트 라인)
**유어라인 매핑**: **세트 3 카드 2번 (메디핑크 효과·5단계 process 카드)** — 핑크 톤으로 변환. 5 아이콘이 메디핑크 5회 시술 cycle 표현에 적합.

---

#### B3. `9.30.19.png` — Winter Best Gift

**관찰**: 모델 정면 (긴 머리 한국 여성). 블루·실버 그라데이션. 손글씨 영문 "Winter Best Gift". 가운데 큰 한글 "겨울 피부를 위한 완벽한 레이어링". 하단 가격 박스 (1회 119,000원 / 10회 1,190,000원 형식).

**역프롬프트 (영문)**:
```
Vertical campaign poster, 4:5 aspect ratio.
Frosty winter atmosphere, dark navy-to-blue gradient background 
  with falling snow particles or sparkle bokeh.
Center: long-haired young Korean woman, elegant, gentle smile,
  natural makeup, soft glowing skin, looking softly to side,
  shot in flat lighting with subtle blue undertone.
Top: empty space for handwritten English script title 
  (BLANK — will be added).
Middle: empty space for large Korean headline (BLANK).
Bottom: clean rectangular pricing box outlined in thin gold/silver 
  with two empty rows for prices (BLANK).
Subtle decorative snowflake icons in corners (small, sparse).
Style: Korean dermatology/aesthetic clinic premium winter campaign.
NO TEXT IN IMAGE.
Color: deep blue #1A2B4D, ice silver #C5D5E5, soft white highlights.
```

**한국어 텍스트 overlay**:
- 영문 손글씨 톱: "Winter Best Gift" (`Italianno` 또는 `Pinyon Script` 36pt, 화이트)
- 한글 메인: "겨울 피부를 위한 / 완벽한 레이어링" (Cafe24 Ohsquare 32pt, 화이트, 2줄)
- 가격 박스: "1회 119,000원" / "10회 1,190,000원" (Pretendard Bold 18pt 가격, Light 12pt 라벨)

**컬러 팔레트**: `#1A2B4D` (다크 네이비) / `#C5D5E5` (실버) / `#FFFFFF` (포인트) / `#E5C77F` (골드 라인)
**유어라인 매핑**: **세트 3 카드 3번 (메디핑크 패키지 가격 카드)** — "겨울 피부" → "여성 케어" 또는 "출산 후 케어"로 변환. 가격 박스 레이아웃이 패키지 시술 안내에 직접 사용 가능.

---

#### B4. `9.30.26.png` — 잃어버린 피부, 밸런스를 되찾다

**관찰**: 모델 정면 (한국 여성, 손가락이 입가에). 라벤더 톤. 큰 한글 헤드 "잃어버린 피부, 밸런스를 되찾다". 우측 가격 박스 1회 119 / 10회 1,190. 영문 보조 "VIRGINIA EDITION".

**역프롬프트 (영문)**:
```
Vertical premium campaign poster, 4:5 aspect ratio.
Lavender/dusty purple gradient background with soft sparkle bokeh.
Center-left: young Korean woman with index finger touching cheek,
  natural makeup, hair in soft updo, calm confident expression,
  shoulders visible, premium photography.
Right side: empty pricing box with two rows (BLANK).
Top right: small italic English subtitle placeholder.
Center: large empty headline area (BLANK Korean text).
Bottom: tiny brand name placeholder.
Mood: aesthetic clinic, premium, balance-themed, regaining confidence.
Color: lavender #C9B8DC, deep purple #6B4C8A, white highlights.
NO TEXT.
```

**한국어 텍스트 overlay**:
- 메인 헤드: "잃어버린 피부, / 밸런스를 되찾다" (Cafe24 Ohsquare Bold 36pt, 화이트)
- 영문 보조: "VIRGINIA EDITION" (Cormorant Italic 14pt, 라벤더 화이트)
- 가격: "1회 119,000원 / 10회 1,190,000원"

**컬러 팔레트**: `#C9B8DC` (라벤더) / `#6B4C8A` (딥 퍼플) / `#FFFFFF` (포인트)
**유어라인 매핑**: **세트 3 카드 4번 (메디핑크 변화 캠페인 — Before 잃은 자신감 → After 회복)**. 라벤더 톤이 여성 부위 케어와 톤 매칭.

---

#### B5. `9.30.44.png` — 겨울 첫눈 성형

**관찰**: 모델 정면 (한국 여성, 어깨까지). 퍼플·라일락 배경. 별·반짝이 데코. Before/After 작은 사진 2장 하단. 큰 한글 손글씨 톱 "겨울 첫눈 성형". 영문 "1주 만에 변화의" 같은 카피. 의료 클리닉 광고 톤.

**역프롬프트 (영문)**:
```
Vertical clinic campaign banner, 16:9 ratio (or 4:5).
Dreamy purple-lilac gradient background with floating star icons 
  and soft glitter sparkles.
Right half: shoulder-up portrait of fresh young Korean woman,
  long straight black hair, no makeup or minimal, smooth glowing skin,
  small confident smile, looking at camera.
Left side top: empty space for large handwritten Korean headline.
Left side middle: empty body text area.
Left side bottom: two small circular before/after photo placeholders 
  (with thin labels — BLANK).
Decorative element: small purple stars and sparkle lines.
Mood: Korean medical aesthetic clinic, transformation, dreamy.
Color: lavender #DDC3F0, purple #9B7BC9, soft pink highlight.
NO TEXT.
```

**한국어 텍스트 overlay**:
- 메인 헤드 (손글씨): "겨울 첫눈 성형" (Cafe24 빛나는별 또는 손글씨 캘리그래피 48pt, 화이트)
- 보조: "1주 만에 변화의" (Pretendard Light 14pt)
- Before/After 라벨: "노부 시안언점가" "베프거 노 해소된" (예시 — 실제로 채울 텍스트)

**컬러 팔레트**: `#DDC3F0` (라일락) / `#9B7BC9` (퍼플) / `#FFFFFF`
**유어라인 매핑**: **세트 3 카드 5번 (메디핑크 Before/After 비교 카드)** — 시술 결과 사진 합성 자리가 명확. "겨울 첫눈" → "유어라인 메디핑크"로 변환. 별 데코는 사장 인스타 톤(♡, ♡♡)과 일치.

---

### 그룹 C — 카드뉴스 시리즈 (2장 — 시리즈 디자인 ref, 세트 2 비교 카드)

#### C1. `9.30.07.png` — 윈터 케어 6장 시리즈

**관찰**: 6장 카드 그리드 미리보기. 베이지·모브·연핑크 톤. 각 카드는 "Winter Color Palette / Winter Skincare Tips / Winter Mood / Winter Foot Care" 다른 주제. 통일성: 같은 폰트·여백·소품(꽃·돌·종이질감). 모델 사진 + 일러스트·소품 혼합.

**역프롬프트 (영문, 6장 시리즈 톤 추출)**:
```
Series of 6 Instagram square carousel cards (1:1 each), 
arranged in a 3x2 preview grid.
Cohesive Korean editorial winter beauty mood:
  - Soft beige and dusty mauve color palette
  - Each card has either: a portrait, a still-life flat lay, 
    or a typography-heavy minimal layout
  - Common props: dried flowers, white pebbles, 
    cream-colored fabric, cosmetic jars
  - Uniform thin sans-serif font (placeholder text — BLANK)
  - Generous white space, soft shadows
  - Subtle paper texture overlay
Mood: editorial magazine spread, calm, premium.
Color: cream #F5EBE0, mauve #D4B5B0, soft pink #F2DCDC.
NO TEXT.
```

**한국어 텍스트 overlay (시리즈 6장)**:
- 카드 1 표지: "유어라인 가이드" + 부제 "내 눈매에 맞는 디자인" (Pretendard Bold 28pt + Light 14pt)
- 카드 2: "J컬 — 자연스러운 라인" + 설명 3줄
- 카드 3: "C컬 — 또렷한 인상" + 설명 3줄
- 카드 4: "D컬 — 강한 컬링" + 설명 3줄
- 카드 5: "내 눈매별 추천" 비교 표 (4가지 눈매 × 3 컬)
- 카드 6: 마무리 CTA "0507-1320-6511 또는 카톡 채널로 상담" + 워터마크

**컬러 팔레트**: `#F5EBE0` (크림) / `#D4B5B0` (모브) / `#F2DCDC` (소프트 핑크) / `#5A4A4A` (텍스트)
**타이포 힌트**: `Pretendard` 한 패밀리만 사용 (Bold·Regular·Light 세 굵기로 hierarchy)
**유어라인 매핑**: **세트 2 전체 (컬·디자인 비교 6장 카드뉴스)** ⭐⭐⭐ — 시리즈 톤·여백·소품 그대로 인용. 모브 톤이 유어라인 핑크와도 잘 어울림.

---

#### C2. `9.31.43.png` — Banner Design 4분할

**관찰**: 4장 카드 (눈썹·뷰티·피부·레이저). 각각 다른 컬러·다른 사진·다른 한글 헤드. "Banner Design" 라벨. 광고 배너 시리즈 ref. 컬러 다양 (연블루·옐로·핑크·민트). 정사각형 1:1.

**역프롬프트 (영문)**:
```
Set of 4 square 1:1 Instagram banner card designs displayed in a grid.
Each card has a unique pastel color theme:
  - Card 1: pale blue background, profile portrait of Korean woman 
    in profile view (left side), text area on right (BLANK)
  - Card 2: warm yellow/cream background, eye-area close-up photo, 
    text area with small handwritten English script (BLANK)
  - Card 3: soft pink background, woman with hand near face, 
    confident pose (BLANK headline)
  - Card 4: pale mint green background, leg/skin texture close-up, 
    text area with bold headline placeholder (BLANK)
Top of grid: small caption "BANNER DESIGN" in thin serif.
Mood: K-beauty advertising banner template, varied yet cohesive.
NO TEXT.
```

**한국어 텍스트 overlay (4장 분할)**:
- 카드 1 (블루): "눈썹이 다 했다" (헤드 32pt) — 눈썹 시술
- 카드 2 (옐로): "눈썹미인" + 영문 손글씨 "Beauty" — 캘리그래피
- 카드 3 (핑크): "피부에 빛나다" — 피부 케어
- 카드 4 (민트): "매끈매끈해 / 레이저 제모" — 제모

**유어라인 매핑**: **컬러 배리에이션 시스템 ref** — 유어라인 카드뉴스 변형 4종 컬러 셋업에 직접 인용. 메디핑크는 핑크, 디자인 비교는 모브, 가격표는 베이지·블루 등 톤별 분기 가능.

---

### 그룹 D — 단일 광고/배너 (4장 — 보조 inspirations)

#### D1. `9.32.18.png` — Beauty Make-up 다크

**관찰**: 모델 (한국 여성, 눈웃음 + 검지 입가) + "BEAUTY MAKE-UP" 헤드 + 8개 아이콘 사방에 배치 (eye / nose / cheek / lip 등). 다크 그레이·블랙 배경. 럭셔리 매거진 톤.

**역프롬프트 (영문)**:
```
Wide horizontal layout, 16:9 aspect ratio.
Dark charcoal/black gradient background.
Center: half-body portrait of young Korean woman, 
  smooth skin, soft makeup, hand near face with index finger,
  gentle smile, fashionable hair, premium glossy lighting.
Around the figure: 8 small thin circular icon placeholders 
  arranged in a wide oval pattern (4 on each side), 
  each with a tiny label area beside it (BLANK).
Top center: small minimalist serif title placeholder "BEAUTY MAKE-UP".
Bottom right: faint signature placeholder.
Mood: high-end magazine editorial spread, dark luxury, K-beauty.
Color: charcoal #2C2C2C, gold accents #C9A960, ivory highlights.
NO LARGE TEXT.
```

**한국어 텍스트 overlay**:
- 톱 라벨: "BEAUTY MAKE-UP" (Cormorant Garamond 18pt, 화이트)
- 8 아이콘 라벨: "Eye Make-up / Nose / Cheek / Lip / Brow / Skin / Hair / Lash" (Pretendard Light 11pt, 화이트)

**유어라인 매핑**: **세트 2 표지 카드 (또는 진단 리포트 디자인 ref)** — 다크 톤은 유어라인 핑크와 안 맞으나, **8 아이콘 방사형 배치**가 메디핑크·시술 메뉴 안내에 활용 가능.

---

#### D2. `9.32.31.png` — Sale 50% off

**관찰**: 모델 (정면 한국 여성, 미소). 베이지·옐로 배경 + 별·반짝이. 큰 빨간 원 "Sale 50% off" 좌상단. 하단 박스 "자연눈썹·앵클특가". 명료·이벤트 톤.

**역프롬프트 (영문)**:
```
Vertical promotional poster, 4:5 aspect ratio.
Warm beige/yellow background with sparkle stars decoration.
Center-right: bust portrait of Korean woman with bright smile,
  natural makeup, casual bright atmosphere.
Top-left: large red/coral circular badge placeholder 
  for "SALE 50% OFF" (BLANK — design but no text).
Bottom: two stacked rectangular pill-shaped buttons/labels 
  (cream filled, brown outline — BLANK text).
Center: small handwritten script line in subtle gray (BLANK).
Mood: Korean event promotion poster, friendly, fresh, attention-grabbing.
Color: cream #F8E8B6, coral red #E85A4F, soft brown #6B4C2A.
NO TEXT.
```

**한국어 텍스트 overlay**:
- Sale 원: "Sale 50% off" (Italic Sans Bold 24pt, 화이트)
- 메인 핸드라이팅: "자연눈썹하고 휴가지에서 쌩얼로 인생샷!" (Cafe24 단정해 14pt, 그레이)
- 두 박스: "자연눈썹" / "앵클특가" (Pretendard Bold 16pt, 다크 브라운)

**유어라인 매핑**: **세트 3 카드 5번 (메디핑크 첫 시작 캠페인·상담 무료)** — Sale 원 디자인 그대로 인용 가능. "메디핑크 신규 시술 무료 상담" 같은 메시지에 활용.

---

#### D3. `9.32.41.png` — 4분할 미니멀

**관찰**: 4분할 (입술·네일·머릿결·눈썹). 각각 다른 톤 (라벤더·소프트 핑크·블루·다크 베이지). 큰 한글 헤드 + 작은 본문. 미니멀 타이포 중심. 사진보다 텍스트가 주인공.

**역프롬프트 (영문)**:
```
Set of 4 square 1:1 cards in a grid:
  - Card 1: lavender background, small lip close-up photo, 
    typography-focused
  - Card 2: cream background, English handwritten script, 
    simple text composition
  - Card 3: dusty pink background, woman's neck/hair side profile
  - Card 4: charcoal grey background, shoulder portrait
Each card minimalist: 80% empty space, single photo accent, 
clean sans-serif text placeholders (BLANK).
Mood: Korean editorial magazine, premium typography-driven design.
NO TEXT — only colored backgrounds, photo placements, layout.
```

**한국어 텍스트 overlay (4장)**:
- 카드 1 (라벤더): "촉촉입술" + "포토부스에서 쩝쩝쩝~" 미니 카피
- 카드 2 (크림): 큰 따옴표 + "네일아트가 더 중요해요" 인용
- 카드 3 (핑크): "실키 머릿결" + 미니 카피
- 카드 4 (다크 베이지): "눈/썹/미/남" 세로 글자 분할 디자인

**컬러 팔레트**: 라벤더 #DCC9DD / 크림 #F5EFE3 / 핑크 #E8C5C0 / 다크 베이지 #6B5544
**유어라인 매핑**: **세트 2 카드 5·6번 (디자인 비교 미니멀 버전)** — 텍스트 위주의 디자인. 모델 사진 부족 시 활용. "눈/썹/미/남" 세로 분할이 유어라인 컬·디자인 4분할 표기에 직접 인용 가능.

---

### 그룹 E — 이벤트형 광고 (1장)

#### E1. `9.32.56.png` — 뷰티 노하우 대공개

**관찰**: 핑크·옐로 그라데이션 배경. 그래픽 일러스트 (마스카라·립스틱·아이라이너 위·하단). 큰 한글 톱 "벚꽃보다 더 화려한" + "나만의 뷰티노하우 대공개 이벤트". 가운데 흰 박스에 이벤트 안내 글자 가득. CKBHF 같은 코드.

**역프롬프트 (영문)**:
```
Vertical event poster, 4:5 aspect ratio.
Pink-to-yellow soft gradient background with cherry blossom petals.
Top: large flat illustration of cosmetic items 
  (mascara, lipstick, eyeliner) scattered diagonally.
Bottom: matching cosmetic items illustration on opposite side.
Center: white rounded rectangle box with empty area 
  for event details (BLANK).
Top: handwritten Korean script placeholder.
Mood: Korean spring beauty campaign event, playful yet refined, 
romantic.
Color: cherry pink #FFCBD8, sunny yellow #FFEE9F, white center.
NO TEXT IN BACKGROUND.
```

**한국어 텍스트 overlay**:
- 톱 손글씨: "벚꽃보다 더 화려한" (Cafe24 단정해 24pt, 다크 핑크)
- 메인 헤드: "나만의 뷰티노하우 대공개 이벤트" (Cafe24 Ohsquare Bold 32pt)
- 본문 박스: 이벤트 절차 5줄 + 응모 안내 + 당첨 안내
- 풋: "이벤트 참여하기" CTA 버튼

**유어라인 매핑**: **메디핑크 캠페인 보조 카드** (세트 3 추가 카드로 활용 가능). 사장 핑크 톤 + 이벤트 박스 레이아웃 직접 활용 가능. 봄 시즌 → "메디핑크 봄맞이 캠페인"으로 변환 가능.

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

| 역할 | 폰트 | 크기 (1080×1350) | 굵기 |
|---|---|---|---|
| 손글씨 헤드 (브랜드·캠페인명) | `Cafe24 단정해` 또는 `카페24 빛나는별` | 36~60pt | Regular |
| 메인 헤드 (한글) | `Cafe24 Ohsquare Bold` 또는 `G마켓 산스 TTF Bold` | 28~48pt | Bold |
| 부제 (영문) | `Cormorant Garamond Italic` 또는 `Italianno Script` | 14~24pt | Italic |
| 본문·라벨 | `Pretendard Regular/Medium/Bold` | 11~16pt | 3 굵기 |

→ **3종 폰트 패밀리만**: 손글씨 + 메인 + Pretendard.

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

## 3. GPT image gen 사용 가이드

### 3-1. 한국어 텍스트 처리 — **3가지 워크플로우**

#### 워크플로우 A — **GPT 배경만 + 한국어 overlay (Pillow)** ⭐ 추천 (최고 품질)
```
[Step 1] GPT image gen으로 위 역프롬프트 사용 → 배경 + 모델 + 데코만 생성
         (텍스트 자리는 BLANK, "NO TEXT" 명시)
[Step 2] Python Pillow로 한국어 텍스트 overlay
         - 폰트 파일 지정 (Pretendard.otf, Cafe24-Ohsquare.ttf 등)
         - 색상·위치 spec대로 합성
[Step 3] PNG 출력 → 인스타 업로드
```
- 장점: 한국어 100% 정확, 디자인 컨트롤 완벽
- 단점: Pillow 코드 작성 필요 (1회만 만들면 재사용)

#### 워크플로우 B — **GPT 배경만 + Canva overlay** (코드 없음)
```
[Step 1] GPT image gen → 배경 PNG 다운로드
[Step 2] Canva 빈 캔버스 → 배경 업로드 → 한국어 텍스트 추가
[Step 3] PNG 다운로드
```
- 장점: 코드 없음, 즉시 시각 결과
- 단점: 매번 사장이 직접 작업 (자동화 X)

#### 워크플로우 C — **HTML+CSS Puppeteer 캡쳐** (자동화 최강)
```
[Step 1] HTML 템플릿 작성 (배경 이미지 + 한국어 텍스트 layer)
[Step 2] Puppeteer로 1080×1350 캔버스 캡쳐
[Step 3] PNG 출력
```
- 장점: 자동화 100%, 사장이 사진·텍스트 input만 카톡 → 완성품 자동
- 단점: HTML 템플릿 1회 작성 필요 (~3h)

### 3-2. 추천: **세트별 워크플로우 분기**

| 세트 | 추천 워크플로우 | 이유 |
|---|---|---|
| 세트 1 (가격표 영구) | A (Pillow) | 1회 만들면 끝, 한국어 정확도 ↑ |
| 세트 2 (디자인 비교 영구) | A (Pillow) 또는 B (Canva) | 1회 자산. 사장이 직접 수정 가능하면 B |
| 세트 3 (메디핑크 캠페인) | A (Pillow) | 시즌 캠페인 — 자주 갱신됨 |
| 일상 단일 사진 (M1 통합) | C (HTML+Puppeteer) | 사장 사진 1장 input → 자동 완성 |

### 3-3. GPT 프롬프트 작성 4-원칙

레퍼런스 14장에서 추출한 패턴:
1. **NO TEXT IN IMAGE** 명시 — 한국어 깨짐 방지
2. **레이아웃 정확히 묘사** — "left half", "top right" 등 구역 명시
3. **컬러 hex 또는 톤 단어** — `dusty cream`, `lavender`, `aqua mint`
4. **모드/스타일** — `Korean editorial magazine`, `K-beauty premium`, `Vogue Korea`

---

## 4. 사용자 작업 워크플로우 (M7 진행)

### Phase 1 — 컨셉 결정 (사용자 결정 5분)
1. 본 문서의 **유어라인 매핑** 표 확인
2. 각 세트별 1순위 ref 결정:
   - 세트 1 가격표 → A1 (가로) 또는 A2/A3 (세로) 중 1
   - 세트 2 디자인 비교 → C1 (6장 시리즈) 채택
   - 세트 3 메디핑크 → B1·B2·B3·B4·B5 중 톤 1개 선택

### Phase 2 — 텍스트 콘텐츠 (Claude 자동, 30분)
- 세트별 카드별 텍스트 콘텐츠 작성 (메뉴 11종 / 컬 비교 / 메디핑크 효과)
- 본 문서의 "한국어 텍스트 overlay 스펙"을 그대로 채움

### Phase 3 — GPT 이미지 생성 (사용자 또는 Claude, 1~2h)
- 본 문서의 영문 역프롬프트를 GPT image gen에 직접 입력
- 카드별 배경 1장씩 생성 (총 ~16장: 5+6+5)
- 마음에 안 들면 프롬프트 수정 후 재생성 (보통 1~2회)

### Phase 4 — 한국어 overlay 합성 (Claude 자동, 1h)
- Pillow 코드 1회 작성 (다음 카드도 재사용)
- Phase 3 배경 + Phase 2 텍스트 결합 → PNG 16장 출력

### Phase 5 — 사장 검수 + 최종 다듬기 (베타 D-Day 미팅)
- 사장에게 16장 보여주고 톤·색상·텍스트 검수
- 정정 1라운드 (Pillow 코드 수정으로 일괄 반영)

**총 소요**: 사용자 1~2h (이미지 생성·검수) + Claude 2h (텍스트·코드)

---

## 5. 한계 + 보완

### 5-1. GPT image gen 한계 (현실 인정)
- 한국어 큰 글자: 깨짐 → 항상 overlay 필수
- 모델 사진 일관성: 시리즈 내 다른 카드에서 같은 모델 유지 어려움 → **사장 실제 손님 사진** 또는 **사장 본인 사진** 권장
- 화장품 제품 정확성: 유어라인 영양제 제품 그대로 생성 X → 실제 제품 사진 합성 필요

### 5-2. 합성 시 사용자가 준비할 것
- **유어라인 워터마크 PNG** (사장 인스타에서 추출 가능, 핑크 `U're Line`)
- **시술 결과 사진 5~10장** (이미 받은 3장 + 인스타 31장 활용 가능)
- **로고·브랜드 컬러 정확한 hex** (사장 확인 — 추정 #E89BAE)
- **폰트 파일** (Pretendard·Cafe24 단정해·G마켓 산스 — 모두 무료, 사장 PC에 다운로드만)

### 5-3. 시리즈 일관성 유지 팁
- Phase 3에서 모든 카드 배경을 **같은 GPT 세션 한 번에 생성** (시각 톤 일관성 ↑)
- 또는 1장 생성 후 "make 5 variations" 명령
- 모델은 1~2명 고정 (다양성 너무 많으면 시리즈 흐트러짐)

---

## 6. 외부 참조

- 레퍼런스 14장 raw: `prototypes/디자인reference/`
- 사용자 시술 사진 4장: `sample_pictures_0505/`
- 사장 인스타 31장 (모델 sample): `Day1_data_collection/인스타 게시물/`
- 사장 톤 프롬프트 v3 (텍스트 콘텐츠 시드): `prototypes/uareline-prompts.md`
- M1+M2 통합 (단일 사진 워크플로우 C 적용): `prototypes/uareline/insta-blog-demo.md`
- Pretendard 무료 폰트: https://github.com/orioncactus/pretendard
- 카페24 무료 폰트: https://fonts.cafe24.com
- G마켓 산스 무료: https://corp.gmarket.com/fonts/
- GPT image gen 한국어 가이드: 본 문서 §3-1 워크플로우 A 채택 권장
