# AI Search Discovery for Beauty Providers — Hypothesis, Test, and Execution Plan

Date: 2026-04-03
Mode: $plan direct

## Requirements Summary

We are evaluating whether a service has real value if it helps beauty / medical-aesthetics providers get their services or products represented more accurately in AI-driven discovery flows.

Core idea:
- Input: provider gives an official URL (homepage, pricing page, Naver Place, Instagram, booking page, PDF menu, etc.)
- Processing: extract only source-grounded facts, structure them for machine readability, and publish an AI-search-friendly public profile page
- Output: a public page that search engines and AI search products can crawl, index, cite, compare, and route traffic to

Target outcome:
- When users ask ChatGPT / Gemini / Perplexity / Google AI features questions like “강남 레이저 제모 추천” or “best underarm laser hair removal in Gangnam,” the provider is more likely to appear accurately and with less distortion than before.

Important constraint:
- We can improve discoverability probability, but we cannot guarantee ranking or citation in any external AI search product.
- Therefore the product must be sold as “improving structured discoverability and reducing distortion,” not as “guaranteed AI rankings.”

## Current External Grounding

### What official docs support
1. Google says AI features use normal Search fundamentals; indexable, crawlable, high-quality pages remain the base requirement.
2. OpenAI documents crawler / bot controls, meaning public crawlable pages and bot allowances matter for search visibility.
3. Beauty is a large and growing category, and consumers are highly value-sensitive and comparison-driven, which strengthens the case for structured, accurate information.

### Why that matters here
This means the service value does **not** come from a secret “AI hack.”
It comes from:
- better crawlable public pages
- better structured facts
- clearer source attribution
- less ambiguity for comparison-heavy queries

## Main Question

Is there a business worth building around:
> “We turn your existing beauty service/product pages into AI-search-friendly structured profile pages that help AI systems represent you more accurately and more often.”

---

## Hypotheses

### H1 — Problem Hypothesis
Beauty providers already have a real pain point:
- their information is scattered
- AI answers can omit them or summarize them loosely
- customers often compare based on incomplete or distorted information

**Evidence needed**
- providers say this is already happening or feels risky
- providers care about “accurate representation in AI answers,” not just classic SEO

**Pass threshold**
- 8 of first 12 target interviews say the problem is real or urgent enough to explore
- 5+ can point to a concrete example: missing prices, wrong branch info, wrong treatment fit, omitted detail, or repeated customer confusion

---

### H2 — Willingness-to-Pay Hypothesis
Providers will pay for this if it is framed as:
- not another ad channel
- not another marketplace listing
- but an official AI-readable profile layer built from their own source pages

**Evidence needed**
- positive reaction to the positioning
- at least some willingness to pay setup fee or monthly maintenance fee

**Pass threshold**
- at least 3 of first 10 qualified prospects agree to a paid pilot or strong LOI-style commitment
- target early price signal:
  - setup fee: KRW 150,000–500,000 for concierge profile creation
  - monthly maintenance: KRW 50,000–200,000 if ongoing updates / monitoring are included

---

### H3 — Workflow Hypothesis
The onboarding can be extremely simple:
- provider sends URL(s)
- we extract facts
- provider approves
- page publishes

**Evidence needed**
- providers are willing to share URLs instead of filling long forms
- approval can happen in one short review round

**Pass threshold**
- 80%+ of pilot providers can complete onboarding with only URLs + one approval pass
- average provider-side effort under 10 minutes

---

### H4 — Discoverability Hypothesis
A structured public profile page created from official provider sources will be more discoverable and more accurately cited than the original scattered sources alone.

**Evidence needed**
- page gets indexed
- AI search systems can access it
- before/after query sets show improved presence, citation, or factual consistency

**Pass threshold**
- at least 3 pilot pages indexed by Google or Bing within test window
- for at least 2 pilot providers, a fixed before/after prompt set shows one of:
  - new appearance in results
  - more accurate citation
  - more complete factual extraction
  - better referral clicks from search/AI traffic

---

### H5 — Measurement Hypothesis
Even if AI search attribution is imperfect, we can still measure value with a combination of:
- indexing status
- citation presence in fixed prompt tests
- referral traffic
- tracked booking / contact clicks

**Evidence needed**
- enough telemetry to show directional value to providers

**Pass threshold**
- each pilot profile has a measurement dashboard with:
  - index status
  - crawl status
  - query test log
  - referral clicks
  - CTA clicks

---

## Non-Hypotheses / Things Not To Assume

Do **not** assume:
- ChatGPT / Gemini / Perplexity will reliably cite new pages quickly
- search products will use the page exactly as intended
- one page is enough without internal linking, sitemap, and crawlability work
- beauty providers understand or care about “agents” as a category
- general SEO agencies are already solving this exact “AI representation accuracy” problem well enough

