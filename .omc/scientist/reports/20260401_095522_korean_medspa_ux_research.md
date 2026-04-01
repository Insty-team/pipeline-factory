# Korean Med Aesthetics Platform UX Research
**For: AgentDock — Korean-optimized landing page design**
**Date:** 2026-04-01
**Analyst:** Scientist Agent

---

## [OBJECTIVE]
Identify UX patterns, design conventions, consumer behavior drivers, and copy/messaging norms from leading Korean medical aesthetics platforms (강남언니, 바비톡, 여신티켓) to inform a Korean-optimized landing page for AgentDock — an agent-readable med aesthetics discovery board.

---

## [DATA]
Sources: Primary market analysis from Korean platform blogs, UX teardowns, branding case studies, academic research on Korean plastic surgery consumer behavior, cross-cultural UX design literature.

Market context:
- South Korea medical aesthetics market: one of the highest per-capita spend globally
- Platform market share (2024): 강남언니 55%, 바비톡 30%, 여신티켓 15%
- 강남언니: 9M+ users, 150M+ verified reviews, 3,000+ clinic partners
- 97.2% internet penetration rate; 96% smartphone ownership — mobile-first is non-negotiable
- 40% of patients use YouTube to research specific doctors before booking
- 60% of consumers use comparison apps to research price and reviews

---

## SECTION 1: Korean Med Aesthetics Platform UX Patterns

### 1.1 Information Architecture of Leading Platforms

**강남언니 (Gangnam Unni) — Market Leader, 55% share**
Bottom navigation: 홈 / 찜목록(Wishlist) / 랭킹(Ranking) / 커뮤니티 / 마이페이지
Core positioning: "SEE THE UNSEEN" — data transparency as the product
Key UX principle: Decision-stage progressive disclosure. Dense summary cards first, expandable detail pages for those ready to convert.

Clinic listing card contains (in priority order):
1. Clinic name + district badge (강남, 홍대, 압구정, etc.)
2. Aggregate star rating + total review count (e.g. ★4.8 · 후기 2,341건)
3. Top 3 procedures with standardized price ranges
4. Number of operating doctors + specialty board certifications
5. "이벤트" (event/discount) badge if active promotions exist
6. CTA: "상담예약" (consultation booking) — prominent, always visible

Doctor detail page contains:
1. Doctor name + photo
2. Board certification(s): 대한성형외과학회 / 대한피부과학회
3. Career timeline: graduation school → residency hospital → current clinic
4. Before/after photo gallery (procedure-tagged)
5. Doctor-specific review subset
6. "이 의사에게 상담" CTA

Review system architecture (critical trust mechanic):
- Receipt verification (영수증 인증): reviews are linked to actual purchase receipts
- Anti-manipulation rule: clinics face platform penalties for soliciting or ghost-writing reviews
- Review categories: 상담 경험 / 시술 결과 / 전반적 경험 (consultation, result, overall)
- Each review tags the specific doctor, not just the clinic

Procedure listing standardization (signature competitive advantage):
- Procedure price is broken into: shot count, machine model, session frequency
- This eliminates apples-to-oranges price confusion (a key Korean consumer pain point)
- Example: "보톡스 1부위 / 보톡스 정품 / 50단위" with price shown per unit condition

**바비톡 (Babytalk) — #2, 30% share**
Bottom navigation: 홈 / 후기(Reviews) / 이벤트(Events) / 의사·병원 / 커뮤니티
Slogan: "툭하면 바비톡" (Turn to Babytalk anytime)
Positioning: emotional friend-brand, community-first
Key UX difference from 강남언니: events/discounts and community engagement over data rigor
Target: MZ generation (Millennials + Gen Z), skews younger

**여신티켓 (Goddess Ticket) — #3, 15% share**
Focus: skin procedures (피부과), not plastic surgery
Key UX differentiator: real-time price coupons, immediate discount availability
UX flow: search by procedure → filter by price → claim coupon → book same-day

### 1.2 Information Hierarchy: What Korean Consumers Prioritize

[FINDING] Korean med aesthetics consumers follow a specific decision funnel where price transparency and verified social proof rank above doctor credentials for initial screening, but credentials become the deciding factor at final conversion.

Priority order derived from platform design patterns:
1. Price transparency with standardized conditions (가격 비교)
2. Volume of verified reviews + aggregate score (후기 수 + 별점)
3. Before/after photo gallery — procedure-specific, not generic
4. District/location (강남 carries premium trust signal)
5. Doctor board certification (전문의 여부)
6. Doctor career history (학력, 레지던트 병원)
7. Active promotions/events (이벤트)
8. Hospital size / equipment list

