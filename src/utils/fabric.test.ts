import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDrapeFluidity, deriveMaterialProperties, evaluateSeasonWeight } from './fabric';
import { LUXURY_FABRICS } from '../data/suitCatalog';

test('calculateDrapeFluidity correctly classifies low stiffness as Liquid Silk', () => {
  const result = calculateDrapeFluidity(0.25);
  assert.equal(result.category, 'Liquid Silk');
  assert.equal(result.fluidityScore, 75);
  assert.ok(result.rippleAmplitude > 0.1);
});

test('calculateDrapeFluidity correctly classifies high stiffness as Architectural or Tailored Structure', () => {
  const velvetDrape = calculateDrapeFluidity(0.78);
  assert.equal(velvetDrape.category, 'Architectural');
  assert.equal(velvetDrape.fluidityScore, 22);

  const worstedDrape = calculateDrapeFluidity(0.48);
  assert.equal(worstedDrape.category, 'Supple Worsted');
});

test('deriveMaterialProperties produces higher metallic sheen for 24K Gold Treasure cloth', () => {
  const goldFabric = LUXURY_FABRICS.find((f) => f.id === 'scabal-gold-treasure');
  assert.ok(goldFabric, 'Scabal Gold fabric exists');

  const pbr = deriveMaterialProperties(goldFabric);
  assert.equal(pbr.metalness, 0.38);
  assert.equal(pbr.sheenColor, '#ffd700');
  assert.ok(pbr.specularIntensity >= 0.9);
});

test('deriveMaterialProperties gives appropriate nap roughness to velvet cloth', () => {
  const velvetFabric = LUXURY_FABRICS.find((f) => f.id === 'vbc-emerald-velvet');
  assert.ok(velvetFabric, 'Emerald velvet exists');

  const pbr = deriveMaterialProperties(velvetFabric);
  assert.equal(pbr.roughness, 0.88);
  assert.equal(pbr.sheenColor, '#0c4a30');
});

test('evaluateSeasonWeight categorizes tropical vs all-season vs winter weights', () => {
  const tropical = evaluateSeasonWeight(220);
  assert.equal(tropical.weightTier, 'Tropical Featherweight');
  assert.equal(tropical.breathabilityIndex, 9);

  const allSeason = evaluateSeasonWeight(260);
  assert.equal(allSeason.weightTier, 'All-Season Core');

  const winterShield = evaluateSeasonWeight(340);
  assert.equal(winterShield.weightTier, 'Autumn/Winter Shield');
});
