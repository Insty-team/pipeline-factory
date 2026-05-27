# 07 · Session Resume (2026-05-27)

> Day 5 — Stage 1.2 ✅ · Stage 1.3 ✅ · Stage 1.5 (진단 리포트) ✅ · Commission 모델 재설계 **🟡 논의 중·미반영**
> 다음 세션 시작 시 이 파일부터 읽으면 즉시 이어서 진행 가능.

---

## 🎯 지금 상황 한 줄

**진단 리포트 commission 섹션 재설계 논의 도중 세션 종료. 사용자가 % 기반 모델 + 무료 모듈 범위 추가 논의 원함.**

---

## ✅ 이번 세션에서 한 것 (시간순)

### 1) Stage 1.2 AI 시뮬 버그 수정 + UX 보강

| 파일 | 변경 |
|---|---|
| `src/components/sim/MaskCanvas.tsx` | 캔버스 512→**1024**, `exportImagePng()` 메서드 추가, 펜 두께 size 비례 |
| `src/app/c/sim/page.tsx` | 캔버스 렌더된 1024×1024 PNG로 image+mask 둘 다 export → OpenAI 사이즈 불일치 400 에러 해결. 진행률 타이머·단계 메시지(사진 분석→AI 그리기→디테일→마무리)·프로그레스 바 추가. `framedBeforeUrl` state → Before/After 같은 frame 비교 (`object-contain`) |
| `src/lib/sim-prompts.ts` | 6종 시술 프롬프트 강화: "ONLY within masked region" 강조, 가닥수/길이/컬타입(D-curl 등) 구체화, "clearly visible vs original" 명시. 레퍼런스 사진처럼 뚜렷한 결과 |

→ 실제 OpenAI 호출 93초 성공 확인.

### 2) Stage 1.3 콘텐츠 자동 모듈 (신규 구축, 7개 파일)

| 파일 | 역할 |
|---|---|
| `src/lib/content-prompts.ts` | 유어라인 사장 톤 시스템 프롬프트 (인스타 ~합니다 / 블로그 ~세요 분리, 펌/연장 시그니처 분기, JSON 출력 스키마) |
| `src/lib/mock-posts-store.ts` | globalThis Map 기반 in-memory 게시물 저장 (HMR-safe) |
| `src/app/api/content/generate/route.ts` | OpenAI `gpt-4o-mini` 호출 (이미지+텍스트 한 번에 → JSON), `response_format: { type: "json_object" }` |
| `src/app/api/content/publish/route.ts` | 모의 게시 → `/mock/{channel}/[id]` URL 반환 |
| `src/app/o/content/page.tsx` | 풀 UX: 업로드 → 메뉴힌트 → 진행률 → 미리보기 카드 2종 → 게시 |
| `src/app/mock/instagram/[id]/page.tsx` | 인스타 스타일 모의 페이지 (워터마크 CSS overlay 우하단 `U're Line ♡`) |
| `src/app/mock/naver/[id]/page.tsx` | 네이버 블로그 스타일 모의 페이지 (동일 워터마크) |

게시 완료 시 풀폭 그라데이션 카드 링크로 변환 (`next/link` 사용 → 앱 내 라우팅).

**실제 호출 확인**: `gpt-4o-mini` 12초·publish 67~80ms 양쪽 정상.

### 3) Stage 1.5 진단 리포트 (신규)

`src/app/o/report/page.tsx` — 1파일 단일 컴포넌트. 12 섹션:
- Hero (별점·후기·인스타·블로그 4 stat)
- 1. 강점 8개 (S1~S8 카드 그리드)
- 2. 약점 8개 (W1~W8, W1·W6·W8 critical 강조)
- 3. 9 모듈 가치 + "30초/일" 배너
- 4. KPI 6개 (현재 → 베타 후 / 델타)
- 5. 매출 기여 합계 +100~230만
- 6. USP — AI 시뮬 풀그라데이션 카드
- 7. 4주 운영 타임라인
- 8. **Commission (🟡 논의 중)**
- 9. 데모 시연 가능 6 모듈
- 10. CTA 3색 (🟢🟡🔴)
- 부록 데이터 출처 (details)
- Footer 풀그라데이션 클로징

진입점 추가:
- `src/app/page.tsx` (메인) — 손님·사장 카드 아래 "💕 사장님 4주 베타 진단 리포트" 작은 링크 카드
- `src/app/o/page.tsx` (사장 dashboard) — 상단 풀폭 배너

### 4) Commission 모델 1차 인하 (반영됨)

이전 → 현재:
- AI 시뮬: 1건당 3~5만 → **1건당 1~2만**
- 챗봇: 매출 20% → **10%**
- 알림톡: 25% → **12%**
- 답글: 1건당 2~5만 → **1건당 1~2만**
- 단골 회복: 1명당 10~20만 → **1명당 5~10만**
- 메디핑크: 1건당 2만 → **1건당 1만**

+ 강조 카드 2개 추가: 핑크 "사장님 부담 0원" / 에메랄드 "베타 결과 적자면 저희는 돈을 받지 않습니다".

---

## 🟡 미해결 — Commission 모델 재설계 논의 중

**사용자 요청**: 건당 정액제 → **% 기반**으로 전환 원함. 이유: 단골회복 5만/답글 1~2만이 사장 입장에서 "체감 아까움".

**Claude 제안 (사용자 동의 안 함, 추가 논의 필요)**:

