"""
validate_loop.py — Main validation + monitoring loop.

Ties together promotion generation, Supabase metrics fetching, and
decision logic into a single runnable cycle.

Usage:
    python validate_loop.py --hypothesis H-006
    python validate_loop.py --hypothesis H-006 --loop
    python validate_loop.py --hypothesis H-006 --loop --interval 15
    python validate_loop.py --hypothesis H-006 --generate-promos
"""

from __future__ import annotations

import argparse
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / "config" / "validation_targets.json"
METRICS_DIR = BASE_DIR / "data" / "metrics"
PROMOTIONS_DIR = BASE_DIR / "data" / "promotions"

load_dotenv(BASE_DIR / ".env")

# ---------------------------------------------------------------------------
# Imports from sibling modules
# ---------------------------------------------------------------------------
from promoters.channels import generate_posts, get_existing_posts, CHANNEL_LABELS
from promoters.researcher import research_all_channels, load_research
from promoters.post_tracker import (
    add_post,
    get_posts_for_hypothesis,
    get_posted_channels,
)
from promoters.n8n_poster import (
    post_to_all_channels,
    get_n8n_status,
    classify_channels,
    trigger_validation,
)
from validators.validator import (
    load_targets,
    fetch_rows,
    summarize_metrics,
    decide_next_action,
)


# ---------------------------------------------------------------------------
# Config helpers
# ---------------------------------------------------------------------------

def load_config() -> dict[str, Any]:
    return json.loads(CONFIG_PATH.read_text())


# ---------------------------------------------------------------------------
# Promotion helpers
# ---------------------------------------------------------------------------

def run_research(hypothesis_id: str) -> dict[str, dict]:
    """Run research phase for all channels. Returns channel->research mapping."""
    print(f"\n  Running channel research for {hypothesis_id}...")
    results = research_all_channels(hypothesis_id)
    print(f"\n  Research complete for {len(results)} channels:")
    for channel, research in results.items():
        label = CHANNEL_LABELS.get(channel, channel)
        post_type = research.get("recommended_post_type", "post")
        n_patterns = len(research.get("patterns", []))
        print(f"    [{label}] — {post_type}, {n_patterns} patterns identified")
    return results


def print_research_summary(hypothesis_id: str, research_map: dict[str, dict]) -> None:
    print("\n" + "=" * 64)
    print(f"  CHANNEL RESEARCH SUMMARY — {hypothesis_id}")
    print("=" * 64)
    for channel, research in research_map.items():
        label = CHANNEL_LABELS.get(channel, channel)
        print(f"\n  [{label}]")
        print(f"  Post type: {research.get('recommended_post_type', 'N/A')}")
        if research.get("examples"):
            print("  Example titles:")
            for ex in research["examples"][:2]:
                print(f"    • {ex}")
        if research.get("avoid"):
            print(f"  Avoid: {research['avoid'][0]}")
    print("\n" + "=" * 64)


def ensure_promos_exist(hypothesis_id: str) -> tuple[bool, list[Path]]:
    """Return (already_existed, paths). Generate if none exist yet."""
    existing = get_existing_posts(hypothesis_id)
    if existing:
        return True, existing

    # Step 1: Research all channels
    research_map = run_research(hypothesis_id)

    # Step 2: Generate posts using research
    paths = generate_posts(hypothesis_id, research_map=research_map)

    # Register each as pending in tracker
    for path in paths:
        # channel key is the second segment of the filename stem
        stem = path.stem  # e.g. H-006_reddit_saas_20240101_120000
        parts = stem.split("_")
        # hypothesis_id may contain '-', channel key is everything between id and timestamp
        # filename format: {hypothesis_id}_{channel_key}_{date}_{time}
        # channel_key itself may have underscores (reddit_saas)
        # We stored it as {hypothesis_id}_{channel_key}_{YYYYMMDD}_{HHMMSS}
        # Strip hypothesis prefix and trailing date/time (last two _-segments)
        hid_prefix = hypothesis_id.replace("-", "_") + "_"  # H_006_
        # Actually use the raw filename pattern
        name_without_hid = path.stem[len(hypothesis_id) + 1:]  # strip "H-006_"
        # name_without_hid = e.g. "reddit_saas_20240101_120000"
        # remove trailing _YYYYMMDD_HHMMSS (last 2 underscore segments)
        segments = name_without_hid.split("_")
        channel_key = "_".join(segments[:-2])  # drop date + time
        add_post(hypothesis_id, channel_key)
    return False, paths


