/**
 * 코인 거래소 시세 어댑터 — Upbit / Binance / Bybit
 *
 * 모두 무료 Public API (인증 불필요).
 * - Upbit:    https://api.upbit.com (REST + WebSocket)
 * - Binance:  https://api.binance.com (REST + WebSocket)
 * - Bybit:    https://api.bybit.com (REST + WebSocket)
 *
 * 운영시 ECS Fargate WebSocket 서버에서 3개 거래소 동시 구독 → ElastiCache에 저장 → 클라이언트에 SSE 푸시.
 * 본 모듈은 REST 폴링 헬퍼만 제공 (백업용).
 */

export type Exchange = 'upbit' | 'binance' | 'bybit';

export interface Ticker {
  exchange: Exchange;
  symbol: string;          // BTC, ETH 등
  pair: string;            // BTC/KRW, BTC/USDT
  price: number;           // 거래소 통화 기준
  priceKrw: number;        // 원화 환산
  volume24h: number;       // 거래량
  change24hPct: number;
  timestamp: number;
}

export interface FundingRate {
  exchange: Exchange;
  symbol: string;
  rate: number;            // 8h 펀딩비율 (소수)
  ratePct: number;
  nextFundingTime: number; // unix ms
}

export interface KimchiPremium {
  symbol: string;
  upbitKrw: number;
  binanceUsdt: number;
  usdKrw: number;          // 환율
  binanceKrwEquiv: number; // 바이낸스 가격을 원화로 환산
  premiumPct: number;      // (upbit - binance) / binance * 100
  timestamp: number;
}

const POPULAR_SYMBOLS = ['BTC', 'ETH', 'XRP', 'SOL', 'DOGE', 'ADA', 'TRX', 'AVAX', 'LINK', 'DOT'];

/* ----- Upbit ----- */
export async function fetchUpbitTickers(symbols: string[] = POPULAR_SYMBOLS): Promise<Ticker[]> {
  const markets = symbols.map((s) => `KRW-${s}`).join(',');
  try {
    const res = await fetch(`https://api.upbit.com/v1/ticker?markets=${markets}`, {
      next: { revalidate: 30 },
    });
    const data = await res.json();
    return (data || []).map(
      (t: any): Ticker => ({
        exchange: 'upbit',
        symbol: t.market.split('-')[1],
        pair: t.market,
        price: t.trade_price,
        priceKrw: t.trade_price,
        volume24h: t.acc_trade_price_24h,
        change24hPct: t.signed_change_rate * 100,
        timestamp: t.timestamp,
      })
    );
  } catch {
    return [];
  }
}

/* ----- Binance ----- */
export async function fetchBinanceTickers(symbols: string[] = POPULAR_SYMBOLS, usdKrw = 1400): Promise<Ticker[]> {
  const result: Ticker[] = [];
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', { next: { revalidate: 30 } });
    const data: any[] = await res.json();
    for (const sym of symbols) {
      const t = data.find((d) => d.symbol === `${sym}USDT`);
      if (t) {
        const price = parseFloat(t.lastPrice);
        result.push({
          exchange: 'binance',
          symbol: sym,
          pair: `${sym}USDT`,
          price,
          priceKrw: price * usdKrw,
          volume24h: parseFloat(t.quoteVolume),
          change24hPct: parseFloat(t.priceChangePercent),
          timestamp: t.closeTime,
        });
      }
    }
  } catch {}
  return result;
}

/* Binance 펀딩비 (perpetual) */
export async function fetchBinanceFundingRates(symbols: string[] = POPULAR_SYMBOLS): Promise<FundingRate[]> {
  const result: FundingRate[] = [];
  try {
    const res = await fetch('https://fapi.binance.com/fapi/v1/premiumIndex', { next: { revalidate: 60 } });
    const data: any[] = await res.json();
    for (const sym of symbols) {
      const t = data.find((d) => d.symbol === `${sym}USDT`);
      if (t) {
        const rate = parseFloat(t.lastFundingRate);
        result.push({
          exchange: 'binance',
          symbol: sym,
          rate,
          ratePct: rate * 100,
          nextFundingTime: t.nextFundingTime,
        });
      }
    }
  } catch {}
  return result;
}

/* USD/KRW 환율 (오프 거래소 환율 기준) */
export async function getUsdKrw(): Promise<number> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 300 } });
    const data = await res.json();
    return data.rates?.KRW || 1400;
  } catch {
    return 1400;
  }
}

/* 김치 프리미엄 계산 */
export async function calculateKimchiPremium(symbols: string[] = POPULAR_SYMBOLS): Promise<KimchiPremium[]> {
  const usdKrw = await getUsdKrw();
  const [upbit, binance] = await Promise.all([
    fetchUpbitTickers(symbols),
    fetchBinanceTickers(symbols, usdKrw),
  ]);

  const result: KimchiPremium[] = [];
  for (const sym of symbols) {
    const u = upbit.find((t) => t.symbol === sym);
    const b = binance.find((t) => t.symbol === sym);
    if (u && b) {
      const binanceKrwEquiv = b.price * usdKrw;
      result.push({
        symbol: sym,
        upbitKrw: u.priceKrw,
        binanceUsdt: b.price,
        usdKrw,
        binanceKrwEquiv,
        premiumPct: ((u.priceKrw - binanceKrwEquiv) / binanceKrwEquiv) * 100,
        timestamp: Date.now(),
      });
    }
  }
  return result.sort((a, b) => b.premiumPct - a.premiumPct);
}
