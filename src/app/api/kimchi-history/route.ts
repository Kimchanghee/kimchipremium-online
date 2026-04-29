/**
 * GET /api/kimchi-history?symbols=BTC,ETH
 * 최근 24시간 김프 시계열 반환 (1분 단위, 5분 캐시).
 *
 * 운영 시: ECS WebSocket 서버가 매분 DynamoDB에 저장 → 여기서 read.
 * 개발/MVP: 실시간 fetch + 인메모리 캐시.
 */
import { NextResponse } from 'next/server';
import { calculateKimchiPremium } from '@/lib/exchanges';

interface DataPoint {
  ts: number;
  symbol: string;
  premiumPct: number;
}

// 인메모리 시계열 (Lambda cold start마다 리셋 — 운영 시 DynamoDB로 교체)
const memoryStore: Map<string, DataPoint[]> = new Map();
const MAX_POINTS = 24 * 60; // 24h × 1분

async function appendCurrent(symbols: string[]) {
  try {
    const current = await calculateKimchiPremium(symbols);
    const ts = Date.now();
    for (const k of current) {
      const arr = memoryStore.get(k.symbol) || [];
      arr.push({ ts, symbol: k.symbol, premiumPct: k.premiumPct });
      while (arr.length > MAX_POINTS) arr.shift();
      memoryStore.set(k.symbol, arr);
    }
  } catch {}
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = (searchParams.get('symbols') || 'BTC,ETH,XRP').split(',').map((s) => s.trim());

  await appendCurrent(symbols);

  const result: Record<string, DataPoint[]> = {};
  for (const sym of symbols) {
    result[sym] = memoryStore.get(sym) || [];
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  });
}
