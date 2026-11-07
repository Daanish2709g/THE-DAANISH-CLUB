import React, { useState } from 'react';
import { CartItem, CurrencyCode, OrderTrackingInfo } from '../types/suit';
import { calculateCartSummary, formatPrice } from '../utils/pricing';
import { TRACKING_STAGES } from '../utils/tracking';
import { X, ShieldCheck, Lock, CreditCard, CheckCircle2, Globe, Truck, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentCurrency: CurrencyCode;
  onOrderSuccess: (order: OrderTrackingInfo) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentCurrency,
  onOrderSuccess,
}) => {
  const [shippingMethod, setShippingMethod] = useState<'express' | 'armored-vault'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay' | 'wire'>('card');
  const [country, setCountry] = useState('United States');
  const [fullName, setFullName] = useState('Lord Alistair Sterling');
  const [email, setEmail] = useState('alistair.sterling@mayfair.com');
  const [address, setAddress] = useState('14 Berkeley Square, Mayfair');
  const [city, setCity] = useState('London');
  const [postalCode, setPostalCode] = useState('W1J 5AW');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isExpress = shippingMethod === 'express';
  const summary = calculateCartSummary(items, currentCurrency, isExpress);
  const vaultFeeUsd = shippingMethod === 'armored-vault' ? 350 : 0;
  const grandTotalUsd = summary.totalUsd + vaultFeeUsd;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const generatedOrderId = `TDC-${Math.floor(1000 + Math.random() * 9000)}`;

      // Confetti celebration for luxury bespoke commission
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C5A880', '#D4AF37', '#E5E7EB', '#111116'],
        });
      } catch (err) {
        // non-critical
      }

      const now = new Date();
      const orderInfo: OrderTrackingInfo = {
        orderId: generatedOrderId,
        customerName: fullName,
        items,
        currency: currentCurrency,
        totalPaid: grandTotalUsd,
        statusStage: 1, // Freshly commissioned
        statusLabel: TRACKING_STAGES[0].title,
        estimatedDeliveryDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'long',
          day: 'numeric',
        }),
        courier: shippingMethod === 'armored-vault' ? 'Private Armored Vault Concierge' : 'DHL Express Worldwide Diplomatic Air',
        trackingNumber: `DHL-EXP-AU-${generatedOrderId}-X7`,
        destinationCity: city,
        destinationCountry: country,
        milestones: TRACKING_STAGES.map((s, idx) => ({
          stage: s.stage,
          title: s.title,
          description: s.description,
          location: s.location,
          timestamp: idx === 0 ? 'Commission Approved' : 'Estimated Stage',
          isCompleted: idx === 0,
        })),
      };

      onOrderSuccess(orderInfo);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0D0D11] border border-[#272730] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222228] flex items-center justify-between bg-[#111116] shrink-0">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#C5A880]" />
            <div>
              <h2 className="text-base font-serif text-[#F3F4F6]">
                Secure International Bespoke Checkout
              </h2>
              <p className="text-xs text-[#9CA3AF]">
                Encrypted Diplomatic Transit & Guaranteed Customs Pre-Clearance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1C1C24] rounded-lg transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Shipping & Payment Form Left Column (7 cols) */}
          <div className="lg:col-span-7 p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-[#222228]">
            {/* Delivery Destination */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#E5E7EB] font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C5A880]" />
                <span>1. International Delivery Destination</span>
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="country-select" className="text-[11px] text-[#9CA3AF] block mb-1">Country / Territory</label>
                    <select
                      id="country-select"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#141418] border border-[#272730] text-[#E5E7EB] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Italy">Italy</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="India">India</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Germany">Germany</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="full-recipient-name" className="text-[11px] text-[#9CA3AF] block mb-1">Full Recipient Name</label>
                    <input
                      id="full-recipient-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#141418] border border-[#272730] text-[#F3F4F6] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="recipient-email" className="text-[11px] text-[#9CA3AF] block mb-1">Email for Dispatch Alerts</label>
                    <input
                      id="recipient-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#141418] border border-[#272730] text-[#F3F4F6] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label htmlFor="street-address" className="text-[11px] text-[#9CA3AF] block mb-1">Street Address</label>
                    <input
                      id="street-address"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#141418] border border-[#272730] text-[#F3F4F6] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="city-town" className="text-[11px] text-[#9CA3AF] block mb-1">City</label>
                    <input
                      id="city-town"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#141418] border border-[#272730] text-[#F3F4F6] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label htmlFor="postal-zip-code" className="text-[11px] text-[#9CA3AF] block mb-1">Postal Code</label>
                    <input
                      id="postal-zip-code"
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-[#141418] border border-[#272730] text-[#F3F4F6] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Courier Selection */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#E5E7EB] font-semibold mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C5A880]" />
                <span>2. Insured Courier Service</span>
              </h3>
              <div className="space-y-2">
                <label className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                  shippingMethod === 'express' ? 'border-[#C5A880] bg-[#171720]' : 'border-[#22222A] bg-[#121216]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="accent-[#C5A880]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#F3F4F6]">
                          DHL Express Worldwide Diplomatic Air
                        </div>
                        <div className="text-[11px] text-[#9CA3AF]">
                          Temperature-controlled aircraft hold · 2-3 business days post-tailoring
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#C5A880]">Complimentary</span>
                  </div>
                </label>

                <label className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                  shippingMethod === 'armored-vault' ? 'border-[#C5A880] bg-[#171720]' : 'border-[#22222A] bg-[#121216]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'armored-vault'}
                        onChange={() => setShippingMethod('armored-vault')}
                        className="accent-[#C5A880]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#F3F4F6]">
                          White-Glove Armored Vault Courier
                        </div>
                        <div className="text-[11px] text-[#9CA3AF]">
                          Personal tailor hand-delivery to your residence, suite, or private yacht
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#C5A880]">+{formatPrice(350, currentCurrency)}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#E5E7EB] font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#C5A880]" />
                <span>3. Payment Method</span>
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: 'Black / Elite Card' },
                  { id: 'apple-pay', label: 'Apple / Google Pay' },
                  { id: 'wire', label: 'Private Wire Transfer' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                      paymentMethod === m.id
                        ? 'border-[#C5A880] bg-[#181822] text-[#F3F4F6]'
                        : 'border-[#22222A] bg-[#121216] text-[#9CA3AF] hover:text-[#F3F4F6]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-3 p-3 bg-[#121216] border border-[#22222A] rounded-lg space-y-2">
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 8842"
                    aria-label="Card Number"
                    className="w-full bg-[#181820] border border-[#272730] text-[#E5E7EB] text-xs p-2 rounded font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      defaultValue="12/28"
                      aria-label="Card Expiration"
                      className="bg-[#181820] border border-[#272730] text-[#E5E7EB] text-xs p-2 rounded font-mono"
                    />
                    <input
                      type="text"
                      defaultValue="•••"
                      aria-label="Security Code"
                      className="bg-[#181820] border border-[#272730] text-[#E5E7EB] text-xs p-2 rounded font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Right Column (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-[#111116] flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-4">
                Commission Order Summary
              </h3>

              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-xs border-b border-[#1A1A22] pb-2">
                    <div>
                      <p className="font-medium text-[#F3F4F6]">{item.config.suitName}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{item.config.fabric.name} · Qty {item.quantity}</p>
                    </div>
                    <span className="font-mono text-[#F3F4F6] tabular-nums">
                      {formatPrice(item.config.totalPriceUsd * item.quantity, currentCurrency)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs border-t border-[#22222A] pt-4">
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#E5E7EB] tabular-nums">{summary.subtotalFormatted}</span>
                </div>
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Shipping</span>
                  <span className="font-mono text-[#E5E7EB] tabular-nums">
                    {shippingMethod === 'armored-vault' ? formatPrice(350, currentCurrency) : 'Complimentary'}
                  </span>
                </div>
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Pre-Cleared Import Duties</span>
                  <span className="font-mono text-[#E5E7EB] tabular-nums">{summary.dutiesFormatted}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#F3F4F6] pt-3 border-t border-[#22222A]">
                  <span>Total Amount</span>
                  <span className="font-mono text-[#C5A880] tabular-nums text-base">
                    {formatPrice(grandTotalUsd, currentCurrency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0A0C] bg-[#C5A880] hover:bg-[#D4AF37] disabled:opacity-50 rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Encrypting Payment & Commissioning...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize Commission ({formatPrice(grandTotalUsd, currentCurrency)})</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-[#9CA3AF] text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>100% Fit Guarantee & Fully Insured Diplomatic Transit</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
