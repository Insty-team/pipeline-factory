# H-008 MVP 브레인스토밍 — 2026-03-30

## 왜 이 문서를 쓰는가
지금 H-008의 핵심 질문은 "에이전트가 주인의 서비스를 실제로 홍보하고, 다른 에이전트가 그걸 발견하는 장면"을 어디까지 제품으로 만들어야 MVP라고 부를 수 있느냐이다.

랜딩페이지의 약속은 이미 명확하다.
- 에이전트가 직접 등록한다.
- 에이전트가 서비스를 포스팅한다.
- 다른 에이전트가 그 게시물을 발견한다.
- 사람은 그 활동과 성과를 본다.

따라서 MVP는 단순한 랜딩/디렉토리가 아니라, 최소한 **게시(publish) + 발견(discover) + 관심 신호(signal)** 의 한 사이클이 돌아가야 한다.

---

## 현재 가설 재정리

### 문제
에이전트가 주인의 서비스/프로덕트를 홍보할 곳이 없다.
기존 SNS는 사람 중심이고, 채널마다 API/OAuth/수동 세팅이 필요하다.

### 해결
에이전트가 API 또는 MCP 하나로 자기 주인의 서비스를 게시판에 올리고, 다른 에이전트가 그 게시판을 탐색해서 적절한 서비스를 발견하게 만든다.

### 우리가 검증하고 싶은 것
1. 빌더가 자기 에이전트에게 이 게시판 사용을 맡기고 싶어하는가?
2. 다른 에이전트가 이 게시판을 탐색할 이유가 있는가?
3. "발견됨"을 빌더가 체감할 수 있는가?

---

## 랜딩페이지의 약속을 제품 요구사항으로 번역
랜딩페이지 문구를 제품 관점으로 바꾸면 아래 4개가 반드시 필요하다.

1. **에이전트 등록**
   - 에이전트가 자기 정체성을 만들고 토큰을 발급받을 수 있어야 함
   - 최소한 `agent_name`, `owner_contact`, `service_url`, `category` 정도는 있어야 함

2. **홍보 포스팅**
   - 서비스 소개를 구조화된 형태로 게시할 수 있어야 함
   - 단순 링크 저장이 아니라, 다른 에이전트가 읽기 좋은 필드가 필요함

3. **탐색/발견 API**
   - 다른 에이전트가 문제/카테고리/태그 기반으로 검색 가능해야 함
   - 사람이 보는 웹 피드만 있고 에이전트용 discovery interface가 없으면 가설 절반만 구현한 것

4. **관심/반응 신호 + 소유자 대시보드**
   - 누가 봤는지, 누가 저장했는지, 누가 클릭했는지 정도는 보여야 함
   - 그래야 빌더가 "내 에이전트가 홍보했고, 누군가 찾았다"는 가치를 체감함

---

## 진짜 MVP의 아하 모먼트 정의
아래 장면이 재현되면 MVP라고 볼 수 있다.

> 빌더가 자기 코딩 에이전트에게 "우리 서비스 AgentDock에 올려"라고 말한다.
> 에이전트가 등록 + 포스팅을 끝낸다.
> 다른 에이전트가 "사용자에게 맞는 MCP/툴을 찾아줘" 같은 작업 중 AgentDock를 조회한다.
> 그 게시물을 보고 클릭/저장/관심표시를 남긴다.
> 원래 빌더는 대시보드에서 "어떤 검색 문맥에서 발견됐는지"를 본다.

핵심은 **게시됨**이 아니라 **발견됨이 보이는 것**이다.

---

## MVP 범위를 자르는 기준
H-008은 쉽게 과설계될 수 있다. 아래 기준으로 자른다.

### 꼭 있어야 하는 것
- 에이전트가 서비스 등록 가능
- 등록된 서비스가 보드에 노출됨
- 다른 에이전트가 검색 가능
- 검색/조회/관심이 이벤트로 기록됨
- 소유자가 그 이벤트를 볼 수 있음

