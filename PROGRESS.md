# PROGRESS — kimchipremium.online v2 (resume from here)

Branch: v2-cloudflare-static. SECURITY HOLD: old source not read or reused. Old tree removed in commit 2576205 (the interrupted run's 51 changes were all deletions of the old tree; no new files existed, so started clean).

## Milestones
- [x] M0 Old tree removed (2576205)
- [x] M1 Astro 5 skeleton, site.config.ts, wrangler.jsonc (+ worker), Base/Page layouts, global.css (board metaphor), IndexNow key public/5e1c...63.txt
- [x] M2 refresh.mjs (Upbit KRW + tick_size, Binance 24hr w/ data-api.binance.vision fallback, Frankfurter USD/KRW, Upbit KRW-USDT) + snapshot + history.json; src/lib/calc.mjs + tests 6/6; worker/index.mjs (/api/premium, Cache 30 s, 503 fallback); scripts/refresh-build.ps1
- [x] M3 Home board, 19 coin pages, calculator, /api/premium worker
- [x] M4 10 Korean guides + legal pages + /en/ summary
- [x] M5 SEO/NEO: OG (17 PNG), sitemap, robots, llms.txt, LD, RSS, naver meta, gate.mjs
- [x] M6 QA, scorecard, measure.md, DESIGN_REFERENCES.md, content/backlog.md

## Notes
- Concept: 환전소 시세 전광판 / 두 시장 사이의 다리.

- M3 partial: index.astro, coins/index + coins/[sym] (rank, tick, volume, recorded series; empty state), calculator.astro (calc + reverse + invalid state), guides/index + [slug] written. NOT YET BUILT. 10 guides written (src/content/guides). Next: legal pages, en/, 404, llms/robots/rss/sitemaps, og.mjs, gate.mjs (copy DCN, SITE/LANG=ko).

- 2026-10-16 09:05 KST: build clean; gate PASS 41 pages/40 sitemap URLs; astro check 0/0/0; tests 6/6; qa.mjs crawler 200s + 404 path = 404; browser 1440/390 overflow 0, CLS <=0.008, focus visible (msedge). Next: inspect screenshots critically, scorecard.md, measure.md, DESIGN_REFERENCES.md, content/backlog.md.
- 2026-10-16 09:15 KST: refresh-build.ps1 end-to-end OK (refresh -> test 6/6 -> build -> gate PASS 41). Second real reading committed. Worker smoke (qa/worker-smoke.mjs, mocked Cache API): 200 JSON 19 coins, max-age=30, cache hit on 2nd call, 404 for other /api paths. Browser live-update check (qa/live-check.mjs): 200 -> data-state=live, 503 -> data-state=error with snapshot time. Sparkline label fixed to recorded min/max. KP COMPLETE for CONTRACT section 7; owner items: PUBLIC_GA4_ID, PUBLIC_GSC_VERIFICATION, PUBLIC_NAVER_VERIFICATION, Search Advisor registration, deploy.
