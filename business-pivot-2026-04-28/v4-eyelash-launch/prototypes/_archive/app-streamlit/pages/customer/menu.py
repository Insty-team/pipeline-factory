"""🎨 메뉴·디자인 — 카드뉴스 16장 슬라이드 (placeholder, Stage 1.4에서 HTML)."""

import streamlit as st
from pathlib import Path

st.title("🎨 메뉴·디자인")
st.caption("가격표 5장 + 컬·디자인 비교 6장 + 메디핑크 캠페인 5장 = 16장")

st.markdown("---")
st.info("🚧 Stage 1.4에서 HTML 슬라이드 presentation 추가 예정")

# 카드뉴스 16장 그리드 미리보기
CARDS = Path(__file__).resolve().parent.parent.parent.parent / "modules/cards/images"

st.markdown("### 세트 1 — 가격표 5장")
imgs = sorted(CARDS.glob("1*.png"))
cols = st.columns(3)
for i, img in enumerate(imgs):
    cols[i % 3].image(str(img), use_container_width=True)

st.markdown("### 세트 2 — 컬·디자인 비교 6장")
imgs = sorted(CARDS.glob("2*.png"))
cols = st.columns(3)
for i, img in enumerate(imgs):
    cols[i % 3].image(str(img), use_container_width=True)

st.markdown("### 세트 3 — 메디핑크 캠페인 5장")
imgs = sorted(CARDS.glob("3*.png"))
cols = st.columns(3)
for i, img in enumerate(imgs):
    cols[i % 3].image(str(img), use_container_width=True)
