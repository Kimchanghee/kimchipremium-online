# kimchipremium.io — 코인 김프·펀딩비·청산맵 대시보드 (A-2)

> 한국·글로벌 거래소 통합 대시보드. WebSocket 실시간 + 24시간 트래픽.

| 항목 | 값 |
|---|---|
| 도메인 | kimchipremium.io |
| 카테고리 | 코인·금융 (A-2) |
| 지원 언어 | ko, en, ja, zh, de, fr (6개) |
| AWS 비용 | $55~$80/월 (ECS Fargate WebSocket) |
| 예상 RPM | $7~$13 |
| Stage 3 월 PV | 약 2,500K |
| Stage 3 월 수익 | $17,500~$32,500 |

## 데이터 소스

- **Upbit Public API** (REST + WebSocket)
- **Binance Public API** (REST + WebSocket)
- **Bybit Public API** (REST + WebSocket)
- **CoinGecko API** (시가총액·도미넌스)
- **CryptoQuant** (선택, 온체인 데이터)

## 자동화 흐름

1. ECS Fargate WebSocket 서버 → 거래소 데이터 실시간 수신
2. ElastiCache Redis 캐시 → 클라이언트 SSE 푸시
3. 1분 단위 요약을 DynamoDB 저장 (히스토리)

## 핵심 기능

- 김치프리미엄 실시간 표 (코인별)
- 펀딩비 차익 종목 랭킹
- 청산 히트맵 (1분/15분/1시간)
- 거래량 이상 알림 (Web Push)

## SEO 페이지

- 코인별 상세 (×6 언어)
- 거래소별 / 페어별
- "오늘의 김프 Top 10" 매시간 갱신

## 광고 배치

- 대시보드 Native Banner ×3 (스크롤·필터마다 refresh)
- "거래소 가입" → Direct Link (어필리에이트 결합)
- Popunder 활성 (코인 트래픽 가장 관용도 높음)
- Social Bar 활성
- In-Page Push 활성

## 운영 부담

- 실시간 WebSocket → 거래소 API 한도 모니터링 필수
- 거래소 점검·API 변경에 빠른 대응 필요 → 마지막 출시 권장
