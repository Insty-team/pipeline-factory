"""
매일 콘텐츠 자동 생성 + Bluesky 자동 포스팅 + 나머지 채널 초안 저장.
validation_targets.json 의 active 가설을 라운드로빈으로 순환.
AI 생성(ask) 불가 시 템플릿 기반 폴백으로 자동 전환.
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

CALENDAR_PATH = BASE_DIR / "config" / "content_calendar.json"
DRAFTS_DIR = BASE_DIR / "data" / "daily_drafts"
HISTORY_PATH = BASE_DIR / "data" / "promotions" / "bluesky_history.json"
TARGETS_PATH = BASE_DIR / "config" / "validation_targets.json"
ROTATION_PATH = BASE_DIR / "data" / "promotions" / "rotation_state.json"


# ---------------------------------------------------------------------------
# Hypothesis rotation
# ---------------------------------------------------------------------------

def load_hypotheses() -> dict:
    if not TARGETS_PATH.exists():
        return {}
    with open(TARGETS_PATH) as f:
        return json.load(f)


def pick_hypothesis(hypotheses: dict) -> tuple[str, dict]:
    """Round-robin: pick today's hypothesis based on day-of-year mod count."""
    ids = sorted(hypotheses.keys())
    if not ids:
        return "", {}
    day_of_year = datetime.now().timetuple().tm_yday
    idx = day_of_year % len(ids)
    hyp_id = ids[idx]
    return hyp_id, hypotheses[hyp_id]


# ---------------------------------------------------------------------------
# Data helpers
# ---------------------------------------------------------------------------

def load_calendar() -> dict:
    if not CALENDAR_PATH.exists():
        return {"daily_schedule": {}, "persona": "indie hacker", "platform_rules": {}}
    with open(CALENDAR_PATH) as f:
        return json.load(f)


def get_today_theme(calendar: dict) -> dict:
    day = datetime.now().strftime("%A").lower()
    if day in ("saturday", "sunday"):
        return calendar.get("daily_schedule", {}).get("weekend", {})
    return calendar.get("daily_schedule", {}).get(day, {})


def get_recent_metrics(hypothesis_id: str) -> dict:
    metrics = {"bluesky_posts": [], "landing_events": []}

    try:
        with open(HISTORY_PATH) as f:
            metrics["bluesky_posts"] = json.load(f)
    except Exception:
        pass

    try:
        supabase_url = os.environ.get("SUPABASE_URL", "")
        supabase_key = os.environ.get("SUPABASE_ANON_KEY", "")
        if supabase_url:
            resp = requests.get(
                f"{supabase_url}/rest/v1/events?hypothesis=eq.{hypothesis_id}"
                f"&order=created_at.desc&limit=50",
                headers={"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"},
                timeout=10
            )
            if resp.status_code == 200:
                metrics["landing_events"] = resp.json()
    except Exception:
        pass

    return metrics


# ---------------------------------------------------------------------------
# Content generation
# ---------------------------------------------------------------------------

def _template_content(hypothesis_id: str, hyp_config: dict, theme: dict,
                       landing_views: int, landing_signups: int) -> dict:
    """Simple template fallback — no AI needed."""
    title = hyp_config.get("title", hypothesis_id)
    live_url = hyp_config.get("live_url", "")
    theme_name = theme.get("theme", "general update")
    date_str = datetime.now().strftime("%b %d")

    bluesky = (
        f"[{date_str}] Building in public: {hypothesis_id}\n"
        f"Theme: {theme_name}\n"
        f"Views: {landing_views} | Signups: {landing_signups}\n"
        f"{live_url + '?ref=bluesky' if live_url else ''}"
    ).strip()

    threads = (
        f"Day {datetime.now().timetuple().tm_yday} of building {title[:40]}.\n\n"
        f"Stats so far: {landing_views} page views, {landing_signups} waitlist signups.\n\n"
        f"Today's focus: {theme_name}.\n\n"
        f"What's the hardest part of validating a side-hustle idea for you?"
    )

    linkedin = (
        f"Building in public update — {date_str}\n\n"
        f"Hypothesis: {hypothesis_id}\n"
        f"{title[:80]}\n\n"
        f"Current metrics:\n"
        f"- Page views: {landing_views}\n"
        f"- Waitlist signups: {landing_signups}\n"
        f"- Conversion: {landing_signups / max(landing_views, 1) * 100:.1f}%\n\n"
        f"Today's theme: {theme_name}\n\n"
        f"What validation metrics do you track for early-stage products?"
    )

    twitter = (
        f"Day {datetime.now().timetuple().tm_yday}: {hypothesis_id} update\n"
        f"{landing_views} views → {landing_signups} signups "
        f"({landing_signups / max(landing_views, 1) * 100:.1f}% CVR)\n"
        f"Building in public. {live_url + '?ref=twitter' if live_url else ''}"
    ).strip()

    return {"bluesky": bluesky, "threads": threads, "linkedin": linkedin, "twitter": twitter}


