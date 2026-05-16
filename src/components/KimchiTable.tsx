import type { KimchiPremium } from '@/lib/exchanges';

export default function KimchiTable({ rows }: { rows: KimchiPremium[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center text-slate-500">
        거래소 응답이 지연되고 있습니다. 잠시 후 자동으로 최신 프리미엄 표가 갱신됩니다.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
          <tr>
            <th className="p-3 text-left">Coin</th>
            <th className="p-3 text-right">Upbit (KRW)</th>
            <th className="p-3 text-right">Binance (USDT)</th>
            <th className="p-3 text-right">Binance ≈ KRW</th>
            <th className="p-3 text-right">Premium</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((k) => (
            <tr key={k.symbol} className="border-b border-slate-800/50 hover:bg-slate-800/40">
              <td className="p-3 font-semibold">{k.symbol}</td>
              <td className="p-3 text-right font-mono">{k.upbitKrw.toLocaleString('ko-KR')}</td>
              <td className="p-3 text-right font-mono text-slate-400">
                {k.binanceUsdt.toLocaleString('en-US', { maximumFractionDigits: 4 })}
              </td>
              <td className="p-3 text-right font-mono text-slate-400">
                {k.binanceKrwEquiv.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}
              </td>
              <td
                className={`p-3 text-right font-mono font-bold ${
                  k.premiumPct > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {k.premiumPct > 0 ? '+' : ''}
                {k.premiumPct.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
