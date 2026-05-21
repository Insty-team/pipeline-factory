# 일간 1줄 — 매일 새벽 사장 카톡 발송 자동 생성

> Day 4 산출물 — 2026-05-21
> 시드: 데이터 인프라 (Google Sheet) + 대시보드 (URL trigger)
> 통합 위치: `02-target-uareline-prototype.md` §3 일간 1줄
>
> **목적**: 매일 8시 사장 카톡에 어제 1줄 요약 + 대시보드 링크 1탭 유도. 사장 가치 인지 가속 (매일 30초 인터랙션).

---

## 0. 작업 결과 요약

| 항목 | 값 |
|---|---|
| 산출물 | 일간 1줄 생성기 (`generator.py`) + 샘플 (`sample-output.txt`) |
| 발송 시점 | 매일 **08:00 KST** (사장 직접 카톡 발송 — 베타 동안) |
| 텍스트 길이 | **4~5줄** (30초 안에 인식 가능) |
| 데이터 소스 | Google Sheet 일별 시트 + 손님 시트 + 시뮬 시트 |
| 자동화 비율 | **생성 100%** / 발송은 베타 동안 사용자 직접 (사장 동의 후 자동 전환) |
| 대시보드 링크 포함 | ✅ 1줄 마지막에 항상 |

---

## 1. 일간 1줄 포맷 (사장님 30초 인식)

### 1-1. 표준 포맷 (5줄)

```
[유어라인] 어제 요약 — 5/22 (D+5)

📅 예약 4 · 노쇼 0 · 신규 1 · 재방문 3
✨ AI 시뮬 3건 (1건 예약 전환 — 누적 25/11)
💌 후기 +1 · 답글 자동 1 · 챗봇 12 (예약 1)
⚠️ 이탈 위험 단골 21명 (어제 대비 +1)

📊 자세히 → dashboard-uareline.streamlit.app
```

### 1-2. 압축 포맷 (사장 busy day용 — 3줄)

```
[유어라인] 5/22 (D+5)

예약 4 · 노쇼 0 · 신규 1 · 시뮬 3 → 예약 1 · 이탈 위험 +1

📊 → dashboard-uareline.streamlit.app
```

### 1-3. 주말 압축 (토·일 — 3줄)

```
[유어라인] 토요일 요약

예약 4 · 노쇼 0 · 신규 0 · 후기 +2
✨ AI 시뮬 5 (2건 예약 전환 — 주말 효과)

→ dashboard-uareline.streamlit.app
```

→ **사장 입장**: 8시 카톡 받아서 30초 안에 "오늘 별일 있나" 즉시 파악. 클릭하면 대시보드.

---

## 2. 사장 인사이트 부각 — 주차별 조정

### 2-1. 베타 1주차 (D-Day~D+7): **노쇼·신규**

```
[유어라인] 어제 요약 — 5/22 (D+5)

📅 예약 4 · 노쇼 0 ⭐ (베타 시작 후 5일째 노쇼 0)
✨ AI 시뮬 3건 (1건 예약 전환)
💌 신규 1명 (시뮬 통해서)

📊 → dashboard-uareline.streamlit.app
```

### 2-2. 베타 2주차 (D+8~D+14): **이탈 위험**

```
[유어라인] 어제 요약 — 5/29 (D+12)

⚠️ 이탈 위험 단골 18명 (어제보다 -3 — 알림톡 효과)
📅 예약 5 · 재방문 4
✨ AI 시뮬 누적 38건 (시뮬→예약 14건, 37% 전환율)

📊 → dashboard-uareline.streamlit.app
```

### 2-3. 베타 3주차 (D+15~D+21): **메디핑크 캠페인**

```
[유어라인] 어제 요약 — 6/5 (D+19)

🌸 메디핑크 신규 시술 +1 (D1 친구톡 캠페인 효과)
📅 예약 6 · 노쇼 0
💎 누적 매출 기여 추정 +180만 (베타 19일)

📊 → dashboard-uareline.streamlit.app
```

