"""유어라인 핑크 톤 — 사장 워터마크 #E89BAE 기반."""

import streamlit as st


def apply_pink_theme():
    """전체 앱에 핑크 톤 CSS 적용 — 모바일·데스크탑 호환."""
    st.markdown(
        """
        <style>
            .stApp { background-color: #FFF8FA; }

            /* Metric — 흰 카드 + 핑크 그림자 */
            [data-testid="stMetric"] {
                background-color: white;
                padding: 14px;
                border-radius: 14px;
                box-shadow: 0 1px 4px rgba(232, 155, 174, 0.18);
            }
            [data-testid="stMetricLabel"] {
                color: #6B5544;
                font-size: 0.85rem;
            }
            [data-testid="stMetricValue"] {
                color: #5A4A4A;
                font-weight: 700;
            }

            /* 헤딩 핑크 */
            h1, h2, h3 { color: #B85A75; }

            /* 사이드바 */
            [data-testid="stSidebar"] {
                background-color: #FFF0F2;
            }

            /* 버튼 */
            .stButton > button {
                background-color: #E89BAE;
                color: white;
                border: none;
                border-radius: 12px;
                padding: 10px 24px;
                font-weight: 600;
            }
            .stButton > button:hover {
                background-color: #B85A75;
                color: white;
            }

            /* Alert */
            .stAlert { border-radius: 12px; }
        </style>
        """,
        unsafe_allow_html=True,
    )
