import React, { useState, useEffect, useRef } from 'react';
import { FabricOption, CurrencyCode } from '../types/suit';
import { LUXURY_FABRICS } from '../data/suitCatalog';
import { formatPrice } from '../utils/pricing';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Layers,
  Check,
  ShieldCheck,
  Move,
  Info,
} from 'lucide-react';

interface FabricTextureModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFabric: FabricOption;
  onSelectFabric: (fabric: FabricOption) => void;
  currentCurrency: CurrencyCode;
}

export const FabricTextureModal: React.FC<FabricTextureModalProps> = ({
  isOpen,
  onClose,
  selectedFabric,
  onSelectFabric,
  currentCurrency,
}) => {
  const [activeFabric, setActiveFabric] = useState<FabricOption>(selectedFabric);
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 4>(1);
  const [panPosition, setPanPosition] = useState({ x: 50, y: 50 });
  const [isPanning, setIsPanning] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Sync active fabric when prop changes or modal opens
  useEffect(() => {
    setActiveFabric(selectedFabric);
  }, [selectedFabric, isOpen]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPanPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleApplyCloth = (fabric: FabricOption) => {
    onSelectFabric(fabric);
    onClose();
  };

  const macroImgSrc =
    activeFabric.macroImage ||
    '/src/assets/images/fabric_craftsmanship_detail_1794036767061.jpg';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fabric-texture-modal-title"
    >
      <div className="relative w-full max-w-5xl bg-[#0B0B0F] border border-[#2A2A38] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Atelier Loupe Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#20202B] flex items-center justify-between bg-[#101017] shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#C5A880]/15 border border-[#C5A880]/30 rounded-lg text-[#C5A880]">
              <ZoomIn className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A880]">
                  High-Resolution Macro Weave Loupe
                </span>
                <span className="text-[10px] font-mono text-[#9CA3AF] bg-[#181822] px-2 py-0.5 rounded border border-[#272733]">
                  {zoomLevel}x Magnification
                </span>
              </div>
              <h2
                id="fabric-texture-modal-title"
                className="text-base sm:text-lg font-serif text-[#F3F4F6] font-medium"
              >
                {activeFabric.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Zoom Switchers */}
            <div className="hidden sm:inline-flex items-center bg-[#161622] border border-[#282836] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                  zoomLevel === 1
                    ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                1x Macro
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(2)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                  zoomLevel === 2
                    ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                2x Weave
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(4)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                  zoomLevel === 4
                    ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                4x Fiber
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Fabric Texture Modal"
              className="p-1.5 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1C1C28] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: High-Resolution Macro Image Viewport with Pan & Loupe */}
          <div className="lg:col-span-7 space-y-3">
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsPanning(true)}
              onMouseLeave={() => setIsPanning(false)}
              className="relative w-full aspect-square bg-[#08080C] rounded-xl overflow-hidden border border-[#272736] shadow-2xl cursor-crosshair group select-none flex items-center justify-center"
            >
              <img
                src={macroImgSrc}
                alt={`${activeFabric.name} high-resolution weave texture`}
                className="w-full h-full object-cover transition-transform duration-100 ease-out pointer-events-none"
                style={{
                  transformOrigin: `${panPosition.x}% ${panPosition.y}%`,
                  transform: `scale(${zoomLevel})`,
                }}
              />

              {/* Atelier Vignette Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/40 via-transparent to-[#0B0B0F]/20 pointer-events-none" />

              {/* Optical Calibration Scale Bar Overlay */}
              <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-[#0E0E14]/85 border border-[#C5A880]/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-left">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-12 h-0.5 bg-[#C5A880]" />
                  <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider">
                    2.0 mm Scale
                  </span>
                </div>
                <div className="text-[10px] text-[#D1D5DB] font-mono">
                  {activeFabric.yarnMicron || `${activeFabric.weightGsm} GSM`}
                </div>
              </div>

              {/* Loupe Pan Hint */}
              <div className="absolute top-4 right-4 z-10 pointer-events-none bg-[#0E0E14]/85 border border-[#272733] backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-[#9CA3AF] font-mono flex items-center gap-1.5">
                <Move className="w-3 h-3 text-[#C5A880]" />
                <span>Move cursor to pan fibers</span>
              </div>
            </div>

            {/* Mobile Zoom Control Pills */}
            <div className="flex sm:hidden items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-[#9CA3AF] font-mono">Zoom Loupe:</span>
              <div className="inline-flex items-center bg-[#161622] border border-[#282836] rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className={`px-3 py-1 text-xs font-mono rounded ${
                    zoomLevel === 1 ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold' : 'text-[#9CA3AF]'
                  }`}
                >
                  1x
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(2)}
                  className={`px-3 py-1 text-xs font-mono rounded ${
                    zoomLevel === 2 ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold' : 'text-[#9CA3AF]'
                  }`}
                >
                  2x
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(4)}
                  className={`px-3 py-1 text-xs font-mono rounded ${
                    zoomLevel === 4 ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold' : 'text-[#9CA3AF]'
                  }`}
                >
                  4x
                </button>
              </div>
            </div>
          </div>

          {/* Right: Technical Textile Dossier & Fabric Switcher */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Mill Heritage & Fiber Fineness */}
              <div className="space-y-1 border-b border-[#1E1E28] pb-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A880] block">
                  Mill Origin & Fiber Specification
                </span>
                <h3 className="text-xl font-serif text-[#F9FAFB] font-semibold">
                  {activeFabric.name}
                </h3>
                <p className="text-xs text-[#C5A880] font-medium">{activeFabric.mill}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">{activeFabric.composition}</p>
              </div>

              {/* Master Weaver Tactile Quote */}
              <div className="bg-[#12121A] border border-[#252534] rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-[#C5A880] font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Master Weaver Hand-Feel</span>
                </div>
                <p className="text-xs text-[#D1D5DB] leading-relaxed italic font-serif">
                  &ldquo;{activeFabric.tactileFeel}&rdquo;
                </p>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#14141C] p-2.5 rounded-lg border border-[#22222E]">
                  <span className="text-[10px] text-[#9CA3AF] uppercase block">
                    Fiber Fineness
                  </span>
                  <span className="text-[#F3F4F6] font-mono font-medium block mt-0.5">
                    {activeFabric.yarnMicron || 'Superfine'}
                  </span>
                </div>

                <div className="bg-[#14141C] p-2.5 rounded-lg border border-[#22222E]">
                  <span className="text-[10px] text-[#9CA3AF] uppercase block">Cloth Weight</span>
                  <span className="text-[#F3F4F6] font-mono font-medium block mt-0.5">
                    {activeFabric.weightGsm} GSM
                  </span>
                </div>

                <div className="bg-[#14141C] p-2.5 rounded-lg border border-[#22222E]">
                  <span className="text-[10px] text-[#9CA3AF] uppercase block">Luster Grade</span>
                  <span className="text-[#C5A880] font-medium block mt-0.5 truncate">
                    {activeFabric.lusterGrade}
                  </span>
                </div>

                <div className="bg-[#14141C] p-2.5 rounded-lg border border-[#22222E]">
                  <span className="text-[10px] text-[#9CA3AF] uppercase block">Seasonality</span>
                  <span className="text-[#E5E7EB] font-medium block mt-0.5 truncate">
                    {activeFabric.seasonality.split('/')[0]}
                  </span>
                </div>
              </div>

              {/* Drape Fall Profile */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA3AF]">Drape Profile:</span>
                  <span className="text-[#F3F4F6] font-medium">{activeFabric.drapeProfile}</span>
                </div>
                <div className="w-full h-1.5 bg-[#1B1B26] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C5A880] to-[#E5D5B8] rounded-full"
                    style={{ width: `${activeFabric.drapeStiffness * 100}%` }}
                  />
                </div>
              </div>

              {/* Cloth Switcher Strip (Compare with Other Weaves) */}
              <div className="space-y-2 pt-2 border-t border-[#1E1E28]">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF] block">
                  Compare Noble Weaves ({LUXURY_FABRICS.length} Mill Bolts Available):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LUXURY_FABRICS.map((fabric) => {
                    const isCurrent = activeFabric.id === fabric.id;
                    return (
                      <button
                        key={fabric.id}
                        type="button"
                        onClick={() => setActiveFabric(fabric)}
                        className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isCurrent
                            ? 'border-[#C5A880] bg-[#1A1A24] ring-1 ring-[#C5A880]/30'
                            : 'border-[#22222C] bg-[#121218] hover:border-[#383848]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: fabric.colorHex }}
                          />
                          <span className="text-[10px] text-[#F3F4F6] font-medium truncate">
                            {fabric.name.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-[#C5A880]">
                          {fabric.extraCostUsd === 0
                            ? 'Included'
                            : `+${formatPrice(fabric.extraCostUsd, currentCurrency)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-4 border-t border-[#1E1E28] space-y-2">
              <button
                type="button"
                onClick={() => handleApplyCloth(activeFabric)}
                className="w-full py-3.5 px-4 bg-[#C5A880] hover:bg-[#D4AF37] text-[#0A0A0C] text-xs font-semibold uppercase tracking-[0.16em] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Apply {activeFabric.name.split('·')[0]} to Commission</span>
              </button>
              <p className="text-[10px] text-center text-[#9CA3AF]">
                Certified Biella & Yorkshire mill authenticity with serial-numbered selvedge
                stamp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
