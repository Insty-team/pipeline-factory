"""💌 답글 자동 — 신규 후기 감지 + 답글 시안 (placeholder, Stage 2.9)."""

import streamlit as st

st.title("💌 답글 자동")
st.caption("신규 후기 감지 → 사장님 톤 답글 시안 → 1탭 게시")

st.markdown("---")
st.info("🚧 Stage 2.9에서 구현 — Apify Naver scraper + LLM 시안 생성")

st.markdown("### 흐름")
st.markdown(
    """
    1. **신규 후기 감지** — Apify Naver Place Reviews scraper (매시간)
    2. **답글 시안 생성** — Claude Haiku 4.5 + 사장님 톤 프롬프트 v3
    3. **카톡 미리보기** — "이거 게시할까요?" 시안 전송
    4. **사장님 1탭 게시** — 네이버 플레이스 비즈니스 계정에서 직접
    5. **백필 10건 일회성** — 25-09 ~ 26-04 누락 후기 일괄 작성 (이미 완료)
    """
)

st.markdown("### 백필 10건 미리보기")
st.markdown("`prototypes/modules/reply/reviews-replies.md` 참고")