def print_promo_list(hypothesis_id: str, paths: list[Path]) -> None:
    print("\n" + "=" * 64)
    print(f"  PROMOTION POSTS GENERATED — {hypothesis_id}")
    print("=" * 64)
    print("\nPost these manually to drive traffic to your landing page:\n")
    for path in sorted(paths):
        stem = path.stem
        name_without_hid = stem[len(hypothesis_id) + 1:]
        segments = name_without_hid.split("_")
        channel_key = "_".join(segments[:-2])
        label = CHANNEL_LABELS.get(channel_key, channel_key)
        print(f"  [{label}]")
        print(f"  File: {path}")
        print()
    print("After posting, run again to check metrics.")
    print("=" * 64)


# ---------------------------------------------------------------------------
# Metrics display
# ---------------------------------------------------------------------------

def print_metrics_summary(
    hypothesis_id: str,
    title: str,
    metrics: dict[str, Any],
    criteria: dict[str, Any],
    action: dict[str, str],
    snapshot_path: Path,
) -> None:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    min_pv = int(criteria.get("min_pageviews", 100))
    page_views = metrics["page_views"]

    print("\n" + "=" * 64)
    print(f"  VALIDATION REPORT — {hypothesis_id}")
    print(f"  {title}")
    print(f"  Checked at: {now}")
    print("=" * 64)

    print("\n  METRICS")
    print(f"    page_views        : {page_views}  (need {min_pv})")
    print(f"    waitlist_signups  : {metrics['waitlist_signups']}")
    print(f"    conversion_rate   : {metrics['conversion_rate']:.1%}  (target {float(criteria.get('target_conversion_rate', 0.1)):.0%})")
    print(f"    scroll_50_rate    : {metrics['scroll_50_rate']:.1%}  (min {float(criteria.get('min_scroll_50_rate', 0.35)):.0%})")
    print(f"    scroll_events     : {metrics['scroll_events']}")
    print(f"    signup_events     : {metrics['signup_events']}")

    if metrics["top_referrers"]:
        print(f"\n  TOP REFERRERS")
        for ref, count in metrics["top_referrers"]:
            print(f"    {ref or 'direct':30s}  {count}")

    if metrics["waitlist_sources"]:
        print(f"\n  WAITLIST SOURCES")
        for src, count in metrics["waitlist_sources"].items():
            print(f"    {src or 'unknown':30s}  {count}")

    print(f"\n  DECISION: {action['decision'].upper()}")
    print(f"    {action['reason']}")
    print(f"\n  NEXT STEP:")
    print(f"    {action['next_step']}")

    print(f"\n  Snapshot saved: {snapshot_path}")
    print("=" * 64)


# ---------------------------------------------------------------------------
# Snapshot save (standalone, no deploy info)
# ---------------------------------------------------------------------------

def save_snapshot(
    hypothesis_id: str,
    title: str,
    live_url: str,
    hours: int,
    metrics: dict[str, Any],
    action: dict[str, str],
    criteria: dict[str, Any],
) -> Path:
    METRICS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    payload = {
        "hypothesis_id": hypothesis_id,
        "title": title,
        "window_hours": hours,
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "live_url": live_url,
        "metrics": metrics,
        "action": action,
        "criteria": criteria,
    }
    path = METRICS_DIR / f"{hypothesis_id}_{timestamp}.json"
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    return path


# ---------------------------------------------------------------------------
# Core cycle
# ---------------------------------------------------------------------------

