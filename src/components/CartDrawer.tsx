import React from 'react';
import { CartItem, CurrencyCode } from '../types/suit';
import { formatPrice, calculateCartSummary } from '../utils/pricing';
import { X, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Package } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdatePackaging: (id: string, pkg: 'signature-box' | 'cedar-travel-trunk' | 'leather-garment-carrier') => void;
  onProceedToCheckout: () => void;
  currentCurrency: CurrencyCode;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdatePackaging,
  onProceedToCheckout,
  currentCurrency,
}) => {
  if (!isOpen) return null;

  const summary = calculateCartSummary(items, currentCurrency, true);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#0F0F14] border-l border-[#24242C] h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#222228] flex items-center justify-between bg-[#121218]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
            <h2 className="text-base font-serif tracking-wider text-[#F3F4F6] uppercase">
              Bespoke Wardrobe ({items.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1C1C24] rounded-lg transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#9CA3AF]">
              <ShoppingBag className="w-12 h-12 text-[#32323D] mb-3" />
              <p className="text-sm font-serif text-[#E5E7EB]">Your Wardrobe Is Empty</p>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Explore our collections or enter the 3D Fitting Studio to commission a custom suit.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-[#14141A] border border-[#24242E] rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-serif text-[#F3F4F6] font-medium leading-tight">
                      {item.config.suitName}
                    </h3>
                    <p className="text-xs text-[#C5A880] mt-0.5">
                      {item.config.fabric.name}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF]">
                      {item.config.lapel} lapel · {item.config.buttons}
                      {item.config.monogramText && ` · Monogram: ${item.config.monogramText}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors p-1"
                    aria-label={`Remove ${item.config.suitName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Packaging Option Selector */}
                <div className="pt-2 border-t border-[#1F1F27]">
                  <label className="text-[11px] uppercase tracking-wider text-[#9CA3AF] block mb-1">
                    Luxury Packaging
                  </label>
                  <select
                    value={item.packagingOption}
                    onChange={(e) => onUpdatePackaging(item.id, e.target.value as any)}
                    aria-label="Luxury Packaging"
                    className="w-full bg-[#0D0D12] border border-[#272732] text-[#E5E7EB] text-xs p-1.5 rounded focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="signature-box">Signature Obsidian Box (Complimentary)</option>
                    <option value="cedar-travel-trunk">Aromatic Cedar Travel Trunk (+{formatPrice(250, currentCurrency)})</option>
                    <option value="leather-garment-carrier">Hand-Stitched Leather Carrier (+{formatPrice(180, currentCurrency)})</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-sm font-semibold font-mono text-[#F3F4F6] tabular-nums">
                    {formatPrice(item.config.totalPriceUsd, currentCurrency)}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">
                    Qty: {item.quantity}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#222228] bg-[#121218] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Bespoke Subtotal</span>
                <span className="font-mono text-[#E5E7EB] tabular-nums">{summary.subtotalFormatted}</span>
              </div>
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Global Express Insured Transit</span>
                <span className="font-mono text-[#E5E7EB] tabular-nums">{summary.shippingFormatted}</span>
              </div>
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Guaranteed Customs & Import Duties</span>
                <span className="font-mono text-[#E5E7EB] tabular-nums">{summary.dutiesFormatted}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#F3F4F6] pt-2 border-t border-[#22222A]">
                <span>Total Commission</span>
                <span className="font-mono text-[#C5A880] tabular-nums">{summary.totalFormatted}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0A0C] bg-[#C5A880] hover:bg-[#D4AF37] rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#9CA3AF]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>256-Bit Encrypted International Vault Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
