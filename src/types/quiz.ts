import { SuitProduct } from './suit';

export type QuizCategory = 'occasion' | 'silhouette' | 'style-icon' | 'fabric-texture' | 'color-palette';

export interface QuizOption {
  id: string;
  label: string;
  sublabel: string;
  tag?: string;
  suitScores: Record<string, number>; // Maps suit ID to affinity points
  fabricIdMatch?: string;
}

export interface QuizQuestion {
  id: string;
  number: number;
  category: QuizCategory;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

export type QuizAnswers = Record<string, string>;

export interface StyleQuizResult {
  recommendedSuit: SuitProduct;
  secondarySuit?: SuitProduct;
  matchScore: number; // 0-100 percentage
  archetypeTitle: string;
  stylePersonaSummary: string;
  cutterRationale: string;
  recommendedFabricId: string;
  suggestedLapel: string;
  suggestedSilhouette: string;
  stylingTips: string[];
}
