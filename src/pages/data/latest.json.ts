import type { APIRoute } from 'astro';
import latestJson from '../../data/latest.json';

// Build-time copy of src/data/latest.json with its own source and observation-time fields kept verbatim.
// Times are UTC ISO strings; premiums are percent. Not investment advice. The 30-second live JSON stays at /api/premium.
export const GET: APIRoute = () =>
  new Response(JSON.stringify({
    dataset: '김프 전광판 코인별 김치프리미엄 스냅샷 (kimchipremium.online)',
    url: 'https://kimchipremium.online/data/latest.json',
    methodology: 'https://kimchipremium.online/methodology/',
    units: { premiumFx: 'percent vs ECB reference USD/KRW', premiumUsdt: 'percent vs Upbit KRW-USDT', tetherPremium: 'percent', upbitKrw: 'KRW', binanceUsdt: 'USDT' },
    notice: '투자·차익거래 권유가 아닙니다. 수집 시점의 값이며 이후 달라질 수 있습니다.',
    ...latestJson,
  }, null, 2) + '\n', { headers: { 'content-type': 'application/json; charset=utf-8' } });