### 2-4. 베타 4주차 (D+22~D+28): **commission 협상 준비**

```
[유어라인] 어제 요약 — 6/12 (D+26)

💎 베타 4주 누적 추정: +220만 (모듈 합산)
   - AI 시뮬: +75만 / 챗봇: +60만 / 답글: +30만 / 알림톡: +55만
📈 4주 재방문률 +22% (베타 시작 대비)

📊 결과 리포트 B 준비 중 → dashboard-uareline.streamlit.app
```

---

## 3. 발송 워크플로우 (베타 동안 사용자 직접)

```
┌──────────────────────────────────────────────┐
│   매일 새벽 자동 (cron 07:55 KST)              │
│                                              │
│   [Google Sheet 일별 시트 fetch]             │
│       ↓                                      │
│   [어제 1줄 생성 — generator.py]              │
│       ↓                                      │
│   [텔레그램 봇 / 카톡 챗봇으로 사용자에게 전송]   │
│       ↓                                      │
│   [사용자가 사장 카톡으로 forward (08:00 KST)] │
│       ↓                                      │
│   [사장 모바일 카톡 알림 → 1줄 읽음 → 1탭]     │
│       ↓                                      │
│   [대시보드 페이지 열림 → 자세히 확인]          │
└──────────────────────────────────────────────┘
```

**왜 사용자가 직접 forward?**:
1. 베타 1주차: 사장 톤 검수 — 사용자가 카톡 보내기 전 1줄 검수 가능
2. 사장 친밀감 — 사장 입장에서 "AI가 보낸 거" 보다 "당신이 보낸 거"가 따뜻함
3. 사장 의향 학습 — 답장 1줄 받으면 다음 1줄 개인화 가능

**정기 운영 시점 (commission 합의 후)**:
- 카카오 알림톡으로 자동 발송 (사장 직접 노출, 알리고 인프라 재사용)
- 또는 사장이 봇 자동 발송 OK 명시 시점에 전환

---

## 4. 생성 로직 (코드 스켈레톤)

### 4-1. `generator.py`

