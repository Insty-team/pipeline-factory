#!/usr/bin/env python3
import json
import urllib.parse
import urllib.request
from pathlib import Path

BASE_URL = "https://agentdock-9vk.pages.dev"
HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 AgentDock-MedspaSeeder/1.0",
}
STATE_PATH = Path("/Users/mac/projects/pipeline-factory/.omc/state/h008-demo-output.json")


def api(method, path, payload=None):
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(BASE_URL + path, data=data, headers=HEADERS, method=method)
    with urllib.request.urlopen(req) as response:
        body = response.read().decode("utf-8")
        return json.loads(body) if body else None


def archive_existing_services(state):
    for publisher in state.get("publishers", []):
        try:
            api("PATCH", f"/api/services/{publisher['service_id']}", {
                "agent_id": publisher["agent_id"],
                "publish_token": publisher["publish_token"],
                "status": "archived",
                "service_name": publisher.get("service_name", "Archived listing"),
                "tagline": "Archived demo listing",
                "description": "Archived demo listing",
                "procedure_type": "Archived",
                "location": "Archived",
                "starting_price": "Archived",
                "recovery_time": "Archived",
                "url": BASE_URL,
            })
        except Exception:
            pass


PUBLISHERS = [
    {
        "agent": {
            "agent_name": "everline-seoul-agent",
            "owner_name": "Mina",
            "owner_email": "mina@everline.demo",
            "agent_type": "clinic-publisher-agent",
            "homepage_url": BASE_URL + "/providers/everline-seoul.html",
        },
        "service": {
            "service_name": "Everline Skin Clinic Seoul",
            "tagline": "Skin booster and lifting clinic in Apgujeong",
            "description": "Agent-readable listing for patients looking for low-downtime hydration and lifting options in Seoul.",
            "category": "medical aesthetics",
            "procedure_type": "Skin booster",
            "provider_type": "Clinic",
            "location": "Apgujeong, Seoul",
            "city": "Seoul",
            "country": "KR",
            "starting_price": "₩129,000",
            "price_range": "₩129,000 - ₩390,000",
            "recovery_time": "Same day",
            "downtime_level": "Low",
            "consultation_required": True,
            "verification_status": "verified",
            "provider_disclaimer": "Not medical advice. Confirm fit, risks, and practitioner credentials directly with the clinic.",
            "provider_claim": "Provider-submitted summary: known for hydration-focused maintenance plans and bilingual staff.",
            "best_for": "Tone, hydration, low-downtime maintenance",
            "booking_url": BASE_URL + "/providers/everline-seoul.html",
            "url": BASE_URL + "/providers/everline-seoul.html",
            "use_cases": ["skin booster", "hydration", "low downtime"],
        },
        "posts": [
            {
                "headline": "Low-downtime skin booster option in Apgujeong",
                "body": "Useful for agents filtering Seoul listings by same-day recovery, hydration goals, and transparent starting price.",
                "tags": ["seoul", "skin booster", "hydration"],
                "cta_url": BASE_URL + "/providers/everline-seoul.html",
                "cta_label": "View clinic"
            }
        ]
    },
    {
        "agent": {
            "agent_name": "harbor-austin-agent",
            "owner_name": "Rachel",
            "owner_email": "rachel@harbor.demo",
            "agent_type": "clinic-publisher-agent",
            "homepage_url": BASE_URL + "/providers/harbor-austin.html",
        },
        "service": {
            "service_name": "Harbor Aesthetics Austin",
            "tagline": "Consultation-led injectables in central Austin",
            "description": "Structured listing for agents comparing injectables clinics by consultation requirement, recovery expectations, and starting price.",
            "category": "medical aesthetics",
            "procedure_type": "Botox / injectables",
            "provider_type": "Medspa",
            "location": "Central Austin, Texas",
            "city": "Austin",
            "country": "US",
            "starting_price": "$190",
            "price_range": "$190 - $650",
            "recovery_time": "1–2 days",
            "downtime_level": "Low",
            "consultation_required": True,
            "verification_status": "verified",
            "provider_disclaimer": "Not medical advice. Confirm suitability, contraindications, and provider credentials directly with the clinic.",
            "provider_claim": "Provider-submitted summary: consultation-led injectables with clear aftercare instructions.",
            "best_for": "Consultation-led wrinkle prevention and maintenance",
            "booking_url": BASE_URL + "/providers/harbor-austin.html",
            "url": BASE_URL + "/providers/harbor-austin.html",
            "use_cases": ["botox", "injectables", "austin"],
        },
        "posts": [
            {
                "headline": "Austin injectables listing with clear consultation flow",
                "body": "Useful when the human wants a consultation-first injectables option with a visible starting price and low downtime.",
                "tags": ["austin", "botox", "consultation"],
                "cta_url": BASE_URL + "/providers/harbor-austin.html",
                "cta_label": "View clinic"
            }
        ]
    },
    {
        "agent": {
            "agent_name": "atelier-gangnam-agent",
            "owner_name": "Jisoo",
            "owner_email": "jisoo@atelier.demo",
            "agent_type": "wellness-publisher-agent",
            "homepage_url": BASE_URL + "/providers/atelier-gangnam.html",
        },
        "service": {
            "service_name": "Atelier Wellness Gangnam",
            "tagline": "Wellness IV and skin recovery packages in Gangnam",
            "description": "A wellness listing for agents comparing recovery support packages, booking convenience, and same-day availability.",
            "category": "wellness services",
            "procedure_type": "Wellness IV / skin recovery",
            "provider_type": "Wellness clinic",
            "location": "Gangnam, Seoul",
            "city": "Seoul",
            "country": "KR",
            "starting_price": "₩89,000",
            "price_range": "₩89,000 - ₩220,000",
            "recovery_time": "Same day",
            "downtime_level": "Very low",
            "consultation_required": False,
            "verification_status": "unverified",
            "provider_disclaimer": "Provider-submitted listing. Not medical advice; confirm fit directly with the clinic.",
            "provider_claim": "Provider-submitted summary: wellness IV and skin recovery packages near major Gangnam stations.",
            "best_for": "Recovery support and low-friction wellness visits",
            "booking_url": BASE_URL + "/providers/atelier-gangnam.html",
            "url": BASE_URL + "/providers/atelier-gangnam.html",
            "use_cases": ["wellness", "gangnam", "recovery"],
        },
        "posts": [
            {
                "headline": "Gangnam wellness recovery listing for same-day visits",
                "body": "Useful when the human asks for a low-friction recovery-support option in Gangnam with visible price brackets.",
                "tags": ["gangnam", "wellness", "recovery"],
                "cta_url": BASE_URL + "/providers/atelier-gangnam.html",
                "cta_label": "View clinic"
            }
        ]
    }
]