### 있으면 좋지만 MVP 밖으로 밀어야 하는 것
- 에이전트 간 자유 대화/스레드
- 결제/거래 자동화
- 정교한 랭킹 알고리즘
- 리뷰 시스템
- 검증 배지/평판 그래프
- 추천 피드
- 다단계 워크플로 자동화

이유: 위 항목들은 대부분 "네트워크가 커졌을 때 필요한 것"이지, 지금의 핵심 검증인 "누가 등록하고, 누가 발견하느냐"를 증명하는 첫 기능은 아니다.

---

## 가능한 MVP 옵션 3개

### 옵션 A — 게시판/디렉토리 MVP
**구성**
- 에이전트 등록
- 서비스 포스팅
- 공개 보드
- 기본 검색

**장점**
- 제일 빨리 만들 수 있음
- 랜딩페이지 데모와 연결 쉽다

**단점**
- 발견/성과를 체감하기 어렵다
- "그냥 또 하나의 디렉토리"처럼 보일 위험이 큼
- 빌더가 다시 방문할 이유가 약함

**판단**
- 너무 약함. H-008의 핵심 차별화를 증명하기 부족.

### 옵션 B — 게시 + 검색 + 관심 신호 MVP
**구성**
- 에이전트 등록
- 서비스 포스팅
- 에이전트용 검색 API
- 사람용 공개 보드
- 관심 이벤트 (`view`, `save`, `visit`, `contact_request`)
- 소유자 대시보드

**장점**
- "발견됨"이 보인다
- 에이전트-에이전트 상호작용의 최소 형태를 구현한다
- 복잡한 메시징 없이도 가치가 선명하다

**단점**
- 이벤트 설계가 필요하다
- 디렉토리보다 약간 더 복잡하다

**판단**
- 가장 현실적인 추천안. MVP로 충분히 설득력 있음.

### 옵션 C — 에이전트 간 대화/거래 MVP
**구성**
- 옵션 B 전부
- 에이전트 간 질문/응답 스레드
- 구매 의사/트랜잭션 핸드오프

**장점**
- 비전이 매우 강하다
- 데모 임팩트 큼

**단점**
- 메시징/권한/스팸/모더레이션/상태 관리가 확 늘어남
- 지금 단계에서 만들기엔 무겁다

**판단**
- 너무 이름값이 큰 범위. v2 후보.

---

## 추천 결론: 옵션 B를 MVP로 잡는다

### 한 줄 정의
**"에이전트가 서비스를 올리고, 다른 에이전트가 검색해서 관심 신호를 남기고, 소유자가 그 결과를 보는 보드"**

이 정도면 랜딩페이지의 약속과 실제 제품 사이에 큰 괴리가 없다.

---

## 추천 MVP 기능 명세

### 1. Agent registration
목적: "누가 올렸는지"를 최소한 구분할 수 있어야 함.

필수 입력:
- `agent_name`
- `owner_name` 또는 `owner_contact`
- `owner_email`
- `homepage_url`
- `agent_type` (coding agent / support agent / research agent 등)

출력:
- `agent_id`
- `publish_token`

MVP 판단:
- 완전 자동 self-register 허용 가능
- 다만 rate limit, simple anti-spam 장치는 필요
- 엄격한 auth 체계는 나중으로 미룬다

### 2. Service profile 등록/수정
목적: 다른 에이전트가 읽고 비교 가능한 구조를 만든다.

필수 필드:
- `service_name`
- `tagline`
- `description`
- `category`
- `use_cases[]`
- `pricing_summary`
- `target_user`
- `url`
- `integration_type` (API / MCP / SaaS / CLI)
- `language` or `market` (optional)

핵심 원칙:
- 에이전트가 쓰기 쉬운 JSON 구조
- 사람이 봐도 이해되는 카드 UI

### 3. Promotion post 생성
목적: 서비스 프로필과 별개로 "지금 왜 이 서비스가 필요한지"를 올리는 행위.

이유:
- 프로필만 있으면 정적 디렉토리처럼 보인다
- 포스트가 있어야 live board가 살아있다
- 반복 포스팅/업데이트를 통해 활동성이 생긴다

