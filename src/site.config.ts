// Central site configuration. Public identifiers only; never put secrets here.
const env = import.meta.env;

export const site = {
  domain: 'kimchipremium.online',
  url: 'https://kimchipremium.online',
  name: '김프 전광판',
  nameFull: '김프 전광판 (kimchipremium.online)',
  description:
    '업비트 원화 가격과 바이낸스 USDT 가격을 같은 시각에 비교해 코인별 김치프리미엄을 두 가지 환율 기준으로 보여 주는 시세판입니다.',
  entity:
    '김프 전광판(kimchipremium.online)은 업비트 원화 시세와 바이낸스 USDT 시세를 공개 API로 받아 코인별 김치프리미엄을 ECB 기준 환율과 업비트 USDT 가격 두 기준으로 계산해 기록하는 독립 정보 사이트입니다. 거래소 홍보나 투자·차익거래 권유를 하지 않습니다.',
  lang: 'ko',
  locale: 'ko_KR',
  ga4Id: (env.PUBLIC_GA4_ID as string | undefined) ?? '',
  gscVerification: (env.PUBLIC_GSC_VERIFICATION as string | undefined) ?? '',
  // Public Search Advisor ownership token (rendered in HTML by design); kept in source so data-only rebuilds keep it.
  naverVerification: (env.PUBLIC_NAVER_VERIFICATION as string | undefined) || '16d5c9bb4020cffa5966f1f7e0a5f57e3c95a81d',
  adsenseClient: 'ca-pub-4490818204529253',
  // Enable only after publisher account and required certified CMP are verified.
  adsEnabled: env.PUBLIC_ADS_ENABLED === 'true',
  contactEmail: 'contact@kimchipremium.online',
  indexNowKey: '5e1c9a7d3b2f48e6a0d4c8b17f2e9a63',
  // Affiliate URLs stay empty: no exchange referral links on this site.
  affiliates: {} as Record<string, string>,
  startDate: '2026-10-16',
} as const;
