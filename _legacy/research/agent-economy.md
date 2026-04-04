# 에이전트 이코노미 — AI가 발견하고 AI가 결제하는 시대

> 조사일: 2026-03-29
> 핵심 질문: 에이전트가 고객인 세상에서 어떻게 유입시키고 돈을 버는가?

---

## 현재 AI가 제품을 발견하는 3가지 계층

| 계층 | 작동 방식 | 성숙도 |
|------|----------|--------|
| 1. 학습 데이터 | AI 훈련 시 읽은 웹 데이터에서 기억 | 작동 중 (수동적) |
| 2. 웹 검색 | Claude→Brave, ChatGPT→Bing 실시간 검색 | 작동 중 (능동적) |
| 3. MCP 레지스트리 | 연합 디렉토리에서 도구 검색 | 초기 프리뷰 (2025.9) |
| 4. Stripe ACP | 상품 카탈로그에 에이전트가 쿼리 | 작동 중 (제한적) |
| 5. ChatGPT App Directory | @멘션으로 서드파티 앱 호출 | 작동 중 (2025.12) |
| 6. Claude Marketplace | 엔터프라이즈 큐레이션 디렉토리 | 작동 중 (기업 전용) |

### 핵심 정리
- **지금 당장**: AI는 웹 검색 + 학습 데이터로 제품을 찾음 (= 구글과 비슷)
- **진행 중**: MCP 레지스트리가 "AI용 앱스토어"로 진화 중
- **아직 아님**: 에이전트가 자동으로 MCP 서버를 브라우징하지는 않음 (사용자가 설치 필요)

---

## 에이전트 결제 — 이미 시작됐다

### Visa Intelligent Commerce (VIC)
- **상태: 수백 건 실제 거래 완료. 2026년 메인스트림 목표.**
- 작동 방식:
  1. 유저가 AI 에이전트에 카드 크레덴셜 업로드 (토큰화, 원본 노출 없음)
  2. 지출 한도/카테고리/가맹점 설정
  3. AI 에이전트가 파라미터 내에서 구매 실행
- 베타 파트너: Skyfire, Nekuda, PayOS, Ramp
- 규모: 100+ 글로벌 파트너, 30+ VIC 샌드박스 구축 중

### Stripe Agentic Commerce Suite (2025.12)
- **Shared Payment Tokens (SPT)**: 에이전트가 구매자의 저장 결제수단으로 결제. 판매자별/시간/금액 한정.
- **Product Catalog**: Stripe에 상품 데이터 연결 → AI 에이전트가 가격/재고 실시간 쿼리
- 파트너: Coach, Kate Spade, Etsy, WooCommerce, Squarespace, Wix 등
- **ChatGPT Instant Checkout이 Stripe ACP 기반으로 구축됨**

### Mastercard Agent Pay (2025.4)
- 각 AI 에이전트에 고유 ID 등록 + 검증
- 암호화 동적 크레덴셜 (Agentic Tokens)
- 파트너: Microsoft (Azure OpenAI + Copilot Studio), PayPal

### PayPal Agentic Commerce (2025.10)
- 기존 PayPal 가맹점 자동으로 에이전트 결제 수락 (추가 통합 불필요)
- ChatGPT Instant Checkout, Perplexity 가맹점 발견 기능 통합

### Skyfire — 크립토 기반 에이전트 지갑
- 각 AI 에이전트에 USDC 디지털 지갑 + 고유 ID
- KYAPay (Know Your Agent Pay) 오픈 프로토콜 (2025.6)
- 에이전트가 웹사이트에 가입, 로그인, 결제 자율 수행

---

## 실제로 일어나고 있는 에이전트 커머스 사례

| 사례 | 상태 | 상세 |
|------|------|------|
| Visa VIC 베타 거래 | **라이브** | 수백 건 B2C/B2B 실거래, 미국 파트너 |
| Air India eZ Booking | **라이브** | 텍스트/음성 대화로 항공권 예약 |
| Google 여행 예약 | **라이브** | 일정+레스토랑+항공편 예약 (2025.11) |
| Instacart via OpenAI Operator | **라이브** | 카메라로 장보기 목록 → 자동 장바구니 + 배달 |
| ChatGPT Instant Checkout | **피봇** | 2025.9 런칭 → 12개 가맹점만 참여 → 2026.3 Shopping Research로 전환 |
| Ramp via Skyfire/Visa | **라이브** | 자동 B2B 결제 + 캐시백 |

