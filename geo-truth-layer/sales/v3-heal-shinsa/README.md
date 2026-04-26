# v3 더힐피부과의원 신사본점 — 개인화 비주얼 아웃리치

> 2026-04-26 제작 · 더힐피부과의원 신사본점 (thehealskin.co.kr)
>
> **Wave 1 컨텍스트**: 이 폴더는 Wave 1 5곳 중 첫 시제품. 나머지 4곳(앤드/삼성화이트/윤앤정/루트테마)도 같은 패턴의 형제 폴더로 생성 예정 — 권장 명명: `sales/v3-andps/`, `sales/v3-samsungwhite/`, `sales/v3-hiynj/`, `sales/v3-themeskin/`.

## 목적

기존 v2(텍스트 only) 4곳 무응답 → 응답률 베이스라인 확인.
v3는 **개인화 비주얼 1장 첨부**로 응답률 상승 가설 검증.
참고 통계: Sendspark 데이터 기준 텍스트 only 4~5% → 개인화 비주얼 16~30% (5~9배).

## 파일

| 파일 | 용도 |
|---|---|
| `visual.html` | 비주얼 소스 (1080×1400, 카톡 친화 비율) |
| `visual.png` | 카톡 첨부용 PNG (이미 렌더링됨, 119KB) |
| `message.md` | 카톡 본문 텍스트 (약 280자) |

## 비주얼 갱신 방법

본문/데이터 수정 시 `visual.html` 편집 후 아래 명령으로 재렌더링:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1080,1400 \
  --screenshot=visual.png \
  "file://$(pwd)/visual.html"
```

## 발송 절차

1. **카톡 채널 검색** — `더힐피부과` 또는 `더힐피부과의원` 으로 카톡 채널 검색
   - 채널 없으면 일반 카톡 ID 또는 공식 홈페이지 1:1 상담 폼으로 대체
2. **첨부** — `visual.png` 1장
3. **본문** — `message.md`의 본문 복붙
4. **발송 시각 기록** — `message.md` 하단 체크리스트 채우기

## v2 vs v3 A/B 비교 설계

이번주 신규 발송분 중:
- **v3 (개인화 비주얼+본문)**: 더힐피부과 1곳
- **v2 (텍스트 only)**: 다른 후보 1~2곳 (예: 위드윈피부과, 9skin1 등)

**측정 지표:**
- 카톡 읽음률 (둘 다 거의 100% 예상)
- 답장률 (핵심)
- 답장 내용 분류 (관심 / 거절 / 추가질문 / 무응답)

7일 후 응답률 비교 → 비주얼 ROI 결정.

## 적용한 응답률 원칙

| 원칙 | 적용 방식 |
|---|---|
| Hyper-personalization | 클리닉명·도메인·확인일·실측 데이터 명시 |
| Visual proof | 비교군(모리스의원) 데이터 같이 보여서 차이 가시화 |
| Pattern interrupt | "키워드 나열형" / "없음 (0개)" 빨강 뱃지 |
| Permission-first | "원하시면", "부담 없이 답주셔도" 톤 |
| No buzzwords | GEO/AEO/Schema 단어 금지 (메모리 규칙) |
| Builder tone | "혼자 정리하다가 연락드렸습니다" |
| Soft CTA | 무료 짧은 메모만 — 결제·계약 요구 없음 |
