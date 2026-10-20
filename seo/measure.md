# Measurement plan — kimchipremium.online

Baseline: deployment day (parent records it). Before deploy the domain returned HTTP 402
(Vercel DEPLOYMENT_DISABLED), so every metric starts from zero.

## Day 0 (after deploy; parent-owned accounts)
- Google Search Console: domain property, submit `https://kimchipremium.online/sitemap-index.xml`;
  URL-inspect `/`, `/coins/btc/`, `/calculator/`, `/guides/what-is-kimchi-premium/`.
- Naver Search Advisor: register site, set `PUBLIC_NAVER_VERIFICATION`, rebuild, verify; submit
  `sitemap-index.xml` and `rss.xml`; manual 수집 요청 for `/`, `/coins/btc/`, `/guides/what-is-kimchi-premium/`.
- IndexNow (Bing/Naver/Yandex): key `5e1c9a7d3b2f48e6a0d4c8b17f2e9a63`, key file `/5e1c9a7d3b2f48e6a0d4c8b17f2e9a63.txt`.
- GA4: set `PUBLIC_GA4_ID`, rebuild; verify `tool_used` (calculator) events in DebugView.
- Verify `/api/premium` on production returns 200 JSON and `cache-control: max-age=30`; watch Worker
  request count in Cloudflare (shared 100k/day account cap) for the first days.
- Re-run the crawler-eye commands from seo/scorecard.md against production.

## +14 days
| Metric | Where | Question |
|---|---|---|
| Indexed pages / 40 sitemap URLs | GSC Pages, Search Advisor 수집 현황 | Are coin pages indexed or flagged "crawled – not indexed" (thin)? |
| Impressions, clicks, CTR by query | GSC Performance, Search Advisor 검색어 | Do 김프/김치프리미엄/<코인> 김프 queries appear? Which page wins them? |
| Naver AI 브리핑 source chips | Naver app search: "김치프리미엄 계산", "김프 뜻", "테더 프리미엄" | Is any page cited? Record screenshot + date |
| LLM citations | ask ChatGPT/Perplexity "현재 김치프리미엄 계산 방법" | Is kimchipremium.online cited? |
| Engaged sessions, tool_used | GA4 | Do visitors use the calculator / coin pages? |
| Worker requests/day | Cloudflare | Stays well under shared cap? |
| AdSense | AdSense site status | Approval state only (no revenue claims) |

Weekend dips are expected for market topics; treat a weekday/weekend pattern as real demand, not a bug.

## 재측정 2026-11-03 (2026-10-20 5레인 작업 기준)
- 수치 기준선: 콘솔 데이터 대기 중(GSC·Bing·네이버 서치어드바이저 내보내기 전에는 숫자를 기록하지 않음).
- 2026-10-20 반영: 질문 페이지 /ranking/, /reverse-premium/, /tether-premium/, /history/; 원자료 /data/latest.json, /data/history.json, /data/history.csv; robots에 Claude-SearchBot·Perplexity-User; llms.txt 최종 갱신일과 내려받기 링크; gate에 질문 H1 다음 첫 문단 = 직답 검사.
- 2026-11-03 기록: 새 URL별 색인 여부, 노출·클릭·평균 순위(GSC), 네이버 수집 여부(서치어드바이저 수집 요청은 소유자 콘솔 작업), Bing 색인 여부.
- 인용 점검(O/X, 날짜·정확한 질문 기록, Perplexity·ChatGPT 검색·네이버 AI 브리핑): 오늘 김치프리미엄이 가장 높은 코인은 무엇인가요? / 지금 역프(마이너스 김프)인 코인이 있나요? / 테더 김프는 오늘 몇 %인가요? / 김프는 최근 며칠 동안 어떻게 움직였나요? / 김프 전광판은 무엇인가요?
