import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  new Response(
    `# 김프 전광판: 모든 크롤러 허용(검색엔진, Yeti/네이버, AI 크롤러 포함). /api/는 실시간 JSON이라 색인 대상이 아닙니다.\nUser-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://kimchipremium.online/sitemap-index.xml\n`,
    { headers: { 'content-type': 'text/plain; charset=utf-8' } },
  );
