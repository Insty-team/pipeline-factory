"""📊 대시보드 — KPI · 단골 자산 · 매출 기여 · 트렌드 (기존 dashboard/app.py 포팅)."""

import streamlit as st
import pandas as pd
from datetime import datetime
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
from shared.data_loader import load_daily_kpi, load_customers
from shared.analytics import churn_score, assign_tier, compute_revenue_attribution

df_daily = load_daily_kpi()
df_cust = load_customers()
df_cust["이탈점수"] = df_cust.apply(churn_score, axis=1)

today = df_daily.iloc[-1]
beta_days = len(df_daily)

st.title("📊 유어라인 대시보드")
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
)
c3.metric("신규", int(today["신규손님"]))
c4.metric("재방문", int(today["재방문손님"]))

c5, c6, c7 = st.columns(3)
c5.metric("후기 +", int(today["신규후기"]))
c6.metric("답글 자동", int(today["답글자동"]))
c7.metric("챗봇", int(today["챗봇응대"]), delta=f"→ 예약 {int(today['챗봇예약전환'])}")

# ───────── 2. AI 시뮬 ─────────
st.markdown("---")
st.markdown("### ✨ AI 시뮬레이션")
sim_total = int(df_daily["시뮬요청"].sum())
sim_conv = int(df_daily["시뮬예약전환"].sum())
sim_rate = (sim_conv / sim_total * 100) if sim_total > 0 else 0

c1, c2, c3 = st.columns(3)
c1.metric("오늘 시뮬", int(today["시뮬요청"]), delta=f"누적 {sim_total}")
c2.metric("예약 전환", sim_conv, delta=f"{sim_rate:.0f}%")
c3.metric("컨설팅 도구", int(df_daily["시뮬컨설팅도구"].sum()), delta="방문 시")

# ───────── 3. 이탈 위험 TOP 5 ─────────
st.markdown("---")
st.markdown("### ⚠️ 이탈 위험 단골 TOP 5")
st.caption("D+45+ 미방문 + 회원권 잔여 — 즉시 안부 알림 권장")

high_risk = df_cust.nlargest(5, "이탈점수")[
    ["닉네임", "누적방문", "미방문일수", "회원권종류", "회원권잔여", "이탈점수"]
].copy()
high_risk.columns = ["손님", "방문", "미방문 (일)", "회원권", "잔여", "점수"]
high_risk["회원권"] = high_risk["회원권"].fillna("—").astype(str)
high_risk["잔여"] = high_risk["잔여"].fillna("—").astype(str)
st.dataframe(high_risk, hide_index=True, use_container_width=True)

# ───────── 4. 단골 LTV ─────────
st.markdown("---")
st.markdown("### 💎 단골 자산")
df_cust["등급"] = df_cust["누적방문"].apply(assign_tier)
tier = (
    df_cust.groupby("등급")
    .agg(인원=("닉네임", "count"), 누적매출=("누적매출", "sum"))
    .reindex(["VIP (10+)", "단골 (5~9)", "Regular (2~4)", "신규 (1)"])
    .reset_index()
)
tier["평균LTV"] = (tier["누적매출"] / tier["인원"]).astype(int)
tier["누적매출"] = tier["누적매출"].apply(lambda x: f"{x:,}원")
tier["평균LTV"] = tier["평균LTV"].apply(lambda x: f"{x:,}원")
st.dataframe(tier, hide_index=True, use_container_width=True)

total_ltv = int(df_cust["누적매출"].sum())
st.info(f"💰 7년 단골 베이스 누적 매출 자산: **{total_ltv:,}원**")

# ───────── 5. 매출 기여 ─────────
st.markdown("---")
st.markdown(f"### 📈 베타 {beta_days}일 누적 매출 기여 (추정)")

rev = compute_revenue_attribution(df_daily)
contrib = pd.DataFrame(
    {
        "모듈": ["✨ AI 시뮬", "💬 챗봇", "💌 답글", "📢 알림톡"],
        "효과 (추정)": [f"+{rev[k]//10000}만원" for k in ["AI 시뮬", "챗봇 응답", "답글 자동", "알림톡 발송"]],
    }
)
st.dataframe(contrib, hide_index=True, use_container_width=True)
st.success(f"💎 누적 추정: **+{rev['합계']:,}원** ({rev['합계']//10000}만원)")

# ───────── 6. 트렌드 ─────────
st.markdown("---")
st.markdown("### 📊 베타 트렌드")
trend = df_daily.set_index("날짜")[["예약", "시뮬요청", "챗봇응대"]]
st.line_chart(trend, height=240)

st.caption(f"매일 새벽 자동 새로고침 · 마지막 갱신 {datetime.now().strftime('%H:%M')}")
