import React, { useState } from 'react';
import { OrderTrackingInfo } from '../types/suit';
import { generateMockOrder } from '../utils/tracking';
import { formatPrice } from '../utils/pricing';
import { Truck, Search, CheckCircle2, Clock, MapPin, BellRing, Plane, ShieldCheck, Box } from 'lucide-react';

interface OrderTrackingViewProps {
  initialOrder?: OrderTrackingInfo | null;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ initialOrder }) => {
  const [searchQuery, setSearchQuery] = useState(initialOrder?.orderId || 'TDC-8921');
  const [currentOrder, setCurrentOrder] = useState<OrderTrackingInfo>(
    initialOrder || generateMockOrder('TDC-8921')
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const result = generateMockOrder(searchQuery.trim());
      setCurrentOrder(result);
    }
  };

  return (
    <section id="order-tracking" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#222228]">
      {/* Section Header */}
      <div className="max-w-3xl mb-12">
        <div className="text-xs uppercase tracking-[0.25em] text-[#C5A880] mb-2 font-semibold">
          06 / Automated Dispatch
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F9FAFB] tracking-tight mb-3">
          Atelier Progress & Diplomatic Transit
        </h2>
        <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
          Real-time telemetry tracking from initial laser shearing to cedar trunk sealing.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-md mb-10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Commission ID (e.g. TDC-8921)"
              aria-label="Order Tracking Search"
              className="w-full bg-[#111116] border border-[#272730] text-[#F3F4F6] text-xs pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:border-[#C5A880] font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#0A0A0C] bg-[#C5A880] hover:bg-[#D4AF37] rounded-lg transition-colors cursor-pointer"
          >
            Locate
          </button>
        </div>
      </form>

      {/* Main Order Details Card */}
      <div className="bg-[#111116] border border-[#24242C] rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Order Quick Overview Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#22222A] gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C5A880] bg-[#C5A880]/10 px-2.5 py-1 rounded border border-[#C5A880]/30">
                {currentOrder.orderId}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                Courier: <strong className="text-[#E5E7EB] font-normal">{currentOrder.courier}</strong>
              </span>
            </div>
            <h3 className="text-xl font-serif text-[#F3F4F6] mt-2">
              Status: {currentOrder.statusLabel}
            </h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-left md:text-right">
              <span className="text-[11px] text-[#9CA3AF] block uppercase tracking-wider">Estimated Delivery</span>
              <span className="text-sm font-semibold text-[#F3F4F6] font-mono">{currentOrder.estimatedDeliveryDate}</span>
            </div>

            {/* Notification alert toggle */}
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                notificationsEnabled
                  ? 'border-[#C5A880] bg-[#1A1A22] text-[#C5A880]'
                  : 'border-[#272732] bg-[#121216] text-[#9CA3AF]'
              }`}
              title="Toggle Automated Dispatch Updates"
            >
              <BellRing className="w-4 h-4" />
              <span className="hidden sm:inline">
                {notificationsEnabled ? 'Automated Alerts Active' : 'Enable Alerts'}
              </span>
            </button>
          </div>
        </div>

        {/* 6-Stage Timeline Progress */}
        <div className="py-8">
          <div className="text-xs uppercase tracking-widest text-[#E5E7EB] font-semibold mb-6">
            Master Tailor & Dispatch Milestones
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#272732]">
            {currentOrder.milestones.map((m) => (
              <div key={m.stage} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    m.isCompleted
                      ? 'bg-[#C5A880] text-[#0A0A0C] ring-4 ring-[#C5A880]/20'
                      : m.stage === currentOrder.statusStage
                      ? 'bg-[#181822] border-2 border-[#C5A880] text-[#C5A880] ring-4 ring-[#C5A880]/10 animate-pulse'
                      : 'bg-[#181820] border border-[#32323D] text-[#6B7280]'
                  }`}
                >
                  {m.isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span className="text-[10px] font-mono">{m.stage}</span>
                  )}
                </div>

                <div className="bg-[#14141A] border border-[#22222A] p-4 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h4 className="text-sm font-serif font-medium text-[#F3F4F6]">
                      {m.stage}. {m.title}
                    </h4>
                    <span className="text-[11px] font-mono text-[#C5A880]">
                      {m.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mb-2 leading-relaxed">
                    {m.description}
                  </p>
                  <div className="text-[11px] text-[#9CA3AF] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{m.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courier Flight & Tracking ID Info Banner */}
        <div className="pt-6 border-t border-[#22222A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA3AF] gap-3">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-[#C5A880]" />
            <span>Air Waybill: <code className="text-[#E5E7EB] font-mono">{currentOrder.trackingNumber}</code></span>
          </div>
          <div className="flex items-center gap-1.5 text-[#10B981]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span>Telemetry & Climate Seal Monitored</span>
          </div>
        </div>
      </div>
    </section>
  );
};
