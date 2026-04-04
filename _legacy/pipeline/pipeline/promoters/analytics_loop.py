"""
데이터 수집 → 분석 → 개선 제안 자동 루프
config/validation_targets.json 의 모든 가설을 순회하며 수집 + 분석.
AI 분석(ask)은 try/except로 감싸 — claude CLI 없어도 raw metrics 저장.
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

HISTORY_PATH = BASE_DIR / "data" / "promotions" / "bluesky_history.json"
ANALYTICS_DIR = BASE_DIR / "data" / "analytics"
TARGETS_PATH = BASE_DIR / "config" / "validation_targets.json"


def load_hypotheses() -> dict:
    """Load all hypotheses from validation_targets.json."""
    if not TARGETS_PATH.exists():
        return {}
    with open(TARGETS_PATH) as f:
        return json.load(f)


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


def collect_landing_data(hypothesis_id: str):
    """Supabase에서 특정 가설의 랜딩페이지 데이터 수집."""
    supabase_url = os.environ.get("SUPABASE_URL", "")
    supabase_key = os.environ.get("SUPABASE_ANON_KEY", "")
    if not supabase_url:
        return {"events": [], "waitlist": []}

    headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"}

    events = requests.get(
        f"{supabase_url}/rest/v1/events?hypothesis=eq.{hypothesis_id}&order=created_at.desc&limit=200",
        headers=headers, timeout=10
    ).json()

    waitlist = requests.get(
        f"{supabase_url}/rest/v1/waitlist?hypothesis=eq.{hypothesis_id}&order=created_at.desc&limit=50",
        headers=headers, timeout=10
    ).json()

    return {"events": events if isinstance(events, list) else [],
            "waitlist": waitlist if isinstance(waitlist, list) else []}


def compute_metrics(landing_data: dict) -> dict:
    """Raw metrics from collected data — no AI needed."""
    events = landing_data.get("events", [])
    waitlist = landing_data.get("waitlist", [])

    total_views = len([e for e in events if e.get("event") == "page_view"])
    total_signups = len(waitlist)
    conversion = total_signups / max(total_views, 1)

    referrers = {}
    step_events = {}
    scroll_depths = []

    for e in events:
        event = e.get("event", "")
        step_events[event] = step_events.get(event, 0) + 1

        if event == "page_view":
            meta = e.get("metadata", {})
            if isinstance(meta, str):
                try:
                    meta = json.loads(meta)
                except Exception:
                    meta = {}
            ref = meta.get("source", "direct")
            referrers[ref] = referrers.get(ref, 0) + 1

        if event == "scroll":
            meta = e.get("metadata", {})
            if isinstance(meta, str):
                try:
                    meta = json.loads(meta)
                except Exception:
                    meta = {}
            depth = meta.get("depth", 0)
            if depth:
                scroll_depths.append(int(depth))

    scroll_50_count = len([d for d in scroll_depths if d >= 50])
    scroll_50_rate = scroll_50_count / max(total_views, 1)

    return {
        "total_views": total_views,
        "total_signups": total_signups,
        "conversion_rate": round(conversion, 4),
        "scroll_50_rate": round(scroll_50_rate, 4),
        "referrers": referrers,
        "event_funnel": step_events,
    }


def analyze_with_ai(hypothesis_id: str, metrics: dict, bluesky_data: list) -> dict:
    """AI 분석 — claude CLI 없으면 skip하고 raw metrics만 반환."""
    try:
        from ai import ask
        import re

        bsky_summary = ""
        for p in bluesky_data[:5]:
            bsky_summary += f"  {p['likes']}L {p['replies']}R | {p['text'][:60]}\n"

        prompt = f"""다음 데이터를 분석하고 구체적 개선 액션 3개를 제안해줘.

=== {hypothesis_id} Analytics ===
Landing page views: {metrics['total_views']}
Waitlist signups: {metrics['total_signups']}
Conversion rate: {metrics['conversion_rate']*100:.1f}%
Scroll 50% rate: {metrics['scroll_50_rate']*100:.1f}%

