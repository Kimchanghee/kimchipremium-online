import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async () => {
  const guides = (await getCollection('guides')).sort((a, b) => b.data.updated.localeCompare(a.data.updated) || a.data.order - b.data.order);
  const items = guides
    .map((g) => `    <item>\n      <title>${esc(g.data.h1)}</title>\n      <link>https://kimchipremium.online/guides/${g.id}/</link>\n      <guid isPermaLink="true">https://kimchipremium.online/guides/${g.id}/</guid>\n      <pubDate>${new Date(g.data.published + 'T00:00:00+09:00').toUTCString()}</pubDate>\n      <description>${esc(g.data.answer)}</description>\n    </item>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>김프 전광판 가이드</title>\n    <link>https://kimchipremium.online/guides/</link>\n    <atom:link href="https://kimchipremium.online/rss.xml" rel="self" type="application/rss+xml"/>\n    <description>김치프리미엄의 개념, 계산, 역프, 테더 프리미엄, 법·세금 유의사항 가이드</description>\n    <language>ko</language>\n    <lastBuildDate>${new Date(guides[0].data.updated + 'T00:00:00+09:00').toUTCString()}</lastBuildDate>\n${items}\n  </channel>\n</rss>\n`;
  return new Response(body, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
};
