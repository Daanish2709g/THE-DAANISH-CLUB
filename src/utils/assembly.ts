/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AssemblyStep {
  id: string;
  stepNumber: string;
  category: 'Shirt' | 'Trousers' | 'Blazer' | 'Tie' | 'Boots' | 'Complete';
  name: string;
  fabricOrigin: string;
  silhouetteNote: string;
  specNotes: string[];
  image: string;
  depthZ: number; // 3D depth offset in pixels
  clientAnchor: {
    top: string;
    label: string;
    measurement: string;
  };
  mannequinAnchor: {
    top: string;
    label: string;
    measurement: string;
  };
}

export const ASSEMBLY_STEPS: AssemblyStep[] = [
  {
    id: 'shirt',
    stepNumber: '01',
    category: 'Shirt',
    name: 'Foundation Shirt on Client',
    fabricOrigin: 'Egyptian Nile Delta · Giza 45 200/2 Fine Weave',
    silhouetteNote: 'Crisp white cotton hugging the torso with hand-padded spread collar & French cuffs',
    specNotes: [
      'Semi-spread Italian collar with solid brass collar stays',
      'Double French cuffs with Australian mother-of-pearl cufflinks',
      'Featherlight 120 GSM breathable weave with split yoke back',
    ],
    image: '/src/assets/images/man_shirt_stage_1794046898589.jpg',
    depthZ: 20,
    clientAnchor: {
      top: '24%',
      label: 'Collar & French Cuffs Fitted',
      measurement: 'Neck 15.75" · Sleeve 34.5"',
    },
    mannequinAnchor: {
      top: '24%',
      label: 'Collar & French Cuffs Fitted',
      measurement: 'Neck 15.75" · Sleeve 34.5"',
    },
  },
  {
    id: 'trousers',
    stepNumber: '02',
    category: 'Trousers',
    name: 'Pleated High-Rise Trousers Fitted',
    fabricOrigin: 'Loro Piana, Biella, Italy · Super 160s Worsted',
    silhouetteNote: 'Elongated leg drape with brass side-tabs tailored flush to natural waist',
    specNotes: [
      'Side-tab brass waist adjusters replacing traditional belt loops',
      'Double forward pleats allowing effortless sitting comfort',
      'Knife-edge permanent front crease tailored to anatomical stance',
    ],
    image: '/src/assets/images/man_trousers_stage_1794046927497.jpg',
    depthZ: 45,
    clientAnchor: {
      top: '38%',
      label: 'Side-Tab & Rise Alignment',
      measurement: 'High Rise 11.5" · Inseam 32"',
    },
    mannequinAnchor: {
      top: '38%',
      label: 'Side-Tab & Rise Alignment',
      measurement: 'High Rise 11.5" · Inseam 32"',
    },
  },
  {
    id: 'blazer',
    stepNumber: '03',
    category: 'Blazer',
    name: 'Floating Canvas Blazer Draped',
    fabricOrigin: 'Dormeuil, France · Midnight Super 180s Wool',
    silhouetteNote: 'Midnight jacket tailored to client posture with silk peak lapels & natural waist pinch',
    specNotes: [
      'Full floating horsehair chest canvas hand-stitched to outer cloth',
      'Hand-rolled silk satin peak lapels with milanese buttonhole',
      'Curved barchetta pectoral breast pocket hugging upper chest',
    ],
    image: '/src/assets/images/man_blazer_stage_1794046913895.jpg',
    depthZ: 75,
    clientAnchor: {
      top: '28%',
      label: 'Floating Canvas & Lapel Roll',
      measurement: 'Drop 6 Athletic · Chest 40R',
    },
    mannequinAnchor: {
      top: '28%',
      label: 'Floating Canvas & Lapel Roll',
      measurement: 'Drop 6 Athletic · Chest 40R',
    },
  },
  {
    id: 'tie',
    stepNumber: '04',
    category: 'Tie',
    name: 'Gold Inlay Silk Tie & Pocket Square',
    fabricOrigin: 'Lake Como, Italy · Jacquard Silk Weft',
    silhouetteNote: 'Hand-tied gold silk neckwear centering the collar and breast pocket balance',
    specNotes: [
      '3-fold hand-rolled edge tie with pure wool interlining',
      '24K gold filament micro-cross pattern caught in light',
      'Matching silk pocket puff folded in presidential crown',
    ],
    image: '/src/assets/images/man_tie_stage_1794046942759.jpg',
    depthZ: 105,
    clientAnchor: {
      top: '36%',
      label: 'Neckwear & Presidential Pocket Fold',
      measurement: 'Tie Width 8.0cm · 7-Fold Roll',
    },
    mannequinAnchor: {
      top: '36%',
      label: 'Neckwear & Presidential Pocket Fold',
      measurement: 'Tie Width 8.0cm · 7-Fold Roll',
    },
  },
  {
    id: 'boots',
    stepNumber: '05',
    category: 'Boots',
    name: 'Goodyear Oxford Dress Boots Laced',
    fabricOrigin: 'Northamptonshire, England · Box Calfskin',
    silhouetteNote: 'Mirror-buffed glass finish anchoring the trouser break at the ankle',
    specNotes: [
      'Goodyear-welted double oak-bark leather sole with beveled waist',
      'Mirror glass-finish toe cap buffed by master polisher',
      'Chiseled ankle support engineered for sharp trouser break',
    ],
    image: '/src/assets/images/man_boots_stage_1794046957094.jpg',
    depthZ: 135,
    clientAnchor: {
      top: '68%',
      label: 'Beveled Waist & Trouser Break',
      measurement: 'Heel Height 28mm · Half Break',
    },
    mannequinAnchor: {
      top: '68%',
      label: 'Beveled Waist & Trouser Break',
      measurement: 'Heel Height 28mm · Half Break',
    },
  },
  {
    id: 'complete',
    stepNumber: '06',
    category: 'Complete',
    name: 'The Daanish Club Bespoke Ensemble',
    fabricOrigin: 'Milanese & Savile Row Master Cutting Ateliers',
    silhouetteNote: 'Distinguished gentleman in complete bespoke harmony from collar to toe',
    specNotes: [
      'Engineered drop-6 athletic silhouette tailored to millimeter tolerance',
      'Seamless anatomical chest roll that moves harmoniously with posture',
      '100% bespoke fit guarantee with lifetime atelier care and alterations',
    ],
    image: '/src/assets/images/suit_assembled_master_1794044624410.jpg',
    depthZ: 165,
    clientAnchor: {
      top: '46%',
      label: 'Master Harmonized Silhouette',
      measurement: 'Full Bespoke Proportion · 100% Fit',
    },
    mannequinAnchor: {
      top: '46%',
      label: 'Master Harmonized Silhouette',
      measurement: 'Full Bespoke Proportion · 100% Fit',
    },
  },
];

