# GEO Truth Layer — 작업 인수인계 문서

> 클리닉 대상 AI 검색 최적화(GEO) 서비스
> 고객 메시지: "AI가 병원 공식 정보를 헷갈리지 않게 만드는 작업"
> 내부 정의: AI가 병원을 정확히 찾고 설명하게 만드는 공식 정보 운영 서비스

> **🧭 전략 문서**: 단기(월 200~300만) + 장기(Zero to One)는 `geo-truth-layer/STRATEGY.md` 참조. 분기마다 다시 점검할 것.

---

## 현재 상태 (2026-04-27 업데이트)

**Phase**: P0 가설 검증 (Wave 1 발송 준비) — `STRATEGY.md` 1.3 표 기준
**단계 요약**: v2(텍스트) 4곳 무응답 → v3(dashboard톤) 폐기 → **Wave 1 5곳 동시 발송 진행 중** (v3.1 시각자료 가설)

**오늘(2026-04-27) 우선순위**:
① 카톡 채널 검색 5곳 (앤드/삼성화이트/윤앤정/루트테마/더힐) — 발송 가능 채널 확정
② 앤드성형 v3.1 visual.html 시제품 제작 (가장 임팩트 강한 케이스)
③ ChatGPT 검색 스크린샷 5곳 캡처 (사용자 직접)
④ 시제품 검토 → 나머지 4장 일괄 생성 → 5곳 동시 발송
⑤ 기존 v2 4곳 팔로업 1회 (별도 트랙, 04-27~28 사이)

**P0 종료 조건 (5/10까지)**: Wave 1 응답률 ≥15% → P1 진입 / <5% → 채널·메시지 피벗

### Wave 1 발송 5곳 (2026-04-26 결정, 내일 발송 준비)

| 클리닉 | 점수 | v3.1 메인 시각 증거 | 임팩트 |
|---|---|---|---|
| 앤드성형 (andps.co.kr) | 0 | ChatGPT 답변 부정확 + curl 406 시연 | ★★★★★ |
| 삼성화이트피부과 (samsungwhitederma.com) | 0 | 동일 + OEM "My Company Ltd" 인증서 | ★★★★★ |
| 윤앤정성형 (hiynj.com) | 25 | Chrome 빨간 경고 + HTTPS 미구현 | ★★★★ |
| 루트테마피부과 (themeskin.kr) | 30 | SSL cert 도메인 불일치 (lasik4u.co.kr) | ★★★ |
| 더힐피부과 신사본점 (thehealskin.co.kr) | (기존) | ChatGPT 검색 단편 + 메타 키워드 나열 | ★★★ |

근거: `geo-truth-layer/research/youtube-clinics-geo-audit.md` (13곳 감사, 평균 43점)

### 멈춰있는 트랙

1. 메티의원 연락처 미확보 (카카오톡 ID, 전화번호) — Wave 1과 별개
2. 감사 리포트 사장님 전달용 포맷(PDF/이미지) 미변환

### 발송 완료 4곳 (read-no-reply or pending, 2026-04-26 기준)

| 클리닉 | 발송일 | 상태 | 팔로업 예정 |
|--------|--------|------|-------------|
| 유스타일나인제모센터 | 2026-04-20 | READ_NO_REPLY | 2026-04-27 전후 1회 |
| 세진피부과 | 2026-04-20 | READ_NO_REPLY | 2026-04-27 전후 1회 |
| 헤이데이의원 강남점 | 2026-04-21 | 반응 대기 | 2026-04-28 전후 1회 |
| 담피부과(=담의원) | 2026-04-21 | 반응 대기 | 2026-04-28 전후 1회 |

### 최근 실행 업데이트

