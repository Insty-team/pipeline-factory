"""
매일 콘텐츠 자동 생성 + Bluesky 자동 포스팅 + 나머지 채널 초안 저장
content_calendar.json 기반으로 요일별 테마에 맞는 콘텐츠 생성
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

CALENDAR_PATH = BASE_DIR / "config" / "content_calendar.json"
DRAFTS_DIR = BASE_DIR / "data" / "daily_drafts"
HISTORY_PATH = BASE_DIR / "data" / "promotions" / "bluesky_history.json"


def load_calendar():
    with open(CALENDAR_PATH) as f:
        return json.load(f)


def get_today_theme(calendar):
    day = datetime.now().strftime("%A").lower()
    if day in ("saturday", "sunday"):
        return calendar["daily_schedule"].get("weekend", {})
    return calendar["daily_schedule"].get(day, {})


def get_recent_metrics():
    """Bluesky + Supabase에서 최근 데이터 수집"""
    metrics = {"bluesky_posts": [], "landing_events": []}
    
    # Bluesky engagement
    try:
        with open(HISTORY_PATH) as f:
            metrics["bluesky_posts"] = json.load(f)
    except:
        pass
    
    # Supabase landing metrics
    try:
        supabase_url = os.environ.get("SUPABASE_URL", "")
        supabase_key = os.environ.get("SUPABASE_ANON_KEY", "")
        if supabase_url:
            resp = requests.get(
                f"{supabase_url}/rest/v1/events?hypothesis=eq.H-007-v3&order=created_at.desc&limit=50",
                headers={"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"},
                timeout=10
            )
            if resp.status_code == 200:
                metrics["landing_events"] = resp.json()
    except:
        pass
    
    return metrics


def generate_content(theme, calendar, metrics):
    """AI로 오늘 콘텐츠 생성"""
    rules = calendar["platform_rules"]
    persona = calendar["persona"]
    
    metrics_summary = ""
    if metrics["bluesky_posts"]:
        for p in metrics["bluesky_posts"][-3:]:
            eng = p.get("engagement", {})
            metrics_summary += f"- {eng.get('likes',0)}L {eng.get('replies',0)}R: {p.get('text','')[:50]}...\n"
    
    landing_views = len([e for e in metrics["landing_events"] if e.get("event") == "page_view"])
    landing_signups = len([e for e in metrics["landing_events"] if e.get("event") == "waitlist_signup"])
    
    prompt = f"""당신은 "{persona}" 페르소나로 SNS에 글을 씁니다.

오늘 테마: {theme.get('theme', 'general update')}
현재 실험: SideKick AI — AI가 관심 분야에서 부업 기회를 찾고 실행을 도와주는 코파일럿
랜딩: sleepnfind.pages.dev
현재 숫자: page_views={landing_views}, signups={landing_signups}

최근 포스트 반응:
{metrics_summary if metrics_summary else '아직 데이터 없음'}

아래 4개 채널용 콘텐츠를 JSON으로 생성해줘:

1. bluesky: 300자 이내. 짧고 솔직한 빌드 로그. 링크 포함 가능.
2. threads: 500자 이내. 대화체. 질문형으로 끝내기. 링크는 넣지 말 것 (댓글에 넣을 거임).
3. linkedin: 1500자 이내. 구조적. 질문으로 마무리. 링크 넣지 말 것 (댓글에 달라고 유도).
4. twitter: 280자 이내. 펀치있게. 숫자 포함.

규칙:
- "passive income", "make money while you sleep" 절대 금지
- 자연스러운 빌드인퍼블릭 톤. 광고 아님.
- 실제 숫자 포함 (0이면 0이라고)
- 각 플랫폼 문화에 맞게

JSON 형식:
{{"bluesky": "...", "threads": "...", "linkedin": "...", "twitter": "..."}}"""

    response = ask(prompt)
    
    # Parse JSON from response
    import re
    json_match = re.search(r'\{.*\}', response, re.DOTALL)
    if json_match:
        return json.loads(json_match.group())
    return None


def post_to_bluesky(text):
    """Bluesky에 자동 포스팅 (링크 facet 포함)"""
    handle = os.environ.get("BLUESKY_HANDLE")
    password = os.environ.get("BLUESKY_PASSWORD")
    if not handle or not password:
        return None
    
    # Login
    resp = requests.post("https://bsky.social/xrpc/com.atproto.server.createSession",
        json={"identifier": handle, "password": password})
    if resp.status_code != 200:
        return None
    s = resp.json()
    
    # Build facets for URL
    url = "https://sleepnfind.pages.dev?ref=bluesky"
    facets = []
    text_bytes = text.encode("utf-8")
    url_bytes = url.encode("utf-8")
    url_start = text_bytes.find(url_bytes)
    if url_start >= 0:
        facets.append({
            "index": {"byteStart": url_start, "byteEnd": url_start + len(url_bytes)},
            "features": [{"$type": "app.bsky.richtext.facet#link", "uri": url}]
        })
    
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


def save_drafts(content, theme):
    """나머지 채널 초안 저장"""
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    date_str = datetime.now().strftime("%Y%m%d")
    
    draft = {
        "date": datetime.now().isoformat(),
        "theme": theme.get("theme", ""),
        "content": content,
        "status": {
            "bluesky": "posted",
            "threads": "draft — copy and post manually",
            "linkedin": "draft — copy and post manually",
            "twitter": "draft — post when API available"
        }
    }
    
    path = DRAFTS_DIR / f"draft_{date_str}.json"
    with open(path, "w") as f:
        json.dump(draft, f, ensure_ascii=False, indent=2)
    return path


def update_history(uri, text):
    """Bluesky history 업데이트"""
    try:
        with open(HISTORY_PATH) as f:
            history = json.load(f)
    except:
        history = []
    
    history.append({
        "date": datetime.now(timezone.utc).isoformat(),
        "uri": uri,
        "text": text[:100],
        "type": "daily_auto",
        "engagement": {}
    })
    
    with open(HISTORY_PATH, "w") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


def run():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] Daily content generation")
    
    calendar = load_calendar()
    theme = get_today_theme(calendar)
    metrics = get_recent_metrics()
    
    print(f"  Theme: {theme.get('theme', 'general')}")
    print(f"  Landing views: {len([e for e in metrics['landing_events'] if e.get('event') == 'page_view'])}")
    
    # Generate content
    print("  Generating content via AI...")
    content = generate_content(theme, calendar, metrics)
    
    if not content:
        print("  ERROR: Content generation failed")
        return
    
    # Post to Bluesky automatically
    print("  Posting to Bluesky...")
    bsky_text = content.get("bluesky", "")
    if bsky_text:
        uri = post_to_bluesky(bsky_text)
        if uri:
            print(f"  Bluesky posted: {uri}")
            update_history(uri, bsky_text)
        else:
            print("  Bluesky post failed")
    
    # Save drafts for manual channels
    path = save_drafts(content, theme)
    print(f"  Drafts saved: {path}")
    
    # Print drafts for manual posting
    print("\n  === THREADS (copy & paste) ===")
    print(f"  {content.get('threads', 'N/A')}")
    print("\n  === LINKEDIN (copy & paste) ===")
    print(f"  {content.get('linkedin', 'N/A')[:200]}...")
    print("\n  === TWITTER ===")
    print(f"  {content.get('twitter', 'N/A')}")
    
    return content


if __name__ == "__main__":
    run()