---

## Target Customer Order

### Primary wedge
1. Medical aesthetics clinics
   - laser hair removal
   - skin boosters
   - pigmentation / acne / lifting pages with repeated comparison queries

### Secondary wedge
2. High-consideration beauty product brands
   - products with strong ingredient, usage, and fit questions

### Why start here
- comparison-heavy category
- lots of repeated “which clinic / which treatment / which product fits me” queries
- structured fields matter: price, branch, treatment type, fit, cautions, booking path

---

## MVP Definition

### MVP offer
A concierge service first, not a software platform.

Input:
- 1 to 5 official source URLs from the provider

Output:
- one public structured profile page on our domain
- source attribution section
- machine-readable metadata
- tracked booking/contact link
- simple before/after AI-search test report

### MVP page must include
- provider / product / service name
- branch or location
- category / procedure / product type
- exact source-backed facts only
- what is explicitly stated vs not clearly stated
- source URLs
- last verified date
- CTA to official booking/contact/purchase page
- structured data (schema.org JSON-LD where applicable)
- crawlable plain HTML, not hidden behind JS-only rendering

### MVP infrastructure must include
- real `robots.txt`
- real `sitemap.xml`
- internal links between profile pages and category pages
- bot access policy that does not block major crawlers unintentionally
- Search Console + Bing Webmaster setup

---

## Acceptance Criteria

1. We can clearly explain the value proposition in one sentence without mentioning “agent marketplace.”
   - Test: prospects understand the offer within 30 seconds
2. We can create a provider profile from URLs only, without a custom spreadsheet intake.
   - Test: first 5 profiles completed end-to-end
3. We can publish fully crawlable public pages.
   - Test: `robots.txt`, `sitemap.xml`, HTML text, structured metadata all validate manually
4. We can run before/after prompt tests on fixed queries.
   - Test: repeatable prompt set exists for each provider
5. We can measure at least one concrete business proxy.
   - Test: referral / CTA / inquiry click tracking active
6. At least one provider agrees the structured page is more accurate and useful than their scattered original info alone.
7. At least one provider is willing to pay for pilot or continuation.

---

## Test Plan

## Test 1 — Problem Validation Interviews

### Goal
Validate whether providers actually care.

### Method
Interview 12–15 providers in the wedge:
- 8 clinics
- 4–7 beauty product brands or distributors

### Questions to ask
- Have customers ever arrived with wrong expectations because online information was incomplete or confusing?
- Have you checked what ChatGPT / Gemini says about your clinic/product?
- If AI search becomes a bigger discovery path, do you care whether your official info is represented accurately?
- If we turned your current pages into one AI-readable official profile page, would that feel useful?
- Would you try it if setup were done for you from existing URLs?

### Success criteria
- 8/12 say the problem is meaningful
- 5/12 show concrete misrepresentation or omission pain
- 3/12 ask price or pilot details

---

## Test 2 — Concierge MVP Build

### Goal
See whether the workflow itself is practical.

### Method
Build 5 pilot profiles manually.

### Candidate mix
- 3 clinics
- 2 products or brands

### For each pilot
1. collect official URLs
2. extract facts manually
3. draft structured profile page
4. ask provider to approve facts
5. publish page

### Success criteria
- provider-side effort under 10 minutes
- one approval round average
- no serious factual dispute after publication

---

## Test 3 — Technical Discoverability Test

### Goal
Check whether pages are crawlable and indexable.

### Method
For each profile page:
- submit to search engines where possible
- ensure sitemap inclusion
- inspect with search operators and webmaster tools
- confirm bots are not blocked

### Success criteria
- Google or Bing indexing for at least 3 pages in test window
- bots can fetch the page successfully

---

## Test 4 — Fixed Prompt Before/After Test

### Goal
See whether AI search outputs improve directionally.

### Method
Before publishing, save outputs from a fixed prompt set on the same date window.
After publishing and after indexing time, repeat the same prompts.

### Example prompt set
- “강남 겨드랑이 레이저 제모 추천해줘. 가격도 같이.”
- “best underarm laser hair removal in Gangnam with official pricing”
- “OOO clinic laser hair removal price”
- “Which Gangnam clinics list official underarm laser pricing?”

### What to compare
- does provider appear at all?
- is the citation source official or noisy?
- are core facts accurate?
- is branch / price / treatment type more complete?

### Success criteria
Directional improvement on at least 2 provider cases.

### Important note
Because AI answers vary by date, account, location, and product rollouts, this is a directional experiment, not absolute proof.

---

## Test 5 — Commercial Test

### Goal
Check if this is merely “interesting” or actually buyable.

