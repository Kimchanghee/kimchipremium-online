import { getCollection } from 'astro:content';
import { latest, coins, history } from './data';

export interface SitePage { path: string; lastmod: string; title?: string; summary?: string }
const STATIC_DATE = '2026-10-16';

/** Every indexable URL with a real lastmod (content date or data date). */
export async function allPages(): Promise<SitePage[]> {
  const guides = (await getCollection('guides')).sort((a, b) => a.data.order - b.data.order);
  const d = latest.asOf;
  return [
    { path: '/', lastmod: d, title: '김프 시세판', summary: '코인별 김치프리미엄, 기준환율·USDT 두 기준, 테더 프리미엄.' },
    { path: '/coins/', lastmod: d, title: '코인별 김프 목록' },
    ...coins.map((c) => ({ path: `/coins/${c.symbol.toLowerCase()}/`, lastmod: d, title: `${c.nameKo}(${c.symbol}) 김프`, summary: '두 시장 가격, 호가 단위, 거래대금, 수집 기록.' })),
    { path: '/ranking/', lastmod: d, title: '김프 순위', summary: '오늘 김치프리미엄이 가장 높은 코인은 무엇인가요?' },
    { path: '/reverse-premium/', lastmod: d, title: '역프 코인', summary: '지금 역프(마이너스 김프)인 코인이 있나요?' },
    { path: '/tether-premium/', lastmod: d, title: '테더 김프', summary: '테더 김프는 오늘 몇 %인가요?' },
    { path: '/history/', lastmod: history.readings.at(-1)?.t ?? d, title: '김프 추이', summary: '김프는 최근 며칠 동안 어떻게 움직였나요?' },
    { path: '/calculator/', lastmod: STATIC_DATE, title: '김프 계산기', summary: '원화 가격·USDT 가격·환율로 김프와 역산 가격 계산.' },
    { path: '/guides/', lastmod: guides.map((g) => g.data.updated).sort().at(-1) ?? STATIC_DATE, title: '가이드' },
    ...guides.map((g) => ({ path: `/guides/${g.id}/`, lastmod: g.data.updated, title: g.data.h1, summary: g.data.answer })),
    { path: '/methodology/', lastmod: STATIC_DATE, title: '계산 방법과 데이터 출처' },
    { path: '/about/', lastmod: STATIC_DATE, title: '소개' },
    { path: '/contact/', lastmod: STATIC_DATE, title: '문의' },
    { path: '/privacy/', lastmod: STATIC_DATE, title: '개인정보처리방침' },
    { path: '/terms/', lastmod: STATIC_DATE, title: '이용약관' },
    { path: '/disclaimer/', lastmod: STATIC_DATE, title: '면책 고지' },
    { path: '/en/', lastmod: d, title: 'Kimchi premium board (English summary)' },
  ];
}
