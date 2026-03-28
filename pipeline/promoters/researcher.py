"""
Channel researcher — generates AI research on what post patterns work per channel.

Runs before post generation to produce evidence-based content guidelines.
Research results are saved to data/promotions/research/{hypothesis_id}_{channel}.json
and returned for the post generator to consume.

Usage:
    from promoters.researcher import research_channel, research_all_channels
    research = research_all_channels("H-006")
    # research["reddit_saas"] -> { channel, patterns, title_formulas, structure, tone, avoid, examples }
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from ai import ask, ask_json  # noqa: E402

CONFIG_PATH = BASE_DIR / "config" / "validation_targets.json"
RESEARCH_DIR = BASE_DIR / "data" / "promotions" / "research"

# Channel-specific context injected into prompts to guide the AI
CHANNEL_CONTEXT: dict[str, str] = {
    "reddit_saas": (
        "r/SaaS (264K members). Rules: no referral links, no blatant self-promotion. "
        "A Weekly Feedback Thread exists — preferred venue for product launches. "
        "Community hates 'I built X' opener and corporate tone. "
        "Loves failure/pain frames, specific numbers, and genuine engagement. "
        "Posting a regular post (not Weekly Thread) requires personal narrative and genuine value. "
        "Put product links in comments, not in post body."
    ),
    "reddit_entrepreneur": (
        "r/Entrepreneur (1.4M members). Low promo tolerance. "
        "10 karma required before posting. No unverified revenue claims. "
        "Best used for journey/advice posts that mention the product naturally. "
        "Stealth comment strategy (responding in existing threads) has higher ROI than new posts. "
        "Descriptive titles only — no 'I built X' opener."
    ),
    "reddit_smallbusiness": (
        "r/smallbusiness (1.6M members). Low promo tolerance, strict spam rules. "
        "Best use: comment in threads where people ask for scheduling tool recommendations. "
        "If posting: must be relevant small-business problem, not a product pitch. "
        "Use H.E.L.P. comment framework: mirror problem, explain why it occurs, list steps, "
        "optionally mention product as one solution."
    ),
    "indie_hackers": (
        "Indie Hackers — builder community. High tolerance for lifetime deals (LTD). "
        "Community values transparency, honest failures, and revenue numbers. "
        "Best post type: 750-1500 word journey/transformation post. "
        "Frame early adopters as co-builders. 90% value, 10% product. "
        "End with a genuine community question, not a link CTA. "
        "Product Hunt + IH cross-promotion is acceptable."
    ),
    "twitter": (
        "X/Twitter — fast-moving, hook-driven. First sentence determines 80%+ of engagement. "
        "7-tweet threads outperform single posts for product explanations. "
        "LTD community active under #buildinpublic and #indiehacker. "
        "Price contrast hook works well. Visual content (screenshots, gifs) gets 40% more engagement. "
        "CTA: question + link at end. Early velocity in first 30 minutes is critical."
    ),
}


def _load_config() -> dict[str, Any]:
    return json.loads(CONFIG_PATH.read_text())


def _build_research_prompt(hypothesis_config: dict, channel: str) -> str:
    title = hypothesis_config.get("title", "")
    live_url = hypothesis_config.get("live_url", "")
    channel_ctx = CHANNEL_CONTEXT.get(channel, f"Channel: {channel}")

    # Extract promotion_hypotheses entry for this channel if present
    promo_hyps = hypothesis_config.get("promotion_hypotheses", [])
    channel_message = ""
    for ph in promo_hyps:
        if ph.get("channel_key") == channel:
            channel_message = ph.get("message", "")
            break

    prompt = f"""You are a community marketing expert specializing in authentic, non-promotional launch posts that perform well on developer/builder communities.

## Product
- Title: {title}
- URL: {live_url}
- Core value prop: One-time $49 payment for a Calendly-alternative scheduling tool. No monthly fees, no per-seat pricing. Built for solopreneurs and small teams.
- Target audience: Freelancers, solopreneurs, small business owners who are frustrated with recurring SaaS subscriptions.
- Channel message goal: {channel_message or "Drive awareness and waitlist signups"}

