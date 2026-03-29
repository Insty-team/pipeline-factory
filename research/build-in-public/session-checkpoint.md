# 세션 체크포인트 — 2026-03-30 08:30

## 완료된 작업 (이번 세션)

1. **Weekly pipeline 재시도 로직 구현**
   - `weekly_pipeline_runner.sh` 생성 (성공 마커로 중복 방지)
   - plist 수정: 금 20:00 → 토 00:00 → 토 04:10 (3회 자동 재시도)
   - launchd 재등록 완료

2. **Daily pipeline 디버깅**
   - 원인: 아직 9시 전이라 안 돌았던 것 (정상)
   - ProcessType=Background 추가하여 화면 잠김 시에도 동작하도록 개선
   - plist 재등록 완료

3. **Sources.json 축소 (51→10)**
   - US 5개: Calendly, Mailchimp, Notion, Gumroad, Canva
   - KR 5개: 채널톡, 스티비, 크몽, 네이버 스마트스토어, 아임웹
   - max_hypotheses_per_cycle: 100→2

4. **Orchestrator --limit 옵션 추가**
   - `python3 orchestrator.py --limit 3` 으로 서비스 수 제한 가능
   - collect 단계에서 US/KR 각각 limit 적용

5. **대시보드 버그 수정**
   - Title 컬럼에 실제 제목 표시 (TITLES 맵)
   - Bluesky 포스트 데이터 파싱 개선
   - Recent Events "Loading..." → 정상 렌더링
   - Weekly Pipeline 스케줄 표시 업데이트
   - HTML 파일 맥에 전송 완료
   - **배포 미완**: wrangler OAuth가 SSH(non-interactive)에서 안 됨

6. **SNS Day 3 콘텐츠 준비**
   - day3_bluesky.md: 주말 빌드 로그 (281자)
   - day3_threads.md: 자동화 과정 공유 + 질문
   - day3_linkedin.md: 일요일 스킵, 월요일 드래프트

## 맥에서 직접 해야 할 것

```bash
# 1. 대시보드 배포
cd /Users/mac/projects/pipeline-factory/dashboard-site
npx wrangler pages deploy . --project-name pipeline-dashboard --commit-dirty=true

# 2. Threads 수동 포스팅 (day3_threads.md 복붙)
cat /Users/mac/projects/pipeline-factory/pipeline/data/promotions/day3_threads.md

# 3. 내일 LinkedIn 포스팅 (8-10am)
cat /Users/mac/projects/pipeline-factory/pipeline/data/promotions/day3_linkedin.md

# 4. init-hypothesis 테스트 (Claude CLI 필요)
cd /Users/mac/projects/pipeline-factory/pipeline
python3 orchestrator.py --init-hypothesis "에이전트 마켓플레이스"
```

## 자동화 상태
- auto-backup: 20분마다 ✅
- bluesky-monitor: 1시간마다 ✅
- daily-pipeline: 매일 9시 ✅ (ProcessType=Background 추가됨)
- weekly-pipeline: 금 20:00 / 토 00:00 / 토 04:10 ✅ (재시도 로직)

## 현재 메트릭
- H-006: views=15, signups=3, conversion=20.0%
- H-007-v3: views=19, signups=3, conversion=15.8%
- Bluesky: 1 라이브 포스트 (7L 3R)

## 배포 URL
- sleepnfind.pages.dev — H-007-v3 랜딩
- sleepnfind.pages.dev/blog/ai-digital-product-tools-2026 — GEO 블로그
- pipeline-dashboard-46g.pages.dev — 대시보드

## 다음 세션 TODO
- [ ] 대시보드 배포 (맥에서 wrangler)
- [ ] daily pipeline 9시 실행 결과 확인 (오늘 첫 자동 실행)
- [ ] Threads 수동 포스팅
- [ ] LinkedIn 월요일 포스팅
- [ ] init-hypothesis "에이전트 마켓플레이스" 테스트
- [ ] GEO 블로그 side hustle로 수정 (현재 digital product)
- [ ] Slack 알림 연결
- [ ] Cloudflare API 토큰 설정 (SSH에서 wrangler 사용 가능하게)
- [ ] weekly pipeline --limit 옵션 적용 (weekly_pipeline.sh에서 orchestrator에 --limit 전달)
