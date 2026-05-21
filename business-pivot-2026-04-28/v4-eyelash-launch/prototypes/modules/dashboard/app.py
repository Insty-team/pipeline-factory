"""유어라인 대시보드 — 사장 모바일 1탭 즐겨찾기 UX.

배포: Streamlit Cloud (https://share.streamlit.io) 무료 호스팅.
사장님 모바일 즐겨찾기 1탭 → 대시보드 즉시 확인.

데이터 소스 (베타 운영 시):
- Google Sheet "uareline-data" 일별 시트 + 손님 시트 (gspread API)
- 본 prototype: 가상 데이터 (sample-daily-data.csv + virtual-customer-db.csv)
"""

import streamlit as st
import pandas as pd
from datetime import datetime
from pathlib import Path

# ───────── 페이지 설정 (모바일 친화) ─────────
st.set_page_config(
    page_title="유어라인 대시보드",
    page_icon="💕",
    layout="centered",  # 모바일 친화 — 가운데 narrow column
    initial_sidebar_state="collapsed",
)

# 사장 톤 컬러 (핑크 #E89BAE · 라벤더)
st.markdown(
    """
    <style>
    .stApp { background-color: #FFF8FA; }
    [data-testid="stMetric"] {
        background-color: white;
        padding: 12px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(232, 155, 174, 0.15);
    }
    [data-testid="stMetricLabel"] { color: #6B5544; font-size: 0.85rem; }
    [data-testid="stMetricValue"] { color: #5A4A4A; font-weight: bold; }
    h1, h2, h3 { color: #B85A75; }
    .stAlert { border-radius: 12px; }
    </style>
    """,
    unsafe_allow_html=True,
)

# ───────── 데이터 로드 ─────────
BASE = Path(__file__).resolve().parent  # 절대 경로 — streamlit 환경 호환


@st.cache_data(ttl=300)
def load_daily_kpi():
    """베타 운영 시: Google Sheet 일별 시트 fetch.
       Prototype: 가상 5일치 CSV."""
    return pd.read_csv(BASE / "sample-daily-data.csv", parse_dates=["날짜"])


@st.cache_data(ttl=300)
def load_customers():
    """베타 운영 시: Google Sheet 손님 시트 fetch.
       Prototype: 가상 회원 DB 66명."""
    return pd.read_csv(BASE.parent / "loyalty/virtual-customer-db.csv")


def churn_score(row):
    """이탈 위험 점수 (0~100)."""
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
    if row["메디핑크시술"] == "Y" and d > 30:
        s += 10
    return s


df_daily = load_daily_kpi()
df_cust = load_customers()
df_cust["이탈점수"] = df_cust.apply(churn_score, axis=1)

today = df_daily.iloc[-1]
beta_days = len(df_daily)

# ───────── 헤더 ─────────
st.title("💕 유어라인 대시보드")
st.caption(
    f"D+{beta_days} (베타 {beta_days}일째)  ·  "
    f"{today['날짜'].strftime('%Y년 %m월 %d일')}"
)

# ───────── 1. 오늘 한눈에 ─────────
st.markdown("### 📊 오늘 한눈에")

c1, c2, c3, c4 = st.columns(4)
c1.metric("예약", int(today["예약"]))
c2.metric(
    "노쇼",
    int(today["노쇼"]),
    delta="좋아요" if today["노쇼"] == 0 else None,
    delta_color="normal",
)
c3.metric("신규", int(today["신규손님"]))
c4.metric("재방문", int(today["재방문손님"]))

c5, c6, c7 = st.columns(3)
c5.metric("후기 +", int(today["신규후기"]))
c6.metric("답글 자동", int(today["답글자동"]))
c7.metric(
    "챗봇",
    f"{int(today['챗봇응대'])}",
    delta=f"→ 예약 {int(today['챗봇예약전환'])}",
)

# ───────── 2. AI 시뮬레이션 ─────────
st.markdown("---")
st.markdown("### ✨ AI 시뮬레이션 (시술 미리보기)")
st.caption("손님 셀카 → J·C·D컬 비교 자동 회신 + 사장 컨설팅 도구")

sim_today = int(today["시뮬요청"])
sim_total = int(df_daily["시뮬요청"].sum())
sim_conv_total = int(df_daily["시뮬예약전환"].sum())
sim_conv_rate = (sim_conv_total / sim_total * 100) if sim_total > 0 else 0
sim_tool = int(df_daily["시뮬컨설팅도구"].sum())

c1, c2, c3 = st.columns(3)
c1.metric("오늘 시뮬", sim_today, delta=f"누적 {sim_total}")
c2.metric("예약 전환", sim_conv_total, delta=f"{sim_conv_rate:.0f}% 전환율")
c3.metric("컨설팅 도구", sim_tool, delta="방문 시")

