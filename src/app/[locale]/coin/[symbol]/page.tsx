import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { calculateKimchiPremium, fetchBinanceFundingRates } from '@/lib/exchanges';

interface Props {
  params: Promise<{ locale: string; symbol: string }>;
}

export const revalidate = 60;

const SUPPORTED_LOCALES = ['ko', 'en', 'ja', 'zh', 'de', 'fr'] as const;
const SYMBOLS = ['btc', 'eth', 'xrp', 'sol', 'doge', 'ada', 'trx', 'avax', 'link', 'dot'] as const;

const SYMBOL_COPY: Record<string, string> = {
  btc: 'Bitcoin is the main reference asset for local premium checks. Compare BTC premium first when you want a broad read on Korean spot demand.',
  eth: 'Ethereum premium can move differently from BTC when staking, gas, or ETF narratives change global demand.',
  xrp: 'XRP often reflects retail flow and exchange-specific liquidity, so premium gaps should be checked against volume.',
  sol: 'Solana premium can react quickly to ecosystem news, meme-token activity, and network congestion headlines.',
  doge: 'Dogecoin premium is sentiment-heavy and can move around social news faster than fundamentals.',
  ada: 'Cardano premium is usually slower but can widen around network roadmap or staking narratives.',
  trx: 'TRON premium may reflect transfer demand and stablecoin rail usage as much as speculative demand.',
  avax: 'Avalanche premium can move with ecosystem incentives, subnet news, and risk-on altcoin flow.',
  link: 'Chainlink premium is useful when oracle, RWA, or infrastructure narratives are active.',
  dot: 'Polkadot premium can react around ecosystem upgrades and broader altcoin liquidity.'
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    SYMBOLS.map((symbol) => ({ locale, symbol }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, symbol } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as any) || !SYMBOLS.includes(symbol as any)) return {};
  const upper = symbol.toUpperCase();
  const title = `${upper} kimchi premium | KimchiPremium`;
  const description = `Check ${upper} kimchi premium, Upbit KRW price, Binance USDT equivalent, funding context, and interpretation notes.`;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/coin/${symbol}` },
    openGraph: { title, description, url: `https://kimchipremium.online/${locale}/coin/${symbol}` },
  };
}

export default async function CoinPage({ params }: Props) {
  const { locale, symbol } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as any) || !SYMBOLS.includes(symbol as any)) notFound();
  setRequestLocale(locale);

  const upper = symbol.toUpperCase();
  const [premiums, funding] = await Promise.all([
    calculateKimchiPremium([upper]).catch(() => []),
    fetchBinanceFundingRates([upper]).catch(() => []),
  ]);
  const premium = premiums[0];
  const rate = funding[0];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 p-4">
        <div className="container mx-auto flex max-w-7xl items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-bold"><span className="text-red-400">Kimchi</span>Premium</Link>
          <Link href={`/${locale}/funding`} className="text-sm text-slate-400 hover:text-slate-100">Funding</Link>
        </div>
      </header>

      <section className="container mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-300">Coin detail</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{upper} kimchi premium</h1>
        <p className="mt-3 max-w-3xl text-slate-400">{SYMBOL_COPY[symbol]}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Stat label="Upbit KRW" value={premium ? premium.upbitKrw.toLocaleString('ko-KR') : 'Waiting'} />
          <Stat label="Binance USDT" value={premium ? premium.binanceUsdt.toLocaleString('en-US', { maximumFractionDigits: 4 }) : 'Waiting'} />
          <Stat label="Premium" value={premium ? `${premium.premiumPct > 0 ? '+' : ''}${premium.premiumPct.toFixed(2)}%` : 'Waiting'} tone={premium && premium.premiumPct > 0 ? 'green' : 'red'} />
        </div>

        <section className="mt-8 grid gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-xl font-semibold">Interpretation checklist</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              A coin page should explain the signal, not just show a number. Use this checklist before acting on a premium gap.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              The premium can widen because of local demand, transfer limits, stale liquidity, or a fast global move.
              Treat the figure as a monitoring signal first and confirm the market path before making any trading decision.
            </p>
          </div>
          <ul className="space-y-2 text-sm leading-6 text-slate-300">
            <li>- Compare local KRW price with global USDT equivalent and current USD/KRW rate.</li>
            <li>- Check funding: {rate ? `${rate.ratePct.toFixed(4)}% next funding` : 'funding data is waiting for the next API refresh'}.</li>
            <li>- Recheck exchange deposits, withdrawals, and order book depth if the premium is unusually high or low.</li>
            <li>- Compare this coin with BTC and ETH to see whether the gap is market-wide or isolated to one asset.</li>
          </ul>
        </section>
      </section>
    </main>
  );
}

function Stat({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'green' | 'red' | 'default' }) {
  const color = tone === 'green' ? 'text-emerald-400' : tone === 'red' ? 'text-red-400' : 'text-slate-100';
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-2 font-mono text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
