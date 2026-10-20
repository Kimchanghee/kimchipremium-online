import type { APIRoute } from 'astro';
import historyJson from '../../data/history.json';

// Flat CSV of recorded readings: one row per reading, per-coin premium in percent vs the ECB reference rate. Empty cell = not recorded.
export const GET: APIRoute = () => {
  const rs = (historyJson as { readings: { t: string; fx: number; usdt: number; p: Record<string, number> }[] }).readings;
  const syms = [...new Set(rs.flatMap((r) => Object.keys(r.p)))];
  const head = ['t_utc', 'usd_krw_ecb', 'usdt_krw_upbit', ...syms.map((s) => `premium_fx_${s}`)];
  const rows = rs.map((r) => [r.t, r.fx, r.usdt, ...syms.map((s) => (typeof r.p[s] === 'number' ? r.p[s] : ''))].join(','));
  return new Response([head.join(','), ...rows].join('\n') + '\n', { headers: { 'content-type': 'text/csv; charset=utf-8' } });
};
