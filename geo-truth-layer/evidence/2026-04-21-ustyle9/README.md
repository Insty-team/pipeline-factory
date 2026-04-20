# 2026-04-21 유스타일나인 evidence log

## 사용자 수집 증거

로컬 작업 머신에 스크린샷 저장됨:

- `/home/samwoo/github_repos/pipeline-factory-ws/images/0421_log/chatgpt_search_result/강남제모검색결과1.png`
- `/home/samwoo/github_repos/pipeline-factory-ws/images/0421_log/chatgpt_search_result/강남제모검색결과2.png`
- `/home/samwoo/github_repos/pipeline-factory-ws/images/0421_log/chatgpt_search_result/강남제모검색결과3.png`
- `/home/samwoo/github_repos/pipeline-factory-ws/images/0421_log/chatgpt_search_result/강남제모검색결과4.png`
- `/home/samwoo/github_repos/pipeline-factory-ws/images/0421_log/병원설명/병원설명1.png`
- `/home/samwoo/github_repos/pipeline-factory-ws/images/0421_log/병원설명/병원설명2.png`
- `/home/samwoo/github_repos/pipeline-factory-ws/images/0421_log/병원설명/진료과정.png`

## 관찰 요약

### ChatGPT 검색 결과

사용자 검색: `강남 레이저 제모 추천`

스크린샷 관찰:

- 추천 후보에 `유스타일나인`은 보이지 않음.
- 노출된 후보 예시: 모리스의원, 메티의원, 톡스앤필 강남본점, 미앤미의원 강남점, 리버스의원 강남점 등.
- ChatGPT는 접근성, 남자 수염 제모 특화, 가성비/이벤트, 후기/안정성 같은 기준으로 후보를 묶어 설명함.

### 유스타일나인 페이지 관찰

대상 URL: `https://ustyle9.com/indexn.html`

사용자 관찰:

- 페이지에 영상과 이미지 기반 정보가 많음.
- 화면상 정보는 많지만 복사/붙여넣기가 잘 되지 않는 영역이 있음.
- AI/크롤러 입장에서는 페이지를 화면으로 보고 OCR/inference해야 정보 이해가 가능한 영역이 있는 것으로 보임.

도구 확인:

- `indexn.html`은 200 응답.
- `<title>`/OG description에는 `강남레이저제모 유스타일나인`, 남자수염제모, 브라질리언제모, 레이저제모 등 핵심 키워드가 있음.
- JSON-LD / Schema.org 구조화 데이터는 없음.
- 이미지 태그가 많고, 영상 리소스도 많음.
- `robots.txt`는 Googlebot/AdsBot-Google만 명시하고 sitemap은 `/sitemap.xml` 404.

## 해석

이건 “정보가 아예 없다”보다 **공식 정보가 AI/검색엔진이 안정적으로 재사용하기 좋은 구조로 정리되어 있지 않다**에 가깝다.

- 일부 핵심 키워드는 HTML meta에 있음.
- 하지만 병원의 소개/차별점/진료 과정/상담 정보가 image/video-heavy로 제시되어, 일반 LLM 크롤러가 안정적으로 읽고 인용하기 어렵다.
- 검색엔진은 이미지 OCR/렌더링을 어느 정도 할 수 있지만, 이는 비용이 크고 불확실하며 모든 AI agent가 수행한다고 가정하기 어렵다.
- 따라서 페이지마다 스크린샷을 찍고 inference하는 것은 감사/진단용 workaround일 뿐, 병원 입장에서 scalable한 정보 운영 방식은 아니다.

## 내일/다음 연락에 쓸 한 줄

> 화면에는 정보가 많지만, AI가 안정적으로 읽고 재사용하기 쉬운 공식 텍스트/구조화 데이터로 정리되어 있지는 않아 보였습니다.

