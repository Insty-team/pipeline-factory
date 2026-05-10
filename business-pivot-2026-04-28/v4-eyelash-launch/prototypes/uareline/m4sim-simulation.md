# M4-sim — AI 시술 시뮬레이션 (속눈썹 컬·풍성도 + 메디핑크 Before/After)

> Day 3 추가 산출물 — 2026-05-10
> 시드: M4 카카오 챗봇 + 사장 인스타 31장 시술 사진 + 사장 시술 결과 사진 (`sample_pictures_0505/`)
> 통합 위치: `02-target-uareline-prototype.md` §3 M4-sim (M4 챗봇의 시각적 확장)
>
> **목적**: 신규 손님 첫 시술 frustration 해결 + 사장 컨설팅 시간 30분 → 10분
> **차별화**: 1인 속눈썹샵 unique selling point — 동네 경쟁샵·체인 모두 미보유
>
> ⚠️ **모든 시뮬 결과에 disclaimer 필수**: "참고용 / 실제 결과는 손님 모질·뿌리 방향·피부 상태에 따라 차이"

---

## 0. 작업 결과 요약

| 항목 | 값 |
|---|---|
| 시뮬 종류 | **3종** (① 컬 비교 J/C/D / ② 풍성도 50%/90% / ③ 메디핑크 Before/After) |
| 입력 | 손님 셀카 1장 (눈 또는 부위) |
| 출력 | 비교 이미지 4장 (원본 + 시뮬 3장) — 카드 1장으로 합성 |
| 응답 시간 | ~10초 (GPT-image-1 inpainting 기준) |
| 통합 | (a) 카카오 챗봇 (M4) DM 자동 응답 / (b) 사장 컨설팅 도구 (Streamlit 미니앱) |
| 정확도 목표 | 속눈썹 80%+ / 메디핑크 60%+ (참고용 명시) |
| 비용 (베타 4주, 200건 가정) | ~$30~140 |
| 자동화 비율 | 90% (셀카 → 시뮬 → 회신, 사장 개입 X) |
| 의학 risk 회피 | Disclaimer 3중 (텍스트 + 이미지 워터마크 + 사장 1탭 검수 옵션) |

---

## 1. 사용처 시나리오 (3가지)

### A. 신규 손님 챗봇 DM (메인 — 90% 사용처)

```
[손님 카톡 DM]
  └─ "어떤 컬이 나한테 어울릴까요?"
       ↓ (M4 챗봇 인지)
  └─ "셀카 한 장 보내주시면 J·C·D컬 비교 이미지 5초 안에 보내드릴게요♡"
       ↓
  └─ [손님 셀카 업로드]
       ↓ (5~10초)
  └─ [AI 시뮬 합성 카드 회신 — 4분할]:
       ┌──────────────┬──────────────┐
       │  원본 사진      │  J컬 시뮬     │
       ├──────────────┼──────────────┤
       │  C컬 시뮬      │  D컬 시뮬     │
       └──────────────┴──────────────┘
       + 디스클레이머 1줄 (이미지 하단)
       + 답변 텍스트:
         "참고용이에요. 실제는 손님 모질·뿌리 방향에 따라
          차이 있을 수 있구요, 방문 시 정확히 봐드려요♡
          마음에 드는 컬 알려주시면 예약 도와드릴게요!"
       ↓
  └─ [예약 유도 chip]:
       [J컬 예약하기] [C컬 예약하기] [D컬 예약하기] [상담 받기]
```

### B. 사장 컨설팅 도구 (방문 시 — 1일 1~3회)

```
[손님 방문 → 컨설팅 시작]
  └─ 사장 폰/태블릿에서 Streamlit 미니앱 열기 (즐겨찾기)
       ↓
  └─ "손님 셀카 한 장만 찍을게요~" (사장이 즉석에서)
       ↓
  └─ 사장이 메뉴 선택:
       □ 컬 비교 (J/C/D)
       □ 풍성도 비교 (50%/90%)
       □ 메디핑크 Before/After
       ↓
  └─ 5~10초 → 비교 이미지 4장 출력
       ↓
  └─ 사장+손님 같이 보면서 디자인 결정 (5~10분)
       ↓ vs 기존 30분 컨설팅
  └─ 사장 commit → 시술 시작
```

