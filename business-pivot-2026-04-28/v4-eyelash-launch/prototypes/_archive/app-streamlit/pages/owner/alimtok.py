"""📢 알림톡 매트릭스 — 12종 자동 발송 + 테스트 발송 (placeholder, Stage 2.8)."""

import streamlit as st
import pandas as pd

st.title("📢 알림톡 매트릭스")
st.caption("12종 자동 발송 + 사장 본인 폰 테스트")

st.markdown("---")
st.info("🚧 Stage 2.8에서 구현 — 알리고 API 연결 + 테스트 발송 버튼")

st.markdown("### 12종 자동 발송 매트릭스")
df = pd.DataFrame(
    {
        "트리거": [
            "예약 완료", "방문 D-1", "방문 D-Day", "시술 D+1",
            "시술 D+28", "노쇼", "변경 요청", "휴무 D-7",
            "메디핑크 추천 (주 1)", "영양제 D+42", "이탈 단골 (주 1)", "단골 환영",
        ],
        "템플릿": ["A1", "A2", "A3", "A4", "A5", "C1", "C2", "C3", "D1", "D2", "D3", "B"],
        "채널": ["알림톡", "알림톡", "알림톡", "알림톡", "친구톡", "알림톡",
                "알림톡", "알림톡", "친구톡", "친구톡", "친구톡", "알림톡"],
        "발송 시점": ["즉시", "18:00", "09:00", "11:00", "11:00", "19:00",
                  "즉시", "사전", "수 14:00", "11:00", "월 09:00", "즉시"],
    }
)
st.dataframe(df, hide_index=True, use_container_width=True)

st.markdown("---")
st.markdown("### 🧪 테스트 발송")
st.button("내 폰으로 친구톡 보내기 (데모용)", disabled=True)
st.caption("Stage 2.8에서 알리고 API 연결 시 활성화")
