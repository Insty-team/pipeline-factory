# 세션 체크포인트 — 2026-04-01 (오후)

## 이번 세션에서 끝난 것

### H-008 브랜딩 변경 + 영어/한국어 완전 분리
- **AgentDock → Glowe (영어) / 글로우미 (한국어)**
- 의료미용 디스커버리 보드 포지셔닝 유지, 뷰티 마켓에 맞는 브랜드명으로 변경
- 영어/한국어 페이지를 별도 Cloudflare Pages 프로젝트로 완전 분리 배포
  - 영어: glowe-en.pages.dev (5개 페이지)
  - 한국어: gloweme-kr.pages.dev (5개 페이지)
- 기존 agentdock-9vk.pages.dev는 legacy (아직 살아있음)

### 시장별 UI 리서치 + 반영
- **한국 시장 리서치**: 강남언니/바비톡/여신티켓 UX 패턴 분석
  - 고밀도 카드, 모바일 하단 네비, 가격 투명성, 후기 건수, 영수증 인증
  - 한국어 페이지에 반영: Noto Sans KR, 다크 네이비, 하단 고정 네비, 필터 칩
- **북미 시장 리서치**: RealSelf/Zocdoc/Boulevard 소비자 조사 분석
  - 프리미엄 클린, 여백 = 신뢰, Board certification, HIPAA, 면책문구
  - 영어 페이지에 반영: navy/gold 색상, Georgia serif, 신뢰 배지 스트립, footer 면책

### 영어 페이지 변경 사항
- 색상: stone/rose → navy(#1e293b) + gold(#b8963e) + white
- Georgia serif 헤딩, 17px 본문
- start.html에서 한국어 프롬프트 완전 제거
- Board certification 배지 스트립, "Individual results may vary" 면책문구
- Footer: HIPAA 언급, Privacy Policy, 면책조항
- 모든 페이지에 한국어 전환 링크 (→ gloweme-kr.pages.dev)

### 한국어 페이지 (신규 5개)
- 색상: 다크 네이비(#1a2744) + 로즈(#e8527a)
- Noto Sans KR, 고밀도 레이아웃
- 모바일 하단 고정 네비 (홈/시작/게시판/문서/대시보드)
- 강남언니 스타일 카드 (카드당 6+ 데이터 포인트)
- 가로 스크롤 필터 칩
- 존댓말 카피, "의료 조언이 아닙니다" 면책
- 모든 페이지에 English 전환 링크 (→ glowe-en.pages.dev)

### 파이프라인 설정 업데이트
- validation_targets.json: H-008 → Glowe/글로우미 브랜딩, 이중 URL 구조

---

## 현재 3개 가설 상태

| ID | 브랜드 | URL | 상태 | 실제 유저 |
|---|---|---|---|---|
| H-006 | CalOnce | calonce.pages.dev | 랜딩 배포됨, 홍보 미진행 | 0 |
| H-007-v3 | SleepnFind | sleepnfind.pages.dev | 랜딩 배포됨, 홍보 미진행 | 0 |
| H-008 | Glowe / 글로우미 | glowe-en.pages.dev / gloweme-kr.pages.dev | 랜딩+보드+대시보드+API 배포, 데모 데이터 있음 | 0 |

---

## 오늘 남은 할 일

### 긴급 (H-008 분리 배포 후속)
1. **한국어 API 연결 확인** — gloweme-kr에는 Functions가 없음. Board/Dashboard API 호출 실패할 수 있음
   - 옵션 A: 한국어에서 glowe-en API를 CORS로 호출
   - 옵션 B: ko/ 폴더에도 functions/ 복사해서 배포
   - 옵션 C: 별도 API 서버
2. **데모 데이터 확인** — 새 프로젝트(glowe-en)에 기존 KV/D1 데이터 연결 필요
3. **기존 agentdock-9vk 프로젝트 정리** — 리다이렉트 or 삭제 결정

### H-006 / H-007-v3 홍보 (둘 다 유저 0)
4. **Bluesky 콘텐츠 포스팅** — daily_content.py로 H-006, H-007-v3 포스트 생성 + 발행
5. **Twitter API 재시도** — 3/29에 503이었음, 복구 확인
6. **채널별 수동 홍보** — Reddit(수동), Indie Hackers 포스팅
7. **홍보 포스트 톤 재작성** — "빌더 여정" 프레이밍으로 (feedback_promo_tone.md 참고)

### H-008 다음 단계
8. **listing schema 다듬기** — 실제 클리닉 온보딩 수준
9. **verification_status / provider facts / risky claims flow 구체화**
10. **한국 시장 vertical 검증** — medspa, injectables, skin clinics 중 wedge 선택

### 파이프라인 정비
11. **content_calendar.json 업데이트** — 3개 가설 모두 포함
12. **H-008 가설 파일 업데이트** — 현재 H-008_20260330.json이 구 포지셔닝(범용 에이전트 보드)임. Glowe/글로우미 의료미용으로 업데이트 필요
13. **n8n 워크플로우 점검** — Docker 컨테이너 running 확인됨, 실제 스케줄 동작 테스트

---

## 파일 메모

### 새로 생긴 파일
- `landing-pages/h008-agentdock/ko/index.html` — 한국어 랜딩
- `landing-pages/h008-agentdock/ko/start.html` — 한국어 온보딩
- `landing-pages/h008-agentdock/ko/board.html` — 한국어 게시판
- `landing-pages/h008-agentdock/ko/docs.html` — 한국어 문서
- `landing-pages/h008-agentdock/ko/dashboard.html` — 한국어 대시보드

### 변경된 파일
- `landing-pages/h008-agentdock/index.html` — Glowe 브랜딩 + navy/gold 테마
- `landing-pages/h008-agentdock/start.html` — 한국어 프롬프트 제거, 영어만
- `landing-pages/h008-agentdock/board.html` — navy 테마 + 면책문구
- `landing-pages/h008-agentdock/docs.html` — navy 테마
- `landing-pages/h008-agentdock/dashboard.html` — navy 테마
- `pipeline/config/validation_targets.json` — H-008 이중 URL 구조

### 리서치 리포트 (자동 저장됨)
- `.omc/scientist/reports/20260401_095522_korean_medspa_ux_research.md`
- `.omc/scientist/reports/20260401_095631_na_medspa_ux_research.md`

### Cloudflare Pages 프로젝트
- `glowe-en` — 영어 (functions/api 포함)
- `gloweme-kr` — 한국어 (functions 없음 ⚠️)
- `agentdock` — legacy (기존, 아직 살아있음)
- `calonce` — H-006
- `sleepnfind` — H-007-v3
