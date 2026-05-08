# 🎨 GPT 이미지 생성 프롬프트 v2 — 16장 카드뉴스 (텍스트-인-이미지)

> **사용자 작업 가이드** — GPT-5.5에 영문 프롬프트 그대로 복붙 → **배경+한국어 텍스트가 한 번에** 완성된 카드 → 지정 폴더에 저장
>
> v1 (2026-05-05): GPT 배경만 + Pillow overlay 2단계 워크플로우
> **v2 (2026-05-08)**: GPT-5.5 한국어 렌더링 안정화 → 1단계로 단축
>
> 사용자 결정 반영: D1=c (가로+세로) / D2=b (유어라인 핑크) / D3=d (라벤더 메디핑크)

---

## 🚀 사용 방법 (3단계, v2)

### Step 1. GPT-5.5에서 이미지 생성 (1장씩)
- 각 카드의 **English prompt**를 그대로 복붙
- 카드 한 장당 **2~3회 variation 생성** → 한국어 정확도 1장씩 확인
- 한국어 텍스트가 정확한 1장 채택

### Step 2. 한국어 정확도 검수 (variation 1장씩)
- [ ] 헤드라인 글자 누락·오타 없음
- [ ] 가격 숫자 (44,000원 등) 정확
- [ ] 작은 라벨도 흐림·깨짐 없음
- [ ] 받침·모음 정확 (자주 실수: ㅁ↔ㅂ, ㅓ↔ㅡ)
- [ ] 띄어쓰기·구두점 정확

→ 1개라도 틀리면 variation 재생성. 2~3회 반복해도 안 되면 **§ Pillow fallback** 호출 (Claude에 알려주면 코드 작성).

### Step 3. 이미지 저장 — 지정 폴더
```
sample_pictures_0505/                           # ← 사장 시술 사진 (이미 있음)
prototypes/uareline/design-cards/
├── set1_pricing/                               ← 여기에 5장 저장
│   ├── 1A_menu_landscape.png                   # 가로 16:9 PDF용
│   ├── 1B1_cover_vertical.png                  # 세로 표지
│   ├── 1B2_eyelash_extensions.png              # 연장 가격표
│   ├── 1B3_eyelash_perm.png                    # 펌 가격표
│   └── 1B4_membership_medipink.png             # 멤버십+메디핑크
├── set2_curl_compare/                          ← 여기에 6장 저장
│   ├── 2A_cover.png                            # 표지
│   ├── 2B_jcurl.png                            # J컬
│   ├── 2C_ccurl.png                            # C컬
│   ├── 2D_dcurl.png                            # D컬
│   ├── 2E_eyetype_match.png                    # 눈매별 매칭 표
│   └── 2F_cta.png                              # 상담 CTA
└── set3_medipink/                              ← 여기에 5장 저장
    ├── 3A_cover_campaign.png                   # 캠페인 표지
    ├── 3B_effect_5steps.png                    # 5단계 효과
    ├── 3C_pricing_package.png                  # 패키지 가격
    ├── 3D_before_after.png                     # Before/After 비교
    └── 3E_cta_event.png                        # CTA + 캠페인 안내
```

### Step 4. 저장 완료 알림 (한 줄)
> "이미지 16장 저장 완료, design-cards/{set1,set2,set3}/ 확인해줘.
>  단, [카드번호 X·Y·Z]는 한국어 정확도 못 맞춤 → fallback 필요"

→ Claude가 fallback 카드만 Pillow overlay 코드 작성 + 한국어 합성

---

## 🎨 세트 1 — 가격표 5장 (D1=c 둘 다)

### Card 1A — 가로 PDF 메뉴판 (16:9) ⚠️ dense

**저장: `set1_pricing/1A_menu_landscape.png`**

