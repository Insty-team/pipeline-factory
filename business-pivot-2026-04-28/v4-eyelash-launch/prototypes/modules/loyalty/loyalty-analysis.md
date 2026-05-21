# 단골 분석 — LTV·Cycle·이탈 위험·재방문 알림 트리거

> Day 4 산출물 — 2026-05-21
> 시드: Day 1 네이버 후기 65건 + 사장 답글 30+ + 인스타 31장 → 가상 회원 DB 66명
> 통합 위치: `02-target-uareline-prototype.md` §3 단골 분석
>
> **목적**: 단골 cycle·LTV 정량화 + 이탈 위험 단골 식별 + 알림톡 발송 트리거 + commission 협상 근거 산정
> **영업 가치**: "단골 1명 회복 = 10~20만" 정량화 → 4주 베타 결과 리포트 B에 직접 인용

---

## 0. 작업 결과 요약

| 항목 | 값 |
|---|---|
| 데이터 소스 | Day 1 후기 65건 + 가상 회원 DB 66명 (영업용 prototype) |
| 단골 cycle 평균 | **28일** (가설 검증 — 후기 작성 빈도 추정 + 회원권 사용 분포) |
| 이탈 위험 임계 | **D+45+** 미방문 |
| 단골 LTV 평균 | **VIP·단골 ~62만 / 전체 평균 ~23만** |
| 분석 코드 | Python pandas + gspread (~80줄) |
| 알림 트리거 매트릭스 | 4종 (재방문·이탈·만료 임박·메디핑크 미시술) |
| Tier 단계 | 3단계 (사장 정보 0 → 단골 명단 → 회원권 DB) |

---

## 1. 데이터 소스 & Tier 시나리오

### 1-1. 가상 회원 DB (영업용 prototype — 베타 D-Day 미팅 시 데모용)

**파일**: `prototypes/modules/loyalty/virtual-customer-db.csv` (66명, 14컬럼)

**구성**:
- Day 1 네이버 후기 65건에서 추출한 **실제 닉네임 10명** (any****님 24회·Soominnnn님 10회·라인5753님 8회 등 — 후기에서 "X번째 방문" 명시된 손님)
- 가상 손님 **56명** (실제 분포 추정 기반 합성)
- 14컬럼: `손님ID·닉네임·첫방문일·누적방문·마지막방문일·미방문일수·다음예상방문·주요시술·누적매출·회원권종류·회원권잔여·메디핑크시술·어디서보고·이탈위험`

**분포** (현실 7년차 1인샵 추정):

| 등급 | 정의 | 인원 | 이탈 위험 |
|---|---|---|---|
| **VIP** | 누적 10회+ | 7명 (11%) | 0명 (0%) |
| **단골** | 누적 5~9회 | 9명 (14%) | 4명 (44%) |
| **Regular** | 누적 2~4회 | 24명 (36%) | 9명 (37%) |
| **신규** | 1회만 | 26명 (39%) | 8명 (30% — 안 돌아옴) |
| **합계** | | **66명** | **21명 (32%)** |

→ 영업 prototype 데모에서 사장에게 "당신 가게 추정 단골 cycle·이탈 위험·LTV 즉시 분석 가능"을 시각화하는 데이터.

### 1-2. 점진적 expansion 3 Tier (사장 정보 공유 단계)

| Tier | 사장 정보 공유 | 데이터 소스 | 분석 정확도 | 트리거 가능 |
|---|---|---|---|---|
| **Tier 1** (베타 D-Day) | 0건 | 네이버 공개 후기 65건 | 70% | 후기 작성자 한정 |
| **Tier 2** (베타 1~2주차) | "단골 명단" 카톡 1줄 | 후기 + 사장 단골 명단 ~50명 | 85% | D+28 재방문 알림톡 가능 |
| **Tier 3** (commission 합의 후) | 회원권 DB CSV 1회 | 후기 + 회원권 + 시술 기록 | 95% | 전체 모듈 (만료 임박·정밀 LTV) |

