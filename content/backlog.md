# Question backlog — kimchipremium.online

한 질문 = 한 URL. 공식 출처 또는 이 사이트가 실제 수집한 기록으로 답할 수 있을 때만 착수합니다.
Schema: 질문 | 근거 | 유형 | 상태 | URL. 상태: live / next / later.

| 질문 | 근거 | 유형 | 상태 | URL |
|---|---|---|---|---|
| 김치프리미엄이란 무엇인가요? | 업비트·바이낸스 공개 시세, ECB 기준환율 | 가이드 | live | /guides/what-is-kimchi-premium/ |
| 김프는 어떻게 계산하나요? | 계산식(계산 방법 페이지) | 가이드 | live | /guides/how-to-calculate/ |
| 김프는 왜 생기나요? | 외국환거래법, 특정금융정보법 | 가이드 | live | /guides/why-kimchi-premium-happens/ |
| 역프는 무엇인가요? | 수집 시세 | 가이드 | live | /guides/reverse-premium/ |
| 테더 프리미엄은 무엇인가요? | 업비트 KRW-USDT, ECB 기준환율 | 가이드 | live | /guides/tether-premium/ |
| 김프 계산에는 어떤 환율을 쓰나요? | ECB 기준환율(Frankfurter) | 가이드 | live | /guides/exchange-rate-basics/ |
| 김프 차익거래에는 어떤 위험이 있나요? | 관련 법령·거래소 공지 | 가이드 | live | /guides/arbitrage-risks/ |
| 해외 거래소 이용 시 법적 유의사항은? | 외국환거래법, 특정금융정보법 | 가이드 | live | /guides/overseas-exchange-legal/ |
| 트래블룰은 무엇인가요? | 특정금융정보법 | 가이드 | live | /guides/travel-rule/ |
| 가상자산 과세는 어떻게 되나요? | 소득세법 | 가이드 | live | /guides/crypto-tax-korea/ |
| 오늘 김치프리미엄이 가장 높은 코인은 무엇인가요? | src/data/latest.json (coins[].premiumFx/premiumUsdt) | 데이터 질문 페이지 | live | /ranking/ |
| 지금 역프(마이너스 김프)인 코인이 있나요? | src/data/latest.json | 데이터 질문 페이지 | live | /reverse-premium/ |
| 테더 김프는 오늘 몇 %인가요? | src/data/latest.json (fx.tetherPremium), history.json (fx, usdt) | 데이터 질문 페이지 | live | /tether-premium/ |
| 김프는 최근 며칠 동안 어떻게 움직였나요? | src/data/history.json (수집 기록만) | 데이터 질문 페이지 | live | /history/ |
| 김프 원자료를 내려받을 수 있나요? | latest.json, history.json | 데이터 내려받기 | live | /data/latest.json, /data/history.json, /data/history.csv |
| 업비트와 빗썸 원화 가격은 왜 다른가요? | 빗썸 공개 API를 refresh에 먼저 추가해야 함 | 가이드 | next | - |
| 김프는 하루 중 언제 커지나요? | 수집 기록 30일 이상(재구성 금지) | 데이터 질문 페이지 | later | - |
| 원화 입금 한도·출금 지연은 김프에 어떻게 반영되나요? | 거래소 공식 공지 | 가이드 | next | - |
| 해외 송금 한도와 외국환거래법 신고 기준은? | 기획재정부·한국은행 외환 안내 | 가이드 | next | - |
| 스테이블코인 원화 가격과 달러 환율 괴리의 역사 | 수집 기록만 | 데이터 | later | - |
| 거래소 입출금 중단 공지가 개별 코인 김프에 미치는 영향 | 날짜가 있는 거래소 공지 | 사례 페이지 | next | - |
| 비트코인 현물 ETF와 김프의 관계 | 공식 공시만 | 가이드 | next | - |
| 김프 지표를 볼 때 흔히 하는 오해 5가지 | 계산 방법, 기존 가이드 | 가이드 | next | - |

Rules: no fabricated stats or experience; every page passes `pnpm gate`; date + sources in frontmatter or on the page; 투자 권유 아님 고지 유지.

## 갱신·병합 정책
- 원자료가 바뀌거나 노출이 30% 이상 줄면 갱신 대상.
- dateModified·sitemap lastmod는 실제 변경 때만 바꾼다.
- 같은 질문 중복 페이지는 강한 쪽으로 301 + canonical, 410은 마지막 수단.
