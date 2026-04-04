"""
n8n_poster.py — Post promotion content to social channels via n8n webhooks.

n8n handles all OAuth credentials (Twitter, Reddit, LinkedIn) — configure
them in the n8n UI at http://localhost:5678. This module only sends HTTP
requests to n8n webhook endpoints.

Usage:
    from promoters.n8n_poster import post_to_channel, post_to_all_channels, get_n8n_status

Environment variables (pipeline/.env):
    N8N_WEBHOOK_BASE  — base URL for n8n (default: http://localhost:5678)
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

import os

N8N_WEBHOOK_BASE = os.getenv("N8N_WEBHOOK_BASE", "http://localhost:5678").rstrip("/")

CONFIG_PATH = BASE_DIR / "config" / "n8n_config.json"
PROMOTIONS_DIR = BASE_DIR / "data" / "promotions"

sys.path.insert(0, str(BASE_DIR))
from promoters.post_tracker import add_post, mark_post_status, get_posts_for_hypothesis


# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

def _load_n8n_config() -> dict[str, Any]:
    """Load n8n webhook config. Falls back to defaults if file missing."""
    if CONFIG_PATH.exists():
        return json.loads(CONFIG_PATH.read_text())
    return {
        "n8n_base_url": N8N_WEBHOOK_BASE,
        "webhooks": {
            "twitter": "/webhook/twitter-post",
            "reddit": "/webhook/reddit-post",
            "linkedin": "/webhook/linkedin-post",
            "multi": "/webhook/multi-post",
        },
    }


def _webhook_url(channel: str) -> str:
    """Resolve full webhook URL for a channel."""
    config = _load_n8n_config()
    base = N8N_WEBHOOK_BASE or config.get("n8n_base_url", "http://localhost:5678")
    webhooks = config.get("webhooks", {})
    # Use multi-channel webhook for all channels — it routes internally
    path = webhooks.get("multi", "/webhook/multi-post")
    return f"{base}{path}"


# ---------------------------------------------------------------------------
# Content parsing
# ---------------------------------------------------------------------------

def _parse_promotion_file(path: Path) -> dict[str, str]:
    """Extract metadata and body from a generated .md promotion file.

    Returns dict with keys: title, content, utm_link, channel_key, post_at
    """
    raw = path.read_text()
    lines = raw.splitlines()

    meta: dict[str, str] = {}
    body_lines: list[str] = []
    in_body = False

    for line in lines:
        if line.strip() == "---":
            in_body = True
            continue
        if not in_body:
            # Parse comment-style header lines: # Key: value
            m = re.match(r"^#\s+(\w[\w\s]*):\s+(.+)$", line)
            if m:
                key = m.group(1).strip().lower().replace(" ", "_")
                meta[key] = m.group(2).strip()
        else:
            body_lines.append(line)

    content = "\n".join(body_lines).strip()

    # Extract title from first non-empty line of body (e.g. "Title: ...")
    title = ""
    for line in body_lines:
        stripped = line.strip()
        if stripped.startswith("Title:"):
            title = stripped[len("Title:"):].strip()
            break
        if stripped.startswith("**Title:**"):
            title = stripped[len("**Title:**"):].strip()
            break
        if stripped and not stripped.startswith("#"):
            title = stripped[:120]
            break

    return {
        "title": title,
        "content": content,
        "utm_link": meta.get("utm_link", ""),
        "channel_key": meta.get("channel_key", ""),
        "post_at": meta.get("post_at", ""),
    }


def _channel_key_from_filename(path: Path, hypothesis_id: str) -> str:
    """Derive channel key from promotion filename."""
    stem = path.stem  # e.g. H-006_reddit_saas_20240101_120000
    name_without_hid = stem[len(hypothesis_id) + 1:]  # strip "H-006_"
    segments = name_without_hid.split("_")
    return "_".join(segments[:-2])  # drop trailing date + time


def _map_channel_to_n8n(channel_key: str) -> str:
    """Map internal channel keys to n8n channel names."""
    if channel_key.startswith("reddit"):
        return "reddit"
    if channel_key in ("twitter", "x_twitter"):
        return "twitter"
    if channel_key == "linkedin":
        return "linkedin"
    if channel_key == "indie_hackers":
        return "indie_hackers"
    if channel_key == "bluesky":
        return "bluesky"
    return channel_key


# Channels that have no API — n8n returns content for manual posting
MANUAL_CHANNELS = {"indie_hackers", "reddit"}


def _subreddit_from_channel(channel_key: str) -> str:
    """Derive subreddit name from channel key."""
    mapping = {
        "reddit_saas": "SaaS",
        "reddit_entrepreneur": "Entrepreneur",
        "reddit_smallbusiness": "smallbusiness",
        "reddit_passive_income": "passive_income",
        "reddit_sidehustle": "sidehustle",
    }
    return mapping.get(channel_key, channel_key.replace("reddit_", ""))


# ---------------------------------------------------------------------------
# Core posting
# ---------------------------------------------------------------------------

def post_to_channel(
    channel: str,
    content: str,
    hypothesis_id: str,
    variant: str = "A",
    title: str = "",
    utm_link: str = "",
    subreddit: str = "",
    timeout: int = 30,
) -> dict[str, Any]:
    """Post content to a channel via n8n webhook.

    Args:
        channel: n8n channel name — "twitter", "reddit", or "linkedin"
        content: Full post content to send
        hypothesis_id: e.g. "H-006"
        variant: A/B variant label (default "A")
        title: Post title (required for Reddit)
        utm_link: Tracking URL to include in metadata
        subreddit: Subreddit name without r/ prefix (Reddit only)
        timeout: HTTP timeout in seconds

    Returns:
        dict with keys: success, channel, hypothesis_id, post_url, error (if failed)
    """
    url = _webhook_url(channel)
    payload: dict[str, Any] = {
        "channel": channel,
        "content": content,
        "hypothesis_id": hypothesis_id,
        "variant": variant,
        "utm_link": utm_link,
    }
    if title:
        payload["title"] = title
    if subreddit:
        payload["subreddit"] = subreddit

    try:
        response = httpx.post(url, json=payload, timeout=timeout)
        response.raise_for_status()
        result = response.json()
        result["channel"] = channel
        result["hypothesis_id"] = hypothesis_id
        return result
    except httpx.TimeoutException:
        return {
            "success": False,
            "channel": channel,
            "hypothesis_id": hypothesis_id,
            "error": f"Request timed out after {timeout}s",
        }
    except httpx.HTTPStatusError as exc:
        return {
            "success": False,
            "channel": channel,
            "hypothesis_id": hypothesis_id,
            "error": f"HTTP {exc.response.status_code}: {exc.response.text[:200]}",
        }
    except Exception as exc:
        return {
            "success": False,
            "channel": channel,
            "hypothesis_id": hypothesis_id,
            "error": str(exc),
        }


def post_to_all_channels(
    hypothesis_id: str,
    variant: str = "A",
) -> list[dict[str, Any]]:
    """Read promotion posts for a hypothesis and send to all configured channels.

    Reads .md files from data/promotions/, parses content, and POSTs each
    to the appropriate n8n webhook. Updates post_tracker with results.

    Args:
        hypothesis_id: e.g. "H-006"
        variant: A/B variant label (default "A")

    Returns:
        List of result dicts, one per post attempted.
    """
    from promoters.channels import get_existing_posts

    promo_files = get_existing_posts(hypothesis_id)
    if not promo_files:
        return [
            {
                "success": False,
                "hypothesis_id": hypothesis_id,
                "error": "No promotion files found. Run --generate-promos first.",
            }
        ]

    results: list[dict[str, Any]] = []

    for path in promo_files:
        channel_key = _channel_key_from_filename(path, hypothesis_id)
        n8n_channel = _map_channel_to_n8n(channel_key)

        parsed = _parse_promotion_file(path)
        content = parsed["content"]
        title = parsed["title"]
        utm_link = parsed["utm_link"]
        subreddit = _subreddit_from_channel(channel_key) if n8n_channel == "reddit" else ""

        # Add to tracker as pending before attempting
        tracker_entry = add_post(hypothesis_id, channel_key, notes=f"auto-promote variant={variant}")

        result = post_to_channel(
            channel=n8n_channel,
            content=content,
            hypothesis_id=hypothesis_id,
            variant=variant,
            title=title,
            utm_link=utm_link,
            subreddit=subreddit,
        )
        result["channel_key"] = channel_key
        result["file"] = str(path)

        # Update tracker with result
        post_url = result.get("post_url", "")
        if result.get("manual"):
            new_status = "pending"  # manual channels stay pending until user posts
        elif result.get("success"):
            new_status = "posted"
        else:
            new_status = "pending"
        mark_post_status(tracker_entry["id"], new_status, url_posted=post_url)

        results.append(result)

    return results


# ---------------------------------------------------------------------------
# Status check
# ---------------------------------------------------------------------------

def get_n8n_status(timeout: int = 5) -> dict[str, Any]:
    """Check if n8n is running and webhooks are reachable.

    Returns:
        dict with keys: running (bool), base_url, webhooks_configured, error
    """
    config = _load_n8n_config()
    base = N8N_WEBHOOK_BASE or config.get("n8n_base_url", "http://localhost:5678")

    try:
        response = httpx.get(base, timeout=timeout, follow_redirects=True)
        running = response.status_code < 500
    except httpx.ConnectError:
        return {
            "running": False,
            "base_url": base,
            "webhooks_configured": False,
            "error": f"Cannot connect to n8n at {base}. Is it running? Try: cd n8n && docker compose up -d",
        }
    except Exception as exc:
        return {
            "running": False,
            "base_url": base,
            "webhooks_configured": False,
            "error": str(exc),
        }

    webhooks = config.get("webhooks", {})
    return {
        "running": running,
        "base_url": base,
        "webhooks_configured": bool(webhooks),
        "webhook_paths": webhooks,
        "error": None,
    }


# ---------------------------------------------------------------------------
# Channel classification
# ---------------------------------------------------------------------------

def classify_channels(
    hypothesis_id: str,
) -> dict[str, list[dict[str, Any]]]:
    """Split promotion files into auto-postable and manual channels.

    Returns:
        {"auto": [...], "manual": [...]} where each item has
        channel_key, n8n_channel, file path, and parsed content.
    """
    from promoters.channels import get_existing_posts

    promo_files = get_existing_posts(hypothesis_id)
    result: dict[str, list[dict[str, Any]]] = {"auto": [], "manual": []}

    for path in promo_files:
        channel_key = _channel_key_from_filename(path, hypothesis_id)
        n8n_channel = _map_channel_to_n8n(channel_key)
        parsed = _parse_promotion_file(path)

        entry = {
            "channel_key": channel_key,
            "n8n_channel": n8n_channel,
            "file": str(path),
            "title": parsed["title"],
            "content": parsed["content"],
            "utm_link": parsed["utm_link"],
        }

        if n8n_channel in MANUAL_CHANNELS:
            result["manual"].append(entry)
        else:
            result["auto"].append(entry)

    return result


# ---------------------------------------------------------------------------
# Schedule trigger
# ---------------------------------------------------------------------------

def trigger_validation(hypothesis_id: str = "H-006", timeout: int = 60) -> dict[str, Any]:
    """Trigger a validation check via n8n scheduled workflow webhook.

    This calls the n8n trigger-validation webhook, which in turn calls
    the pipeline API server to run a validation cycle.

    Returns:
        Response dict from n8n or error dict.
    """
    config = _load_n8n_config()
    base = N8N_WEBHOOK_BASE or config.get("n8n_base_url", "http://localhost:5678")
    webhooks = config.get("webhooks", {})
    path = webhooks.get("trigger_validation", "/webhook/trigger-validation")
    url = f"{base}{path}"

    try:
        response = httpx.post(
            url,
            json={"hypothesis_id": hypothesis_id},
            timeout=timeout,
        )
        response.raise_for_status()
        return response.json()
    except Exception as exc:
        return {"success": False, "error": str(exc)}
