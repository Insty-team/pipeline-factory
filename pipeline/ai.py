"""
AI 백엔드 — Claude CLI 래퍼
anthropic API 키 없이 Max plan의 claude CLI로 inference 수행.

Usage:
    from ai import ask
    result = ask("이 텍스트를 분석해줘: ...")
"""

from __future__ import annotations

import json
import re
import subprocess


def ask(prompt: str, max_tokens: int = 4000) -> str:
    """Claude CLI로 텍스트 inference 수행"""
    result = subprocess.run(
        ["claude", "--print", "-p", prompt, "--output-format", "text"],
        capture_output=True,
        text=True,
        timeout=120,
    )

    if result.returncode != 0:
        raise RuntimeError(f"Claude CLI error: {result.stderr[:200]}")

    return result.stdout.strip()


def ask_json(prompt: str) -> list | dict:
    """Claude CLI로 JSON 응답을 받아 파싱"""
    response = ask(prompt + "\n\nJSON으로만 응답해줘. 코드블록 없이 순수 JSON만.")

    # JSON 추출 (배열 또는 객체)
    json_match = re.search(r'[\[{].*[\]}]', response, re.DOTALL)
    if json_match:
        return json.loads(json_match.group())

    raise ValueError(f"JSON 파싱 실패. 응답: {response[:200]}")