#### English prompt (텍스트 포함)
```
Wide horizontal salon menu layout, 16:9 aspect ratio (1920x1080).
Soft pastel pink background #FFF5F8 with delicate floral ornaments.
Pink dotted border frame around the entire composition
(1px dashed, color #E89BAE).
Top decorations: small floral motifs and a few tiny stars.

Top center HEADLINE — Korean handwritten calligraphy, render exactly:
  "오늘도 반하다"
  in elegant pink hand-drawn script (#E89BAE), ~64pt.

Left half: 6 small photo-realistic eyelash design illustrations
arranged in a 2x3 grid. Below each, render a clean Korean/English
sans-serif label (Pretendard-like, 12pt, #666666):
  Row 1:  "Natural"   "Cute"   "Sexy"
  Row 2:  "Mix"   "Glamorous"   "디자인 이름"

Right half: clean two-column price table on cream/white background
with thin gray dividers (#999999, 1px).

Section header — italic English serif (Cormorant Italic 16pt, #B8868F):
  "EYELASH"
Korean menu rows below — left column (Pretendard Medium 13pt, #5A4A4A),
right column right-aligned bold prices (Pretendard Bold 13pt, #5A4A4A):
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
Numbers (44,000원 etc.) must be exact.
Mood: feminine, delicate, soft pastel-pink, minimalist Korean salon menu.
Style: Korean magazine editorial meets pastel beauty branding.
```

⚠️ **dense 카드 — variation 3~5회 시도. 그래도 가격 숫자 흐림 시 fallback**

#### Color
배경 #FFF5F8 / 핑크 #E89BAE / 텍스트 #5A4A4A / 보조선 #999999

---

### Card 1B1 — 세로 표지 (4:5)

**저장: `set1_pricing/1B1_cover_vertical.png`**

#### English prompt
```
Vertical Instagram cover card, 4:5 aspect ratio (1080x1350).
Soft cream-pink background #FFF0F2 with very subtle paper texture.

Center upper area — Korean elegant calligraphic brand name,
render exactly:
  "유어라인"
  in pink (#E89BAE), 56pt, calligraphy/handwritten Korean style.

Just below — Korean subtitle in clean sans-serif,
Pretendard Light 18pt, dark gray (#5A4A4A), centered:
  "시술 안내 가격표"

Bottom center: thin pink decorative line (1px, #E89BAE) with
a tiny floral motif in the center.

Just below the line — small Instagram handle in clean sans-serif,
Pretendard 12pt, light gray (#999999):
  "@ure.line"

Generous white space, minimalist Korean beauty salon menu cover.
All Korean text rendered crisp and accurate.
Mood: refined, premium, magazine editorial cover, calm welcoming.
Style: Vogue Korea cover meets K-beauty pastel branding.
```

#### Color
배경 #FFF0F2 / 핑크 #E89BAE / 텍스트 #5A4A4A

---

### Card 1B2 — 세로 연장 가격표 (4:5) ⚠️ dense

**저장: `set1_pricing/1B2_eyelash_extensions.png`**

#### English prompt
```
Vertical Instagram carousel card, 4:5 (1080x1350).
Soft pastel pink background #FFF5F8 with subtle paper grain.
Side: pagination dots indicator (3 dots, second active),
right-side vertical mid.

Top — section header in italic English serif,
Cormorant Italic 18pt, dusty pink (#B8868F), centered:
  "Eyelash Extensions"

Below header: thin horizontal divider line (1px, #E0C5CB).

Center: 7 menu rows. Each row has 3 zones — Korean menu name (left,
Pretendard 13pt, #5A4A4A), small time in min (center, Light 11pt,
#999999), price right-aligned (Pretendard Bold 13pt, #5A4A4A):

  글루연장 하프 (50%)            90min        44,000원
  글루연장 맥스 (90%)           150min        66,000원
  LED연장 변경 추가              +0min       +11,000원
  펌포인트 / 마스카라 연장      150min        66,000원
  디자인 추가 (부분 볼륨)       +30min       +11,000원
  디자인 추가 (전체 볼륨)       +30min       +22,000원
  타샵 연장 제거                 30min        11,000원

Between rows: thin light divider lines (#F0E0E5, 1px).

Bottom footer — small italic English text + Korean note,
Pretendard Light 10pt italic, #999999:
  "* 시술시 EYE 클리닉 케어 & 샴푸 서비스 무료"

All Korean characters MUST be crisp, accurate, legible.
Numbers must be exact (44,000원, 66,000원 etc.).
Mood: clean, premium, soft pink, organized Korean salon menu page.
Color: background #FFF5F8, divider #E0C5CB, text #5A4A4A.
Style: Korean editorial menu carousel.
```

