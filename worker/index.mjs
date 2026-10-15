// Tiny /api/* Worker (runs ONLY for /api/*; everything else is served by the free static assets layer).
// GET /api/premium -> live premiums. Upbit has no CORS, so the browser cannot call it directly.
// Cache API >= 30 s; on upstream failure returns 503 JSON so the page keeps showing its build snapshot.
import { premiumPct } from '../src/lib/calc.mjs';

const COINS = ['BTC', 'ETH', 'XRP', 'SOL', 'DOGE', 'ADA', 'TRX', 'LINK', 'AVAX', 'DOT', 'BCH', 'XLM', 'ETC', 'SUI', 'HBAR', 'AAVE', 'NEAR', 'APT', 'UNI'];
const TTL = 30;
const json = (body, status, maxAge) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': `public, max-age=${maxAge}`, 'access-control-allow-origin': '*' },
  });

async function get(url, ttl = TTL) {
  const r = await fetch(url, { headers: { accept: 'application/json', 'user-agent': 'kimchipremium.online' }, cf: { cacheTtl: ttl, cacheEverything: true }, signal: AbortSignal.timeout(4000) });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}
async function binance() {
  const q = encodeURIComponent(JSON.stringify(COINS.map((c) => c + 'USDT')));
  for (const host of ['https://data-api.binance.vision', 'https://api.binance.com']) {
    try { return await get(`${host}/api/v3/ticker/price?symbols=${q}`); } catch {}
  }
  throw new Error('binance');
}

async function build() {
  const markets = [...COINS.map((c) => 'KRW-' + c), 'KRW-USDT'].join(',');
  const [up, bn, fx] = await Promise.all([
    get('https://api.upbit.com/v1/ticker?markets=' + markets),
    binance(),
    get('https://api.frankfurter.app/latest?from=USD&to=KRW', 3600).catch(() => null),
  ]);
  const u = Object.fromEntries(up.map((t) => [t.market, t]));
  const b = Object.fromEntries(bn.map((t) => [t.symbol, Number(t.price)]));
  const usdKrw = Number(fx?.rates?.KRW) || null;
  const usdtKrw = Number(u['KRW-USDT']?.trade_price) || null;
  const coins = COINS.filter((c) => u['KRW-' + c] && b[c + 'USDT']).map((c) => {
    const krw = Number(u['KRW-' + c].trade_price), usdt = b[c + 'USDT'];
    return { symbol: c, upbitKrw: krw, binanceUsdt: usdt, premiumFx: usdKrw ? premiumPct(krw, usdt, usdKrw) : null, premiumUsdt: usdtKrw ? premiumPct(krw, usdt, usdtKrw) : null };
  });
  return { asOf: new Date().toISOString(), fx: { usdKrw, usdKrwDate: fx?.date ?? null, usdtKrw }, coins, source: 'Upbit, Binance, Frankfurter (ECB)' };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/premium' && url.pathname !== '/api/premium/') return json({ error: 'not_found' }, 404, 60);
    if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405, 0);
    const cache = caches.default;
    const key = new Request(url.origin + '/api/premium', { method: 'GET' });
    const hit = await cache.match(key);
    if (hit) return hit;
    try {
      const res = json(await build(), 200, TTL);
      ctx.waitUntil(cache.put(key, res.clone()));
      return res;
    } catch {
      return json({ error: 'upstream_unavailable', asOf: new Date().toISOString() }, 503, 10);
    }
  },
};
