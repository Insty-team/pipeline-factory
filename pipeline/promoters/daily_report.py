"""
일일 회고 리포트 생성기
매일 analytics 결과를 분석하여:
1. 어제 무슨 일이 있었는지 요약
2. 어떤 가설이 잘 되고 있는지 / 안 되는지
3. 다음에 어떻게 대응할지 제안
4. 리포트를 data/daily_reports/에 저장 + Supabase에 업로드

Claude CLI 없이 rule-based로 동작 (AI 분석은 bonus)
"""
import json
import os
import requests
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.parent
load_dotenv(BASE_DIR / ".env")

TARGETS_PATH = BASE_DIR / "config" / "validation_targets.json"
ANALYTICS_DIR = BASE_DIR / "data" / "analytics"
REPORTS_DIR = BASE_DIR / "data" / "daily_reports"
HISTORY_PATH = BASE_DIR / "data" / "promotions" / "bluesky_history.json"


def load_targets():
    if not TARGETS_PATH.exists():
        return {}
    with open(TARGETS_PATH) as f:
        return json.load(f)


def get_latest_analytics(hyp_id):
    hyp_dir = ANALYTICS_DIR / hyp_id
    if not hyp_dir.exists():
        return None
    reports = sorted(hyp_dir.glob("report_*.json"))
    if not reports:
        return None
    with open(reports[-1]) as f:
        return json.load(f)


def get_previous_report():
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    reports = sorted(REPORTS_DIR.glob("report_*.json"))
    if not reports:
        return None
    with open(reports[-1]) as f:
        return json.load(f)


def analyze_hypothesis(hyp_id, config, analytics, prev_report):
    result = {
        "hypothesis_id": hyp_id,
        "title": config.get("title", hyp_id),
        "live_url": config.get("live_url", ""),
    }

    if not analytics:
        result["status"] = "no_data"
        result["summary"] = "No analytics data yet"
        result["action"] = "Wait for data collection"
        return result

    landing = analytics.get("landing", {})
    views = landing.get("total_views", 0)
    signups = landing.get("total_signups", 0)
    conv = landing.get("conversion_rate", 0)

    criteria = config.get("success_criteria", {})
    target_views = criteria.get("min_pageviews", 100)
    target_signups = criteria.get("min_waitlist_signups", 15)
    target_conv = criteria.get("target_conversion_rate", 0.10)

    result["metrics"] = {"views": views, "signups": signups, "conversion": conv}
    result["targets"] = {"views": target_views, "signups": target_signups, "conversion": target_conv}

    # Compare with previous report
    prev_metrics = None
    if prev_report:
        for ph in prev_report.get("hypotheses", []):
            if ph.get("hypothesis_id") == hyp_id:
                prev_metrics = ph.get("metrics")
                break

    if prev_metrics:
        result["delta"] = {
            "views": views - prev_metrics.get("views", 0),
            "signups": signups - prev_metrics.get("signups", 0),
        }
    else:
        result["delta"] = {"views": 0, "signups": 0}

    # Diagnosis
    if views < 30:
        result["status"] = "need_traffic"
        result["diagnosis"] = "Distribution problem — not enough people seeing it"
        result["action"] = "Increase promotion: post on more channels, engage in communities, try paid boost"
    elif conv >= target_conv and views >= target_views:
        result["status"] = "strong_signal"
        result["diagnosis"] = "Both traffic and conversion are healthy"
        result["action"] = "Consider scaling: more traffic sources, start building MVP"
    elif conv >= target_conv and views < target_views:
        result["status"] = "good_conversion_low_traffic"
        result["diagnosis"] = "Message resonates but not enough exposure"
        result["action"] = "Double down on distribution — same message, more channels"
    elif conv < target_conv and views >= target_views:
        result["status"] = "traffic_but_low_conversion"
        result["diagnosis"] = "People see it but dont sign up — messaging/offer problem"
        result["action"] = "Rewrite landing page: headline, CTA, value prop. Consider A/B test"
    else:
        result["status"] = "early_stage"
        result["diagnosis"] = "Still gathering data"
        result["action"] = "Continue promoting, check back in 3-5 days"

    # Trend
    if result["delta"]["views"] == 0 and views > 0:
        result["trend"] = "stagnant"
        result["trend_note"] = "No new views — promotion may have stopped"
    elif result["delta"]["views"] > 0:
        result["trend"] = "growing"
        result["trend_note"] = f"+{result[delta][views]} views since last report"
    else:
        result["trend"] = "unknown"
        result["trend_note"] = "First report"

    return result


