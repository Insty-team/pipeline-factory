# Pipeline Factory v2 — 구체적 변경 사항

> 2026-03-29
> 원칙: 기존 코드 최대 재활용. 불필요한 것 제거. 시대에 맞게 확장.

---

## 변경 철학

```
바꾸는 것:
  1. 검증 방법: 랜딩페이지만 → 랜딩 + 봇 + MCP + API
  2. 수집 범위: 서비스 불만만 → 에이전트 갭도 수집
  3. 가설 형태: SaaS만 → 봇/에이전트/워크플로우/API 포함
  4. 홍보 채널: SNS만 → SNS + GEO + MCP 레지스트리
  5. 측정: page_view만 → 봇 사용, API 호출, 실제 수익 포함
  6. 스케줄링: Python loop → n8n

바꾸지 않는 것:
  - 수집→분석→가설→검증 4단계 구조
  - Claude CLI 기반 AI 호출 (ai.py)
  - Supabase 데이터 저장
  - 기존 collectors, analyzers, generators 코드
  - sources.json의 타겟 서비스 목록 (잘 되어있음)
```

---

## 1. 제거할 것

| 파일 | 이유 |
|------|------|
| `loop.py` | 사용 안 하고 있었음. n8n Schedule로 대체. |
| `Dockerfile` | 당분간 맥 로컬 실행. 필요 시 재생성. |
| `docker-compose.yml` (pipeline/) | 위와 동일. n8n docker-compose만 유지. |

---

## 2. 수정할 파일

### 2-1. `config/sources.json` — 에이전트 갭 수집 추가

```json
// 기존 mode_a, mode_b 유지
// 추가:
"mode_c": {
  "description": "에이전트 갭 기반 — AI가 못하는 것에서 기회 탐색",
  "sources": {
    "mcp_registry_gaps": {
      "description": "MCP 레지스트리에 없는 카테고리 분석",
      "registry_url": "https://registry.mcp.run",
      "enabled": true
    },
    "ai_limitation_queries": {
      "description": "ChatGPT/Claude가 '그런 도구는 없다'고 답하는 질문 수집",
      "subreddits": ["ChatGPT", "ClaudeAI", "LocalLLaMA"],
      "search_template": "can't do OR doesn't exist OR no tool for OR wish AI could",
      "enabled": true
    },
    "agent_workflow_gaps": {
      "description": "n8n/Make 커뮤니티에서 '이런 통합이 없다' 요청",
      "sources": ["n8n community forum", "make community"],
      "enabled": true
    }
  }
}
```

### 2-2. `generators/hypothesis.py` — 가설에 delivery_mode 추가

가설 생성 프롬프트에 추가할 필드:

```python
# 기존 가설 필드에 추가
"delivery_modes": ["web", "bot", "mcp", "api"],  # 적합한 전달 형태
"pricing_model": "usage_based | subscription | outcome_based | freemium",
"agent_friendly": true | false,  # 에이전트가 호출 가능한 형태인지
"markets": ["US", "KR"],
"bot_platform": "telegram | kakaotalk | discord | none",
```

### 2-3. `config/validation_targets.json` — H-007 v2 업데이트

```json
"H-007": {
  "title": "AI 부업 에이전트 — 투자하면 알아서 돈 벌어오는 AI",
  "version": "v2",
  "delivery": {
    "KR": {"primary": "kakaotalk_bot", "secondary": "web"},
    "US": {"primary": "telegram_bot", "secondary": "web"}
  },
  "live_url": "https://sleepnfind.pages.dev",
  "bot_url": {
    "telegram": "https://t.me/sleepnfind_bot",
    "kakaotalk": "TBD"
  },
  "metric_window_hours": 168,  // 7일 (봇은 천천히 유입)
  "success_criteria": {
    "min_bot_users": 100,
    "min_paid_conversions": 10,
    "min_actual_revenue_generated": 5,  // 5명 이상 투자금 대비 플러스
    "target_conversion_rate": 0.10
  }
}
```