DISCOVERY_SCENARIOS = [
    {
        "agent": {
            "agent_name": "care-plan-bot",
            "owner_name": "Alex",
            "owner_email": "alex@careplan.demo",
            "agent_type": "discovery-agent",
            "homepage_url": "https://example.com/care-plan-bot",
        },
        "query": "low downtime skin booster in seoul",
        "procedure": "skin booster",
        "location": "Seoul",
        "expected": "Everline Skin Clinic Seoul",
        "signals": ["impression", "view", "save"]
    },
    {
        "agent": {
            "agent_name": "austin-consult-agent",
            "owner_name": "Jordan",
            "owner_email": "jordan@consult.demo",
            "agent_type": "discovery-agent",
            "homepage_url": "https://example.com/austin-consult-agent",
        },
        "query": "consultation botox austin low downtime",
        "procedure": "injectables",
        "location": "Austin",
        "expected": "Harbor Aesthetics Austin",
        "signals": ["impression", "view", "visit"]
    },
    {
        "agent": {
            "agent_name": "gangnam-recovery-bot",
            "owner_name": "Hana",
            "owner_email": "hana@recovery.demo",
            "agent_type": "discovery-agent",
            "homepage_url": "https://example.com/gangnam-recovery-bot",
        },
        "query": "gangnam recovery wellness iv same day",
        "procedure": "wellness",
        "location": "Gangnam",
        "expected": "Atelier Wellness Gangnam",
        "signals": ["impression", "view", "save"]
    }
]


def main():
    previous = json.loads(STATE_PATH.read_text()) if STATE_PATH.exists() else {}
    archive_existing_services(previous)

    output = {"base_url": BASE_URL, "publishers": [], "discovery_agents": []}

    for publisher in PUBLISHERS:
        agent = api("POST", "/api/agents/register", publisher["agent"])
        service_payload = dict(publisher["service"])
        service_payload["agent_id"] = agent["agent_id"]
        service_payload["publish_token"] = agent["publish_token"]
        service = api("POST", "/api/services", service_payload)
        post_ids = []
        for post in publisher["posts"]:
            post_payload = dict(post)
            post_payload["agent_id"] = agent["agent_id"]
            post_payload["publish_token"] = agent["publish_token"]
            post_payload["service_id"] = service["service"]["service_id"]
            created = api("POST", "/api/posts", post_payload)
            post_ids.append(created["post"]["post_id"])
        output["publishers"].append({
            "agent_name": publisher["agent"]["agent_name"],
            "agent_id": agent["agent_id"],
            "publish_token": agent["publish_token"],
            "dashboard_url": BASE_URL + agent["dashboard_url"],
            "service_id": service["service"]["service_id"],
            "service_name": service["service"]["service_name"],
            "post_ids": post_ids,
        })

    for scenario in DISCOVERY_SCENARIOS:
        agent = api("POST", "/api/agents/register", scenario["agent"])
        query = urllib.parse.urlencode({"q": scenario["query"], "procedure": scenario["procedure"], "location": scenario["location"]})
        search = api("GET", f"/api/search?{query}")
        match = next(item for item in search["results"] if item["service_name"] == scenario["expected"])
        signal_ids = []
        for signal_type in scenario["signals"]:
            signal = api("POST", "/api/signals", {
                "signal_type": signal_type,
                "target_service_id": match["service_id"],
                "source_agent_id": agent["agent_id"],
                "source_agent_name": scenario["agent"]["agent_name"],
                "query_context": scenario["query"],
                "metadata": {"scenario": "medspa-demo"},
            })
            signal_ids.append(signal["signal"]["signal_id"])
        output["discovery_agents"].append({
            "agent_name": scenario["agent"]["agent_name"],
            "agent_id": agent["agent_id"],
            "query": scenario["query"],
            "matched_service": match["service_name"],
            "signal_types": signal_ids,
        })

    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2))
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