def run_cycle(hypothesis_id: str, hours: int | None = None, verbose: bool = True) -> dict[str, Any]:
    """Run one full check cycle. Returns result dict."""
    targets = load_targets()
    if hypothesis_id not in targets:
        raise KeyError(f"Unknown hypothesis: {hypothesis_id}. Available: {list(targets.keys())}")

    target = targets[hypothesis_id]
    hours = hours or target.metric_window_hours
    criteria = target.success_criteria

    # 1. Ensure promotion posts exist
    already_existed, promo_paths = ensure_promos_exist(hypothesis_id)

    if not already_existed:
        print_promo_list(hypothesis_id, promo_paths)
        print("\n  ACTION REQUIRED: Post the promotion content above manually, then run again.")
        return {
            "hypothesis_id": hypothesis_id,
            "status": "promos_generated",
            "promo_paths": [str(p) for p in promo_paths],
        }

    # 2. Fetch metrics
    if verbose:
        print(f"\n  Fetching metrics for {hypothesis_id} (last {hours}h)...")

    events = fetch_rows("events", hypothesis_id, hours)
    waitlist = fetch_rows("waitlist", hypothesis_id, hours)
    metrics = summarize_metrics(events, waitlist, criteria)
    page_views = metrics["page_views"]
    min_pv = int(criteria.get("min_pageviews", 100))

    # 3. No traffic yet
    if page_views == 0:
        print("\n" + "=" * 64)
        print(f"  NO TRAFFIC YET — {hypothesis_id}")
        print("=" * 64)
        print("\n  No page_views recorded. Post the promotion content first.\n")
        print("  Your generated promotion posts:")
        for path in sorted(promo_paths):
            print(f"    {path}")
        print("\n  After posting, run this script again to check metrics.")
        print("=" * 64)
        return {
            "hypothesis_id": hypothesis_id,
            "status": "no_traffic",
            "metrics": metrics,
        }

    # 4. Some traffic but not enough yet
    if page_views < min_pv:
        print("\n" + "=" * 64)
        print(f"  KEEP PROMOTING — {hypothesis_id}")
        print("=" * 64)
        print(f"\n  Current page_views: {page_views} / {min_pv} needed")
        print(f"  Waitlist signups  : {metrics['waitlist_signups']}")
        print(f"  Conversion rate   : {metrics['conversion_rate']:.1%}")
        print(f"\n  Keep promoting. Need more traffic to draw conclusions.")
        print("\n  Promotion posts (if you need to post more channels):")
        for path in sorted(promo_paths):
            print(f"    {path}")
        print("=" * 64)

        action = decide_next_action(metrics, criteria)
        snapshot_path = save_snapshot(hypothesis_id, target.title, target.live_url, hours, metrics, action, criteria)

        return {
            "hypothesis_id": hypothesis_id,
            "status": "insufficient_traffic",
            "metrics": metrics,
            "action": action,
            "snapshot_path": str(snapshot_path),
        }

    # 5. Enough traffic — full analysis
    action = decide_next_action(metrics, criteria)
    snapshot_path = save_snapshot(hypothesis_id, target.title, target.live_url, hours, metrics, action, criteria)

    if verbose:
        print_metrics_summary(hypothesis_id, target.title, metrics, criteria, action, snapshot_path)

    return {
        "hypothesis_id": hypothesis_id,
        "status": "analyzed",
        "metrics": metrics,
        "action": action,
        "snapshot_path": str(snapshot_path),
        "live_url": target.live_url,
    }


# ---------------------------------------------------------------------------
# Auto-promote via n8n
# ---------------------------------------------------------------------------

