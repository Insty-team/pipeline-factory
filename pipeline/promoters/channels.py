"""
Promotion post generator.

Reads promotion_hypotheses from validation_targets.json and generates
ready-to-post content for Reddit, Indie Hackers, and X/Twitter.

Posts are generated using AI with research context when available.
Posts are saved to data/promotions/{hypothesis_id}_{channel}_{timestamp}.md

Research-based posts include research_based: true in the metadata header.
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from ai import ask  # noqa: E402

CONFIG_PATH = BASE_DIR / "config" / "validation_targets.json"
PROMOTIONS_DIR = BASE_DIR / "data" / "promotions"

CHANNEL_LABELS = {
    "reddit_saas": "Reddit /r/SaaS",
    "reddit_entrepreneur": "Reddit /r/Entrepreneur",
    "reddit_smallbusiness": "Reddit /r/smallbusiness",
    "reddit_passive_income": "Reddit /r/passive_income",
    "reddit_sidehustle": "Reddit /r/sidehustle",
    "indie_hackers": "Indie Hackers",
    "twitter": "X / Twitter",
}

POSTING_INSTRUCTIONS = {
    "reddit_saas": "https://www.reddit.com/r/SaaS/submit",
    "reddit_entrepreneur": "https://www.reddit.com/r/Entrepreneur/submit",
    "reddit_smallbusiness": "https://www.reddit.com/r/smallbusiness/submit",
    "reddit_passive_income": "https://www.reddit.com/r/passive_income/submit",
    "reddit_sidehustle": "https://www.reddit.com/r/sidehustle/submit",
    "indie_hackers": "https://www.indiehackers.com/post/new",
    "twitter": "https://twitter.com/compose/tweet",
}


def _load_config() -> dict[str, Any]:
    return json.loads(CONFIG_PATH.read_text())


def _format_research_context(research: dict) -> str:
    """Format research dict into a readable block for the AI prompt."""
    lines = []

    if research.get("recommended_post_type"):
        lines.append(f"Recommended post type: {research['recommended_post_type']}")

    if research.get("patterns"):
        lines.append("\nWinning patterns:")
        for p in research["patterns"]:
            lines.append(f"  - {p}")

    if research.get("title_formulas"):
        lines.append("\nTitle formulas that work:")
        for f in research["title_formulas"]:
            lines.append(f"  - {f}")

    if research.get("examples"):
        lines.append("\nExample titles/hooks:")
        for e in research["examples"]:
            lines.append(f"  - {e}")

    if research.get("structure"):
        lines.append(f"\nOptimal post structure:\n{research['structure']}")

    if research.get("tone"):
        lines.append(f"\nTone: {research['tone']}")

    if research.get("avoid"):
        lines.append("\nAvoid these mistakes:")
        for a in research["avoid"]:
            lines.append(f"  - {a}")

    if research.get("cta_approach"):
        lines.append(f"\nCTA approach: {research['cta_approach']}")

    if research.get("channel_specific_rules"):
        lines.append("\nChannel-specific rules:")
        for r in research["channel_specific_rules"]:
            lines.append(f"  - {r}")

    return "\n".join(lines)


def _build_post_prompt(
    channel: str,
    live_url: str,
    title: str,
    utm_url: str,
    research: dict | None,
    hypothesis_config: dict | None = None,
) -> str:
    channel_label = CHANNEL_LABELS.get(channel, channel)

    # Build dynamic product block from hypothesis config
    product_lines = [
        f"- Name: {title}",
        f"- Landing page: {live_url}",
        f"- UTM link for this channel: {utm_url}",
    ]

    if hypothesis_config:
        # Pull channel-specific message from promotion_hypotheses
        promo_hyps = hypothesis_config.get("promotion_hypotheses", [])
        channel_message = ""
        for ph in promo_hyps:
            if ph.get("channel_key") == channel:
                channel_message = ph.get("message", "")
                break
        if channel_message:
            product_lines.append(f"- Channel value prop / angle: {channel_message}")

    base_prompt = f"""You are writing an authentic, non-promotional launch post for {channel_label}.

## Product
{chr(10).join(product_lines)}

"""

    if research:
        base_prompt += f"""## Research-Based Guidelines
The following research identifies what works on {channel_label}:

