import React from 'react';
import { Sparkles, ArrowRight, Compass, Crown } from 'lucide-react';

interface StyleQuizBannerProps {
  onOpenQuiz: () => void;
}

export const StyleQuizBanner: React.FC<StyleQuizBannerProps> = ({ onOpenQuiz }) => {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-y border-[#202028] bg-gradient-to-b from-[#0D0D12] via-[#101017] to-[#0A0A0E] overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[220px] bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/15 border border-[#C5A880]/30 rounded-full text-[#C5A880] text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Style Discovery Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#F9FAFB] leading-tight">
            Not Certain Which Silhouette & Cloth Fits Your Heritage?
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Answer 5 quick sartorial questions to receive an exact Master Tailor recommendation matched to your occasion and posture.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenQuiz}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#C5A880] hover:bg-[#D4AF37] text-[#0A0A0C] text-xs font-semibold uppercase tracking-[0.18em] rounded-lg transition-all duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Launch AI Style Quiz</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
