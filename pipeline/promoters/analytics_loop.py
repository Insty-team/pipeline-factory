"""
데이터 수집 → 분석 → 개선 제안 자동 루프
모든 채널 데이터를 수집하고, AI가 분석해서 다음 액션을 제안
"""
import json
import os
import requests
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.parent
load_dotenv(BASE_DIR / ".env")

import sys
sys.path.insert(0, str(BASE_DIR))
from ai import ask

HISTORY_PATH = BASE_DIR / "data" / "promotions" / "bluesky_history.json"
ANALYTICS_DIR = BASE_DIR / "data" / "analytics"
DRAFTS_DIR = BASE_DIR / "data" / "daily_drafts"


def collect_bluesky_data():
    """Bluesky 엔게이지먼트 수집"""
    handle = os.environ.get("BLUESKY_HANDLE")
    password = os.environ.get("BLUESKY_PASSWORD")
    if not handle:
        return []
    
    resp = requests.post("https://bsky.social/xrpc/com.atproto.server.createSession",
        json={"identifier": handle, "password": password})
    if resp.status_code != 200:
        return []
    s = resp.json()
    
    resp = requests.get("https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed",
        headers={"Authorization": "Bearer " + s["accessJwt"]},
        params={"actor": s["did"], "limit": 20})
    
    posts = []
    for item in resp.json().get("feed", []):
        post = item.get("post", {})
        posts.append({
            "platform": "bluesky",
            "text": post.get("record", {}).get("text", "")[:100],
            "created_at": post.get("record", {}).get("createdAt", ""),
            "likes": post.get("likeCount", 0),
            "replies": post.get("replyCount", 0),
            "reposts": post.get("repostCount", 0),
        })
    return posts


def collect_landing_data():
    """Supabase에서 랜딩페이지 데이터 수집"""
    supabase_url = os.environ.get("SUPABASE_URL", "")
    supabase_key = os.environ.get("SUPABASE_ANON_KEY", "")
    if not supabase_url:
        return {"events": [], "waitlist": []}
    
    headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"}
    
    events = requests.get(
        f"{supabase_url}/rest/v1/events?hypothesis=eq.H-007-v3&order=created_at.desc&limit=200",
        headers=headers, timeout=10
    ).json() if supabase_url else []
    
    waitlist = requests.get(
        f"{supabase_url}/rest/v1/waitlist?hypothesis=eq.H-007-v3&order=created_at.desc&limit=50",
        headers=headers, timeout=10
    ).json() if supabase_url else []
    
    # GEO blog data too
    geo_events = requests.get(
        f"{supabase_url}/rest/v1/events?hypothesis=eq.H-007-v3-geo&order=created_at.desc&limit=100",
        headers=headers, timeout=10
    ).json() if supabase_url else []
    
    return {"events": events, "waitlist": waitlist, "geo_events": geo_events}


def analyze_and_suggest(bluesky_data, landing_data):
    """AI가 데이터 분석 + 다음 액션 제안"""
    # Summarize data
    total_views = len([e for e in landing_data["events"] if e.get("event") == "page_view"])
    total_signups = len(landing_data["waitlist"])
    geo_views = len([e for e in landing_data["geo_events"] if e.get("event") == "page_view"])
    
    # Referrer breakdown
    referrers = {}
    for e in landing_data["events"]:
        if e.get("event") == "page_view":
            meta = e.get("metadata", {})
            if isinstance(meta, str):
                try:
                    meta = json.loads(meta)
                except:
                    meta = {}
            ref = meta.get("source", "direct")
            referrers[ref] = referrers.get(ref, 0) + 1
    
    # Bluesky summary
    bsky_summary = ""
    for p in bluesky_data[:5]:
        bsky_summary += f"  {p['likes']}L {p['replies']}R | {p['text'][:60]}\n"
    
    # Conversion funnel
    step_events = {}
    for e in landing_data["events"]:
        event = e.get("event", "")
        step_events[event] = step_events.get(event, 0) + 1
    
    data_summary = f"""
=== H-007-v3 Analytics ===
Landing page views: {total_views}
Waitlist signups: {total_signups}
Conversion rate: {total_signups/max(total_views,1)*100:.1f}%
GEO blog views: {geo_views}

Referrer breakdown:
{json.dumps(referrers, indent=2)}

Event funnel:
{json.dumps(step_events, indent=2)}

Bluesky posts (recent):
{bsky_summary}
"""
    
    prompt = f"""다음 데이터를 분석하고 구체적 개선 액션 3개를 제안해줘.

{data_summary}

분석 관점:
1. 트래픽 충분한가? 부족하면 어떤 채널을 강화?
2. 전환율(방문→가입)은 괜찮은가? 낮으면 랜딩 어디를 수정?
3. 어떤 콘텐츠가 반응이 좋았고, 다음에 뭘 써야 하나?
4. GEO 블로그가 트래픽을 만들고 있나?
5. 어떤 referrer에서 가장 많이 오는가?

JSON 형식으로:
{{"summary": "현황 한줄 요약", "metrics": {{"views": N, "signups": N, "conversion": "X%"}}, "top_channel": "가장 효과적 채널", "actions": ["액션1", "액션2", "액션3"], "content_suggestion": "다음 포스트 주제 제안"}}"""

    response = ask(prompt)
    
    import re
    json_match = re.search(r'\{.*\}', response, re.DOTALL)
    if json_match:
        return json.loads(json_match.group())
    return {"summary": "분석 실패", "actions": ["수동 확인 필요"]}


def save_report(bluesky_data, landing_data, analysis):
    """일간 리포트 저장"""
    ANALYTICS_DIR.mkdir(parents=True, exist_ok=True)
    date_str = datetime.now().strftime("%Y%m%d")
    
    report = {
        "date": datetime.now().isoformat(),
        "bluesky": bluesky_data[:10],
        "landing": {
            "total_views": len([e for e in landing_data["events"] if e.get("event") == "page_view"]),
            "total_signups": len(landing_data["waitlist"]),
            "geo_views": len([e for e in landing_data["geo_events"] if e.get("event") == "page_view"]),
        },
        "analysis": analysis,
    }
    
    path = ANALYTICS_DIR / f"report_{date_str}.json"
    with open(path, "w") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    return path


def run():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] Analytics loop running...")
    
    print("  Collecting Bluesky data...")
    bluesky_data = collect_bluesky_data()
    
    print("  Collecting landing data...")
    landing_data = collect_landing_data()
    
    print("  Analyzing with AI...")
    analysis = analyze_and_suggest(bluesky_data, landing_data)
    
    path = save_report(bluesky_data, landing_data, analysis)
    
    print(f"\n  === DAILY REPORT ===")
    print(f"  {analysis.get('summary', 'N/A')}")
    print(f"  Views: {analysis.get('metrics', {}).get('views', 'N/A')}")
    print(f"  Signups: {analysis.get('metrics', {}).get('signups', 'N/A')}")
    print(f"  Conversion: {analysis.get('metrics', {}).get('conversion', 'N/A')}")
    print(f"  Top channel: {analysis.get('top_channel', 'N/A')}")
    print(f"\n  Actions:")
    for i, action in enumerate(analysis.get("actions", []), 1):
        print(f"    {i}. {action}")
    print(f"\n  Next content: {analysis.get('content_suggestion', 'N/A')}")
    print(f"  Report saved: {path}")
    
    return analysis


if __name__ == "__main__":
    run()