⚠️ **dense — variation 3~5회 시도**

---

### Card 1B3 — 세로 펌 가격표 (4:5)

**저장: `set1_pricing/1B3_eyelash_perm.png`**

#### English prompt
```
Same style as 1B2 (vertical 4:5, pastel pink #FFF5F8 background,
paper grain). Pagination dots: 3 dots, third active.

Top — section header in italic English serif,
Cormorant Italic 18pt, dusty pink (#B8868F), centered:
  "Eyelash Perm"

Below header: thin divider line (#E0C5CB, 1px).

Middle: 3 menu rows (same column layout as 1B2 — name/time/price):

  유어라인 클리닉 영양펌         90min        33,000원
  영양 블랙 틴팅펌              120min        44,000원
  펌포인트 연장 (펌+연장)       150min        66,000원

Bottom 1/3: subtle highlighted box (rounded 16px corners, slightly
more saturated pink fill #FFE4EC, 1px outline #E89BAE).
Inside the box, centered, Cafe24 Ohsquare Bold 22pt, dark pink (#B85A75):
  "유어라인만의 올인원 영양펌"
Below, smaller subtitle Pretendard Regular 14pt, #5A4A4A:
  "영양 가득 + 결뭉 영양제 마무리"

All Korean text rendered crisp and accurate.
Mood: clean, premium, organized, with a featured highlight box.
```

---

### Card 1B4 — 세로 멤버십 + 메디핑크 (4:5)

**저장: `set1_pricing/1B4_membership_medipink.png`**

#### English prompt
```
Same style as previous (vertical 4:5, pastel pink #FFF5F8).

Top half — section header in italic serif, Cormorant Italic 18pt,
dusty pink (#B8868F), centered:
  "Membership"

4 menu rows (3 columns: tier name / sessions / price), Pretendard
Medium 13pt name, 11pt sessions gray, Bold 13pt price right-aligned:
  베이직 연장 6회권              6회        260,000원
  베이직 연장 12회권            12회        500,000원
  LED연장 6회권                  6회        330,000원
  LED연장 12회권                12회        550,000원

Stronger horizontal divider line in the middle (#E89BAE, 2px).

Bottom half — section header:
  "Medipink — 메디컬 멜라닌 케어"
(Cormorant Italic 18pt + Korean Pretendard Medium 14pt mix)

1 prominent row:
  메디핑크 (변동, 방문 상담)
Subtitle below in Pretendard Light 12pt, #999999:
  "유륜·외음부·바디 화이트닝 케어"

Bottom footer — 3 small note lines, Pretendard Light 10pt, #999999:
  "* 회원권은 첫 시술 시 결제 가능"
  "* 가격은 부가세 포함"
  "* 모든 시술은 1:1 예약제"

All Korean characters crisp and accurate. Numbers exact.
Mood: clean, premium, organized.
```

---

## 🎨 세트 2 — 컬·디자인 비교 6장 (D2=b 유어라인 핑크 톤)

### Card 2A — 표지 (4:5)

**저장: `set2_curl_compare/2A_cover.png`**

