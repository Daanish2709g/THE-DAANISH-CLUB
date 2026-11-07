import React from 'react';
import { Scissors, Sparkles, Shield, Compass, Feather } from 'lucide-react';

export const CraftsmanshipSection: React.FC = () => {
  return (
    <section id="craftsmanship" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#222228]">
      {/* 2-Column Balanced Editorial Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Macro Craftsmanship Photography */}
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#272730] shadow-2xl group">
          <img
            src="/src/assets/images/fabric_craftsmanship_detail_1794036767061.jpg"
            alt="Savile Row master tailor hand-cutting Super 180s wool with brass shears"
            className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.88]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 sm:p-8 flex flex-col justify-end">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold mb-1">
              Atelier Savile Row · Bench No. 4
            </span>
            <p className="text-sm font-serif text-[#F3F4F6] italic max-w-md">
              &ldquo;A suit must never wear the client; it must yield to posture like water over stone.&rdquo;
            </p>
          </div>
        </div>

        {/* Right Column: Pillars of Bespoke Distinction */}
        <div className="lg:col-span-6 space-y-6">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
            05 / Master Heritage
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F9FAFB] tracking-tight leading-tight">
            Full Floating Canvas. Zero Industrial Fusing.
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Every suit at The Daanish Club is hand-padded with Mongolian horsehair canvas that molds to your anatomy over time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#111116] border border-[#22222A]">
              <div className="w-8 h-8 rounded-lg bg-[#C5A880]/15 flex items-center justify-center mb-2">
                <Scissors className="w-4 h-4 text-[#C5A880]" />
              </div>
              <h3 className="text-xs font-serif font-semibold text-[#F3F4F6] mb-1">
                50+ Hours Handwork
              </h3>
              <p className="text-[11px] text-[#9CA3AF] leading-snug">
                1,200 hand-padded stitches securing the lapel roll.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111116] border border-[#22222A]">
              <div className="w-8 h-8 rounded-lg bg-[#C5A880]/15 flex items-center justify-center mb-2">
                <Compass className="w-4 h-4 text-[#C5A880]" />
              </div>
              <h3 className="text-xs font-serif font-semibold text-[#F3F4F6] mb-1">
                Barchetta Pocket
              </h3>
              <p className="text-[11px] text-[#9CA3AF] leading-snug">
                Curved breast welt cut on bias to hug pectoral muscle.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111116] border border-[#22222A]">
              <div className="w-8 h-8 rounded-lg bg-[#C5A880]/15 flex items-center justify-center mb-2">
                <Feather className="w-4 h-4 text-[#C5A880]" />
              </div>
              <h3 className="text-xs font-serif font-semibold text-[#F3F4F6] mb-1">
                Noble Mill Origin
              </h3>
              <p className="text-[11px] text-[#9CA3AF] leading-snug">
                Direct bolts from Loro Piana, Zegna, and Scabal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
