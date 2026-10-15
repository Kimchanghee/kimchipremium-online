import latestJson from '../data/latest.json';
import historyJson from '../data/history.json';
import { mean, median } from './calc.mjs';

export interface Coin {
  symbol: string; nameKo: string; nameEn: string; upbitKrw: number; upbitTradeTime: string; upbitChange24h: number;
  upbitVolumeKrw24h: number; tickKrw: number | null; binanceUsdt: number; binanceCloseTime: string; binanceQuoteVolume24h: number;
  premiumFx: number; premiumUsdt: number;
}
export const latest = latestJson as unknown as {
  asOf: string; source: string; sourceUrl: string;
  fx: { usdKrw: number; usdKrwDate: string; usdKrwSource: string; usdKrwSourceUrl: string; usdtKrw: number; usdtKrwTime: string; usdtKrwSource: string; usdtKrwSourceUrl: string; tetherPremium: number };
  upbit: { source: string; sourceUrl: string }; binance: { source: string; sourceUrl: string }; coins: Coin[];
};
export const history = historyJson as { since: string; readings: { t: string; fx: number; usdt: number; p: Record<string, number> }[] };
export const coins = latest.coins;
export const avgFx = mean(coins.map((c) => c.premiumFx)) as number;
export const medFx = median(coins.map((c) => c.premiumFx)) as number;
export const avgUsdt = mean(coins.map((c) => c.premiumUsdt)) as number;
export const btc = coins.find((c) => c.symbol === 'BTC')!;

/** KST formatted timestamp, e.g. 2026-10-16 01:17 KST */
export function kst(iso: string): string {
  const d = new Date(new Date(iso).getTime() + 9 * 3600e3);
  return d.toISOString().slice(0, 16).replace('T', ' ') + ' KST';
}
export const kstDate = (iso: string) => kst(iso).slice(0, 10);

/** Recorded premium readings for one coin (real readings only). */
export function seriesFor(sym: string) {
  return history.readings.filter((r) => typeof r.p[sym] === 'number').map((r) => ({ t: r.t, v: r.p[sym] }));
}
