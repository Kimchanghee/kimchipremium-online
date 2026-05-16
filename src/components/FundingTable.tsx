import type { FundingRate } from '@/lib/exchanges';

export default function FundingTable({ rows }: { rows: FundingRate[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center text-slate-500">
        펀딩비 응답이 지연되고 있습니다. 다음 갱신 때 자동으로 다시 확인합니다.
      </div>
    );
  }
  const sorted = [...rows].sort((a, b) => Math.abs(b.ratePct) - Math.abs(a.ratePct));
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
          <tr>
            <th className="p-3 text-left">Coin</th>
            <th className="p-3 text-left">Exchange</th>
            <th className="p-3 text-right">Funding Rate</th>
            <th className="p-3 text-right">Annualized</th>
            <th className="p-3 text-right">Next Funding</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((f) => {
            const annualized = f.ratePct * 3 * 365; // 8h x 3/day
            const next = new Date(f.nextFundingTime);
            return (
              <tr key={`${f.exchange}-${f.symbol}`} className="border-b border-slate-800/50 hover:bg-slate-800/40">
                <td className="p-3 font-semibold">{f.symbol}</td>
                <td className="p-3 capitalize text-slate-400">{f.exchange}</td>
                <td
                  className={`p-3 text-right font-mono font-bold ${
                    f.ratePct > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {f.ratePct > 0 ? '+' : ''}
                  {f.ratePct.toFixed(4)}%
                </td>
                <td className="p-3 text-right font-mono text-slate-400">
                  {annualized > 0 ? '+' : ''}
                  {annualized.toFixed(1)}% APR
                </td>
                <td className="p-3 text-right text-xs text-slate-500">
                  {next.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Asia/Seoul',
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