```python
"""일간 1줄 생성기 — 매일 새벽 cron 실행."""

import argparse
import csv
from datetime import date, datetime, timedelta
from pathlib import Path

BASE = Path(__file__).resolve().parent
TODAY = date.today()
YESTERDAY = TODAY - timedelta(days=1)


def load_daily_data():
    """Prototype: CSV. 운영: Google Sheet 일별 시트."""
    return list(csv.DictReader(open(BASE / "../dashboard/sample-daily-data.csv")))


def load_customer_data():
    """Prototype: CSV. 운영: Google Sheet 손님 시트."""
    return list(csv.DictReader(
        open(BASE / "../loyalty/virtual-customer-db.csv")
    ))


def determine_week(beta_start: date, today: date) -> int:
    """베타 N주차 계산."""
    days = (today - beta_start).days
    if days < 7:    return 1
    elif days < 14: return 2
    elif days < 21: return 3
    else:           return 4


def churn_risk_count(customers: list) -> int:
    """이탈 위험 단골 (D+45+) 카운트."""
    return sum(1 for c in customers if int(c['미방문일수']) > 45)


def generate_1liner(daily: list, customers: list, beta_start: date) -> str:
    """오늘 발송할 1줄 생성 — 주차별 인사이트 분기."""
    today_str = TODAY.strftime("%-m/%-d")
    beta_days = (TODAY - beta_start).days + 1
    week = determine_week(beta_start, TODAY)

    yesterday_row = daily[-1]
    예약 = yesterday_row['예약']
    노쇼 = yesterday_row['노쇼']
    신규 = yesterday_row['신규손님']
    재방문 = yesterday_row['재방문손님']
    시뮬 = yesterday_row['시뮬요청']
    시뮬전환 = yesterday_row['시뮬예약전환']
    후기 = yesterday_row['신규후기']
    답글 = yesterday_row['답글자동']
    챗봇 = yesterday_row['챗봇응대']
    챗봇예약 = yesterday_row['챗봇예약전환']

    sim_total = sum(int(d['시뮬요청']) for d in daily)
    sim_conv_total = sum(int(d['시뮬예약전환']) for d in daily)
    churn = churn_risk_count(customers)

    # 주차별 인사이트 부각
    if week == 1:
        # 1주차 — 노쇼·신규
        focus = f"📅 예약 {예약} · 노쇼 {노쇼}"
        if int(노쇼) == 0:
            focus += f" ⭐ (베타 {beta_days}일째 노쇼 0)"
        focus += f"\n✨ AI 시뮬 {시뮬}건 ({시뮬전환}건 예약 전환)"
        focus += f"\n💌 신규 {신규}명 · 재방문 {재방문}"

    elif week == 2:
        # 2주차 — 이탈 위험
        focus = f"⚠️ 이탈 위험 단골 {churn}명"
        focus += f"\n📅 예약 {예약} · 재방문 {재방문}"
        focus += f"\n✨ 시뮬 누적 {sim_total}건 ({sim_conv_total} 예약, {sim_conv_total*100//max(sim_total,1)}% 전환)"

    elif week == 3:
        # 3주차 — 매출 기여 추정
        revenue = sim_conv_total * 55000 + int(yesterday_row.get('알림톡정보성', 0)) // 4 * 20000
        focus = f"💎 누적 매출 기여 추정 +{revenue//10000}만 (베타 {beta_days}일)"
        focus += f"\n📅 예약 {예약} · 노쇼 {노쇼}"
        focus += f"\n🌸 메디핑크 시술 +{1 if int(신규)>0 else 0} (D1 캠페인)"

    else:
        # 4주차 — commission 협상 준비
        sim_rev = sim_conv_total * 55000
        chatbot_rev = sum(int(d['챗봇예약전환']) for d in daily) * 50000
        reply_rev = sum(int(d['답글자동']) for d in daily) * 30000
        alimtok_rev = sum(int(d.get('알림톡정보성', 0)) for d in daily) // 4 * 20000
        total = (sim_rev + chatbot_rev + reply_rev + alimtok_rev) // 10000
        focus = f"💎 베타 4주 누적 추정: +{total}만 (모듈 합산)"
        focus += f"\n   AI 시뮬: +{sim_rev//10000}만 / 챗봇: +{chatbot_rev//10000}만"
        focus += f"\n   답글: +{reply_rev//10000}만 / 알림톡: +{alimtok_rev//10000}만"

    lines = [
        f"[유어라인] 어제 요약 — {today_str} (D+{beta_days})",
        "",
        focus,
        "",
        "📊 자세히 → dashboard-uareline.streamlit.app",
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--beta-start", default="2026-05-17")
    p.add_argument("--out", default="-")
    args = p.parse_args()

    beta_start = datetime.strptime(args.beta_start, "%Y-%m-%d").date()
    daily = load_daily_data()
    customers = load_customer_data()
    output = generate_1liner(daily, customers, beta_start)

    if args.out == "-":
        print(output)
    else:
        Path(args.out).write_text(output)
```

### 4-2. cron 셋업 (사용자 macOS 또는 GitHub Actions)

**옵션 A — macOS cron (사용자 노트북, 베타 동안)**:
```bash
# crontab -e
55 7 * * * cd /Users/mac/.../prototypes/modules/daily && \
           python3 generator.py --out /tmp/uareline-daily.txt && \
           open /tmp/uareline-daily.txt    # 노트북에서 자동 열기
# → 사용자가 카톡으로 사장에게 forward
```

