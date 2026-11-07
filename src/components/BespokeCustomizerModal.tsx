import React, { useState } from 'react';
import { SuitProduct, FabricOption, LapelType, ButtonStance, FitSilhouette, VentType, CustomBespokeConfig, CurrencyCode } from '../types/suit';
import { LUXURY_FABRICS } from '../data/suitCatalog';
import { ThreeMannequinViewer } from './ThreeMannequinViewer';
import { FabricSwatchCard } from './FabricSwatchCard';
import { FabricTextureModal } from './FabricTextureModal';
import { formatPrice, calculateSuitTotal } from '../utils/pricing';
import { X, Upload, Check, Camera, Sparkles, RefreshCw, Layers, ShieldCheck, ChevronRight, ZoomIn } from 'lucide-react';

interface BespokeCustomizerModalProps {
  suit: SuitProduct;
  currentCurrency: CurrencyCode;
  onClose: () => void;
  onAddToCart: (config: CustomBespokeConfig) => void;
  onOpenMeasurements: () => void;
}

export const BespokeCustomizerModal: React.FC<BespokeCustomizerModalProps> = ({
  suit,
  currentCurrency,
  onClose,
  onAddToCart,
  onOpenMeasurements,
}) => {
  const [selectedFabric, setSelectedFabric] = useState<FabricOption>(
    LUXURY_FABRICS.find((f) => f.id === suit.fabricDefault) || LUXURY_FABRICS[0]
  );
  const [lapel, setLapel] = useState<LapelType>(suit.lapelDefault);
  const [buttonStance, setButtonStance] = useState<ButtonStance>(suit.buttonDefault);
  const [silhouette, setSilhouette] = useState<FitSilhouette>(suit.silhouetteDefault);
  const [vents, setVents] = useState<VentType>('side-vents');
  const [monogram, setMonogram] = useState('AO');
  const [monogramColor, setMonogramColor] = useState<'champagne-gold' | 'silver-titanium' | 'midnight-navy' | 'burgundy'>('champagne-gold');
  const [activeTab, setActiveTab] = useState<'3d-mannequin' | 'photo-tryon'>('3d-mannequin');
  const [userUploadedPhoto, setUserUploadedPhoto] = useState<string | null>(null);
  const [isTextureModalOpen, setIsTextureModalOpen] = useState(false);

  // Live total price
  const totalPriceUsd = calculateSuitTotal(
    suit.basePriceUsd,
    selectedFabric.extraCostUsd,
    monogram.trim().length > 0,
    buttonStance
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserUploadedPhoto(event.target.result as string);
          setActiveTab('photo-tryon');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmCommission = () => {
    const config: CustomBespokeConfig = {
      suitId: suit.id,
      suitName: suit.name,
      gender: suit.gender,
      fabric: selectedFabric,
      lapel,
      buttons: buttonStance,
      vents,
      silhouette,
      monogramText: monogram,
      monogramColor,
      liningColor: '#121216',
      trouserPleats: 'flat-front',
      waistAdjusters: 'side-tabs-brass',
      userPhotoUrl: userUploadedPhoto || undefined,
      totalPriceUsd,
    };
    onAddToCart(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#0D0D11] border border-[#272730] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-[#222228] flex items-center justify-between bg-[#111116] shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880]" />
            <div>
              <h2 className="text-lg font-serif text-[#F3F4F6] leading-tight">
                {suit.name} · Bespoke Configuration
              </h2>
              <p className="text-xs text-[#9CA3AF]">
                3D Fitting Trial & Master Cutter Drape Synthesis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider block">Commission Total</span>
              <span className="text-lg font-semibold font-mono text-[#F3F4F6] tabular-nums">
                {formatPrice(totalPriceUsd, currentCurrency)}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1C1C24] rounded-lg transition-colors"
              aria-label="Close customizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body (Split 2-column on desktop: 3D/Photo viewer left, options right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: 3D Mannequin or Photo Try-On */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-[#222228] flex flex-col justify-between bg-[#0A0A0C]">
            {/* View Switcher: 3D Studio vs Photo Upload Try-On */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 bg-[#141418] p-1 rounded-lg border border-[#272730]">
                <button
                  type="button"
                  onClick={() => setActiveTab('3d-mannequin')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    activeTab === '3d-mannequin'
                      ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  3D Interactive Mannequin
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('photo-tryon')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    activeTab === 'photo-tryon'
                      ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  Virtual Try-On (Photo Upload)
                </button>
              </div>

              <button
                type="button"
                onClick={onOpenMeasurements}
                className="text-xs text-[#C5A880] hover:underline flex items-center gap-1"
              >
                <span>AI Measurement Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Viewer Render Surface */}
            <div className="flex-1 min-h-[460px] flex items-center justify-center">
              {activeTab === '3d-mannequin' ? (
                <ThreeMannequinViewer
                  fabric={selectedFabric}
                  lapel={lapel}
                  buttonStance={buttonStance}
                  monogramText={monogram}
                />
              ) : (
                <div className="w-full h-full min-h-[460px] bg-[#0E0E12] border border-[#272730] rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  {userUploadedPhoto ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <div className="relative max-w-sm rounded-lg overflow-hidden border border-[#C5A880]/50 shadow-2xl">
                        <img
                          src={userUploadedPhoto}
                          alt="Virtual fitting trial client pose"
                          className="max-h-[360px] w-auto object-contain mx-auto"
                        />
                        {/* Master tailor fit contour overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                          <div className="text-left">
                            <span className="text-[11px] text-[#C5A880] uppercase tracking-wider block font-semibold">
                              Tailor Drape Overlay Active
                            </span>
                            <span className="text-xs text-white">
                              {selectedFabric.name} · {lapel} lapel drape synthesized
                            </span>
                          </div>
                        </div>
                      </div>

                      <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A22] hover:bg-[#252530] text-[#D1D5DB] text-xs font-medium rounded-lg border border-[#2D2D38] cursor-pointer transition-colors">
                        <Camera className="w-4 h-4 text-[#C5A880]" />
                        <span>Upload Different Pose</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="max-w-md flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#181822] border border-[#C5A880]/30 flex items-center justify-center mb-4">
                        <Upload className="w-7 h-7 text-[#C5A880]" />
                      </div>
                      <h4 className="text-lg font-serif text-[#F3F4F6] mb-2">
                        Upload Your Silhouette for Virtual Trial
                      </h4>
                      <p className="text-xs text-[#9CA3AF] mb-6 leading-relaxed">
                        Upload a front or three-quarters photo. Our atelier vision system overlays the structured jacket shoulders, chest canvas, and lapel proportions onto your posture.
                      </p>

                      <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A880] hover:bg-[#D4AF37] text-[#0A0A0C] text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-lg">
                        <Camera className="w-4 h-4" />
                        <span>Select Photo from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-[#9CA3AF] mt-3">
                        Encrypted & processed locally in memory. Never shared.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drape Specifications Footnote */}
            <div className="mt-4 pt-3 border-t border-[#1C1C24] flex items-center justify-between text-xs text-[#9CA3AF]">
              <span>Cloth: {selectedFabric.mill}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTextureModalOpen(true)}
                  className="text-[#C5A880] hover:text-[#E5D5B8] inline-flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Macro Weave Texture</span>
                </button>
                <span className="font-mono">{selectedFabric.weightGsm} GSM Worsted</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-5 p-6 overflow-y-auto space-y-6 bg-[#0E0E12]">
            {/* 1. Fabric Selection with 3D Hover & Drape Preview */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs uppercase tracking-widest text-[#E5E7EB] font-semibold block">
                  1. Heritage Cloth & 3D Drape
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTextureModalOpen(true)}
                    className="text-xs text-[#C5A880] hover:text-[#E5D5B8] flex items-center gap-1.5 font-medium cursor-pointer underline-offset-4 hover:underline"
                    aria-label="View Fabric Texture in Macro Loupe"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>View Fabric Texture</span>
                  </button>
                  <span className="text-xs text-[#9CA3AF] font-mono">
                    {selectedFabric.weightGsm} GSM
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#9CA3AF] mb-3">
                Hover or tap to reveal 3D texture depth, tactile hand-feel, and natural drape cascade.
              </p>
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {LUXURY_FABRICS.map((fabric) => (
                  <FabricSwatchCard
                    key={fabric.id}
                    fabric={fabric}
                    isSelected={selectedFabric.id === fabric.id}
                    onSelect={(f) => setSelectedFabric(f)}
                    currentCurrency={currentCurrency}
                    onViewTexture={(f) => {
                      setSelectedFabric(f);
                      setIsTextureModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 2. Lapel Style */}
            <div>
              <label className="text-xs uppercase tracking-widest text-[#E5E7EB] font-semibold block mb-3">
                2. Lapel Geometry
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'peak', label: 'Peak Lapel', sub: 'Sovereign & Broad' },
                  { id: 'notch', label: 'Notch Lapel', sub: 'Classic Executive' },
                  { id: 'shawl', label: 'Shawl Collar', sub: 'Gala Black Tie' },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLapel(l.id as LapelType)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      lapel === l.id
                        ? 'border-[#C5A880] bg-[#1A1A22] text-[#F3F4F6]'
                        : 'border-[#22222A] bg-[#121216] text-[#9CA3AF] hover:text-[#F3F4F6]'
                    }`}
                  >
                    <div className="text-xs font-semibold">{l.label}</div>
                    <div className="text-[10px] text-[#9CA3AF] mt-0.5">{l.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Button Stance */}
            <div>
              <label className="text-xs uppercase tracking-widest text-[#E5E7EB] font-semibold block mb-3">
                3. Button Stance & Construction
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '1-button', label: '1-Button Single', note: 'Evening Tuxedo Cut' },
                  { id: '2-button', label: '2-Button Single', note: 'Executive Standard' },
                  { id: '4x2-double-breasted', label: '4x2 Double Breasted', note: 'Modern Continental' },
                  { id: '6x2-double-breasted', label: '6x2 Double Breasted', note: 'Savile Row Power' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setButtonStance(btn.id as ButtonStance)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      buttonStance === btn.id
                        ? 'border-[#C5A880] bg-[#1A1A22] text-[#F3F4F6]'
                        : 'border-[#22222A] bg-[#121216] text-[#9CA3AF] hover:text-[#F3F4F6]'
                    }`}
                  >
                    <div className="text-xs font-semibold">{btn.label}</div>
                    <div className="text-[10px] text-[#9CA3AF]">{btn.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Fit Silhouette & Vents */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-[#E5E7EB] font-semibold block mb-2">
                  4. Shoulder & Silhouette
                </label>
                <select
                  value={silhouette}
                  onChange={(e) => setSilhouette(e.target.value as FitSilhouette)}
                  aria-label="Shoulder & Silhouette"
                  className="w-full bg-[#141418] border border-[#272730] text-[#E5E7EB] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="savile-row-structured">Savile Row (Structured Roped)</option>
                  <option value="milanese-soft">Milanese (Soft Spalla Camicia)</option>
                  <option value="neapolitan-unstructured">Neapolitan (Light Unstructured)</option>
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[#E5E7EB] font-semibold block mb-2">
                  Jacket Vents
                </label>
                <select
                  value={vents}
                  onChange={(e) => setVents(e.target.value as VentType)}
                  aria-label="Jacket Vents"
                  className="w-full bg-[#141418] border border-[#272730] text-[#E5E7EB] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="side-vents">Dual Side Vents (British Drape)</option>
                  <option value="center-vent">Center Hook Vent (Classic)</option>
                  <option value="ventless">Ventless (Pure Formal Black-Tie)</option>
                </select>
              </div>
            </div>

            {/* 5. Custom Monogram Embroidery */}
            <div className="pt-2 border-t border-[#1C1C24]">
              <label className="text-xs uppercase tracking-widest text-[#E5E7EB] font-semibold block mb-2">
                5. Inner Silk Lining Monogram (Complimentary)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={monogram}
                  onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                  placeholder="e.g. A.S."
                  aria-label="Monogram Initials"
                  className="w-28 bg-[#141418] border border-[#272730] text-[#F3F4F6] text-xs p-2.5 rounded-lg font-serif tracking-widest focus:outline-none focus:border-[#C5A880]"
                />
                <select
                  value={monogramColor}
                  onChange={(e) => setMonogramColor(e.target.value as any)}
                  aria-label="Monogram Thread Color"
                  className="flex-1 bg-[#141418] border border-[#272730] text-[#E5E7EB] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="champagne-gold">24K Champagne Gold Thread</option>
                  <option value="silver-titanium">Brushed Titanium Silver</option>
                  <option value="midnight-navy">Midnight Obsidian Silk</option>
                  <option value="burgundy">Imperial Burgundy</option>
                </select>
              </div>
            </div>

            {/* Commission Final Confirmation Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleConfirmCommission}
                className="w-full py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0A0C] bg-[#C5A880] hover:bg-[#D4AF37] rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Commission & Add to Wardrobe Bag</span>
                <span className="font-mono font-bold">· {formatPrice(totalPriceUsd, currentCurrency)}</span>
              </button>
            </div>
          </div>
        </div>

        {/* High-Resolution Macro Weave Fabric Texture Modal */}
        <FabricTextureModal
          isOpen={isTextureModalOpen}
          onClose={() => setIsTextureModalOpen(false)}
          selectedFabric={selectedFabric}
          onSelectFabric={(newFabric) => setSelectedFabric(newFabric)}
          currentCurrency={currentCurrency}
        />
      </div>
    </div>
  );
};
