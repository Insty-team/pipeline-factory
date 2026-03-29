# 세션 체크포인트 — 2026-03-30

## 여기서부터 이어서 작업

### 즉시 해야 할 것

1. **Daily pipeline이 오전 9시에 안 돌았음**
   - launchd 상태: registered but "not running"
   - 맥이 잠들지는 않았음 (uptime 확인)
   - StartCalendarInterval 설정 문제일 수 있음 — 디버깅 필요
   - 수동 실행으로 먼저 동작 확인: ./daily_pipeline.sh

2. **Weekly pipeline 결과 확인**
   - 어젯밤 21:33→22:03 완료됨 (30분 소요)
   - 수집: Calendly 9건, QuickBooks 6건, Mailchimp 9건, HubSpot 10건 등
   - FreshBooks에서 AI 파싱 에러 (무관한 데이터 수집됨)
   - 새 가설이 생성됐는지 확인 필요 (hypotheses/ 폴더에 새 파일 없음 — 가설 생성 단계까지 갔는지 로그 확인)
   - landing-pages/h007v3-ai/ 생성됨 (builders/landing.py 테스트 결과)

3. **Bluesky 유령 포스트 정리**
   - 수동 삭제한 "Day 2 scheduling" 포스트가 history에서 제거됨
   - 대시보드는 다음 monitor 실행 시 최신화

4. **Claude CLI 사용량 절약 방안 적용**
   - weekly pipeline이 51개 서비스 전부 크롤링 + AI 분석 → 30분 + 대량 토큰
   - 절약 방법:
     a. sources.json에서 서비스 수 줄이기 (51→10개로 시작)
     b. orchestrator.py에 --limit 옵션 추가 (한 번에 처리할 서비스 수)
     c. AI 분석 전에 Reddit 데이터 필터링 (관련 없는 건 AI 호출 안 함)
     d. 가설 생성 시 MAX_HYPOTHESES=2 환경변수 설정
     e. daily_content.py 폴백 템플릿 사용 (AI 실패 시)

### 우선순위 (내일 순서)

1. daily pipeline launchd 디버깅 + 수동 실행 테스트
2. weekly pipeline 로그 전체 확인 (가설 생성 결과)
3. Claude 사용량 절약 — sources.json 서비스 10개로 축소
4. --init-hypothesis "에이전트 마켓플레이스" 맥에서 테스트
5. SNS 포스팅 (페르소나 유지):
   - Bluesky (자동 or 수동)
   - Threads (수동 — 질문형, 이미지)
   - LinkedIn (수동 — 구조적)
   - Medium (주간 업데이트)
6. Slack 알림 연결
7. 대시보드 Bluesky 데이터 확인

### 맥에서 직접 해야 할 것 (Claude CLI 필요)
```bash
# daily pipeline 수동 실행
cd /Users/mac/projects/pipeline-factory
./daily_pipeline.sh

# init-hypothesis 테스트
cd pipeline
python3 orchestrator.py --init-hypothesis "에이전트 마켓플레이스"

# 로그 확인
cat /tmp/weekly-pipeline.log | tail -50
cat /tmp/daily-pipeline.log | tail -20
```

### 현재 배포 상태
- sleepnfind.pages.dev — H-007-v3 랜딩
- sleepnfind.pages.dev/blog/ai-digital-product-tools-2026 — GEO 블로그
- pipeline-dashboard-46g.pages.dev — 대시보드

### 현재 메트릭
- H-006: views=15, signups=3, conversion=20.0%
- H-007-v3: views=19, signups=3, conversion=15.8%
- Bluesky: 3 라이브 포스트 (1건 7L 3R)

### 자동화 상태
- auto-backup: 20분마다 ✅
- bluesky-monitor: 1시간마다 ✅
- daily-pipeline: 매일 9시 ⚠️ (오늘 미실행 — 디버깅 필요)
- weekly-pipeline: 매주 토요일 9시 ✅ (어젯밤 수동 실행 완료)

### Claude 사용량 절약 TODO
- [ ] sources.json 서비스 51→10개로 축소
- [ ] orchestrator.py에 --limit N 옵션
- [ ] Reddit 데이터 사전 필터링 (AI 호출 전)
- [ ] .env에 MAX_HYPOTHESES=2 설정
- [ ] daily_content.py AI 실패 시 템플릿 폴백 확인
