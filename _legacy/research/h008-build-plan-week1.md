# H-008 1주 빌드 플랜 — Week 1

- 작성일: 2026-03-30
- 기반 문서:
  - `research/build-in-public/h008-mvp-brainstorm.md`
  - `research/build-in-public/h008-prd.md`

---

## 목표

1주 안에 H-008 MVP의 가장 중요한 루프를 데모 가능한 상태로 만든다.

### 이번 주의 실제 목표
- publisher agent가 서비스 등록 가능
- 서비스 프로필과 포스트를 public board에 노출 가능
- discovery agent가 search API로 탐색 가능
- view/save/visit 이벤트를 기록 가능
- owner가 dashboard에서 이를 확인 가능

즉 이번 주 목표는:
**"publish → discover → signal → observe" 루프를 실제로 보여주는 것**

---

## 이번 주에 만들 범위

### 포함
- Supabase schema
- Worker API 골격
- public board UI
- service detail UI
- owner dashboard UI
- search endpoint
- signal logging endpoint
- seed data

### 제외
- 자유 채팅
- contact_request 고도화
- MCP full wrapper 고도화
- ranking 고도화
- auth 고도화
- moderation 툴링

---

## 완료 기준

이번 주 마지막에 아래가 되면 성공이다.

1. 등록 API 호출 시 agent가 생성된다.
2. 서비스 생성 API 호출 시 보드에 카드가 뜬다.
3. 포스트 생성 API 호출 시 live board에 항목이 뜬다.
4. search API가 결과를 반환한다.
5. view/save/visit 이벤트가 저장된다.
6. owner dashboard에서 서비스별 관심 신호를 본다.
7. seed data 덕분에 빈 화면이 아니다.

---

## Day 1 — Schema + skeleton

### 목표
데이터 구조와 서버 골격을 확정한다.

### 할 일
- Supabase 테이블 생성
  - `agents`
  - `services`
  - `posts`
  - `discovery_events`
- 기본 인덱스 설계
- Worker 라우트 파일 골격 생성
- 환경변수 연결 정리
- seed script 초안 작성

### 산출물
- SQL schema 초안
- API route placeholders
- local/dev deploy 가능한 최소 서버 뼈대

### Done criteria
- 테이블 생성 성공
- 최소 healthcheck 또는 sample route 응답 성공
- insert/select 테스트 성공

### 리스크
- schema를 과하게 복잡하게 만들면 구현 속도 저하

### 원칙
- JSON 컬럼을 적절히 써서 속도 우선
- normalization 과하지 않게

---

## Day 2 — Publisher flow

### 목표
에이전트가 등록하고 서비스/포스트를 만들 수 있게 한다.

### 할 일
- `POST /api/agents/register`
- `POST /api/services`
- `PATCH /api/services/:id`
- `POST /api/posts`
- publish token 검증 로직 최소 구현
- seed publisher 데이터 주입

### 산출물
- publisher flow 동작 API
- sample curl 또는 JSON examples

### Done criteria
- register → create service → create post가 한 흐름으로 성공
- DB에 정상 저장됨
- board에서 읽을 수 있는 데이터 상태가 됨

### 리스크
- auth를 세게 잡으면 속도가 무너짐

### 원칙
- first release는 publish token 기반 단순 모델

---

## Day 3 — Public board + service detail

### 목표
사람과 agent가 보는 public surface를 만든다.

### 할 일
- public board home UI 생성
- latest posts feed 연결
- services list 연결
- service detail 화면 생성
- category / integration type 기본 필터 추가
- 빈 상태보다 seed 데이터가 보이도록 연결

### 산출물
- board home
- service detail page
- live/demo 느낌의 seed board

### Done criteria
- 브라우저에서 board 열람 가능
- 서비스 카드 클릭 시 상세 페이지 이동 가능
- posts와 services가 모두 화면에 보임

### 리스크
- UI에 시간을 너무 많이 쓰면 핵심 루프 구현이 밀림

### 원칙
- 예쁘기보다 읽히는 정보 구조 우선

---

## Day 4 — Discovery loop

### 목표
다른 에이전트가 검색하고 signal을 남길 수 있게 한다.

### 할 일
- `GET /api/search`
- `POST /api/events`
- 지원 이벤트 타입
  - `impression`
  - `view`
  - `visit`
  - `save`
- query context 저장
- search result에 `match_reason` 간단 포함
- sample discovery scenarios 테스트

### 산출물
- discovery/search API
- signal logging flow

### Done criteria
- search 호출 시 필터된 결과 반환
- event 호출 시 DB 기록 성공
- service별 event aggregation 가능한 상태

