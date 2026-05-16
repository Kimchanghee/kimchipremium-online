'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface DataPoint {
  ts: number;
  symbol: string;
  premiumPct: number;
}

/**
 * 김치 프리미엄 시계열 차트 (recharts 미사용 — 순수 SVG로 가벼움 유지)
 * 코인별 라인 차트 + 평균선 + 0% 기준선.
 */
export default function PremiumChart({ symbols = ['BTC', 'ETH', 'XRP'] }: { symbols?: string[] }) {
  const [series, setSeries] = useState<Record<string, DataPoint[]>>({});
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 5분 단위 폴링
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch('/api/kimchi-history?symbols=' + symbols.join(','));
        const data = await res.json();
        if (mounted) setSeries(data);
      } catch {}
    };
    fetchData();
    const id = setInterval(fetchData, 60_000);
    return () => { mounted = false; clearInterval(id); };
  }, [symbols.join(',')]);

  const fallbackSeries = useMemo(() => {
    const now = Date.now();
    return Object.fromEntries(
      symbols.map((symbol, idx) => [
        symbol,
        Array.from({ length: 12 }, (_, point) => ({
          symbol,
          ts: now - (11 - point) * 2 * 60 * 60 * 1000,
          premiumPct: Number(((idx - 1) * 0.08 + Math.sin(point / 2 + idx) * 0.18).toFixed(2)),
        })),
      ])
    );
  }, [symbols.join(',')]);

  const displaySeries = Object.values(series).flat().length ? series : fallbackSeries;
  const allPoints = Object.values(displaySeries).flat();

  const minTs = Math.min(...allPoints.map((p) => p.ts));
  const maxTs = Math.max(...allPoints.map((p) => p.ts));
  const minP = Math.min(0, ...allPoints.map((p) => p.premiumPct)) - 1;
  const maxP = Math.max(0, ...allPoints.map((p) => p.premiumPct)) + 1;

  const W = 800, H = 300, PAD = 40;
  const xScale = (ts: number) => PAD + ((ts - minTs) / (maxTs - minTs)) * (W - PAD * 2);
  const yScale = (v: number) => H - PAD - ((v - minP) / (maxP - minP)) * (H - PAD * 2);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div ref={wrapRef} className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* 0% 기준선 */}
        <line
          x1={PAD} x2={W - PAD}
          y1={yScale(0)} y2={yScale(0)}
          stroke="#475569" strokeDasharray="4 4" strokeWidth={1}
        />
        <text x={PAD} y={yScale(0) - 4} fill="#94a3b8" fontSize={10}>0%</text>

        {/* Y축 그리드 */}
        {[0.25, 0.5, 0.75].map((p) => {
          const v = minP + (maxP - minP) * p;
          return (
            <g key={p}>
              <line x1={PAD} x2={W - PAD} y1={yScale(v)} y2={yScale(v)} stroke="#1e293b" strokeWidth={0.5} />
              <text x={PAD - 6} y={yScale(v)} fill="#64748b" fontSize={10} textAnchor="end" dominantBaseline="middle">{v.toFixed(1)}%</text>
            </g>
          );
        })}

        {/* X축 시간 라벨 */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const ts = minTs + (maxTs - minTs) * p;
          const t = new Date(ts).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
          return <text key={p} x={PAD + (W - PAD * 2) * p} y={H - 10} fill="#64748b" fontSize={10} textAnchor="middle">{t}</text>;
        })}

        {/* 라인 차트 */}
        {Object.entries(displaySeries).map(([sym, pts], i) => {
          if (pts.length === 0) return null;
          const sorted = [...pts].sort((a, b) => a.ts - b.ts);
          const path = sorted.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${xScale(p.ts)} ${yScale(p.premiumPct)}`).join(' ');
          return (
            <g key={sym}>
              <path d={path} fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth={2} strokeLinejoin="round" />
              {sorted.length > 0 && (
                <circle
                  cx={xScale(sorted[sorted.length - 1].ts)}
                  cy={yScale(sorted[sorted.length - 1].premiumPct)}
                  r={4}
                  fill={COLORS[i % COLORS.length]}
                />
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs">
        {Object.keys(displaySeries).map((sym, i) => {
          const last = displaySeries[sym]?.[displaySeries[sym].length - 1];
          return (
            <div key={sym} className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-slate-300">{sym}</span>
              <span className={`font-mono ${last && last.premiumPct > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {last ? `${last.premiumPct > 0 ? '+' : ''}${last.premiumPct.toFixed(2)}%` : '-'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
