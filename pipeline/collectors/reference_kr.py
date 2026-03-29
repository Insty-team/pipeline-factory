from typing import Optional, List, Dict, Any
"""
모드 B (한국): 레퍼런스 기반 수집
한국 서비스의 불만/리뷰를 네이버 검색으로 크롤링하여 차별화 기회 탐색.

소스: 네이버 블로그/카페 검색, 웹 검색
"""

import json
import os
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


def _naver_api_headers() -> dict:
    """네이버 API 인증 헤더"""
    client_id = os.getenv("NAVER_CLIENT_ID", "")
    client_secret = os.getenv("NAVER_CLIENT_SECRET", "")
    if client_id and client_secret:
        return {
            "X-Naver-Client-Id": client_id,
            "X-Naver-Client-Secret": client_secret,
        }
    return {}


def search_naver(query: str, display: int = 10) -> List[dict]:
    """네이버 검색 API (웹 문서)"""
    api_headers = _naver_api_headers()
    if not api_headers:
        print("  ⚠️ 네이버 API 키 없음 — HTML 폴백")
        return _search_naver_html(query, display)

    results = []
    try:
        resp = httpx.get(
            "https://openapi.naver.com/v1/search/webkr.json",
            params={"query": query, "display": display, "sort": "sim"},
            headers=api_headers,
            timeout=15,
        )
        if resp.status_code != 200:
            print(f"  네이버 API 에러 ({resp.status_code}) — HTML 폴백")
            return _search_naver_html(query, display)

        data = resp.json()
        for item in data.get("items", []):
            results.append({
                "source": "naver_api_web",
                "title": BeautifulSoup(item.get("title", ""), "html.parser").get_text(),
                "text": BeautifulSoup(item.get("description", ""), "html.parser").get_text(),
                "url": item.get("link", ""),
            })
    except Exception as e:
        print(f"  네이버 API 에러 ({query}): {e}")
        return _search_naver_html(query, display)

    return results


def search_naver_blog(query: str, display: int = 10) -> List[dict]:
    """네이버 블로그 검색 API"""
    api_headers = _naver_api_headers()
    if not api_headers:
        return []

    results = []
    try:
        resp = httpx.get(
            "https://openapi.naver.com/v1/search/blog.json",
            params={"query": query, "display": display, "sort": "sim"},
            headers=api_headers,
            timeout=15,
        )
        if resp.status_code != 200:
            return []

        data = resp.json()
        for item in data.get("items", []):
            results.append({
                "source": "naver_api_blog",
                "title": BeautifulSoup(item.get("title", ""), "html.parser").get_text(),
                "text": BeautifulSoup(item.get("description", ""), "html.parser").get_text(),
                "url": item.get("link", ""),
                "blogger": item.get("bloggername", ""),
                "date": item.get("postdate", ""),
            })
    except Exception as e:
        print(f"  네이버 블로그 API 에러 ({query}): {e}")

    return results


def _search_naver_html(query: str, display: int = 10) -> List[dict]:
    """네이버 HTML 스크래핑 (API 키 없을 때 폴백)"""
    results = []
    try:
        resp = httpx.get(
            "https://search.naver.com/search.naver",
            params={"query": query, "where": "web"},
            headers=HEADERS,
            timeout=15,
        )
        if resp.status_code != 200:
            return []

        soup = BeautifulSoup(resp.text, "html.parser")
        for item in soup.select(".total_wrap, .api_txt_lines")[:display]:
            title_el = item.select_one(".total_tit a, .api_txt_lines a")
            desc_el = item.select_one(".total_dsc, .api_txt_lines .dsc_txt")
            if title_el:
                results.append({
                    "source": "naver_html",
                    "title": title_el.get_text(strip=True),
                    "text": desc_el.get_text(strip=True) if desc_el else "",
                    "url": title_el.get("href", ""),
                })
    except Exception as e:
        print(f"  네이버 HTML 검색 에러 ({query}): {e}")

    return results


