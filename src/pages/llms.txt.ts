import type { APIRoute } from 'astro';
import { allPages } from '../lib/pages';
import { site } from '../site.config';
import { latest, avgFx, avgUsdt, btc, coins, history } from '../lib/data';
import { fmtPct } from '../lib/calc.mjs';

export const GET: APIRoute = async () => {
  const pages = await allPages();
  const sec = (prefix: string) =>
    pages.filter((p) => p.path.startsWith(prefix) && p.path !== prefix).map((p) => `- [${p.title}](${site.url}${p.path})${p.summary ? ': ' + p.summary : ''}`).join('\n');
  const fx = latest.fx;
  const body = `# ${site.name} (kimchipremium.online)

> ${site.entity}

최종 갱신: ${latest.asOf.slice(0, 10)} (최근 수집 ${latest.asOf}, UTC)

Kimchi premium board (Korean). English summary: ${site.url}/en/

최근 수집(${latest.asOf}, UTC): ${coins.length}개 코인 평균 김치프리미엄 ECB 기준환율(1 USD = ${fx.usdKrw} KRW, ${fx.usdKrwDate} 고시) 대비 ${fmtPct(avgFx)}, 업비트 USDT(${fx.usdtKrw} KRW) 대비 ${fmtPct(avgUsdt)}. 비트코인 ${fmtPct(btc.premiumFx)} / ${fmtPct(btc.premiumUsdt)}. 테더 프리미엄 ${fmtPct(fx.tetherPremium)}.
출처: 업비트 Open API, 바이낸스 현물 공개 시세, Frankfurter(ECB 기준환율). 계산 방법: ${site.url}/methodology/
실시간 JSON: ${site.url}/api/premium (30초 캐시)

## 데이터 내려받기 (빌드 시점, 시세판 갱신 때마다 다시 생성)
- [latest.json](${site.url}/data/latest.json): 코인별 업비트·바이낸스 가격, 두 기준 김프, 테더 프리미엄, 출처와 수집 시각(UTC)
- [history.json](${site.url}/data/history.json): ${history.since}부터 실제 수집한 기록(보간 없음), 수집 시각·기준환율·USDT 가격·코인별 김프
- [history.csv](${site.url}/data/history.csv): 같은 기록, 한 줄에 한 번의 수집

## 데이터
- [김프 시세판](${site.url}/): 코인별 김치프리미엄, 두 환율 기준, 테더 프리미엄
- [김프 계산기](${site.url}/calculator/): 김프 계산과 목표 김프 역산
- [김프 순위](${site.url}/ranking/): 오늘 김치프리미엄이 가장 높은 코인은 무엇인가요?
- [역프 코인](${site.url}/reverse-premium/): 지금 역프(마이너스 김프)인 코인이 있나요?
- [테더 김프](${site.url}/tether-premium/): 테더 김프는 오늘 몇 %인가요?
- [김프 추이](${site.url}/history/): 김프는 최근 며칠 동안 어떻게 움직였나요?
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
