"""
모드 B: 레퍼런스 기반 수집
기존 서비스의 불만/리뷰를 크롤링하여 차별화 기회를 탐색한다.

소스: G2 리뷰, Reddit 불만, 웹 검색 ("X alternative"), Twitter/X 불만
"""

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))
from ai import ask_json

load_dotenv(Path(__file__).parent.parent / ".env")

BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data" / "pain_points"
CONFIG_PATH = BASE_DIR / "config" / "sources.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
}


def load_config() -> dict:
    with open(CONFIG_PATH) as f:
        return json.load(f)


def search_reddit_complaints(service_name: str, subreddits: list[str]) -> list[dict]:
    """Reddit에서 특정 서비스에 대한 불만 검색 (웹 스크래핑 대신 검색 API 활용)"""
    results = []
    search_queries = [
        f"{service_name} alternative",
        f"{service_name} hate",
        f"{service_name} switching from",
        f"{service_name} frustrating",
        f"{service_name} too expensive",
    ]

    for query in search_queries:
        try:
            url = "https://www.reddit.com/search.json"
            params = {
                "q": query,
                "sort": "relevance",
                "t": "year",
                "limit": 10,
                "restrict_sr": False,
            }
            resp = httpx.get(url, params=params, headers={
                **HEADERS,
                "User-Agent": "pipeline-factory/0.1 (research)",
            }, timeout=15)

            if resp.status_code != 200:
                continue

            data = resp.json()
            for post in data.get("data", {}).get("children", []):
                d = post["data"]
                results.append({
                    "source": "reddit",
                    "service": service_name,
                    "title": d.get("title", ""),
                    "text": d.get("selftext", "")[:1000],
                    "subreddit": d.get("subreddit", ""),
                    "score": d.get("score", 0),
                    "num_comments": d.get("num_comments", 0),
                    "url": f"https://reddit.com{d.get('permalink', '')}",
                    "created_utc": d.get("created_utc", 0),
                })
        except Exception as e:
            print(f"  Reddit search error ({query}): {e}")
            continue

    # 중복 제거 (URL 기준)
    seen = set()
    unique = []
    for r in results:
        if r["url"] not in seen:
            seen.add(r["url"])
            unique.append(r)

    return unique


def search_web_complaints(service_name: str) -> list[dict]:
    """'X alternative' 등 웹 검색으로 불만/비교 콘텐츠 수집"""
    results = []
    queries = [
        f"{service_name} alternative 2026",
        f"{service_name} vs",
        f"why I switched from {service_name}",
    ]

    for query in queries:
        try:
            # DuckDuckGo HTML 검색 (API 키 불필요)
            resp = httpx.get(
                "https://html.duckduckgo.com/html/",
                params={"q": query},
                headers=HEADERS,
                timeout=15,
            )
            if resp.status_code != 200:
                continue

            soup = BeautifulSoup(resp.text, "html.parser")
            for result in soup.select(".result__body")[:5]:
                title_el = result.select_one(".result__title")
                snippet_el = result.select_one(".result__snippet")
                link_el = result.select_one(".result__url")

                if title_el and snippet_el:
                    results.append({
                        "source": "web_search",
                        "service": service_name,
                        "query": query,
                        "title": title_el.get_text(strip=True),
                        "text": snippet_el.get_text(strip=True),
                        "url": link_el.get_text(strip=True) if link_el else "",
                    })
        except Exception as e:
            print(f"  Web search error ({query}): {e}")
            continue

    return results


def search_twitter_complaints(service_name: str) -> list[dict]:
    """Twitter/X API로 서비스 불만 트윗 검색"""
    bearer = os.getenv("TWITTER_BEARER_TOKEN", "")
    if not bearer:
        return []

    results = []
    queries = [
        f"{service_name} alternative -is:retweet",
        f"{service_name} frustrating OR expensive OR hate -is:retweet",
    ]

    for query in queries:
        try:
            resp = httpx.get(
                "https://api.twitter.com/2/tweets/search/recent",
                params={
                    "query": query,
                    "max_results": 10,
                    "tweet.fields": "created_at,public_metrics,text",
                },
                headers={"Authorization": f"Bearer {bearer}"},
                timeout=15,
            )
            if resp.status_code != 200:
                print(f"  Twitter API {resp.status_code}: {resp.text[:100]}")
                continue

            data = resp.json()
            for tweet in data.get("data", []):
                metrics = tweet.get("public_metrics", {})
                results.append({
                    "source": "twitter",
                    "service": service_name,
                    "title": "",
                    "text": tweet.get("text", ""),
                    "score": metrics.get("like_count", 0) + metrics.get("retweet_count", 0),
                    "url": f"https://twitter.com/i/web/status/{tweet['id']}",
                    "created_at": tweet.get("created_at", ""),
                })
        except Exception as e:
            print(f"  Twitter search error ({query}): {e}")
            continue

    return results


