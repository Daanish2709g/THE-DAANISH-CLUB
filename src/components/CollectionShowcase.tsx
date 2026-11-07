import React, { useState } from 'react';
import { SuitProduct, OccasionType, GenderCategory, CurrencyCode } from '../types/suit';
import { SUIT_CATALOG } from '../data/suitCatalog';
import { formatPrice } from '../utils/pricing';
import { Sparkles, ArrowUpRight, Scissors, SlidersHorizontal, Check } from 'lucide-react';

interface CollectionShowcaseProps {
  currentCurrency: CurrencyCode;
  onSelectSuitFor3D: (suit: SuitProduct) => void;
  onQuickCommission: (suit: SuitProduct) => void;
}

export const CollectionShowcase: React.FC<CollectionShowcaseProps> = ({
  currentCurrency,
  onSelectSuitFor3D,
  onQuickCommission,
}) => {
  const [filterOccasion, setFilterOccasion] = useState<OccasionType>('all');
  const [filterGender, setFilterGender] = useState<'all' | GenderCategory>('all');

  const filteredSuits = SUIT_CATALOG.filter((suit) => {
    const matchesOccasion = filterOccasion === 'all' || suit.occasion === filterOccasion;
    const matchesGender = filterGender === 'all' || suit.gender === filterGender || suit.gender === 'unisex';
    return matchesOccasion && matchesGender;
  });

  const occasions: { id: OccasionType; label: string }[] = [
    { id: 'all', label: 'All Commissions' },
    { id: 'black-tie', label: 'Black Tie & Gala' },
    { id: 'bridal-wedding', label: 'Haute Bridal & Wedding' },
    { id: 'executive', label: 'Executive Boardroom' },
  ];

  const genders: { id: 'all' | GenderCategory; label: string }[] = [
    { id: 'all', label: 'All Silhouettes' },
    { id: 'men', label: "Men's Bespoke" },
    { id: 'women', label: "Women's Couture" },
  ];

  return (
    <section id="collections" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#222228] pb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#C5A880] mb-2 font-semibold">
            02 / Curated Commissions · The Daanish Club
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F9FAFB] tracking-tight">
            The Bespoke Wardrobe
          </h2>
        </div>

        {/* Filter Controls (Segmented clean tabs) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Gender Filter */}
          <div className="flex items-center gap-1 bg-[#141418] p-1 rounded-lg border border-[#272730]">
            {genders.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setFilterGender(g.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  filterGender === g.id
                    ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Occasion Filter */}
          <div className="flex items-center gap-1 bg-[#141418] p-1 rounded-lg border border-[#272730]">
            {occasions.map((occ) => (
              <button
                key={occ.id}
                type="button"
                onClick={() => setFilterOccasion(occ.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  filterOccasion === occ.id
                    ? 'bg-[#272730] text-[#F3F4F6] font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                {occ.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSuits.map((suit) => (
          <div
            key={suit.id}
            className="group relative bg-[#111116] border border-[#24242C] hover:border-[#C5A880]/50 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl"
          >
            {/* Card Image Slot (65-75% visual dominance) */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0A0C]">
              <img
                src={suit.image}
                alt={suit.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.92]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Resilient styled fallback container
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              {/* Fallback container if network fails */}
              <div className="image-fallback hidden absolute inset-0 bg-[#16161D] flex flex-col items-center justify-center p-6 text-center">
                <Scissors className="w-10 h-10 text-[#C5A880] mb-2" />
                <p className="text-sm font-serif text-[#E5E7EB]">{suit.name}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">{suit.subtitle}</p>
              </div>

              {/* Discreet Cloth Status */}
              <div className="absolute top-3 left-3 bg-[#0A0A0C]/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-[#C5A880] tracking-wider uppercase border border-[#2B2B36]">
                {suit.gender === 'women' ? "Women's Couture" : suit.gender === 'men' ? "Men's Bespoke" : "Atelier Exclusive"}
              </div>

              {/* Floating 3D Launch on Hover */}
              <button
                type="button"
                onClick={() => onSelectSuitFor3D(suit)}
                className="absolute bottom-3 right-3 bg-[#0A0A0C]/90 hover:bg-[#C5A880] text-[#E5E7EB] hover:text-[#0A0A0C] px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md border border-[#2B2B36] transition-all cursor-pointer shadow-lg"
              >
                <span>Customize in 3D</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card Content & Metadata */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl font-serif text-[#F3F4F6] group-hover:text-[#C5A880] transition-colors leading-snug">
                    {suit.name}
                  </h3>
                  <div className="text-base font-semibold text-[#F3F4F6] font-mono tabular-nums whitespace-nowrap">
                    {formatPrice(suit.basePriceUsd, currentCurrency)}
                  </div>
                </div>

                <p className="text-xs text-[#9CA3AF] mb-4 line-clamp-2 leading-relaxed">
                  {suit.subtitle}
                </p>

                {/* Key craftsmanship specifications */}
                <ul className="space-y-1.5 mb-6 text-xs text-[#9CA3AF]">
                  {suit.details.slice(0, 2).map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]/70 shrink-0" />
                      <span className="truncate">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-[#1F1F27] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectSuitFor3D(suit)}
                  className="flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0A0A0C] bg-[#C5A880] hover:bg-[#D4AF37] rounded transition-colors text-center cursor-pointer"
                >
                  3D Fitting Trial
                </button>
                <button
                  type="button"
                  onClick={() => onQuickCommission(suit)}
                  className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-[#D1D5DB] hover:text-[#F3F4F6] bg-[#1A1A22] hover:bg-[#252530] border border-[#2B2B36] rounded transition-colors cursor-pointer"
                  title="Direct Commission"
                >
                  Commission
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
