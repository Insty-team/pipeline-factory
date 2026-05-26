"""유어라인 데모 앱 — Streamlit multipage entry point.

데모 시연 시 단일 URL로 손님·사장 view 모두 시연 가능.
손님: AI 시뮬·챗봇·예약·쿠폰·메뉴
사장: 대시보드·받은요청·콘텐츠·알림톡·답글·일간1줄

실행: streamlit run main.py --server.address 0.0.0.0
"""

import streamlit as st
from pathlib import Path
import sys

# shared/ 모듈 import 가능하게
sys.path.insert(0, str(Path(__file__).resolve().parent))

from shared.style import apply_pink_theme

# 페이지 설정 (모바일 친화)
st.set_page_config(
    page_title="유어라인",
    page_icon="💕",
    layout="centered",
    initial_sidebar_state="expanded",
)

# 핑크 톤 CSS
apply_pink_theme()

# ───────── 페이지 정의 ─────────
home = st.Page("pages/home.py", title="홈", icon="🏠", default=True)

# 손님 페이지 5종
sim = st.Page("pages/customer/sim.py", title="AI 시뮬", icon="✨")
chatbot = st.Page("pages/customer/chatbot.py", title="챗봇", icon="💬")
reserve = st.Page("pages/customer/reserve.py", title="예약하기", icon="📅")
coupon = st.Page("pages/customer/coupon.py", title="쿠폰", icon="🎁")
menu = st.Page("pages/customer/menu.py", title="메뉴·디자인", icon="🎨")

# 사장 페이지 6종
dashboard = st.Page("pages/owner/dashboard.py", title="대시보드", icon="📊")
inbox = st.Page("pages/owner/inbox.py", title="받은 요청", icon="📥")
content = st.Page("pages/owner/content.py", title="콘텐츠", icon="📸")
alimtok = st.Page("pages/owner/alimtok.py", title="알림톡", icon="📢")
reply = st.Page("pages/owner/reply.py", title="답글 자동", icon="💌")
daily = st.Page("pages/owner/daily.py", title="일간 1줄", icon="📅")

# 그룹화 — 손님·사장 분리
pg = st.navigation(
    {
        "": [home],
        "👩 손님": [sim, chatbot, reserve, coupon, menu],
        "💼 사장": [dashboard, inbox, content, alimtok, reply, daily],
    }
)

pg.run()
