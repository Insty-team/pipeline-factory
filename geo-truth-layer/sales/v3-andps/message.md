# 앤드성형외과 v3.1 카톡 메시지

> 발송일 예정: 2026-04-28 이후 (시제품 검토 후)
> 채널: 앤드성형 카카오톡 채널 (먼저 채널 검색·확인 필요)
> 첨부: visual.png (visual.html 캡처)

---

## 본문 (약 290자, 카톡 400자 제한 안)

```
안녕하세요. 강남 일대 성형외과가 AI 검색에서 어떻게 잡히는지
혼자 정리하다가 연락드렸습니다.

확인해보니 앤드성형외과 메인 사이트(andps.co.kr)가
ChatGPT나 Gemini 봇이 들어가면 차단 응답을 주는 상태였습니다.
글로벌 도메인은 정상이라 더 눈에 띄어서요.
첨부 이미지에 같이 정리해뒀습니다.

노출을 늘리는 작업이라기보다,
유튜브 채널은 활발한데 AI가 정작 본 사이트에 못 닿고 있는 상태를
풀어두는 작업에 가깝습니다.

원하시면 짧게 현황 메모만 무료로 보내드릴게요.
부담 없이 답주셔도 됩니다.
```

---

## 첨부 이미지 (visual.png)

`visual.html`을 브라우저에서 열고 1080×1400 영역 캡처.

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1080,1400 \
  --screenshot=visual.png \
  "file://$(pwd)/visual.html"
```

**핵심 메시지:**
- 메인 도메인(andps.co.kr): 406 차단 / self-signed / AI가 읽을 정보 0건
- 글로벌 도메인(andps-global.co.kr): 정상
- "유튜브는 활발한데 ChatGPT는 본 사이트에 못 들어감"

## 적용한 응답률 원칙

| 원칙 | 적용 |
|---|---|
| Hyper-personalization | "앤드성형외과 메인 사이트(andps.co.kr)" + 글로벌 도메인 비교 |
| Visual proof | 같은 병원 두 도메인 대비로 진단·차이 가시화 |
| Pattern interrupt | "유튜브 활발 vs AI 봇 차단" 구체 부조화 |
| Permission-first | "원하시면", "부담 없이" 톤 유지 |
| No buzzwords | GEO/AEO/Schema 단어 안 씀 (메모리 규칙) |
| Builder tone | "혼자 정리하다가 연락드렸습니다" |
| Soft CTA | 무료 짧은 메모만 — 결제·계약 요구 없음 |

## 발송 후 기록

- [ ] 카톡 채널 확인 결과: 채널 있음 / 없음 / 1:1 폼 대체
- [ ] 발송 시각:
- [ ] 카톡 상태: 보냄 / 읽음 / 답장 / 차단
- [ ] 답장 분류: 무응답 / 관심 / 거절 / 추가질문
