/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert';
import {
  ASSEMBLY_STEPS,
  calculateAssemblyPhase,
  calculateLayerDepthTransforms,
  calculateMouseParallax,
} from './assembly.ts';

test('ASSEMBLY_STEPS contains 6 distinct progressive phases', () => {
  assert.strictEqual(ASSEMBLY_STEPS.length, 6);
  assert.strictEqual(ASSEMBLY_STEPS[0].category, 'Shirt');
  assert.strictEqual(ASSEMBLY_STEPS[1].category, 'Trousers');
  assert.strictEqual(ASSEMBLY_STEPS[2].category, 'Blazer');
  assert.strictEqual(ASSEMBLY_STEPS[3].category, 'Tie');
  assert.strictEqual(ASSEMBLY_STEPS[4].category, 'Boots');
  assert.strictEqual(ASSEMBLY_STEPS[5].category, 'Complete');
});

test('calculateAssemblyPhase maps 0.0 to 1.0 scroll progress correctly', () => {
  assert.strictEqual(calculateAssemblyPhase(0), 0);
  assert.strictEqual(calculateAssemblyPhase(0.05), 0);
  assert.strictEqual(calculateAssemblyPhase(0.20), 1);
  assert.strictEqual(calculateAssemblyPhase(0.40), 2);
  assert.strictEqual(calculateAssemblyPhase(0.60), 3);
  assert.strictEqual(calculateAssemblyPhase(0.75), 4);
  assert.strictEqual(calculateAssemblyPhase(0.95), 5);
  assert.strictEqual(calculateAssemblyPhase(1.0), 5);
  assert.strictEqual(calculateAssemblyPhase(-0.2), 0);
  assert.strictEqual(calculateAssemblyPhase(1.5), 5);
});

test('calculateLayerDepthTransforms calculates active, assembled, and future depths', () => {
  // Current active layer
  const current = calculateLayerDepthTransforms(2, 2, false);
  assert.strictEqual(current.translateZ, 30);
  assert.strictEqual(current.opacity, 1);
  assert.strictEqual(current.scale, 1);

  // Already assembled layer
  const assembled = calculateLayerDepthTransforms(0, 2, false);
  assert.strictEqual(assembled.translateZ, 0);
  assert.strictEqual(assembled.opacity, 0.85);

  // Future layer waiting to assemble
  const future = calculateLayerDepthTransforms(4, 2, false);
  assert.ok(future.translateZ < 0);
  assert.strictEqual(future.opacity, 0.2);

  // Exploded 3D view
  const exploded0 = calculateLayerDepthTransforms(0, 2, true);
  const exploded5 = calculateLayerDepthTransforms(5, 2, true);
  assert.ok(exploded0.translateZ < 0);
  assert.ok(exploded5.translateZ > 0);
});

test('calculateMouseParallax clamps and computes proportional tilt', () => {
  const center = calculateMouseParallax(0, 0, 15);
  assert.strictEqual(center.rotateX, 0);
  assert.strictEqual(center.rotateY, 0);

  const topRight = calculateMouseParallax(1, -1, 10);
  assert.strictEqual(topRight.rotateX, 10);
  assert.strictEqual(topRight.rotateY, 10);

  const clamped = calculateMouseParallax(5, -5, 10);
  assert.strictEqual(clamped.rotateX, 10);
  assert.strictEqual(clamped.rotateY, 10);
});
