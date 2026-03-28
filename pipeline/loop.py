"""
24/7 자동 사이클 루프
CYCLE_INTERVAL 간격으로 파이프라인을 반복 실행한다.
"""

import os
import time
import traceback
from datetime import datetime

from orchestrator import run_full_cycle


def main():
    interval = int(os.getenv("CYCLE_INTERVAL", 21600))  # 기본 6시간

    print(f"Pipeline Factory — 24/7 Loop Mode")
    print(f"Cycle interval: {interval}s ({interval // 3600}h)")
    print(f"Started at: {datetime.now().isoformat()}")
    print("=" * 60)

    cycle_count = 0

    while True:
        cycle_count += 1
        print(f"\n{'='*60}")
        print(f"Loop cycle #{cycle_count} — {datetime.now().isoformat()}")
        print(f"{'='*60}")

        try:
            run_full_cycle()
        except Exception as e:
            print(f"\n❌ 사이클 에러: {e}")
            traceback.print_exc()

        print(f"\n⏳ 다음 사이클까지 {interval // 3600}시간 대기...")
        time.sleep(interval)


if __name__ == "__main__":
    main()
