import type { APIRoute } from 'astro';
import historyJson from '../../data/history.json';

// Build-time copy of src/data/history.json: recorded readings only (t = observation time UTC, fx = ECB reference USD/KRW,
// usdt = Upbit KRW-USDT, p = per-coin premium in percent vs fx). No interpolation or reconstruction.
export const GET: APIRoute = () =>
  new Response(JSON.stringify({
    dataset: '김프 전광판 김치프리미엄 수집 기록 (kimchipremium.online)',
    url: 'https://kimchipremium.online/data/history.json',
    csv: 'https://kimchipremium.online/data/history.csv',
    methodology: 'https://kimchipremium.online/methodology/',
    source: 'Upbit Open API (KRW), Binance spot public market data (USDT), Frankfurter (ECB reference USD/KRW)',
    fields: { t: 'observation time (UTC)', fx: 'ECB reference USD/KRW used', usdt: 'Upbit KRW-USDT last trade (KRW)', p: 'per-coin kimchi premium, percent vs fx' },
    notice: '수집된 값만 담습니다. 투자·차익거래 권유가 아닙니다.',
    ...historyJson,
  }, null, 2) + '\n', { headers: { 'content-type': 'application/json; charset=utf-8' } });
