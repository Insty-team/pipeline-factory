# 마이크로 도구 팩토리 (패시브 인컴 레이어)

> 출처: Insty-Marketing Round 4 브레인스토밍 (2026-03-20)
> 상태: Pipeline Factory의 잠재적 파이프라인 유형으로 편입 검토

---

## 핵심 가설

Pain point를 대량 수집하고, 각각을 해결하는 마이크로 웹 도구를 자동 생성하면,
100개 중 5-10개가 살아남아 패시브 인컴을 만든다.

```
대행:    1시간 → 돈 (직접 비례)
도구:    2시간 → 도구 1개 → 0원 or 월 5만원 x 영원 (비선형)
```

실제 사례:
- AirFryerCalculator.com: 입력 필드 3개짜리 단일 페이지 → 월 18,000 오가닉 방문
- TireSize.com: 타이어 사이즈 계산기 하나 → 전체 트래픽의 1/3

---

## 파이프라인 구조

### Step 1: Pain Point 수집 (자동)

| 채널 | 언어 | 비용 | 일일 수집 목표 |
|------|:----:|:----:|:-------------:|
| Reddit | EN | $0 | 30-50건 |
| Hacker News | EN | $0 | 10-20건 |
| Twitter/X | EN/KR | $0 | 5-10건 |
| Quora | EN | $0 | 10-15건 |
| Indie Hackers | EN | $0 | 5-10건 |
| Product Hunt | EN | $0 | 5건 |
| 네이버 지식인 | KR | $0 | 10-20건 |
| **합계** | | **$0** | **80-135건/일** |

핵심: 키워드 매칭이 아닌 **AI 톤 분석**으로 수집
- "My air fryer keeps burning everything" → 키워드 매칭은 못 잡지만 AI는 잡음
- 수집량 키워드 대비 3-5배

### Step 2: 필터링 (자동)

```
수집 100건/일
  → 중복 제거 (임베딩 유사도 0.85+) → 70건
  → 진짜/가짜 판별 (LLM) → 40건
  → 경쟁 체크 (기존 도구 검색) → 20건
  → 난이도 평가 → 15건
  → 점수화 + 랭킹 → 상위 5건/일
```

### Step 3: 도구 생성 (AI 자동)

각 pain point에 대해:
1. AI가 UX 가설 3-5개 생성
2. HTML + Tailwind + Vanilla JS로 구현 (프레임워크 없음)
3. Cloudflare Pages 무료 배포
4. 2주 A/B 테스트

### Step 4: 시장 선택

```
100개 도구 배포 → 2주 관찰
  → 5-10개 생존 (오가닉 트래픽 유지)
  → 생존 도구만 유지, 나머지 아카이브
  → 생존 도구에 광고/프리미엄 추가
```

---

## Pipeline Factory와의 연결

```
Pipeline Factory 유저가 "마이크로 도구" 니치를 선택하면:
  → Pain point 자동 수집 (이미 있는 DB에서)
  → 도구 가설 3개 생성
  → 자동 배포 + 2주 테스트
  → GO/NO-GO 리포트

= Pipeline Factory의 "파이프라인 유형" 중 하나로 편입 가능
```

---

## 기술 스택

```
Frontend:  HTML + Tailwind CSS + Vanilla JS (프레임워크 없음 = 유지보수 제로)
Hosting:   Cloudflare Pages (무료, 상용 이용 가능)
Analytics: Cloudflare Analytics (무료) or Plausible
수집:      Python (PRAW, tweepy, 네이버 API)
분석:      Claude API (톤 분석 + UX 가설 생성)
```