- 2026-04-26 저녁: **Wave 1 계획 확정** — 시각자료 가설 + 타겟팅 가설 + 표본 수 늘리기를 5곳 동시 발송으로 통합. 변수 분리는 동일 포맷·본문 톤 + 타겟 다양성 자연분류로 보장.
- 2026-04-26 저녁: **유튜브 운영 클리닉 GEO 감사 완료** (13곳, 보고서 `research/youtube-clinics-geo-audit.md`). 평균 43/100 (기존 타겟 ~15의 3배). 가설 "유튜브 운영 = GEO 부실" 단순 적용은 거짓이지만 교집합 4곳은 강력 후보 (앤드/삼성화이트/윤앤정/루트테마).
- 2026-04-26 저녁: **콜드 아웃리치 시각자료 리서치** — v3(dashboard 톤) 폐기 결정. 새 패턴 v3.1 = 흰 종이 + ChatGPT 검색 스크린샷 + 빨간펜 마크업 + 손글씨 1줄. 근거: RepliQ 4배, Sendspark 6배, B2B 69%가 "AI 같으면 거부".
- 2026-04-26: **v3 시제품 폐기** (더힐피부과 신사본점, dashboard 톤). 위치: `geo-truth-layer/sales/v3-heal-shinsa/`. 같은 폴더에 v3.1로 재제작 예정.
- 2026-04-26: **응답률 통계 리서치** — 텍스트 only 콜드 4~5%, 개인화 비주얼 16~30% (Sendspark), 다중 커스텀 필드 +142% (Manyreach). 카톡 채널은 이미지 1장+400자 제약.
- 2026-04-26: **하오덤의원 타겟 부적합 정정** — SSL 우회 후 재확인하니 Schema 11개+title 정상. 처음 grep이 SSL 거부로 빈 결과를 잘못 해석한 것.
- 2026-04-26: **타토아의원 SSL 결함 확인** — self-signed certificate in certificate chain. HTTPS 깨지고 HTTP만 응답. 영업 포인트 유효 ("AI가 위험 사이트로 분류").
- 2026-04-26: 신규 후보 robots.txt/Schema 정밀 체크. **타겟 적합**: 더힐피부과 신사본점(Schema 0), 타토아의원(SSL 결함). **타겟 부적합**: 하오덤/PHD/유앤아이/메종프리베/9skin1/오체안 (모두 Schema·메타 양호).
- 2026-04-26: **세션 기록 정정** — 4/20에 세진피부과도 카톡 발송 완료된 사실 누락 → HANDOFF·메모리 정정. 미발송은 메티의원 1곳만.
- 2026-04-21 2026-04-21 14:19 KST: 헤이데이의원 강남점/담피부과 v2 메시지 발송 완료. follow-up은 2026-04-28 전후 1회만.
- 2026-04-21: 헤이데이의원 강남점 v2 메시지 발송 완료. follow-up은 1주 후 1회만.
- 2026-04-21: 유스타일나인/세진피부과 read-no-reply 건은 1주 후 1회만 팔로업하는 정책으로 조정.
- 샘플 선제공 전략 기록: 내일 신규 클리닉에는 `AI가 헷갈릴 수 있는 지점 1개 + 3줄 메모`를 제안하는 v2 메시지를 1곳만 테스트.
- 콜드 어프로치 조사 반영: 오늘은 추가 대량 발송 금지. 24~48시간 후 유스타일나인에 `3줄 현황 메모` permission-first 팔로업 1회만 테스트.
- 2026-04-20 18:30 KST: 유스타일나인/세진피부과 카카오톡 읽음 확인, 답장 없음. 상태: READ_NO_REPLY.
- 2026-04-20 16:06 KST: 유스타일나인 카카오톡 채널 1차 메시지 발송 완료. 상태: 반응 대기.
- **유스타일나인 1곳만** 메시지 발송
- 목표: 계약이 아니라 `무료로 짧게 보내주세요` / `무슨 문제인가요?` 반응 확인
- 기록 버킷: `무응답 / 관심 / 거절 / 추가질문`

---

## 프로젝트 구조

```
pipeline-factory/
├── geo-truth-layer/               # 현재 활성 — GEO 서비스 전체
│   ├── geo-launch-plan.md         # 런칭 전략 + 실행 계획 (Phase 1~6)
│   ├── audits/                    # GEO 감사 결과
│   │   ├── geo-audit-muse-myeongdong.md    (~28/100)
│   │   ├── geo-audit-shinebeam-gangnam.md  (~35/100)
│   │   └── geo-clinic-comparison.md
│   ├── sales/                     # 세일즈 자료
│   │   ├── geo-sales-playbook.md           # 영업 플레이북 (가격, 퍼널, 반론 대응)
│   │   ├── geo-truth-layer-positioning.md  # 포지셔닝 + 메시지 v2
│   │   ├── geo-target-list-and-outreach.md # 타겟 3곳 + DM 메시지
│   │   ├── geo-competitor-analysis.md      # 경쟁사 분석 + 인수 전략
│   │   └── geo-viral-strategy-ai-era.md    # AI 시대 바이럴 전략
│   ├── demo-packets/              # 클리닉별 데모 JSON
│   ├── templates/                 # 아웃리치 트래커 CSV, 쿼리 로그
│   └── research/                  # GEO 관련 리서치 (시장, 인터뷰, Track B 등)
├── _legacy/                       # 이전 가설들 (H-006~H-018, pipeline 코드, n8n 등)
│   ├── pipeline/                  # 원래 파이프라인 코드
│   ├── landing-pages/             # 이전 가설 랜딩페이지
│   ├── n8n/                       # n8n 워크플로우
│   ├── dashboard/                 # 대시보드
│   ├── research/                  # 이전 리서치
│   ├── scripts/                   # daily/weekly pipeline 스크립트
│   └── docs/                      # PLAYBOOK.md, PIPELINE-V2-CHANGES.md
├── session-checkpoint.md          # 마지막 세션 상태
├── auto-backup.sh                 # 자동 백업 (launchd, 20분마다)
└── HANDOFF.md                     # 이 문서
```

---

## 타겟 클리닉 (Tier 1)

| # | 클리닉 | URL | GEO 점수 | 핵심 문제 | 연락처 |
|---|--------|-----|----------|----------|--------|
| 1 | **메티의원** | meticlinic.com | ~15 | imweb JS의존, Schema 0, 메타태그 0 | **미확보** |
| 2 | **유스타일나인** | ustyle9.com | ~20 | AI봇 전부 차단 (구글봇만 허용) | 02-553-2011 |
| 3 | **세진피부과** | sejinskin.com | ~10 | 네이버봇만 허용, AI 크롤러 전부 차단 | **미확보** |

경쟁사 비교 무기: 모리스의원 GEO ~55점 vs 메티 15점

---

## 가격 구조

| 패키지 | 가격 | 내용 |
|--------|------|------|
| GEO 감사 | 무료 | 리드 확보용 (점수 + 경쟁사 비교 + 스크린샷) |
| GEO 셋업 | 30~50만원 | robots.txt + Schema + llms.txt + 프로필페이지 + before/after |
| GEO 월정액 | 15~20만원 | 주간 AI 검색 테스트 + 월간 리포트 + 분기 업데이트 |

---

## Go/No-Go 기준

- **2주**: 아웃리치 10건+, 답변 3건+, 무료 파일럿 1건
- **1개월**: 파일럿 3건 완료, 유료 전환 1건
- **3개월**: 월 100만원+, 관리 5건+

---

## 핵심 도구

- **geo-seo-claude**: 데스크탑 설치됨 (`/home/samwoo/geo-seo-claude`)
- **Supabase + Cloudflare Pages**: 기존 인프라 (대시보드, 배포용)
- **Mac SSH**: `ssh -o IdentitiesOnly=yes -i ~/.ssh/id_ed25519 mac@10.50.1.121`

---

## 세션 시작 시 읽을 파일

```bash
cat session-checkpoint.md                              # 현재 상태
cat geo-truth-layer/sales/geo-target-list-and-outreach.md  # 타겟 + 메시지
cat geo-truth-layer/geo-launch-plan.md                 # 실행 계획
```
