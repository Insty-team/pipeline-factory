# Day 4 — 데이터 인프라 (Google Sheet + SOP + 자동화 연결)

> Day 4 첫 산출물 — 2026-05-10
> 모든 모듈(M4·M4-sim·M5·M6·M7·M9·M10) 데이터의 single source of truth
> 통합 위치: `02-target-uareline-prototype.md` §3 측정 인프라
>
> **목표**: 베타 4주 동안 사장 추가 노동 ≤ 30초/일 + 자동 데이터 누적 + commission 협상 근거 100%

---

## 0. 작업 결과 요약

| 항목 | 값 |
|---|---|
| Google Sheet 워크북 | **1개** (`uareline-data`) |
| 워크시트 (탭) | **7개** (일별·손님·시뮬·챗봇·후기·알림톡·회원권) |
| 데이터 컬럼 | 약 45개 |
| 자동 수집 비율 | **70%** (Apify·API·cron) |
| 사장 입력 부담 | **30초/일** 카톡 1줄 ("노쇼 1, 신규 2") |
| 사용자 transcribe | **2분/일** (사장 카톡 → sheet 1탭) |
| 사장 노출 | **❌** (대시보드 URL만) |
| Streamlit 연결 | gspread + streamlit_gsheets |

---

## 1. 워크시트 7개 스키마

### 1-1. 일별 (Daily KPIs) — 메인 시트, M10a 대시보드 핵심

| 컬럼 | 타입 | 데이터 소스 | 자동/수동 | 비고 |
|---|---|---|---|---|
| 날짜 | date | cron | 자동 | YYYY-MM-DD |
| 노쇼 건수 | int | 사장 카톡 | 수동 (사용자 transcribe) | "오늘 3시 노쇼 1건" |
| 예약 건수 | int | 네이버 예약 + 카톡 | 자동 (Apify) + 수동 보정 | 신규 + 재방문 합계 |
| 신규 손님 건수 | int | "어디서 보고?" SOP | 수동 (사장 카톡) | |
| 재방문 손님 건수 | int | 회원권 DB + 사장 입력 | 자동 매칭 + 수동 보정 | |
| 신규 후기 건수 | int | 네이버 플레이스 Apify | 자동 (cron 매시간) | |
| 답글 자동 건수 | int | M6 워크플로우 로그 | 자동 | |
| **챗봇 응대 건수** | int | M4 Cloudflare Worker | 자동 | |
| **챗봇 → 예약 전환** | int | M4 trigger 매핑 | 자동 + 수동 보정 | |
| **M4-sim 시뮬 요청** ⭐ | int | M4-sim worker | 자동 | 일별 시뮬 횟수 |
| **M4-sim → 예약 전환** ⭐ | int | reservation_chip 클릭 매핑 | 자동 + 수동 보정 | |
| **M4-sim 사장 컨설팅 도구 사용** ⭐ | int | Streamlit 미니앱 로그 | 자동 | 방문 시 사용 |
| 알림톡 발송 (정보성) | int | 알리고 API 로그 | 자동 | A1·A2·A3·A4·B·C |
| 친구톡 발송 (광고성) | int | 알리고 API 로그 | 자동 | A5·D1·D2·D3 |
| 인스타 게시 건수 | int | Meta Graph API | 자동 (cron 1일 1회) | |
| 블로그 게시 건수 | int | 네이버 블로그 API | 자동 | |
| 메모 | text | — | 사용자 자율 | "오늘 사장 휴가" 등 |

→ **하루 1행. 베타 4주 = 28행**.

### 1-2. 손님 (Customer DB) — M9 LTV 분석 source

| 컬럼 | 타입 | 데이터 소스 | 자동/수동 | 비고 |
|---|---|---|---|---|
| 손님 ID (해시) | string | sha256(이름+전화 일부) | 자동 | 개인정보 보호 |
| 손님 닉네임 (네이버) | string | 후기 작성 닉네임 | 자동 | |
| 첫 방문일 | date | 회원권 DB or 사장 입력 | 수동 | |
| 누적 방문 횟수 | int | 회원권 DB + 시술 기록 | 자동 + 수동 보정 | |
| 마지막 방문일 | date | 시술 기록 | 자동 | |
| 다음 예상 방문일 (D+28) | date | =마지막+28 | 자동 (수식) | M5 A5 알림톡 트리거 |
| 누적 매출 (추정) | int | 메뉴 × 횟수 | 자동 (수식) | |
| 회원권 종류 | enum | 회원권 DB | 자동 | 베이직 6/12, LED 6/12, 또는 X |
| **이탈 위험** | bool | =마지막 < TODAY - 45 | 자동 (수식) | M9 LTV 분석 핵심 컬럼 |
| **어디서 보고?** | enum | 사장 SOP | 수동 | 인스타·블로그·소개·검색·**시뮬**·기타 |
| 메디핑크 시술 여부 | bool | 시술 기록 | 수동 | |
| **시뮬 사용 이력** ⭐ | int | M4-sim 로그 매핑 | 자동 + 수동 보정 | |
| 메모 | text | — | 사용자 | |