def generate_content(hypothesis_id: str, hyp_config: dict, theme: dict,
                     calendar: dict, metrics: dict) -> dict:
    """Try AI generation; fall back to template if unavailable."""
    landing_views = len([e for e in metrics["landing_events"] if e.get("event") == "page_view"])
    landing_signups = len([e for e in metrics["landing_events"] if e.get("event") == "waitlist_signup"])

    try:
        from ai import ask
        import re

        rules = calendar.get("platform_rules", {})
        persona = calendar.get("persona", "indie hacker building in public")

        metrics_summary = ""
        for p in metrics["bluesky_posts"][-3:]:
            eng = p.get("engagement", {})
            metrics_summary += f"- {eng.get('likes',0)}L {eng.get('replies',0)}R: {p.get('text','')[:50]}...\n"

        live_url = hyp_config.get("live_url", "")
        title = hyp_config.get("title", hypothesis_id)

        prompt = f"""당신은 "{persona}" 페르소나로 SNS에 글을 씁니다.

오늘 테마: {theme.get('theme', 'general update')}
현재 실험: {hypothesis_id} — {title[:60]}
랜딩: {live_url}
현재 숫자: page_views={landing_views}, signups={landing_signups}

최근 포스트 반응:
{metrics_summary if metrics_summary else '아직 데이터 없음'}

아래 4개 채널용 콘텐츠를 JSON으로 생성해줘:

1. bluesky: 300자 이내. 짧고 솔직한 빌드 로그. 링크 포함 가능.
2. threads: 500자 이내. 대화체. 질문형으로 끝내기. 링크는 넣지 말 것.
3. linkedin: 1500자 이내. 구조적. 질문으로 마무리. 링크 넣지 말 것.
4. twitter: 280자 이내. 펀치있게. 숫자 포함.

규칙:
- "passive income", "make money while you sleep" 절대 금지
- 자연스러운 빌드인퍼블릭 톤
- 실제 숫자 포함 (0이면 0이라고)

JSON 형식:
{{"bluesky": "...", "threads": "...", "linkedin": "...", "twitter": "..."}}"""

        response = ask(prompt)
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())

    except Exception as e:
        print(f"  AI content generation skipped: {e}")

    # Fallback
    print("  Using template-based content fallback.")
    return _template_content(hypothesis_id, hyp_config, theme, landing_views, landing_signups)


# ---------------------------------------------------------------------------
# Bluesky posting
# ---------------------------------------------------------------------------