#### English prompt
```
Vertical Instagram cover card, 4:5 (1080x1350).
Soft pink-to-cream gradient background, top #FFE4EC fading to bottom #FFF5F8.

Center: large oval portrait photo placement of young Korean woman
with soft natural makeup, gentle smile, eyes closed showing eyelash
extensions clearly. Soft thin pink border (#E89BAE, 1px) around oval.

Top center — handwritten English script, Italianno style 32pt,
dark pink (#B85A75), render exactly:
  "your line beauty guide"

Below the oval — large Korean main HEADLINE in 2-line stack,
Cafe24 Ohsquare Bold style, ~44pt, dark gray (#5A4A4A), centered:
  "내 눈매에"
  "맞는 컬은?"

Bottom decoration: thin pink line + small floral ornament.
Below — small footer text in 2 lines, Pretendard Regular 13pt, #5A4A4A:
  "1:1 단독시술 · 유어라인"
  "@ure.line"

Tiny scattered heart/sparkle decorations in soft pink (3-4 small).
All Korean and English text rendered crisp and accurate.
Mood: K-beauty editorial cover, soft, inviting, feminine.
Style: Vogue Korea pink edition, refined.
```

---

### Card 2B — J컬 소개 (4:5)

**저장: `set2_curl_compare/2B_jcurl.png`**

#### English prompt
```
Vertical card, 4:5 (1080x1350), pastel pink background #FFF5F8.
Layout: top 60% photo zone (rounded-rectangle frame, 32px radius,
soft shadow) showing close-up eye with J-curl natural eyelash
extensions on a Korean woman. Bottom 40% text zone.
Pagination dots (6 dots total, dot 2 active) at bottom right.

Top right corner of photo: small circular badge (40px, pink outline
#E89BAE 2px, white fill). Inside: Korean number, Cafe24 Ohsquare 24pt,
pink (#E89BAE):
  "01"

Text zone — main Korean headline (Cafe24 Ohsquare Bold 28pt, #5A4A4A):
  "J컬 — 가장 자연스러운 라인"

Below: 3 bullet items, each with a small filled pink dot (#E89BAE)
and Korean text (Pretendard Medium 15pt, #5A4A4A, line-height 1.6):
  • 자연스러운 차분한 인상
  • 평소에 거의 안 한 듯한 무드
  • 신부 메이크업·면접·일상 추천

Bottom corner — small line illustration showing a subtle J-shaped
curve drawn in pink (#E89BAE), representing the natural J curl.

All Korean text rendered crisp and accurate.
Mood: clean, comparison guide style, premium pink K-beauty.
```

---

### Card 2C — C컬 소개 (4:5)

**저장: `set2_curl_compare/2C_ccurl.png`**

#### English prompt
```
Same layout as 2B (4:5, pink #FFF5F8, 60/40 split). Pagination dot
at position 3. Top photo: close-up eye with C-curl bold eyelash
extensions on a Korean woman.

Badge in top right of photo: "02" (same style as 2B).

Main Korean headline (Cafe24 Ohsquare Bold 28pt, #5A4A4A):
  "C컬 — 또렷한 인형 같은 눈매"

3 bullets (filled pink dots + Korean Pretendard Medium 15pt, #5A4A4A):
  • 볼륨감과 또렷한 인상
  • 눈을 더 크게 보이게 하는 효과
  • 데일리·셀카·여행 추천

Bottom corner: medium C-shaped curve illustration in pink (#E89BAE),
representing the C curl.

All Korean text rendered crisp and accurate.
Mood: same as 2B, consistent series.
```

---

### Card 2D — D컬 소개 (4:5)

**저장: `set2_curl_compare/2D_dcurl.png`**

