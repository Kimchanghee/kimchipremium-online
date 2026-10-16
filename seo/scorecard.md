# SEO / AEO / GEO / LLMO / NEO scorecard — kimchipremium.online

Playbook: fire-your-seo-agency v1.2.1 (commit 5f7249f), Phase 0 diagnosis before/after, including the
NEO (Naver) lane because this is a Korean site.

## BEFORE — live domain, 2026-10-16 09:07 KST (crawler eye, no JS)

```
$ curl -sL -o NUL -w "%{http_code}" https://kimchipremium.online/   -> 402
$ curl -sI https://kimchipremium.online/
HTTP/1.1 402 Payment Required
Content-Length: 78
Content-Type: text/plain; charset=utf-8
Server: Vercel
X-Vercel-Error: DEPLOYMENT_DISABLED
```

| Lane | State | Evidence |
|---|---|---|
| SEO | ❌ | every URL returns HTTP 402 text/plain (78 bytes); no HTML, sitemap or robots |
| AEO | ❌ | no content, no structured data |
| GEO | ❌ | no llms.txt, no citable data |
| LLMO | ❌ | no entity description reachable |
| NEO | ❌ | nothing for Yeti to crawl; no Search Advisor verification |
| Content ops | ❌ | old source under a suspicious-content hold; not read or reused, tree removed (commit 2576205) |

## AFTER — local build served from `dist/` (scripts/qa.mjs static server mimicking Cloudflare assets)

Raw evidence: `qa/crawler-check.json` (not committed). Fetched without JS:

| Path | Status | H1 | JSON-LD types |
|---|---|---|---|
| / | 200 | 1 | Organization, WebSite, Dataset |
| /coins/btc/ | 200 | 1 | Organization, WebSite, BreadcrumbList, Dataset |
| /calculator/ | 200 | 1 | Organization, WebSite, BreadcrumbList, WebApplication |
| /guides/how-to-calculate/ | 200 | 1 | Organization, WebSite, BreadcrumbList, Article, FAQPage |
| /coins/ | 200 | 1 | Organization, WebSite, BreadcrumbList |
| /en/ | 200 | 1 | Organization, WebSite, BreadcrumbList, WebPage |
| /sitemap-index.xml, /sitemap-0.xml | 200 | – | 40 URLs, lastmod = data/content dates |
| /robots.txt | 200 | – | `User-agent: *` `Allow: /` (Yeti and AI crawlers allowed), `Disallow: /api/`, sitemap line |
| /llms.txt | 200 | – | entity, latest averages with timestamp + sources, all pages |
| /ads.txt | 200 | – | `google.com, pub-4490818204529253, DIRECT, f08c47fec0942fa0` |
| /rss.xml | 200 | – | 10 guide items (Naver-friendly RSS 2.0) |
| /this-page-does-not-exist/ | **404** | 1 | real 404 page |

`pnpm gate` -> `gate: PASS (41 pages, 40 sitemap URLs)`: title width 50–60 and description width 150–160
(Hangul counted as 2), absolute canonical = path, every LD block parses and its headline/FAQ/breadcrumb
text is visible, ≥2 internal links, direct answer paragraph (40–260 chars) present, every page in the
sitemap, guide sources present, no noindex, no placeholder text, OG PNG exists.

| Lane | State | Evidence |
|---|---|---|
| SEO | ✅ | server HTML, unique titles/descriptions, canonicals, 17 OG 1200×630 PNGs, sitemap index, robots, real 404 |
| AEO | ✅ | question-shaped H1/H2, `#answer` first paragraph with numbers + time, FAQPage only for visible FAQs, Article with dateModified, Dataset on board/coin pages, WebApplication on calculator |
| GEO | ✅ | llms.txt with numbers + timestamp + sources, methodology page, citable dated readings, stable `/coins/<sym>/` URLs |
| LLMO | ✅ | identical entity sentence in About answer, Organization LD, footer, llms.txt |
| NEO | ⚠️ | `naver-site-verification` meta renders from `PUBLIC_NAVER_VERIFICATION` (empty until owner registers in Search Advisor); label–value grids (rate strip, board table, coin price grid) for AI 브리핑; mobile-first layout verified at 390 px; RSS present. Search Advisor registration and AI 브리핑 checks are owner/parent tasks |
| Content ops | ⚠️ | 10 guides + backlog + gate; refresh cadence and performance unmeasured until deployed |

Not measured / not claimed: indexing, rankings, impressions, AI-briefing or LLM citations (see seo/measure.md).
