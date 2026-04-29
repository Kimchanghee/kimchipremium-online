import type { MetadataRoute } from 'next';

const SITE = 'https://kimchipremium.online';
const LOCALES = ['ko', 'en', 'ja', 'zh', 'de', 'fr'];
const COINS = ['btc', 'eth', 'xrp', 'sol', 'doge', 'ada', 'trx', 'avax', 'link', 'dot'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    entries.push({ url: `${SITE}/${locale}`, lastModified, changeFrequency: 'always', priority: 1.0 });
    entries.push({ url: `${SITE}/${locale}/funding`, lastModified, changeFrequency: 'hourly', priority: 0.9 });
    entries.push({ url: `${SITE}/${locale}/liquidations`, lastModified, changeFrequency: 'always', priority: 0.85 });
    for (const c of COINS) {
      entries.push({ url: `${SITE}/${locale}/coin/${c}`, lastModified, changeFrequency: 'always', priority: 0.85 });
    }
  }
  return entries;
}