#### English prompt
```
Same layout as 2B/2C (4:5, pink #FFF5F8, 60/40 split). Pagination dot
at position 4. Top photo: close-up eye with D-curl dramatic eyelash
extensions on a Korean woman.

Badge in top right of photo: "03" (same style).

Main Korean headline (Cafe24 Ohsquare Bold 28pt, #5A4A4A):
  "D컬 — 가장 강한 컬링"

3 bullets (filled pink dots + Korean Pretendard Medium 15pt, #5A4A4A):
  • 드라마틱한 라인 + 풍성한 볼륨
  • 결혼식·파티·이벤트에 강추
  • 짧은 속눈썹도 길어 보이게

Bottom corner: strong D-shaped curve illustration in pink (#E89BAE),
more dramatic curl than 2C.

All Korean text rendered crisp and accurate.
Mood: same series consistency.
```

---

### Card 2E — 눈매별 매칭 표 (4:5) ⚠️ dense

**저장: `set2_curl_compare/2E_eyetype_match.png`**

#### English prompt
```
Vertical card, 4:5 (1080x1350), pink #FFF5F8 background.
Pagination dot at position 5.

Top — main Korean HEADLINE (Cafe24 Ohsquare Bold 28pt, #5A4A4A,
centered):
  "내 눈매별 추천 컬"

Center: 4x4 matrix table with soft rounded square cells (16px radius),
white fill, thin pink border (#E89BAE, 1px).

Top header row (centered, Pretendard Bold 13pt, #5A4A4A):
  "눈매"      "J컬"      "C컬"      "D컬"

4 data rows — leftmost column Korean eye-type label
(Pretendard Medium 12pt, #5A4A4A), three cells with marks
(Cafe24 Ohsquare 18pt, pink #E89BAE):

  쌍커풀 또렷       ◎      ◎      ◎
  홑꺼풀·무쌍       ◎      ⭐⭐    ◎
  처진 눈매          ×       ⭐⭐    ⭐⭐
  긴 속눈썹          ⭐⭐    ◎      ×

Below the table, small note (Pretendard Light 11pt, #999999, italic):
  "* 1:1 상담 후 손님 결·길이까지 봐서 정확히 잡아드려요♡"

All Korean text and symbols rendered crisp and accurate.
The marks (◎ ⭐⭐ ×) must be clearly distinguishable.
Mood: clean comparison infographic, K-beauty editorial.
```

⚠️ **dense — symbol 정확도 흔들릴 수 있음. variation 3회 권장**

---

### Card 2F — 상담 CTA (4:5)

**저장: `set2_curl_compare/2F_cta.png`**

#### English prompt
```
Vertical card, 4:5 (1080x1350), pink #FFF5F8 background.
Pagination dots: 6 dots, last (6th) active.
3-4 floating heart and sparkle decorations in soft pink, scattered.

Top — Korean headline (Cafe24 단정해 calligraphy 22pt, #B85A75,
centered):
  "궁금하신 점은 편하게 물어보세요♡"

Center — large rounded rectangle (32px radius, white fill, 2px pink
outline #E89BAE), containing 3 stacked elements:

Top of box — main headline (Cafe24 Ohsquare Bold 22pt, #5A4A4A,
centered):
  "1:1 상담 → 디자인 결정"

Row 1 — small phone emoji 📞 + Korean text
(Pretendard Medium 16pt, #5A4A4A, centered):
  "📞 0507-1320-6511 (네이버 예약)"

Row 2 — small message emoji 💬 + Korean text
(Pretendard Medium 16pt, #5A4A4A, centered):
  "💬 @ure.line 인스타 DM 또는 카카오 채널"

All Korean characters and numbers rendered crisp and accurate.
Mood: warm, inviting, simple call-to-action.
```

---

## 🎨 세트 3 — 메디핑크 캠페인 5장 (D3=d 라벤더)

### Card 3A — 캠페인 표지 (4:5)

**저장: `set3_medipink/3A_cover_campaign.png`**