→ **사장 컨설팅 시간 30분 → 10분 (-67%)** + 손님 결정 confidence ↑.

### C. 메디핑크 캠페인 보조 (월 1~2회 — 한정 사용)

```
[손님 메디핑크 문의 DM]
  └─ "메디핑크 받으면 진짜 톤 회복 되나요?"
       ↓
  └─ 챗봇: "참고용으로 시뮬 가능해요. 단, 실제 결과는 부위·상태에 따라
            크게 달라요. 신뢰할 수 있는 사진은 사장님 시술 사례를
            추천드려요. 시뮬 받으시려면 부위 사진(상의 옷 위 또는 모자이크)
            보내주세요."
       ↓ (손님 OK 시)
  └─ [Before/After 시뮬 1장 회신 + 디스클레이머 강조]
       + 후기 손님 사례 사진 1~2장 (사장 동의 받은 raw — 메디핑크 캠페인 카드 3D)
       + "정확한 결과는 방문 상담 후 4회 시술 진행 시 안내드려요♡"
```

→ 메디핑크는 **시뮬 < 실제 후기 사진** 강조 (의학 risk 회피).

---

## 2. 시뮬 종류 별 명세

### 2-1. 속눈썹 컬 비교 (J/C/D) ⭐ 메인 — 80% 사용

**입력**: 손님 셀카 1장 (눈 클로즈업 또는 정면 얼굴)

**출력**: 4분할 비교 카드 (1080×1080)
- 좌상: 원본
- 우상: J컬 (자연스러운 라인)
- 좌하: C컬 (또렷한 인형 같은 눈매)
- 우하: D컬 (드라마틱 강한 컬링)

**기술적 처리**:
1. 얼굴 detection → 눈 영역만 마스킹 (CV)
2. GPT-image-1 inpainting 또는 SD ControlNet
3. 눈썹·피부·머리는 그대로, 속눈썹만 변경
4. 4장 합성 → 1장 카드 (Pillow 또는 HTML+Puppeteer)

**정확도**: 80~85% (눈썹 영역만 inpaint해서 자연스러움)

### 2-2. 풍성도 비교 (50%/90%) — 보조 (15% 사용)

**입력**: 손님 셀카 + 사장 컨설팅에서 컬 결정 후

**출력**: 2분할 카드 (1080×1080)
- 좌: 50% 풍성도 (글루 하프)
- 우: 90% 풍성도 (글루 맥스)

**용도**: 컬 결정 후 "얼마나 풍성하게 할까?" 두 번째 단계 결정용. 보통 챗봇 자동 응답 X, 사장 컨설팅 도구로만 활용.

**정확도**: 75~80%

### 2-3. 메디핑크 Before/After (참고용) ⚠️ 5% 사용

**입력**: 손님이 동의한 부위 사진 (블러·모자이크 처리 가능)

**출력**: 2분할 비교 (Before / After 시뮬)

**정확도**: 50~65% — **참고용 명시**

**제약**:
- 사용자(claude operator) 또는 사장의 명시적 승인 후에만 시뮬 (자동 X)
- 디스클레이머 워터마크 + 텍스트 3중
- "AI 시뮬과 실제는 다를 수 있습니다" 강조

→ 메디핑크는 **사장 후기 사진 노출 우선**, 시뮬은 보조.

---

## 3. 워크플로우 (전체 다이어그램)

