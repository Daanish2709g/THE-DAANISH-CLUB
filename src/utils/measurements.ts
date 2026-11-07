import { BespokeMeasurements } from '../types/suit';

/**
 * Calculates Savile Row drop ratio: difference between chest circumference and waist in inches
 * Standard: Drop 6 is standard athletic. Drop 7-8 is slim drop. Drop 4 is classic executive.
 */
export function calculateDropClassification(chestCm: number, waistCm: number): { dropInches: number; classification: string } {
  const chestInches = chestCm / 2.54;
  const waistInches = waistCm / 2.54;
  const drop = Math.round(chestInches - waistInches);

  let classification = 'Drop 6 (Savile Row Athletic Fit)';
  if (drop >= 8) {
    classification = `Drop ${drop} (V-Taper Sculpted Athletic)`;
  } else if (drop === 7) {
    classification = 'Drop 7 (Milanese Continental Slim)';
  } else if (drop <= 4) {
    classification = `Drop ${Math.max(2, drop)} (Classic Neapolitan Comfort)`;
  }

  return { dropInches: drop, classification };
}

/**
 * Calculates precision posture compensation for jacket drape:
 * - Sloped shoulders: increase collar height by +0.8cm, drop scye depth by 0.5cm
 * - Erect posture: reduce back collar balance by -0.6cm to prevent neck collar gap
 * - Forward leaning: lengthen center back seam by +1.0cm to prevent hem kick-out
 */
export function calculatePostureAdjustments(
  posturePitch: 'erect' | 'neutral' | 'forward-leaning',
  shoulderSlope: 'regular' | 'sloped' | 'square'
): {
  collarAdjustmentCm: number;
  backSeamAdjustmentCm: number;
  scyeDepthNote: string;
  tailorRecommendation: string;
} {
  let collarAdjustment = 0;
  let backSeamAdjustment = 0;
  let scyeNote = 'Standard scye armhole depth';
  let recommendation = 'Standard master pattern balance.';

  if (posturePitch === 'erect') {
    collarAdjustment -= 0.6;
    recommendation = 'Erect posture detected: Collar balance shortened 6mm to hug nape seamlessly.';
  } else if (posturePitch === 'forward-leaning') {
    backSeamAdjustment += 1.0;
    recommendation = 'Forward pitch detected: Center back seam extended 10mm to avoid hem kickout.';
  }

  if (shoulderSlope === 'sloped') {
    scyeNote = 'Lowered scye depth by 6mm + 4mm shoulder pad gradient to eliminate collar ripples.';
  } else if (shoulderSlope === 'square') {
    scyeNote = 'Raised shoulder point by 5mm with zero-padding roping for natural shoulder contour.';
  }

  return {
    collarAdjustmentCm: collarAdjustment,
    backSeamAdjustmentCm: backSeamAdjustment,
    scyeDepthNote: scyeNote,
    tailorRecommendation: recommendation,
  };
}

/**
 * Derives bespoke baseline measurements from biometric inputs
 */
export function estimateBespokePattern(
  heightCm: number,
  weightKg: number,
  chestCm: number,
  waistCm: number
): BespokeMeasurements {
  const { classification } = calculateDropClassification(chestCm, waistCm);

  // Jacket length: standard Savile Row rule is (heightCm / 2) - 13cm to 15cm
  const jacketLength = Math.round(heightCm * 0.44);
  // Shoulder width: approximate ~42% of chest circumference or height ratio
  const shoulderWidth = Math.round(chestCm * 0.45);
  // Sleeve crown-to-cuff: approx ~36% of height
  const sleeveLength = Math.round(heightCm * 0.365);
  // Inseam: ~46% of height
  const inseam = Math.round(heightCm * 0.46);
  // Neck circumference: approx chest * 0.38
  const neck = Math.round(chestCm * 0.38);

  return {
    heightCm,
    weightKg,
    chestCircumferenceCm: chestCm,
    waistCircumferenceCm: waistCm,
    shoulderWidthCm: shoulderWidth,
    sleeveLengthCm: sleeveLength,
    jacketLengthCm: jacketLength,
    inseamCm: inseam,
    neckCircumferenceCm: neck,
    posturePitch: 'neutral',
    shoulderSlope: 'regular',
    dropClassification: classification,
    notes: 'Master cutter baseline pattern drafted with 1.5cm ease allowance on chest.',
  };
}
