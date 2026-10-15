// Pure premium math shared by build, tests, browser island and the /api worker.
/** Kimchi premium in percent: Korean KRW price vs overseas USDT price converted at `krwPerUsd`. */
export function premiumPct(krwPrice, usdtPrice, krwPerUsd) {
  if (![krwPrice, usdtPrice, krwPerUsd].every((v) => typeof v === 'number' && Number.isFinite(v) && v > 0)) return null;
  return (krwPrice / (usdtPrice * krwPerUsd) - 1) * 100;
}
/** Overseas price converted to KRW. */
export function overseasKrw(usdtPrice, krwPerUsd) {
  if (!(usdtPrice > 0 && krwPerUsd > 0)) return null;
  return usdtPrice * krwPerUsd;
}
/** KRW price that would correspond to a target premium (reverse calculation). */
export function krwForPremium(usdtPrice, krwPerUsd, pct) {
  if (!(usdtPrice > 0 && krwPerUsd > 0) || !Number.isFinite(pct)) return null;
  return usdtPrice * krwPerUsd * (1 + pct / 100);
}
/** One tick (Upbit `tick_size` from /v1/orderbook/instruments) as percent of price: the smallest premium step a KRW quote can show. */
export function tickPct(price, tick) {
  return price > 0 && tick > 0 ? (tick / price) * 100 : null;
}
export function mean(xs) {
  const v = xs.filter((x) => typeof x === 'number' && Number.isFinite(x));
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}
export function median(xs) {
  const v = xs.filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = v.length >> 1;
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}
export const fmtPct = (p, d = 2) => (p == null ? '—' : `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p).toFixed(d)}%`);
export function fmtKrw(v) {
  if (v == null) return '—';
  const d = v >= 1000 ? 0 : v >= 100 ? 1 : v >= 1 ? 2 : 4;
  return v.toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }) + '원';
}
export function fmtUsd(v) {
  if (v == null) return '—';
  const d = v >= 1000 ? 2 : v >= 1 ? 3 : v >= 0.01 ? 4 : 6;
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}
