import React, { useState } from 'react';
import { BespokeMeasurements } from '../types/suit';
import { calculateDropClassification, calculatePostureAdjustments, estimateBespokePattern } from '../utils/measurements';
import { Camera, Sparkles, Sliders, CheckCircle2, Ruler, Shield, RefreshCw, FileText } from 'lucide-react';

interface AiMeasurementStudioProps {
  onApplyMeasurements: (measurements: BespokeMeasurements) => void;
  savedMeasurements?: BespokeMeasurements;
}

export const AiMeasurementStudio: React.FC<AiMeasurementStudioProps> = ({
  onApplyMeasurements,
  savedMeasurements,
}) => {
  const [heightCm, setHeightCm] = useState(savedMeasurements?.heightCm || 182);
  const [weightKg, setWeightKg] = useState(savedMeasurements?.weightKg || 78);
  const [chestCm, setChestCm] = useState(savedMeasurements?.chestCircumferenceCm || 102);
  const [waistCm, setWaistCm] = useState(savedMeasurements?.waistCircumferenceCm || 86);
  const [posturePitch, setPosturePitch] = useState<'erect' | 'neutral' | 'forward-leaning'>(
    savedMeasurements?.posturePitch || 'neutral'
  );
  const [shoulderSlope, setShoulderSlope] = useState<'regular' | 'sloped' | 'square'>(
    savedMeasurements?.shoulderSlope || 'regular'
  );
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);

  // Derived tailoring calculations
  const baseline = estimateBespokePattern(heightCm, weightKg, chestCm, waistCm);
  const postureReport = calculatePostureAdjustments(posturePitch, shoulderSlope);
  const { dropInches, classification } = calculateDropClassification(chestCm, waistCm);

  const activeMeasurements: BespokeMeasurements = {
    ...baseline,
    posturePitch,
    shoulderSlope,
    dropClassification: classification,
    notes: `${postureReport.tailorRecommendation} ${postureReport.scyeDepthNote}`,
  };

  const handleSimulatedImageScan = (e: React.ChangeEvent<HTMLInputElement>, pose: 'front' | 'profile') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (pose === 'front') setFrontImagePreview(event.target.result as string);
          if (pose === 'profile') setProfileImagePreview(event.target.result as string);

          // Trigger simulated AI vision calibration
          setIsScanning(true);
          setTimeout(() => {
            setIsScanning(false);
            setScanCompleted(true);
          }, 900);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToProfile = () => {
    onApplyMeasurements(activeMeasurements);
    setScanCompleted(true);
  };

  return (
    <section id="ai-measurements" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#222228]">
      {/* Section Header */}
      <div className="max-w-3xl mb-12">
        <div className="text-xs uppercase tracking-[0.25em] text-[#C5A880] mb-2 font-semibold">
          04 / Biometric Pattern Studio · The Daanish Club
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F9FAFB] tracking-tight mb-3">
          AI Biometric & Drape Analysis
        </h2>
        <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
          Calibrate posture pitch, chest drop, and shoulder slope into an exact bespoke pattern.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Silhouette Uploaders & Calibrators (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dual Pose Scanner Card */}
          <div className="bg-[#111116] border border-[#24242C] rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F3F4F6] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#C5A880]" />
                <span>Upload Stance for Computer Vision Fit</span>
              </h3>
              {isScanning && (
                <span className="text-xs text-[#C5A880] flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing posture vectors...</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Front Silhouette Upload */}
              <div className="relative border border-dashed border-[#2E2E38] rounded-lg p-5 flex flex-col items-center justify-center text-center bg-[#0C0C10] hover:border-[#C5A880]/50 transition-colors">
                {frontImagePreview ? (
                  <div className="relative w-full aspect-[3/4] max-h-48 rounded overflow-hidden">
                    <img
                      src={frontImagePreview}
                      alt="Front stance scan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-[11px] font-semibold text-white bg-black/70 px-2 py-1 rounded">
                        Front Pose Calibrated
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-[#9CA3AF] mb-2" />
                    <p className="text-xs font-medium text-[#E5E7EB]">Front Stance Photo</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-1 mb-3">Shoulders squared, arms at side</p>
                    <label className="px-3 py-1.5 bg-[#181822] hover:bg-[#22222E] text-[#D1D5DB] text-xs font-medium rounded border border-[#2B2B36] cursor-pointer transition-colors">
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSimulatedImageScan(e, 'front')}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>

              {/* Profile Posture Upload */}
              <div className="relative border border-dashed border-[#2E2E38] rounded-lg p-5 flex flex-col items-center justify-center text-center bg-[#0C0C10] hover:border-[#C5A880]/50 transition-colors">
                {profileImagePreview ? (
                  <div className="relative w-full aspect-[3/4] max-h-48 rounded overflow-hidden">
                    <img
                      src={profileImagePreview}
                      alt="Profile stance scan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-[11px] font-semibold text-white bg-black/70 px-2 py-1 rounded">
                        Profile Pitch Calibrated
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Ruler className="w-8 h-8 text-[#9CA3AF] mb-2" />
                    <p className="text-xs font-medium text-[#E5E7EB]">Side Profile Stance</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-1 mb-3">Natural spine posture angle</p>
                    <label className="px-3 py-1.5 bg-[#181822] hover:bg-[#22222E] text-[#D1D5DB] text-xs font-medium rounded border border-[#2B2B36] cursor-pointer transition-colors">
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSimulatedImageScan(e, 'profile')}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Precision Biometric Sliders */}
          <div className="bg-[#111116] border border-[#24242C] rounded-xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F3F4F6] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C5A880]" />
              <span>Biometric Calibrations</span>
            </h3>

            {/* Height & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-[#9CA3AF] mb-1.5">
                  <span>Height</span>
                  <span className="text-[#F3F4F6] font-mono font-medium">{heightCm} cm ({Math.floor(heightCm / 30.48)}&apos;{Math.round((heightCm % 30.48) / 2.54)}&quot;)</span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={210}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  aria-label="Height in centimeters"
                  className="w-full accent-[#C5A880] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#9CA3AF] mb-1.5">
                  <span>Weight</span>
                  <span className="text-[#F3F4F6] font-mono font-medium">{weightKg} kg ({Math.round(weightKg * 2.205)} lbs)</span>
                </div>
                <input
                  type="range"
                  min={45}
                  max={130}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  aria-label="Weight in kilograms"
                  className="w-full accent-[#C5A880] cursor-pointer"
                />
              </div>
            </div>

            {/* Chest & Waist Circumference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-[#9CA3AF] mb-1.5">
                  <span>Chest Circumference</span>
                  <span className="text-[#F3F4F6] font-mono font-medium">{chestCm} cm ({(chestCm / 2.54).toFixed(1)}&quot;)</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={140}
                  value={chestCm}
                  onChange={(e) => setChestCm(Number(e.target.value))}
                  aria-label="Chest circumference in centimeters"
                  className="w-full accent-[#C5A880] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#9CA3AF] mb-1.5">
                  <span>Natural Waist Circumference</span>
                  <span className="text-[#F3F4F6] font-mono font-medium">{waistCm} cm ({(waistCm / 2.54).toFixed(1)}&quot;)</span>
                </div>
                <input
                  type="range"
                  min={65}
                  max={130}
                  value={waistCm}
                  onChange={(e) => setWaistCm(Number(e.target.value))}
                  aria-label="Waist circumference in centimeters"
                  className="w-full accent-[#C5A880] cursor-pointer"
                />
              </div>
            </div>

            {/* Posture Pitch & Shoulder Slope Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1E1E26]">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#9CA3AF] block mb-2 font-medium">
                  Spine & Posture Pitch
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['erect', 'neutral', 'forward-leaning'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPosturePitch(p)}
                      className={`py-2 px-2 text-[11px] font-medium rounded capitalize text-center transition-colors ${
                        posturePitch === p
                          ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold'
                          : 'bg-[#181820] text-[#9CA3AF] hover:text-[#F3F4F6]'
                      }`}
                    >
                      {p.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#9CA3AF] block mb-2 font-medium">
                  Shoulder Slope Contour
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['regular', 'sloped', 'square'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShoulderSlope(s)}
                      className={`py-2 px-2 text-[11px] font-medium rounded capitalize text-center transition-colors ${
                        shoulderSlope === s
                          ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold'
                          : 'bg-[#181820] text-[#9CA3AF] hover:text-[#F3F4F6]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Master Cutter Output Blueprint (5 cols) */}
        <div className="lg:col-span-5 bg-[#14141A] border border-[#272730] rounded-xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#22222A] pb-4">
            <div>
              <span className="text-[11px] text-[#C5A880] uppercase tracking-widest block font-medium">
                Atelier Pattern Blueprint
              </span>
              <h3 className="text-lg font-serif text-[#F3F4F6]">
                {classification}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#9CA3AF] block">Drop Factor</span>
              <span className="text-lg font-mono font-bold text-[#F3F4F6]">Drop {dropInches}</span>
            </div>
          </div>

          {/* Key Tailoring Measurements Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#0D0D12] p-3 rounded-lg border border-[#22222A]">
              <span className="text-[#9CA3AF] block text-[11px]">Jacket Length (Knuckle)</span>
              <span className="text-base font-mono font-semibold text-[#F3F4F6]">{baseline.jacketLengthCm} cm</span>
            </div>
            <div className="bg-[#0D0D12] p-3 rounded-lg border border-[#22222A]">
              <span className="text-[#9CA3AF] block text-[11px]">Shoulder Point-to-Point</span>
              <span className="text-base font-mono font-semibold text-[#F3F4F6]">{baseline.shoulderWidthCm} cm</span>
            </div>
            <div className="bg-[#0D0D12] p-3 rounded-lg border border-[#22222A]">
              <span className="text-[#9CA3AF] block text-[11px]">Sleeve Crown to Cuff</span>
              <span className="text-base font-mono font-semibold text-[#F3F4F6]">{baseline.sleeveLengthCm} cm</span>
            </div>
            <div className="bg-[#0D0D12] p-3 rounded-lg border border-[#22222A]">
              <span className="text-[#9CA3AF] block text-[11px]">Trouser Inseam</span>
              <span className="text-base font-mono font-semibold text-[#F3F4F6]">{baseline.inseamCm} cm</span>
            </div>
          </div>

          {/* Master Cutter Compensation Notes */}
          <div className="bg-[#0D0D12] p-4 rounded-lg border border-[#272732] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A880]">
              <FileText className="w-3.5 h-3.5" />
              <span>Master Cutter Posture Notes</span>
            </div>
            <p className="text-xs text-[#E5E7EB] leading-relaxed">
              {postureReport.tailorRecommendation}
            </p>
            <p className="text-xs text-[#9CA3AF]">
              {postureReport.scyeDepthNote}
            </p>
          </div>

          {/* Apply Button */}
          <button
            type="button"
            onClick={handleSaveToProfile}
            className="w-full py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0A0C] bg-[#C5A880] hover:bg-[#D4AF37] rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Pattern to My Commissions</span>
          </button>

          {scanCompleted && (
            <div className="text-center text-xs text-[#10B981] flex items-center justify-center gap-1.5 font-medium">
              <span>Bespoke biometric blueprint applied to active session.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