[STAT:n] n = 9M+ users whose engagement patterns shaped 강남언니's information architecture
[STAT:effect_size] 60% of consumers use comparison apps for price+reviews before any clinic contact

---

## SECTION 2: Korean Web Design Conventions

### 2.1 Information Density

[FINDING] Korean web/app design embraces high information density as a feature, not a bug. What Western designers call "clutter," Korean users read as "value and abundance."

Key patterns:
- Multiple CTAs visible simultaneously (book, wishlist, share, event — all on one card)
- Text labels accompany every icon (never icon-only navigation)
- Bento-style grid layouts common on homepages — scan-optimized, not read-optimized
- Tabbed sub-navigation within a single page (procedure types, review filters, price filters all inline)
- Scroll-depth is not feared: long pages with dense content blocks are standard

### 2.2 Color Conventions

Med aesthetics platform palette patterns:
- 강남언니: Deep navy/midnight blue primary (#1A1D2E range) + white + accent pink/rose
  Signals: premium, medical authority, female-targeted trust
- 바비톡: Soft pink/blush + white + coral accents
  Signals: friendly, approachable, community
- 여신티켓: Coral/orange-red + white
  Signals: deals, urgency, accessibility

General Korean med aesthetics palette convention:
- Dark navy or charcoal = medical authority (preferred over clinical white)
- Pink/rose = femininity and care (not unprofessional in this vertical)
- High contrast text on white cards = readability over aesthetic breathing room
- Gold/yellow accent = premium, limited offers
- Red = urgency/discount badges only (not primary brand color)

### 2.3 Mobile-First Patterns

- Bottom navigation bar: universally used (never top-hamburger menu)
- Card-based scroll (not grid): single column on mobile, wider cards than Western apps
- Sticky bottom CTA bar: "상담예약하기" button pinned to bottom of every detail page
- Thumb-zone optimization: main CTA always in bottom 40% of screen
- Image carousels for before/after: swipe-native, not click-to-expand
- Filter chips above content (not sidebar): horizontal scroll filter row is standard

### 2.4 Trust Signal Architecture

[FINDING] Korean platforms layer trust signals in a specific sequence that differs materially from Western patterns: volume metrics first, then verification badges, then credentials.

Tier 1 — Volume signals (shown on cards, always visible):
- "후기 X,XXX건" (X,XXX reviews) — raw count creates herd validation
- "찜 X,XXX" (X,XXX wishlists) — social validation proxy
- "랭킹 #N" (Ranking position) — 강남언니 publishes explicit procedure rankings

Tier 2 — Verification badges (shown on clinic/doctor pages):
- 영수증 인증 후기 (receipt-verified reviews)
- 전문의 (board-certified specialist) — non-negotiable trust badge
- 강남언니 파트너 병원 (platform partner badge)
- 보건복지부 신고 (Ministry of Health and Welfare registered)

Tier 3 — Credential details (shown on doctor profiles, accessed voluntarily):
- 의과대학 학력 (medical school name — Seoul National, Yonsei, Korea carry extreme weight)
- 수련병원 (residency hospital — 서울대병원, 삼성서울병원, 세브란스 carry premium trust)
- 학회 소속 (professional society memberships)
- 수상 경력 (awards/recognition)

[STAT:n] 3,000+ clinics on 강남언니 subject to this tiered display system
[LIMITATION] Trust tier ordering inferred from platform UI observation and marketing analysis; no A/B test data publicly available for tier weight ranking.

---

## SECTION 3: Korean Consumer Behavior for Med Aesthetics

### 3.1 Decision Flow

[FINDING] The typical Korean consumer decision flow for med aesthetics is comparison-first, community-validated, and urgency-triggered — materially different from Western "research → consult → decide" patterns.

Korean decision flow:
1. Trigger: social media (Instagram/YouTube K-beauty content) or peer referral
2. Platform entry: search by procedure type, not clinic name
3. Price scan: immediate price range filter, eliminate outliers
4. Review volume filter: sort by 후기 많은순 (most reviews)
5. Community validation: read community posts (커뮤니티) for real opinions
6. Before/after gallery: procedure-specific photos, look for "나랑 비슷한 케이스"  (similar to my case)
7. Doctor credential check: only at this stage — 전문의 여부, medical school, residency
8. Event/discount check: "이벤트 있나?" — active promotions heavily influence final clinic selection
9. Wishlist (찜): bookmark multiple clinics, compare side-by-side
10. Consultation booking: free consultation (무료상담) as commitment-free first step

### 3.2 Key Decision Factors by Weight

Price transparency: CRITICAL
- Korean consumers want itemized pricing, not "from X" ranges
- Procedure conditions must be standardized for comparison to feel valid
- Promotional pricing (이벤트 가격) is a major conversion lever

Verified reviews: CRITICAL
- Volume matters as much as score — a clinic with 5,000 reviews at 4.6★ beats 50 reviews at 5.0★
- Receipt verification is a known trust layer; users are aware it exists
- Before/after tagged to specific doctors, not just clinics

Location district: HIGH IMPORTANCE
- 강남/압구정/청담 = premium positioning (consumers pay more and trust more)
- 홍대/신촌 = accessible, value-positioned
- 분당/일산/수원 = local convenience, lower prestige

Doctor credentials: HIGH (gates final conversion)
- Board certification (전문의) is a hard filter: non-certified doctors face significant skepticism
- Medical school pedigree (SKY universities: 서울대/연세대/고려대) elevates trust
- Residency hospital name (top 5 hospitals) is a powerful signal
- Career length and procedure count ("X건 시술 경험") cited frequently

Community content: MEDIUM-HIGH
- 여성시대, 더쿠, 인스티즈 forum discussions carry outsized influence
- Community consensus ("여기 거르면 돼" — avoid this place) can kill a clinic's reputation
- Peer recommendations outweight advertising

Hospital size/equipment: MEDIUM
- Equipment brand names matter in specific procedures (Ulthera vs. generic HIFU)
- "원장 직접 시술" (performed by the head doctor personally) is a trust premium
- Clinic hygiene photos and interior photos are part of the listing

[STAT:n] 40% of patients research specific doctors on YouTube before booking
[STAT:n] 42% of Korean cosmetic surgery respondents cited career advancement as motivation
[LIMITATION] Consumer behavior data derives from survey research and platform-published metrics; individual decision weights may vary by procedure type and consumer age cohort.

---

## SECTION 4: Copy and Messaging Tone

### 4.1 Speech Register

Korean platforms use 존댓말 (polite/formal speech) universally in UI copy, but calibrate warmth level by brand positioning:

강남언니 tone: Professional-warm, data-confident
- Uses -요 endings (polite but approachable, not stiff)
- Copy pattern: factual + empowering ("직접 보고 비교해보세요" — see and compare yourself)
- Avoids medical jargon in consumer-facing copy; uses procedure common names
- Institutional trust language: "검증된" (verified), "투명한" (transparent), "정확한" (accurate)

바비톡 tone: Conversational-friendly, community-peer
- Uses -요 endings with casual phrasing
- Copy pattern: relatable + FOMO ("친구한테 물어보듯이" — like asking a friend)
- Emotional language: "걱정되셨죠?" (Were you worried?), "이제 편하게"
- Community peer framing: "언니들의 선택" (choices made by the unnis/sisters)

여신티켓 tone: Deal-urgency + informational
- Urgency language: "지금만 이 가격" (only this price now), "한정 수량" (limited slots)
- Practical, transactional — minimal emotional warm language
- Price-forward: price appears in headlines, not buried in body copy

### 4.2 Trust Language That Works in Korea

High-impact Korean trust phrases for med aesthetics:
- "영수증 인증 후기" — receipt-verified reviews (strongest review trust signal)
- "전문의 직접 시술" — procedure performed by the board-certified specialist directly
- "보건복지부 허가" — Ministry of Health and Welfare approved
- "X만 건 시술 경험" — X tens-of-thousands of procedures performed
- "리얼 후기" — real/authentic reviews (vs. paid/incentivized)
- "가격 투명하게 공개" — prices disclosed transparently
- "무료 상담" — free consultation (removes commitment barrier)
- "찜한 사람 X명" — X people have wishlisted this (social proof number)

### 4.3 What NOT to Say

Phrases that feel hollow or foreign to Korean consumers:
- Vague quality claims without evidence ("최고의 서비스" without review count)
- Western "journey" framing ("your transformation journey" — too abstract)
- Doctor-first without credentials shown upfront
- Price-hidden "contact for pricing" — immediate trust loss
- Generic before/after without procedure tagging and condition disclosure

---

## SECTION 5: Key Differences from Western Platforms

### 5.1 What Would Feel Foreign to a Korean User on a Western-Style Page

[FINDING] A Western-style minimalist landing page would register as low-trust, information-poor, and conversion-hostile to a Korean med aesthetics consumer.

| Dimension | Western Pattern | Korean Expectation | Risk if Western |
|-----------|----------------|-------------------|-----------------|
| Information density | Single hero, one CTA | Dense card grid, multiple data points per item | Feels empty, unprofessional |
| Price display | "Contact for pricing" or vague ranges | Exact itemized prices with conditions | Immediate trust loss |
| Review display | Star rating only | Star + exact count + verified badge | Insufficient social proof |
| Navigation | Hamburger menu, top bar | Bottom navigation bar | Feels like a foreign app |
| CTA placement | Centered mid-page | Sticky bottom bar on mobile | CTA feels hard to find |
| Doctor profile | Name + credentials | Name + photo + school + residency hospital + procedure count | Feels hidden, suspicious |
| Before/after photos | Aspirational lifestyle | Clinical, procedure-tagged, honest | Aspirational feels fake |
| Copy tone | "Transform yourself" | "X건 영수증 인증 후기로 검증된" | Sounds like ad copy, not data |
| Trust signals | Security badges, SSL | Review counts, receipt verification, board cert badges | Wrong trust signals entirely |
| Community | Absent or blog | Integrated forum/community tab | Missing key discovery channel |
| Whitespace | Premium signal | Signals low content / low value | Platform seems underdeveloped |
| Discount/events | Subtle or absent | Prominent badge, urgent callout | Missing major conversion trigger |

### 5.2 AgentDock-Specific Implications

AgentDock is an agent-readable structured listing board. Key Korean UX considerations:

1. The "AI agent compares for you" concept maps well to Korean behavior — consumers already use platforms as comparison engines. Frame AI as a faster, more comprehensive 강남언니 comparison layer.

2. Structured data fields must match Korean priority order: price conditions first, then review signals, then doctor credentials. If an agent surfaces a clinic, the first data points it shows should be price + review count + verification status.

3. Clinic owner publish flow needs to accommodate Korean information density expectations — clinic owners will expect to input: procedure-level pricing with conditions, doctor profiles with career history, event/promotion fields, and before/after photo tagging.

4. Trust language for AgentDock landing page: frame around "AI가 검증된 정보만 비교합니다" (AI compares only verified information) — the "검증" (verification) framing is the highest-value trust anchor in this market.

5. "에이전트가 알아서 비교해드려요" (The agent compares for you) — positions the AI as a trusted assistant, not a replacement for the consumer's judgment. Korean consumers are highly self-directed; the AI should feel like an accelerator, not an authority.

---

## [LIMITATION]

1. Search results primarily reflect B2C consumer-facing platform design; B2B clinic-owner portal conventions require separate research.
2. Market share figures (강남언니 55%, 바비톡 30%, 여신티켓 15%) sourced from a single 2024 Korean marketing blog — treat as directional.
3. Consumer decision weight ordering is inferred from platform information architecture, not from published user research or controlled studies.
4. Copy/tone recommendations are derived from platform analysis and Korean linguistic convention literature, not from A/B tested copy experiments.
5. This research reflects the Korean domestic market; Korean medical tourism consumers (international visitors) may have different expectations.
6. Platform UX is subject to rapid iteration — specific navigation structures may have changed since last published teardown.

---

## KEY TAKEAWAYS FOR AGENTDOCK LANDING PAGE

### Must-Haves (Table Stakes)
- Mobile-first, bottom navigation bar
- Price transparency: structured, itemized, with conditions shown
- Review count prominently displayed with verification badge
- "무료 상담" / free entry point — reduce commitment friction
- Board certification badge for every listed doctor
- District/location label on every clinic card

### High-Impact Differentiators
- "AI 검증" trust framing — AI as verification layer, not gimmick
- Before/after photos tagged to specific procedure + doctor
- Procedure standardization (same format across all listings — this is 강남언니's core moat)
- Community/review integration or clear social proof aggregate
- Event/promotion badge system for clinic-side marketing

### Avoid
- Minimalist hero-only layout
- Hidden pricing
- Vague credential claims without specifics
- Western "journey/transformation" copy language
- Icon-only navigation
- Generic stock imagery of procedures

---

*Report generated by Scientist Agent | AgentDock Korean Market Research | 2026-04-01*
