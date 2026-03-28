# Pipeline Factory — 자동화 파이프라인

수집 → 분석 → 가설 → 검증 루프를 자동으로 돌려서 유망 니치를 발견하고 실행한다.

## 아키텍처

```
collectors/          ← Step 1: 데이터 수집
  ├── reference.py   ← 모드 B: 기존 서비스 리뷰/불만 크롤링
  └── community.py   ← 모드 A: Reddit/HN 커뮤니티 pain point

analyzers/           ← Step 2: 분석 + 필터링
  └── scorer.py      ← 신뢰도 점수 + 카테고리화 + 차별화 기회

generators/          ← Step 3: 가설 생성
  └── hypothesis.py  ← 차별화 가설 3개 + 예상 수익 + 검증 방법

validators/          ← Step 4: 검증
  └── validator.py   ← 랜딩페이지 생성 + 배포 + 측정

data/                ← 데이터 저장
  ├── pain_points/   ← 수집된 pain point (일별)
  ├── hypotheses/    ← 생성된 가설
  ├── insights/      ← 인사이트 DB (누적)
  └── metrics/       ← 측정 결과

config/
  ├── .env.example   ← API 키 템플릿
  └── sources.json   ← 수집 소스 설정

orchestrator.py      ← 전체 루프 오케스트레이션
requirements.txt     ← Python 의존성
```

## 데이터 흐름

```
[수집] pain_points/*.json
   ↓
[분석] → 신뢰도 0.7+ 필터 → scored_points.json
   ↓
[가설] → 가설 3개 생성 → hypotheses/*.json
   ↓
[검증] → 랜딩페이지 배포 + 측정 → metrics/*.json
   ↓
[학습] → 인사이트 추출 → insights/db.json → 다음 사이클 피드백
```

## 실행

```bash
# 환경 설정
cp config/.env.example .env
pip install -r requirements.txt

# 전체 파이프라인 1사이클
python orchestrator.py

# 개별 스텝
python -m collectors.reference    # 수집만
python -m analyzers.scorer        # 분석만
python -m generators.hypothesis   # 가설 생성만
python orchestrator.py --validate --hypothesis-id H-006 --deploy
```

## 오늘 바로 돌릴 검증 루프 (1개 가설용)

현재는 `H-006`용 검증 타깃이 `config/validation_targets.json` 에 정리되어 있다.

```bash
# 1) 랜딩페이지 재배포 + 최근 24시간 데이터 분석
python orchestrator.py --validate --hypothesis-id H-006 --deploy

# 2) 1시간마다 반복 분석 (배포는 첫 1회만)
python -m validators.validator --hypothesis H-006 --loop --interval-minutes 60
```

검증 루프가 하는 일:
1. Cloudflare Pages로 랜딩페이지 배포
2. Supabase `events`, `waitlist` 테이블에서 가설별 데이터 조회
3. 전환율/스크롤/referrer를 요약해서 `data/metrics/*.json` 저장
4. 다음 액션(`promote_distribution`, `rewrite_hero`, `improve_offer_or_cta`, `double_down`) 추천

### 오늘 배포에 필요한 것
- Cloudflare Pages 프로젝트 (`calonce`)
- Supabase 프로젝트 + `events`, `waitlist` 테이블 + insert/select 정책
- `pipeline/.env` 의 `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- `wrangler` 로그인 상태

### 빠르고 저렴한 배포 권장안
- 정적 랜딩: **Cloudflare Pages** (테스트 반복에 가장 저렴)
- 이벤트 저장: **Supabase** free/pro 저가 티어
- 반복 실행: 우선 **맥북 로컬 루프/cron**, 안정화 후 GitHub Actions 또는 Cloudflare cron으로 이전
- 홍보 채널은 유료 광고보다 **Indie Hackers / Reddit / X / Product Hunt upcoming** 순으로 먼저 테스트

## 가설별 랜딩페이지 생성 가이드라인

새 가설을 검증할 때 랜딩페이지가 필요하면, 파이프라인이 자동으로 생성해야 한다.

### 디렉토리 구조
```
landing-pages/
  └── {hypothesis-id}-{slug}/    ← 예: h006-scheduling, h012-invoicing
      └── index.html             ← 단일 파일, Tailwind CDN, 인라인 JS