→ **손님 1명 = 1행. 회원권 보유 단골 ~50명 + 신규 4주 베타 +20~30명 = ~80행 예상**.

### 1-3. 시뮬 로그 ⭐ (M4-sim Detail) — NEW

| 컬럼 | 타입 | 데이터 소스 | 자동/수동 | 비고 |
|---|---|---|---|---|
| 시뮬 ID | string (uuid) | worker | 자동 | |
| 일시 | datetime | worker | 자동 | |
| 손님 ID (해시) | string | 카톡 user_id | 자동 | |
| 시뮬 종류 | enum | request | 자동 | curl / volume / medipink |
| 시뮬 세부 | string | request | 자동 | J·C·D / 50%·90% / before-after |
| 응답 시간 (초) | float | worker timing | 자동 | SLA 10초 모니터 |
| 사장 검수 OK? | bool | 베타 1주차 사장 1탭 | 수동 (사장) | 1주차만 |
| **예약 전환?** | bool | reservation_chip → 실제 예약 | 자동 + 수동 매핑 | core KPI |
| **예약 전환 시간** | duration | 시뮬 → 예약 까지 | 자동 | 시뮬 가치 측정 |
| 클레임 발생? | bool | 사장 입력 | 수동 | "AI랑 다른데?" 발생 시 1 |
| 메모 | text | — | 사용자 | |

→ **시뮬 1건 = 1행. 베타 4주 ~200건 예상**.

### 1-4. 챗봇 응대 (M4 Detail)

| 컬럼 | 타입 | 데이터 소스 | 자동/수동 | 비고 |
|---|---|---|---|---|
| 응대 ID | string | worker | 자동 | |
| 일시 | datetime | worker | 자동 | |
| 손님 ID (해시) | string | user_id | 자동 | |
| 질문 카테고리 | enum | LLM 분류 | 자동 | 가격·디자인·알러지·세안·재방문·메디핑크·예약·**시뮬** |
| 질문 원문 (요약 50자) | text | request | 자동 | 사생활 보호 — 핵심만 |
| 자동 응답 OK? | bool | escalate 키워드 매칭 | 자동 | |
| Escalate 사유 | enum | keyword | 자동 (해당 시) | 환불·알러지·임산부·할인·휴무 등 |
| 응답 시간 (초) | float | timing | 자동 | |
| **시뮬 트리거?** ⭐ | bool | "시뮬·미리보기·어울려" 키워드 | 자동 | M4-sim 호출 트리거 |
| 사장 검수 (1주차) | enum | 사장 1탭 | 수동 | OK / 수정 / 패스 |

→ 베타 4주 ~600건 예상.

### 1-5. 후기 (Review Detail)

| 컬럼 | 타입 | 데이터 소스 | 자동/수동 | 비고 |
|---|---|---|---|---|
| 후기 ID | string | 네이버 플레이스 | 자동 | |
| 작성일 | date | 네이버 | 자동 | |
| 손님 닉네임 | string | 네이버 | 자동 | |
| 방문 횟수 (네이버) | int | 네이버 | 자동 | "10번째 방문" 등 |
| 별점 | int (1-5) | 네이버 | 자동 | |
| 후기 본문 (요약 100자) | text | 네이버 | 자동 | 핵심 추출 |
| 키워드 | array | 네이버 | 자동 | "친절", "꼼꼼", "맞춤 디자인" 등 |
| **답글 작성?** | bool | 네이버 답글 모니터 | 자동 | |
| 답글 자동/수동 | enum | M6 워크플로우 | 자동 | auto / manual / pending |
| 답글 작성일 | date | 네이버 | 자동 | |
| 사장 OK? (1주차) | bool | 사장 1탭 | 수동 | |

→ 베타 4주 ~30~50건 예상 (백필 10건 + 신규 20~40건).

### 1-6. 알림톡 발송 (M5 Detail)

