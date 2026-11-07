import test from 'node:test';
import assert from 'node:assert/strict';
import { generateMockOrder, TRACKING_STAGES } from './tracking';

test('defines 6 progressive master tailoring and delivery stages', () => {
  assert.equal(TRACKING_STAGES.length, 6);
  assert.equal(TRACKING_STAGES[0].stage, 1);
  assert.equal(TRACKING_STAGES[5].stage, 6);
  assert.match(TRACKING_STAGES[0].title, /Cloth Commissioned/);
  assert.match(TRACKING_STAGES[5].title, /Global Diplomatic Air/);
});

test('generates tracking state deterministically for order IDs', () => {
  const orderA = generateMockOrder('TDC-8921');
  assert.equal(orderA.orderId, 'TDC-8921');
  assert.ok(orderA.statusStage >= 1 && orderA.statusStage <= 6);
  assert.ok(orderA.milestones.length === 6);
  assert.ok(orderA.trackingNumber.startsWith('DHL-EXP-AU-'));

  const orderDefault = generateMockOrder('');
  assert.equal(orderDefault.orderId, 'TDC-8921');
});
