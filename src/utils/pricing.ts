import { CurrencyCode, CurrencyConfig, CustomBespokeConfig } from '../types/suit';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rateFromUsd: 1.0, formatLocale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', rateFromUsd: 0.92, formatLocale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', rateFromUsd: 0.79, formatLocale: 'en-GB' },
  JPY: { code: 'JPY', symbol: '¥', rateFromUsd: 154.5, formatLocale: 'ja-JP' },
  INR: { code: 'INR', symbol: '₹', rateFromUsd: 84.8, formatLocale: 'en-IN' },
  AED: { code: 'AED', symbol: 'AED ', rateFromUsd: 3.67, formatLocale: 'en-AE' },
  CAD: { code: 'CAD', symbol: 'CA$', rateFromUsd: 1.39, formatLocale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', rateFromUsd: 1.53, formatLocale: 'en-AU' },
};

export function convertPrice(amountUsd: number, currency: CurrencyCode): number {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const converted = amountUsd * config.rateFromUsd;
  if (currency === 'JPY') {
    return Math.round(converted);
  }
  return Math.round(converted);
}

export function formatPrice(amountUsd: number, currency: CurrencyCode): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const value = convertPrice(amountUsd, currency);
  return `${config.symbol}${value.toLocaleString(config.formatLocale)}`;
}

export function calculateSuitTotal(
  basePriceUsd: number,
  fabricExtraCostUsd: number,
  hasMonogram: boolean,
  buttonStance: string
): number {
  let total = basePriceUsd + fabricExtraCostUsd;
  // Double breasted adds extra cloth and craftsmanship
  if (buttonStance.includes('double-breasted')) {
    total += 180;
  }
  // Hand-embroidered silk monogramming
  if (hasMonogram) {
    total += 75;
  }
  return total;
}

export function calculatePackagingFee(packaging: 'signature-box' | 'cedar-travel-trunk' | 'leather-garment-carrier'): number {
  switch (packaging) {
    case 'cedar-travel-trunk':
      return 250;
    case 'leather-garment-carrier':
      return 180;
    case 'signature-box':
    default:
      return 0; // Complimentary signature black-tie box
  }
}

export function calculateCartSummary(
  items: Array<{ config: CustomBespokeConfig; quantity: number; packagingOption: 'signature-box' | 'cedar-travel-trunk' | 'leather-garment-carrier' }>,
  currency: CurrencyCode,
  isExpressShipping: boolean
) {
  const subtotalUsd = items.reduce((sum, item) => {
    const pkgFee = calculatePackagingFee(item.packagingOption);
    return sum + (item.config.totalPriceUsd + pkgFee) * item.quantity;
  }, 0);

  // International insured white-glove shipping: Free over $2500, or $150 express
  const shippingUsd = subtotalUsd >= 2500 ? 0 : (isExpressShipping ? 150 : 85);
  // International customs & duties guaranteed prepay
  const estimatedDutiesUsd = Math.round(subtotalUsd * 0.05);
  const totalUsd = subtotalUsd + shippingUsd + estimatedDutiesUsd;

  return {
    subtotalUsd,
    shippingUsd,
    estimatedDutiesUsd,
    totalUsd,
    subtotalFormatted: formatPrice(subtotalUsd, currency),
    shippingFormatted: shippingUsd === 0 ? 'Complimentary' : formatPrice(shippingUsd, currency),
    dutiesFormatted: formatPrice(estimatedDutiesUsd, currency),
    totalFormatted: formatPrice(totalUsd, currency),
  };
}
