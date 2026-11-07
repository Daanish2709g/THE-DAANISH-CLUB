import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDropClassification, calculatePostureAdjustments, estimateBespokePattern } from './measurements';

test('calculates drop ratio and classification accurately', () => {
  // 102cm chest (~40.15 in), 86cm waist (~33.85 in) -> drop ~6
  const drop6 = calculateDropClassification(102, 86);
  assert.equal(drop6.dropInches, 6);
  assert.match(drop6.classification, /Drop 6/);

  // 107cm chest (~42.1 in), 84cm waist (~33 in) -> drop ~9
  const drop9 = calculateDropClassification(107, 84);
  assert.equal(drop9.dropInches, 9);
  assert.match(drop9.classification, /V-Taper/);
});

test('computes posture pitch and shoulder slope compensations', () => {
  const erectSloped = calculatePostureAdjustments('erect', 'sloped');
  assert.equal(erectSloped.collarAdjustmentCm, -0.6);
  assert.match(erectSloped.scyeDepthNote, /Lowered scye depth/);

  const forwardSquare = calculatePostureAdjustments('forward-leaning', 'square');
  assert.equal(forwardSquare.backSeamAdjustmentCm, 1.0);
  assert.match(forwardSquare.scyeDepthNote, /Raised shoulder point/);
});

test('estimates bespoke pattern proportions from biometric data', () => {
  const pattern = estimateBespokePattern(180, 75, 100, 84);
  assert.equal(pattern.heightCm, 180);
  assert.ok(pattern.jacketLengthCm > 70 && pattern.jacketLengthCm < 85);
  assert.ok(pattern.sleeveLengthCm > 60 && pattern.sleeveLengthCm < 72);
  assert.ok(pattern.inseamCm > 75 && pattern.inseamCm < 90);
  assert.match(pattern.dropClassification, /Drop 6/);
});