def post_to_bluesky(text: str, live_url: str = "") -> str:
    handle = os.environ.get("BLUESKY_HANDLE")
    password = os.environ.get("BLUESKY_PASSWORD")
    if not handle or not password:
        return None

    resp = requests.post("https://bsky.social/xrpc/com.atproto.server.createSession",
        json={"identifier": handle, "password": password})
    if resp.status_code != 200:
        return None
    s = resp.json()

    # Build facets for URL if present in text
    facets = []
    if live_url:
        target_url = live_url + "?ref=bluesky"
        text_bytes = text.encode("utf-8")
        # Try matching: full URL with ref, full URL without ref, or domain only
        import re
        domain = live_url.replace("https://", "").replace("http://", "").rstrip("/")
        for pattern in [live_url + "?ref=bluesky", live_url, domain]:
            pat_bytes = pattern.encode("utf-8")
            idx = text_bytes.find(pat_bytes)
            if idx >= 0:
                facets.append({
                    "index": {"byteStart": idx, "byteEnd": idx + len(pat_bytes)},
                    "features": [{"$type": "app.bsky.richtext.facet#link", "uri": target_url}]
                })
                break

    record = {
        "$type": "app.bsky.feed.post",
        "text": text,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    if facets:
        record["facets"] = facets

    resp = requests.post("https://bsky.social/xrpc/com.atproto.repo.createRecord",
        headers={"Authorization": "Bearer " + s["accessJwt"]},
        json={"repo": s["did"], "collection": "app.bsky.feed.post", "record": record})

    if resp.status_code == 200:
        return resp.json().get("uri", "")
    return None


def save_drafts(hypothesis_id: str, content: dict, theme: dict) -> Path:
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    date_str = datetime.now().strftime("%Y%m%d")

    draft = {
        "date": datetime.now().isoformat(),
        "hypothesis_id": hypothesis_id,
        "theme": theme.get("theme", ""),
        "content": content,
        "status": {
            "bluesky": "posted",
            "threads": "draft — copy and post manually",
            "linkedin": "draft — copy and post manually",
            "twitter": "draft — post when API available",
        }
    }

    path = DRAFTS_DIR / f"draft_{hypothesis_id}_{date_str}.json"
    with open(path, "w") as f:
        json.dump(draft, f, ensure_ascii=False, indent=2)

    # Save to Supabase for dashboard access
    try:
        sb_url = os.environ.get("SUPABASE_URL", "")
        sb_key = os.environ.get("SUPABASE_ANON_KEY", "")
        if sb_url and sb_key:
            requests.post(
                f"{sb_url}/rest/v1/events",
                headers={"apikey": sb_key, "Authorization": f"Bearer {sb_key}", "Content-Type": "application/json", "Prefer": "return=minimal"},
                json={"hypothesis": "daily-content", "event": "draft", "metadata": json.dumps(draft, ensure_ascii=False)},
                timeout=10
            )
    except Exception:
        pass

    return path


def update_history(uri: str, text: str, hypothesis_id: str):
    try:
        with open(HISTORY_PATH) as f:
            history = json.load(f)
    except Exception:
        history = []

    history.append({
        "date": datetime.now(timezone.utc).isoformat(),
        "uri": uri,
        "text": text[:100],
        "hypothesis_id": hypothesis_id,
        "type": "daily_auto",
        "engagement": {},
    })

    with open(HISTORY_PATH, "w") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def run():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] Daily content generation")

    hypotheses = load_hypotheses()
    if not hypotheses:
        print("  No hypotheses in validation_targets.json — nothing to post")
        return None

    hyp_id, hyp_config = pick_hypothesis(hypotheses)
    print(f"  Today's hypothesis: {hyp_id} (round-robin, {len(hypotheses)} total)")

    calendar = load_calendar()
    theme = get_today_theme(calendar)
    metrics = get_recent_metrics(hyp_id)

    landing_views = len([e for e in metrics["landing_events"] if e.get("event") == "page_view"])
    print(f"  Theme: {theme.get('theme', 'general')}")
    print(f"  Landing views: {landing_views}")

    print("  Generating content...")
    content = generate_content(hyp_id, hyp_config, theme, calendar, metrics)

    if not content:
        print("  ERROR: Content generation failed")
        return None

    live_url = hyp_config.get("live_url", "")

    print("  Posting to Bluesky...")
    bsky_text = content.get("bluesky", "")
    if bsky_text and len(bsky_text) > 300:
        # Trim to 300 graphemes: cut at last newline or space before limit
        trimmed = bsky_text[:297]
        cut = max(trimmed.rfind("\n"), trimmed.rfind(" "))
        if cut > 200:
            bsky_text = bsky_text[:cut] + "..."
        else:
            bsky_text = trimmed + "..."
        print(f"  Trimmed to {len(bsky_text)} chars (was {len(content.get("bluesky", ""))})")
    if bsky_text:
        uri = post_to_bluesky(bsky_text, live_url)
        if uri:
            print(f"  Bluesky posted: {uri}")
            update_history(uri, bsky_text, hyp_id)
        else:
            print("  Bluesky post failed (credentials missing or API error)")

    path = save_drafts(hyp_id, content, theme)
    print(f"  Drafts saved: {path}")

    print("\n  === THREADS (copy & paste) ===")
    print(f"  {content.get('threads', 'N/A')}")
    print("\n  === LINKEDIN (copy & paste) ===")
    print(f"  {content.get('linkedin', 'N/A')[:200]}...")
    print("\n  === TWITTER ===")
    print(f"  {content.get('twitter', 'N/A')}")

    return content


if __name__ == "__main__":
    run()
