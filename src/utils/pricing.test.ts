import test from 'node:test';
import assert from 'node:assert/strict';
import { convertPrice, formatPrice, calculateSuitTotal, calculatePackagingFee, calculateCartSummary } from './pricing';
import { CustomBespokeConfig } from '../types/suit';

test('converts USD to EUR and JPY accurately', () => {
  const usd = 1000;
  assert.equal(convertPrice(usd, 'USD'), 1000);
  assert.equal(convertPrice(usd, 'EUR'), 920);
  assert.equal(convertPrice(usd, 'JPY'), 154500);
});

test('formats currency with symbol correctly', () => {
  const formattedUsd = formatPrice(2850, 'USD');
  assert.match(formattedUsd, /\$2,850/);

  const formattedGbp = formatPrice(1000, 'GBP');
  assert.match(formattedGbp, /£790/);
});

test('calculates custom suit total with double breasted and monogram additions', () => {
  const base = 2600;
  const fabricCost = 450;
  const singleBreasted = calculateSuitTotal(base, fabricCost, false, '2-button');
  assert.equal(singleBreasted, 3050);

  const doubleBreastedWithMonogram = calculateSuitTotal(base, fabricCost, true, '6x2-double-breasted');
  assert.equal(doubleBreastedWithMonogram, 3050 + 180 + 75);
});

test('calculates packaging fees correctly', () => {
  assert.equal(calculatePackagingFee('signature-box'), 0);
  assert.equal(calculatePackagingFee('cedar-travel-trunk'), 250);
  assert.equal(calculatePackagingFee('leather-garment-carrier'), 180);
});

test('calculates cart summary with complimentary shipping for orders over 2500 USD', () => {
  const mockConfig: CustomBespokeConfig = {
    suitId: 'test-1',
    suitName: 'Test Bespoke Suit',
    gender: 'men',
    fabric: {
      id: 'f1',
      name: 'Super 160s',
      mill: 'Loro Piana',
      composition: 'Wool',
      colorHex: '#000',
      textureType: 'solid-worsted',
      accentBorder: '#fff',
      extraCostUsd: 0,
      weightGsm: 260,
      drapeProfile: 'Architectural Clean Fall',
      drapeStiffness: 0.45,
      tactileFeel: 'Ultra-buttery worsted twill',
      seasonality: 'Four Seasons',
      lusterGrade: 'Subtle Matte',
    },
    lapel: 'peak',
    buttons: '1-button',
    vents: 'side-vents',
    silhouette: 'savile-row-structured',
    monogramText: 'AO',
    monogramColor: 'champagne-gold',
    liningColor: '#1A1A1F',
    trouserPleats: 'flat-front',
    waistAdjusters: 'side-tabs-brass',
    totalPriceUsd: 2850,
  };

  const summary = calculateCartSummary(
    [{ config: mockConfig, quantity: 1, packagingOption: 'signature-box' }],
    'USD',
    true
  );

  assert.equal(summary.subtotalUsd, 2850);
  assert.equal(summary.shippingUsd, 0); // Complimentary over 2500
  assert.equal(summary.shippingFormatted, 'Complimentary');
  assert.equal(summary.estimatedDutiesUsd, Math.round(2850 * 0.05));
});