| 컬럼 | 타입 | 데이터 소스 | 자동/수동 | 비고 |
|---|---|---|---|---|
| 발송 ID | string | 알리고 | 자동 | |
| 일시 | datetime | 알리고 | 자동 | |
| 손님 ID (해시) | string | 예약 DB | 자동 | |
| 템플릿 종류 | enum | trigger | 자동 | A1·A2·A3·A4·A5·B·C·D |
| 채널 | enum | 알리고 | 자동 | 알림톡 / 친구톡 |
| 발송 성공? | bool | 알리고 응답 | 자동 | |
| 손님 응답 (read/click) | enum | 알리고 webhook | 자동 (옵션) | |
| 단가 (원) | int | 가격 표 | 자동 (수식) | 8.5 / 12~18 |

→ 베타 4주 ~200건 예상.

### 1-7. 회원권 (M9 Source) — 사장 1회 CSV 업로드

| 컬럼 | 타입 | 데이터 소스 | 자동/수동 | 비고 |
|---|---|---|---|---|
| 회원권 ID | string | 사장 CSV | 수동 (1회) | |
| 손님 ID (해시) | string | 사장 CSV → 해시 | 수동 → 자동 | |
| 회원권 종류 | enum | 사장 CSV | 수동 | 베이직 6/12 / LED 6/12 |
| 구매일 | date | 사장 CSV | 수동 | |
| 사용 횟수 | int | 사장 CSV + 시술 기록 | 수동 + 자동 누적 | |
| 잔여 횟수 | int | =회원권총횟수-사용 | 자동 (수식) | |
| 마지막 사용일 | date | 시술 기록 | 자동 | |
| 만료일 (구매+1년) | date | =구매일+365 | 자동 (수식) | |
| **활성 단골?** | bool | =마지막사용 > TODAY-60 | 자동 (수식) | |

→ 사장 보유 회원권 ~50건 예상 (1회 업로드).

---

## 2. M4-sim 지표 대시보드 노출 (M10a 핵심 섹션)

> **사용자 요청 반영**: 카톡 시뮬 사용 횟수가 대시보드에 명확히 드러나도록.

### 2-1. M10a 대시보드 — M4-sim 섹션 mockup

```
┌──────────────────────────────────────────────────────────────┐
│  유어라인 베타 대시보드                  2026-05-15 (D+5)         │
│  사장님 모바일 → 즐겨찾기 1탭                                       │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  📊 오늘 (어제 데이터)                                            │
│  ────────────────────────                                       │
│  예약 4 / 노쇼 0 / 신규 1 / 재방문 3                                │
│  후기 +1 (자동 답글) / 챗봇 응대 12 (시뮬 3)                         │
│                                                                │
│  ✨ AI 시뮬레이션 (M4-sim) ─ 누적 베타 5일                          │
│  ─────────────────────────────────                              │
│  💄 시뮬 요청 — 25건 (일평균 5건)                                   │
│     └ 컬 비교: 18 / 풍성도: 4 / 메디핑크: 3                          │
│  🎯 시뮬 → 예약 전환 — 7건 (28% 전환율)                              │
│     └ 추정 가속 매출: ~30만원                                       │
│  ⏱️ 사장 컨설팅 도구 사용 — 4건 (방문 시술 시)                        │
│     └ 컨설팅 시간 평균 12분 (기존 30분 대비 -60%)                     │
│  ⚠️ 시뮬 클레임 — 0건 / 사장 검수 OK 비율 — 92%                       │
│                                                                │
│  📈 4주 베타 누적 매출 기여                                         │
│  ───────────────────────                                       │
│  M4-sim 시뮬: ~30만 / 챗봇 신규: 24만 / 답글 자동: 8만                 │
│  알림톡 노쇼 회수: 12만 / 합계: ~74만 (4주 추정)                       │
│                                                                │
│  ⚠️ 이탈 위험 단골 (D+45+ 미방문) — 3명                              │
│     ① 김** (D+52) - 회원권 잔여 4회                                │
│     ② 이** (D+47) - 단골 25회 누적                                 │
│     ③ 박** (D+58) - 메디핑크 1회만                                 │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### 2-2. M10b 일간 카톡 1줄 — M4-sim 포함

```
[유어라인 일간 1줄] 2026-05-15

어제 예약 4·노쇼 0·신규 1·재방문 3
후기 +1, 챗봇 12 (✨시뮬 3, 예약 전환 1)

📊 대시보드: dashboard.streamlit.app/uareline
```

→ 매일 8시 자동 발송. 시뮬 횟수 1줄에 포함.

### 2-3. M10e 진단 리포트 A — M4-sim 추정 효과 명시

DM 첨부 진단 리포트 (Day 5)에 추가:

```
[풀패키지 적용 시 (4주 베타 추정)]