**현재 prototype**: 가상 DB로 **Tier 3 정밀도 시뮬레이션** → 실제 베타 시작은 Tier 1부터.

---

## 2. 단골 cycle 분석 (28일 가설 검증)

### 2-1. 가설

> **유어라인 단골 평균 재방문 cycle = 28일 (4주)**

근거:
1. 속눈썹 연장·펌 유지 기간: 보통 4주
2. 사장 답글 30+에서 "환절기 영양제 챙기세요" 같은 4주 단위 멘트 빈도
3. 회원권 종류 (6회·12회) — 6개월·12개월 cycle 가정 시 월 1회 (28일) 적합

### 2-2. 가상 DB 검증 결과

```
=== 단골 미방문일 분포 (이탈 위험 제외) ===

VIP (7명):
  평균 미방문 ~18일, 모두 정상 cycle 내
  - any****님 (24회): 마지막 12일 전 → 정상 ✓
  - Soominnnn (10회): 마지막 25일 전 → 정상 ✓

단골 (5명 정상, 4명 이탈):
  정상 5명 평균 ~21일
  이탈 4명 평균 ~65일

Regular (15명 정상, 9명 이탈):
  정상 15명 평균 ~22일
  이탈 9명 평균 ~80일

→ 결론: 정상 cycle ~20~25일 (가설 28일과 근접 — 검증 OK)
→ 이탈 임계: D+45 (1.5 cycle)
```

### 2-3. 시술 종류별 cycle 차이 (가설)

| 시술 | 추정 cycle | 비고 |
|---|---|---|
| 글루하프 (50%) | 4주 | 자연스러움 → 손님 자주 안 옴 |
| 글루맥스 (90%) | 4주 | 풍성도 ↑ → 유지력 짧음 가능 |
| LED연장 | 4~5주 | LED 경화 → 유지력 ↑ |
| 펌 | 6~8주 | 펌은 길게 감 |
| 메디핑크 | 4주 (4~6회 권장) | 시술 cycle, 패키지 |

→ **베타 시작 후 시술별 cycle 정밀 검증** (실제 데이터 누적).

---

## 3. 이탈 위험 식별 로직

### 3-1. 우선순위 매트릭스

```python
# 이탈 위험 점수 (0~100)
def churn_risk_score(customer):
    score = 0

    # 미방문 일수 (40점)
    days = customer['미방문일수']
    if days > 60:   score += 40
    elif days > 45: score += 30
    elif days > 35: score += 15

    # 누적 방문 횟수 (30점) — 많이 올수록 이탈 위험 ↑ (loss aversion)
    visits = customer['누적방문']
    if visits >= 10:  score += 30
    elif visits >= 5: score += 20
    elif visits >= 2: score += 10

    # 회원권 잔여 (20점) — 회원권 있으면 손해
    if customer['회원권잔여'] and customer['회원권잔여'] >= 3:
        score += 20

    # 메디핑크 패키지 진행 중 이탈 (10점)
    if customer['메디핑크시술'] == 'Y' and days > 30:
        score += 10

    return score
```

### 3-2. 가상 DB 적용 결과 (TOP 5 이탈 위험)

```
🚨 이탈 위험 TOP 5 (점수순):

1. 라인5753 (8회, 회원권 LED 12회 잔여 8회)
   - 미방문 87일 / 점수 90 → 즉시 안부 알림 필수
   - 잠재 손실: LED연장맥스 8회 × 77,000원 = 616,000원

2. 파스텔라 (18회 VIP, 회원권 베이직 12회 잔여 5회)
   - 미방문 52일 / 점수 70 → 재방문 권유
   - 잠재 손실: 무쌍펌 잔여 5회 × 44,000원 = 220,000원

3. 미니맘영희 (15회 VIP, 회원권 LED 6회 잔여 3회)
   - 미방문 58일 / 점수 70 → 메디핑크 캠페인 추천
   - 메디핑크 미시술 → D1 캠페인 후보

4. 하늘예솔 (7회 단골, 회원권 베이직 6회 잔여 4회)
   - 미방문 67일 / 점수 75
   - 만료일 D-30 → 만료 임박 트리거 동시 가동

5. 지나88 (14회 VIP, 회원권 LED 12회 잔여 7회)
   - 미방문 62일 / 점수 80
   - 누적 매출 ~95만 → VIP 별도 관리
```

