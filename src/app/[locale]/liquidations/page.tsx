import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { calculateKimchiPremium } from '@/lib/exchanges';

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 60;

const SUPPORTED_LOCALES = ['ko', 'en', 'ja', 'zh', 'de', 'fr'] as const;

export default async function LiquidationsPage({ params }: Props) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as any)) notFound();
  setRequestLocale(locale);

  const premiums = await calculateKimchiPremium().catch(() => []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 p-4">
        <div className="container mx-auto flex max-w-7xl items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-bold"><span className="text-red-400">Kimchi</span>Premium</Link>
          <Link href={`/${locale}`} className="text-sm text-slate-400 hover:text-slate-100">Dashboard</Link>
        </div>
      </header>
      <section className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">Crypto pressure board</h1>
        <p className="mt-3 text-slate-400">Premium extremes often signal crowded positioning and liquidation risk.</p>
        <section className="mt-6 grid gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-xl font-semibold">Pressure signals to check first</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              This page keeps the premium signal visible before any exchange or affiliate click. Use it to spot unusual gaps, then verify with order book depth and funding context.
            </p>
          </div>
          <ul className="space-y-2 text-sm leading-6 text-slate-300">
            <li>- A high positive premium can mean local demand is paying more than global USDT markets.</li>
            <li>- A low or negative premium can show local weakness, withdrawal friction, or temporary liquidity gaps.</li>
            <li>- Always compare premium, funding, volume, and exchange status together before acting.</li>
          </ul>
        </section>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {premiums.map((p) => (
            <Link key={p.symbol} href={`/${locale}/coin/${p.symbol.toLowerCase()}`} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-red-400">
              <div className="text-xl font-semibold">{p.symbol}</div>
              <div className={`mt-2 font-mono text-2xl ${p.premiumPct > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {p.premiumPct > 0 ? '+' : ''}{p.premiumPct.toFixed(2)}%
              </div>
              <p className="mt-2 text-sm text-slate-500">Upbit vs Binance KRW equivalent</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