```

### 랜딩페이지 필수 요소
1. **인터랙티브 체험 흐름** — 바로 이메일 입력이 아니라, 유저가 먼저 가치를 체험하게 할 것
   - 예: 절약 계산기, 설정 미리보기, 결과 티저
   - 3~5단계 마법사 형태로 몰입감 부여
   - 마지막 단계에서 자연스럽게 이메일 수집
2. **Supabase 이벤트 트래킹** — page_view, scroll depth, 각 단계 완료, waitlist_signup
3. **hypothesis ID 태깅** — 모든 이벤트에 `hypothesis: 'H-XXX'` 포함
4. **referrer/source 추적** — 홍보 채널별 전환 분리 가능하게
5. **반응형 디자인** — 모바일/데스크탑 둘 다 동작

### 배포 흐름
1. `landing-pages/{id}-{slug}/` 디렉토리에 index.html 생성
2. `config/validation_targets.json`에 가설 메타데이터 추가
3. `wrangler pages deploy` 또는 validator.py --deploy로 Cloudflare Pages 배포
4. 커스텀 도메인 연결 (선택)

### 성공 기준 (기본값, 가설별 조정 가능)
- `min_pageviews`: 100
- `min_waitlist_signups`: 10
- `target_conversion_rate`: 0.10
- `strong_conversion_rate`: 0.20
- `min_scroll_50_rate`: 0.35

## 홍보 전략 파이프라인

가설 검증의 핵심은 트래픽이다. 홍보는 2단계로 실행한다.

### Step 1: 채널별 바이럴 패턴 리서치 (`promoters/researcher.py`)

홍보 문구를 쓰기 전에, **해당 채널에서 실제로 먹히는 패턴**을 먼저 조사한다.

```bash
python3 validate_loop.py --hypothesis H-006 --research-only
```

리서치가 수집하는 것:
- 채널별 바이럴 제목 공식 (pain frame, contrarian hook, specificity stack 등)
- 포스트 구조 (opening → background → product → learnings → CTA)
- 톤 가이드라인 (Reddit ≠ IH ≠ X)
- 금지 패턴 (자기홍보 탐지, 다운보트 트리거)
- 유사 제품 론칭 레퍼런스

결과 저장: `data/promotions/research/{hypothesis_id}_{channel}.json`

### Step 2: 리서치 기반 홍보 문구 생성 (`promoters/channels.py`)

```bash
python3 validate_loop.py --hypothesis H-006 --generate-promos
```

리서치 결과를 기반으로 채널별 맞춤 홍보 문구를 AI가 작성한다.

### 채널별 전략 (검증된 패턴)

| 채널 | 전략 | 핵심 원칙 |
|------|------|-----------|
| Reddit /r/SaaS | Weekly Feedback Thread + 고통 프레임 | 링크는 댓글에, 질문으로 CTA, 절대 "check out my product" 금지 |
| Reddit /r/Entrepreneur, /r/smallbusiness | **댓글 전략 우선** (포스트보다 3~5x 리드) | H.E.L.P. 프레임워크: 문제 반영 → 원인 → 해결 옵션 나열 → 제품은 옵션 중 하나로 |
| Indie Hackers | 빌더 여정 스토리 (750~1500단어) | 실패담 포함, 매출 숫자 투명 공개, 커뮤니티 질문으로 마무리 |
| X/Twitter | 7트윗 스레드 (가격 대비 훅) | 첫 문장이 80% 결정, 30분 내 모든 댓글에 응답 |

### 홍보 실행 원칙

1. **리서치 먼저, 작성은 나중** — 채널 패턴 모르고 쓰면 무시당함
2. **댓글 > 포스트** — Reddit에서는 "Calendly alternative" 검색 스레드에 댓글이 직접 포스트보다 ROI 높음
3. **UTM 태깅 필수** — `?ref=reddit_saas`, `?ref=indiehackers` 등으로 채널별 전환 추적
4. **게시 후 2시간 내 모든 댓글 응답** — 알고리즘 증폭 + 신뢰 확보
5. **포스트 타이밍** — 화~목, 오전 9~11시 EST (Reddit), 오전 7~10시 EST (X)
6. **절대 하면 안 되는 것**: "revolutionary", "game-changing" 용어, 새 계정으로 홍보, 포스트 후 잠수

### 홍보 → 데이터 수집 → 분석 루프

```
홍보 게시 (수동)
  ↓
validate_loop.py --loop (30분마다 자동)
  ↓
Supabase에서 events + waitlist 조회
  ↓
메트릭 분석 (page_view, scroll, conversion)
  ↓
자동 판단:
  - traffic 부족 → "더 홍보해" + 새 채널 제안
  - scroll 낮음 → "헤드라인/히어로 수정해"
  - conversion 낮음 → "CTA/가격/신뢰 요소 수정해"
  - conversion 높음 → "같은 메시지로 스케일업"
  ↓
data/metrics/ 에 스냅샷 저장 → 다음 사이클
```

### 파일 구조

```
promoters/
  ��── researcher.py     ← 채널별 바이럴 패턴 리서치 (AI)
  ├── channels.py       ← 리서치 기반 홍보 문구 생성 (AI)
  └── post_tracker.py   �� 어디에 뭘 올렸는지 추적

data/promotions/
  ├── research/         ← 채널별 리서치 결과 (JSON)
  ├── H-006_*.md        ← 생성된 홍보 포스트
  ├── tracker.json      ← 게시 추적
  └── archived_templates/ ← 폐기된 이전 템플릿
```

## 모드 B (레퍼런스 기반) — 초기 70% 비중

기존 서비스의 불만을 전략적으로 탐색:
1. Product Hunt / SaaS 디렉토리에서 타겟 서비스 선정
2. G2, Capterra, Reddit, App Store 리뷰 크롤링
3. AI 톤 분석으로 반복 불만 패턴 추출
4. 차별화 가설 생성 → 검증
