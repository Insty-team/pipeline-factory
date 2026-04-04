from typing import Optional, List, Dict, Any
"""
Step 2: 분석 모듈
수집된 pain point를 필터링하고 신뢰도 점수를 매겨 차별화 기회를 평가한다.

입력: data/pain_points/*.json
출력: data/pain_points/scored_{timestamp}.json (신뢰도 0.7+ 만)
"""

import json
from datetime import datetime
from pathlib import Path

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))
from ai import ask_json

BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data" / "pain_points"
CONFIG_PATH = BASE_DIR / "config" / "sources.json"


def load_latest_pain_points() -> List[dict]:
    """가장 최근 수집된 pain point 파일 로드"""
    files = sorted(DATA_DIR.glob("mode_*.json"), reverse=True)
    if not files:
        print("⚠️ 수집된 pain point 파일이 없습니다. collectors를 먼저 실행하세요.")
        return []

    with open(files[0]) as f:
        data = json.load(f)
    print(f"📂 로드: {files[0].name} ({len(data)}개)")
    return data


def filter_by_confidence(pain_points: list[dict], threshold: float = 0.7) -> List[dict]:
    """신뢰도 기준 필터링"""
    passed = [pp for pp in pain_points if pp.get("confidence", 0) >= threshold]
    filtered = len(pain_points) - len(passed)
    print(f"  필터: {len(pain_points)}개 → {len(passed)}개 (confidence >= {threshold}, {filtered}개 제외)")
    return passed


def deduplicate(pain_points: list[dict]) -> List[dict]:
    """같은 서비스+카테고리 중복 제거 (confidence 높은 것 유지)"""
    seen = {}
    for pp in pain_points:
        key = f"{pp.get('service', '')}:{pp.get('category', '')}:{pp.get('pain_point', '')[:30]}"
        if key not in seen or pp.get("confidence", 0) > seen[key].get("confidence", 0):
            seen[key] = pp

    result = list(seen.values())
    deduped = len(pain_points) - len(result)
    if deduped > 0:
        print(f"  중복 제거: {deduped}개")
    return result


def enrich_with_market_analysis(pain_points: list[dict]) -> List[dict]:
    """Claude CLI로 각 pain point에 시장 분석 추가"""
    if not pain_points:
        return []

    pp_text = json.dumps(pain_points, ensure_ascii=False, indent=2)

    prompt = f"""다음은 기존 서비스의 pain point 목록이다:

{pp_text}

각 pain point에 대해 다음을 추가 분석해줘:

1. market_size: "small" / "medium" / "large" (타겟 유저 규모 추정)
2. build_difficulty: "easy" (1~3일) / "medium" (1~2주) / "hard" (1개월+)
3. revenue_potential: 월 예상 MRR 범위 (예: "$500~2,000")
4. existing_alternatives: 이미 이 문제를 해결하려는 서비스가 있는지 (있으면 이름+약점)
5. recommended_action: "build_saas" / "build_tool" / "build_alternative_page" / "skip"
6. action_reason: 추천 이유 (한 줄)

기존 데이터에 이 필드들을 추가한 JSON 배열로 응답."""

    try:
        return ask_json(prompt)
    except Exception as e:
        print(f"  AI enrichment error: {e}")

    return pain_points


def score_and_rank(pain_points: list[dict]) -> List[dict]:
    """최종 점수 계산 + 랭킹"""
    for pp in pain_points:
        # 복합 점수 = 신뢰도(30%) + 시장 크기(25%) + 빌드 용이성(25%) + 수익 잠재력(20%)
        conf = pp.get("confidence", 0.5)

        market_scores = {"large": 1.0, "medium": 0.6, "small": 0.3}
        market = market_scores.get(pp.get("market_size", "small"), 0.3)

        build_scores = {"easy": 1.0, "medium": 0.5, "hard": 0.2}
        build = build_scores.get(pp.get("build_difficulty", "medium"), 0.5)

        # revenue_potential에서 숫자 추출
        rev_str = pp.get("revenue_potential", "$500")
        import re
        rev_nums = re.findall(r'\d+', rev_str.replace(",", ""))
        rev_avg = sum(int(n) for n in rev_nums) / len(rev_nums) if rev_nums else 500
        rev_score = min(rev_avg / 5000, 1.0)  # $5,000 MRR을 1.0으로 정규화

        pp["final_score"] = round(
            conf * 0.30 + market * 0.25 + build * 0.25 + rev_score * 0.20, 3
        )

    # 점수 내림차순 정렬
    pain_points.sort(key=lambda x: x.get("final_score", 0), reverse=True)
    return pain_points


def run(pain_points: Optional[List[dict]] = None) -> List[dict]:
    """분석 파이프라인 실행"""
    if pain_points is None:
        pain_points = load_latest_pain_points()

    if not pain_points:
        return []

    print("\n--- Step 2: 분석 시작 ---")

    # 1. 중복 제거
    pain_points = deduplicate(pain_points)

    # 2. 신뢰도 필터링
    with open(CONFIG_PATH) as f:
        config = json.load(f)
    threshold = config.get("settings", {}).get("confidence_threshold", 0.7)
    pain_points = filter_by_confidence(pain_points, threshold)

    if not pain_points:
        print("  ⚠️ 통과한 pain point 없음")
        return []

    # 3. AI 시장 분석 추가
    print("  AI 시장 분석 중...")
    pain_points = enrich_with_market_analysis(pain_points)

    # 4. 최종 점수 + 랭킹
    pain_points = score_and_rank(pain_points)

    # 5. 결과 저장
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = DATA_DIR / f"scored_{timestamp}.json"
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(pain_points, f, ensure_ascii=False, indent=2)
    print(f"\n✅ {len(pain_points)}개 분석 완료, 저장: {output_path}")

    # 상위 3개 출력
    print("\n📊 상위 3개:")
    for i, pp in enumerate(pain_points[:3], 1):
        print(f"  {i}. [{pp.get('final_score', 0):.2f}] {pp.get('service', '?')}: {pp.get('pain_point', '?')[:50]}")
        print(f"     → {pp.get('recommended_action', '?')}: {pp.get('action_reason', '?')[:60]}")

    return pain_points


if __name__ == "__main__":
    run()
