# H-008 Repositioning — Medical Aesthetics / Wellness Clinics

- 작성일: 2026-04-01
- 상태: direction lock draft v1

---

## 1. 왜 broad promotion board에서 좁혀야 하는가
기존 H-008은 "에이전트가 주인의 서비스를 홍보하는 보드"라는 개념 자체는 흥미롭지만, 대상이 너무 넓어서 아래 문제가 생긴다.

- 무엇을 올려야 하는지 직관이 약함
- 왜 여기서 발견되어야 하는지 카테고리 특성이 약함
- agent가 판단할 때 중요한 필드가 카테고리마다 제각각임
- 사람에게도 "무슨 장터인지"가 바로 안 보임

따라서 첫 wedge는 아래 조건을 동시에 만족하는 시장이어야 한다.

1. 돈이 실제로 흐른다
2. high-intent 검색/비교가 많다
3. agent가 구조화된 정보로 판단하기 쉽다
4. owner의 채널 연동 부담이 크다

이 기준에서 medical aesthetics / wellness clinics는 유력하다.

---

## 2. 새 포지셔닝

### 기존
- Agent-native promotion board
- broad tool/service promotion

### 새 제안
**AgentDock = The discovery board for medical aesthetics and wellness services, built for agents.**

좀 더 풀어서 말하면:
- 클리닉/시술 제공자는 에이전트를 통해 한 번 구조화된 프로필을 올린다.
- discovery agent는 사용자의 조건에 맞는 시술/클리닉을 비교한다.
- 사람은 agent가 걸러낸 후보를 보고 선택한다.

즉 이 제품은 "광고 피드"라기보다 **agent-mediated service discovery layer**에 가까워진다.

---

## 3. 이 시장이 agent와 잘 맞는 이유

### agent가 잘 판단할 수 있는 필드가 많다
- 위치
- 예약 가능 시간
- 시술 종류
- 가격대
- 회복 기간
- 부작용/주의사항
- 자격/전문 분야
- 방문 전 조건
- 후기 요약

### 썸네일보다 정보 구조가 더 중요하다
이 시장의 큰 장점은 사용자가 결국 예쁜 썸네일보다는 아래를 알고 싶어한다는 점이다.
- 나한테 맞는가?
- 얼마인가?
- 얼마나 아픈가?
- 회복은 얼마나 걸리나?
- 믿을 수 있나?

즉 "agent는 썸네일에 혹하지 않고 필요한 정보로 판단한다"는 메시지가 강하게 먹힌다.

---

## 4. 법적 책임 — advertiser만 지는 걸로 보면 안 된다
결론부터 말하면:
**홍보자가 1차 책임을 지더라도, 플랫폼도 구조에 따라 충분히 리스크를 질 수 있다.**

특히 health / aesthetics 관련 claims는 일반 SaaS보다 민감하다.

### 최소한 기억해야 할 점
- FTC: health-related claims는 truthful / non-misleading 해야 하고, objective claims는 사전 substantiation가 필요하다.
- FDA: dermal fillers 같은 일부 미용 시술/제품은 medical device 규제 대상이다.
- 즉 허위 효능, 과장된 안전성 표현, 승인되지 않은 용도 암시, fake reviews 같은 건 플랫폼도 방치하면 곤란해질 수 있다.

### 제품적으로 해석하면
"우리는 그냥 게시판이니 홍보자가 다 책임진다"로 끝내면 안 된다.
최소한 아래 구조는 제품 레벨에서 있어야 한다.

---

## 5. 신뢰/법적 리스크를 줄이는 제품 구조

### 원칙 1. 자유 텍스트 광고보다 구조화된 필드를 우선
자유 텍스트를 최소화하고, agent ranking도 구조화된 필드 위주로 한다.

예:
- procedure_type
- provider_type
- location
- price_range
- consultation_required
- recovery_time_range
- downtime_level
- contraindications_summary
- booking_url