Referrer breakdown:
{json.dumps(metrics['referrers'], indent=2)}

Event funnel:
{json.dumps(metrics['event_funnel'], indent=2)}

Bluesky posts (recent):
{bsky_summary}

JSON 형식으로:
{{"summary": "현황 한줄 요약", "metrics": {{"views": N, "signups": N, "conversion": "X%"}}, "top_channel": "가장 효과적 채널", "actions": ["액션1", "액션2", "액션3"], "content_suggestion": "다음 포스트 주제 제안"}}"""

        response = ask(prompt)
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except Exception as e:
        print(f"  AI analysis skipped: {e}")

    # Fallback: rule-based summary
    m = metrics
    conv_pct = f"{m['conversion_rate']*100:.1f}%"
    actions = []
    if m["total_views"] < 100:
        actions.append("트래픽 부족 — 홍보 채널 강화 필요")
    if m["conversion_rate"] < 0.10:
        actions.append("전환율 낮음 — 랜딩 메시지 또는 CTA 수정 검토")
    if m["scroll_50_rate"] < 0.35:
        actions.append("스크롤 깊이 낮음 — 히어로 섹션 개선 필요")
    if not actions:
        actions.append("현재 지표 양호 — 트래픽 확대 고려")

    top_channel = max(m["referrers"], key=m["referrers"].get) if m["referrers"] else "direct"

    return {
        "summary": f"views={m['total_views']}, signups={m['total_signups']}, conversion={conv_pct}",
        "metrics": {"views": m["total_views"], "signups": m["total_signups"], "conversion": conv_pct},
        "top_channel": top_channel,
        "actions": actions,
        "content_suggestion": "빌드인퍼블릭 업데이트 포스트",
        "ai_analysis": False,
    }


def save_report(hypothesis_id: str, bluesky_data: list, landing_data: dict,
                metrics: dict, analysis: dict) -> Path:
    """Per-hypothesis 일간 리포트 저장."""
    hyp_dir = ANALYTICS_DIR / hypothesis_id
    hyp_dir.mkdir(parents=True, exist_ok=True)
    date_str = datetime.now().strftime("%Y%m%d")

    report = {
        "date": datetime.now().isoformat(),
        "hypothesis_id": hypothesis_id,
        "bluesky": bluesky_data[:10],
        "landing": metrics,
        "analysis": analysis,
    }

    path = hyp_dir / f"report_{date_str}.json"
    with open(path, "w") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    return path


def run_for_hypothesis(hypothesis_id: str, bluesky_data: list) -> dict:
    print(f"  [{hypothesis_id}] Collecting landing data...")
    landing_data = collect_landing_data(hypothesis_id)
    metrics = compute_metrics(landing_data)

    print(f"  [{hypothesis_id}] Analyzing...")
    analysis = analyze_with_ai(hypothesis_id, metrics, bluesky_data)

    path = save_report(hypothesis_id, bluesky_data, landing_data, metrics, analysis)

    print(f"  [{hypothesis_id}] views={metrics['total_views']} "
          f"signups={metrics['total_signups']} "
          f"conversion={metrics['conversion_rate']*100:.1f}%")
    print(f"  [{hypothesis_id}] Report: {path}")
    return analysis


def run():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] Analytics loop running...")

    hypotheses = load_hypotheses()
    if not hypotheses:
        print("  No hypotheses found in validation_targets.json")
        return {}

    print(f"  Collecting Bluesky data...")
    bluesky_data = collect_bluesky_data()

    results = {}
    for hyp_id in hypotheses:
        results[hyp_id] = run_for_hypothesis(hyp_id, bluesky_data)

    print(f"\n  Done. Processed {len(results)} hypothesis/hypotheses.")
    return results


if __name__ == "__main__":
    run()
