# Demo Packet — Muse Clinic Myeongdong

Date: 2026-04-03
Goal: Show what this service actually produces from public official URLs.

## 1. What we start with
Official source URL:
- https://myeongdong.museclinic.co.kr/index.php/price/price_view/?middleId=5820

Problem with the raw source alone:
- the page is readable to humans, but information is embedded in a long event page
- AI can miss branch-level facts, package conditions, or booking cues
- price, branch, treatment, and contact info are present, but not normalized into one clean fact record

## 2. Raw source evidence we can point to
### Evidence A — treatment + price
- `[여성] 겨드랑이 + 인중 제모 5회`
- `29,000`
- strike-through `50,000`
- description includes `아포지플러스 / 공중타격방식 / 쿨링요법`
- booking CTA visible: `예약`

### Evidence B — another treatment + price
- `[여성] 브라질리언 제모(항문포함) 5회`
- `250,000`
- strike-through `360,000`
- booking CTA visible: `예약`

### Evidence C — branch facts
- branch name: `뮤즈클리닉 명동점`
- phone: `02-754-5599`
- KakaoTalk: `뮤즈의원명동`
- branch lead: `임사랑`
- address: `서울특별시 중구 퇴계로 97, 고려대연각타워 3층`

## 3. What we convert it into
This is the actual product shape: a source-backed, machine-readable canonical record.

## Canonical fact sheet
| Field | Value | Source-backed? |
|---|---|---|
| provider_name | 뮤즈의원 | Yes |
| branch_name | 뮤즈클리닉 명동점 | Yes |
| city | 서울 | Yes |
| district | 중구 / 명동권 | Partly inferred from address; district yes, 명동권 inferred from branch name |
| category | 의료미용 / 레이저 제모 | Yes |
| treatment_1 | [여성] 겨드랑이 + 인중 제모 5회 | Yes |
| treatment_1_price | 29,000 KRW | Yes |
| treatment_1_original_price | 50,000 KRW | Yes |
| treatment_1_notes | 아포지플러스 / 공중타격방식 / 쿨링요법 / 일요일은 제모 시술 불가 | Yes |
| treatment_2 | [여성] 브라질리언 제모(항문포함) 5회 | Yes |
| treatment_2_price | 250,000 KRW | Yes |
| treatment_2_original_price | 360,000 KRW | Yes |
| booking_cta | 예약 | Yes |
| phone | 02-754-5599 | Yes |
| kakao | 뮤즈의원명동 | Yes |
| branch_representative | 임사랑 | Yes |
| address | 서울특별시 중구 퇴계로 97, 고려대연각타워 3층 | Yes |
| source_url | https://myeongdong.museclinic.co.kr/index.php/price/price_view/?middleId=5820 | Yes |
| last_verified_at | 2026-04-03 | Yes |

## Not clearly stated on source page
- downtime
- consultation requirement for this specific package
- candidacy / contraindications
- detailed aftercare
- VAT inclusion in final user payment beyond the visible `VAT별도` note

## 4. AI-readable record
```json
{
  "entity_type": "beauty_clinic_treatment_page",
  "provider_name": "뮤즈의원",
  "branch_name": "뮤즈클리닉 명동점",
  "location": {
    "country": "KR",
    "city": "서울",
    "district": "중구",
    "address": "서울특별시 중구 퇴계로 97, 고려대연각타워 3층"
  },
  "contact": {
    "phone": "02-754-5599",
    "kakao": "뮤즈의원명동"
  },
  "source_url": "https://myeongdong.museclinic.co.kr/index.php/price/price_view/?middleId=5820",
  "last_verified_at": "2026-04-03",
  "treatments": [
    {
      "name": "[여성] 겨드랑이 + 인중 제모 5회",
      "category": "레이저 제모",
      "price_krw": 29000,
      "original_price_krw": 50000,
      "device_or_method": ["아포지플러스", "공중타격방식", "쿨링요법"],
      "restrictions": ["일요일은 제모 시술 불가"],
      "booking_cta_visible": true
    },
    {
      "name": "[여성] 브라질리언 제모(항문포함) 5회",
      "category": "레이저 제모",
      "price_krw": 250000,
      "original_price_krw": 360000,
      "device_or_method": ["아포지플러스", "공중타격방식", "쿨링요법"],
      "restrictions": ["일요일은 제모 시술 불가"],
      "booking_cta_visible": true
    }
  ],
  "not_clearly_stated": [
    "downtime",
    "consultation requirement",
    "contraindications",
    "aftercare details"
  ]
}
```

## 5. What this enables that the raw page does not
### Query examples that become easier to answer accurately
- `명동 제모 가격 알려줘`
- `명동역 근처 겨드랑이 제모 패키지 있어?`
- `뮤즈클리닉 명동점 제모 가격`
- `인중+겨드랑이 제모 같이 하는 곳 추천해줘`

### Why the structured layer helps
Because the important facts are already normalized:
- branch
- treatment name
- package unit (5회)
- current price vs strikethrough price
- method/device clues
- contact route
- booking visibility
- unknown fields explicitly marked as unknown

## 6. What the clinic would see in a demo
Instead of “here is a prettier landing page,” we would show:
1. the official source page
2. the extracted fact sheet
3. the canonical AI-readable record
4. the public profile page generated from this record
5. before/after query log

## 7. Why this is persuasive
This demo proves:
- we can work only from official public URLs
- we do not invent missing information
- we can turn scattered clinic info into one clean machine-readable layer
- the clinic effort can be just: “send URLs, review facts, approve”