#### English prompt
```
Vertical Instagram poster, 4:5 (1080x1350).
Lavender to soft pink gradient background — top #DCC9DD fading
to bottom #F5DCEA.
Soft sparkle bokeh and tiny star particles scattered.

Center-right: shoulder-up portrait of young Korean woman, calm
confident expression, soft makeup, glowing skin, soft oval mask
edges (no hard cut).

Left side TOP — handwritten English script, Italianno 28pt, white
(#FFFFFF), render exactly:
  "Your Line · Medi Pink"

Left center — large 2-line Korean HEADLINE
(Cafe24 Ohsquare Bold style 36pt, white #FFFFFF):
  "잃어버린 자신감,"
  "다시 핑크빛으로"

Bottom-left small flourish: thin curved line + 2 tiny lavender stars.

Bottom — small footer text (Pretendard Light 14pt, white, opacity 80%):
  "유어라인 · 메디핑크 캠페인"

All Korean and English text rendered crisp and accurate.
Mood: dreamy, premium, K-beauty medical aesthetic, feminine confidence.
Color: lavender #DCC9DD, pink-cream #F5DCEA, white highlights,
deep purple #6B4C8A accents.
```

---

### Card 3B — 5단계 효과 (4:5)

**저장: `set3_medipink/3B_effect_5steps.png`**

#### English prompt
```
Vertical card, 4:5 (1080x1350), lavender background #DCC9DD with
subtle sparkle bokeh.

Top — Korean HEADLINE (Cafe24 Ohsquare Bold 30pt, white #FFFFFF,
centered):
  "메디핑크 5단계 케어"

Center: 5 horizontally aligned circular icons (each ~80px diameter,
2px white outline, semi-transparent fill). Inside each circle a small
representative icon (drop, ampoule, hand, leaf, cream jar).

Below each circle, Korean label (Pretendard Medium 13pt, white):
  "1.클렌징"  "2.앰플"  "3.딥케어"  "4.멜라닌 분해"  "5.마무리 크림"

Below the icons — 1-line description (Pretendard Regular 15pt, white,
opacity 90%, centered):
  "통증 거의 없는 메디컬 멜라닌 케어 — 4~6회 권장"

Bottom-center: small rounded box (24px radius, white outline 1px,
transparent fill). Inside, Cafe24 단정해 calligraphy 16pt, white:
  "좋은 재료 · 엄격한 기준 · 안전한 시술"

All Korean text rendered crisp and accurate.
Mood: clean medical aesthetic infographic, soft and calm.
Color: lavender #DCC9DD, white text, accent #6B4C8A.
```

---

### Card 3C — 패키지 가격 (4:5)

**저장: `set3_medipink/3C_pricing_package.png`**

#### English prompt
```
Vertical card, 4:5 (1080x1350), lavender background #DCC9DD with
subtle sparkle.

Top — Korean HEADLINE (Cafe24 Ohsquare Bold 30pt, white #FFFFFF,
centered):
  "메디핑크 패키지"

Center: 2 vertically stacked rectangular pricing boxes
(20px radius, 1px outline #9B7BC9, semi-transparent white fill).

Box 1 (Light, on top) — 3-zone layout:
  Top label (Cormorant Italic 18pt, lavender #DCC9DD): "Light Care"
  Center large (Cafe24 Ohsquare Bold 32pt, white):  "4회"
  Right price (Pretendard Bold 28pt, white): "380,000원"
  Subtitle below (Pretendard Light 13pt, white opacity 80%):
    "초기 케어 / 부분 부위"

Box 2 (Full, below — slightly more saturated, recommended highlight) —
same 3-zone layout:
  Top label: "Full Care"
  Center: "6회"
  Right price: "540,000원"
  Subtitle: "완전 케어 / 추천 패키지"
  Plus small badge top-right corner of box 2: "추천" (white text on
  pink #E89BAE pill, 12pt)

Bottom footer — 2 lines small text (Pretendard Light 11pt, white
opacity 70%, centered):
  "* 정확한 가격은 부위·상태에 따라 방문 상담"
  "* 첫 시술 시 무료 상담 1회"

Tiny stars and thin lines decoration.
All Korean text and numbers rendered crisp and accurate.
Mood: premium clinic pricing card.
```