```
┌──────────────────────────────────────────────────────────────────┐
│                M4-sim 시뮬 워크플로우                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ [손님 카톡 DM]                                                     │
│      ↓ (사진 + 키워드 "시뮬", "미리보기", "어울려" 등)                │
│ [카카오 i 오픈빌더 webhook]                                          │
│      ↓                                                             │
│ [Cloudflare Worker — M4 재사용]                                     │
│      ↓                                                             │
│ ┌──────────────── 의도 분류 ────────────────┐                        │
│  ↓                ↓                ↓        │                        │
│ [텍스트 챗봇]    [시뮬 트리거]    [Escalate]  │                        │
│  M4 (Q&A)         M4-sim          M4         │                        │
│                   ↓                                                  │
│              [이미지 download]                                        │
│                   ↓                                                  │
│              [Face/Eye detection]                                    │
│                   ↓                                                  │
│              [얼굴 영역 마스킹]                                        │
│                   ↓                                                  │
│              ┌─── 시뮬 종류 분기 ───┐                                  │
│               ↓             ↓     │                                  │
│         [컬 비교]      [메디핑크]  │                                  │
│         GPT-image-1    inpaint     │                                  │
│         x4 generation  x2 gen      │                                  │
│               ↓             ↓     │                                  │
│         [4장 합성]    [2장 합성]   │                                  │
│         Pillow        Pillow       │                                  │
│               ↓             ↓     │                                  │
│         [디스클레이머      [디스클레이머      │                            │
│          워터마크 추가]   3중 강조]  │                                  │
│               ↓             ↓     │                                  │
│              [최종 카드 1장]        │                                  │
│                   ↓                                                  │
│              [(옵션) 사장 검수 1탭 — 베타 1주차만]                       │
│                   ↓                                                  │
│              [고객 카톡 회신 + 예약 chip]                              │
│                   ↓                                                  │
│              [M10a 대시보드 로깅]                                      │
│              (시뮬 종류 / 정확도 / 예약 전환)                            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 기술 stack (3옵션 비교)

| 옵션 | 도구 | 정확도 | 속도 | 비용 | 셋업 |
|---|---|---|---|---|---|
| **A. GPT-image-1 inpainting** ⭐ 추천 | OpenAI / Anthropic | 80~85% | ~5초 | $0.04~0.17/장 | 1h |
| B. SD + ControlNet | Replicate API | 70~80% | ~10초 | $0.005/장 | 4h |
| C. SD + LoRA fine-tune (사장 사진 학습) | Replicate / 직접 | 85~95% | ~10초 | $0.005/장 + LoRA $20 | 8h |

→ **베타 4주: 옵션 A (GPT-image-1) 채택.** 셋업 빠름, 정확도 OK, 비용 OK.
→ **정기 운영 시점: 옵션 C로 업그레이드** (사장 인스타 31장 + 시술 사진으로 LoRA 학습 → 정확도 90%+).

### 4-1. 코드 스켈레톤 (Cloudflare Worker)

```typescript
// m4sim-worker.ts
import OpenAI from "openai";
import { detectFace, maskEyeRegion } from "./vision";
import { composeCard } from "./compose";

const SIMULATION_PROMPTS = {
  J_curl: `Subtle natural J-curl eyelash extensions, soft and refined,
            slightly curved upward, natural everyday look. Keep eye shape,
            eyebrows, skin tone identical. Only modify eyelashes.`,
  C_curl: `C-curl eyelash extensions, more pronounced curl creating doll-like
            wide-eyed effect. Bold and clear. Keep all other features identical.`,
  D_curl: `Dramatic D-curl eyelash extensions with strong curling, rich volume,
            event-ready look. Keep all other features identical.`,
  half: `50% volume eyelash extensions, half density, natural and subtle.`,
  max: `90% volume eyelash extensions, maximum density, dramatic and full.`,
  medipink_after: `Skin tone restoration after medical melanin care,
                    natural lighter healthier skin tone, even color distribution.
                    Keep all other features identical.`,
};

const DISCLAIMER_OVERLAY = "* AI 시뮬 — 참고용 / 실제 결과는 차이 있을 수 있어요";

