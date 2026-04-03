# Demo Packet — Shinebeam Clinic Gangnam

Date: 2026-04-03
Goal: Show what we can still do even when the source is not as clean as Muse.

## 1. What we start with
Official source URLs:
- https://gangnam.shinebeam.co.kr/ko/pricing/1/treatment
- https://gangnam.shinebeam.co.kr/en

## 2. Raw source evidence we can point to
### Evidence A — treatment taxonomy + transparency message
On the public Korean pricing page:
- heading: `시술 안내·가격`
- message: `샤인빔 클리닉은 제품과 가격을 투명하게 안내합니다.`
- category visible in treatment taxonomy: `레이저 제모`
- booking CTA visible: `바로 예약`

### Evidence B — branch facts from public page payload
Visible in the public page payload:
- phone: `02-2088-1008`
- address: `서울시 강남구 테헤란로1길 10,세경빌딩 지하1층/2층/4층`
- Kakao ID: `샤인빔의원 강남`
- English location variant also visible: `2F/4F, Segyeong Building, 10, Teheran-ro 1-gil, Gangnam-gu, Seoul`

## 3. Why this is still useful as a demo
This case is important because it shows a harder but realistic situation:
- the branch is transparent
- the treatment taxonomy is public
- booking is public
- but the exact laser hair removal price/item deep link is not yet isolated cleanly from the visible page

That means our system must handle both:
1. rich-price sources like Muse
2. taxonomy-first sources like Shinebeam

## 4. Canonical fact sheet
| Field | Value | Source-backed? |
|---|---|---|
| provider_name | 샤인빔의원 | Yes |
| branch_name | 샤인빔클리닉 강남 / Shinebeam Gangnam | Yes |
| city | 서울 | Yes |
| district | 강남구 | Yes |
| address | 서울시 강남구 테헤란로1길 10, 세경빌딩 지하1층/2층/4층 | Yes |
| phone | 02-2088-1008 | Yes |
| kakao | 샤인빔의원 강남 | Yes |
| public_positioning | 샤인빔 클리닉은 제품과 가격을 투명하게 안내합니다 | Yes |
| treatment_category | 레이저 제모 | Yes |
| booking_cta | 바로 예약 / Book Now | Yes |
| source_urls | pricing page + English branch page | Yes |
| last_verified_at | 2026-04-03 | Yes |

## Not clearly stated yet from current public source pass
- exact laser hair removal package names
- exact price points
- exact body-part mapping
- restrictions / availability by package
- downtime / aftercare

## 5. AI-readable record
```json
{
  "entity_type": "beauty_clinic_branch_page",
  "provider_name": "샤인빔의원",
  "branch_name": "샤인빔클리닉 강남",
  "location": {
    "country": "KR",
    "city": "서울",
    "district": "강남구",
    "address": "서울시 강남구 테헤란로1길 10, 세경빌딩 지하1층/2층/4층"
  },
  "contact": {
    "phone": "02-2088-1008",
    "kakao": "샤인빔의원 강남"
  },
  "source_urls": [
    "https://gangnam.shinebeam.co.kr/ko/pricing/1/treatment",
    "https://gangnam.shinebeam.co.kr/en"
  ],
  "last_verified_at": "2026-04-03",
  "public_positioning": "샤인빔 클리닉은 제품과 가격을 투명하게 안내합니다.",
  "treatment_taxonomy": ["레이저 제모"],
  "booking_cta_visible": true,
  "not_clearly_stated": [
    "laser hair removal package names",
    "laser hair removal prices",
    "body-part specific offerings",
    "restrictions and aftercare"
  ],
  "next_best_input_needed": [
    "direct laser hair removal product URL",
    "official branch booking URL if separate"
  ]
}
```

## 6. Why this demo still persuades
It proves we are not faking confidence.
We can say:
- Here is what is definitely public.
- Here is what is not clearly stated.
- If the clinic gives one more direct URL, we can upgrade this into a richer treatment-level profile.

That is exactly the behavior a trustworthy system should have.

## 7. How this would be shown in a demo call
1. Show the public pricing page and point to `레이저 제모`.
2. Show the transparency message.
3. Show that branch phone/address/Kakao can be normalized.
4. Show the canonical JSON packet.
5. Explain that one direct treatment URL would instantly make this profile much richer.

## 8. What this means for sales
This is a good target not because the demo is already perfect, but because:
- the clinic already talks in a transparency language
- they are likely to understand the value of structured discoverability
- asking for one direct URL is a small next step, not a large commitment
