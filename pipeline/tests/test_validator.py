import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from validators.validator import decide_next_action, summarize_metrics


class ValidatorTests(unittest.TestCase):
    def test_promote_distribution_when_traffic_is_too_low(self):
        metrics = summarize_metrics(
            events=[{"event": "page_view", "referrer": "direct"} for _ in range(12)],
            waitlist=[],
            criteria={},
        )
        action = decide_next_action(metrics, {"min_pageviews": 100})
        self.assertEqual(action["decision"], "promote_distribution")

    def test_rewrite_hero_when_scroll_is_weak(self):
        events = [{"event": "page_view", "referrer": "direct"} for _ in range(120)]
        events += [{"event": "scroll", "metadata": {"depth": 25}} for _ in range(20)]
        metrics = summarize_metrics(events=events, waitlist=[], criteria={})
        action = decide_next_action(
            metrics,
            {"min_pageviews": 100, "min_scroll_50_rate": 0.35, "target_conversion_rate": 0.1},
        )
        self.assertEqual(action["decision"], "rewrite_hero")

    def test_double_down_when_conversion_is_strong(self):
        events = [{"event": "page_view", "referrer": "reddit"} for _ in range(120)]
        events += [{"event": "scroll", "metadata": {"depth": 75}} for _ in range(80)]
        waitlist = [{"source": "reddit"} for _ in range(28)]
        metrics = summarize_metrics(events=events, waitlist=waitlist, criteria={})
        action = decide_next_action(
            metrics,
            {
                "min_pageviews": 100,
                "min_waitlist_signups": 10,
                "strong_conversion_rate": 0.2,
                "target_conversion_rate": 0.1,
                "min_scroll_50_rate": 0.35,
            },
        )
        self.assertEqual(action["decision"], "double_down")
        self.assertEqual(metrics["top_referrers"][0][0], "reddit")


if __name__ == "__main__":
    unittest.main()
