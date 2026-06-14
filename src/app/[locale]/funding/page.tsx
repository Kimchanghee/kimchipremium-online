import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fetchBinanceFundingRates } from '@/lib/exchanges';
import FundingTable from '@/components/FundingTable';

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 60;

const SUPPORTED_LOCALES = ['ko', 'en', 'ja', 'zh', 'de', 'fr'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Binance funding rates | KimchiPremium',
    description: 'Read 8-hour Binance perpetual funding rates with kimchi premium context before acting on crowded long or short positioning.',
    alternates: { canonical: `/${locale}/funding/` },
    openGraph: {
      title: 'Binance funding rates | KimchiPremium',
      description: 'Funding-rate context for major crypto assets.',
      url: `https://kimchipremium.online/${locale}/funding/`,
    },
  };
}

export default async function FundingPage({ params }: Props) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as any)) notFound();
  setRequestLocale(locale);

  const funding = await fetchBinanceFundingRates().catch(() => []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 p-4">
        <div className="container mx-auto flex max-w-7xl items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-bold"><span className="text-red-400">Kimchi</span>Premium</Link>
          <Link href={`/${locale}`} className="text-sm text-slate-400 hover:text-slate-100">Dashboard</Link>
        </div>
      </header>
      <section className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">Binance funding rates</h1>
        <p className="mt-3 text-slate-400">8-hour perpetual futures funding rates for major crypto assets.</p>
        <section className="mt-6 grid gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-xl font-semibold">How to read funding</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Funding is not a buy or sell signal by itself. It shows which side of the perpetual market is paying and can help explain crowded long or short positioning.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Read this together with premium, liquidity, and exchange status. A high rate can stay high during a strong trend,
              while a sudden flip can simply reflect hedging demand around a news event.
            </p>
          </div>
          <ul className="space-y-2 text-sm leading-6 text-slate-300">
            <li>- Positive funding usually means longs pay shorts, often during bullish crowding.</li>
            <li>- Negative funding usually means shorts pay longs, often during defensive or bearish crowding.</li>
            <li>- Compare funding with kimchi premium before assuming a local market imbalance.</li>
            <li>- Recheck after the next 8-hour settlement window if the table looks unusually one-sided.</li>
          </ul>
        </section>
        <div className="mt-6"><FundingTable rows={funding} /></div>
      </section>
    </main>
  );
}
