# 🎨 GPT 이미지 생성 프롬프트 — 16장 카드뉴스 배경

> **사용자 작업 가이드** — GPT-5.5에 영문 프롬프트 그대로 복붙 → 배경 이미지 생성 → 지정 폴더에 저장
>
> 사용자 결정 반영: D1=c (가로+세로) / D2=b (유어라인 핑크) / D3=d (라벤더 메디핑크)
> 작성: 2026-05-05

---

## 🚀 사용 방법 (3단계)

### Step 1. GPT-5.5에서 이미지 생성
- 각 카드의 **English prompt**를 그대로 복붙
- 카드 한 장당 **2~3회 variation 생성** (마음에 드는 거 1장 채택)
- "NO TEXT" 명시했으니 깨끗한 배경만 나옴 (한국어 텍스트는 별도 합성)

### Step 2. 이미지 저장 — 지정 폴더
```
sample_pictures_0505/                           # ← 사장 시술 사진 (이미 있음)
prototypes/uareline/design-cards/
├── set1_pricing/raw/                           ← 여기에 5장 저장
│   ├── 1A_menu_landscape.png                   # 가로 16:9 PDF용
│   ├── 1B1_cover_vertical.png                  # 세로 표지
│   ├── 1B2_eyelash_extensions.png              # 연장 가격표
│   ├── 1B3_eyelash_perm.png                    # 펌 가격표
│   └── 1B4_membership_medipink.png             # 멤버십+메디핑크
├── set2_curl_compare/raw/                      ← 여기에 6장 저장
│   ├── 2A_cover.png                            # 표지
│   ├── 2B_jcurl.png                            # J컬
│   ├── 2C_ccurl.png                            # C컬
│   ├── 2D_dcurl.png                            # D컬
│   ├── 2E_eyetype_match.png                    # 눈매별 매칭 표
│   └── 2F_cta.png                              # 상담 CTA
└── set3_medipink/raw/                          ← 여기에 5장 저장
    ├── 3A_cover_campaign.png                   # 캠페인 표지
    ├── 3B_effect_5steps.png                    # 5단계 효과
    ├── 3C_pricing_package.png                  # 패키지 가격
    ├── 3D_before_after.png                     # Before/After 비교
    └── 3E_cta_event.png                        # CTA + 7월 오픈
```

### Step 3. 저장 완료 알림 (한 줄)
저장 끝나면 한 줄로 알려주면 됨:
> "이미지 16장 저장 완료. design-cards/{set1,set2,set3}/raw/ 확인해줘"

→ Claude가 즉시 Pillow overlay 코드 작성 + 한국어 텍스트 합성 → 최종 PNG 16장 출력

---

## 🎨 세트 1 — 가격표 5장 (D1=c 둘 다)

### Card 1A — 가로 PDF 메뉴판 (16:9)
**저장: `set1_pricing/raw/1A_menu_landscape.png`**

#### English prompt
```
Wide horizontal salon menu layout, 16:9 aspect ratio (1920x1080).
Soft pastel pink background #FFF5F8 with delicate floral ornaments.
Pink dotted border frame around the entire composition (1px dashed, color #E89BAE).
Top center: small handwritten-style ornament space (BLANK — text overlaid separately).
Left half: 6 placeholder areas for small lash design illustrations 
  arranged in a 2x3 grid, each with thin gray label box below (BLANK).
Right half: clean two-column structure for menu and prices, 
  divided by thin gray line (color #999999).
  Each row has BLANK areas for menu name (left) and price (right-aligned).
Section divider headers (2 zones): empty space for "EYELASH" and "EYELASH PERM".
Bottom: footer area with light gray text placeholder lines.
Overall mood: feminine, delicate, soft pastel-pink Korean beauty salon menu.
Style: Korean magazine editorial meets pastel beauty branding, premium yet approachable.
ABSOLUTELY NO TEXT — only background, decorative dotted border, blank placeholders.
```

