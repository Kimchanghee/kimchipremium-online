# PROGRESS — kimchipremium.online v2 (resume from here)

Branch: v2-cloudflare-static. SECURITY HOLD: old source not read or reused. Old tree removed in commit 2576205 (the interrupted run's 51 changes were all deletions of the old tree; no new files existed, so started clean).

## Milestones
- [x] M0 Old tree removed (2576205)
- [x] M1 Astro 5 skeleton, site.config.ts, wrangler.jsonc (+ worker), Base/Page layouts, global.css (board metaphor), IndexNow key public/5e1c...63.txt
- [x] M2 refresh.mjs (Upbit KRW + tick_size, Binance 24hr w/ data-api.binance.vision fallback, Frankfurter USD/KRW, Upbit KRW-USDT) + snapshot + history.json; src/lib/calc.mjs + tests 6/6; worker/index.mjs (/api/premium, Cache 30 s, 503 fallback); scripts/refresh-build.ps1
- [ ] M3 Home board, ~20 coin pages, calculator, /api/premium worker
- [ ] M4 >=10 Korean guides + legal pages + short English page
- [ ] M5 SEO/NEO: OG, sitemap, robots, llms.txt, LD, RSS, naver meta, gate.mjs
- [ ] M6 QA, scorecard, measure.md

## Notes
- Concept: 환전소 시세 전광판 / 두 시장 사이의 다리.

- Next (M3): src/pages/index.astro (board + live island), coins/index + coins/[sym], calculator, then content collection + guides.