## Channel
{channel_ctx}

## Research Task
Provide concrete, actionable research on what works on this specific channel for this type of product launch.

Respond in JSON with this exact structure:
{{
  "channel": "{channel}",
  "patterns": ["pattern1", "pattern2", "pattern3"],
  "title_formulas": ["formula1", "formula2", "formula3"],
  "structure": "Multi-line description of optimal post structure with specific section guidance",
  "tone": "Description of tone: what voice, vocabulary, what to sound like",
  "avoid": ["mistake1", "mistake2", "mistake3", "mistake4"],
  "examples": ["Example title or hook 1", "Example title or hook 2"],
  "cta_approach": "How to end the post / call to action guidance",
  "channel_specific_rules": ["rule1", "rule2", "rule3"],
  "recommended_post_type": "Which type of post (e.g. Weekly Feedback Thread, comment, thread, journey post)"
}}

Be specific to this product and channel combination. Include concrete title examples adapted for CalOnce's $49 lifetime deal positioning."""

    return prompt


def research_channel(hypothesis_config: dict, channel: str) -> dict:
    """Research what works on a specific channel for this type of product.

    Returns: { channel, patterns, title_formulas, structure, tone, avoid, examples,
               cta_approach, channel_specific_rules, recommended_post_type }
    """
    prompt = _build_research_prompt(hypothesis_config, channel)

    try:
        result = ask_json(prompt)
    except (ValueError, Exception) as exc:
        # Fallback: ask as text and wrap in minimal structure
        raw = ask(prompt)
        result = {
            "channel": channel,
            "patterns": [],
            "title_formulas": [],
            "structure": raw,
            "tone": "",
            "avoid": [],
            "examples": [],
            "cta_approach": "",
            "channel_specific_rules": [],
            "recommended_post_type": "post",
            "_parse_error": str(exc),
        }

    # Ensure required keys exist
    result.setdefault("channel", channel)
    result.setdefault("patterns", [])
    result.setdefault("title_formulas", [])
    result.setdefault("structure", "")
    result.setdefault("tone", "")
    result.setdefault("avoid", [])
    result.setdefault("examples", [])
    result.setdefault("cta_approach", "")
    result.setdefault("channel_specific_rules", [])
    result.setdefault("recommended_post_type", "post")

    return result


def research_all_channels(hypothesis_id: str) -> dict[str, dict]:
    """Research all channels for a hypothesis.

    Loads the hypothesis config, runs research per channel, saves each result
    to data/promotions/research/{hypothesis_id}_{channel}.json.

    Returns: channel_key -> research dict mapping.
    """
    config = _load_config()
    if hypothesis_id not in config:
        raise KeyError(f"Unknown hypothesis: {hypothesis_id}")

    hypothesis_config = config[hypothesis_id]

    # Determine channels from promotion_hypotheses if available, else use defaults
    promo_hyps = hypothesis_config.get("promotion_hypotheses", [])
    if promo_hyps:
        channels = [ph["channel_key"] for ph in promo_hyps]
    else:
        channels = list(CHANNEL_CONTEXT.keys())

    RESEARCH_DIR.mkdir(parents=True, exist_ok=True)

    results: dict[str, dict] = {}
    for channel in channels:
        print(f"  Researching {channel}...")
        research = research_channel(hypothesis_config, channel)
        results[channel] = research

        # Save to disk
        out_path = RESEARCH_DIR / f"{hypothesis_id}_{channel}.json"
        payload = {
            "hypothesis_id": hypothesis_id,
            "channel": channel,
            "researched_at": datetime.now().isoformat(),
            "research": research,
        }
        out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2))

    return results


def load_research(hypothesis_id: str, channel: str) -> dict | None:
    """Load saved research for a channel from disk. Returns None if not found."""
    path = RESEARCH_DIR / f"{hypothesis_id}_{channel}.json"
    if not path.exists():
        return None
    data = json.loads(path.read_text())
    return data.get("research")