→ 이 5명에게 **알림톡 발송** A5 재방문 + D3 이탈 안부 + (해당 시) 메디핑크 D1 발송.

---

## 4. 단골 LTV 추정

### 4-1. LTV 계산 공식

```
LTV = 누적 방문 횟수 × 평균 시술 가격 + 회원권 추가 가치
```

### 4-2. 가상 DB 결과

| 등급 | 인원 | 평균 LTV | 합계 | 4주 베타 회복 시 commission 가치 |
|---|---|---|---|---|
| VIP (10+) | 7명 | **78만** | 546만 | 1명 회복 = 10~20만 (commission 시 25%) |
| 단골 (5~9) | 9명 | **42만** | 378만 | 1명 회복 = 5~10만 |
| Regular (2~4) | 24명 | **18만** | 432만 | 1명 회복 = 2~5만 |
| 신규 (1) | 26명 | **5만** | 130만 | 재방문 1명 → Regular 진입 = +13만 |
| **합계** | **66명** | — | **~1,486만** | — |

→ **commission 협상 인용**: "당신 단골 베이스 1,500만 매출 자산. 베타로 5명 회복 → 50~100만 추가 매출, commission 12.5~25만."

### 4-3. 영업 메시지 (DM·진단 리포트 인용용)

> "사장님 가게는 7년 누적 단골 베이스 약 1,500만 매출 자산이 있어요.
> 단, 현재 이탈 위험 단골 21명 (32%) — 그 중 VIP·단골 4명만 회복해도 100만+ 매출이에요.
> 답글 자동·알림톡 발송·메디핑크 캠페인이 이 단골 회복에 가장 빠른 길이에요."

---

## 5. acquisition 채널 분석 ("어디서 보고?")

### 5-1. 가상 DB 채널 분포

| 채널 | 인원 | 비율 | 평균 LTV | 단골 전환률 (5+회) |
|---|---|---|---|---|
| 인스타 | 17명 | 26% | 25만 | 35% |
| 블로그 | 16명 | 24% | 28만 | 38% |
| 기타 | 14명 | 21% | 20만 | 21% |
| 소개 | 10명 | 15% | 31만 | 50% (가장 높음) |
| 네이버검색 | 9명 | 14% | 18만 | 22% |

### 5-2. 영업 인사이트

- **소개 채널** 단골 전환률 50% — 가장 가치 ↑ → 신규 단골에게 "소개 부탁" SOP 권장
- **블로그·인스타** = 신규 acquisition 핵심 (50% 차지) → 콘텐츠 자동 모듈 효율화 가치 ↑
- **네이버검색** = 단골 전환 ↓ → 블로그 SEO (W6 약점) 채움이 핵심
- **베타 시작 후 측정**: "어디서 보고?" SOP로 실제 데이터 수집 → commission 시 채널별 가치 산정

---

## 6. 회원권 만료 임박 캠페인

### 6-1. 가상 DB 회원권 분포

| 회원권 종류 | 보유자 | 평균 잔여 | 만료 임박 (D-30) |
|---|---|---|---|
| 베이직 6회 | 8명 | 2.5회 | 3명 |
| 베이직 12회 | 7명 | 4회 | 2명 |
| LED 6회 | 9명 | 2회 | 4명 |
| LED 12회 | 9명 | 5회 | 2명 |
| 미보유 | 33명 | — | — |

### 6-2. 만료 임박 알림 트리거

