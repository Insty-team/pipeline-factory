# 세션 체크포인트 — 2026-03-30 12:00

## 다음 세션에서 바로 이어서 할 것

### H-008 MVP 설계 (최우선)
에이전트가 주인의 서비스/프로덕트를 홍보하는 게시판. 실제로 만들어서 배포.

MVP 요구사항 정리 필요:
1. **에이전트 등록**: MCP 서버로 접근. API 호출로 자가 등록 → 토큰 리턴
2. **홍보 포스팅**: 에이전트가 서비스를 게시판에 포스트
3. **에이전트 대시보드**: 주인이 자기 에이전트 확인
   - 내 에이전트가 뭐하고 있는지
   - 누가 내 에이전트 활동에 관심 있는지
   - 홍보 성과 (views, interactions)
4. **에이전트 간 interaction**: 다른 에이전트가 홍보에 어떻게 반응?
   - 관심 표시? 질문? 구매 요청?
   - 이게 핵심 설계 과제 — 내일 함께 고민

### 열린 질문 (내일 답하기)
- 이름 정하기 (현재 임시: AgentDock / Agent Board)
- 에이전트 간 interaction 메커니즘 설계
- MCP 서버 기술 스택 결정
- 어디서 호스팅? (Supabase + Cloudflare Workers?)
- Moltbook과의 차별화 더 명확히

---

## 이번 세션 완료 요약

### 인프라
- Weekly pipeline: 금 20:00 → 토 00:00 → 토 04:10 (재시도)
- Daily pipeline: analytics + content + monitor + report + TODO
- Sources: 51→10개, --limit 옵션
- Cloudflare User API Token (cfut_*) 세팅 완료

### 대시보드 (pipeline-dashboard-46g.pages.dev)
- 반응형, Today Content, Waitlist Signups, 가설 링크, H-008 메타

### Bluesky
- 300자 트림, facet 수정, 이미지 포스팅 성공
- H-007-v3 Day 3 포스팅 완료 (이미지 2장 첨부)

### H-008 (확정 가설)
- 문제: 에이전트가 홍보할 곳이 없다 (SNS는 사람용)
- 해결: 에이전트가 API/MCP 하나로 주인의 서비스를 홍보하는 게시판
- 검증: 빌더들이 여기에 등록하고 싶어하는가?
- 랜딩페이지: agentdock-9vk.pages.dev (배포됨, 버그 수정됨)
- SNS 콘텐츠: Bluesky, Threads, LinkedIn 준비됨
- 조사: Moltbook (Meta 인수), 에이전트 마켓 수요, MuleRun
- 실제로 MVP 빌드하기로 결정

### 유튜브 전략
- CONDITIONAL GO, youtube-strategy.md 저장됨
- 보이스오버 + 화면캡처, 주 1영상
- 최소 6개월 커밋 필요

### 중요 발견
- H-006, H-007-v3 전환율 전부 본인 테스트 (실제 외부 유저 0)
- 실제 트래픽 유입이 최우선 과제

## 자동화 상태
- auto-backup: 20분마다 ✅
- bluesky-monitor: 1시간마다 ✅
- daily-pipeline: 매일 9시 ✅ (report+TODO 포함)
- weekly-pipeline: 금 20:00 / 토 00:00 / 토 04:10 ✅

## 배포 URL
- sleepnfind.pages.dev — H-007-v3
- calonce.pages.dev — H-006
- agentdock-9vk.pages.dev — H-008
- pipeline-dashboard-46g.pages.dev — 대시보드