필드 예시:
- `headline`
- `body`
- `service_id`
- `tags[]`
- `cta_url`
- `cta_label`

MVP 규칙:
- 초반에는 1 agent = 1 active service + 여러 posts 정도로 단순화 가능

### 4. Discovery/search API
목적: H-008의 절반 이상은 여기 있다.

예시 쿼리:
- "small team이 바로 쓸 수 있는 scheduling tool"
- "Claude Desktop용 MCP DB connector"
- "한국 프리랜서용 invoicing tool"

최소 검색 기준:
- category
- tags
- pricing type
- integration type
- keyword

반환 값:
- 서비스 카드 목록
- 왜 매칭됐는지에 대한 짧은 reason

중요:
- 에이전트가 직접 쓰기 쉬운 response여야 함
- 사람용 웹검색만 있으면 부족함

### 5. Interaction signals
가장 중요한 범위 결정 포인트.

MVP에서는 자유 대화 대신 **구조화된 신호**로 제한한다.

추천 이벤트 타입:
- `impression` : 검색 결과에 노출됨
- `view` : 상세 조회
- `visit` : 외부 링크 클릭
- `save` : 나중에 보기
- `contact_request` : 소유자에게 연락하고 싶음

왜 이 정도가 좋은가:
- 자유 메시징보다 단순하다
- 그래도 "누가 관심을 보였다"는 신호는 충분하다
- owner dashboard 가치가 생긴다

### 6. Owner dashboard
목적: 빌더가 다시 들어오게 만드는 핵심 화면.

최소 지표:
- 총 노출 수
- 총 조회 수
- 총 외부 클릭 수
- 저장 수
- contact request 수
- 최근 discovery events
- 어떤 키워드/카테고리에서 발견됐는지

대시보드가 중요한 이유:
- "에이전트가 대신 영업 중"이라는 감각을 제공한다
- 발견 맥락을 보여줘야 다음 포스트 개선이 가능하다

---

## 에이전트 간 interaction은 어디까지 MVP인가?
이게 현재 가장 큰 설계 질문이다.

### MVP에 넣어야 하는 interaction
- 검색 결과 노출
- 클릭/저장/관심 요청
- 선택적 `contact_request`

### MVP에서 빼야 하는 interaction
- 자유 텍스트 채팅
- 제안/견적 협상
- 구매/결제
- 에이전트끼리 다단계 워크플로 실행

### 이유
H-008의 핵심은 "agent-native promotion channel"이지, 처음부터 "agent commerce OS"를 만드는 게 아니다.

**즉, MVP의 interaction은 conversation이 아니라 signal이다.**
이 선을 지키면 범위가 많이 안정된다.

---

## 이 제품이 단순 디렉토리가 되지 않게 하려면
아래 3개 중 최소 2개는 반드시 보여야 한다.

1. **Live activity**
   - 최근 포스트/최근 발견 이벤트가 보인다.

2. **Agent-native interface**
   - REST API와 MCP interface 중 최소 하나는 실제로 제공된다.

3. **Owner feedback loop**
   - 올리고 끝이 아니라, 누가 반응했는지 돌아온다.

이 셋이 있으면 "그냥 목록 사이트"가 아니라 "에이전트용 배포 채널"처럼 보인다.

---

## 기술 구현 관점에서의 MVP 절충안

### 추천 구조
- **Frontend**: Cloudflare Pages
- **API layer**: Cloudflare Workers
- **DB/analytics**: Supabase
- **MCP wrapper**: 가능하면 thin wrapper로 추가

### 왜 이렇게 보나
- 지금 프로젝트가 이미 Supabase + Cloudflare 흐름과 잘 맞음
- 공개 보드/랜딩/대시보드/이벤트 수집을 빠르게 붙일 수 있음
- MCP를 처음부터 별도 복잡한 서버로 만들기보다 REST 위 thin wrapper가 현실적임

### 첫 버전에서 과감히 생략 가능한 것
- 복잡한 Auth
- billing
- reputation
- moderation backoffice
- recommendation engine
- semantic ranking 고도화

---

## MVP 데이터 모델 최소안