### Offer to test
- pilot package: structured AI profile page + baseline audit + one update round + 30-day check-in

### Pricing test
Try three price anchors in conversations:
- KRW 150,000
- KRW 300,000
- KRW 500,000

### Success criteria
- at least 3 paid pilots or very strong commitment signals
- at least one upsell request for more pages / branches / products

---

## Execution Steps

### Phase 0 — Clarify the offer (1 day)
1. Write one-sentence value proposition
2. Write one short problem statement for clinics
3. Write one short problem statement for product brands
4. Define what we do **not** promise

### Phase 1 — Validate problem and willingness to pay (5–7 days)
1. Build interview list of 15 prospects
2. Run short calls / chats / DMs
3. Capture exact pain language
4. Refine pitch based on objections

### Phase 2 — Build concierge MVP (3–5 days)
1. Create reusable fact extraction template
2. Create reusable profile page template
3. Create source citation template
4. Create before/after AI-query logging sheet
5. Publish first 3–5 pages manually

### Phase 3 — Run discoverability experiment (2–6 weeks)
1. Submit pages for indexing
2. Monitor crawl/index status
3. Repeat fixed prompt tests weekly
4. track clicks / inquiries
5. package before/after evidence per pilot

### Phase 4 — Decide go / no-go (after first cohort)
1. Review interview conversion
2. Review pilot willingness to pay
3. Review indexing / citation outcomes
4. Review operational cost per page
5. choose one:
   - continue as concierge service
   - build lightweight SaaS tooling for internal use
   - stop if value is too weak or too slow to prove

---

## What Must Be Built First

### Must-have assets
- landing page explaining the offer in plain business language
- intake form for URLs
- structured profile template
- fact extraction checklist
- source citation rulebook
- prompt test sheet
- lightweight analytics for CTA clicks

### Nice-to-have later
- automated extraction pipeline
- provider self-serve dashboard
- bulk page generation
- automated monitoring of AI-answer drift

---

## Risks and Mitigations

### Risk 1 — AI search changes too often
**Mitigation**
- sell “probability improvement + accuracy layer,” not guaranteed placement
- keep evidence logs dated by exact test date

### Risk 2 — providers do not care enough
**Mitigation**
- start with high-consideration, comparison-heavy treatments
- pitch from customer confusion and lost-fit traffic, not abstract AI hype

### Risk 3 — indexing is too slow to prove value
**Mitigation**
- run internal fixed-query tests plus webmaster proof plus click tracking
- treat indexing delay as expected, not as automatic failure in week 1

### Risk 4 — factual / legal risk in medical-aesthetics claims
**Mitigation**
- only publish source-backed facts
- separate “officially stated” from “not clearly stated”
- avoid medical guarantees, efficacy claims, and suitability advice

### Risk 5 — this becomes generic SEO consulting
**Mitigation**
- keep the wedge narrow: AI-readable, source-grounded, structured profile pages for beauty / aesthetics
- sell the “accuracy in AI discovery” angle, not generic rankings

---

## Verification Steps

1. Confirm official source docs support the product premise:
   - Google AI/search docs
   - OpenAI crawler / bot docs
2. Confirm 12–15 interviews are logged with exact quotes
3. Confirm first 5 profile pages are public and crawlable
4. Confirm `robots.txt` and `sitemap.xml` are valid and live
5. Confirm before/after query logs exist with dates and exact prompts
6. Confirm provider approval records exist for published facts
7. Confirm commercial outcomes:
   - paid pilot
   - or explicit refusal reasons

---

## Recommendation

Recommendation: **test this as a concierge service first**.

Why:
- the biggest uncertainty is not software complexity
- it is whether providers care enough and whether discoverability improvements are strong enough to monetize
- concierge work gives the fastest truth on pain, willingness to pay, and proof quality

Avoid building a large platform first.
The first real milestone is:
> “Can we take 5 providers, turn official URLs into AI-readable profile pages, and show at least directional improvement plus willingness to pay?”

If yes, then build tooling.
If not, stop early.

---

## Concrete Next 7 Actions

1. Finalize one-sentence offer
2. Pick first wedge: laser hair removal clinics in Seoul/Gangnam
3. Build 15-prospect outreach list
4. Create interview script
5. Create one profile template
6. Create one before/after prompt test template
7. Run first 3 concierge pilots manually

---

## Sources
- Google Search Central, AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- OpenAI bot / crawler documentation: https://platform.openai.com/docs/bots
- OpenAI ChatGPT search product discovery: https://openai.com/chatgpt/search-product-discovery/
- McKinsey, A close look at the global beauty industry in 2025: https://www.mckinsey.com/industries/consumer-packaged-goods/our-insights/a-close-look-at-the-global-beauty-industry-in-2025
