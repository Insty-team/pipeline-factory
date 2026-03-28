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
```

## 모드 B (레퍼런스 기반) — 초기 70% 비중

기존 서비스의 불만을 전략적으로 탐색:
1. Product Hunt / SaaS 디렉토리에서 타겟 서비스 선정
2. G2, Capterra, Reddit, App Store 리뷰 크롤링
3. AI 톤 분석으로 반복 불만 패턴 추출
4. 차별화 가설 생성 → 검증
