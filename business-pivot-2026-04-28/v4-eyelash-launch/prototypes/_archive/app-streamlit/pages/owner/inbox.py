"""📥 받은 요청 — 예약·시뮬·답글 시안·챗봇 escalate (placeholder, Stage 2.7)."""

import streamlit as st

st.title("📥 받은 요청")
st.caption("손님 예약·시뮬·답글 시안·챗봇 escalate 모두 한 곳에")

st.markdown("---")
st.info("🚧 Stage 2.7에서 구현 — 손님 View의 예약·시뮬 트리거가 여기로 누적")

st.markdown("### 받을 항목 4종")
st.markdown(
    """
    - 📅 **신규 예약** — 손님이 앱에서 예약 시 즉시 알림
    - ✨ **AI 시뮬 결과** — 손님이 시뮬한 셀카·결과 로그
    - 💌 **답글 시안** — 신규 후기 감지 시 답글 자동 생성 → 1탭 게시
    - ⚠️ **챗봇 escalate** — 환불·알러지·임산부 키워드 시 사장 직접 응대 요청
    """
)