#### 한국어 overlay (별도 합성)
- 헤드라인: `오늘도 반하다` (Cafe24 단정해 36pt, #E89BAE)
- 좌측 라벨 6개: Natural / Cute / Sexy / Mix / Glamorous / 디자인명
- 우측 헤더: `EYELASH` / `EYELASH PERM`
- 우측 메뉴 11종 + 가격
- 하단 푸터: `1:1 예약제 · KC인증 글루 · 010-4908-6511`

#### Color
배경 #FFF5F8 / 핑크 #E89BAE / 텍스트 #5A4A4A / 보조선 #999999

---

### Card 1B1 — 세로 표지 (4:5)
**저장: `set1_pricing/raw/1B1_cover_vertical.png`**

#### English prompt
```
Vertical Instagram cover card, 4:5 aspect ratio (1080x1350).
Soft cream-pink background #FFF0F2 with very subtle paper texture.
Top center: empty space for elegant calligraphic Korean brand name (BLANK).
Center: empty large area for handwritten-style headline text (BLANK).
Bottom center: small decorative element — thin pink line with tiny floral motif (#E89BAE).
Bottom: empty space for Instagram handle / brand name placeholder.
Generous white space, minimalist Korean beauty salon menu opening card.
Mood: refined, premium, magazine editorial cover, calm welcoming.
NO TEXT IN IMAGE — only background, subtle decorations, blank zones.
Style: Vogue Korea cover meets K-beauty pastel branding.
```

#### 한국어 overlay
- 헤드: `유어라인` (Cafe24 빛나는별 캘리그래피 56pt, #E89BAE)
- 부제: `시술 안내 가격표` (Pretendard Light 18pt, #5A4A4A)
- 풋: `@ure.line` (Pretendard 12pt, #999999)

#### Color
배경 #FFF0F2 / 핑크 #E89BAE / 텍스트 #5A4A4A

---

### Card 1B2 — 세로 연장 가격표 (4:5)
**저장: `set1_pricing/raw/1B2_eyelash_extensions.png`**

#### English prompt
```
Vertical Instagram carousel card, 4:5 aspect ratio (1080x1350).
Soft pastel pink background #FFF5F8 with subtle paper grain.
Top: empty header band for Korean section title (BLANK).
Below header: thin horizontal divider line (1px, color #E0C5CB).
Middle: 7 empty horizontal rows, each with light divider lines between them.
  Each row has 3 zones: left (menu name placeholder), 
  middle (small time/min placeholder), right (price placeholder, right-aligned).
All text zones BLANK.
Bottom: small italic English text placeholder line.
Side: tiny pagination dots indicator (3 dots, second dot active).
Generous margins, minimalist Korean beauty editorial menu page.
Mood: clean, premium, soft pink, organized.
Color: background #FFF5F8, divider #E0C5CB, text dark gray placeholder.
NO TEXT.
```

#### 한국어 overlay (메뉴 7종)
- 섹션 헤더: `Eyelash Extensions` (Cormorant Italic 18pt, #B8868F)
- 7행 (메뉴 / 시간 / 가격):
  1. `글루연장 하프 (50%)` / `90min` / `44,000원`
  2. `글루연장 맥스 (90%)` / `150min` / `66,000원`
  3. `LED연장 변경 추가` / `+0min` / `+11,000원`
  4. `펌포인트 / 마스카라 연장` / `150min` / `66,000원`
  5. `디자인 추가 (부분 볼륨)` / `+30min` / `+11,000원`
  6. `디자인 추가 (전체 볼륨)` / `+30min` / `+22,000원`
  7. `타샵 연장 제거` / `30min` / `11,000원`
- 풋: `* @시술시 EYE클리닉케어 & 샴푸서비스 무료`

#### Color 동일

---

### Card 1B3 — 세로 펌 가격표 (4:5)
**저장: `set1_pricing/raw/1B3_eyelash_perm.png`**

#### English prompt
```
Same style as previous card (vertical 4:5, pastel pink #FFF5F8).
Top: empty header band for Korean section title (BLANK).
Below: thin divider line.
3 empty horizontal rows for menu items (menu / time / price layout).
Bottom 1/3: subtle highlighted box area (slightly more saturated pink #FFE4EC) 
  for emphasis content (BLANK — section title + description placeholder).
Side: pagination dots (3 dots, third active).
NO TEXT.
```

#### 한국어 overlay
- 섹션 헤더: `Eyelash Perm`
- 3행:
  1. `유어라인 클리닉 영양펌` / `90min` / `33,000원`
  2. `영양 블랙 틴팅펌` / `120min` / `44,000원`
  3. `펌포인트 연장 (펌+연장)` / `150min` / `66,000원`
- 강조 박스: `유어라인만의 올인원 영양펌` 헤드 + `영양 가득 가득 + 결뭉 영양제 마무리` 부제

---

### Card 1B4 — 세로 멤버십 + 메디핑크 (4:5)
**저장: `set1_pricing/raw/1B4_membership_medipink.png`**

#### English prompt
```
Same style as previous (vertical 4:5, pastel pink #FFF5F8).
Top half: empty header band + 4 empty rows for membership tiers 
  (each row with 3 columns: tier name / sessions / price).
Bottom half: divided by stronger horizontal line, 
  empty header for second section + 1 prominent placeholder row.
Footer: 3-line note area (small text, light gray).
NO TEXT.
```

#### 한국어 overlay
- 상단 헤더: `Membership`
- 4행:
  1. `베이직 연장 6회권` / `260,000` (10% 할인 적용)
  2. `베이직 연장 12회권` / `500,000`
  3. `LED연장 6회권` / `330,000`
  4. `LED연장 12회권` / `550,000`
- 하단 헤더: `Medipink — 메디컬 멜라닌 케어`
- 1행: `메디핑크 (변동, 방문 상담)` + 부제 `유륜·외음부·바디 화이트닝 케어`
- 풋 3줄: `* 회원권은 첫 시술 시 결제 가능` / `* 가격은 부가세 포함` / `* 모든 시술은 1:1 예약제`

---

## 🎨 세트 2 — 컬·디자인 비교 6장 (D2=b 유어라인 핑크 톤)

### Card 2A — 표지 (4:5)
**저장: `set2_curl_compare/raw/2A_cover.png`**

#### English prompt
```
Vertical Instagram cover card, 4:5 (1080x1350).
Soft pink-to-cream gradient background, top #FFE4EC fading to bottom #FFF5F8.
Center: large empty oval shape for portrait photo placement (BLANK photo zone),
  surrounded by very thin pink line border #E89BAE.
Top: empty space for handwritten-style English subtitle (BLANK).
Below center oval: empty area for Korean main headline (large, BLANK).
Bottom: thin pink line + small floral ornament + handle placeholder.
Tiny scattered heart/sparkle decorations in soft pink (3-4 small ones).
Mood: K-beauty editorial cover, soft, inviting, feminine.
Style: Vogue Korea pink edition, refined.
NO TEXT.
```

#### 한국어 overlay
- 영문 서브: `your line beauty guide` (Italianno 32pt)
- 메인 헤드: `내 눈매에 / 맞는 컬은?` (Cafe24 Ohsquare Bold 44pt, 화이트 또는 #5A4A4A)
- 풋: `1:1 단독시술 · 유어라인` + `@ure.line`

---

### Card 2B — J컬 소개 (4:5)
**저장: `set2_curl_compare/raw/2B_jcurl.png`**

#### English prompt
```
Vertical card, 4:5, pastel pink background #FFF5F8.
Layout: top 60% photo zone (empty rounded-rectangle frame with soft shadow),
bottom 40% text zone (BLANK for content).
Top right corner: small circular badge with pink outline (BLANK — for "01" label).
Bottom: small Korean curl shape line illustration 
  (a simple curve drawn in #E89BAE showing the natural J shape, very subtle).
3 small bullet point markers (filled pink dots) in the text zone (text BLANK).
Side: pagination dots (6 dots total, dot 2 active).
Mood: clean, comparison guide style, premium pink.
NO TEXT.
```

#### 한국어 overlay
- 라운딩 사진 배지: `01` (Cafe24 Ohsquare 24pt, #E89BAE)
- 메인 헤드: `J컬 — 가장 자연스러운 라인` (Cafe24 Ohsquare Bold 28pt, #5A4A4A)
- 3 bullets:
  - `자연스러운 차분한 인상`
  - `평소에 거의 안 한 듯한 무드`
  - `신부 메이크업·면접·일상 추천`

---

### Card 2C — C컬 소개 (4:5)
**저장: `set2_curl_compare/raw/2C_ccurl.png`**

#### English prompt
```
Same layout as previous (4:5, pink #FFF5F8, 60/40 split, dot indicator at 3).
Bottom corner ornament: a curve illustration showing C-shape (medium curl).
NO TEXT.
```

#### 한국어 overlay
- 사진 배지: `02`
- 헤드: `C컬 — 또렷한 인형 속눈썹`
- 3 bullets:
  - `볼륨감과 또렷한 인상`
  - `눈을 더 크게 보이게 하는 효과`
  - `데일리·셀카·여행 추천`

---

### Card 2D — D컬 소개 (4:5)
**저장: `set2_curl_compare/raw/2D_dcurl.png`**

#### English prompt
```
Same layout (4:5, pink #FFF5F8, 60/40 split, dot indicator at 4).
Bottom corner ornament: a strong curl illustration (D-shape, more dramatic).
NO TEXT.
```

#### 한국어 overlay
- 사진 배지: `03`
- 헤드: `D컬 — 가장 강한 컬링`
- 3 bullets:
  - `드라마틱한 라인 + 풍성한 볼륨`
  - `결혼식·파티·이벤트에 강추`
  - `짧은 속눈썹도 길어 보이게`

---

### Card 2E — 눈매별 매칭 표 (4:5)
**저장: `set2_curl_compare/raw/2E_eyetype_match.png`**

#### English prompt
```
Vertical card, 4:5, pink #FFF5F8.
Center: empty matrix table layout — 4 rows x 4 columns, 
  each cell is a soft rounded square placeholder (BLANK).
Top header row (Korean labels — BLANK).
Left header column (Korean labels — BLANK).
Cell rows show small icons or recommendation marks (BLANK — overlay later).
Title area at top (BLANK).
Footer: small note line (BLANK).
Mood: clean comparison infographic, K-beauty editorial.
NO TEXT.
```

#### 한국어 overlay (4×4 매트릭스)
- 헤드: `내 눈매별 추천 컬`
- 가로 헤더: 눈매 / J컬 / C컬 / D컬
- 4행 (눈매):
  - `쌍커풀 또렷` / ◎ / ◎ / ◎
  - `홑꺼풀·무쌍` / ◎ / ⭐⭐ / ◎ (C컬 강추)
  - `처진 눈매` / × / ⭐⭐ / ⭐⭐ (강한 컬 추천)
  - `긴 속눈썹` / ⭐⭐ / ◎ / ×
- 풋: `* 1:1 상담 후 손님 결·길이까지 봐서 정확히 잡아드려요♡`

---

### Card 2F — 상담 CTA (4:5)
**저장: `set2_curl_compare/raw/2F_cta.png`**

#### English prompt
```
Vertical card, 4:5, pink #FFF5F8 background.
Center: empty large rounded rectangle (BLANK) with pink outline #E89BAE,
  containing 3 stacked elements (BLANK):
    1. headline area
    2. small phone icon + number placeholder
    3. small message bubble icon + handle placeholder
Top: empty space for "advice" sub-headline.
Bottom: pagination dots (6 dots, last active).
3-4 floating heart and sparkle decorations in soft pink, scattered.
Mood: warm, inviting, simple call-to-action.
NO TEXT.
```

#### 한국어 overlay
- 톱: `궁금하신 점은 편하게 물어보세요♡`
- 박스 헤드: `1:1 상담 → 디자인 결정`
- 박스 행 1: 📞 `010-4908-6511 (카톡/문자)`
- 박스 행 2: 💬 `@ure.line 인스타 DM`

---

## 🎨 세트 3 — 메디핑크 캠페인 5장 (D3=d 라벤더)

### Card 3A — 캠페인 표지 (4:5)
**저장: `set3_medipink/raw/3A_cover_campaign.png`**

#### English prompt
```
Vertical Instagram poster, 4:5 (1080x1350).
Lavender to soft pink gradient background, top #DCC9DD fading to bottom #F5DCEA.
Soft sparkle bokeh and tiny star particles scattered.
Center-right: empty space for shoulder-up portrait of young Korean woman 
  (BLANK photo zone, soft oval mask).
Left side top: empty space for handwritten English subtitle (BLANK).
Left center: empty space for large 2-line Korean headline (BLANK).
Bottom-left: small decorative flourish (thin curved line + 2 small stars in lavender).
Mood: dreamy, premium, K-beauty medical aesthetic, feminine confidence.
Color: lavender #DCC9DD, pink-cream #F5DCEA, white highlights, deep purple #6B4C8A accents.
NO TEXT IN IMAGE.
```

#### 한국어 overlay
- 영문 서브: `Your Line · Medi Pink` (Italianno 28pt, 화이트)
- 메인 헤드: `잃어버린 자신감, / 다시 핑크빛으로` (Cafe24 Ohsquare Bold 36pt, 화이트)
- 풋: `유어라인 · 7월 오픈 기념 캠페인` (Pretendard Light 14pt)

---

### Card 3B — 5단계 효과 (4:5)
**저장: `set3_medipink/raw/3B_effect_5steps.png`**

#### English prompt
```
Vertical card, 4:5, lavender background #DCC9DD with subtle sparkle.
Top: empty headline area (BLANK).
Center: 5 horizontally aligned circular icon placeholders 
  (each ~80px diameter, thin white outline, BLANK).
Below each circle: small label area (BLANK).
Below the 5 icons: 1-line description area (BLANK).
Bottom-center: empty rounded box with thin border for CTA-like content (BLANK).
Mood: clean medical aesthetic comparison infographic.
NO TEXT.
```

#### 한국어 overlay
- 헤드: `메디핑크 5단계 케어`
- 5 아이콘 라벨: `1.클렌징` / `2.앰플` / `3.딥케어` / `4.멜라닌 분해` / `5.마무리 크림`
- 디스크립션: `통증 거의 없는 메디컬 멜라닌 케어 — 4~6회 권장`
- 박스: `좋은 재료 · 엄격한 기준 · 안전한 시술`

---

### Card 3C — 패키지 가격 (4:5)
**저장: `set3_medipink/raw/3C_pricing_package.png`**

#### English prompt
```
Vertical card, 4:5, lavender background #DCC9DD.
Top: empty headline area (BLANK).
Center: 2 stacked rectangular pricing boxes side by side or vertical, 
  each with thin gold/lavender outline (#9B7BC9), BLANK content zones.
Each box has 3 zones: tier label / session count / price placeholder.
Bottom: footer area with small note text placeholder (BLANK).
Subtle decorative elements: tiny stars, thin lines.
Mood: premium clinic pricing card.
NO TEXT.
```

#### 한국어 overlay
- 헤드: `메디핑크 패키지`
- 박스 1 (라이트):
  - `Light Care` / `4회` / `380,000원`
  - 부제: `초기 케어 / 부분 부위`
- 박스 2 (풀, 강조):
  - `Full Care` / `6회` / `540,000원`
  - 부제: `완전 케어 / 추천 패키지`
- 풋: `* 정확한 가격은 부위·상태에 따라 방문 상담 / 7월 오픈 기념 5% 할인`

---

### Card 3D — Before/After (4:5)
**저장: `set3_medipink/raw/3D_before_after.png`**

#### English prompt
```
Vertical card, 4:5, soft lavender background #DCC9DD.
Center: 2 large rounded square photo placeholder zones, side-by-side or stacked,
  each with thin lavender outline (BLANK photo zones).
Above each photo: small label box (BLANK — for "Before" / "After" labels).
Bottom: 1-line testimonial-like quote area (BLANK).
Subtle sparkle decorations.
Mood: transformation, hope, medical aesthetic before/after.
NO TEXT.
```

#### 한국어 overlay
- 헤드: `실제 손님 변화 사례`
- 사진 라벨: `Before` (그레이 톤) / `After` (라벤더 톤)
- 디스크립션: `4회 시술 · 4주 간격 · 자연스러운 톤 회복`
- 인용: `"임신 후 어두워진 컬러가 회복돼서 자신감이 돌아왔어요" — 단골 손님 후기`

---

### Card 3E — CTA + 7월 오픈 (4:5)
**저장: `set3_medipink/raw/3E_cta_event.png`**

#### English prompt
```
Vertical card, 4:5, lavender-pink gradient background 
  (top #DCC9DD fading bottom #F5DCEA), more sparkle decoration.
Top-left corner: large circular badge area (BLANK — for "5% off" or event mark),
  in coral pink with thin outline.
Center: empty rounded rectangle "event card" area (BLANK), 
  with 3 stacked content zones (date / location / contact).
Bottom: small message bubble icon + Instagram handle placeholder.
Floating decorations: small stars, hearts in lavender and pink (4-5 scattered).
Mood: celebratory, inviting, friendly event announcement.
NO TEXT.
```

#### 한국어 overlay
- 원형 배지: `7월 오픈 / 5% off`
- 박스 헤드: `메디핑크 첫 상담 무료`
- 박스 행 1: 📅 `2026년 7월 오픈 예정`
- 박스 행 2: 📍 `유어라인 신규 매장 (이수·사당)`
- 박스 행 3: 💬 `010-4908-6511 / @ure.line`
- 풋: `* 사전 상담 받으시면 오픈 즉시 우선 예약`

---

## 🎯 GPT 사용 팁 (4가지)

### 1. 모델 일관성 (세트 3·표지·CTA에 인물 등장 시)
- **첫 카드 (3A)에서 모델 1명 정착** → 다음 카드 (3D Before/After 등)에서 "same Korean woman as previous image, slightly different angle/expression" 추가
- 또는 GPT-5.5의 "edit" 기능 활용 (포즈만 변형)

### 2. 한국어 폰트 미리 확인
**Pillow 합성 단계에서 사용할 무료 폰트 4종 (사장 PC에 미리 다운로드 필요)**:
- **Pretendard** (본문용): https://github.com/orioncactus/pretendard
- **Cafe24 Ohsquare** (메인 헤드): https://fonts.cafe24.com → Ohsquare Bold
- **Cafe24 단정해** (손글씨): https://fonts.cafe24.com → 단정해
- **Italianno** (영문 손글씨): https://fonts.google.com/specimen/Italianno

### 3. variation 생성 → 1장 채택
- 카드 한 장당 GPT에 **3회 이상 같은 프롬프트 재생성** 권장
- 분위기·톤이 가장 사장 워터마크와 어울리는 1장 채택
- "make it more pink" / "softer mood" / "less decoration" 같은 추가 명령으로 미세 조정

### 4. 시리즈 일관성
- 같은 세트 안에서는 **같은 GPT 세션 한 번에 생성** (시각 톤 자동 일관성)
- 세션 분리되면 다음 카드에 "same color palette and style as previous" 명시

---

## ✅ 사용자 체크리스트

작업 완료 후 한 번 더 확인:

- [ ] 세트 1 — 5장 (`1A_*` + `1B1_*` ~ `1B4_*`)
- [ ] 세트 2 — 6장 (`2A_*` ~ `2F_*`)
- [ ] 세트 3 — 5장 (`3A_*` ~ `3E_*`)
- [ ] 모든 파일 PNG 형식 / 1080×1350 (또는 1920×1080 1A) 해상도
- [ ] 사장 워터마크 핑크 (#E89BAE)와 톤 어울림
- [ ] 텍스트 영역이 BLANK (한국어 텍스트가 잘못 들어가 있지 않음)

→ 16장 모두 저장 완료되면 한 줄 알림: **"이미지 16장 저장 완료, design-cards/{set1,set2,set3}/raw/ 확인해줘"**

---

## 📚 외부 참조

- 디자인 시스템·컬러 hex·역프롬프트 풀 분석: `prototypes/uareline/design-cards-reference.md`
- 사장 톤 한국어 콘텐츠 시드: `prototypes/uareline-prompts.md` v3
- 매뉴 11종 + 가격: `02-target-uareline-prototype.md` §1
- 사장 운영 정보: `02-target-uareline-prototype.md` §1 (1:1·KC인증·7월오픈·010전화)
