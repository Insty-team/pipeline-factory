"""📅 일간 1줄 — 오늘 요약 + 카톡 forward (기존 generator.py 통합, Stage 2.10)."""

import streamlit as st
import sys
from pathlib import Path
from datetime import date, datetime, timedelta

# generator.py 재사용
GEN = Path(__file__).resolve().parent.parent.parent.parent / "modules/daily"
sys.path.insert(0, str(GEN))

st.title("📅 일간 1줄")
st.caption("매일 8시 사장님 카톡 발송용 — 어제 요약 1줄 자동 생성")

st.markdown("---")

try:
    from generator import generate_1liner, load_daily_data, load_customer_data

    beta_start = date(2026, 5, 17)
    today = st.date_input("발송 날짜", value=date.today())

    daily = load_daily_data()
    customers = load_customer_data()
    output = generate_1liner(daily, customers, beta_start, override_today=today)

    st.markdown("### 오늘 발송할 1줄 (사장님 카톡 forward 용)")
    st.code(output, language="text")

    st.caption(
        "💡 위 텍스트를 복사해서 사장님 카톡으로 forward해주세요. "
        "베타 동안 매일 8시. (정기 운영 시점에 자동 발송 전환)"
    )
except Exception as e:
    st.warning(f"생성 실패: {e}")
    st.info("🚧 generator.py 경로 확인 필요. Stage 2.10에서 보강.")

st.markdown("---")
st.markdown("### 주차별 인사이트 포커스")
st.markdown(
    """
    | 주차 | 부각 KPI |
    |---|---|
    | 1주차 (D~D+7) | 노쇼·신규 ("베타 X일째 노쇼 0 ⭐") |
    | 2주차 (D+8~D+14) | 이탈 위험 단골 ("이탈 위험 21명, 어제 -3") |
    | 3주차 (D+15~D+21) | 매출 기여 추정 ("누적 +180만") |
    | 4주차 (D+22~D+28) | commission 협상 ("4 모듈 합산 +220만") |
    """
)