/**
 * Calculates current assembly step index based on a normalized scroll progress (0.0 to 1.0)
 */
export function calculateAssemblyPhase(scrollProgress: number, totalSteps: number = ASSEMBLY_STEPS.length): number {
  if (scrollProgress <= 0) return 0;
  if (scrollProgress >= 1) return totalSteps - 1;
  const index = Math.floor(scrollProgress * totalSteps);
  return Math.min(totalSteps - 1, Math.max(0, index));
}

/**
 * Calculates 3D depth transforms for floating layer elements
 */
export interface LayerTransform3D {
  translateZ: number;
  translateY: number;
  rotateX: number;
  scale: number;
  opacity: number;
}

export function calculateLayerDepthTransforms(
  layerIndex: number,
  activePhase: number,
  isExploded: boolean = false
): LayerTransform3D {
  const isCurrent = layerIndex === activePhase;
  const isAssembled = layerIndex <= activePhase;

  if (isExploded) {
    // In exploded mode, layers float out in 3D depth space based on their layer rank
    const zOffset = (layerIndex - 2.5) * 60;
    const yOffset = (layerIndex - 2.5) * 15;
    return {
      translateZ: zOffset,
      translateY: yOffset,
      rotateX: -4,
      scale: 0.95 + layerIndex * 0.02,
      opacity: 1,
    };
  }

  if (isCurrent) {
    // Current active layer snaps into prominent focus
    return {
      translateZ: 30,
      translateY: 0,
      rotateX: 0,
      scale: 1,
      opacity: 1,
    };
  }

  if (isAssembled) {
    // Already assembled layers rest quietly on the silhouette
    return {
      translateZ: 0,
      translateY: 0,
      rotateX: 0,
      scale: 0.98,
      opacity: 0.85,
    };
  }

  // Future layers hover above/behind waiting to be assembled
  const delta = layerIndex - activePhase;
  return {
    translateZ: -30 * delta,
    translateY: 20 * delta,
    rotateX: 8,
    scale: Math.max(0.7, 1 - delta * 0.08),
    opacity: 0.2,
  };
}

/**
 * Computes 3D mouse parallax tilt angles (degrees)
 */
export function calculateMouseParallax(
  mouseX: number, // -1 to 1 from center
  mouseY: number, // -1 to 1 from center
  intensity: number = 10
): { rotateX: number; rotateY: number } {
  const clampedX = Math.max(-1, Math.min(1, mouseX));
  const clampedY = Math.max(-1, Math.min(1, mouseY));
  const rx = -clampedY * intensity;
  const ry = clampedX * intensity;
  return {
    rotateX: rx === 0 ? 0 : rx,
    rotateY: ry === 0 ? 0 : ry,
  };
}
