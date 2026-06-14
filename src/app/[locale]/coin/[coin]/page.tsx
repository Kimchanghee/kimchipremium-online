import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { calculateKimchiPremium } from '@/lib/exchanges';

interface Props {
  params: Promise<{ locale: string; coin: string }>;
}

export const revalidate = 30;

const SUPPORTED_LOCALES = ['ko', 'en', 'ja', 'zh', 'de', 'fr'] as const;
const COINS = ['btc', 'eth', 'xrp', 'sol', 'doge', 'ada', 'trx', 'avax', 'link', 'dot'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, coin } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as any) || !COINS.includes(coin)) return {};
  const symbol = coin.toUpperCase();
  return {
    title: `${symbol} kimchi premium | KimchiPremium`,
    description: `Live ${symbol} kimchi premium and KRW/USDT comparison.`,
    alternates: { canonical: `/${locale}/coin/${coin}/` },
    openGraph: { title: `${symbol} kimchi premium | KimchiPremium`, url: `https://kimchipremium.online/${locale}/coin/${coin}/` },
  };
}

export default async function CoinPage({ params }: Props) {
  const { locale, coin } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as any) || !COINS.includes(coin)) notFound();
  setRequestLocale(locale);

  const symbol = coin.toUpperCase();
  const premium = (await calculateKimchiPremium([symbol]).catch(() => []))[0];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 p-4">
        <div className="container mx-auto flex max-w-7xl items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-bold"><span className="text-red-400">Kimchi</span>Premium</Link>
          <Link href={`/${locale}/funding`} className="text-sm text-slate-400 hover:text-slate-100">Funding</Link>
        </div>
      </header>
      <section className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">{symbol} kimchi premium</h1>
        <p className="mt-3 text-slate-400">Live Upbit KRW price compared with Binance USDT converted to KRW.</p>
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          {premium ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric label="Upbit KRW" value={premium.upbitKrw.toLocaleString('ko-KR')} />
              <Metric label="Binance USDT" value={premium.binanceUsdt.toLocaleString('en-US', { maximumFractionDigits: 4 })} />
              <Metric label="Binance KRW equiv." value={premium.binanceKrwEquiv.toLocaleString('ko-KR', { maximumFractionDigits: 0 })} />
              <Metric label="Premium" value={`${premium.premiumPct > 0 ? '+' : ''}${premium.premiumPct.toFixed(2)}%`} highlight />
            </div>
          ) : (
            <p className="text-slate-500">Live market data is temporarily unavailable. Try again shortly.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 font-mono text-2xl font-bold ${highlight ? 'text-emerald-400' : 'text-slate-100'}`}>{value}</div>
    </div>
  );
}
