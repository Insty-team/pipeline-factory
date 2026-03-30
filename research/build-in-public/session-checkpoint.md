# 세션 체크포인트 — 2026-03-30 14:20

## 이번 세션에서 끝난 것

### H-008 MVP 실제 구현/배포 완료
라이브 URL:
- Landing: https://agentdock-9vk.pages.dev/
- Public board: https://agentdock-9vk.pages.dev/board
- API docs: https://agentdock-9vk.pages.dev/docs

구현된 것:
- 에이전트 등록 API
- 서비스 프로필 생성 API
- 홍보 포스트 생성 API
- 검색 API
- discovery signal 기록 API
- owner dashboard API
- public board UI
- owner dashboard UI
- API quickstart 문서

기술 방식:
- Cloudflare Pages Functions
- 기존 Supabase `events` 테이블을 event store처럼 사용
- hypothesis 값은 `H-008-MVP`

### H-008 브레인스토밍 / PRD / 빌드 플랜 문서화 완료
문서:
- `research/build-in-public/h008-mvp-brainstorm.md`
- `research/build-in-public/h008-prd.md`
- `research/build-in-public/h008-build-plan-week1.md`
- `research/build-in-public/h008-demo-scenarios.md`
- `research/build-in-public/h008-seed-simulation.py`

### 데모 시드 데이터 입력 완료
현재 상태:
- publisher agents 3개
- discovery agents 3개
- services 3개
- posts 6개
- discovery signals 9개

서비스:
- CalOnce
- SleepNFind
- DataPipe MCP

시뮬레이션 결과는 여기 저장됨:
- `.omc/state/h008-demo-output.json`

이 파일에는 agent_id / publish_token / owner dashboard URL이 들어 있음.

---

## 사람이 바로 확인할 것

### 1. 외부 구경꾼으로 보기
- `https://agentdock-9vk.pages.dev/board`
- 서비스 카드 3개가 보여야 함
- 최근 포스트 6개가 보여야 함

### 2. owner로 보기
- owner dashboard URL은 `.omc/state/h008-demo-output.json` 참고
- 또는 이 세션 채팅에서 전달된 dashboard URL 사용
- dashboard에서 signal count가 보여야 함

---

## 다음 세션에서 바로 할 것

### 우선순위 1 — 제품 품질 정리
- board UI polish
- service detail UX 다듬기
- dashboard UX 다듬기
- API docs 명확화

### 우선순위 2 — 권한/모델 정리
- owner dashboard access 모델 결정
- publish token rotation 필요 여부
- 사람 browse-only 정책 명문화

### 우선순위 3 — 실제 검증
- 실제 외부 builder 1~3명에게 API docs 보내기
- 자기 agent로 등록하게 해보기
- 실제 discovery/usefulness 피드백 받기

### 우선순위 4 — 필요하면 추가
- `contact_request` 시나리오 실제 테스트
- MCP wrapper 추가
- seed/demo 확장

---

## 중요한 메모

- 이 MVP는 **conversation이 아니라 signal까지** 구현한 버전임
- 인간은 browse-only, agent가 publish/discover/signal 수행
- 외부 환경에서 일부 스크립트 요청은 403이 날 수 있으나, 브라우저와 mac에서 curl(User-Agent 포함)로는 정상 확인됨
- D1은 Cloudflare 토큰 권한 부족으로 사용하지 않았고, 대신 Supabase events를 재사용함

