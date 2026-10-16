// Build-time Open Graph images (1200x630 PNG): exchange-board look, rendered from SVG with resvg.
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'og');
await mkdir(outDir, { recursive: true });
await writeFile(path.join(root, 'public', 'ads.txt'), 'google.com, pub-4490818204529253, DIRECT, f08c47fec0942fa0\n');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const width = (s) => [...s].reduce((n, ch) => n + (/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7a3\u3000-\u9fff]/.test(ch) ? 2 : 1), 0);
function wrap(text, max) {
  const words = text.split(/\s+/); const lines = []; let cur = '';
  for (const w of words) { const next = cur ? cur + ' ' + w : w; if (width(next) > max && cur) { lines.push(cur); cur = w; } else cur = next; }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}
const KO = "'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";
const MONO = "Consolas, 'Courier New', monospace";
function svg(kicker, title) {
  const lines = wrap(title, 30);
  const t = lines.map((l, i) => `<text x="72" y="${300 + i * 84}" font-family="${KO}" font-size="64" font-weight="700" fill="#121a17">${esc(l)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fbfbf8"/>
  <rect width="1200" height="150" fill="#0e3a2f"/><rect y="150" width="1200" height="8" fill="#0a2c23"/>
  <rect x="72" y="42" width="128" height="66" fill="none" stroke="#f1eee3" stroke-width="4"/>
  <text x="136" y="88" text-anchor="middle" font-family="${MONO}" font-size="34" font-weight="700" fill="#f1eee3">₩⇄$</text>
  <text x="228" y="78" font-family="${KO}" font-size="38" font-weight="700" fill="#f1eee3">김프 전광판</text>
  <text x="228" y="114" font-family="${KO}" font-size="24" fill="#b9c8bf">업비트 ↔ 바이낸스 · 두 환율 기준</text>
  <text x="72" y="222" font-family="${KO}" font-size="28" font-weight="700" fill="#8a6418">${esc(kicker)}</text>
  ${t}
  <line x1="72" x2="1128" y1="548" y2="548" stroke="#18241f" stroke-width="3"/>
  <text x="72" y="592" font-family="${MONO}" font-size="26" fill="#4f5b56">kimchipremium.online</text>
  <text x="1128" y="592" text-anchor="end" font-family="${KO}" font-size="24" fill="#4f5b56"><tspan fill="#b5122b">▲ 김프</tspan>  <tspan fill="#1249a8">▼ 역프</tspan></text>
</svg>`;
}
const pages = [
  ['default', '김프 전광판', '코인별 김치프리미엄 시세판'],
  ['home', '시세판', '지금 김치프리미엄은 몇 %인가요?'],
  ['coin', '코인별 김프', '업비트 원화 가격과 바이낸스 가격, 같은 시각 비교'],
  ['calculator', '계산기', '김프 계산기: 김프와 목표 김프 역산'],
  ['guides', '가이드', '김치프리미엄 개념·계산·위험 가이드'],
  ['methodology', '계산 방법', '김프 숫자는 어디서 오고 어떻게 계산하나요?'],
  ['en', 'English', 'Kimchi premium board — Upbit vs Binance'],
];
const gdir = path.join(root, 'src', 'content', 'guides');
for (const f of await readdir(gdir)) {
  if (!f.endsWith('.md')) continue;
  const src = await readFile(path.join(gdir, f), 'utf8');
  const h1 = /\nh1:\s*"([^"]+)"/.exec(src)?.[1];
  const kicker = /\nkicker:\s*"([^"]+)"/.exec(src)?.[1] ?? '가이드';
  if (h1) pages.push([`guide-${f.replace(/\.md$/, '')}`, kicker, h1]);
}
for (const [slug, kicker, title] of pages) {
  const png = new Resvg(svg(kicker, title), { fitTo: { mode: 'width', value: 1200 }, font: { loadSystemFonts: true, defaultFontFamily: 'Malgun Gothic' } }).render().asPng();
  await writeFile(path.join(outDir, `${slug}.png`), png);
}
console.log(`og: wrote ${pages.length} images`);
