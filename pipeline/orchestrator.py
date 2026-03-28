"""
Pipeline Factory 오케스트레이터
수집 → 분석 → 가설 → (검증) 전체 루프를 실행한다.

Usage:
  python orchestrator.py              # 전체 1사이클
  python orchestrator.py --collect    # 수집만
  python orchestrator.py --analyze    # 분석만
  python orchestrator.py --hypothesize # 가설 생성만
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

from collectors.reference import run as collect
from analyzers.scorer import run as analyze
from generators.hypothesis import run as hypothesize

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

    # Step 1: 수집 (모드 B: 레퍼런스 기반)
    print("\n📡 Step 1: 수집")
    pain_points = collect()

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
    args = parser.parse_args()

    if args.collect:
        collect()
    elif args.analyze:
        analyze()
    elif args.hypothesize:
        hypothesize()
    else:
        run_full_cycle()


if __name__ == "__main__":
    main()