---

### Card 3D — Before/After (4:5)

**저장: `set3_medipink/3D_before_after.png`**

#### English prompt
```
Vertical card, 4:5 (1080x1350), soft lavender background #DCC9DD.
Subtle sparkle decorations.

Top — Korean HEADLINE (Cafe24 Ohsquare Bold 28pt, white #FFFFFF,
centered):
  "실제 손님 변화 사례"

Center: 2 large rounded square photo placeholder zones
(24px radius, 2px lavender outline #9B7BC9), stacked vertically with
24px gap. Above each, a small label pill (12px radius, lavender fill):

Photo 1 label (Cafe24 Ohsquare 14pt, white, on gray-tone pill):
  "Before"
Photo 1: skin showing slight discoloration, soft realistic skin texture.

Photo 2 label (same style, on lavender-tone pill):
  "After"
Photo 2: same area showing improved natural skin tone, healthier glow.

Below photos — description line (Pretendard Regular 14pt, white,
centered):
  "4회 시술 · 4주 간격 · 자연스러운 톤 회복"

Bottom — testimonial quote in italic Cafe24 단정해 14pt, white,
centered, 2 lines:
  "임신 후 어두워진 컬러가 회복돼서"
  "자신감이 돌아왔어요"
Below quote, small attribution (Pretendard Light 11pt, white opacity 70%):
  "— 단골 손님 후기"

All Korean text rendered crisp and accurate.
Mood: transformation, hope, medical aesthetic before/after.
Color: lavender #DCC9DD, white text, accent #9B7BC9.
```

---

### Card 3E — CTA + 캠페인 안내 (4:5)

**저장: `set3_medipink/3E_cta_event.png`**

#### English prompt
```
Vertical card, 4:5 (1080x1350), lavender-pink gradient background
(top #DCC9DD fading to bottom #F5DCEA), with more sparkle decoration.
Floating decorations: small lavender + pink stars and hearts (4-5
scattered, varied sizes).

Top-left LARGE circular badge — coral pink (#E85A4F) filled circle,
~200px diameter, 2px white outline. Inside, white text in 2 lines,
Italic Sans Bold 22pt:
  "메디핑크"
  "첫 상담 무료"

Center: large rounded rectangle "event card" (24px radius, white fill
opacity 92%, 1px lavender outline #9B7BC9).

Top of box — Korean headline (Cafe24 Ohsquare Bold 24pt, deep purple
#6B4C8A, centered):
  "메디핑크 캠페인 안내"

Inside box, 3 stacked rows (Pretendard Medium 14pt, #5A4A6A):
  📋  "방문 상담 후 부위·상태 맞춤 추천"
  📍  "유어라인 (이수·사당, 1:1 예약제)"
  💬  "0507-1320-6511 / @ure.line / 카카오 채널"

Bottom — small footer note (Pretendard Light 11pt, #6B4C8A opacity 80%,
centered, 1 line):
  "* 단골 손님께 우선 안내 / 신규 손님도 환영합니다"

All Korean text and emojis rendered crisp and accurate.
Numbers exact (0507-1320-6511).
Mood: celebratory, inviting, friendly event announcement.
Color: lavender #DCC9DD, pink #F5DCEA, coral #E85A4F, white,
deep purple #6B4C8A.
```

---

## 🎯 GPT 사용 팁 (5가지, v2)

### 1. 한국어 텍스트 정확도 — 1장씩 검수
- 가장 중요한 변화 포인트
- 헤드라인 글자 1개라도 틀리면 즉시 variation 재생성
- 가격 숫자(쉼표 포함)·전화번호·이름표는 특히 주의

### 2. 모델 일관성 (세트 3·표지·CTA에 인물 등장 시)
- **첫 카드 (3A)에서 모델 1명 정착** → 다음 카드에서:
  ```
  "same Korean woman as previous image, slightly different
   angle/expression, same makeup"
  ```
