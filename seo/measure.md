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