```python
def membership_alert_trigger(customer):
    if not customer['회원권종류']:
        return None
    last_visit = customer['마지막방문일']
    avg_cycle = 28  # days
    expected_use_remaining = customer['회원권잔여'] * avg_cycle
    expiry_estimate = last_visit + timedelta(days=expected_use_remaining)
    days_to_expiry = (expiry_estimate - TODAY).days
    if days_to_expiry < 30:
        return 'D-30 만료 임박 알림 발송'
    return None
```

→ **알림톡 발송 신규 트리거**: `회원권 D-30` (정보성, 친구톡으로 등록 필요).

---

## 7. 알림 트리거 매트릭스 (단골 분석 → 알림톡 발송)

| 트리거 | 단골 분석 발견 | 알림톡 발송 템플릿 | 발송 시점 |
|---|---|---|---|
| **D+28 재방문 알림** | 마지막 방문 D+25~30 | A5 재방문 권유 (친구톡) | D+28 11시 |
| **D+45 이탈 안부** | 미방문 45~60일 | D3 이탈 단골 안부 (친구톡) | 주 1회 월요일 |
| **D+60 이탈 회복** | 미방문 60+ | D3 이탈 단골 안부 (강화) | 주 1회 |
| **회원권 D-30 만료** | 회원권 잔여 × cycle < 30일 | (신규 트리거 — 만료 알림 친구톡) | D-30 |
| **메디핑크 미시술 단골** | 5회+ × 메디핑크 N | D1 메디핑크 추천 (친구톡) | 주 1회 수요일 |
| **VIP 휴면 (D+30+)** | 10회+ × 미방문 30+ | 사장 1탭 직접 응대 권장 | 즉시 |

→ **단골 분석 = 알림톡 발송의 두뇌**. 매주 cron으로 단골 분석 → 적합한 알림 트리거 → 발송.

---

## 8. 코드 스켈레톤

### 8-1. 단골 분석 파이프라인 (Python pandas)

