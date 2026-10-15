import { test } from 'node:test';
import assert from 'node:assert/strict';
import { premiumPct, overseasKrw, krwForPremium, tickPct, mean, median, fmtPct } from '../src/lib/calc.mjs';

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test('premium: hand case 1 (BTC 111,264,000 KRW vs 82,510.75 USDT at 1,345.9)', () => {
  // 82,510.75 * 1,345.9 = 111,051,218.425 ; 111,264,000 / that = 1.0019160... -> +0.1916%
  close(overseasKrw(82510.75, 1345.9), 111051218.425, 1e-4);
  close(premiumPct(111264000, 82510.75, 1345.9), (111264000 / 111051218.425 - 1) * 100);
  assert.equal(premiumPct(111264000, 82510.75, 1345.9).toFixed(4), '0.1916');
});
test('premium: hand case 2, 5% premium exactly', () => {
  close(premiumPct(105, 1, 100), 5);
  close(premiumPct(95, 1, 100), -5); // reverse premium (역프)
  close(premiumPct(100, 1, 100), 0);
});
test('reverse calculation round-trips', () => {
  close(krwForPremium(2, 1350, 3), 2781);
  close(premiumPct(krwForPremium(82510.75, 1345.9, 2.5), 82510.75, 1345.9), 2.5, 1e-9);
});
test('invalid inputs return null, never NaN', () => {
  assert.equal(premiumPct(0, 1, 1), null);
  assert.equal(premiumPct(100, -1, 1), null);
  assert.equal(premiumPct(100, 1, NaN), null);
  assert.equal(premiumPct('100', 1, 1), null);
  assert.equal(krwForPremium(1, 1, NaN), null);
});
test('tick as percent of price (Upbit tick_size)', () => {
  close(tickPct(110, 1), 0.9090909090909091); // 1 KRW of 110 KRW
  close(tickPct(111264000, 1000), 0.0008987633, 1e-10);
  assert.equal(tickPct(0, 1), null);
  assert.equal(tickPct(100, 0), null);
});
test('mean/median/format', () => {
  assert.equal(mean([1, 2, null, 3]), 2);
  assert.equal(median([3, 1, 2, 10]), 2.5);
  assert.equal(fmtPct(1.234), '+1.23%');
  assert.equal(fmtPct(-0.5), '−0.50%');
  assert.equal(fmtPct(null), '—');
});