### 솔직한 현황
- **지금 작동**: 에이전트가 발견 + 추천 + 통제된 환경에서 거래
- **12-24개월 후**: 에이전트가 SaaS 구독을 자율 구매 (아직 인증 표준 미성숙)
- **아직 과장**: 완전 자율 항공편 예약 + 결제 (인프라 있지만 대중화 안됨)

---

## 에이전트 이코노미 퍼널 변화

```
2020년대 초반:
  사람이 구글 검색 → 사이트 방문 → 사람이 결제
  
2025년:
  사람이 AI에게 질문 → AI가 웹 검색으로 추천 → 사람이 결제
  
2026년 (지금):
  사람이 AI에게 지시 → AI가 MCP/ACP/웹에서 발견
  → AI가 비교 → AI가 Visa/Stripe 토큰으로 결제
  → 사람은 한도만 설정

2027년+ (예측):
  에이전트가 에이전트에게 서비스 요청
  → 에이전트가 자율 발견 + 비교 + 결제
  → 사람은 월간 예산만 승인
```

---

## 솔로 빌더를 위한 포지셔닝 전략

### 즉시 실행 (비용 $0)

1. **MCP 서버 발행 + 레지스트리 등록**
   - 공식 MCP Registry (registry.mcp.run)
   - GitHub MCP Registry
   - Kong Registry
   → "1996년에 웹사이트 만드는 것"에 해당

2. **AGENTS.md 작성**
   - 기계 친화적 제품 문서
   - AI 에이전트가 제품 사용법을 이해하는 표준 문서

3. **schema.org 구조화 데이터 / WebMCP**
   - 랜딩페이지에 제품 정보를 AI가 파싱할 수 있게 마크업

### 단기 실행 (1-3개월)

4. **Stripe ACP 엔드포인트 노출**
   - 기존 Stripe 수수료 내에서 가능
   - ChatGPT, Claude 쇼핑 에이전트가 상품 카탈로그 쿼리 가능

5. **PayPal Agent-Ready 활성화**
   - 기존 PayPal 가맹점이면 추가 통합 불필요
   - Perplexity에서 가맹점 발견 가능

6. **가격 모델: 사용량 기반**
   - 에이전트는 사람이 아님. 좌석(seat) 기반 가격 안 먹힘
   - API 호출당 과금 (Stripe, Anthropic, Twilio 모델)
   - 에이전트는 1시간에 10,000번 호출하거나 1주일 0번일 수 있음

### 중기 (3-12개월)

7. **에이전트를 고객으로 인식**
   - API 키 + 범위 지정 권한 + 지출 한도 + 기계 친화적 에러 메시지
   - Skyfire/KYAPay 생태계 대비

---

## 시장 규모

- Stripe 예측: 2030년까지 미국 온라인 지출 중 에이전트 구매 최대 **$3,850억**
- YC 최근 배치의 ~50%가 AI 에이전트 회사 (2025-2026)
- a16z "Computer Use" 리포트: Browserbase, Steel, Kernel이 실행 인프라

---

## 참고 자료

- [Visa Intelligent Commerce 발표](https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.21961.html)
- [Visa Trusted Agent Protocol](https://investor.visa.com/news/news-details/2025/Visa-Introduces-Trusted-Agent-Protocol)
- [Stripe Agentic Commerce Suite](https://stripe.com/blog/agentic-commerce-suite)
- [Mastercard Agent Pay](https://www.mastercard.com/us/en/news-and-trends/press/2025/april/mastercard-unveils-agent-pay)
- [PayPal Agentic Commerce](https://newsroom.paypal-corp.com/2025-10-28-PayPal-Launches-Agentic-Commerce-Services)
- [Skyfire KYAPay](https://www.businesswire.com/news/home/20250626772489/en/Skyfire-Launches-Open-KYAPay-Protocol)
- [MCP Registry 런칭](https://www.marktechpost.com/2025/09/09/mcp-team-launches-the-preview-version-of-the-mcp-registry)
- [GitHub MCP Registry](https://github.blog/changelog/2025-09-16-github-mcp-registry)
- [WebMCP W3C 표준](https://adaptmarketing.com/webmcp-w3c-standard/)
- [Agentic SEO](https://www.siteimprove.com/blog/agentic-seo/)
- [OpenAI Shopping 피봇](https://www.cnbc.com/2026/03/24/openai-revamps-shopping-experience-in-chatgpt)
- [에이전트 가격 모델 가이드](https://medium.com/agentman/the-complete-guide-to-ai-agent-pricing-models-in-2025)
