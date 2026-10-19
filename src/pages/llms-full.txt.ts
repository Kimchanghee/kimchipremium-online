import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../site.config';
import { latest, avgFx, avgUsdt, coins } from '../lib/data';
import { fmtPct } from '../lib/calc.mjs';

// /llms.txt의 전문판: 최신 수집 요약과 모든 가이드 본문. 페이지가 렌더하는 것과 같은 원본에서 생성한다.
export const GET: APIRoute = async () => {
  const guides = (await getCollection('guides')).sort((a, b) => a.data.order - b.data.order);
  const fx = latest.fx;
  const text = guides
    .map((g) => `## ${g.data.h1}\nURL: ${site.url}/guides/${g.id}/\n수정: ${g.data.updated}\n데이터 기준: ${g.data.data_asof}\n\n질문: ${g.data.question}\n답: ${g.data.answer}\n\n${(g.body ?? '').trim()}\n\n출처: ${g.data.sources.map((s) => s.url).join(', ')}`)
    .join('\n\n');
  const body = `# ${site.name} (kimchipremium.online) 전문\n\n> ${site.entity}\n\n# 최근 수집\n\n수집 시각 ${latest.asOf} (UTC). ${coins.length}개 코인 평균 김치프리미엄: ECB 기준환율(1 USD = ${fx.usdKrw} KRW, ${fx.usdKrwDate}) 대비 ${fmtPct(avgFx)}, 업비트 USDT(${fx.usdtKrw} KRW) 대비 ${fmtPct(avgUsdt)}. 출처: 업비트 Open API, 바이낸스 현물 공개 시세, Frankfurter(ECB 기준환율). 계산 방법: ${site.url}/methodology/\n투자·차익거래 권유가 아닙니다.\n\n# 가이드\n\n${text}\n`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
