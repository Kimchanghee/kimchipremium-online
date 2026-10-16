# Design references — kimchipremium.online (김프 전광판)

## Metaphor
A bank exchange-rate board (환전소 시세 전광판) hung on the bridge between two markets: a dark green board
band, a white rate sheet ruled with heavy black lines, every number in tabular monospace. Korean market
colour convention: red = above (김프), blue = below (역프). The page *is* the board: the home page opens
on the answer sentence, the rate strip and the full coin table, not on a hero.

## Tokens (src/styles/global.css)
- Colour: paper #fbfbf8, ink #121a17, muted #4f5b56, hairline #d3d9d5, rule #18241f, board band #0e3a2f /
  #0a2c23, band ink #f1eee3, up #b5122b, down #1249a8, brass #8a6418 (focus ring, kickers). All text pairs ≥ 4.5:1.
- Type: system Korean sans stack (Pretendard if installed → Apple SD Gothic Neo → Malgun Gothic → Noto Sans KR);
  numbers in Consolas/SF Mono/D2Coding with `tabular-nums`. No web-font download (no CLS, no licence issue).
  Scale: body 17/1.7, H1 clamp(26–38), H2 23 with a 2 px top rule.
- Layout: max 1120 px; table board with fixed column order (coin, Upbit KRW, Binance USDT, converted, two
  premiums, diverging bar ±3 %); 390 px collapses to coin / KRW / two premiums. Reserved ad slot with fixed
  min-height. 44 px targets in nav and controls; visible 3 px brass focus ring; `prefers-reduced-motion` respected.
- Deliberately avoided: gradient hero, glass, neon, rounded cards, pills, decorative metric cards, fake stats.

## States designed
Live update failure (keeps build snapshot, says so with the exact collection time), single-reading coin
(no chart, explains why), invalid calculator input, 404 board page, wide-number overflow (horizontal table scroll).

## OSS design systems
None copied or adapted. Price-colour convention (red up / blue down) follows the common Korean exchange convention; no third-party code, fonts or assets are bundled.