```
[베타 4주] 100% 무료. 사장님 부담 0.
[베타 후, 유입·회수된 매출 발생 시에만 % commission]

✨ AI 시뮬 → 신규 예약       발생 매출의 7% (1회만)
💬 챗봇 → 신규 예약          발생 매출의 7% (1회만)
📢 알림톡 노쇼 회수          회수 매출의 10%
💎 단골 회복 (이탈→재방문)    향후 3개월 매출의 5%
🎨 메디핑크 신규 시술        발생 매출의 7%

💌 답글 자동 / 📸 콘텐츠 자동 / 📊 대시보드 / 📅 일간 1줄
   → commission 0. 패키지 가입 자체에 포함 (free).
```

**사용자가 명확히 하고 싶다고 한 부분**: % 수치 적절성, 무료 모듈 범위, 단골회복 기간, attribution 측정 방법 등.

**현재 페이지 상태**: 1차 인하된 정액제 (1~2만 / 10% / 12% / 5~10만 등) 그대로 노출 중. % 재설계 미반영.

---

## ⏭️ 다음 세션 시작 시 첫 액션

### 1) Dev server 확인
```bash
cd /Users/mac/projects/pipeline-factory/business-pivot-2026-04-28/v4-eyelash-launch/prototypes/app
ps aux | grep "next dev" | grep -v grep   # 살아있나?
# 없으면:
npm run dev
```

### 2) Commission 모델 합의 마무리

사용자가 어떤 부분 더 명확히 하고 싶은지 물어보고 답에 따라:
- % 수치 합의 → `src/app/o/report/page.tsx`의 `COMMISSION` 배열 + 헤더 메시지 수정
- 동기화: `prototypes/modules/report/diagnosis-report-A.md` 의 §6 Commission 모델 섹션도 갱신

### 3) Commission 합의 끝나면 다음 stage 선택지

| 옵션 | 설명 |
|---|---|
| **Stage 1.4 카드뉴스** (`/o/cards`) | 가격표·컬 비교·메디핑크 16장 카드뉴스 (HTML+CSS) |
| **Stage 2.6 챗봇 in-app** (`/c/chat`) | 30Q&A 응대 (앱 안에서만, 카카오 채널 X) |
| **진단 리포트 시각 보완** | 사진/스크린샷 첨부, 사장 톤 미세조정 |
| **AI 시뮬 자동 마스크** | MediaPipe FaceLandmarker 통합 (선택, 임팩트 큰 데모 훅) |

---

## 📦 Day 5 전체 플랜 진행 상황

| Stage | 내용 | 상태 |
|---|---|---|
| 1.1 | Next.js 앱 뼈대 + 디자인 시스템 + 13 라우트 | ✅ |
| 1.2 | AI 시뮬 페이지 + GPT-image-2 inpainting | ✅ (실호출 OK, 결과 만족) |
| **1.3** | **콘텐츠 자동 페이지 + 모의 게시 (Meta/Naver 모의)** | ✅ |
| 1.4 | 카드뉴스 HTML presentation | ⏭️ |
| **1.5** | **진단 리포트 HTML+CSS 핑크 디자인** | 🟡 commission 모델 미합의 |
| 2.6 | 챗봇 in-app 실구현 | ⏭️ |
| 2.7 | 예약 실구현 | ⏭️ |
| 2.8 | 알림톡 발송 (카카오 채널 API) | ⏭️ |
| 2.9 | 답글 자동 | ⏭️ |
| 2.10 | 일간 1줄 자동 | ⏭️ |
| 3 | 데모 영상 녹화 + 데모 계정 + 영업 SOP | ⏭️ |

---

## 🗂️ 새 파일·라우트 (이번 세션)

**라우트** (브라우저 접속 가능):
- `/` — 메인 (역할 선택) + 리포트 진입 링크 추가
- `/o` — 사장 dashboard + 리포트 배너 추가
- `/o/content` — 콘텐츠 자동 (full rebuild)
- `/o/report` — 진단 리포트 (신규)
- `/mock/instagram/[id]` — 인스타 모의 (신규)
- `/mock/naver/[id]` — 네이버 모의 (신규)

**API**:
- `POST /api/sim` (이전부터 존재 — gpt-image-2)
- `POST /api/content/generate` (신규 — gpt-4o-mini)
- `POST /api/content/publish` (신규 — mock store)

**라이브러리**:
- `src/lib/content-prompts.ts` (신규)
- `src/lib/mock-posts-store.ts` (신규)
- `src/lib/sim-prompts.ts` (강화됨)

---

## 🔑 환경·주의사항

- `.env.local` 의 `OPENAI_API_KEY` 사용 중 (2026-05-26 채팅 노출됨 → rotate 권고 여전히 유효)
- `gpt-image-2` (시뮬, $0.05~0.15/호출, 93초 정도) + `gpt-4o-mini` (콘텐츠, $0.001/호출, 12초)
- `@mediapipe/tasks-vision` 설치는 됐으나 통합 안 함 (자동 마스크 검출 후속 작업)
- mock-posts-store 는 globalThis Map → dev server 재시작 시 게시물 초기화됨
- AGENTS.md: "이 Next.js는 새 버전. node_modules/next/dist/docs/ 참고하라" — 동적 라우트는 `params: Promise<{...}>` 패턴 사용 중

---

## 📚 참고 파일

- 본 파일 (resume): `07-session-resume.md`
- Day 5 전략: `06-app-strategy.md`
- 진단 리포트 원본 스펙: `prototypes/modules/report/diagnosis-report-A.md` (§6 Commission 모델 — **미동기화**)
- 사장 톤 프롬프트 v3: `prototypes/seeds/uareline-prompts.md`
- 콘텐츠 자동 모듈 스펙: `prototypes/modules/content/insta-blog-demo.md`
- 진행 로그: `03-progress-log.md`
- 체크리스트: `00-checklist.md`