export default {
  async fetch(req: Request, env: Env) {
    const { user_image_url, user_id, sim_type } = await req.json();

    // 1. 이미지 다운로드 + 얼굴 detection
    const image = await fetchImage(user_image_url);
    const face = await detectFace(image);
    if (!face) {
      return Response.json({
        error: "얼굴이 잘 안 보여요. 정면 셀카로 다시 보내주세요♡",
      });
    }

    // 2. 시뮬 종류별 분기
    const sim_variants =
      sim_type === "curl"
        ? ["J_curl", "C_curl", "D_curl"]
        : sim_type === "volume"
        ? ["half", "max"]
        : ["medipink_after"];

    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const results = await Promise.all(
      sim_variants.map((variant) =>
        openai.images.edit({
          model: "gpt-image-1",
          image,
          mask: maskEyeRegion(image, face),
          prompt: SIMULATION_PROMPTS[variant],
          size: "1024x1024",
        })
      )
    );

    // 3. 4분할 카드 합성 (원본 + 3장)
    const card = await composeCard({
      title: sim_type === "curl" ? "J·C·D컬 비교" : sim_type,
      images: [image, ...results.map((r) => r.data[0].url)],
      labels: ["원본", ...sim_variants.map(label)],
      disclaimer: DISCLAIMER_OVERLAY,
    });

    // 4. 베타 1주차 — 사장 검수 옵션 ON
    if (env.BETA_REVIEW_MODE === "ON") {
      await notifyOwnerForReview(env, user_id, card);
      return Response.json({
        message: "사장님이 확인 후 5분 안에 결과 보내드릴게요♡",
      });
    }

    // 5. 즉시 회신
    return Response.json({
      card_url: await uploadToCDN(card),
      message: `참고용이에요♡ 실제 결과는 손님 모질·뿌리 방향에 따라 차이 있을 수 있어요.
                마음에 드는 컬 알려주시면 예약 도와드릴게요! 0507-1320-6511`,
      reservation_chips: ["J컬 예약", "C컬 예약", "D컬 예약", "상담 받기"],
    });

    // 6. 로깅 (M10a 대시보드)
    await logSimulation(env, {
      user_id,
      sim_type,
      timestamp: Date.now(),
      converted_to_reservation: false, // 추후 업데이트
    });
  },
};
```

---

## 5. 디스클레이머 (의학 risk 회피 — 3중)

### 5-1. 텍스트 디스클레이머 (모든 회신에 포함)

**속눈썹 컬·풍성도**:
```
* AI 시뮬은 참고용이에요♡
  실제 결과는 손님 모질·뿌리 방향·눈매 길이에 따라 차이 있을 수 있어요.
  방문 시 사장님이 1:1로 정확히 봐드려요!
```

**메디핑크** (강조 ↑):
```
⚠️ AI 시뮬은 참고용이며 의학적 진단 X
  실제 결과는 부위·피부 상태·시술 횟수에 따라 크게 다를 수 있어요.
  정확한 효과는 방문 상담 + 1회 시술 후 안내드려요.
  사장님 시술 후기 사진을 함께 보시는 걸 권장드립니다♡
```

### 5-2. 이미지 워터마크 (이미지 우하단)

```
"AI 시뮬 — 참고용 (실제와 차이 가능)"
   Pretendard Light 12pt, 반투명 흰색
