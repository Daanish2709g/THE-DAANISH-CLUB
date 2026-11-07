/**
 * Pure functions and drape behavior calculations for bespoke luxury textiles
 */

import { FabricOption } from '../types/suit';

export interface DrapeFluidityAnalysis {
  fluidityScore: number; // 0 (rigid) - 100 (liquid)
  category: 'Liquid Silk' | 'Supple Worsted' | 'Tailored Structure' | 'Architectural';
  rippleSpeed: number;
  rippleAmplitude: number;
  rippleFrequency: number;
  meshTension: number;
}

export interface FabricShaderParams {
  roughness: number;
  metalness: number;
  specularIntensity: number;
  bumpScale: number;
  sheenColor: string;
}

/**
 * Calculates physics parameters for 3D drape cloth ripple simulation
 */
export function calculateDrapeFluidity(stiffness: number): DrapeFluidityAnalysis {
  const clamped = Math.max(0.05, Math.min(0.95, stiffness));
  const fluidityScore = Math.round((1 - clamped) * 100);

  let category: DrapeFluidityAnalysis['category'] = 'Supple Worsted';
  if (clamped < 0.35) {
    category = 'Liquid Silk';
  } else if (clamped < 0.55) {
    category = 'Supple Worsted';
  } else if (clamped < 0.75) {
    category = 'Tailored Structure';
  } else {
    category = 'Architectural';
  }

  // Fluid fabrics ripple faster with higher amplitude; stiff fabrics have subtle broad folds
  const rippleSpeed = +(0.8 + (1 - clamped) * 1.6).toFixed(2);
  const rippleAmplitude = +(0.04 + (1 - clamped) * 0.12).toFixed(3);
  const rippleFrequency = +(1.2 + clamped * 2.8).toFixed(2);
  const meshTension = +(0.2 + clamped * 0.8).toFixed(2);

  return {
    fluidityScore,
    category,
    rippleSpeed,
    rippleAmplitude,
    rippleFrequency,
    meshTension,
  };
}

/**
 * Derives realistic PBR material parameters for textile rendering based on luster and weave
 */
export function deriveMaterialProperties(fabric: FabricOption): FabricShaderParams {
  switch (fabric.lusterGrade) {
    case '24K Metallic Shimmer':
      return {
        roughness: 0.32,
        metalness: 0.38,
        specularIntensity: 0.95,
        bumpScale: 0.04,
        sheenColor: '#ffd700',
      };
    case 'Satin Lustrous':
      return {
        roughness: 0.28,
        metalness: 0.08,
        specularIntensity: 0.85,
        bumpScale: 0.02,
        sheenColor: '#e0d8cc',
      };
    case 'Deep Velvet Nap':
      return {
        roughness: 0.88,
        metalness: 0.02,
        specularIntensity: 0.45,
        bumpScale: 0.08,
        sheenColor: '#0c4a30',
      };
    case 'Subtle Matte':
    default:
      return {
        roughness: 0.65,
        metalness: 0.05,
        specularIntensity: 0.35,
        bumpScale: 0.03,
        sheenColor: '#ffffff',
      };
  }
}

/**
 * Evaluates seasonal weight classification and climatic comfort recommendations
 */
export function evaluateSeasonWeight(weightGsm: number): {
  weightTier: 'Tropical Featherweight' | 'All-Season Core' | 'Autumn/Winter Shield';
  temperatureRangeCelsius: string;
  breathabilityIndex: number; // 1-10
} {
  if (weightGsm < 250) {
    return {
      weightTier: 'Tropical Featherweight',
      temperatureRangeCelsius: '20°C to 35°C',
      breathabilityIndex: 9,
    };
  }
  if (weightGsm <= 295) {
    return {
      weightTier: 'All-Season Core',
      temperatureRangeCelsius: '10°C to 26°C',
      breathabilityIndex: 7,
    };
  }
  return {
    weightTier: 'Autumn/Winter Shield',
    temperatureRangeCelsius: '-5°C to 16°C',
    breathabilityIndex: 5,
  };
}