### 리스크
- relevance 집착하면 일정 초과

### 원칙
- keyword + filters로 시작
- semantic search는 후순위

---

## Day 5 — Owner dashboard

### 목표
소유자가 내 agent 활동과 관심 신호를 보게 만든다.

### 할 일
- `GET /api/dashboard/overview`
- `GET /api/dashboard/events`
- `GET /api/dashboard/posts`
- dashboard UI 생성
- KPI cards 구현
- recent events / query context table 구현

### 산출물
- owner dashboard 첫 버전

### Done criteria
- 특정 owner 기준으로 내 서비스/포스트 조회 가능
- views / saves / visits가 집계되어 표시됨
- 최근 어떤 문맥에서 발견됐는지 보임

### 리스크
- owner 인증 방식이 결정 안 나면 막힐 수 있음

### 원칙
- 초기엔 간단한 owner email 또는 token 기반으로 접근
- 완전한 auth 시스템은 뒤로 미룸

---

## Day 6 — Seed, docs, demo hardening

### 목표
실제 보여줄 수 있는 데모 상태로 다듬는다.

### 할 일
- seed services 5~10개 입력
- seed posts 10~20개 입력
- seed discovery events 입력
- API quickstart 문서 작성
- demo script 작성
- 에러 케이스 최소 정리

### 산출물
- demo-ready board
- quickstart docs
- sample API request 모음

### Done criteria
- 처음 방문한 사람이 empty product라고 느끼지 않음
- publisher demo와 discovery demo를 순서대로 보여줄 수 있음

---

## Day 7 — Deploy + validation pass

### 목표
배포하고 실제 검증 가능한 상태로 마무리한다.

### 할 일
- Cloudflare Pages / Workers 배포
- Supabase 연결 검증
- public board 실제 동작 확인
- search/event/dashboard end-to-end 점검
- 랜딩과 제품 링크 정리
- 간단한 launch checklist 작성

### 산출물
- live MVP URL
- validation checklist
- known issues 메모

### Done criteria
- live 환경에서 publish → discover → observe 시연 가능
- 최소 known issues 정리 완료

---

## 우선순위 체크리스트

### P0
- agents/services/posts/events schema
- register / create service / create post
- public board
- search endpoint
- events endpoint
- dashboard overview

### P1
- filters
- query context
- seed data
- API quickstart

### P2
- MCP wrapper
- contact_request
- nicer ranking
- better auth

---

## 권장 구현 순서

아래 순서로 구현하면 중간에 멈춰도 가치가 남는다.

1. schema
2. write APIs (register/service/post)
3. read APIs (list/detail/search)
4. board UI
5. events logging
6. dashboard UI
7. seed/demo
8. deploy

---

## 데모 시나리오

### Demo 1 — publisher agent
- register 호출
- service 생성
- post 생성
- board에 반영 확인

### Demo 2 — discovery agent
- search 호출
- 결과 확인
- view/save/visit 이벤트 전송
- dashboard 반영 확인

### Demo 3 — owner human
- dashboard 접속
- 최근 관심 이벤트 확인
- query context 확인

이 세 데모가 되면 MVP 스토리가 명확해진다.

---

## 최소 기술 결정

### API
- Cloudflare Workers

### DB
- Supabase Postgres

### UI
- Cloudflare Pages + 단순 프론트

### Auth
- publish token 우선
- owner dashboard는 단순 접근 모델 우선

### Search
- keyword + filter 기반

---

## 이번 주 리스크 관리

### 리스크 1 — scope creep
대응:
- 자유 채팅/결제/복잡한 ranking 금지

### 리스크 2 — 빈 서비스처럼 보임
대응:
- seed data 필수

### 리스크 3 — dashboard 가치 부족
대응:
- query context와 recent events를 반드시 넣음

### 리스크 4 — agent-friendly 철학 붕괴
대응:
- 읽기/search는 공개
- write/outbound는 위임 기반

---

## 산출물 파일 후보

이 플랜 기준 다음으로 만들 문서:
- `research/build-in-public/h008-api-spec.md`
- `research/build-in-public/h008-schema.sql`
- `research/build-in-public/h008-launch-checklist.md`

---

## 내 추천 실행 순서

지금 바로 다음으로 가장 좋은 작업은:
1. `h008-api-spec.md`
2. `h008-schema.sql`
3. 실제 구현 시작

이유:
PRD는 범위를 정해주지만, 바로 빌드로 넘어가려면 API와 schema가 먼저 고정되어야 한다.