# ───────── 3. 이탈 위험 단골 TOP 5 (액션 가능) ─────────
st.markdown("---")
st.markdown("### ⚠️ 이탈 위험 단골 TOP 5")
st.caption("D+45+ 미방문 + 회원권 잔여 — 즉시 안부 알림 권장")

high_risk = df_cust.nlargest(5, "이탈점수")[
    ["닉네임", "누적방문", "미방문일수", "회원권종류", "회원권잔여", "이탈점수"]
].copy()
high_risk.columns = ["손님", "방문 횟수", "미방문 (일)", "회원권", "잔여", "점수"]
high_risk["회원권"] = high_risk["회원권"].fillna("—").astype(str)
high_risk["잔여"] = high_risk["잔여"].fillna("—").astype(str)
st.dataframe(high_risk, hide_index=True, use_container_width=True)

# ───────── 4. 단골 LTV 현황 ─────────
st.markdown("---")
st.markdown("### 💎 우리 가게 단골 자산")

df_cust["등급"] = df_cust["누적방문"].apply(
    lambda v: "VIP (10+)"
    if v >= 10
    else "단골 (5~9)"
    if v >= 5
    else "Regular (2~4)"
    if v >= 2
    else "신규 (1)"
)
tier_order = ["VIP (10+)", "단골 (5~9)", "Regular (2~4)", "신규 (1)"]
tier = (
    df_cust.groupby("등급")
    .agg(인원=("닉네임", "count"), 누적매출=("누적매출", "sum"))
    .reindex(tier_order)
    .reset_index()
)
tier["평균LTV"] = (tier["누적매출"] / tier["인원"]).astype(int)
tier["누적매출"] = tier["누적매출"].apply(lambda x: f"{x:,}원")
tier["평균LTV"] = tier["평균LTV"].apply(lambda x: f"{x:,}원")
st.dataframe(tier, hide_index=True, use_container_width=True)

total_ltv = int(df_cust["누적매출"].sum())
st.info(f"💰 7년 단골 베이스 누적 매출 자산: **{total_ltv:,}원**")

# ───────── 5. 4주 베타 매출 기여 (추정) ─────────
st.markdown("---")
st.markdown(f"### 📈 베타 {beta_days}일 누적 매출 기여 (추정)")

avg_price = 55000  # 평균 시술 가격
sim_revenue = int(df_daily["시뮬예약전환"].sum()) * avg_price
chatbot_revenue = int(df_daily["챗봇예약전환"].sum()) * avg_price
reply_revenue = int(df_daily["답글자동"].sum()) * 30000  # 답글 → 단골 lock-in
noshow_recovered = int(df_daily["알림톡정보성"].sum() // 4)
alimtok_revenue = noshow_recovered * 20000

contrib = pd.DataFrame(
    {
        "모듈": [
            "✨ AI 시뮬",
            "💬 챗봇 응답",
            "💌 답글 자동",
            "📢 알림톡 발송",
        ],
        "효과 (추정)": [
            f"+{sim_revenue//10000}만원",
            f"+{chatbot_revenue//10000}만원",
            f"+{reply_revenue//10000}만원",
            f"+{alimtok_revenue//10000}만원",
        ],
        "근거": [
            f"시뮬 → 예약 {sim_conv_total}건 × {avg_price//10000}만",
            f"챗봇 → 예약 {int(df_daily['챗봇예약전환'].sum())}건 × {avg_price//10000}만",
            f"답글 자동 {int(df_daily['답글자동'].sum())}건 × 단골 회복 3만",
            f"노쇼 회수 {noshow_recovered}건 × 2만",
        ],
    }
)
st.dataframe(contrib, hide_index=True, use_container_width=True)

total = sim_revenue + chatbot_revenue + reply_revenue + alimtok_revenue
st.success(
    f"💎 베타 {beta_days}일 누적 추정 매출 기여: **+{total:,}원** "
    f"({total//10000}만원)"
)

# ───────── 6. 트렌드 ─────────
st.markdown("---")
st.markdown("### 📊 베타 트렌드")
st.caption("일별 핵심 KPI 변화")

trend = df_daily.set_index("날짜")[["예약", "시뮬요청", "챗봇응대"]]
st.line_chart(trend, height=240)

# ───────── 푸터 ─────────
st.markdown("---")
st.caption(
    f"매일 새벽 자동 새로고침 · 데이터: Google Sheet · "
    f"마지막 갱신 {datetime.now().strftime('%H:%M')}"
)
