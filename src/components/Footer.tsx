import React from 'react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultation }) => {
  return (
    <footer className="bg-[#08080A] border-t border-[#1C1C22] text-[#9CA3AF] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xl font-serif text-[#F3F4F6] tracking-[0.2em]">
              THE DAANISH CLUB
            </h3>
            <p className="text-xs text-[#9CA3AF] max-w-sm leading-relaxed">
              Haute bespoke custom tailoring for gentlemen and ladies. Real-time 3D drape assembly, noble Biella cloths, and insured diplomatic courier.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A880] hover:text-[#D4AF37] underline-offset-4 hover:underline cursor-pointer"
              >
                <span>Reserve Private Fitting Suite →</span>
              </button>
            </div>
          </div>

          {/* Ateliers Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E5E7EB]">
              Global Ateliers
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              <li>London: 14 Savile Row, Mayfair</li>
              <li>Milan: Via Monte Napoleone 8</li>
              <li>New York: 740 Madison Avenue</li>
              <li>Tokyo: 6-10-1 Ginza, Chuo</li>
              <li>Mumbai: Taj Heritage Wing</li>
            </ul>
          </div>

          {/* Wardrobe Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E5E7EB]">
              Commissions
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('collections')}
                  className="hover:text-[#F3F4F6] transition-colors cursor-pointer text-left"
                >
                  Black Tie & Evening Tuxedos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('collections')}
                  className="hover:text-[#F3F4F6] transition-colors cursor-pointer text-left"
                >
                  Haute Bridal & Wedding Couture
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('collections')}
                  className="hover:text-[#F3F4F6] transition-colors cursor-pointer text-left"
                >
                  Executive Boardroom Attire
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('collections')}
                  className="hover:text-[#F3F4F6] transition-colors cursor-pointer text-left"
                >
                  Celebration Velvet Smoking Jackets
                </button>
              </li>
            </ul>
          </div>

          {/* Bespoke Client Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E5E7EB]">
              Client Care
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('3d-studio')}
                  className="hover:text-[#F3F4F6] transition-colors cursor-pointer text-left"
                >
                  3D Fitting Trial
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('ai-measurements')}
                  className="hover:text-[#F3F4F6] transition-colors cursor-pointer text-left"
                >
                  AI Measurement Scanner
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('order-tracking')}
                  className="hover:text-[#F3F4F6] transition-colors cursor-pointer text-left"
                >
                  Automated Order Tracking
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="hover:text-[#F3F4F6] transition-colors cursor-pointer text-left"
                >
                  Virtual Video Stylist
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#191920] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#9CA3AF] gap-4">
          <p>© {new Date().getFullYear()} The Daanish Club Bespoke House. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Bespoke Lifetime Warranty</span>
            <span>·</span>
            <span>Worldwide Insured Diplomatic Transit</span>
            <span>·</span>
            <span>Privacy Vault Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
