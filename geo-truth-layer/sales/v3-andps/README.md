# v3 앤드성형외과 — 개인화 비주얼 아웃리치 (Wave 1)

> 2026-04-27 제작 · 앤드성형외과 (andps.co.kr · 0/100점)
>
> Wave 1 5곳 중 두 번째 시제품. 더힐 시제품(`../v3-heal-shinsa/`)과 같은 v3.1 패턴을 적용하되, 비교 대상이 *외부 클리닉*이 아니라 *같은 병원의 다른 도메인*(andps-global.co.kr)인 게 차이점.

## 왜 가장 강력한 케이스인가

`research/youtube-clinics-geo-audit.md` Tier 1 후보 4곳 중 **최고 임팩트**:
- 점수 0/100 (13곳 중 동률 최저)
- "사이트 자체가 모든 크롤러에 406 + self-signed cert" → 30초 시연 가능
- 눈서코TV(YouTube) 활발 → "유튜브는 잘 되는데 AI엔 안 잡힘" 메시지가 자연스러움
- 같은 병원 글로벌 도메인은 정상 → "이 도메인만 고치면 됨"이 명확

## 파일

| 파일 | 용도 |
|---|---|
| `visual.html` | 비주얼 소스 (1080×1400, 카톡 친화 비율) |
| `visual.png` | 카톡 첨부용 PNG (visual.html 캡처해서 생성 필요) |
| `message.md` | 카톡 본문 텍스트 (약 290자) |

## visual.png 렌더링

```bash
cd /Users/mac/projects/pipeline-factory/geo-truth-layer/sales/v3-andps
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1080,1400 \
  --screenshot=visual.png \
  "file://$(pwd)/visual.html"
```

## 발송 절차

1. **카톡 채널 검색** — `앤드성형` 또는 `앤드성형외과` 검색
   - 채널 없으면 일반 카톡 ID 또는 공식 1:1 상담 폼으로 대체 (HANDOFF의 ① 단계)
2. **첨부** — `visual.png` 1장
3. **본문** — `message.md`의 본문 복붙
4. **발송 시각 기록** — `message.md` 하단 체크리스트 + `../../../DAILY-LOG.md` 일지에도 한 줄

## Wave 1 형제 폴더 (예정)

- `v3-andps/` ← 이 폴더 (2번째)
- `v3-heal-shinsa/` (1번째, 시제품 완료)
- `v3-samsungwhite/` — 삼성화이트피부과 (앤드와 동일 패턴)
- `v3-hiynj/` — 윤앤정성형 (HTTPS 미구현)
- `v3-themeskin/` — 루트테마피부과 (SSL cert 도메인 불일치)
