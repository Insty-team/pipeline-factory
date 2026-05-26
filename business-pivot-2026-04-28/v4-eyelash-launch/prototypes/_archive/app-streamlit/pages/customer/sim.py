"""✨ AI 시뮬 — 셀카 → J·C·D컬 비교 (placeholder, Stage 1.2에서 구현)."""

import streamlit as st

st.title("✨ AI 시술 시뮬")
st.caption("셀카 한 장이면 J·C·D컬 비교 5초 안에 보여드려요 ♡")

st.markdown("---")

st.info("🚧 Stage 1.2에서 구현 예정 — GPT-image-1 inpainting")

st.markdown("### 미리보기 흐름")
st.markdown(
    """
    1. 셀카 1장 업로드 (정면, 자연광 권장)
    2. 시뮬 종류 선택 — 컬 비교 / 풍성도 / 메디핑크
    3. 5~10초 후 4분할 비교 카드 회신
    4. 마음에 드는 컬 → **예약하기** 1탭
    """
)

st.caption(
    "⚠️ AI 시뮬은 참고용이에요. 실제 결과는 손님 모질·뿌리 방향에 따라 차이 있을 수 있어요. "
    "방문 시 사장님이 1:1로 정확히 봐드려요!"
)
