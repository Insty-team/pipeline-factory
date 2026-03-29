# Pipeline Factory v2 — 에이전트 시대 파이프라인 재설계

> 작성일: 2026-03-29
> 원칙: 고객의 문제를 발굴하고, 푼다. 이 본질은 불변.
> 변하는 것: 발견 경로, 전달 방식, 결제 방식

---

## 현재 파이프라인 (v1)

```
수집 ──→ 분석 ──→ 가설 ──→ MVP ──→ 홍보 ──→ 측정
                                    │
                            랜딩페이지만 존재
                            사람만 고객
                            사람에게만 홍보
                            사람이 직접 결제
```

### v1의 병목
- 홍보 단계에서 막힘 (트래픽 14, 대부분 자체 테스트)
- 채널이 포화 (Reddit, Twitter 모두 경쟁 심함)
- 사람에게만 의존 → 24시간 중 사람이 검색하는 시간만 유효

---

## 새 파이프라인 (v2) — 이중 퍼널

```
수집 ──→ 분석 ──→ 가설 ──→ MVP 빌드
                              │
                    ┌─────────┴─────────┐
                    │                   │
              [사람 퍼널]          [에이전트 퍼널]
                    │                   │
              랜딩페이지            MCP 서버
              + schema.org         + AGENTS.md
              + GEO 콘텐츠         + Stripe ACP
                    │                   │
              SNS 홍보             레지스트리 등록
              Reddit/X/IH         MCP Registry
              빌드인퍼블릭          GitHub Registry
                    │                   │
              사람이 방문           AI가 추천/호출
              사람이 결제           에이전트가 결제
                    │                   │
                    └─────────┬─────────┘
                              │
                         통합 메트릭
                         (Supabase)
                              │
                      다음 액션 결정
```

---

## 각 단계 상세

### Step 1: 수집 (변경 없음 + 확장)

```
기존 유지:
  collectors/reference.py    — 기존 서비스 리뷰/불만 크롤링
  collectors/reference_kr.py — 한국 시장
  collectors/community.py    — Reddit/HN pain point

신규 추가:
  collectors/agent_needs.py  — AI 에이전트가 필요로 하는 도구 수집
    - MCP 서버 목록에서 "없는 카테고리" 분석
    - Claude/ChatGPT가 "이런 도구는 없다"고 답하는 질문 수집
    - 에이전트 워크플로우에서 빠진 링크 파악
    
  → 새로운 관점: "사람의 불만"뿐 아니라 "에이전트의 한계"도 니치
```

**왜?** AI 에이전트가 매일 수백만 명의 질문에 "그런 도구는 아직 없다"고 답하고 있음. 그 갭이 곧 니치.

### Step 2: 분석 (변경 없음)

```
analyzers/scorer.py — 신뢰도 점수 + 카테고리화 + 차별화 기회
  기존 로직 유지. 에이전트 니즈도 같은 스코어링 파이프라인으로 평가.
```

### Step 3: 가설 생성 (확장)

```
기존 유지:
  generators/hypothesis.py — 차별화 가설 3개 + 예상 수익

신규 필드 추가:
  각 가설에 "전달 모드" 필드:
  {
    "delivery_modes": {
      "web": true,          ← 랜딩페이지 (사람용)
      "api": true,          ← REST API (개발자용)  
      "mcp": true,          ← MCP 서버 (에이전트용)
      "bot": false          ← Telegram/Discord 봇
    },
    "pricing_model": "usage_based",  ← 에이전트 친화적 가격
    "agent_discovery_keywords": [     ← AI가 추천할 때 쓸 키워드
      "scheduling tool",
      "calendar automation",
      "meeting booking API"
    ]
  }
```

### Step 4: MVP 빌드 (핵심 변경) ⭐

