"""
Step 3: 가설 생성 모듈
분석된 상위 pain point에서 차별화 가설 3개를 자동 생성한다.

입력: 분석 완료된 pain point (scored_*.json)
출력: data/hypotheses/H-{번호}_{timestamp}.json
"""

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))
from ai import ask_json

BASE_DIR = Path(__file__).parent.parent
SCORED_DIR = BASE_DIR / "data" / "pain_points"
HYPOTHESES_DIR = BASE_DIR / "data" / "hypotheses"
INSIGHTS_DIR = BASE_DIR / "data" / "insights"


def load_latest_scored() -> list[dict]:
    """가장 최근 분석된 pain point 로드"""
    files = sorted(SCORED_DIR.glob("scored_*.json"), reverse=True)
    if not files:
        print("⚠️ 분석된 pain point 없음. analyzers를 먼저 실행하세요.")
        return []

    with open(files[0]) as f:
        data = json.load(f)
    print(f"📂 로드: {files[0].name} ({len(data)}개)")
    return data


def load_previous_insights() -> list[dict]:
    """이전 인사이트 로드 (다음 가설에 반영)"""
    db_path = INSIGHTS_DIR / "db.json"
    if db_path.exists():
        with open(db_path) as f:
            return json.load(f)
    return []


def get_next_hypothesis_number() -> int:
    """다음 가설 번호 결정"""
    HYPOTHESES_DIR.mkdir(parents=True, exist_ok=True)
    files = list(HYPOTHESES_DIR.glob("H-*.json"))
    if not files:
        return 1

    numbers = []
    for f in files:
        match = re.search(r'H-(\d+)', f.name)
        if match:
            numbers.append(int(match.group(1)))
    return max(numbers) + 1 if numbers else 1


def generate_hypotheses(top_pain_points: list[dict], insights: list[dict]) -> list[dict]:
    """상위 pain point에서 가설 3개 생성"""
    pp_text = json.dumps(top_pain_points[:5], ensure_ascii=False, indent=2)

    insight_text = ""
    if insights:
        recent = insights[-10:]
        insight_text = f"""

이전 실험에서 얻은 인사이트 (다음 가설에 반영할 것):
{json.dumps(recent, ensure_ascii=False, indent=2)}"""

    max_hyp = int(os.environ.get("MAX_HYPOTHESES", len(top_pain_points) * 2))

    prompt = f"""다음은 기존 서비스의 분석된 pain point 목록이다 ({len(top_pain_points)}개):

{pp_text}
{insight_text}

각 pain point에 대해 **1~2개의 차별화된 비즈니스 가설**을 생성해줘. 총 {max_hyp}개 이내.

각 가설:
1. hypothesis_id: "H-TBD"
2. mode: "B" (레퍼런스 기반)
3. title: 가설 한 줄 제목
4. reference_service: 레퍼런스가 된 기존 서비스
5. pain_point: 해결하려는 불만 (한 줄)
6. differentiation: 어떻게 차별화하는지 (2~3줄)
7. target_audience: 구체적 타겟
8. revenue_model: 수익 모델
9. expected_mrr: 예상 월 MRR 범위
10. build_estimate: 빌드 예상 기간 (솔직하게)
11. validation_method: 검증 방법
12. validation_cost: 검증 비용
13. go_criteria: GO 판정 기준 (구체적 수치)
14. confidence: 0.0~1.0

다양한 카테고리, 시장(US/KR), 빌드 난이도를 고루 포함할 것.
중복되는 아이디어는 하나로 합치고, 각각 독립적으로 가치가 있어야 함.

JSON 배열로 응답."""

    try:
        hypotheses = ask_json(prompt)

        next_num = get_next_hypothesis_number()
        for i, h in enumerate(hypotheses):
            h["hypothesis_id"] = f"H-{next_num + i:03d}"
            h["created_at"] = datetime.now(timezone.utc).isoformat()
            h["status"] = "pending_validation"
            h["cycle"] = len(list(HYPOTHESES_DIR.glob("H-*.json"))) // 3 + 1

        return hypotheses
    except Exception as e:
        print(f"  가설 생성 AI error: {e}")

    return []


def run(scored_points: list[dict] | None = None) -> list[dict]:
    """가설 생성 파이프라인 실행"""
    if scored_points is None:
        scored_points = load_latest_scored()

    if not scored_points:
        return []

    print("\n--- Step 3: 가설 생성 시작 ---")

    # 이전 인사이트 로드
    insights = load_previous_insights()
    if insights:
        print(f"  이전 인사이트: {len(insights)}개 반영")

    # 가설 생성
    print("  AI 가설 생성 중...")
    hypotheses = generate_hypotheses(scored_points, insights)

    if not hypotheses:
        print("  ⚠️ 가설 생성 실패")
        return []

    # 개별 파일로 저장
    HYPOTHESES_DIR.mkdir(parents=True, exist_ok=True)
    for h in hypotheses:
        h_id = h["hypothesis_id"]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        path = HYPOTHESES_DIR / f"{h_id}_{timestamp}.json"
        with open(path, "w") as f:
            json.dump(h, f, ensure_ascii=False, indent=2)

    # 선별: confidence + MRR 기반 정렬
    top_n = int(os.environ.get("TOP_HYPOTHESES", 10))
    hypotheses.sort(key=lambda h: h.get("confidence", 0), reverse=True)

    for i, h in enumerate(hypotheses):
        if i < top_n:
            h["status"] = "test"  # 상위 N개: 테스트 대상
        elif h.get("confidence", 0) >= 0.5:
            h["status"] = "keep"  # 중간: 보관 (다음 사이클에서 재평가)
        else:
            h["status"] = "discard"  # 하위: 버림

    test_count = sum(1 for h in hypotheses if h["status"] == "test")
    keep_count = sum(1 for h in hypotheses if h["status"] == "keep")
    discard_count = sum(1 for h in hypotheses if h["status"] == "discard")

    print(f"\n✅ {len(hypotheses)}개 가설 생성 → test: {test_count} | keep: {keep_count} | discard: {discard_count}")
    print(f"\n📌 Top {test_count} (테스트 대상):")
    for h in hypotheses:
        if h["status"] != "test":
            continue
        print(f"  {h['hypothesis_id']}: {h.get('title', '?')}")
        print(f"    레퍼런스: {h.get('reference_service', '?')} | 빌드: {h.get('build_estimate', '?')} | MRR: {h.get('expected_mrr', '?')}")

    return hypotheses


if __name__ == "__main__":
    run()
