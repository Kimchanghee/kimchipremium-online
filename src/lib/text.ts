// Display-width helpers: Hangul/CJK count as 2 (Latin-equivalent width), matching scripts/gate.mjs.
export const width = (s: string) => [...s].reduce((n, ch) => n + (/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7a3\u3000-\u9fff]/.test(ch) ? 2 : 1), 0);

/** Pick the first candidate whose display width is within [lo, hi]; throws at build time if none fits. */
export function fit(cands: string[], lo: number, hi: number): string {
  for (const c of cands) if (width(c) >= lo && width(c) <= hi) return c;
  throw new Error(`no candidate fits ${lo}-${hi}: ${cands.map((c) => `${width(c)}:${c}`).join(' | ')}`);
}
export const fitTitle = (c: string[]) => fit(c, 50, 60);
export const fitDesc = (c: string[]) => fit(c, 150, 160);
