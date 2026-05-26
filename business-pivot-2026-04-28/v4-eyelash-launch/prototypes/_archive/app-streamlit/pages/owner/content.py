"""📸 콘텐츠 — 사진 1장 → 인스타·블로그 자동 게시 (placeholder, Stage 1.3)."""

import streamlit as st

st.title("📸 콘텐츠 자동")
st.caption("사진 1장 + 시술명 → 인스타 캡션·블로그 long-form 5초 자동 생성·게시")

st.markdown("---")
st.info("🚧 Stage 1.3에서 구현 — Meta Graph API + 네이버 블로그 OpenAPI 자동 게시")

st.markdown("### 미리보기 흐름")
st.markdown(
    """
    1. 시술 사진 1장 업로드
    2. 시술명 1단어 입력 (예: "C컬 펌")
    3. 5초 후 인스타 캡션 + 블로그 long-form 700자 자동 생성
    4. 검수 (수정 옵션) → **게시** 1탭 → 인스타·블로그 동시 게시
    5. 워터마크 자동 합성 ("U're Line" 핑크)
    """
)

st.caption("사장님 노동: 6h/주 → 5분/주 (-99%)")
