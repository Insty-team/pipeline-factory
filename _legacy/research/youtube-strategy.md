# YouTube Build-in-Public 전략 — 파이프라인 통합 설계

> 조사일: 2026-03-30
> 판정: CONDITIONAL GO

## 파이프라인 통합 설계

### 주간 YouTube 자동화 플로우

```
평일: OBS로 빌드 과정 자동 녹화 (백그라운드)
      매일 짧은 노트 자동 수집 (daily pipeline 확장)

토요일 (weekly pipeline 확장):
  1. Claude → 주간 노트+데이터 기반 스크립트 생성
  2. ElevenLabs → 보이스오버 생성
  3. Descript → 화면 녹화 자동 편집
  4. Canva AI → 썸네일 생성
  5. OpusClip → Shorts 2-3개 추출
  6. YouTube Data API → 자동 업로드

일요일:
  영상 스크립트 → LinkedIn/Threads/Medium/Bluesky 재활용
  (현재 daily_content.py 확장)
```

### 핵심 원칙: 영상이 앵커, 텍스트는 파생

현재: 텍스트 먼저 → 각 채널 별도 작성 (중복 노력)
변경: 영상 스크립트가 원본 → 모든 텍스트 채널에 재활용

### 도구 스택

| 기능 | 도구 | 월 비용 |
|------|------|---------|
| 보이스오버 | ElevenLabs Pro | $22-50 |
| 화면 녹화 | OBS (free) | $0 |
| 자동 편집 | Descript | $24-33 |
| Shorts 추출 | OpusClip | $0-20 |
| 썸네일 | Canva Pro + AI | $13 |
| 스크립트/SEO | Claude (기존) | $0 |
| 업로드 | YouTube Data API v3 | $0 |
| **합계** | | **$60-100** |

### 최적 콘텐츠 포맷

- 주 1개 영상 (5-8분) + 2-3개 Shorts
- 보이스오버 + 화면 캡처 (카메라 불필요)
- 실제 숫자 공유 (views, signups, revenue)
- 실패담 유머러스하게 각색

### GO 조건
1. 최소 6개월 / 25개 영상 커밋
2. 기존 콘텐츠 프로세스 대체 (추가 업무 아님)
3. 주당 45-60분 이하 투자
4. "파이프라인이 X개 아이디어 찾아서 테스트했다" = 컨텐츠

### 성공 사례
- Marc Lou (50K+): 빠른 SaaS 런칭, 실제 매출 공유
- Tony Dinh (30K+): 주간 MRR 업데이트
- Pieter Levels (150K+): 최소 프로덕션, 숫자 투명 공유

### 시작 순서
1. Weeks 1-2: 도구 세팅, 기존 실험 백로그 2-3개 영상
2. Week 3: 첫 영상 퍼블리시, 주간 루틴 확립
3. Month 2: Shorts 추가
4. Month 3: 프로덕션 효율 최적화
5. Month 6: 첫 ROI 평가
