import React, { useState, useRef } from 'react';
import { FabricOption, CurrencyCode } from '../types/suit';
import { formatPrice } from '../utils/pricing';
import { Sparkles, Eye, Info, Check, Move, ZoomIn } from 'lucide-react';
import { ThreeFabricDrapeViewer } from './ThreeFabricDrapeViewer';

interface FabricSwatchCardProps {
  fabric: FabricOption;
  isSelected: boolean;
  onSelect: (fabric: FabricOption) => void;
  currentCurrency: CurrencyCode;
  onInspectDrape?: (fabric: FabricOption) => void;
  onViewTexture?: (fabric: FabricOption) => void;
}

export const FabricSwatchCard: React.FC<FabricSwatchCardProps> = ({
  fabric,
  isSelected,
  onSelect,
  currentCurrency,
  onInspectDrape,
  onViewTexture,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glossX, setGlossX] = useState(50);
  const [glossY, setGlossY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetailedDrape, setShowDetailedDrape] = useState(false);

  // 3D tilt perspective calculation on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12; // tilt degrees
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlossX((x / rect.width) * 100);
    setGlossY((y / rect.height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="relative group">
      {/* 3D-Tilt Interactive Swatch Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(fabric)}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`relative p-3.5 rounded-xl border text-left cursor-pointer select-none transition-all duration-300 overflow-hidden ${
          isSelected
            ? 'border-[#C5A880] bg-[#1A1A22] shadow-2xl ring-1 ring-[#C5A880]/30'
            : 'border-[#22222A] bg-[#121216] hover:border-[#C5A880]/40'
        }`}
      >
        {/* Dynamic 3D Gloss / Sheen Highlight Layer */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none opacity-25 transition-opacity"
            style={{
              background: `radial-gradient(circle at ${glossX}% ${glossY}%, rgba(229, 213, 184, 0.45) 0%, transparent 60%)`,
            }}
          />
        )}

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3">
            {/* Color Swatch Orb with tactile border */}
            <div className="relative mt-0.5">
              <span
                className="w-7 h-7 rounded-full border-2 border-white/20 shrink-0 block shadow-md"
                style={{ backgroundColor: fabric.colorHex }}
              />
              {isSelected && (
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#C5A880] rounded-full flex items-center justify-center text-[#0A0A0C]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-semibold text-[#F3F4F6] flex items-center gap-1.5">
                <span>{fabric.name}</span>
              </div>
              <div className="text-[11px] text-[#C5A880] mt-0.5 font-medium">
                {fabric.mill.split(',')[0]}
              </div>
              <div className="text-[10px] text-[#9CA3AF] mt-0.5 line-clamp-1">
                {fabric.composition}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-mono text-[#C5A880] font-semibold tabular-nums block">
              {fabric.extraCostUsd === 0 ? 'Included' : `+${formatPrice(fabric.extraCostUsd, currentCurrency)}`}
            </span>
            <span className="text-[10px] text-[#9CA3AF] font-mono">
              {fabric.weightGsm} GSM
            </span>
          </div>
        </div>

        {/* Drape and Tactile Quick Spec Strip */}
        <div className="mt-3 pt-2.5 border-t border-[#1F1F27] flex items-center justify-between text-[11px] text-[#9CA3AF]">
          <span className="truncate max-w-[170px]">{fabric.drapeProfile.split('·')[0]}</span>
          <div className="flex items-center gap-2.5 shrink-0">
            {onViewTexture && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTexture(fabric);
                }}
                className="text-[10px] text-[#C5A880] hover:text-[#E5D5B8] flex items-center gap-1 underline-offset-2 hover:underline cursor-pointer"
                aria-label={`View ${fabric.name} macro weave texture`}
              >
                <ZoomIn className="w-3 h-3" />
                <span>Macro Weave</span>
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailedDrape(!showDetailedDrape);
                if (onInspectDrape) onInspectDrape(fabric);
              }}
              className="text-[10px] text-[#C5A880] hover:text-[#E5D5B8] flex items-center gap-1 underline-offset-2 hover:underline cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>{showDetailedDrape ? 'Hide Drape' : '3D Drape'}</span>
            </button>
          </div>
        </div>

        {/* Inline 3D Fabric Drape Simulation (when toggled or on expanded inspection) */}
        {showDetailedDrape && (
          <div className="mt-3 pt-3 border-t border-[#272732] animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <ThreeFabricDrapeViewer fabric={fabric} isHovered={true} />
            <p className="text-[11px] text-[#9CA3AF] mt-2 italic leading-relaxed">
              &ldquo;{fabric.tactileFeel}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* 3D Hover Tooltip Preview on Desktop Hover (when not inline-expanded) */}
      {isHovered && !showDetailedDrape && (
        <div className="hidden lg:block absolute left-full top-0 ml-3 z-40 w-72 bg-[#0E0E12] border border-[#C5A880]/50 rounded-xl p-4 shadow-2xl backdrop-blur-md pointer-events-none animate-fade-in">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] mb-1">
            Tactile Drape Analysis
          </div>
          <h4 className="text-xs font-serif text-[#F3F4F6] font-semibold mb-1">
            {fabric.name}
          </h4>
          <p className="text-[11px] text-[#9CA3AF] mb-3 leading-relaxed">
            {fabric.tactileFeel}
          </p>

          <div className="space-y-1.5 text-[10px] border-t border-[#22222A] pt-2">
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Fiber Fineness:</span>
              <span className="text-[#E5E7EB] font-mono">{fabric.yarnMicron || 'Superfine'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Drape Profile:</span>
              <span className="text-[#E5E7EB]">{fabric.drapeProfile.split('·')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Luster Grade:</span>
              <span className="text-[#C5A880]">{fabric.lusterGrade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Seasonality:</span>
              <span className="text-[#E5E7EB]">{fabric.seasonality}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