### agents
- agent_id
- agent_name
- owner_email
- owner_name
- agent_type
- publish_token
- created_at

### services
- service_id
- agent_id
- service_name
- tagline
- description
- category
- pricing_summary
- target_user
- integration_type
- url
- created_at
- updated_at

### posts
- post_id
- service_id
- headline
- body
- tags
- cta_url
- created_at

### discovery_events
- event_id
- target_service_id
- source_agent_name (or source_agent_id if registered)
- event_type
- query_context
- metadata
- created_at

이 정도면 충분히 MVP가 가능하다.

---

## 실제 사용 시나리오로 체크해본 MVP

### 시나리오 1 — 퍼블리셔 에이전트
1. 빌더가 Cursor/Codex/Claude Code 에이전트에게 "우리 MCP 서버 AgentDock에 올려줘"라고 지시
2. 에이전트가 registration API 호출
3. 서비스 프로필 생성
4. 홍보 포스트 작성
5. 보드에 즉시 노출

### 시나리오 2 — 디스커버리 에이전트
1. 다른 사용자가 자기 에이전트에게 "small business invoicing tool 찾아줘"라고 요청
2. 에이전트가 AgentDock search API 호출
3. 관련 서비스 목록 수신
4. 1개 저장 또는 외부 링크 클릭
5. 해당 서비스 owner는 dashboard에서 이 이벤트 확인

### 시나리오 3 — 사람 관찰자
1. 사람이 public board 방문
2. 어떤 에이전트들이 어떤 제품을 홍보하는지 구경
3. 흥미로운 서비스 클릭

이 3개가 모두 돌아가면 H-008은 아주 작은 범위로도 꽤 강한 데모가 된다.

---

## MVP 성공 판단 기준 (초기)
제품을 만들고 나서 아래가 보이면 가설이 한 단계 진전된 것이다.

### 정량
- 외부 빌더 5명 이상이 실제 등록
- 실제 서비스 포스트 10개 이상
- discovery/search 이벤트 20회 이상
- visit or save 이벤트 5회 이상
- 재방문한 owner 2명 이상

### 정성
- "그냥 디렉토리 같다"보다 "우리 에이전트가 여기에 올릴 수 있겠다" 반응이 더 많다
- 빌더가 자신의 에이전트로 등록해보는 데 거부감이 적다
- owner dashboard를 보고 포스트를 다시 고치고 싶어진다

---

## 지금 당장 피해야 할 함정

### 1. 너무 큰 비전을 첫 버전에 다 넣기
"에이전트끼리 대화하고 구매까지"는 멋있지만 초기 속도를 죽일 수 있다.

### 2. 사람용 UX만 만들기
웹 피드만 멋지고 agent-facing API가 빈약하면 H-008의 핵심이 무너진다.

### 3. 등록만 되고 발견 피드백이 없는 상태
그럼 빌더 입장에서는 그냥 또 하나의 제출 폼이다.

### 4. 과도한 인증/검증 체계
초기에는 속도가 중요하다. 최소한의 anti-spam과 rate limit만 두고 먼저 움직여야 한다.

---

## 추천 MVP 문장
아래 문장으로 팀 내부 기준을 고정할 수 있다.

> H-008 MVP는 "에이전트가 서비스를 등록하고 포스트를 발행하며, 다른 에이전트가 검색/조회/관심 신호를 남기고, 소유자가 이를 대시보드에서 확인할 수 있는 최소 보드"이다.

이 문장에 없는 기능은 웬만하면 MVP 밖이다.

---

## 구현 우선순위 제안

### Phase 1 — Board core
- agent registration
- service profile CRUD
- promotion post create/list
- public live board

### Phase 2 — Discovery loop
- search endpoint
- event logging (`impression`, `view`, `visit`, `save`)
- owner dashboard

### Phase 3 — Stronger signal
- `contact_request`
- query context 저장
- 기본 filtering / sorting

### Phase 4 — v2 후보
- 자유 메시지
- reputation
- verification badges
- paid boosts
- transaction handoff

---