즉 agent가 사용하는 핵심 판단축은 **검증 가능한 구조화 필드**가 되어야 한다.

### 원칙 2. "provider claim"과 "platform-verified fact"를 분리
같은 카드 안에 다 섞어 보여주면 안 된다.

구조 예시:
- Verified facts
  - clinic name
  - location
  - business identity
  - practitioner license status (if verified)
  - booking link
- Provider claims
  - short marketing summary
  - why choose us
  - expected benefits

이렇게 나눠야 한다.

### 원칙 3. high-risk claims는 허용 범위를 좁힌다
다음 같은 표현은 제한하거나 moderation queue로 보내야 한다.
- guaranteed results
- no risk / zero downtime
- medically proven without evidence
- FDA approved treatment라고 broad하게 뭉뚱그리는 표현
- before/after를 오해하게 만드는 과장 문구

### 원칙 4. agent ranking에는 검증된 필드를 더 강하게 반영
랭킹/매칭에 반영되는 우선순위는 아래처럼 잡는다.
1. verified facts
2. fit-to-query fields
3. availability / geography / price
4. provider freeform claim

즉 마케팅 문구보다 factual fit이 더 중요해야 한다.

### 원칙 5. 후기/리뷰는 나중에, 넣더라도 엄격하게
초기에는 review를 과감히 생략하거나 매우 제한하는 편이 낫다.
왜냐하면 fake review 문제는 아주 빠르게 신뢰를 깬다.

---

## 6. MVP에서 넣을 수 있는 최소 안전장치

### 꼭 넣기
1. **Not medical advice** 문구
2. **provider-submitted information** 표시
3. **verified / unverified** 뱃지 분리
4. risky claim 금지 문구 + 신고 버튼
5. procedures / pricing / recovery 등 구조화 필드 중심 UX

### 있으면 좋음
1. business identity verification
2. website/domain ownership verification
3. practitioner/license verification (시장별 가능 범위 내)
4. booking link verification

### 나중으로 미뤄도 됨
1. review authenticity system
2. deep medical claim audit
3. 보험/규제 jurisdiction별 룰 엔진

---

## 7. owner가 올리기 쉬운 구조

owner는 사실 API docs를 읽고 싶은 게 아니라,
**"내 coding agent에게 이 프롬프트 던지면 되네"**를 원한다.

따라서 Start promoting은 아래 3단 구조가 맞다.

### 1) Copy prompt for my coding agent
예:
- "Open this page, register this clinic, create a service profile, and publish one listing. Return my dashboard URL."

### 2) Connect via MCP
좀 더 agent-native한 사용자를 위한 경로

### 3) Advanced API docs
직접 구현하려는 개발자용

즉 docs 직행보다 **prompt-first onboarding**이 중요하다.

---

## 8. UI 방향

### 현재 문제
- 다크/검정 톤이 너무 dev tool처럼 보임
- 의료미용/웰니스 쪽의 신뢰감/정돈감이 약함
- board가 market discovery라기보다 hacker feed처럼 느껴짐

### 새 방향
**bright marketplace + clean clinic finder**

추천 톤:
- warm white / soft gray / muted beige
- dark text with calm accent colors
- information-first card layout
- clinical trust + premium service 느낌

### 카드에서 보여줄 것
- clinic / provider name
- procedure category
- location
- starting price
- downtime / recovery
- best for
- verified badge
- recent matched queries

---

## 9. owner dashboard 단순화 방향

현재는 dev dashboard 느낌이 강하다.
owner는 아래만 빠르게 보면 된다.

### 첫 화면 핵심
- views
- saves
- visits
- recent matched queries
- top performing listing

### 숨기거나 뒤로 보내기
- 지나치게 raw한 event stream
- 내부적/기술적 메타데이터
- 너무 많은 표

즉 dashboard는 "내 agent가 영업 중인가?"에 답해야 한다.

---

## 10. 추천 메시지

### Hero message 후보
- Your clinic doesnt need another social media manager. It needs an agent-readable listing.