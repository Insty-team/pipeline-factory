"""일간 1줄 생성기 — 매일 새벽 cron 실행.

베타 동안: 사용자가 텔레그램·로컬에서 받아서 사장 카톡으로 forward.
정기 운영: 카카오 알림톡으로 자동 발송 (사장 동의 후).

Prototype: virtual CSV 데이터.
운영: Google Sheet 일별 시트 + 손님 시트 fetch.
"""

import argparse
import csv
from datetime import date, datetime, timedelta
from pathlib import Path

BASE = Path(__file__).resolve().parent
TODAY = date.today()


def load_daily_data():
    """Prototype: CSV. 운영: Google Sheet 일별 시트."""
    with open(BASE / "../dashboard/sample-daily-data.csv") as f:
        return list(csv.DictReader(f))


def load_customer_data():
    """Prototype: CSV. 운영: Google Sheet 손님 시트."""
    with open(BASE / "../loyalty/virtual-customer-db.csv") as f:
        return list(csv.DictReader(f))


def determine_week(beta_start: date, today: date) -> int:
    """베타 N주차 계산."""
    days = (today - beta_start).days
    if days < 7:
        return 1
    elif days < 14:
        return 2
    elif days < 21:
        return 3
    else:
        return 4


def churn_risk_count(customers: list) -> int:
    """이탈 위험 단골 (D+45+) 카운트."""
    return sum(1 for c in customers if int(c["미방문일수"]) > 45)


def generate_1liner(
    daily: list, customers: list, beta_start: date, override_today: date = None
) -> str:
    """오늘 발송할 1줄 생성 — 주차별 인사이트 분기."""
    today = override_today or TODAY
    today_str = today.strftime("%-m/%-d")
    beta_days = (today - beta_start).days + 1
    week = determine_week(beta_start, today)

    yesterday_row = daily[-1]
    예약 = yesterday_row["예약"]
    노쇼 = yesterday_row["노쇼"]
    신규 = yesterday_row["신규손님"]
    재방문 = yesterday_row["재방문손님"]
    시뮬 = yesterday_row["시뮬요청"]
    시뮬전환 = yesterday_row["시뮬예약전환"]

    sim_total = sum(int(d["시뮬요청"]) for d in daily)
    sim_conv_total = sum(int(d["시뮬예약전환"]) for d in daily)
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
        rate = sim_conv_total * 100 // max(sim_total, 1)
        focus += f"\n✨ 시뮬 누적 {sim_total}건 ({sim_conv_total} 예약, {rate}% 전환)"

    elif week == 3:
        # 3주차 — 매출 기여 추정
        revenue = sim_conv_total * 55000 + (
            int(yesterday_row.get("알림톡정보성", 0)) // 4 * 20000
        )
        focus = f"💎 누적 매출 기여 추정 +{revenue//10000}만 (베타 {beta_days}일)"
        focus += f"\n📅 예약 {예약} · 노쇼 {노쇼}"
        focus += f"\n🌸 메디핑크 시술 +{1 if int(신규)>0 else 0} (D1 캠페인)"

    else:
        # 4주차 — commission 협상 준비
        sim_rev = sim_conv_total * 55000
        chatbot_rev = sum(int(d["챗봇예약전환"]) for d in daily) * 50000
        reply_rev = sum(int(d["답글자동"]) for d in daily) * 30000
        alimtok_rev = sum(int(d.get("알림톡정보성", 0)) for d in daily) // 4 * 20000
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
    p.add_argument("--today", default=None, help="시뮬 날짜 (YYYY-MM-DD)")
    p.add_argument("--out", default="-")
    args = p.parse_args()

    beta_start = datetime.strptime(args.beta_start, "%Y-%m-%d").date()
    today = (
        datetime.strptime(args.today, "%Y-%m-%d").date() if args.today else None
    )

    daily = load_daily_data()
    customers = load_customer_data()
    output = generate_1liner(daily, customers, beta_start, override_today=today)

    if args.out == "-":
        print(output)
    else:
        Path(args.out).write_text(output)
        print(f"✓ 저장: {args.out}", flush=True)
