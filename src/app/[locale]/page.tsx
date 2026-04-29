import { setRequestLocale } from 'next-intl/server';
import { calculateKimchiPremium, fetchBinanceFundingRates, getUsdKrw } from '@/lib/exchanges';
import KimchiTable from '@/components/KimchiTable';
import FundingTable from '@/components/FundingTable';
import PremiumChart from '@/components/PremiumChart';

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 30; // 30s ISR — WebSocket이 없을 때 백업

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [kimchi, funding, usdKrw] = await Promise.all([
    calculateKimchiPremium().catch(() => []),
    fetchBinanceFundingRates().catch(() => []),
    getUsdKrw().catch(() => 1400),
  ]);

  const avgPremium =
    kimchi.length > 0
      ? kimchi.reduce((sum, k) => sum + k.premiumPct, 0) / kimchi.length
      : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="container mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-red-400">Kimchi</span>Premium
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">USD/KRW</span>
            <span className="font-mono text-emerald-400">{usdKrw.toFixed(2)}</span>
          </div>
        </div>
      </header>

      <section className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            label="Avg Premium"
            value={`${avgPremium.toFixed(2)}%`}
            tone={avgPremium > 0 ? 'green' : 'red'}
          />
          <Stat label="Tracked Coins" value={String(kimchi.length)} />
          <Stat label="Updated" value="just now (30s ISR)" />
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-4">
        <h2 className="mb-3 text-xl font-semibold">📈 24시간 프리미엄 추이</h2>
        <PremiumChart symbols={['BTC', 'ETH', 'XRP', 'SOL', 'DOGE']} />
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-4">
        <h2 className="mb-3 text-xl font-semibold">🌶️ Kimchi Premium</h2>
        <KimchiTable rows={kimchi} />
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-4">
        <h2 className="mb-3 text-xl font-semibold">📊 Binance Funding Rates</h2>
        <FundingTable rows={funding} />
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>실시간 데이터 — Upbit / Binance / Bybit Public API</p>
        <p className="mt-1 text-xs">투자 자문 아님. 시세 정보는 참고용.</p>
      </footer>
    </main>
  );
}

function Stat({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'green' | 'red' | 'default' }) {
  const color =
    tone === 'green' ? 'text-emerald-400' : tone === 'red' ? 'text-red-400' : 'text-slate-200';
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 text-3xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
