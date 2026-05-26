"""데이터 로더 — CSV (prototype) → 운영 시 Google Sheet 교체 지점.

베타 운영 시 load_customers·load_daily_kpi 함수만 gspread로 교체.
"""

from pathlib import Path
import streamlit as st
import pandas as pd

DATA = Path(__file__).resolve().parent.parent / "data"


@st.cache_data(ttl=300)
def load_daily_kpi() -> pd.DataFrame:
    """일별 KPI — sample-daily-data.csv (5일치 베타 가상 데이터)."""
    return pd.read_csv(DATA / "daily-kpi.csv", parse_dates=["날짜"])


@st.cache_data(ttl=300)
def load_customers() -> pd.DataFrame:
    """가상 회원 DB 66명."""
    return pd.read_csv(DATA / "customer-db.csv")
