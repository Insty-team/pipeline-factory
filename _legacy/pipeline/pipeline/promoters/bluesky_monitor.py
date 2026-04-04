"""
Bluesky 엔게이지먼트 모니터링
포스트별 좋아요/댓글/리포스트 추적, 히스토리 업데이트
"""
import json
import os
import requests
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.parent
load_dotenv(BASE_DIR / ".env")

HISTORY_PATH = BASE_DIR / "data" / "promotions" / "bluesky_history.json"
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY", "")


def login():
    resp = requests.post("https://bsky.social/xrpc/com.atproto.server.createSession", json={
        "identifier": os.environ["BLUESKY_HANDLE"],
        "password": os.environ["BLUESKY_PASSWORD"]
    })
    s = resp.json()
    return s["accessJwt"], s["did"]


def get_engagement(token, did):
    """모든 포스트의 엔게이지먼트 데이터 수집"""
    resp = requests.get("https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed",
        headers={"Authorization": "Bearer " + token},
        params={"actor": did, "limit": 50}
    )
    feed = resp.json().get("feed", [])
    
    results = []
    for item in feed:
        post = item.get("post", {})
        results.append({
            "uri": post.get("uri", ""),
            "text": post.get("record", {}).get("text", "")[:100],
            "created_at": post.get("record", {}).get("createdAt", ""),
            "likes": post.get("likeCount", 0),
            "replies": post.get("replyCount", 0),
            "reposts": post.get("repostCount", 0),
            "checked_at": datetime.now(timezone.utc).isoformat(),
        })
    return results


def update_history(engagement_data):
    """히스토리 파일 업데이트"""
    try:
        with open(HISTORY_PATH) as f:
            history = json.load(f)
    except:
        history = []
    
    uri_map = {h.get("uri"): h for h in history}
    
    for data in engagement_data:
        uri = data["uri"]
        if uri in uri_map:
            uri_map[uri]["engagement"] = {
                "likes": data["likes"],
                "replies": data["replies"],
                "reposts": data["reposts"],
                "last_checked": data["checked_at"],
            }
        else:
            history.append({
                "date": data["created_at"],
                "uri": uri,
                "text": data["text"],
                "type": "build_in_public",
                "engagement": {
                    "likes": data["likes"],
                    "replies": data["replies"],
                    "reposts": data["reposts"],
                    "last_checked": data["checked_at"],
                }
            })
    
    with open(HISTORY_PATH, "w") as f:
        json.dump(list(uri_map.values()) if uri_map else history, f, ensure_ascii=False, indent=2)
    
    return history


def save_to_supabase(engagement_data):
    """Supabase에 엔게이지먼트 스냅샷 저장"""
    if not SUPABASE_URL:
        return
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json",
    }
    
    for data in engagement_data:
        requests.post(f"{SUPABASE_URL}/rest/v1/events", headers=headers, json={
            "hypothesis": "bluesky-monitor",
            "event": "engagement_snapshot",
            "metadata": json.dumps(data),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })


def run():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Bluesky monitor running...")
    token, did = login()
    engagement = get_engagement(token, did)
    update_history(engagement)
    save_to_supabase(engagement)
    
    print(f"  Tracked {len(engagement)} posts:")
    for e in engagement:
        print(f"  {e['likes']}L {e['replies']}R {e['reposts']}RP | {e['text'][:60]}...")
    
    return engagement


if __name__ == "__main__":
    run()