def generate_report():
    targets = load_targets()
    prev_report = get_previous_report()

    report = {
        "date": datetime.now().isoformat(),
        "hypotheses": [],
        "summary": "",
        "top_action": "",
    }

    for hyp_id, config in targets.items():
        analytics = get_latest_analytics(hyp_id)
        analysis = analyze_hypothesis(hyp_id, config, analytics, prev_report)
        report["hypotheses"].append(analysis)

    # Overall summary
    active = len(report["hypotheses"])
    strong = [h for h in report["hypotheses"] if h.get("status") == "strong_signal"]
    need_traffic = [h for h in report["hypotheses"] if h.get("status") == "need_traffic"]

    report["summary"] = f"{active} active hypotheses. {len(strong)} with strong signal, {len(need_traffic)} need more traffic."

    # Top priority action
    if need_traffic:
        worst = min(need_traffic, key=lambda h: h.get("metrics", {}).get("views", 999))
        report["top_action"] = f"Priority: get traffic to {worst[hypothesis_id]} ({worst[title]}) — currently {worst.get(metrics, {}).get(views, 0)} views"
    elif strong:
        report["top_action"] = f"Consider scaling {strong[0][hypothesis_id]} — conversion is above target"
    else:
        report["top_action"] = "Continue current promotion strategy, check back tomorrow"

    # Save report
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    date_str = datetime.now().strftime("%Y%m%d")
    report_path = REPORTS_DIR / f"report_{date_str}.json"
    with open(report_path, "w") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    # Upload to Supabase for dashboard
    try:
        sb_url = os.environ.get("SUPABASE_URL", "")
        sb_key = os.environ.get("SUPABASE_ANON_KEY", "")
        if sb_url and sb_key:
            requests.post(
                f"{sb_url}/rest/v1/events",
                headers={"apikey": sb_key, "Authorization": f"Bearer {sb_key}",
                         "Content-Type": "application/json", "Prefer": "return=minimal"},
                json={"hypothesis": "daily-report", "event": "report",
                      "metadata": json.dumps(report, ensure_ascii=False)},
                timeout=10
            )
    except Exception:
        pass

    # Generate today TODO list
    todos = []
    for h in report["hypotheses"]:
        hid = h["hypothesis_id"]
        config = targets.get(hid, {})

        # Check if hypothesis has no promotion content yet
        promo_dir = BASE_DIR / "data" / "promotions"
        has_promo = list(promo_dir.glob(f"{hid}*.md")) if promo_dir.exists() else []
        if not has_promo and h.get("status") != "no_data":
            todos.append(f"Create promotion content for {hid} ({h.get(title, )})")

        # Check if hypothesis is deployed but has 0 views
        if h.get("metrics", {}).get("views", 0) == 0 and config.get("deployed_at"):
            todos.append(f"Start promoting {hid} — deployed but 0 views")

        # Check if traffic stagnant
        if h.get("trend") == "stagnant":
            todos.append(f"Boost {hid} — no new views since last report")

        # Check if good conversion but low traffic
        if h.get("status") == "good_conversion_low_traffic":
            todos.append(f"Scale {hid} distribution — conversion is good, need more eyeballs")

    # Check for hypotheses without landing pages
    hyp_dir = BASE_DIR / "data" / "hypotheses"
    if hyp_dir.exists():
        for hf in hyp_dir.glob("*.json"):
            try:
                import re
                match = re.search(r"(H-\d+)", hf.name)
                if match:
                    hid = match.group(1)
                    if hid not in targets:
                        todos.append(f"Deploy landing page for {hid} — hypothesis exists but not in validation_targets")
            except Exception:
                pass

    report["todos"] = todos

    # Print summary
    print(f"\n=== Daily Report ({date_str}) ===")
    print(f"Summary: {report[summary]}")
    print(f"Top action: {report[top_action]}")
    for h in report["hypotheses"]:
        m = h.get("metrics", {})
        d = h.get("delta", {})
        print(f"\n  {h[hypothesis_id]}: {h.get(title, )}")
        print(f"    Views: {m.get(views, ?)} (+{d.get(views, 0)}) | Signups: {m.get(signups, ?)} (+{d.get(signups, 0)}) | Conv: {m.get(conversion, 0)*100:.1f}%")
        print(f"    Status: {h.get(status, ?)} | Trend: {h.get(trend, ?)}")
        print(f"    Diagnosis: {h.get(diagnosis, ?)}")
        print(f"    Action: {h.get(action, ?)}")

    if todos:
        print(f"\n  === TODAY TODO ===")
        for i, todo in enumerate(todos, 1):
            print(f"    {i}. {todo}")
    else:
        print(f"\n  All hypotheses on track. No urgent actions.")

    return report


if __name__ == "__main__":
    generate_report()