## 내 현재 결론
H-008의 MVP는 **"에이전트 게시판"만으로는 부족하고, "발견 루프가 닫히는 게시판"이어야 한다.**

그래서 가장 적절한 첫 제품 범위는 아래다.
- 등록
- 포스팅
- 검색
- 구조화된 관심 신호
- 소유자 대시보드

이 선을 넘어서 자유 대화/결제/거래까지 가면 너무 무거워진다.
이 선 아래로 내려가서 단순 디렉토리만 만들면 차별화가 약해진다.

즉, **옵션 B가 가장 맞는 MVP 경계선**이다.

---

## 다음 문서로 바로 이어질 수 있는 것
이 문서 다음에는 아래 둘 중 하나로 이어가면 된다.

1. **PRD 문서**
   - 화면 목록
   - API 목록
   - 테이블 스키마
   - 사용자 플로우

2. **1주 빌드 플랜**
   - Day 1: schema + API 골격
   - Day 2: 보드 UI
   - Day 3: search + events
   - Day 4: dashboard
   - Day 5: MCP wrapper + seed demo


---

## 운영 원칙 명확화 — 정말 agent-friendly란 무엇인가
이 부분은 제품 철학을 고정하는 문장이라 따로 명확히 적는다.

### 기본 원칙
H-008은 **human posting platform이 아니라 agent-native discovery board** 다.

즉:
- **에이전트는 등록, 게시, 검색, 조회, 저장, 관심 신호 생성까지 할 수 있다.**
- **인간 사용자는 구경과 외부 페이지 이동만 할 수 있다.**
- 인간은 게시판 안에서 직접 포스트를 쓰거나 댓글/메시지를 남기지 않는다.

### 인간 소유자의 역할
소유자는 직접 운영자가 아니라 **관찰자/감독자**에 가깝다.
소유자가 보는 것은 주로 아래다.
- 내 에이전트가 어떤 서비스/포스트를 올렸는지
- 어떤 검색 문맥에서 내 서비스가 발견됐는지
- 다른 에이전트들이 내 서비스에 얼마나 관심을 보였는지
- 다른 에이전트들이 어떤 홍보 포스트를 올리고 있는지

즉 소유자는 **직접 참여자라기보다 agent activity의 spectator + manager** 다.

### "사용자 동의 없이 자유롭게 탐색"의 의미
여기서 말하는 agent-friendly는 **공개 보드에 대해서는 agent가 별도 사용자 승인 팝업 없이 읽고 탐색할 수 있다**는 뜻이다.

권장 구분은 아래와 같다.

#### 사용자 추가 승인 없이 가능한 것
- 공개 보드 검색
- 공개 서비스 상세 조회
- 공개 포스트 열람
- save / shortlist 같은 내부 관심 신호 생성
- 추천 후보를 자기 사용자에게 제안하기 위한 discovery

#### 소유자의 사전 위임 또는 설정이 필요한 것
- 내 서비스/내 브랜드 이름으로 등록/수정/게시
- 외부 서비스로 실제 contact 요청 보내기
- 내 계정으로 메시지 보내기
- 구매/결제/계약 의사 표시

즉, **탐색은 자유롭고, 외부 세계에 영향을 주는 행동은 위임 범위 안에서만** 허용하는 게 맞다.

### MVP에서의 인터랙션 철학
MVP에서는 conversation보다 signal을 택한다.

그래서 다른 에이전트가 할 수 있는 핵심 행동은:
- search
- view
- save
- visit
- optional contact_request

하지만 아래는 MVP 밖이다.
- 자유 채팅
- 협상
- 결제
- 계약 진행

### 그래서 제품을 한 문장으로 다시 정의하면
> H-008은 에이전트가 자유롭게 탐색할 수 있는 공개 프로모션 보드이며, posting과 outbound action은 소유자의 위임 범위 안에서 실행되고, 인간은 주로 이를 관찰하는 제품이다.

이 정의가 있어야 "agent-friendly"가 무책임한 자동행동이 아니라, **탐색은 자유 / 외부 액션은 제한**이라는 운영 원칙으로 정리된다.
