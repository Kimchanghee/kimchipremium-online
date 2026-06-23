import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'KimchiPremium — 실시간 김치 프리미엄 & 자금 비율 트래커',
  description: '업비트·바이낸스·바이비트 실시간 김치 프리미엄, 펀딩 비율, 24시간 추이 차트. 한국형 암호화폐 차익 모니터링 대시보드.',
  keywords: ['김치프리미엄', '김프', 'kimchi premium', 'funding rate', '바이낸스 펀딩', '업비트', '비트코인 차익', 'crypto arbitrage'],
  metadataBase: new URL('https://kimchipremium.online'),
  alternates: {
    canonical: '/',
    languages: {
      ko: '/ko',
      en: '/en',
      ja: '/ja',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://kimchipremium.online',
    siteName: 'KimchiPremium',
    title: 'KimchiPremium — 실시간 김치 프리미엄 트래커',
    description: '업비트·바이낸스 실시간 김프, 펀딩 비율, 24시간 추이 차트',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KimchiPremium — 실시간 김치 프리미엄 트래커',
    description: '업비트·바이낸스 실시간 김프, 펀딩 비율, 24시간 추이 차트',
  },
  robots: { index: true, follow: true },
};

const AFFILIATE_CLICK_SCRIPT = `
(function () {
  window.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || typeof target.closest !== 'function') return;
    var link = target.closest('a[rel*="sponsored"],[data-affiliate-link]');
    if (!link || typeof window.gtag !== 'function') return;
    window.gtag('event', 'affiliate_click', {
      merchant: (link.textContent || '').trim().slice(0, 60) || 'partner',
      placement: link.getAttribute('data-placement') || link.getAttribute('aria-label') || 'sponsored-link',
      page_location: window.location.href
    });
  }, { capture: true });
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9WERPBKYM8" />
        <script
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-9WERPBKYM8',{page_path:window.location.pathname});",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://kimchipremium.online#org',
                  name: 'KimchiPremium',
                  url: 'https://kimchipremium.online',
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://kimchipremium.online#site',
                  url: 'https://kimchipremium.online',
                  name: 'KimchiPremium',
                  inLanguage: 'ko-KR',
                  publisher: { '@id': 'https://kimchipremium.online#org' },
                },
                {
                  '@type': 'WebApplication',
                  name: 'KimchiPremium Tracker',
                  applicationCategory: 'FinanceApplication',
                  operatingSystem: 'Any',
                  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                },
              ],
            }),
          }}
        />
              <script
          dangerouslySetInnerHTML={{
            __html: AFFILIATE_CLICK_SCRIPT,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