```
기존: 랜딩페이지만 생성
신규: 3가지 동시 생성

builders/
  ├── landing.py        ← 기존: 랜딩페이지 (사람용)
  │     index.html + Supabase 트래킹 + Tailwind
  │     + schema.org Product 마크업 (에이전트가 파싱)
  │     + GEO 최적화 메타데이터
  │
  ├── mcp_server.py     ← 신규: MCP 서버 자동 생성 (에이전트용)
  │     - 가설의 핵심 기능을 MCP tool로 노출
  │     - AGENTS.md 자동 생성
  │     - 사용량 트래킹 (Supabase에 기록)
  │
  └── api_endpoint.py   ← 신규: 간단한 REST API (개발자/에이전트용)
        - /api/v1/{기능} 엔드포인트
        - API 키 인증
        - 사용량 기반 과금 준비

결과물 구조:
  mvp/
    └── h006-scheduling/
        ├── web/           ← 랜딩페이지
        │   └── index.html
        ├── mcp/           ← MCP 서버
        │   ├── server.py
        │   └── AGENTS.md
        ├── api/           ← REST API
        │   └── app.py
        └── config.json    ← 통합 설정
```

**핵심 아이디어:** MVP 하나 만들 때 "사람이 쓰는 버전"과 "에이전트가 쓰는 버전"을 동시에 생성. 추가 비용은 거의 0 — MCP 서버는 API 위에 얇은 래퍼일 뿐.

### Step 5: 배포 (이중 배포)

```
deployers/
  ├── cloudflare.py      ← 기존: 랜딩페이지 → Cloudflare Pages
  ├── mcp_registry.py    ← 신규: MCP 서버 → 레지스트리 등록
  │     - registry.mcp.run (공식)
  │     - GitHub MCP Registry
  │     - npm publish (TypeScript 서버인 경우)
  └── api_deploy.py      ← 신규: API → Cloudflare Workers / Railway
```

### Step 6: 홍보 (이중 홍보) ⭐

```
[사람 홍보 — 기존 확장]
  promoters/
    ├── channels.py        ← 기존: 채널별 홍보 문구 생성
    ├── n8n_poster.py      ← 기존: n8n으로 자동 포스팅
    ├── researcher.py      ← 기존: 채널별 패턴 리서치
    │
    ├── geo_content.py     ← 신규: GEO 최적화 콘텐츠 생성
    │     "2026년 스케줄링 도구 비교 분석" 같은 글
    │     → AI가 인용하는 "원본 소스"가 됨
    │     → 블로그/비교 페이지 자동 생성
    │
    └── programmatic_seo.py ← 신규: 프로그래매틱 SEO 페이지
          "[경쟁사] vs [우리]" 페이지 자동 생성
          "[업종]용 [카테고리]" 롱테일 페이지

[에이전트 홍보 — 완전 신규]
  agent_marketing/
    ├── registry_seo.py    ← MCP 레지스트리 최적화
    │     도구 설명을 에이전트가 이해하기 좋게 작성
    │     키워드, 카테고리, 사용 시나리오 최적화
    │
    ├── agents_md.py       ← AGENTS.md 품질 최적화
    │     실행 가능한 예제 우선
    │     정확한 파라미터 설명
    │     에러 처리 가이드
    │
    └── citation_builder.py ← AI 인용 촉진
          오리지널 데이터/통계 발행
          구조화된 FAQ 페이지 생성
          "answer capsule" 형식 콘텐츠
```

### Step 7: 측정 (통합 메트릭)

```
기존:
  Supabase events 테이블 — page_view, scroll, waitlist_signup

신규 이벤트 추가:
  - mcp_tool_call      ← 에이전트가 MCP 도구를 호출한 횟수
  - api_request        ← API 요청 수
  - agent_referral     ← AI 검색에서 유입된 트래픽
  - ai_citation        ← AI가 우리를 인용한 횟수 (추적 가능한 범위)

통합 대시보드:
  metrics/
    ├── human_metrics.json    ← 사람 유입 (page_view, signup, conversion)
    ├── agent_metrics.json    ← 에이전트 유입 (mcp_call, api_request)
    └── combined.json         ← 통합 (총 도달, 총 전환, 총 수익)

의사결정 로직 확장:
  기존: page_view < 100 → "더 홍보해"
  신규: (page_view + mcp_tool_call + api_request) < 100 → "더 홍보해"
        mcp_tool_call > page_view → "에이전트 채널이 더 효과적, 에이전트 퍼널 강화"
        page_view > mcp_tool_call → "사람 채널이 더 효과적, 전통 홍보 강화"
```

