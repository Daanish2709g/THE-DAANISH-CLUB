import React from 'react';
import { Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onOpen3DStudio: () => void;
  onExploreCollections: () => void;
  onOpenMeasurementStudio: () => void;
  onOpenStyleQuiz?: () => void;
  onScrollToAssembly?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpen3DStudio,
  onExploreCollections,
  onOpenMeasurementStudio,
  onOpenStyleQuiz,
  onScrollToAssembly,
}) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#222228] bg-[#0A0A0C]">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/src/assets/images/hero_bespoke_suit_atelier_1794036766271.jpg"
          alt="Bespoke tailored tuxedo in luxury Milanese atelier"
          className="w-full h-full object-cover object-center brightness-[0.40] contrast-[1.15]"
          referrerPolicy="no-referrer"
        />
        {/* Gradients to blend seamless obsidian canvas */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C] via-transparent to-[#0A0A0C]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center flex flex-col items-center">
        {/* Subtle Brand Kicker */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-5">
          <div className="inline-flex items-center gap-2.5 text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
            <span>The Daanish Club</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Bespoke Sartorial House</span>
          </div>

          {onOpenStyleQuiz && (
            <button
              type="button"
              onClick={onOpenStyleQuiz}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A24]/90 hover:bg-[#252534] border border-[#C5A880]/40 rounded-full text-[11px] font-mono text-[#E5D5B8] hover:text-[#FFFFFF] transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-3 h-3 text-[#C5A880]" />
              <span>AI Style Discovery Quiz →</span>
            </button>
          )}
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#F9FAFB] tracking-tight leading-[1.08] max-w-4xl balance mb-6">
          The Art of the Custom Suit. <br />
          <span className="italic font-normal text-[#E5D5B8]">Sculpted to Your Stance.</span>
        </h1>

        {/* Subtitle - Minimal, punchy, zero wall-of-text */}
        <p className="text-base sm:text-lg text-[#9CA3AF] max-w-2xl leading-relaxed mb-9 font-normal">
          Fine Italian cloth. Sculpted floating canvas. Bespoke fitting engineered to your posture.
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {onScrollToAssembly && (
            <button
              type="button"
              onClick={onScrollToAssembly}
              className="w-full sm:w-auto px-8 py-4 bg-[#C5A880] hover:bg-[#D4AF37] text-[#0A0A0C] text-xs font-semibold uppercase tracking-[0.2em] rounded transition-all duration-200 shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Watch Suit Assemble</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpen3DStudio}
            className="w-full sm:w-auto px-8 py-4 bg-[#141418]/90 hover:bg-[#1E1E26] text-[#E5E7EB] border border-[#2E2E38] hover:border-[#C5A880]/60 text-xs font-semibold uppercase tracking-[0.2em] rounded transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>3D Fitting Studio</span>
          </button>

          <button
            type="button"
            onClick={onExploreCollections}
            className="w-full sm:w-auto px-6 py-4 text-xs font-medium uppercase tracking-[0.16em] text-[#C4C8D0] hover:text-[#F3F4F6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer underline-offset-4 hover:underline"
          >
            <span>Explore Catalog</span>
          </button>
        </div>

        {/* Quiet Trust Bar: Minimal metrics, zero essay paragraphs */}
        <div className="mt-14 pt-6 border-t border-[#222228]/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left w-full max-w-4xl text-xs">
          <div>
            <p className="font-semibold text-[#F3F4F6] uppercase tracking-wider mb-0.5">50+ Hours</p>
            <p className="text-[11px] text-[#9CA3AF]">Hand-padded canvas</p>
          </div>
          <div>
            <p className="font-semibold text-[#F3F4F6] uppercase tracking-wider mb-0.5">Noble Cloth</p>
            <p className="text-[11px] text-[#9CA3AF]">Biella & Yorkshire mills</p>
          </div>
          <div>
            <p className="font-semibold text-[#F3F4F6] uppercase tracking-wider mb-0.5">100% Fit</p>
            <p className="text-[11px] text-[#9CA3AF]">Bespoke guarantee</p>
          </div>
          <div>
            <p className="font-semibold text-[#F3F4F6] uppercase tracking-wider mb-0.5">Diplomatic</p>
            <p className="text-[11px] text-[#9CA3AF]">Worldwide courier</p>
          </div>
        </div>
      </div>
    </section>
  );
};