AI 시술 시뮬레이션 (M4-sim, 1인 속눈썹샵 unique selling point):
  - 신규 손님 첫 시술 frustration ↓ 추정
  - 시뮬 → 예약 전환율 25~30% 추정
  - 사장 컨설팅 시간 30분 → 10분 (-67%)
  - 추정 가속 매출: 월 +15~30만 (시뮬 트리거 신규 예약)

모듈 합산 추정:
  - M4-sim: +15~30만/월
  - M4 챗봇: +25~50만/월
  - M5 알림톡 (노쇼 ↓): +30~80만/월
  - M6 답글 (단골 회복): +20~50만/월
  - M7 카드뉴스 (메디핑크 인지): +10~20만/월
  → 합계 +100~230만/월 추정
```

---

## 3. 데이터 입력 파이프라인 (자동 + 수동)

### 3-1. 자동 수집 (70%)

```
[자동 수집 source 7종]

  ① 네이버 플레이스 (Apify scraper, cron 매시간)
      → 후기 시트 + 일별 시트 (후기·답글 카운트)

  ② 네이버 예약 (사용자 1탭 또는 Apify 가능)
      → 일별 시트 (예약 카운트) + 손님 시트 (방문 기록)

  ③ M4 Cloudflare Worker 로그 (실시간)
      → 챗봇 시트 + 일별 시트 (응대·시뮬 트리거)

  ④ M4-sim 워커 로그 (실시간) ⭐
      → 시뮬 시트 + 일별 시트 (시뮬 요청·예약 전환)

  ⑤ 알리고 API webhook (실시간)
      → 알림톡 시트 + 일별 시트 (발송·응답)

  ⑥ Meta Graph API (cron 1일 1회 02:00)
      → 일별 시트 (인스타 게시·도달)

  ⑦ 네이버 블로그 API (cron 1일 1회 02:30)
      → 일별 시트 (블로그 게시·검색 유입)
```

### 3-2. 수동 입력 (30%)

```
[수동 입력 흐름]

  사장 (30초/일)
    └─ 카톡으로 1줄 보냄: "오늘 노쇼 1, 신규 2 (인스타 1·시뮬 1), 단골 3"
        ↓
  사용자 (2분/일)
    └─ 사장 카톡 받음 → Google Sheet 일별 시트에 1행 입력 (모바일 1탭)

  사장 1회 (베타 D-Day 미팅 시)
    └─ 회원권 데이터 CSV 또는 카톡 → 회원권 시트 일괄 업로드

  사장 (베타 1주차만, 5분/일)
    └─ 챗봇·시뮬 결과 카톡 미리보기 → 1탭 OK / 수정 / 패스
```

### 3-3. "어디서 보고 오셨어요?" SOP (1줄 가이드)

**사장이 신규 손님 시술 시작 직후 1번 묻기**:

> "어떻게 알고 오셨어요? 인스타·블로그·검색·소개·시뮬·기타 중에요~"

**사장이 카톡으로 사용자에게 결과 1줄 보냄**:

> "오늘 신규 1명 — 인스타 보고 옴" 또는 "오늘 신규 2명 — 시뮬 1·소개 1"

→ 사용자가 일별 시트 + 손님 시트에 입력.

→ **베타 4주 후 = 신규 손님 채널별 매핑 100% 완료** = commission 협상 시 "M4-sim → 신규 X명" 산정 근거.

---

## 4. Google Sheet 셋업 (사용자 5분)

### 4-1. 워크북 생성

```
1. https://sheets.new → 새 워크북
2. 이름: "uareline-data" (사용자 본인 Google 계정)
3. 7개 시트 탭 추가 (일별·손님·시뮬·챗봇·후기·알림톡·회원권)
4. 각 시트 첫 행에 컬럼명 입력 (본 문서 §1 스키마 그대로)
```

### 4-2. Service Account 셋업 (자동화 접근용, 1회)

```
1. https://console.cloud.google.com → 새 프로젝트
2. Sheets API + Drive API 활성화
3. Service Account 생성 → JSON 키 다운로드
4. 워크북 공유 → Service Account 이메일 (편집 권한)
5. JSON 키 → Cloudflare Worker secrets 또는 GitHub Actions secrets에 등록
```

### 4-3. 자동 수집 코드 (예시)

```python
# scripts/sheet_writer.py
import gspread
from google.oauth2.service_account import Credentials

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
SHEET_NAME = "uareline-data"

