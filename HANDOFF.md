# Pipeline Factory — 작업 인수인계 문서

> 이 문서는 새 세션에서 작업을 이어받을 때 읽는 가이드입니다.

## SSH 접속

```bash
# 데스크탑에서 맥북으로 SSH 접속
ssh -o IdentitiesOnly=yes -i ~/.ssh/id_ed25519 mac@10.50.1.121

# 프로젝트 디렉토리
cd /Users/mac/projects/pipeline-factory
```

## 프로젝트 구조

```
pipeline-factory/
├── pipeline/                    # 핵심 파이프라인 코드
│   ├── orchestrator.py          # 메인 오케스트레이터 (--init-hypothesis, --limit)
│   ├── ai.py                    # Claude CLI 래퍼 (ask, ask_json) — SSH에서 안 됨!
│   ├── config/
│   │   ├── sources.json         # 수집 대상 서비스 (US 5 + KR 5)
│   │   ├── validation_targets.json  # 활성 가설 목록 (H-006, H-007-v3, H-008)
│   │   └── content_calendar.json    # SNS 콘텐츠 일정
│   ├── collectors/              # 데이터 수집 (reference.py, reference_kr.py)
│   ├── analyzers/               # 분석 (scorer.py)
│   ├── generators/              # 가설 생성 (hypothesis.py)
│   ├── builders/                # 랜딩페이지 빌드 (landing.py) — Claude CLI 불필요
│   ├── deployers/               # Cloudflare 배포 (cloudflare.py)
│   ├── promoters/
│   │   ├── daily_content.py     # 콘텐츠 생성 + Bluesky 포스팅
│   │   ├── analytics_loop.py    # Supabase 메트릭 수집
│   │   ├── bluesky_monitor.py   # Bluesky engagement 추적
│   │   └── daily_report.py      # 일일 회고 + TODO 생성
│   ├── data/
│   │   ├── hypotheses/          # 가설 JSON 파일들
│   │   ├── daily_drafts/        # 일일 콘텐츠 드래프트
│   │   ├── daily_reports/       # 일일 리포트
│   │   ├── promotions/          # SNS 콘텐츠 + Bluesky 히스토리
│   │   └── analytics/           # 가설별 분석 리포트
│   └── .env                     # 환경변수 (Supabase, Bluesky, Cloudflare)
├── landing-pages/
│   ├── h006-scheduling/         # H-006 랜딩
│   ├── h007-passive-income/     # H-007-v3 랜딩
│   └── h008-agentdock/          # H-008 랜딩
├── dashboard-site/              # 대시보드 HTML
├── research/build-in-public/    # 조사 문서 + 세션 체크포인트
├── daily_pipeline.sh            # 매일 9시 실행
├── weekly_pipeline.sh           # 주간 파이프라인
├── weekly_pipeline_runner.sh    # 주간 재시도 래퍼
└── HANDOFF.md                   # 이 문서
```

## 환경변수 (.env)

```
SUPABASE_URL=https://hnoxlznbghhavnrsunij.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
BLUESKY_HANDLE=three...
BLUESKY_PASSWORD=Rhq...
BLUESKY_ENABLED=true
CLOUDFLARE_API_TOKEN=cfut_Q0tb...  # User API Token
```

## 세션 시작 시 반드시 읽을 파일

```bash
cat research/build-in-public/session-checkpoint.md
```

## 주요 제약사항

### Claude CLI (SSH에서 안 됨)
- `ai.py`의 `ask()`, `ask_json()` = Claude CLI subprocess 호출
- SSH 세션에는 Claude 로그인 토큰이 없어서 실패
- 영향받는 기능: orchestrator.py --init-hypothesis, daily_content.py AI 생성
- 우회: 직접 JSON 작성하거나, 맥 터미널에서 실행

### Cloudflare 배포
```bash
export NVM_DIR=~/.nvm && . "$NVM_DIR/nvm.sh" 2>/dev/null
export CLOUDFLARE_API_TOKEN=cfut_Q0tbNTOZCJYcM5F2JcJGEfvhhJU60B4uXTIEROOy8d266d33
npx wrangler pages deploy . --project-name <project> --commit-dirty=true
```

### Bluesky 포스팅
- 300 grapheme 제한 (daily_content.py에 자동 트림 있음)
- facet으로 하이퍼링크 (bare URL도 매칭됨)
- 이미지: uploadBlob → embed으로 첨부 가능

## 활성 가설

| ID | 제목 | URL | 상태 |
|---|---|---|---|
| H-006 | Calendly 대안 ($49 LTD) | calonce.pages.dev | 실제 유저 0 |
| H-007-v3 | AI Side Hustle Co-Pilot | sleepnfind.pages.dev | 실제 유저 0 |
| H-008 | Agent Board (에이전트 홍보 게시판) | agentdock-9vk.pages.dev | MVP 빌드 예정 |

## 자동화 (launchd)

| 작업 | 주기 | plist |
|---|---|---|
| auto-backup | 20분마다 | com.pipeline-factory.autobackup |
| bluesky-monitor | 1시간마다 | com.pipeline-factory.bluesky-monitor |
| daily-pipeline | 매일 9시 | com.pipeline-factory.daily-pipeline |
| weekly-pipeline | 금20/토0/토4:10 | com.pipeline-factory.weekly-pipeline |

## 대시보드

- URL: pipeline-dashboard-46g.pages.dev
- Supabase에서 실시간 데이터
- Today Content 섹션 (daily pipeline이 드래프트 저장)
- 배포: dashboard-site/ 디렉토리 → wrangler pages deploy

## 다음 작업 (H-008 MVP)

### 확정된 가설
- 문제: 에이전트가 홍보할 곳이 없다 (SNS는 사람용)
- 해결: 에이전트가 API/MCP 하나로 주인의 서비스를 홍보하는 게시판
- 검증: 빌더들이 여기에 등록하고 싶어하는가?

### MVP 요구사항 (정리 필요)
1. 에이전트 등록 (MCP/API → 토큰)
2. 홍보 포스팅
3. 에이전트 대시보드 (주인이 에이전트 활동 확인)
4. 에이전트 간 interaction 메커니즘

### 열린 질문
- 이름 확정 (AgentDock? Agent Board?)
- 에이전트 간 interaction 설계
- 기술 스택 (Supabase + Cloudflare Workers?)
- Moltbook 차별화 명확히