{_format_research_context(research)}

Apply these guidelines precisely when writing the post.

"""

    base_prompt += f"""## Task
Write a complete, ready-to-post promotion for {channel_label}.

Requirements:
- Follow the research guidelines above exactly
- Sound like a real person, not a marketer
- No corporate buzzwords ("revolutionary", "game-changing", "disrupting")
- Include a **Title:** line at the top as the post title
- Use the UTM link ({utm_url}) appropriately per channel norms
- For Reddit: put the link in the post body only if natural; otherwise note "link in comments"
- For Indie Hackers: end with a genuine community question
- For X/Twitter: write a 7-tweet thread with Tweet 1 through Tweet 7 clearly labeled

Write the complete post now. No preamble, no meta-commentary — just the post content."""

    return base_prompt


def _get_utm_url(hypothesis_config: dict, channel: str) -> str:
    """Derive the UTM URL for a channel from promotion_hypotheses, falling back to live_url."""
    live_url = hypothesis_config.get("live_url", "")
    for ph in hypothesis_config.get("promotion_hypotheses", []):
        if ph.get("channel_key") == channel:
            return ph.get("utm_link", live_url)
    return live_url


def generate_post(
    hypothesis_config: dict,
    channel: str,
    research: dict | None = None,
) -> str:
    """Generate a channel-specific post. Uses research if available.

    Args:
        hypothesis_config: The full hypothesis dict from validation_targets.json
        channel: Channel key (e.g. "reddit_saas")
        research: Optional research dict from researcher.research_channel()

    Returns:
        Generated post content as a string.
    """
    live_url = hypothesis_config.get("live_url", "")
    title = hypothesis_config.get("title", "")
    utm_url = _get_utm_url(hypothesis_config, channel)

    prompt = _build_post_prompt(channel, live_url, title, utm_url, research, hypothesis_config)
    return ask(prompt)


def generate_posts(
    hypothesis_id: str,
    research_map: dict[str, dict] | None = None,
) -> list[Path]:
    """Generate promotion posts for all channels for a given hypothesis.

    Args:
        hypothesis_id: e.g. "H-006"
        research_map: Optional channel->research dict from research_all_channels().
                      If None and researcher module available, runs research first.

    Returns list of saved file paths.
    """
    config = _load_config()
    if hypothesis_id not in config:
        raise KeyError(f"Unknown hypothesis: {hypothesis_id}")

    target = config[hypothesis_id]

    # Determine channels from promotion_hypotheses if available
    promo_hyps = target.get("promotion_hypotheses", [])
    if promo_hyps:
        channels = [ph["channel_key"] for ph in promo_hyps]
    else:
        channels = list(CHANNEL_LABELS.keys())

    # If no research provided, attempt to load saved research from disk
    if research_map is None:
        try:
            from promoters.researcher import load_research
            research_map = {}
            for ch in channels:
                saved = load_research(hypothesis_id, ch)
                if saved:
                    research_map[ch] = saved
        except ImportError:
            research_map = {}

    PROMOTIONS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    saved_paths: list[Path] = []

    for channel_key in channels:
        research = research_map.get(channel_key) if research_map else None
        content = generate_post(target, channel_key, research)
        label = CHANNEL_LABELS.get(channel_key, channel_key)
        post_url = POSTING_INSTRUCTIONS.get(channel_key, "")
        research_based = research is not None

        header = f"""# Promotion Post — {label}
# Hypothesis: {hypothesis_id} — {target.get('title', '')}
# Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
# UTM link: {_get_utm_url(target, channel_key)}
# Post at: {post_url}
# research_based: {str(research_based).lower()}
# Status: PENDING — post manually, then track in tracker.json
---

"""
        full_content = header + content

        filename = f"{hypothesis_id}_{channel_key}_{timestamp}.md"
        path = PROMOTIONS_DIR / filename
        path.write_text(full_content)
        saved_paths.append(path)

    return saved_paths


def get_existing_posts(hypothesis_id: str) -> list[Path]:
    """Return existing promotion post files for a hypothesis, sorted newest first."""
    if not PROMOTIONS_DIR.exists():
        return []
    matches = sorted(PROMOTIONS_DIR.glob(f"{hypothesis_id}_*.md"), reverse=True)
    return matches