def extract_pain_points_with_ai(raw_data: list[dict], service_name: str) -> list[dict]:
    """Claude CLI로 수집된 원본 데이터에서 pain point를 추출"""
    if not raw_data:
        return []

    entries = []
    for item in raw_data[:30]:
        entries.append(f"[{item['source']}] {item['title']}\n{item.get('text', '')[:300]}")

    combined = "\n---\n".join(entries)

    prompt = f"""다음은 "{service_name}" 서비스에 대한 사용자 리뷰/불만/비교 글 모음이다.

{combined}

이 데이터에서 반복되는 pain point를 추출해줘. 각 pain point에 대해:

1. pain_point: 한 줄 요약
2. category: pricing / ux / feature_lack / support / performance / integration 중 택1
3. frequency: 몇 번 이상 반복 언급되었는지 (추정)
4. severity: high / medium / low
5. differentiation_angle: 이 불만을 해결하는 차별화 서비스를 만든다면 어떤 방향인지 (한 줄)
6. confidence: 0.0~1.0 (데이터 근거가 충분한 정도)

JSON 배열로 응답. 최소 3개, 최대 10개. 데이터가 부족하면 confidence를 낮게."""

    try:
        pain_points = ask_json(prompt)
        for pp in pain_points:
            pp["service"] = service_name
            pp["collected_at"] = datetime.now(timezone.utc).isoformat()
            pp["raw_data_count"] = len(raw_data)
        return pain_points
    except Exception as e:
        print(f"  AI extraction error: {e}")

    return []


def collect_for_service(service: dict) -> list[dict]:
    """단일 서비스에 대해 전체 수집 + AI 추출 실행"""
    name = service["name"]
    print(f"\n{'='*50}")
    print(f"수집 시작: {name}")
    print(f"{'='*50}")

    # 1. Reddit 불만 수집
    print(f"  Reddit 검색 중...")
    reddit_data = search_reddit_complaints(
        name,
        ["smallbusiness", "entrepreneur", "solopreneur", "SaaS"]
    )
    print(f"  Reddit: {len(reddit_data)}건 수집")

    # 2. 웹 검색 ("X alternative" 등)
    print(f"  웹 검색 중...")
    web_data = search_web_complaints(name)
    print(f"  웹: {len(web_data)}건 수집")

    # 3. Twitter 불만 검색 (Bearer Token 있을 때만)
    twitter_data = []
    if os.getenv("TWITTER_BEARER_TOKEN") and os.getenv("TWITTER_ENABLED", "false") == "true":
        print(f"  Twitter 검색 중...")
        twitter_data = search_twitter_complaints(name)
        print(f"  Twitter: {len(twitter_data)}건 수집")

    # 4. 전체 ��이터 합치기
    all_data = reddit_data + web_data + twitter_data
    print(f"  합계: {len(all_data)}건")

    if not all_data:
        print(f"  ⚠️ 데이터 없음 — 스킵")
        return []

    # 4. AI로 pain point 추출
    print(f"  AI 분석 중...")
    pain_points = extract_pain_points_with_ai(all_data, name)
    print(f"  Pain points: {len(pain_points)}개 추출")

    return pain_points


def run(services: list[dict] | None = None) -> list[dict]:
    """모드 B 수집 실행. 서비스 목록이 없으면 config에서 로드."""
    config = load_config()

    if services is None:
        services = config["mode_b"]["target_services"].get("US", [])

    all_pain_points = []
    for service in services:
        points = collect_for_service(service)
        all_pain_points.extend(points)

    # 결과 저장
    if all_pain_points:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = DATA_DIR / f"mode_b_{timestamp}.json"
        with open(output_path, "w") as f:
            json.dump(all_pain_points, f, ensure_ascii=False, indent=2)
        print(f"\n✅ {len(all_pain_points)}개 pain point 저장: {output_path}")

    return all_pain_points


if __name__ == "__main__":
    results = run()
    print(f"\n총 {len(results)}개 pain point 수집 완료")
    for pp in results:
        conf = pp.get('confidence', 0)
        print(f"  [{conf:.1f}] [{pp.get('category', '?')}] {pp.get('service', '?')}: {pp.get('pain_point', '?')}")
