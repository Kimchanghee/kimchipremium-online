// Shared bits for the one-question data pages (ranking, reverse premium, tether premium, history).
// Everything here is read from src/data/latest.json and src/data/history.json; nothing is estimated.
import { site } from '../site.config';
import { latest } from './data';

export const SOURCES: [string, string][] = [
  ['업비트 Open API', 'https://docs.upbit.com/'],
  ['바이낸스 현물 시세 API', 'https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints'],
  ['Frankfurter(ECB 기준환율)', 'https://www.frankfurter.app/docs/'],
];

export const cls = (p: number) => (p > 0.005 ? 'up' : p < -0.005 ? 'down' : 'flat');

/** Dataset JSON-LD for a one-question data page. */
export function datasetLd(name: string, description: string, path: string, download: string, modified = latest.asOf, coverage = latest.asOf) {
  return {
    '@context': 'https://schema.org', '@type': 'Dataset', name, description, url: `${site.url}${path}`,
    dateModified: modified, temporalCoverage: coverage, inLanguage: 'ko-KR', isAccessibleForFree: true,
    creator: { '@id': `${site.url}/#org` }, isBasedOn: SOURCES.map((s) => s[1]),
    distribution: [{ '@type': 'DataDownload', encodingFormat: download.endsWith('.csv') ? 'text/csv' : 'application/json', contentUrl: `${site.url}${download}` }],
  };
}
