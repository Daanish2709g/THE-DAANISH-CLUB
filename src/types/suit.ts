export type GenderCategory = 'men' | 'women' | 'unisex';

export type OccasionType = 'all' | 'black-tie' | 'bridal-wedding' | 'executive' | 'celebration-gala' | 'resort-luxury';

export type LapelType = 'peak' | 'notch' | 'shawl';

export type ButtonStance = '1-button' | '2-button' | '4x2-double-breasted' | '6x2-double-breasted';

export type VentType = 'side-vents' | 'center-vent' | 'ventless';

export type FitSilhouette = 'savile-row-structured' | 'milanese-soft' | 'neapolitan-unstructured';

export interface FabricOption {
  id: string;
  name: string;
  mill: string;
  composition: string;
  colorHex: string;
  textureType: 'solid-worsted' | 'pinstripe' | 'houndstooth' | 'velvet' | 'silk-jacquard' | 'pure-silk';
  accentBorder: string;
  extraCostUsd: number;
  weightGsm: number;
  yarnMicron?: string;
  drapeProfile: string;
  drapeStiffness: number; // 0.1 (fluid/liquid) to 0.9 (rigid/architectural)
  tactileFeel: string;
  seasonality: string;
  lusterGrade: 'Subtle Matte' | 'Satin Lustrous' | '24K Metallic Shimmer' | 'Deep Velvet Nap';
  macroImage?: string;
}

export interface SuitProduct {
  id: string;
  name: string;
  subtitle: string;
  gender: GenderCategory;
  occasion: OccasionType;
  basePriceUsd: number;
  image: string;
  description: string;
  fabricDefault: string;
  lapelDefault: LapelType;
  buttonDefault: ButtonStance;
  silhouetteDefault: FitSilhouette;
  details: string[];
  inStockCloth: boolean;
}

export interface CustomBespokeConfig {
  suitId: string;
  suitName: string;
  gender: GenderCategory;
  fabric: FabricOption;
  lapel: LapelType;
  buttons: ButtonStance;
  vents: VentType;
  silhouette: FitSilhouette;
  monogramText: string;
  monogramColor: 'champagne-gold' | 'silver-titanium' | 'midnight-navy' | 'burgundy';
  liningColor: string;
  trouserPleats: 'flat-front' | 'single-pleat' | 'double-forward-pleats';
  waistAdjusters: 'side-tabs-brass' | 'belt-loops' | 'clean-waistband';
  userPhotoUrl?: string;
  measurementsApplied?: BespokeMeasurements;
  totalPriceUsd: number;
}

export interface BespokeMeasurements {
  heightCm: number;
  weightKg: number;
  chestCircumferenceCm: number;
  waistCircumferenceCm: number;
  shoulderWidthCm: number;
  sleeveLengthCm: number;
  jacketLengthCm: number;
  inseamCm: number;
  neckCircumferenceCm: number;
  posturePitch: 'erect' | 'neutral' | 'forward-leaning';
  shoulderSlope: 'regular' | 'sloped' | 'square';
  dropClassification: string;
  notes?: string;
}

export interface CartItem {
  id: string;
  config: CustomBespokeConfig;
  quantity: number;
  packagingOption: 'signature-box' | 'cedar-travel-trunk' | 'leather-garment-carrier';
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'AED' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromUsd: number;
  formatLocale: string;
}

export interface AtelierAppointment {
  id: string;
  type: 'in-person' | 'virtual';
  locationName: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  occasionInterest: OccasionType;
  notes: string;
  requestFabricSwatchKit: boolean;
  createdAt: string;
}

export interface OrderTrackingInfo {
  orderId: string;
  customerName: string;
  items: CartItem[];
  currency: CurrencyCode;
  totalPaid: number;
  statusStage: number; // 1 to 6
  statusLabel: string;
  estimatedDeliveryDate: string;
  courier: string;
  trackingNumber: string;
  destinationCity: string;
  destinationCountry: string;
  milestones: {
    stage: number;
    title: string;
    description: string;
    location: string;
    timestamp: string;
    isCompleted: boolean;
  }[];
}