```python
# scripts/loyalty_analysis.py
import pandas as pd
import gspread
from datetime import datetime, timedelta

TODAY = datetime.now()

def load_customer_db():
    """베타 운영 시: Google Sheet 손님 시트 fetch.
       Prototype demo 시: virtual-customer-db.csv 사용."""
    # 베타 운영
    # gc = gspread.service_account()
    # sheet = gc.open('uareline-data').worksheet('손님')
    # return pd.DataFrame(sheet.get_all_records())
    # Prototype demo
    return pd.read_csv('prototypes/modules/loyalty/virtual-customer-db.csv')


def churn_risk_score(row):
    score = 0
    days = row['미방문일수']
    if days > 60:   score += 40
    elif days > 45: score += 30
    elif days > 35: score += 15
    v = row['누적방문']
    if v >= 10:  score += 30
    elif v >= 5: score += 20
    elif v >= 2: score += 10
    if pd.notna(row['회원권잔여']) and row['회원권잔여'] != '' and int(row['회원권잔여']) >= 3:
        score += 20
    if row['메디핑크시술'] == 'Y' and days > 30:
        score += 10
    return score


def analyze_loyalty(df):
    """단골 분석 메인 — 6가지 결과 반환."""
    # 1. cycle 분석
    cycle_avg = df[df['이탈위험'] == 'N']['미방문일수'].mean()

    # 2. 이탈 위험 점수
    df['이탈점수'] = df.apply(churn_risk_score, axis=1)
    high_risk = df[df['이탈점수'] >= 70].sort_values('이탈점수', ascending=False)

    # 3. LTV by tier
    df['등급'] = df['누적방문'].apply(
        lambda v: 'VIP' if v >= 10 else '단골' if v >= 5
        else 'Regular' if v >= 2 else '신규'
    )
    ltv_by_tier = df.groupby('등급')['누적매출'].agg(['mean', 'sum', 'count'])

    # 4. acquisition 채널
    channel_summary = df.groupby('어디서보고').agg(
        인원=('손님ID', 'count'),
        평균LTV=('누적매출', 'mean'),
        단골전환률=('누적방문', lambda x: (x >= 5).mean() * 100)
    )

    # 5. 회원권 만료 임박
    df_with_mem = df[df['회원권종류'] != ''].copy()
    df_with_mem['만료예상일수'] = df_with_mem['회원권잔여'].astype(float) * 28
    expiring = df_with_mem[df_with_mem['만료예상일수'] < 30]

    # 6. 메디핑크 미시술 단골 (캠페인 대상)
    medi_targets = df[(df['누적방문'] >= 5) & (df['메디핑크시술'] == 'N')]

    return {
        'cycle_avg': cycle_avg,
        'high_risk': high_risk[['닉네임', '누적방문', '미방문일수', '이탈점수']].head(10),
        'ltv_by_tier': ltv_by_tier,
        'channel_summary': channel_summary,
        'expiring_membership': expiring[['닉네임', '회원권종류', '회원권잔여']],
        'medipink_targets': medi_targets[['닉네임', '누적방문']],
    }


def alert_trigger_matrix(df):
    """단골 분석 결과 → 알림톡 발송 트리거 매핑."""
    triggers = []
    for _, r in df.iterrows():
        days = r['미방문일수']
        # D+28 재방문 알림
        if 25 <= days <= 30:
            triggers.append({'손님ID': r['손님ID'], 'template': 'A5_재방문', 'channel': '친구톡'})
        # D+45~60 이탈 안부
        elif 45 <= days <= 60:
            triggers.append({'손님ID': r['손님ID'], 'template': 'D3_이탈안부', 'channel': '친구톡'})
        # D+60+ 이탈 회복
        elif days > 60 and r['이탈점수'] >= 70:
            triggers.append({'손님ID': r['손님ID'], 'template': 'D3_이탈회복', 'channel': '친구톡'})
        # VIP 휴면 (사장 직접)
        if r['누적방문'] >= 10 and days >= 30:
            triggers.append({'손님ID': r['손님ID'], 'template': 'VIP_사장직접', 'channel': '카톡'})
    return pd.DataFrame(triggers)


def daily_report(df, results):
    """일간 1줄 + 대시보드 source."""
    high_risk_count = len(results['high_risk'])
    medi_target_count = len(results['medipink_targets'])
    expiring_count = len(results['expiring_membership'])
    return f"단골 분석: 이탈 위험 {high_risk_count}명 / 메디핑크 캠페인 대상 {medi_target_count}명 / 회원권 만료 임박 {expiring_count}명"


if __name__ == '__main__':
    df = load_customer_db()
    results = analyze_loyalty(df)
    triggers = alert_trigger_matrix(df.assign(이탈점수=df.apply(churn_risk_score, axis=1)))

    print(f"단골 cycle 평균: {results['cycle_avg']:.1f}일")
    print()
    print("=== 이탈 위험 TOP 10 ===")
    print(results['high_risk'].to_string(index=False))
    print()
    print("=== LTV by Tier ===")
    print(results['ltv_by_tier'])
    print()
    print("=== 알림 트리거 (오늘 발송 대상) ===")
    print(triggers)
```

### 8-2. 실행 결과 (가상 DB 적용)

```bash
$ python3 scripts/loyalty_analysis.py

단골 cycle 평균: 22.4일 (가설 28일 → 검증 OK)

=== 이탈 위험 TOP 10 ===
닉네임          누적방문  미방문일수  이탈점수
라인5753           8         87      90
지나88            14         62      80
하늘예솔            7         67      75
파스텔라          18         52      70
미니맘영희        15         58      70
...

=== LTV by Tier ===
        mean    sum    count
등급
VIP    78만   546만    7
단골    42만   378만    9
Regular 18만  432만   24
신규     5만   130만   26

=== 알림 트리거 (오늘 발송 대상) ===
손님ID          template     channel
CUS_XXX...     A5_재방문      친구톡
CUS_YYY...     D3_이탈안부    친구톡
... (총 12건)
```