- 또는 GPT-5.5의 "edit" 기능 활용 (포즈만 변형)

### 3. variation 생성 → 1장 채택
- 카드 한 장당 GPT에 **2~3회 variation** 권장 (dense 카드는 5회)
- 분위기·톤이 가장 사장 워터마크와 어울리는 1장 채택
- 미세 조정 명령 예시:
  - `"make the pink more saturated like #E89BAE"`
  - `"shift the headline up by 50px"`
  - `"render the Korean text larger and bolder"`
  - `"the price should read exactly 44,000원, not 44,oOO"`

### 4. 시리즈 일관성
- 같은 세트 안에서는 **같은 GPT 세션 한 번에 생성** (시각 톤 자동 일관성)
- 세션 분리되면 다음 카드에:
  ```
  "same color palette and visual style as previous cards in this series"
  ```

### 5. dense 카드 fallback 신호
다음 카드들은 한국어 텍스트가 매우 dense하여 한 번에 100% 정확이 어려울 수 있음:
- **Card 1A** (메뉴 11종 가로형)
- **Card 1B2** (연장 7행)
- **Card 2E** (4×4 매트릭스 + 기호 ◎⭐⭐×)

→ 3~5회 variation 후에도 안 맞으면 Claude에 알려주기:
> "Card 1A·1B2·2E는 한국어 정확도 못 맞춤 → fallback 부탁해"

→ Claude가 GPT 배경만 + Pillow overlay 조합으로 재작업

---

## ✅ 사용자 체크리스트

작업 완료 후 한 번 더 확인:

- [ ] 세트 1 — 5장 (`1A_*` + `1B1_*` ~ `1B4_*`)
- [ ] 세트 2 — 6장 (`2A_*` ~ `2F_*`)
- [ ] 세트 3 — 5장 (`3A_*` ~ `3E_*`)
- [ ] 모든 파일 PNG 형식 / 1080×1350 (또는 1920×1080 1A) 해상도
- [ ] 사장 워터마크 핑크 (#E89BAE)와 톤 어울림
- [ ] **한국어 텍스트 정확도 검수 통과** (글자·숫자·기호 1개씩 확인)

→ 16장 모두 저장 완료되면 한 줄 알림:
> **"이미지 16장 저장 완료, design-cards/{set1,set2,set3}/ 확인해줘.
>  단, [카드번호 X·Y·Z]는 한국어 정확도 못 맞춤 → fallback 필요"**

---

## 🔧 v1 vs v2 변경

| 항목 | v1 | v2 |
|---|---|---|
| 텍스트 처리 | "NO TEXT" + Pillow overlay 별도 합성 | GPT 한 번에 텍스트 포함 |
| 워크플로우 | 2단계 (GPT → Pillow) | 1단계 (GPT 만), dense 카드 fallback |
| Pillow 의존도 | 16장 모두 | 예외 3~4장만 (1A, 1B2, 2E 의심) |
| 폴더 구조 | `raw/` 서브폴더 | 직접 set 폴더에 저장 |
| 사용자 작업 | 1~2h (이미지 생성) | 1~2h (이미지 생성 + 검수) |
| Claude 작업 | Pillow overlay 16장 | Pillow fallback 3~4장만 |

---

## 📚 외부 참조

- 디자인 시스템·컬러 hex·역프롬프트 풀 분석: `prototypes/uareline/design-cards-reference.md` (v2)
- 사장 톤 한국어 콘텐츠 시드: `prototypes/uareline-prompts.md` v3
- 매뉴 11종 + 가격: `02-target-uareline-prototype.md` §1
- 사장 운영 정보: `02-target-uareline-prototype.md` §1 (4타임·사장 블로그 시그니처)
- (Pillow fallback용) Pretendard 무료 폰트: https://github.com/orioncactus/pretendard
- (Pillow fallback용) 카페24 무료 폰트: https://fonts.cafe24.com
