"""
Hypothesis validation runner.

Deploy a landing page, collect Supabase metrics, summarize them, and
recommend the next action for a single hypothesis.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import time
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
CONFIG_PATH = BASE_DIR / "config" / "validation_targets.json"
METRICS_DIR = BASE_DIR / "data" / "metrics"
HYPOTHESES_DIR = BASE_DIR / "data" / "hypotheses"

load_dotenv(BASE_DIR / ".env")


@dataclass
class ValidationTarget:
    hypothesis_id: str
    title: str
    landing_page_dir: Path
    pages_project: str
    live_url: str
    metric_window_hours: int
    success_criteria: dict[str, float | int]
    raw: dict[str, Any]


def load_targets() -> dict[str, ValidationTarget]:
    raw = json.loads(CONFIG_PATH.read_text())
    targets: dict[str, ValidationTarget] = {}
    for hypothesis_id, config in raw.items():
        targets[hypothesis_id] = ValidationTarget(
            hypothesis_id=hypothesis_id,
            title=config["title"],
            landing_page_dir=(BASE_DIR / config["landing_page_dir"]).resolve(),
            pages_project=config["pages_project"],
            live_url=config["live_url"],
            metric_window_hours=int(config.get("metric_window_hours", 24)),
            success_criteria=config.get("success_criteria", {}),
            raw=config,
        )
    return targets


def find_latest_hypothesis_file(hypothesis_id: str) -> Path | None:
    matches = sorted(HYPOTHESES_DIR.glob(f"{hypothesis_id}_*.json"))
    return matches[-1] if matches else None


def deploy_target(target: ValidationTarget) -> dict[str, str]:
    cmd = [
        "wrangler",
        "pages",
        "deploy",
        str(target.landing_page_dir),
        "--project-name",
        target.pages_project,
        "--commit-dirty=true",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT_DIR, timeout=180)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())

    deployment_url = target.live_url
    for line in (result.stdout + "\n" + result.stderr).splitlines():
        line = line.strip()
        if line.startswith("https://") and ".pages.dev" in line:
            deployment_url = line

    return {
        "status": "deployed",
        "deployment_url": deployment_url,
        "project_url": target.live_url,
        "raw_output": (result.stdout + "\n" + result.stderr).strip(),
    }


def supabase_headers() -> dict[str, str]:
    anon_key = os.getenv("SUPABASE_ANON_KEY", "")
    if not anon_key:
        raise RuntimeError("SUPABASE_ANON_KEY missing in pipeline/.env")
    return {
        "apikey": anon_key,
        "Authorization": f"Bearer {anon_key}",
        "Content-Type": "application/json",
    }


def supabase_base_url() -> str:
    url = os.getenv("SUPABASE_URL", "")
    if not url:
        raise RuntimeError("SUPABASE_URL missing in pipeline/.env")
    return url.rstrip("/")


def iso_utc_hours_ago(hours: int) -> str:
    return (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()


def fetch_rows(table: str, hypothesis_id: str, since_hours: int) -> list[dict[str, Any]]:
    base_url = supabase_base_url()
    params = {
        "select": "*",
        "hypothesis": f"eq.{hypothesis_id}",
        "created_at": f"gte.{iso_utc_hours_ago(since_hours)}",
        "order": "created_at.desc",
    }
    with httpx.Client(timeout=20) as client:
        response = client.get(f"{base_url}/rest/v1/{table}", headers=supabase_headers(), params=params)
        response.raise_for_status()
        return response.json()


def _event_depth(event: dict[str, Any]) -> int | None:
    if event.get("event") != "scroll":
        return None
    metadata = event.get("metadata") or {}
    if isinstance(metadata, dict):
        depth = metadata.get("depth")
        if isinstance(depth, int):
            return depth
        if isinstance(depth, str) and depth.isdigit():
            return int(depth)
    return None


def summarize_metrics(events: list[dict[str, Any]], waitlist: list[dict[str, Any]], criteria: dict[str, Any]) -> dict[str, Any]:
    event_counts = Counter(event.get("event") or "unknown" for event in events)
    waitlist_sources = Counter((row.get("source") or "unknown") for row in waitlist)
    referrers = Counter((row.get("referrer") or "direct") for row in events if row.get("event") == "page_view")

    page_views = event_counts.get("page_view", 0)
    scroll_depths = [_event_depth(event) for event in events]
    scroll_depths = [depth for depth in scroll_depths if depth is not None]
    scroll_50 = sum(1 for depth in scroll_depths if depth >= 50)
    scroll_75 = sum(1 for depth in scroll_depths if depth >= 75)
    signup_events = event_counts.get("waitlist_signup", 0)
    waitlist_signups = len(waitlist)

    conversion_rate = round(waitlist_signups / page_views, 4) if page_views else 0.0
    scroll_50_rate = round(scroll_50 / page_views, 4) if page_views else 0.0

    return {
        "page_views": page_views,
        "waitlist_signups": waitlist_signups,
        "signup_events": signup_events,
        "scroll_events": event_counts.get("scroll", 0),
        "scroll_50_rate": scroll_50_rate,
        "scroll_75_count": scroll_75,
        "conversion_rate": conversion_rate,
        "event_counts": dict(event_counts),
        "waitlist_sources": dict(waitlist_sources),
        "top_referrers": referrers.most_common(5),
        "criteria_snapshot": criteria,
    }


def decide_next_action(metrics: dict[str, Any], criteria: dict[str, Any]) -> dict[str, str]:
    page_views = metrics["page_views"]
    waitlist_signups = metrics["waitlist_signups"]
    conversion_rate = metrics["conversion_rate"]
    scroll_50_rate = metrics["scroll_50_rate"]

    min_pageviews = int(criteria.get("min_pageviews", 100))
    min_waitlist = int(criteria.get("min_waitlist_signups", 10))
    target_conversion = float(criteria.get("target_conversion_rate", 0.1))
    strong_conversion = float(criteria.get("strong_conversion_rate", 0.2))
    min_scroll_50_rate = float(criteria.get("min_scroll_50_rate", 0.35))

    if page_views < min_pageviews:
        return {
            "decision": "promote_distribution",
            "reason": f"유입이 부족함 (page_view {page_views}/{min_pageviews}). 같은 오퍼로 더 많은 트래픽을 먼저 확보해야 함.",
            "next_step": "Indie Hackers/Reddit/X 3개 채널에 동일 메시지로 배포하고 referrer를 비교한다.",
        }

    if waitlist_signups >= min_waitlist and conversion_rate >= strong_conversion:
        return {
            "decision": "double_down",
            "reason": f"전환이 매우 강함 (signup {waitlist_signups}, conversion {conversion_rate:.1%}).",
            "next_step": "같은 메시지 유지, 더 많은 트래픽/작은 광고비를 태우고 프리셀 또는 인터뷰 요청으로 확장한다.",
        }

    if scroll_50_rate < min_scroll_50_rate:
        return {
            "decision": "rewrite_hero",
            "reason": f"중간 스크롤 비율이 낮음 ({scroll_50_rate:.1%} < {min_scroll_50_rate:.1%}). 헤드라인/히어로가 약함.",
            "next_step": "헤드라인, 서브카피, 가격 앵커를 수정하고 같은 채널로 재유입 테스트한다.",
        }

    if conversion_rate < target_conversion:
        return {
            "decision": "improve_offer_or_cta",
            "reason": f"유입은 있지만 전환이 약함 ({conversion_rate:.1%} < {target_conversion:.1%}).",
            "next_step": "CTA 문구, 사회적 증거, 가격 설명, 폼 마찰을 수정하고 24시간 재측정한다.",
        }

    return {
        "decision": "keep_collecting",
        "reason": "초기 신호가 나쁘지 않지만 표본이 아직 충분하지 않음.",
        "next_step": "현재 카피 유지, 동일 채널 1~2곳 추가 후 24시간 더 수집한다.",
    }


def save_snapshot(target: ValidationTarget, hours: int, deployment: dict[str, Any] | None, metrics: dict[str, Any], action: dict[str, str]) -> Path:
    METRICS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    hypothesis_file = find_latest_hypothesis_file(target.hypothesis_id)
    payload = {
        "hypothesis_id": target.hypothesis_id,
        "title": target.title,
        "window_hours": hours,
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "hypothesis_file": str(hypothesis_file.relative_to(BASE_DIR)) if hypothesis_file else None,
        "live_url": target.live_url,
        "deployment": deployment,
        "metrics": metrics,
        "action": action,
        "data_collection_hypotheses": target.raw.get("data_collection_hypotheses", []),
        "analysis_hypotheses": target.raw.get("analysis_hypotheses", []),
        "promotion_hypotheses": target.raw.get("promotion_hypotheses", []),
    }
    path = METRICS_DIR / f"{target.hypothesis_id}_{timestamp}.json"
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    return path


def run_validation(hypothesis_id: str, hours: int | None = None, deploy: bool = False) -> dict[str, Any]:
    targets = load_targets()
    if hypothesis_id not in targets:
        raise KeyError(f"Unknown hypothesis target: {hypothesis_id}")

    target = targets[hypothesis_id]
    hours = hours or target.metric_window_hours

    deployment = deploy_target(target) if deploy else None
    events = fetch_rows("events", hypothesis_id, hours)
    waitlist = fetch_rows("waitlist", hypothesis_id, hours)
    metrics = summarize_metrics(events, waitlist, target.success_criteria)
    action = decide_next_action(metrics, target.success_criteria)
    snapshot_path = save_snapshot(target, hours, deployment, metrics, action)

    return {
        "hypothesis_id": hypothesis_id,
        "title": target.title,
        "deployment": deployment,
        "metrics": metrics,
        "action": action,
        "snapshot_path": str(snapshot_path),
        "live_url": target.live_url,
    }


def print_report(report: dict[str, Any]) -> None:
    print("\n" + "=" * 64)
    print(f"🧪 Validation report — {report['hypothesis_id']}")
    print(f"제목: {report['title']}")
    print(f"라이브 URL: {report['live_url']}")
    if report.get("deployment"):
        print(f"배포: {report['deployment']['project_url']}")

    metrics = report["metrics"]
    print("\n📊 Metrics")
    print(f"  page_view: {metrics['page_views']}")
    print(f"  waitlist_signups: {metrics['waitlist_signups']}")
    print(f"  signup_events: {metrics['signup_events']}")
    print(f"  conversion_rate: {metrics['conversion_rate']:.1%}")
    print(f"  scroll_50_rate: {metrics['scroll_50_rate']:.1%}")
    print(f"  top_referrers: {metrics['top_referrers']}")
    print(f"  waitlist_sources: {metrics['waitlist_sources']}")

    print("\n➡️ Next action")
    print(f"  decision: {report['action']['decision']}")
    print(f"  reason: {report['action']['reason']}")
    print(f"  next_step: {report['action']['next_step']}")
    print(f"\n💾 Saved: {report['snapshot_path']}")
    print("=" * 64)


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate one deployed hypothesis")
    parser.add_argument("--hypothesis", required=True, help="예: H-006")
    parser.add_argument("--hours", type=int, help="최근 N시간 데이터만 분석")
    parser.add_argument("--deploy", action="store_true", help="분석 전 랜딩페이지 재배포")
    parser.add_argument("--loop", action="store_true", help="지속적으로 반복 분석")
    parser.add_argument("--interval-minutes", type=int, default=60, help="loop 모드 반복 간격 (분)")
    args = parser.parse_args()

    while True:
        report = run_validation(args.hypothesis, hours=args.hours, deploy=args.deploy)
        print_report(report)

        if not args.loop:
            return

        args.deploy = False  # loop 모드에서는 첫 배포 이후 재배포하지 않음
        time.sleep(max(args.interval_minutes, 1) * 60)


if __name__ == "__main__":
    main()