def search_duckduckgo_kr(query: str) -> List[dict]:
    """DuckDuckGo로 한국어 검색 (네이버 차단 시 백업)"""
    results = []
    try:
        resp = httpx.get(
            "https://html.duckduckgo.com/html/",
            params={"q": query, "kl": "kr-kr"},
            headers=HEADERS,
            timeout=15,
        )
        if resp.status_code != 200:
            return []

        soup = BeautifulSoup(resp.text, "html.parser")
        for result in soup.select(".result__body")[:5]:
            title_el = result.select_one(".result__title")
            snippet_el = result.select_one(".result__snippet")
            if title_el and snippet_el:
                results.append({
                    "source": "web_search_kr",
                    "title": title_el.get_text(strip=True),
                    "text": snippet_el.get_text(strip=True),
                    "url": "",
                })
    except Exception as e:
        print(f"  DuckDuckGo KR 검색 에러 ({query}): {e}")

    return results


def collect_for_service(service: dict) -> List[dict]:
    """한국 서비스 1개에 대해 수집 + AI 추출"""
    name = service["name"]
    keywords = service.get("search_keywords_kr", [f"{name} 단점", f"{name} 대안"])

    print(f"\n{'='*50}")
    print(f"수집 시작 [KR]: {name}")
    print(f"{'='*50}")

    all_data = []

    # 1. 네이버 웹 검색
    for kw in keywords:
        print(f"  네이버 검색: {kw}")
        results = search_naver(kw)
        all_data.extend(results)

    # 2. 네이버 블로그 검색
    for kw in keywords[:2]:
        print(f"  네이버 블로그: {kw}")
        results = search_naver_blog(kw)
        all_data.extend(results)

    # 3. DuckDuckGo 백업
    for kw in keywords[:2]:
        print(f"  DuckDuckGo: {kw}")
        results = search_duckduckgo_kr(kw)
        all_data.extend(results)

    print(f"  합계: {len(all_data)}건")

    if not all_data:
        print(f"  ⚠️ 데이터 없음 — 스킵")
        return []

    # 4. AI로 pain point 추출 (한국어 프롬프트)
    print(f"  AI 분석 중...")
    entries = []
    for item in all_data[:30]:
        entries.append(f"[{item['source']}] {item['title']}\n{item.get('text', '')[:300]}")
    combined = "\n---\n".join(entries)

    prompt = f"""다음은 "{name}" 서비스에 대한 한국 사용자의 후기/불만/비교 글 모음이다.

{combined}

이 데이터에서 반복되는 pain point를 추출해줘. 각 pain point에 대해:

1. pain_point: 한 줄 요약 (한국어)
2. category: pricing / ux / feature_lack / support / performance / integration 중 택1
3. frequency: 몇 번 이상 반복 언급되었는지 (추정)
4. severity: high / medium / low
5. differentiation_angle: 이 불만을 해결하는 한국 시장용 차별화 서비스 방향 (한 줄)
6. confidence: 0.0~1.0
7. market: "KR"

JSON 배열로 응답. 최소 3개, 최대 10개."""

    try:
        pain_points = ask_json(prompt)
        for pp in pain_points:
            pp["service"] = name
            pp["market"] = "KR"
            pp["collected_at"] = datetime.now(timezone.utc).isoformat()
            pp["raw_data_count"] = len(all_data)
        print(f"  Pain points: {len(pain_points)}개 추출")
        return pain_points
    except Exception as e:
        print(f"  AI extraction error: {e}")

    return []


def run(services: Optional[List[dict]] = None) -> List[dict]:
    """한국 시장 모드 B 수집 실행"""
    config = load_config()

    if services is None:
        services = config["mode_b"]["target_services"].get("KR", [])

    all_pain_points = []
    for service in services:
        points = collect_for_service(service)
        all_pain_points.extend(points)

    if all_pain_points:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = DATA_DIR / f"mode_b_kr_{timestamp}.json"
        with open(output_path, "w") as f:
            json.dump(all_pain_points, f, ensure_ascii=False, indent=2)
        print(f"\n✅ [KR] {len(all_pain_points)}개 pain point 저장: {output_path}")

    return all_pain_points


if __name__ == "__main__":
    results = run()
    print(f"\n총 {len(results)}개 pain point 수집 완료")
    for pp in results:
        conf = pp.get('confidence', 0)
        print(f"  [{conf:.1f}] [{pp.get('category', '?')}] {pp.get('service', '?')}: {pp.get('pain_point', '?')}")
