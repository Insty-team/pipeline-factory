"""
Pipeline Factory 오케스트레이터
수집 → 분석 → 가설 → (검증) 전체 루프를 실행한다.

Usage:
  python orchestrator.py                 # 전체 1사이클
  python orchestrator.py --collect       # 수집만
  python orchestrator.py --analyze       # 분석만
  python orchestrator.py --hypothesize   # 가설 생성만
  python orchestrator.py --validate --hypothesis-id H-006 --deploy
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

from collectors.reference import run as collect_us
from collectors.reference_kr import run as collect_kr
from analyzers.scorer import run as analyze
from generators.hypothesis import run as hypothesize
from validators.validator import run_validation, print_report

BASE_DIR = Path(__file__).parent
INSIGHTS_DIR = BASE_DIR / "data" / "insights"


def save_cycle_log(cycle_num: int, pain_points: list, scored: list, hypotheses: list):
    """사이클 실행 로그 저장"""
    log_dir = BASE_DIR / "data" / "cycles"
    log_dir.mkdir(parents=True, exist_ok=True)

    log = {
        "cycle": cycle_num,
        "timestamp": datetime.now().isoformat(),
        "stats": {
            "pain_points_collected": len(pain_points),
            "scored_passed": len(scored),
            "hypotheses_generated": len(hypotheses),
        },
        "hypotheses": [
            {
                "id": h.get("hypothesis_id"),
                "title": h.get("title"),
                "reference": h.get("reference_service"),
                "confidence": h.get("confidence"),
                "expected_mrr": h.get("expected_mrr"),
            }
            for h in hypotheses
        ],
    }

    path = log_dir / f"cycle_{cycle_num:03d}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(path, "w") as f:
        json.dump(log, f, ensure_ascii=False, indent=2)
    print(f"\n📝 사이클 로그: {path}")


def get_cycle_number() -> int:
    """현재 사이클 번호"""
    log_dir = BASE_DIR / "data" / "cycles"
    if not log_dir.exists():
        return 1
    return len(list(log_dir.glob("cycle_*.json"))) + 1


def run_full_cycle():
    """전체 파이프라인 1사이클 실행"""
    cycle = get_cycle_number()
    print(f"\n{'='*60}")
    print(f"🔄 Pipeline Factory — Cycle #{cycle}")
    print(f"{'='*60}")

    # Step 1: 수집 (모드 B: 레퍼런스 기반, 시장별)
    print("\n📡 Step 1: 수집")
    pain_points = collect_us() + collect_kr()

    if not pain_points:
        print("\n❌ 수집 실패 — 사이클 중단")
        return

    # Step 2: 분석
    print("\n🔍 Step 2: 분석")
    scored = analyze(pain_points)

    if not scored:
        print("\n❌ 분석 후 통과 항목 없음 — 사이클 중단")
        return

    # Step 3: 가설 생성
    print("\n💡 Step 3: 가설 생성")
    hypotheses = hypothesize(scored)

    if not hypotheses:
        print("\n❌ 가설 생성 실패 — 사이클 중단")
        return

    # 사이클 로그 저장
    save_cycle_log(cycle, pain_points, scored, hypotheses)

    # 요약
    print(f"\n{'='*60}")
    print(f"✅ Cycle #{cycle} 완료")
    print(f"   수집: {len(pain_points)}개 pain point")
    print(f"   분석: {len(scored)}개 통과 (신뢰도 0.7+)")
    print(f"   가설: {len(hypotheses)}개 생성")
    print(f"{'='*60}")

    for h in hypotheses:
        print(f"\n  📌 {h['hypothesis_id']}: {h.get('title', '?')}")
        print(f"     레퍼런스: {h.get('reference_service', '?')}")
        print(f"     차별화: {h.get('differentiation', '?')[:80]}")
        print(f"     빌드: {h.get('build_estimate', '?')} | MRR: {h.get('expected_mrr', '?')}")
        print(f"     검증: {h.get('validation_method', '?')}")
        print(f"     GO 기준: {h.get('go_criteria', '?')}")

    print(f"\n다음 단계: 가설 검증 (랜딩페이지 생성 + 배포)")
    return hypotheses


def main():
    parser = argparse.ArgumentParser(description="Pipeline Factory")
    parser.add_argument("--collect", action="store_true", help="수집만 실행")
    parser.add_argument("--analyze", action="store_true", help="분석만 실행")
    parser.add_argument("--hypothesize", action="store_true", help="가설 생성만 실행")
    parser.add_argument("--validate", action="store_true", help="단일 가설 검증 실행")
    parser.add_argument("--hypothesis-id", help="검증할 가설 ID (예: H-006)")
    parser.add_argument("--hours", type=int, help="검증 시 최근 N시간 데이터만 사용")
    parser.add_argument("--deploy", action="store_true", help="검증 전에 랜딩페이지 재배포")
    parser.add_argument("--init-hypothesis", help="Idea to turn into hypothesis")
    parser.add_argument("--market", choices=["US", "KR", "all"], default="all", help="시장 선택")
    args = parser.parse_args()

    if args.init_hypothesis:
        init_hypothesis(args.init_hypothesis, args.market)
    elif args.collect:
        if args.market == "US":
            collect_us()
        elif args.market == "KR":
            collect_kr()
        else:
            collect_us()
            collect_kr()
    elif args.analyze:
        analyze()
    elif args.hypothesize:
        hypothesize()
    elif args.validate:
        if not args.hypothesis_id:
            parser.error("--validate 사용 시 --hypothesis-id 필요")
        report = run_validation(args.hypothesis_id, hours=args.hours, deploy=args.deploy)
        print_report(report)
    else:
        run_full_cycle()


if __name__ == "__main__":
    main()


def init_hypothesis(idea: str, market: str = "all"):
    """사용자 아이디어를 가설로 구조화하고 저장"""
    import re
    from ai import ask_json

    markets = ["US", "KR"] if market == "all" else [market]

    print(f"\n{'='*60}")
    print(f"Initializing hypothesis from idea...")
    print(f"Idea: {idea}")
    print(f"Markets: {', '.join(markets)}")
    print(f"{'='*60}")

    prompt = f"""다음 아이디어를 구���화된 가설로 변환해줘:

아이디어: {idea}
타겟 시장: {', '.join(markets)}

다음 JSON 형식으로 작성:
{{
  "hypothesis_id": "H-XXX",
  "title": "한줄 제목",
  "category": "카테고리",
  "pain_point": "해결하려는 고객의 문제",
  "solution": {{
    "한줄": "솔루션 한줄 요약",
    "flow": ["1. 단계1", "2. 단계2", "3. 단계3"]
  }},
  "target_audience": "타겟 고객",
  "revenue_model": "수익 모델",
  "pricing": {{
    "model": "구독/사용량/거래수수료 등",
    "tiers": [
      {{"name": "Free", "price": "/bin/bash", "includes": "기본 기��"}},
      {{"name": "Pro", "price": "/mo", "includes": "전체 기능"}}
    ]
  }},
  "delivery_modes": ["web", "bot", "mcp", "api"],
  "competitive_positioning": {{"vs_existing": "기존 대비 차별점"}},
  "key_assumptions": ["가정1", "가정2", "가정3"],
  "risks": ["리스크1", "리스크2"],
  "validation_plan": {{
    "method": "랜딩페이지/봇/등",
    "success_criteria": {{
      "min_pageviews": 100,
      "min_waitlist_signups": 15,
      "target_conversion_rate": 0.10
    }}
  }},
  "markets": {json.dumps(markets)},
  "confidence": 0.5,
  "key_message": {{
    "hero": "히어로 메시지",
    "sub": "서브 메시지",
    "forbidden_words": ["사용 금지 단어들"]
  }}
}}

hypothesis_id는 기존 가설 번호 다음으로 자동 부여해줘.
현실적이고 ���직하게 작성. 과장 금지."""

    # Get next hypothesis number
    HYPOTHESES_DIR.mkdir(parents=True, exist_ok=True)
    existing = list(HYPOTHESES_DIR.glob("H-*.json"))
    numbers = []
    for f in existing:
        match = re.search(r'H-(\d+)', f.name)
        if match:
            numbers.append(int(match.group(1)))
    next_num = max(numbers) + 1 if numbers else 1

    hypothesis = ask_json(prompt)

    # Fix hypothesis ID
    if isinstance(hypothesis, dict):
        hypothesis["hypothesis_id"] = f"H-{next_num:03d}"
        hypothesis["created_at"] = datetime.now().isoformat()
        hypothesis["source"] = "init_hypothesis"
        hypothesis["original_idea"] = idea

        # Save
        filename = f"H-{next_num:03d}_{datetime.now().strftime('%Y%m%d')}.json"
        path = HYPOTHESES_DIR / filename
        with open(path, "w") as f:
            json.dump(hypothesis, f, ensure_ascii=False, indent=2)

        print(f"\n  Hypothesis saved: {path}")
        print(f"  ID: {hypothesis['hypothesis_id']}")
        print(f"  Title: {hypothesis.get('title', '?')}")
        print(f"  Pain: {hypothesis.get('pain_point', '?')[:80]}")
        print(f"  Markets: {hypothesis.get('markets', [])}")

        # Auto-build landing page
        print(f"\n  Building landing page...")
        try:
            from builders.landing import build_landing
            landing_dir = build_landing(str(path))
            print(f"  Landing page: {landing_dir}")

            # Auto-deploy
            print(f"  Deploying...")
            from deployers.cloudflare import deploy
            url = deploy(hypothesis["hypothesis_id"], landing_dir)
            print(f"  Live: {url}")
        except Exception as e:
            print(f"  Build/deploy skipped: {e}")
            print(f"  Run manually:")
            print(f"    python3 builders/landing.py --hypothesis-file {path}")
            print(f"    python3 deployers/cloudflare.py --hypothesis-id {hypothesis['hypothesis_id']} --dir <landing-dir>")

        return hypothesis
    else:
        print("  ERROR: Failed to generate hypothesis")
        return None
