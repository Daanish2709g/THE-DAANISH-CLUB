import React, { useState } from 'react';
import { SuitProduct, FabricOption, LapelType, ButtonStance, FitSilhouette, CustomBespokeConfig, CurrencyCode } from '../types/suit';
import { SUIT_CATALOG, LUXURY_FABRICS } from '../data/suitCatalog';
import { ThreeMannequinViewer } from './ThreeMannequinViewer';
import { FabricSwatchCard } from './FabricSwatchCard';
import { FabricTextureModal } from './FabricTextureModal';
import { formatPrice, calculateSuitTotal } from '../utils/pricing';
import { Sparkles, ArrowRight, Camera, Upload, Sliders, Check, ZoomIn } from 'lucide-react';

interface InteractiveStudioSectionProps {
  currentCurrency: CurrencyCode;
  onAddToCart: (config: CustomBespokeConfig) => void;
  onOpenMeasurements: () => void;
  onOpenConsultation: () => void;
}

export const InteractiveStudioSection: React.FC<InteractiveStudioSectionProps> = ({
  currentCurrency,
  onAddToCart,
  onOpenMeasurements,
  onOpenConsultation,
}) => {
  const [activeSuit, setActiveSuit] = useState<SuitProduct>(SUIT_CATALOG[0]);
  const [selectedFabric, setSelectedFabric] = useState<FabricOption>(LUXURY_FABRICS[0]);
  const [lapel, setLapel] = useState<LapelType>('peak');
  const [buttonStance, setButtonStance] = useState<ButtonStance>('1-button');
  const [monogram, setMonogram] = useState('AO');
  const [silhouette, setSilhouette] = useState<FitSilhouette>('savile-row-structured');
  const [viewMode, setViewMode] = useState<'3d' | 'upload'>('3d');
  const [uploadedUserImage, setUploadedUserImage] = useState<string | null>(null);
  const [isTextureModalOpen, setIsTextureModalOpen] = useState(false);

  const totalPriceUsd = calculateSuitTotal(
    activeSuit.basePriceUsd,
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
          setUploadedUserImage(event.target.result as string);
          setViewMode('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCommission = () => {
    const config: CustomBespokeConfig = {
      suitId: activeSuit.id,
      suitName: activeSuit.name,
      gender: activeSuit.gender,
      fabric: selectedFabric,
      lapel,
      buttons: buttonStance,
      vents: 'side-vents',
      silhouette,
      monogramText: monogram,
      monogramColor: 'champagne-gold',
      liningColor: '#121216',
      trouserPleats: 'flat-front',
      waistAdjusters: 'side-tabs-brass',
      userPhotoUrl: uploadedUserImage || undefined,
      totalPriceUsd,
    };
    onAddToCart(config);
  };

  return (
    <section id="3d-studio" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#222228]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#C5A880] mb-2 font-semibold">
            03 / Proprietary Fitting · The Daanish Club
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F9FAFB] tracking-tight">
            The 3D Atelier & Virtual Trial
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMeasurements}
            className="text-xs text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Launch AI Biometric Scanner →</span>
          </button>
        </div>
      </div>

      {/* Main Studio Frame (Split 12-col grid) */}
      <div className="bg-[#0E0E12] border border-[#272730] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: 3D Interactive Mannequin or Photo Fitting (7 cols) */}
        <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-[#222228] flex flex-col justify-between bg-[#0A0A0C]">
          {/* Top Mode Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 bg-[#141418] p-1 rounded-lg border border-[#272730]">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  viewMode === '3d'
                    ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                3D Mannequin Trial
              </button>
              <button
                type="button"
                onClick={() => setViewMode('upload')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  viewMode === 'upload'
                    ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                Photo Upload Fitting
              </button>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider block">Real-time Estimate</span>
              <span className="text-sm font-semibold font-mono text-[#F3F4F6] tabular-nums">
                {formatPrice(totalPriceUsd, currentCurrency)}
              </span>
            </div>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="flex-1 min-h-[460px] flex items-center justify-center">
            {viewMode === '3d' ? (
              <ThreeMannequinViewer
                fabric={selectedFabric}
                lapel={lapel}
                buttonStance={buttonStance}
                monogramText={monogram}
              />
            ) : (
              <div className="w-full h-full min-h-[460px] bg-[#111116] border border-[#272730] rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {uploadedUserImage ? (
                  <div className="relative max-w-sm rounded-lg overflow-hidden border border-[#C5A880]/60 shadow-2xl">
                    <img
                      src={uploadedUserImage}
                      alt="Client silhouette fit overlay"
                      className="max-h-[360px] w-auto object-contain mx-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <div className="text-left">
                        <span className="text-[11px] text-[#C5A880] uppercase tracking-wider font-semibold block">
                          Atelier Drape Synthesized
                        </span>
                        <p className="text-xs text-white">
                          Fitted with {selectedFabric.name} and {lapel} lapels
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-[#181822] border border-[#C5A880]/30 flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-[#C5A880]" />
                    </div>
                    <h3 className="text-base font-serif text-[#F3F4F6] mb-1">
                      Upload Your Photo for Virtual Fitting
                    </h3>
                    <p className="text-xs text-[#9CA3AF] mb-5 leading-relaxed">
                      Upload a clear portrait or standing silhouette. Our drape engine maps the tailored jacket canvas and shoulders directly over your posture.
                    </p>
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] hover:bg-[#D4AF37] text-[#0A0A0C] text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-lg">
                      <Camera className="w-4 h-4" />
                      <span>Select Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Base Suit Picker */}
          <div className="mt-4 pt-4 border-t border-[#1C1C24] flex items-center justify-between gap-4 overflow-x-auto">
            <span className="text-xs text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">Model:</span>
            <div className="flex items-center gap-2">
              {SUIT_CATALOG.slice(0, 4).map((suit) => (
                <button
                  key={suit.id}
                  type="button"
                  onClick={() => {
                    setActiveSuit(suit);
                    setLapel(suit.lapelDefault);
                    setButtonStance(suit.buttonDefault);
                  }}
                  className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                    activeSuit.id === suit.id
                      ? 'bg-[#2B2B36] text-[#F3F4F6] font-medium border border-[#C5A880]/60'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6] bg-[#141418]'
                  }`}
                >
                  {suit.name.replace('The ', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customizer Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 space-y-6 bg-[#0E0E12] flex flex-col justify-between">
          <div className="space-y-6">
            {/* Fabric Selection with 3D Hover & Drape Preview */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs uppercase tracking-widest text-[#E5E7EB] font-semibold">
                  1. Cloth Commission & 3D Drape
                </span>
                <button
                  type="button"
                  onClick={() => setIsTextureModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] text-[#C5A880] hover:text-[#F3F4F6] bg-[#1A1A22] hover:bg-[#252532] border border-[#C5A880]/30 transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-3 h-3 text-[#C5A880]" />
                  <span>Macro Loupe</span>
                </button>
              </div>
              <p className="text-[11px] text-[#9CA3AF] mb-3">
                Hover or tap to reveal 3D texture depth, tactile hand-feel, and natural drape cascade.
              </p>
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {LUXURY_FABRICS.map((f) => (
                  <FabricSwatchCard
                    key={f.id}
                    fabric={f}
                    isSelected={selectedFabric.id === f.id}
                    onSelect={(chosen) => setSelectedFabric(chosen)}
                    onViewTexture={(chosen) => {
                      setSelectedFabric(chosen);
                      setIsTextureModalOpen(true);
                    }}
                    currentCurrency={currentCurrency}
                  />
                ))}
              </div>
            </div>

            {/* Lapel Geometry */}
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E5E7EB] font-semibold block mb-2">
                2. Lapel Architecture
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'peak', label: 'Peak Lapel' },
                  { id: 'notch', label: 'Notch Lapel' },
                  { id: 'shawl', label: 'Shawl Collar' },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLapel(l.id as LapelType)}
                    className={`py-2 px-1 text-xs text-center rounded-lg border transition-all ${
                      lapel === l.id
                        ? 'border-[#C5A880] bg-[#1A1A22] text-[#F3F4F6] font-medium'
                        : 'border-[#22222A] bg-[#121216] text-[#9CA3AF] hover:text-[#F3F4F6]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Button Stance */}
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E5E7EB] font-semibold block mb-2">
                3. Button Construction
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '1-button', label: '1-Button Single' },
                  { id: '2-button', label: '2-Button Single' },
                  { id: '4x2-double-breasted', label: '4x2 Double Breasted' },
                  { id: '6x2-double-breasted', label: '6x2 Double Breasted' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setButtonStance(btn.id as ButtonStance)}
                    className={`py-2 px-2 text-xs text-left rounded-lg border transition-all ${
                      buttonStance === btn.id
                        ? 'border-[#C5A880] bg-[#1A1A22] text-[#F3F4F6] font-medium'
                        : 'border-[#22222A] bg-[#121216] text-[#9CA3AF] hover:text-[#F3F4F6]'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Monogram Input */}
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E5E7EB] font-semibold block mb-1.5">
                4. Silk Inner Monogram
              </span>
              <input
                type="text"
                maxLength={6}
                value={monogram}
                onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                placeholder="e.g. A.S."
                aria-label="Monogram"
                className="w-full bg-[#141418] border border-[#272730] text-[#F3F4F6] text-xs p-2.5 rounded-lg font-serif tracking-widest focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          {/* Action Commission Button */}
          <div className="pt-4 space-y-3">
            <button
              type="button"
              onClick={handleCommission}
              className="w-full py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0A0C] bg-[#C5A880] hover:bg-[#D4AF37] rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Add Custom Commission to Wardrobe</span>
              <span className="font-mono font-bold">· {formatPrice(totalPriceUsd, currentCurrency)}</span>
            </button>

            <button
              type="button"
              onClick={onOpenConsultation}
              className="w-full py-2.5 text-xs font-medium uppercase tracking-wider text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors text-center"
            >
              Need styling guidance? Book Master Tailor Session
            </button>
          </div>
        </div>
      </div>

      <FabricTextureModal
        isOpen={isTextureModalOpen}
        onClose={() => setIsTextureModalOpen(false)}
        selectedFabric={selectedFabric}
        onSelectFabric={(f) => setSelectedFabric(f)}
        currentCurrency={currentCurrency}
      />
    </section>
  );
};