def run_auto_promote(hypothesis_id: str, variant: str = "A") -> None:
    """Check n8n is running, then post all promotion content via webhooks."""
    print(f"\n  AUTO-PROMOTE — {hypothesis_id} (variant {variant})")
    print("=" * 64)

    # 1. Check n8n is reachable
    status = get_n8n_status()
    if not status["running"]:
        print(f"\n  ERROR: n8n is not running.")
        print(f"  {status.get('error', '')}")
        print("\n  Start it with:")
        print("    cd n8n && docker compose up -d")
        return

    print(f"\n  n8n is running at {status['base_url']}")

    # 2. Ensure promotion posts exist
    existing = get_existing_posts(hypothesis_id)
    if not existing:
        print(f"\n  No promotion posts found for {hypothesis_id}.")
        print("  Generate them first:")
        print(f"    python3 validate_loop.py --hypothesis {hypothesis_id} --generate-promos")
        return

    print(f"  Found {len(existing)} promotion file(s) to post.\n")

    # 3. Send to n8n
    results = post_to_all_channels(hypothesis_id, variant=variant)

    # 4. Print results
    success_count = sum(1 for r in results if r.get("success"))
    fail_count = len(results) - success_count

    manual_count = sum(1 for r in results if r.get("manual"))
    auto_success = success_count - manual_count
    print(f"  Results: {auto_success} posted, {manual_count} manual, {fail_count} failed\n")
    for result in results:
        channel_key = result.get("channel_key", result.get("channel", "unknown"))
        label = CHANNEL_LABELS.get(channel_key, channel_key)
        if result.get("manual"):
            post_url = result.get("post_url", "")
            print(f"  [MANUAL] {label}  -> post at: {post_url}")
        elif result.get("success"):
            post_url = result.get("post_url", "")
            url_str = f"  -> {post_url}" if post_url else ""
            print(f"  [OK]   {label}{url_str}")
        else:
            error = result.get("error", "unknown error")
            print(f"  [FAIL] {label}: {error}")

    print("\n" + "=" * 64)
    if fail_count:
        print("\n  Some posts failed. Check:")
        print("    1. Workflows are active in n8n UI")
        print("    2. Credentials are connected for each platform")
        print(f"    3. n8n logs: docker compose -f n8n/docker-compose.yml logs n8n")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Validation + monitoring loop for a deployed hypothesis landing page.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python validate_loop.py --hypothesis H-006
  python validate_loop.py --hypothesis H-006 --loop
  python validate_loop.py --hypothesis H-006 --loop --interval 15
  python validate_loop.py --hypothesis H-006 --research-only
  python validate_loop.py --hypothesis H-006 --generate-promos
        """,
    )
    parser.add_argument("--hypothesis", required=True, help="Hypothesis ID, e.g. H-006")
    parser.add_argument("--hours", type=int, help="Look back N hours (default: from config)")
    parser.add_argument("--loop", action="store_true", help="Run continuously")
    parser.add_argument("--interval", type=int, default=30, help="Loop interval in minutes (default: 30)")
    parser.add_argument("--generate-promos", action="store_true", help="Only generate promotion posts and exit (runs research first)")
    parser.add_argument("--research-only", action="store_true", help="Only run channel research phase, no post generation")
    parser.add_argument("--auto-promote", action="store_true", help="Post promotion content to all channels via n8n webhooks")
    parser.add_argument("--variant", default="A", help="A/B variant label for auto-promote (default: A)")
    parser.add_argument("--trigger", action="store_true", help="Trigger validation check via n8n scheduled workflow")
    parser.add_argument("--classify", action="store_true", help="Show auto vs manual channel breakdown")
    args = parser.parse_args()

    # trigger validation via n8n
    if args.trigger:
        print(f"\nTriggering validation via n8n for {args.hypothesis}...")
        result = trigger_validation(args.hypothesis)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    # classify channels
    if args.classify:
        channels = classify_channels(args.hypothesis)
        print(f"\n  CHANNEL CLASSIFICATION — {args.hypothesis}")
        print("=" * 64)
        print(f"\n  Auto-postable ({len(channels['auto'])}):")
        for ch in channels["auto"]:
            label = CHANNEL_LABELS.get(ch["channel_key"], ch["channel_key"])
            print(f"    [{label}] -> n8n:{ch['n8n_channel']}")
        print(f"\n  Manual ({len(channels['manual'])}):")
        for ch in channels["manual"]:
            label = CHANNEL_LABELS.get(ch["channel_key"], ch["channel_key"])
            print(f"    [{label}] -> post at: https://www.indiehackers.com/post/new")
        print("=" * 64)
        return

    # auto-promote mode
    if args.auto_promote:
        run_auto_promote(args.hypothesis, args.variant)
        return

    # research-only mode
    if args.research_only:
        print(f"\nRunning channel research for {args.hypothesis}...")
        research_map = run_research(args.hypothesis)
        print_research_summary(args.hypothesis, research_map)
        return

    # generate-promos only mode
    if args.generate_promos:
        print(f"\nGenerating promotion posts for {args.hypothesis}...")
        # Step 1: Research
        research_map = run_research(args.hypothesis)
        print_research_summary(args.hypothesis, research_map)
        # Step 2: Generate
        paths = generate_posts(args.hypothesis, research_map=research_map)
        print_promo_list(args.hypothesis, paths)
        return

    # single check or loop
    run_count = 0
    while True:
        run_count += 1
        if args.loop and run_count > 1:
            print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Starting check #{run_count}...")

        try:
            result = run_cycle(args.hypothesis, hours=args.hours)
        except KeyError as exc:
            print(f"\nERROR: {exc}")
            return
        except Exception as exc:
            print(f"\nERROR during cycle: {exc}")
            if not args.loop:
                raise

        if not args.loop:
            return

        # Status-aware wait messaging
        status = result.get("status", "")
        if status == "promos_generated":
            print(f"\n  Waiting {args.interval}m before next check. Go post those promos!")
        elif status == "no_traffic":
            print(f"\n  Waiting {args.interval}m before next check.")
        else:
            print(f"\n  Next check in {args.interval} minutes. Press Ctrl+C to stop.")

        try:
            time.sleep(args.interval * 60)
        except KeyboardInterrupt:
            print("\n\nMonitoring stopped.")
            return


if __name__ == "__main__":
    main()
