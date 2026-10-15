// pnpm refresh: fetch Upbit KRW, Binance USDT, Upbit KRW-USDT and Frankfurter USD/KRW into src/data.
// On any failure the last good snapshot is kept untouched (exit 0 with a warning), never interpolated.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { premiumPct } from '../src/lib/calc.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'src', 'data');
export const COINS = ['BTC', 'ETH', 'XRP', 'SOL', 'DOGE', 'ADA', 'TRX', 'LINK', 'AVAX', 'DOT', 'BCH', 'XLM', 'ETC', 'SUI', 'HBAR', 'AAVE', 'NEAR', 'APT', 'UNI'];
const UA = { 'User-Agent': 'kimchipremium.online data refresh (contact@kimchipremium.online)', Accept: 'application/json' };

async function getJson(url, tries = 2) {
  let err;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(15000) });
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return await r.json();
    } catch (e) { err = e; await new Promise((s) => setTimeout(s, 800)); }
  }
  throw err;
}
async function binancePrices(symbols) {
  const q = encodeURIComponent(JSON.stringify(symbols));
  for (const host of ['https://api.binance.com', 'https://data-api.binance.vision']) {
    try { return { host, rows: await getJson(`${host}/api/v3/ticker/24hr?symbols=${q}&type=MINI`) }; } catch (e) { console.warn('binance', host, e.message); }
  }
  throw new Error('binance unavailable');
}

const now = new Date().toISOString();
const prevRaw = await readFile(path.join(dataDir, 'latest.json'), 'utf8').catch(() => null);
try {
  const markets = [...COINS.map((c) => `KRW-${c}`), 'KRW-USDT'].join(',');
  const [upbit, instruments, names, bin, fx] = await Promise.all([
    getJson(`https://api.upbit.com/v1/ticker?markets=${markets}`),
    getJson(`https://api.upbit.com/v1/orderbook/instruments?markets=${markets}`),
    getJson('https://api.upbit.com/v1/market/all?isDetails=false'),
    binancePrices(COINS.map((c) => `${c}USDT`)),
    getJson('https://api.frankfurter.app/latest?from=USD&to=KRW'),
  ]);
  const up = Object.fromEntries(upbit.map((t) => [t.market, t]));
  const ticks = Object.fromEntries(instruments.map((t) => [t.market, Number(t.tick_size)]));
  const ko = Object.fromEntries(names.map((m) => [m.market, { ko: m.korean_name, en: m.english_name }]));
  const bn = Object.fromEntries(bin.rows.map((t) => [t.symbol, t]));
  const usdKrw = Number(fx?.rates?.KRW);
  const usdtKrw = Number(up['KRW-USDT']?.trade_price);
  if (!(usdKrw > 500 && usdKrw < 5000)) throw new Error('fx out of range: ' + usdKrw);
  if (!(usdtKrw > 500 && usdtKrw < 5000)) throw new Error('KRW-USDT out of range: ' + usdtKrw);

  const coins = [];
  for (const c of COINS) {
    const u = up[`KRW-${c}`]; const b = bn[`${c}USDT`];
    if (!u || !b) { console.warn('missing', c); continue; }
    const krw = Number(u.trade_price), usdt = Number(b.lastPrice);
    coins.push({
      symbol: c,
      nameKo: ko[`KRW-${c}`]?.ko ?? c,
      nameEn: ko[`KRW-${c}`]?.en ?? c,
      upbitKrw: krw,
      upbitTradeTime: new Date(u.trade_timestamp).toISOString(),
      upbitChange24h: Number(u.signed_change_rate) * 100,
      upbitVolumeKrw24h: Number(u.acc_trade_price_24h),
      tickKrw: ticks[`KRW-${c}`] ?? null,
      binanceUsdt: usdt,
      binanceCloseTime: new Date(Number(b.closeTime)).toISOString(),
      binanceQuoteVolume24h: Number(b.quoteVolume),
      premiumFx: premiumPct(krw, usdt, usdKrw),
      premiumUsdt: premiumPct(krw, usdt, usdtKrw),
    });
  }
  if (coins.length < 10) throw new Error('too few coins: ' + coins.length);
  const latest = {
    asOf: now,
    source: 'Upbit Open API (KRW), Binance spot public market data (USDT), Frankfurter (ECB reference USD/KRW)',
    sourceUrl: 'https://kimchipremium.online/methodology/',
    fx: {
      usdKrw, usdKrwDate: fx.date, usdKrwSource: 'Frankfurter API — European Central Bank reference rate', usdKrwSourceUrl: 'https://www.frankfurter.app/docs/',
      usdtKrw, usdtKrwTime: new Date(up['KRW-USDT'].trade_timestamp).toISOString(), usdtKrwSource: 'Upbit KRW-USDT last trade', usdtKrwSourceUrl: 'https://docs.upbit.com/',
      tetherPremium: (usdtKrw / usdKrw - 1) * 100,
    },
    upbit: { source: 'Upbit Open API /v1/ticker', sourceUrl: 'https://docs.upbit.com/' },
    binance: { source: `Binance spot /api/v3/ticker/24hr (${new URL(bin.host).host})`, sourceUrl: 'https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints' },
    coins,
  };
  await writeFile(path.join(dataDir, 'latest.json'), JSON.stringify(latest, null, 1) + '\n');
  // Append a compact reading to the history (real readings only; starts on the first refresh date).
  const histPath = path.join(dataDir, 'history.json');
  const hist = JSON.parse(await readFile(histPath, 'utf8').catch(() => '{"since":null,"readings":[]}'));
  hist.since ??= now.slice(0, 10);
  hist.readings.push({ t: now, fx: usdKrw, usdt: usdtKrw, p: Object.fromEntries(coins.map((x) => [x.symbol, Number(x.premiumFx.toFixed(3))])) });
  hist.readings = hist.readings.slice(-3000);
  await writeFile(path.join(dataDir, 'history.json'), JSON.stringify(hist) + '\n');
  console.log(`refresh OK ${now}: ${coins.length} coins, USD/KRW ${usdKrw} (${fx.date}), USDT ${usdtKrw}`);
} catch (e) {
  console.warn('refresh FAILED, keeping last good snapshot:', e.message, prevRaw ? `(kept asOf ${JSON.parse(prevRaw).asOf})` : '(no snapshot yet)');
  if (!prevRaw) process.exit(1);
}