### 2-4. `validators/validator.py` — 봇 메트릭 추가

```python
# 기존 fetch_rows 확장
def fetch_bot_metrics(hypothesis_id, hours):
    """봇 사용 메트릭 조회"""
    # Supabase에서 봇 이벤트 조회
    # bot_start, bot_interest_input, bot_opportunity_shown,
    # bot_execute_clicked, bot_payment, bot_revenue_generated

def summarize_combined_metrics(web_metrics, bot_metrics):
    """웹 + 봇 통합 메트릭"""
    return {
        "total_reach": web_metrics["page_views"] + bot_metrics["bot_starts"],
        "total_conversions": web_metrics["waitlist_signups"] + bot_metrics["paid_conversions"],
        "revenue_generated": bot_metrics.get("total_revenue", 0),
        "roi": bot_metrics.get("total_revenue", 0) / bot_metrics.get("total_investment", 1),
    }
```

### 2-5. `promoters/` — GEO + 에이전트 마케팅 추가

```
promoters/
  ├── channels.py          ← 기존 유지 (SNS 홍보 문구)
  ├── n8n_poster.py        ← 기존 유지 (n8n 자동 포스팅)  
  ├── researcher.py        ← 기존 유지 (채널 패턴 리서치)
  ├── post_tracker.py      ← 기존 유지
  │
  ├── geo_content.py       ← 신규: GEO 최적화 콘텐츠 생성
  │     AI가 인용할 비교 분석글, 오리지널 데이터 글 생성
  │
  └── agent_presence.py    ← 신규: AGENTS.md, schema.org 마크업 생성
        MCP 서버 설명 최적화, 구조화 데이터 생성
```

---

## 3. 신규 추가할 것

### 3-1. `builders/` 디렉토리 (핵심 신규)

```
builders/
  ├── __init__.py
  ├── landing.py        ← 기존 landing-pages/ 생성 로직 모듈화
  │     + schema.org Product 마크업 자동 삽입
  │     + GEO 메타데이터 추가
  │
  ├── bot_builder.py    ← 신규: Telegram/카카오톡 봇 템플릿 생성
  │     가설 기반으로 봇 대화 플로우 자동 생성
  │     n8n 워크플로우 JSON도 함께 생성
  │
  ├── mcp_builder.py    ← 신규: MCP 서버 스켈레톤 생성
  │     가설의 핵심 기능을 MCP tool로 노출
  │     AGENTS.md 자동 생성
  │
  └── api_builder.py    ← 신규: Cloudflare Workers API 템플릿 생성
        REST API 엔드포인트 자동 생성
```

### 3-2. `deployers/` 디렉토리

```
deployers/
  ├── __init__.py
  ├── cloudflare.py      ← 기존: wrangler pages deploy (validators에서 추출)
  ├── mcp_registry.py    ← 신규: MCP 레지스트리 등록 자동화
  └── bot_deploy.py      ← 신규: 봇 배포 (Cloudflare Workers)
```

### 3-3. `collectors/agent_needs.py` — 모드 C 수집기

```python
"""
모드 C: 에이전트 갭 수집
AI 에이전트가 못하는 것, MCP에 없는 카테고리에서 기회 탐색
"""
# Reddit r/ChatGPT, r/ClaudeAI에서 "can't do", "no tool" 검색
# MCP 레지스트리에서 카테고리별 도구 수 분석 → 빈 카테고리 = 기회
# n8n 커뮤니티에서 "integration request" 수집
```

### 3-4. n8n 워크플로우 추가