def get_sheet(tab: str):
    creds = Credentials.from_service_account_file(
        "service-account.json", scopes=SCOPES
    )
    gc = gspread.authorize(creds)
    return gc.open(SHEET_NAME).worksheet(tab)


def log_sim_request(sim_id, user_id, sim_type, response_time):
    """M4-sim 워커에서 호출."""
    sheet = get_sheet("시뮬")
    sheet.append_row([
        sim_id,
        datetime.now().isoformat(),
        user_id,  # 해시
        sim_type,
        "",  # 세부
        response_time,
        "",  # 사장 검수
        False,  # 예약 전환 (추후 업데이트)
        None,  # 예약 전환 시간
        False,  # 클레임
        "",  # 메모
    ])


def increment_daily(date, column, n=1):
    """일별 시트 해당 날짜 row의 컬럼 +n."""
    sheet = get_sheet("일별")
    row = find_row_by_date(sheet, date)
    cell = sheet.cell(row, column_index_for(column))
    sheet.update_cell(row, cell.col, int(cell.value or 0) + n)
```

---

## 5. 베타 운영 cadence

| 주차 | 사장 입력 | 사용자 transcribe | 자동 수집 |
|---|---|---|---|
| 1주차 | 30초/일 카톡 + 5분/일 검수 | 2분/일 sheet 1행 | 7개 source 자동 |
| 2주차 | 30초/일 카톡 (검수 OFF) | 2분/일 | 자동 |
| 3주차 | 30초/일 카톡 | 2분/일 | 자동 |
| 4주차 | 결과 모니터 | 결과 정리 | 자동 |

→ **베타 4주 합 사장 노동: ~30분 누적** (vs commission 가능 매출 +100~230만/월)

---

## 6. 사장 검수 / 사용자 검수 체크리스트

### 6-1. 사용자 (Day 5 DM 발송 전)

- [ ] Google Sheet 워크북 셋업 완료 (7개 시트 + 컬럼)
- [ ] Service Account 인증 통과 (테스트 1행 입력 OK)
- [ ] 7개 자동 수집 source 모두 작동 (테스트 1건씩)
- [ ] M4-sim 시뮬 컬럼 모두 노출 (대시보드 mockup 확인)
- [ ] "어디서 보고?" SOP 1줄 가이드 작성 OK
- [ ] 사장 검수 모드 1주차 셋업 (텔레그램·카톡 알림)

### 6-2. 사장 검수 (베타 D-Day 미팅 시)

- [ ] 30초/일 카톡 1줄 보내는 흐름 OK?
- [ ] 회원권 데이터 CSV 또는 카톡 공유 의향 OK?
- [ ] "어디서 보고?" SOP 운영 의향 OK?
- [ ] 1주차 검수 모드 1탭 부담 OK?
- [ ] 대시보드 URL (사장 노출용) 즐겨찾기 가능?

---

## 7. 정직한 한계 + 회피

### 7-1. 한계
- **사장 카톡 1줄 누락 시**: 일별 데이터 X → 사용자가 사장에게 다음 날 1탭 리마인드 ("어제 데이터 부탁드려요♡")
- **회원권 데이터 부재 시**: 사장이 카톡 또는 CSV 업로드 못 하면 → M9 LTV 분석 정확도 ↓
- **자동 수집 source 다운 시**: Apify·Aligo 다운 → 해당 source 자동 일시 정지, 사용자 수동 보정

### 7-2. 회피
- 모든 자동 수집은 idempotent (동일 데이터 중복 입력 방지)
- 일별 시트는 매일 02:00에 자동 새 row 추가 (사장 입력 0이라도 자동)
- 사장 카톡 누락 시 1탭 리마인드 (사용자 1분)
- 회원권 부재 시 M9는 시술 기록 + 후기 데이터로 fallback

---

## 8. 외부 참조

- M4 챗봇 (응대 데이터 source): `prototypes/uareline/chatbot-30q.md`
- M4-sim 시뮬 (시뮬 데이터 source): `prototypes/uareline/m4sim-simulation.md`
- M5 알림톡 (발송 데이터 source): `prototypes/uareline/alimtok-templates.md`
- M6 답글 (답글 데이터 source): `prototypes/uareline/reviews-replies.md`
- M9 LTV (이 sheet의 손님·회원권 시트 활용): `prototypes/uareline/ltv-analysis.md` (다음 산출물)
- M10a 대시보드 (이 sheet에서 fetch): `prototypes/uareline/dashboard/` (다음 산출물)
- gspread: https://docs.gspread.org
- streamlit_gsheets: https://github.com/streamlit/files-connection
- Apify Naver Place Reviews: https://apify.com
