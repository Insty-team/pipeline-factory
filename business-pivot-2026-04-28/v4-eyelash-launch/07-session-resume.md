# 07 · Session Resume (2026-05-26)

> Day 5 진행 중 — Stage 1.2 (AI 시뮬) 1차 구현 직후 세션 종료.
> 다음 세션 시작 시 이 파일부터 읽으면 즉시 이어서 진행 가능.

---

## 🎯 지금 상황 한 줄

**`/c/sim` 페이지 + `/api/sim` route 1차 구현 완료. 첫 실제 OpenAI 호출 테스트 대기 중.**

---

## ✅ 이번 세션에서 한 것

### Bug fix (모바일에서 발견된 에러들)

1. **모바일 cross-origin block** → `prototypes/app/next.config.ts` 에 `allowedDevOrigins: ["10.50.1.120", "10.50.1.45", "localhost"]` 추가
2. **manifest.json 404** → `prototypes/app/public/manifest.json` 생성 (유어라인 PWA 메타)
3. **`asChild` prop 누수 에러** → `src/app/c/coupon/page.tsx` 의 `<Button asChild>` → `<Link className={buttonVariants(...)}>` 로 교체. base-ui `Button`은 shadcn/Radix와 달리 `asChild` 미지원 (`render` prop 패턴 사용).

### Stage 1.2 — AI 시뮬 구현

| 파일 | 역할 |
|---|---|
| `prototypes/app/.env.local` | `OPENAI_API_KEY=sk-proj-...` (⚠️ 채팅 노출됨 → rotate 필요) |
| `src/lib/sim-prompts.ts` | 시술 6종 영문 프롬프트 + 모델 라벨 |
| `src/app/api/sim/route.ts` | POST handler · multipart form (image+mask+service+model) → `client.images.edit` |
| `src/components/sim/MaskCanvas.tsx` | 손가락/마우스로 눈가 마스크 그리는 캔버스. `exportMaskPng()` 시 그린 영역만 투명으로 변환 |
| `src/app/c/sim/page.tsx` | 4-step UX (사진 선택 → 마스크 그리기 → 시술/모델 선택 → 결과 Before/After) |
| `public/demo-selfies/{1,2,3}.jpg` | 사장님 작품 사진 3장 (시술 전 자연 속눈썹 상태) |

### 의존성 추가
```bash
npm install openai @mediapipe/tasks-vision
# openai ^6.39.0, @mediapipe/tasks-vision ^0.10.35
```

`@mediapipe/tasks-vision`은 설치만 했고 **아직 통합 안 함** (자동 마스크 검출용 — 후속 작업).

### 모델 선택

| 모델 | 비용/호출 | 비고 |
|---|---|---|
| `gpt-image-2` | ~$0.05–0.15 | 최신 (2026-04 출시), 50MB까지 |
| `dall-e-2` | ~$0.018 | 구형, 정사각형 PNG <4MB |

---

## ⏭️ 다음 세션 시작 시 첫 액션

### 1) dev server 확인

```bash
cd /Users/mac/projects/pipeline-factory/business-pivot-2026-04-28/v4-eyelash-launch/prototypes/app
ps aux | grep "next dev" | grep -v grep   # 살아있나?
# 없으면:
npm run dev
```

URL:
- `http://localhost:3000`
- `http://10.50.1.120:3000` (모바일 같은 Wi-Fi)

### 2) 사용자가 첫 실제 OpenAI 호출 테스트

브라우저에서 `/c/sim` 접속 → 데모 셀카 1 탭 → 양쪽 눈에 손가락 그리기 → 글루연장 맥스 + GPT-image-2 → "시뮬 생성하기"

가능한 에러 → 대응:
- `403 organization must be verified` → https://platform.openai.com/settings/organization/general 에서 verify
- `429 rate limit` → 잠시 후 재시도
- `400 image must be square` → dall-e-2 호출 시. preset 사진 정사각형 확인 필요할 수 있음
- timeout (60s 초과) → route.ts maxDuration 늘리기 or `gpt-image-1-mini` 사용

### 3) 첫 호출 결과 따라 분기

- **결과 OK** → Stage 1.2 마무리. 다음은 **MediaPipe 자동 마스크** 통합 (선택) 또는 **Stage 1.3 콘텐츠 자동** 페이지
- **에러 발생** → 디버깅 우선

---

## 📦 Day 5 전체 플랜 (06-app-strategy.md 기반)

| Stage | 내용 | 상태 |
|---|---|---|
| 1.1 | Next.js 앱 뼈대 + 디자인 시스템 + 13 라우트 | ✅ |
| **1.2** | **AI 시뮬 페이지 + GPT-image-2 inpainting** | 🟡 1차 구현, 실호출 대기 |
| 1.3 | 콘텐츠 자동 페이지 (Meta/Naver API 게시) | ⏭️ |
| 1.4 | 카드뉴스 HTML presentation | ⏭️ |
| 1.5 | 진단 리포트 HTML+CSS 핑크 디자인 | ⏭️ |
| 2.6 | 챗봇 in-app 실구현 | ⏭️ |
| 2.7 | 예약 실구현 | ⏭️ |
| 2.8 | 알림톡 발송 (카카오 채널 API) | ⏭️ |
| 2.9 | 답글 자동 | ⏭️ |
| 2.10 | 일간 1줄 자동 | ⏭️ |
| 3 | 데모 영상 녹화 + 데모 계정 + 영업 SOP | ⏭️ |

---

## 🔑 비밀/주의사항

- **OPENAI_API_KEY는 채팅에 평문 노출됨** — 데모 끝나면 또는 가능하면 즉시 https://platform.openai.com/api-keys 에서 revoke + 새 키 발급해서 `.env.local`만 업데이트
- `.env.local`은 `.gitignore` `.env*` 패턴으로 커밋 차단됨
- 영업 데모 계정 명의는 **사용자 본인** (사장님 계정 아님)

---

## 🗂️ 파일 빠른 참조

- 앱 소스: `prototypes/app/src/`
- 데모 사진: `prototypes/app/public/demo-selfies/`
- 디자인 시스템: `prototypes/DESIGN-SYSTEM.md`
- 모듈 산출물: `prototypes/modules/{content,chatbot,m4sim,alimtok,reply,cards,loyalty,dashboard,daily,report}/`
- 진행 로그: `03-progress-log.md`
- Day 5 전략: `06-app-strategy.md`
- 본 파일 (resume): `07-session-resume.md`
