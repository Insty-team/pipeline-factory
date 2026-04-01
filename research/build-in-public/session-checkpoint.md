# 세션 체크포인트 — 2026-04-01

## 이번 세션에서 끝난 것

### H-008 포지셔닝 변경
기존 broad agent promotion board에서 아래로 좁힘:
- **medical aesthetics / wellness services discovery board for agents**

핵심 메시지:
- clinic owner는 구조화된 listing을 한 번 올림
- discovery agent는 procedure / location / price / downtime / recovery / verification을 비교함
- 인간은 shortlist를 보고 판단함

### 주요 UX 변경
- 랜딩을 밝은 marketplace 톤으로 변경
- Start promoting을 docs 직행에서 **prompt-first onboarding**으로 변경
- `/start` 페이지 추가
  - 영어 프롬프트
  - 한국어 프롬프트
  - copy 버튼
- owner dashboard를 단순화
  - views
  - saves
  - visits
  - impressions
  - top matched queries
  - top listing

### 신뢰/법적 가드레일 문구 반영
- not medical advice
- provider-submitted claim vs verified facts 분리 방향
- 과장 의료 claim 지양 문구 반영

### 새 데모 데이터
현재 public board에 보이는 서비스:
- Everline Skin Clinic Seoul
- Harbor Aesthetics Austin
- Atelier Wellness Gangnam

현재 데모 owner dashboard 링크는:
- `research/build-in-public/h008-demo-scenarios.md` 참고
- `.omc/state/h008-demo-output.json` 참고

### 라이브 URL
- Landing: https://agentdock-9vk.pages.dev/
- Start: https://agentdock-9vk.pages.dev/start
- Board: https://agentdock-9vk.pages.dev/board
- Docs: https://agentdock-9vk.pages.dev/docs

---

## 다음 세션에서 바로 할 것

### 우선순위 1
- listing schema를 진짜 clinic onboarding form 수준으로 다듬기
- verification_status / provider facts / risky claims flow 구체화

### 우선순위 2
- board에 category chips / saved state / compare UX 강화
- owner dashboard에 multiple agents / multiple listings 고려

### 우선순위 3
- Korean / English copy 더 자연스럽게 polish
- real clinic-like social proof 없이도 신뢰감 주는 visual 정리

### 우선순위 4
- 실제 인터뷰/리서치: 어떤 high-margin vertical이 제일 먼저 wedge로 맞는지 검증
  - medspa
  - injectables
  - skin clinics
  - wellness recovery

---

## 파일 메모
주요 변경 파일:
- `landing-pages/h008-agentdock/index.html`
- `landing-pages/h008-agentdock/start.html`
- `landing-pages/h008-agentdock/board.html`
- `landing-pages/h008-agentdock/dashboard.html`
- `landing-pages/h008-agentdock/docs.html`
- `landing-pages/h008-agentdock/providers/*`
- `landing-pages/h008-agentdock/functions/api/[[path]].js`
- `landing-pages/h008-agentdock/llms.txt`
- `landing-pages/h008-agentdock/.well-known/agentdock.json`
- `research/build-in-public/h008-seed-simulation.py`
- `research/build-in-public/h008-demo-scenarios.md`
- `research/build-in-public/h008-med-aesthetics-repositioning.md`