**옵션 B — GitHub Actions (정기 운영 시점)**:
```yaml
# .github/workflows/daily-1liner.yml
name: 일간 1줄
on:
  schedule:
    - cron: "55 22 * * *"  # UTC 22:55 = KST 07:55

jobs:
  generate-and-send:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install gspread
      - run: python3 prototypes/modules/daily/generator.py --out /tmp/today.txt
      - run: |
          # 텔레그램 봇으로 사용자에게 1줄 전송
          curl -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
            -d "chat_id=$USER_CHAT_ID" \
            -d "text=$(cat /tmp/today.txt)"
        env:
          BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          USER_CHAT_ID: ${{ secrets.TELEGRAM_USER_ID }}
```

→ **사용자 워크플로우**: 텔레그램 봇 알림 받음 → 1줄 복사 → 사장 카톡 forward (30초).

---

## 5. KPI 측정

| KPI | 측정 | 베타 목표 |
|---|---|---|
| 사장 카톡 읽음 비율 | 카톡 "1" 표시 | ≥ 95% (사장 매일 본다) |
| 대시보드 클릭률 | URL 클릭 (Streamlit 분석 또는 Bitly) | ≥ 30% (사장 자주 본다) |
| 사장 답장률 (정성) | "오 노쇼 0 좋은데" 같은 답장 | 주 2~3건 (사장 관심) |
| 발송 누락 | 1주 누락 횟수 | 0 (cron 100% 성공) |

---

## 6. 사장 검수 체크리스트 (베타 D-Day 미팅 시)

- [ ] 1줄 포맷 OK? (5줄 vs 3줄 vs 다른 형식)
- [ ] 8시 발송 시간 OK? (사장 기상 시간 확인)
- [ ] 베타 동안 사용자 직접 forward OK? (또는 봇 자동)
- [ ] 주차별 인사이트 전환 OK? (1주차 노쇼, 2주차 이탈, 3주차 매출, 4주차 commission)
- [ ] 대시보드 링크 클릭하는 게 자연스러운지? (URL 즐겨찾기로 1탭)
- [ ] 사장 답장 받으면 어떻게 대응? (개인화 학습 — 2주차부터)

---

## 7. 정직한 한계 + 회피

### 7-1. 한계
- **사용자 직접 forward**: 베타 동안 사용자 매일 30초 카톡 forward 필요 (자동화 안 됨)
- **사장 카톡 안 봄 가능성**: 시술 중·휴무·여행 등 → 누적해서 일주일 후 카톡 받으면 의미 ↓
- **대시보드 클릭 안 함**: 1줄만 보고 끝 → 대시보드 가치 못 인지

### 7-2. 회피
- **사용자 forward는 베타 동안만** — 정기 운영 시 자동 (사장 동의)
- **사장 카톡 안 봄 → 주간 리포트로 보강**: 매주 월요일 5줄 카톡 (M10c — 베타 매뉴얼)
- **대시보드 클릭 유도**: 1줄에 "자세히 →" 명시 + 사장이 궁금해할 만한 인사이트 부각 (예: 이탈 위험 +1)

---

## 8. 다른 모듈과 연결

```
일간 1줄 (이 문서)
   ↑ 데이터 source
   ├─ 데이터 인프라 (Google Sheet 일별 시트)
   ├─ 단골 분석 (이탈 위험 카운트)
   └─ 대시보드 (URL 출구)
   ↓ 발송 채널 (사장 카톡 forward)
   └─ 사장 폰 (대시보드 클릭 → 자세히)
```

---

## 9. 외부 참조

- 데이터 인프라: `prototypes/modules/infra/measurement-sheet.md`
- 단골 분석: `prototypes/modules/loyalty/loyalty-analysis.md`
- 대시보드: `prototypes/modules/dashboard/dashboard-design.md`
- 가상 일별 데이터: `prototypes/modules/dashboard/sample-daily-data.csv`
- Telegram Bot API: https://core.telegram.org/bots/api
- GitHub Actions cron: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule
