# GEO Truth Layer — 작업 인수인계 문서

> 클리닉 대상 AI 검색 최적화(GEO) 서비스
> "정확한 노출로 맞는 환자가 맞는 클리닉을 찾도록"

---

## 현재 상태 (2026-04-04)

> 2026-04-20 업데이트: 서비스 가설을 **AI가 병원을 정확히 찾고 설명하게 만드는 공식 정보 운영 서비스**로 재정의. `GEO/AEO/schema/llms.txt`는 내부 실행 언어로 두고, 병원에게는 `AI가 병원 공식 정보를 헷갈리지 않게 만드는 작업`이라고 설명한다.

**단계**: 전략/문서 완료 → AEO/GEO 인사이트 반영 → 아웃리치 반응 테스트 직전
**다음 행동**: 유스타일나인 1곳만 20~30분 카카오톡/문자 반응 테스트

### 멈춰있는 3가지

1. 메티/유스타일/세진 연락처 미확보 (카카오톡 ID, 전화번호)
2. ChatGPT 실제 검색 스크린샷 미촬영 (아웃리치 첨부용)
3. 감사 리포트 사장님 전달용 포맷(PDF/이미지) 미변환

### 오늘 하나만 할 액션 (2026-04-20)

- 2026-04-20 2026-04-20 18:30 KST: 유스타일나인/세진피부과 카카오톡 읽음 확인, 답장 없음. 상태: READ_NO_REPLY.
- 2026-04-20 2026-04-20 16:06 KST: 유스타일나인 카카오톡 채널 1차 메시지 발송 완료. 상태: 반응 대기.
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
