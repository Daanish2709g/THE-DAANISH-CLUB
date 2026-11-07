import React, { useState } from 'react';
import { CurrencyCode } from '../types/suit';
import { CURRENCY_CONFIGS } from '../utils/pricing';
import { ShoppingBag, Menu, X, Sparkles, Globe, Compass, Ruler, Calendar, Truck } from 'lucide-react';

interface NavbarProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenConsultation: () => void;
  onOpenStyleQuiz?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCurrency,
  onCurrencyChange,
  cartCount,
  onOpenCart,
  onNavigate,
  activeSection,
  onOpenConsultation,
  onOpenStyleQuiz,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'suit-assembly', label: 'Suit Assembly' },
    { id: 'collections', label: 'Collections' },
    { id: '3d-studio', label: '3D Studio' },
    { id: 'ai-measurements', label: 'AI Measurements' },
    { id: 'craftsmanship', label: 'Craftsmanship' },
    { id: 'order-tracking', label: 'Track Order' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-[#222228] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('hero')}
          className="text-base sm:text-2xl font-serif tracking-[0.16em] sm:tracking-[0.25em] text-[#F3F4F6] hover:text-[#C5A880] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          THE DAANISH CLUB
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.18em] font-medium text-[#9CA3AF]">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleLinkClick(link.id)}
              className={`hover:text-[#F3F4F6] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-1 border-b ${
                activeSection === link.id
                  ? 'text-[#C5A880] border-[#C5A880]'
                  : 'border-transparent'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* International Currency Selector */}
          <div className="relative inline-flex items-center">
            <label htmlFor="currency-select" className="sr-only">Select Currency</label>
            <select
              id="currency-select"
              value={currentCurrency}
              aria-label="Select Currency"
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="bg-[#141418] border border-[#2B2B34] text-[#D1D5DB] text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-[#C5A880] cursor-pointer"
            >
              {(Object.keys(CURRENCY_CONFIGS) as CurrencyCode[]).map((code) => (
                <option key={code} value={code} className="bg-[#141418] text-[#F3F4F6]">
                  {code} ({CURRENCY_CONFIGS[code].symbol})
                </option>
              ))}
            </select>
          </div>

          {/* AI Style Discovery Quiz Button */}
          {onOpenStyleQuiz && (
            <button
              type="button"
              onClick={onOpenStyleQuiz}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#E5D5B8] bg-[#1A1A22] border border-[#C5A880]/40 hover:border-[#C5A880] hover:text-[#FFFFFF] rounded transition-all whitespace-nowrap cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>AI Style Quiz</span>
            </button>
          )}

          {/* Book Consultation Button */}
          <button
            type="button"
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#0A0A0C] bg-[#C5A880] hover:bg-[#D4AF37] rounded transition-all whitespace-nowrap shadow-sm"
          >
            <span>Book Atelier</span>
          </button>

          {/* Shopping Bag Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 text-[#E5E7EB] hover:text-[#C5A880] transition-colors"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C5A880] text-[#0A0A0C] text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#9CA3AF] hover:text-[#F3F4F6]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F0F14] border-b border-[#222228] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                className="text-left py-2 text-sm uppercase tracking-[0.16em] text-[#E5E7EB] hover:text-[#C5A880] border-b border-[#1F1F26]"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-3">
            {onOpenStyleQuiz && (
              <button
                type="button"
                onClick={() => {
                  onOpenStyleQuiz();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-[#E5D5B8] bg-[#1A1A24] border border-[#C5A880]/40 rounded hover:border-[#C5A880] transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>AI Style Discovery Quiz</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onOpenConsultation();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-[#0A0A0C] bg-[#C5A880] rounded hover:bg-[#D4AF37] transition-colors"
            >
              Book Atelier Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