```

### 5-3. 사장 1탭 검수 옵션 (베타 1주차)

베타 1주차만:
- 모든 시뮬 결과는 사장 카톡으로 미리보기 1탭 확인
- 사장 OK → 손님에게 회신
- 사장 수정 요청 → 다시 generate

베타 2주차부터 자동 회신 (사장 검수 OFF, 단 escalation 키워드 시 사장 알림).

---

## 6. 비용·인프라

### 6-1. 베타 4주 비용

| 항목 | 베타 4주 (200건 가정) | 정기 운영 (월 ~150건) |
|---|---|---|
| GPT-image-1 (inpainting × 4장 = 1건당) | 200 × $0.16 = **$32~50** | ~$25/월 |
| Cloudflare Worker | 무료 (월 10만 req) | 무료 |
| 이미지 CDN (Cloudflare R2) | 무료 (10GB) | 무료 |
| Face detection (사용자 SDK 또는 OpenCV) | 무료 | 무료 |
| 사장 검수 알림 (텔레그램 봇) | 무료 | 무료 |
| **합계** | **~$32~50** | **~$25/월** |

→ 베타 4주: **사용자 부담 ~$50** (단일 비용). 정기 운영 시점: 월 $25 = **commission 수수료에서 흡수**.

### 6-2. 정확도 vs 비용 trade-off

| 모델 | 정확도 | 1건당 비용 | 베타 4주 총비용 |
|---|---|---|---|
| GPT-image-1 (inpaint) | 80~85% | $0.16 | ~$32 |
| Stable Diffusion (Replicate) | 70~80% | $0.02 | ~$4 |
| SD + LoRA (사장 사진 학습) | 85~95% | $0.02 + LoRA $20 일회 | ~$24 |

→ 베타: GPT-image-1 / 정기 운영 후: SD + LoRA로 이전.

---

## 7. 베타 운영 cadence

| 주차 | 사장 노동 | 자동화 | 측정 |
|---|---|---|---|
| 1주차 | 모든 시뮬 결과 사장 1탭 검수 | 검수 ON | 시뮬 정확도 (사장 OK 비율) |
| 2주차 | 자동 + 1일 1회 모니터 | 자동 ON | 시뮬 → 예약 전환율 |
| 3주차 | 결과 모니터 | 자동 | 자동 |
| 4주차 | 결과 리포트 | 자동 | 결과 |

### 7-1. 사장 컨설팅 도구 (방문 시)

| 단계 | 도구 | 사장 노동 |
|---|---|---|
| 손님 방문 | 사장 폰/태블릿에서 Streamlit 즐겨찾기 1탭 | 즉시 |
| 셀카 촬영 | 사장이 즉석에서 (5초) | 5초 |
| 시뮬 메뉴 선택 | □ 컬 / □ 풍성도 / □ 메디핑크 | 5초 |
| 결과 확인 | 사장+손님 같이 (5~10초) | 10초 |
| 디자인 결정 | 컬·풍성도·디자인 | 5분 |
| **합계** | 30분 → **10분 (-67%)** | |

---

## 8. KPI 측정

| KPI | 측정 | 베타 목표 |
|---|---|---|
| 시뮬 → 예약 전환율 | reservation_chips 클릭 → 실제 예약 | ≥ 30% |
| 시뮬 정확도 (사장 검수) | 사장 OK 비율 | ≥ 80% (베타 1주차) |
| 신규 손님 컨설팅 시간 | 방문 → 시술 시작까지 | 30분 → 10분 |
| 챗봇 시뮬 사용 빈도 | DM 시뮬 트리거 / 전체 DM | ≥ 25% (신규 손님 중) |
| 메디핑크 시뮬 클레임 건수 | 손님 "AI랑 다른데?" 컴플레인 | 0건 |
| 시뮬 응답 시간 | DM → 결과 카드 회신 | ≤ 15초 (90%+) |

---

## 9. M4·M7과 시너지

### 9-1. M4 (챗봇)와 시너지
- 텍스트 답변 후 "시뮬도 가능" 자연 유도
- 챗봇이 시뮬 트리거 자동 인식 ("어울려"·"미리보기"·"시뮬")

### 9-2. M7 (카드뉴스)와 시너지
- M7 컬 비교 카드 (2A·2B·2C·2D)에 "AI 시뮬 받기 → DM" CTA 추가
- 사장 인스타 게시 시 "AI 시뮬 무료 체험" hook 강조 → 도달 ↑

### 9-3. 마케팅 hook (DM 발송 시)
- DM 메시지에 "AI 시뮬레이션 무료 체험 가능" 1줄 추가
- 사장 입장: "1인 속눈썹샵 중 AI 시뮬 가능한 곳 = 우리뿐" unique selling point
- 동네 경쟁샵·체인 모두 미보유 → 차별화 강함

---

## 10. 사장 검수 체크리스트 (베타 D-Day 미팅 시)

- [ ] 시뮬 3종 (컬·풍성도·메디핑크) 모두 운영 OK?
- [ ] 메디핑크 시뮬 활용 의지 OK? (의학 risk 부담 vs 마케팅 가치)
- [ ] 1주차 사장 검수 모드 1탭 부담 OK? (예상 5~10건/일)
- [ ] 디스클레이머 톤 OK? (특히 메디핑크 강조 부분)
- [ ] 사장 컨설팅 도구 (Streamlit 미니앱) 방문 시 사용 의지 OK?
- [ ] 시뮬 결과 인스타·블로그 게시 OK? ("우리 손님 시뮬 사례 — 본인 동의 후")
- [ ] 사장 인스타 31장 + 시술 사진으로 LoRA fine-tune (정확도 ↑) 의지 OK? (정기 운영 시점)
- [ ] commission 협상 시 "시뮬 → 신규 예약 전환 1건당 X만" 산정 동의?

---

## 11. 외부 참조

- M4 챗봇 30Q&A: `prototypes/uareline/chatbot-30q.md`
- M7 카드뉴스 (컬 비교 시너지): `prototypes/uareline/design-cards-prompts-for-gpt.md`
- 사장 시술 사진 raw: `Day1_data_collection/인스타 게시물/`
- 사장 본인 사진 (LoRA 학습용): `sample_pictures_0505/`
- GPT-image-1 inpainting: https://platform.openai.com/docs/guides/images/edits
- Cloudflare Worker (M4 인프라): https://workers.cloudflare.com
- Replicate (SD + LoRA 학습): https://replicate.com

---

## 12. 정직한 한계 + 회피 전략

### 12-1. 한계 (현실 인정)
- **얼굴 각도 영향**: 정면 ✓ / 옆모습 ⚠️ / 눈 감은 사진 ⚠️
- **조명 영향**: 자연광 ✓ / 형광등 ⚠️ / 어두운 사진 ❌
- **메디핑크 부위 노출**: 손님 동의 + 모자이크 가능
- **모질 차이**: 짧은 속눈썹 → 시뮬 더 정확 / 긴 속눈썹 → 시뮬 정확도 ↓

### 12-2. 회피 전략
- 셀카 가이드 챗봇 메시지: "정면, 자연광, 눈 뜨고 한 장 부탁드려요♡"
- 시뮬 후 자동 검증: 정확도 < 60%이면 "정확한 미리보기 어렵습니다 — 방문 상담 권장" 응답
- 사장 시술 사례 사진을 시뮬 함께 첨부 (실제 사례로 보강)

### 12-3. 이슈 발생 시 대응
- 손님 클레임 ("AI랑 다른데?") → 사장: "참고용이라 차이 있을 수 있어요. 다시 시뮬 받으시거나 디자인 조정해드릴게요" + 무료 보정 1회
- 의학 분쟁 우려 (메디핑크) → 즉시 시뮬 OFF + 사장 직접 상담

---

## 13. 추가 작업 시간 (Day 4 전)

| 단계 | 시간 | 산출물 |
|---|---|---|
| 코드 스켈레톤 + 시스템 프롬프트 | 2h | Cloudflare Worker + 프롬프트 3종 |
| 얼굴 detection + 마스킹 로직 | 1h | OpenCV.js 또는 face-api.js |
| 4분할 카드 합성 (Pillow/HTML+Puppeteer) | 1h | 합성 함수 |
| 디스클레이머 워터마크 (3중) | 0.5h | 워터마크 자동 |
| 사장 컨설팅 도구 (Streamlit 미니앱) | 1.5h | 미니앱 1페이지 |
| 챗봇 (M4) 통합 — 시뮬 트리거 추가 | 1h | M4 worker 갱신 |
| 테스트 (사장 본인 사진으로 5건) | 1h | 정확도 측정 |
| **합계** | **~8h** | |

→ Day 4 시작 전 8h 추가 작업. Day 4 (~6h) 진행에 영향 X (별개 작업).