```
n8n/workflows/
  ├── bluesky_post.json            ← 기존
  ├── twitter_post.json            ← 기존
  ├── reddit_post.json             ← 기존
  ├── linkedin_post.json           ← 기존
  ├── multi_channel_post.json      ← 기존
  ├── scheduled_validation.json    ← 기존
  │
  ├── reddit_monitor.json          ← 신규: 키워드 모니터링 + AI 답변 초안
  ├── validation_loop.json         ← 신규: 30분마다 메트릭 수집 + 판단
  ├── daily_bip_post.json          ← 신규: 매일 빌드인퍼블릭 포스트 초안
  └── bot_revenue_tracker.json     ← 신규: 봇 수익 추적 + 보고
```

---

## 4. orchestrator.py 확장

```python
# 기존 CLI 유지 + 신규 추가

# 기존 (변경 없음)
python orchestrator.py                    # 전체 1사이클
python orchestrator.py --collect          # 수집만
python orchestrator.py --analyze          # 분석만
python orchestrator.py --hypothesize      # 가설 생성만
python orchestrator.py --validate --hypothesis-id H-006 --deploy

# 신규 추가
python orchestrator.py --collect --mode c             # 에이전트 갭 수집
python orchestrator.py --build --hypothesis-id H-007  # MVP 빌드 (랜딩+봇+MCP+API)
python orchestrator.py --deploy-all --hypothesis-id H-007  # 전체 배포
python orchestrator.py --metrics --hypothesis-id H-007     # 통합 메트릭
python orchestrator.py --geo-publish --hypothesis-id H-007 # GEO 콘텐츠 발행
```

---

## 5. 구현 순서 (우선순위)

### 이번 주 (즉시 가치)
1. ✅ `H-007 v2 가설` 저장 완료
2. `validation_targets.json`에 H-007 v2 반영
3. `landing-pages/h007-passive-income/index.html`에 schema.org 마크업 추가
4. `n8n/workflows/reddit_monitor.json` 생성 — Reddit 키워드 모니터링
5. n8n에서 기존 채널 OAuth 연결 (Twitter, Reddit)

### 다음 주 (에이전트 퍼널)
6. `builders/bot_builder.py` — Telegram 봇 프로토타입
7. H-007용 Telegram 봇 MVP 배포
8. Supabase에 봇 이벤트 테이블 추가
9. `builders/mcp_builder.py` — MCP 서버 스켈레톤

### 2주 후 (자동화)
10. `collectors/agent_needs.py` — 모드 C 수집기
11. `promoters/geo_content.py` — GEO 콘텐츠 자동 생성
12. `deployers/mcp_registry.py` — MCP 레지스트리 자동 등록
13. `n8n/workflows/validation_loop.json` — validate_loop.py의 n8n 이전

### 1개월 후 (결제)
14. Stripe 사용량 기반 과금 구현
15. 카카오페이 연동 (한국)
16. 에이전트 결제 테스트

---

## 6. 제거 후보 (n8n 이전 완료 후)

| 파일 | 시기 | 대체 |
|------|------|------|
| `loop.py` | 즉시 | 사용 안 함 |
| `Dockerfile` | 즉시 | 로컬 실행 |
| `docker-compose.yml` (pipeline/) | 즉시 | n8n만 Docker |
| `n8n_poster.py` | 2주 후 | n8n 내부 라우팅 |
| `post_tracker.py` | 2주 후 | n8n + Supabase |
| `validate_loop.py --loop` | 2주 후 | n8n Schedule |

---

## 현재 → 목표 상태

```
현재:
  수집(Python) → 분석(Python) → 가설(Python) 
  → 랜딩(수동) → 홍보(n8n) → 측정(Python loop)
  
  문제: 홍보에서 막힘. 트래픽 0. 랜딩만 있음.

목표:
  수집(Python, 모드A+B+C) → 분석(Python) → 가설(Python, 전달형태 포함)
  → 빌드(Python: 랜딩+봇+MCP+API) → 배포(Python+n8n)
  → 홍보(n8n: SNS+GEO+레지스트리) → 측정(n8n→Python API)
  → 자동 판단 → 다음 액션
  
  차이: 이중 퍼널(사람+에이전트), n8n이 신경계, 봇이 주 인터페이스
```
