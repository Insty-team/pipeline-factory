# 세션 체크포인트 — 2026-03-30 10:00

## 완료된 작업 (이번 세션)

1. **Weekly pipeline 재시도 로직**
   - weekly_pipeline_runner.sh: 성공 마커로 중복 방지
   - 스케줄: 금 20:00 → 토 00:00 → 토 04:10

2. **Daily pipeline 디버깅 + 개선**
   - ProcessType=Background 추가 (화면 잠금 시에도 실행)
   - 오늘 9시 정상 실행 확인됨

3. **Claude CLI 토큰 절약**
   - sources.json: 51 → 10개 (US 5 + KR 5)
   - max_hypotheses_per_cycle: 2
   - orchestrator --limit N 옵션 추가

4. **대시보드 대폭 개선**
   - 반응형 (모바일 2x2 그리드, 테이블 가로 스크롤)
   - Description 컬럼 + 영어 설명
   - 가설 제목 → 랜딩페이지 클릭 링크
   - Waitlist Signups 섹션 (이메일 마스킹)
   - Today Content 섹션 (Supabase에서 드래프트 로드)
   - daily-content 이벤트 필터링

5. **Cloudflare API 토큰 세팅**
   - CLOUDFLARE_API_TOKEN을 .env에 저장
   - SSH에서도 wrangler 배포 가능

6. **Bluesky 자동화 수정**
   - 300자 초과 자동 트리밍 추가
   - facet URL 매칭 로직 수정 (bare URL/도메인도 하이퍼링크)
   - 이미지 첨부 포스팅 성공 (AT Protocol uploadBlob)

7. **SNS Day 3 콘텐츠**
   - Bluesky: 이미지 2장 + 하이퍼링크 포스팅 완료
   - Threads: 수동 포스팅 완료
   - LinkedIn: 수동 포스팅 완료
   - daily_content.py → Supabase 드래프트 저장 추가

8. **H-008 가설 준비**
   - "AI 에이전트 유통 네트워크" 가설 구체화
   - ~/Desktop/run-h008.sh 스크립트 준비 (맥에서 실행 필요)

## 맥에서 직접 실행 필요

```bash
# H-008 가설 생성 (Claude CLI 1회 호출)
~/Desktop/run-h008.sh
```

## 자동화 상태
- auto-backup: 20분마다
- bluesky-monitor: 1시간마다
- daily-pipeline: 매일 9시 (ProcessType=Background)
- weekly-pipeline: 금 20:00 / 토 00:00 / 토 04:10 (재시도)

## 현재 메트릭 (대시보드 기준)
- Active Hypotheses: 2
- Total Page Views: 55
- Total Signups: 10
- Avg Conversion: 18.2%
- H-007-v3: 40 views, 6 signups, 15.0%
- H-006: 15 views, 4 signups, 26.7%

## 배포 URL
- sleepnfind.pages.dev — H-007-v3 랜딩
- calonce.pages.dev — H-006 랜딩
- pipeline-dashboard-46g.pages.dev — 대시보드

## 다음 세션 TODO
- [ ] H-008 생성 결과 확인 + 대시보드 메타 추가
- [ ] GEO 블로그 side hustle로 수정
- [ ] weekly pipeline에 --limit 적용
- [ ] Slack 알림 연결
- [ ] 유튜브 시리즈 타겟 조사 (가설별 progress 공유 콘텐츠)
- [ ] 에이전트용 유통 채널 수요 검증 방법 설계
- [ ] 랜딩페이지 user_agent 트래킹 추가 (page_view에 사용자 정보)
