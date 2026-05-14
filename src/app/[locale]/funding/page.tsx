import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fetchBinanceFundingRates } from '@/lib/exchanges';
import FundingTable from '@/components/FundingTable';

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 60;

const SUPPORTED_LOCALES = ['ko', 'en', 'ja', 'zh', 'de', 'fr'] as const;

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
        <div className="mt-6"><FundingTable rows={funding} /></div>
      </section>
    </main>
  );
}