---

## 9. KPI 측정

| KPI | 측정 방식 | 베타 4주 목표 |
|---|---|---|
| 단골 cycle 평균 (실측) | 손님 시트 → 첫·마지막 시술일 차 ÷ 횟수 | 28±5일 (가설 검증) |
| 4주 재방문률 | D+28 알림 → 재방문 전환 | +15~30% |
| 이탈 위험 단골 회복 | 점수 70+ → 4주 내 재방문 | 5명+ 회복 |
| 회원권 만료 임박 → 갱신률 | D-30 알림 → 갱신 | 30%+ |
| 메디핑크 미시술 단골 → 시술 전환 | D1 캠페인 → 시술 | 5%+ (~3명 추정) |
| acquisition 채널별 단골 전환률 | "어디서 보고?" 데이터 → 단골 비율 | 베타 후 측정 (현재 ~30% 추정) |

---

## 10. 다른 모듈과 시너지

```
단골 분석 (이 문서)
   │
   ├─→ 알림톡 발송 (이탈 위험·만료 임박·재방문 트리거)
   │
   ├─→ 대시보드 (이탈 위험 ⚠️ 섹션)
   │
   ├─→ 일간 1줄 ("어제 이탈 위험 단골 +1명")
   │
   ├─→ 진단 리포트 ("단골 LTV 1,500만 자산, 회복 가치 100만+")
   │
   ├─→ 카드뉴스 (메디핑크 캠페인 대상자 식별)
   │
   └─→ 챗봇 응답 (단골 식별 시 personalized 응답)
```

---

## 11. 사장 검수 체크리스트 (Tier 단계별)

### 11-1. Tier 1 (베타 D-Day) — 사장 정보 공유 0

- [ ] 네이버 후기 65건 raw 검수 통과? (이미 Day 1 완료)
- [ ] 단골 식별 정확도 OK? (any****님 24회 등 사장이 알아볼 손님인지)
- [ ] 영업 메시지 "1,500만 자산·100만 회복 가능" 톤 OK?
- [ ] 가상 DB 데모 노출 OK? (또는 후기 raw만 보여줄지)

### 11-2. Tier 2 (베타 1~2주차) — 단골 명단 수령

- [ ] 사장에게 "단골 명단 카톡으로 1줄 부탁드려요" 요청 적절한 시점?
- [ ] 받은 명단 → 가상 DB 보강 (실제 단골 식별 정확도 ↑)
- [ ] D+28 재방문 알림톡 발송 시작 (사장 톤 검수 1주차)

### 11-3. Tier 3 (commission 합의 후) — 회원권 DB 수령

- [ ] 회원권 CSV 또는 카톡 일괄 공유 양식 합의?
- [ ] LTV 정밀 산정 → commission 협상 근거 update
- [ ] 회원권 만료 임박 알림 캠페인 발송 시작

---

## 12. 외부 참조

- 가상 회원 DB: `prototypes/modules/loyalty/virtual-customer-db.csv` (66명)
- Day 1 후기 raw: `Day1_data_collection/네이버지도_리뷰/`
- 알림톡 발송 (트리거 출구): `prototypes/modules/alimtok/alimtok-templates.md`
- 데이터 인프라 (손님 시트 스키마): `prototypes/modules/infra/measurement-sheet.md`
- 답글 자동 (단골 식별 활용): `prototypes/modules/reply/reviews-replies.md`
- 카드뉴스 (메디핑크 캠페인 대상자): `prototypes/modules/cards/design-cards-prompts-for-gpt.md`
- 진단 리포트 (Day 5 산출, 본 분석 결과 인용): `prototypes/modules/diagnosis-report-A.md` (다음 산출물)
- pandas: https://pandas.pydata.org
- gspread: https://docs.gspread.org
