import type { APIRoute } from 'astro';
import { allPages } from '../lib/pages';
import { site } from '../site.config';
import { latest, avgFx, avgUsdt, btc, coins } from '../lib/data';
import { fmtPct } from '../lib/calc.mjs';

export const GET: APIRoute = async () => {
  const pages = await allPages();
  const sec = (prefix: string) =>
    pages.filter((p) => p.path.startsWith(prefix) && p.path !== prefix).map((p) => `- [${p.title}](${site.url}${p.path})${p.summary ? ': ' + p.summary : ''}`).join('\n');
  const fx = latest.fx;
  const body = `# ${site.name} (kimchipremium.online)

> ${site.entity}

Kimchi premium board (Korean). English summary: ${site.url}/en/

최근 수집(${latest.asOf}, UTC): ${coins.length}개 코인 평균 김치프리미엄 ECB 기준환율(1 USD = ${fx.usdKrw} KRW, ${fx.usdKrwDate} 고시) 대비 ${fmtPct(avgFx)}, 업비트 USDT(${fx.usdtKrw} KRW) 대비 ${fmtPct(avgUsdt)}. 비트코인 ${fmtPct(btc.premiumFx)} / ${fmtPct(btc.premiumUsdt)}. 테더 프리미엄 ${fmtPct(fx.tetherPremium)}.
출처: 업비트 Open API, 바이낸스 현물 공개 시세, Frankfurter(ECB 기준환율). 계산 방법: ${site.url}/methodology/
실시간 JSON: ${site.url}/api/premium (30초 캐시)

## 데이터
- [김프 시세판](${site.url}/): 코인별 김치프리미엄, 두 환율 기준, 테더 프리미엄
- [김프 계산기](${site.url}/calculator/): 김프 계산과 목표 김프 역산
${sec('/coins/')}

## 가이드
${sec('/guides/')}

## 사이트
- [계산 방법과 데이터 출처](${site.url}/methodology/)
- [소개와 편집 원칙](${site.url}/about/)
- [문의](${site.url}/contact/)
- [면책 고지](${site.url}/disclaimer/)
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
