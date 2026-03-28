"""
Post tracker — records which promotion posts were made where.

Tracks: channel, url_posted, timestamp, status
Saved to data/promotions/tracker.json
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent.parent
TRACKER_PATH = BASE_DIR / "data" / "promotions" / "tracker.json"

VALID_STATUSES = {"pending", "posted", "removed", "flagged"}


def _load_tracker() -> list[dict[str, Any]]:
    if not TRACKER_PATH.exists():
        return []
    try:
        return json.loads(TRACKER_PATH.read_text())
    except (json.JSONDecodeError, OSError):
        return []


def _save_tracker(entries: list[dict[str, Any]]) -> None:
    TRACKER_PATH.parent.mkdir(parents=True, exist_ok=True)
    TRACKER_PATH.write_text(json.dumps(entries, ensure_ascii=False, indent=2))


def add_post(
    hypothesis_id: str,
    channel: str,
    url_posted: str = "",
    notes: str = "",
) -> dict[str, Any]:
    """Add a new post entry to the tracker. Returns the created entry."""
    entries = _load_tracker()
    entry: dict[str, Any] = {
        "id": f"{hypothesis_id}_{channel}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "hypothesis_id": hypothesis_id,
        "channel": channel,
        "url_posted": url_posted,
        "status": "pending",
        "notes": notes,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    entries.append(entry)
    _save_tracker(entries)
    return entry


def get_posts_for_hypothesis(hypothesis_id: str) -> list[dict[str, Any]]:
    """Return all tracker entries for a given hypothesis."""
    return [e for e in _load_tracker() if e.get("hypothesis_id") == hypothesis_id]


def mark_post_status(entry_id: str, status: str, url_posted: str = "", notes: str = "") -> dict[str, Any] | None:
    """Update the status of a tracked post. Returns updated entry or None if not found."""
    if status not in VALID_STATUSES:
        raise ValueError(f"Invalid status '{status}'. Must be one of: {', '.join(sorted(VALID_STATUSES))}")

    entries = _load_tracker()
    for entry in entries:
        if entry.get("id") == entry_id:
            entry["status"] = status
            entry["updated_at"] = datetime.now(timezone.utc).isoformat()
            if url_posted:
                entry["url_posted"] = url_posted
            if notes:
                entry["notes"] = notes
            _save_tracker(entries)
            return entry
    return None


def list_all_posts() -> list[dict[str, Any]]:
    """Return all tracked posts."""
    return _load_tracker()


def get_posted_channels(hypothesis_id: str) -> set[str]:
    """Return set of channel keys that have been posted (status == 'posted')."""
    return {
        e["channel"]
        for e in get_posts_for_hypothesis(hypothesis_id)
        if e.get("status") == "posted"
    }
