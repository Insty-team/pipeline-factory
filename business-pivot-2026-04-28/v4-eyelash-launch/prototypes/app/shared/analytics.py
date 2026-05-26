"""단골 분석 로직 — churn score, tier 계산 등 공통 함수."""

import pandas as pd


def churn_score(row) -> int:
    """이탈 위험 점수 (0~100).

    - 미방문 일수 (40)
    - 누적 방문 횟수 (30) — loss aversion
    - 회원권 잔여 (20)
    - 메디핑크 패키지 중 이탈 (10)
    """
    s = 0
    d = int(row["미방문일수"])
    if d > 60:
        s += 40
    elif d > 45:
        s += 30
    elif d > 35:
        s += 15

    v = int(row["누적방문"])
    if v >= 10:
        s += 30
    elif v >= 5:
        s += 20
    elif v >= 2:
        s += 10

    remaining = row.get("회원권잔여", "")
    if pd.notna(remaining) and str(remaining).strip() and str(remaining) != "nan":
        try:
            if int(float(remaining)) >= 3:
                s += 20
        except (ValueError, TypeError):
            pass

    if row.get("메디핑크시술") == "Y" and d > 30:
        s += 10
    return s


def assign_tier(visits: int) -> str:
    """누적 방문 → 등급 매핑."""
    if visits >= 10:
        return "VIP (10+)"
    elif visits >= 5:
        return "단골 (5~9)"
    elif visits >= 2:
        return "Regular (2~4)"
    else:
        return "신규 (1)"


def compute_revenue_attribution(daily: pd.DataFrame) -> dict:
    """4 모듈별 매출 기여 추정 (베타 누적)."""
    avg_price = 55000
    sim_rev = int(daily["시뮬예약전환"].sum()) * avg_price
    chatbot_rev = int(daily["챗봇예약전환"].sum()) * avg_price
    reply_rev = int(daily["답글자동"].sum()) * 30000
    noshow_recovered = int(daily["알림톡정보성"].sum() // 4)
    alimtok_rev = noshow_recovered * 20000
    return {
        "AI 시뮬": sim_rev,
        "챗봇 응답": chatbot_rev,
        "답글 자동": reply_rev,
        "알림톡 발송": alimtok_rev,
        "합계": sim_rev + chatbot_rev + reply_rev + alimtok_rev,
    }