---

## 실행 로드맵

### Phase 1: 기존 파이프라인 강화 (이번 주)
- [ ] 랜딩페이지에 schema.org Product 마크업 추가
- [ ] GEO 최적화 블로그 포스트 1개 발행 (H-006 데이터 기반)
- [ ] 기존 n8n 채널 OAuth 연결 완료 (Twitter, Reddit)
- [ ] Reddit 카르마 빌딩 시작 (순수 활동)
- [ ] 빌드인퍼블릭 Twitter 계정 세팅

### Phase 2: 에이전트 퍼널 추가 (다음 주)
- [ ] H-006 스케줄링 도구의 MCP 서버 프로토타입
- [ ] AGENTS.md 작성
- [ ] MCP Registry 등록
- [ ] API 엔드포인트 생성 (Cloudflare Workers)
- [ ] Supabase에 에이전트 메트릭 테이블 추가

### Phase 3: 자동화 (2주 후)
- [ ] builders/mcp_server.py — 가설에서 MCP 서버 자동 생성
- [ ] deployers/mcp_registry.py — 레지스트리 자동 등록
- [ ] agent_marketing/geo_content.py — GEO 콘텐츠 자동 생성
- [ ] 새 가설마다 이중 퍼널 자동 배포

### Phase 4: 에이전트 결제 (1개월 후)
- [ ] Stripe ACP 엔드포인트 노출
- [ ] 사용량 기반 가격 모델 구현
- [ ] 에이전트 결제 테스트 (Stripe sandbox)

---

## CLI 변경안

```bash
# 기존 (유지)
python orchestrator.py                           # 전체 1사이클
python orchestrator.py --validate --hypothesis-id H-006 --deploy

# 신규 추가
python orchestrator.py --deploy-dual H-006       # 랜딩 + MCP + API 동시 배포
python orchestrator.py --agent-metrics H-006     # 에이전트 메트릭 조회
python orchestrator.py --geo-publish H-006       # GEO 콘텐츠 발행
python orchestrator.py --register-mcp H-006      # MCP 레지스트리 등록
```

---

## 비용 분석

| 항목 | 비용 | 비고 |
|------|------|------|
| Cloudflare Pages | $0 | 기존 |
| Cloudflare Workers (API) | $0 | 무료 티어 10만 요청/일 |
| MCP Registry 등록 | $0 | 무료 |
| GitHub MCP Registry | $0 | 무료 |
| Supabase | $0 | 기존 무료 티어 |
| n8n | $0 | 셀프호스팅 기존 |
| Stripe | 거래당 2.9% | 수익 발생 시만 |
| **총 추가 비용** | **$0** | 수익 나기 전까지 비용 없음 |

---

## 핵심 차별화

```
다른 인디 빌더:
  아이디어 → 코드 → 랜딩페이지 → 트위터 홍보 → 기다림

우리:
  AI 파이프라인이 니치 발굴 → MVP 자동 생성
  → 사람용 랜딩 + 에이전트용 MCP + API 동시 배포
  → 사람 채널 + 에이전트 채널 이중 홍보
  → 통합 메트릭으로 어느 퍼널이 효과적인지 자동 판단
  → 효과적인 퍼널에 자동 집중

= "사람이 자는 동안에도 에이전트가 우리 제품을 추천하고 있다"
```

---

## 리스크 & 완화

| 리스크 | 완화 |
|--------|------|
| MCP 레지스트리가 아직 초기 | 비용 0이므로 등록해두고 기다림. 웹 퍼널은 병행 |
| 에이전트 결제가 아직 베타 | Phase 4로 후순위. 사람 결제 먼저 검증 |
| GEO가 아직 불확실 | 기존 SEO와 병행. GEO 콘텐츠 = SEO 콘텐츠이기도 함 |
| 에이전트 트래픽 측정 어려움 | MCP 호출 로깅 + API 키별 추적으로 대응 |

핵심: **에이전트 퍼널은 추가 비용 0으로 병행하는 것.** 기존 사람 퍼널을 약화시키지 않으면서 새 채널을 깔아두는 전략.

---

## 부록 A: n8n을 파이프라인 핵심 오케스트레이터로 활용

### 현재 n8n 역할 (v1)
```
n8n은 "홍보 포스팅 도구"로만 사용 중:
  validate_loop.py → n8n_poster.py → n8n webhook → SNS 포스팅
```

### 신규 n8n 역할 (v2) — 파이프라인 신경계

n8n의 강점: 시각적 워크플로우, 400+ 통합, AI Agent 노드 내장, 스케줄링, 웹훅.
Python 코드에서 반복적 외부 연동을 n8n으로 빼면 코드가 핵심 로직에만 집중 가능.

```
Python (두뇌)                    n8n (신경계)
──────────────                   ──────────────
분석/스코어링 로직                스케줄링 + 트리거
가설 생성 AI 로직                외부 서비스 연동
메트릭 분석 + 의사결정           알림 + 모니터링
                                 데이터 수집 자동화
                                 홍보 자동화
```

### n8n 워크플로우 설계 (추가할 것)

#### 1. Reddit Pain Point 모니터링 (Octolens 대체, $0)
```
[Schedule: 매 1시간]
  → [HTTP] Reddit RSS/API로 키워드 검색
    ("Calendly alternative", "scheduling tool", 등)
  → [AI Agent] Claude로 관련성 점수 (0-1)
  → [IF] 점수 > 0.7
    → [AI Agent] 도움되는 답변 초안 생성
    → [Slack/Telegram] 알림:
      "🎯 관련 스레드 발견
       r/SaaS: 'Looking for Calendly alternative'
       관련성: 0.85
       초안: [답변 내용]
       링크: [스레드 URL]"
  → [Supabase] pain_point 저장
```

#### 2. GEO 콘텐츠 자동 발행
```
[Webhook: Python에서 트리거]
  → 가설 데이터 수신
  → [AI Agent] Claude로 비교 분석 글 생성
    ("[경쟁사] vs [우리]: 2026년 비교 분석")
  → [Cloudflare Pages] 블로그 페이지 배포
  → [Supabase] 콘텐츠 메타데이터 저장
```

#### 3. 에이전트 메트릭 수집
```
[Schedule: 매 30분]
  → [HTTP] MCP 레지스트리 통계 조회
  → [HTTP] API 엔드포인트 사용량 조회
  → [Supabase] 메트릭 저장
  → [IF] 이상 탐지 (급증/급감)
    → [Slack/Telegram] 알림
```

#### 4. 통합 검증 루프 (기존 validate_loop.py를 n8n으로 이전)
```
[Schedule: 매 30분]
  → [Supabase] events + waitlist 조회
  → [HTTP] Python API 서버에 분석 요청
    POST /api/validate {hypothesis_id, metrics}
  → [IF] 판단 결과에 따라:
    - "promote_distribution" → 홍보 워크플로우 트리거
    - "rewrite_hero" → Slack 알림 "랜딩 수정 필요"
    - "double_down" → 스케일업 워크플로우 트리거
  → [Supabase] 스냅샷 저장
```

#### 5. 빌드인퍼블릭 자동 콘텐츠
```
[Schedule: 매일 오전 9시 EST]
  → [Supabase] 어제 메트릭 조회
  → [AI Agent] Claude로 빌드인퍼블릭 포스트 생성
    "Day X: 전환율 21%, 트래픽 14. 
     Bluesky에 첫 자동 포스팅 성공.
     다음 목표: Reddit 카르마 빌딩"
  → [Slack] 초안 검토 알림
  → (승인 후) [HTTP] Twitter/Bluesky 포스팅
```

### Python에서 제거 가능한 것 (n8n으로 이전 후)

| 기존 Python 코드 | → n8n으로 이전 | 이유 |
|------------------|---------------|------|
| `validate_loop.py --loop` (30분 루프) | n8n Schedule 노드 | 루프/스케줄링은 n8n이 적합 |
| `n8n_poster.py` (웹훅 호출) | n8n 내부 라우팅 | n8n 안에서 처리하면 코드 불필요 |
| `post_tracker.py` (게시 추적) | n8n + Supabase | 워크플로우 실행 로그로 대체 |
| `api_server.py` (API 서버) | 유지 (Python) | 분석 로직은 Python이 적합 |
| `loop.py` (24/7 루프) | n8n Schedule | 이미 사용 안 하고 있었음 |

### 최종 역할 분담

```
Python이 하는 것 (두뇌):
  ├── collectors/ — 데이터 수집 로직 (크롤링, API)
  ├── analyzers/  — 분석 + 스코어링
  ├── generators/ — 가설 생성 (AI)
  ├── validators/ — 메트릭 분석 + 의사결정
  ├── builders/   — MVP 빌드 (랜딩 + MCP + API)
  └── api_server.py — 분석 API (n8n이 호출)

n8n이 하는 것 (신경계):
  ├── 스케줄링 — 30분마다 검증, 1시간마다 모니터링
  ├── 외부 연동 — SNS 포스팅, Supabase, Slack 알림
  ├── 모니터링 — Reddit/X 키워드 모니터링 (Octolens 대체)
  ├── 홍보 자동화 — 멀티 채널 동시 포스팅
  └── 알림 — 중요 이벤트 알림 (Slack/Telegram)
```

---

## 부록 B: 프로젝트 정리 내역 (2026-03-29)

### 삭제된 파일
- `pipeline/data/promotions/archived_templates/` (15개) — 구버전 홍보 문구. 현재 research_based + variant_B 버전으로 대체됨.
- `pipeline/.omc/`, `n8n/.omc/` — 이전 세션 상태 파일. 사용하지 않음.
- `.wrangler/cache/` — Cloudflare 캐시. 재생성됨.

### 현재 프로젝트 구조 (정리 후)

```
pipeline-factory/
├── PLAYBOOK.md              ← 전체 전략 문서
├── auto-backup.sh           ← 20분 자동 백업 (launchd)
├── .gitignore
│
├── research/                ← 리서치 문서
│   ├── competitor-analysis.md
│   ├── hypothesis-scoring.md
│   ├── micro-tool-factory.md
│   ├── reddit-pain-points.md
│   └── build-in-public/     ← 신규 리서치
│       ├── role-models.md
│       ├── ai-era-strategies.md
│       ├── agent-economy.md
│       └── pipeline-v2-design.md  ← 이 문서
│
├── landing-pages/           ← 가설별 랜딩페이지
│   ├── h006-scheduling/
│   └── h007-passive-income/
│
├── n8n/                     ← n8n 자동화
│   ├── docker-compose.yml
│   ├── README.md
│   └── workflows/           ← n8n 워크플로우 JSON
│       ├── bluesky_post.json
│       ├── twitter_post.json
│       ├── reddit_post.json
│       ├── linkedin_post.json
│       ├── multi_channel_post.json
│       └── scheduled_validation.json
│
├── pipeline/                ← Python 파이프라인 코어
│   ├── orchestrator.py      ← 전체 루프 오케스트레이션
│   ├── validate_loop.py     ← 검증 + 모니터링
│   ├── api_server.py        ← 분석 API
│   ├── ai.py                ← AI 호출 래퍼
│   ├── loop.py              ← (제거 후보: n8n으로 대체)
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   │
│   ├── collectors/          ← 수집
│   ├── analyzers/           ← 분석
│   ├── generators/          ← 가설 생성
│   ├── validators/          ← 검증
│   ├── promoters/           ← 홍보
│   │
│   ├── config/              ← 설정
│   │   ├── .env.example
│   │   ├── channel_personas.json
│   │   ├── n8n_config.json
│   │   ├── sources.json
│   │   └── validation_targets.json
│   │
│   ├── data/                ← 데이터
│   │   ├── hypotheses/
│   │   ├── metrics/
│   │   └── promotions/      ← (archived_templates 삭제됨)
│   │
│   └── tests/
│       └── test_validator.py
```
