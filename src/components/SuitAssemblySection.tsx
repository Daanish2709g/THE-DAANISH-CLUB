/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Check,
  ArrowRight,
  Compass,
  User,
  Sliders,
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { CurrencyCode } from '../types/suit';
import {
  ASSEMBLY_STEPS,
  calculateAssemblyPhase,
  calculateMouseParallax,
} from '../utils/assembly';

interface SuitAssemblySectionProps {
  currentCurrency: CurrencyCode;
  onCustomizeLook: () => void;
  onExploreCollections: () => void;
}

export const SuitAssemblySection: React.FC<SuitAssemblySectionProps> = ({
  currentCurrency,
  onCustomizeLook,
  onExploreCollections,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isMotionAssembling, setIsMotionAssembling] = useState(false);
  const [viewMode, setViewMode] = useState<'gentleman' | 'gallery'>('gentleman');
  const [mouseTilt, setMouseTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Track scroll position across the extended runway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth scroll progression with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  // Dynamic parallax transformations driven by scroll
  const clientScale = useTransform(smoothProgress, [0, 0.5, 1], [0.96, 1.02, 1.0]);
  const clientY = useTransform(smoothProgress, [0, 1], [-18, 18]);
  const chalkGridOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.75, 0.45, 0.25, 0.1]);

  // Sync scroll progress with active dressing phase unless manual motion assemble is playing
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      if (!isMotionAssembling) {
        const calculatedIndex = calculateAssemblyPhase(latest, ASSEMBLY_STEPS.length);
        setActiveStepIndex(calculatedIndex);
      }
    });
    return () => unsubscribe();
  }, [smoothProgress, isMotionAssembling]);

  // Motion Assemble animation player: progressively dresses the gentleman step by step
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isMotionAssembling) {
      interval = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= ASSEMBLY_STEPS.length - 1) {
            // Once the full suit is assembled on the gentleman, finish gracefully on the master ensemble
            setIsMotionAssembling(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMotionAssembling]);

  // Mouse move handler for interactive 3D perspective tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    const tilt = calculateMouseParallax(x * 2, y * 2, 12);
    setMouseTilt(tilt);
  };

  const handleMouseLeave = () => {
    setMouseTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  const activeStep = ASSEMBLY_STEPS[activeStepIndex];
  const progressPercent = Math.round(((activeStepIndex + 1) / ASSEMBLY_STEPS.length) * 100);

  const startMotionAssemble = () => {
    setActiveStepIndex(0);
    setIsMotionAssembling(true);
    setViewMode('gentleman');
  };

  return (
    <div
      ref={containerRef}
      id="suit-assembly"
      className="relative bg-[#060608] border-b border-[#202028] text-[#F3F4F6]"
    >
      {/* Extended scroll runway for scroll-triggered assembly on the gentleman */}
      <div className="relative min-h-[220vh] lg:min-h-[260vh]">
        {/* Sticky Assembly Viewport Stage */}
        <div className="sticky top-0 h-screen flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          {/* Subtle Ambient Golden Atelier Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[550px] bg-[#C5A880]/7 rounded-full blur-[140px] pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#181822]">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A880] mb-1">
                <span>01 / The Sartorial Drape</span>
                <span className="opacity-40">·</span>
                <span>The Daanish Club</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#F3F4F6] tracking-tight">
                Assembling the Silhouette.
              </h2>
            </div>

            {/* Controls Header: Motion Assemble Trigger & View Mode Switcher */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Motion Assemble Button */}
              <button
                type="button"
                onClick={() => {
                  if (isMotionAssembling) {
                    setIsMotionAssembling(false);
                  } else {
                    startMotionAssemble();
                  }
                }}
                className={`group px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.18em] transition-all flex items-center gap-2 border cursor-pointer ${
                  isMotionAssembling
                    ? 'bg-[#C5A880] text-[#08080A] border-[#D4AF37] shadow-[0_0_20px_rgba(197,168,128,0.4)] animate-pulse'
                    : 'bg-[#14141C] text-[#C5A880] hover:text-[#08080A] hover:bg-[#C5A880] border-[#C5A880]/40'
                }`}
                title="Trigger orchestrated layer-by-layer motion assembly on the gentleman"
              >
                {isMotionAssembling ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Dressing Client ({activeStep.category})...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Motion Assemble</span>
                  </>
                )}
              </button>

              {/* View Mode Switcher: Live Draping on Gentleman vs 6-Stage Gallery */}
              <div className="inline-flex p-1 bg-[#101016] border border-[#20202A] rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('gentleman')}
                  className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'gentleman'
                      ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold shadow'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>Drape on Gentleman</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('gallery')}
                  className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'gallery'
                      ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold shadow'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>6-Stage Sequence</span>
                </button>
              </div>

              {/* Reset to Foundation Shirt */}
              <button
                type="button"
                onClick={() => {
                  setActiveStepIndex(0);
                  setIsMotionAssembling(false);
                }}
                aria-label="Restart assembly on gentleman"
                className="p-2 bg-[#121218] hover:bg-[#1A1A24] border border-[#23232C] text-[#9CA3AF] hover:text-[#C5A880] rounded-lg transition-colors cursor-pointer"
                title="Reset to foundation shirt"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Scrub Bar & Step Markers */}
          <div className="relative z-10 pt-2 pb-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#9CA3AF] mb-2">
              <span className="uppercase tracking-widest text-[#C5A880] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
                Phase {activeStep.stepNumber} of 06 · {activeStep.category} on Gentleman
              </span>
              <span className="tabular-nums font-semibold text-[#F3F4F6]">
                {progressPercent}% Complete · Scroll or scrub to assemble
              </span>
            </div>

            {/* Continuous Progress Bar */}
            <div className="w-full h-1 bg-[#15151E] rounded-full overflow-hidden mb-2.5">
              <div
                className="h-full bg-gradient-to-r from-[#C5A880] via-[#E5D5B8] to-[#D4AF37] transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Quick-Jump Phase Tabs */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {ASSEMBLY_STEPS.map((step, idx) => {
                const isSelected = idx === activeStepIndex;
                const isPassed = idx < activeStepIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      setActiveStepIndex(idx);
                      setIsMotionAssembling(false);
                      setViewMode('gentleman');
                    }}
                    className={`text-left px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C5A880] bg-[#1A1A26] text-[#F3F4F6] shadow-lg ring-1 ring-[#C5A880]/30'
                        : isPassed
                        ? 'border-[#262632] bg-[#101014] text-[#D1D5DB]'
                        : 'border-[#181820] bg-[#0A0A0E] text-[#6B7280] hover:text-[#9CA3AF]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#C5A880] font-bold">
                        {step.stepNumber}
                      </span>
                      {isPassed && <Check className="w-2.5 h-2.5 text-[#C5A880]" />}
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium truncate mt-0.5">
                      {step.category}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* View Mode 1: Live Draping on Gentleman (3D Parallax Stage) */}
          {viewMode === 'gentleman' ? (
            <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-0 my-auto py-2">
              {/* Left 7 Columns: 3D Parallax Gentleman Stage */}
              <div
                className="lg:col-span-7 h-full flex flex-col items-center justify-center relative"
                style={{ perspective: 1200 }}
              >
                <div
                  ref={stageRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={handleMouseLeave}
                  className="relative w-full max-w-[420px] aspect-[3/4] max-h-[58vh] sm:max-h-[62vh] rounded-2xl border border-[#262632] bg-[#0A0A0E] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] cursor-crosshair group transition-transform duration-200"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${mouseTilt.rotateX}deg) rotateY(${mouseTilt.rotateY}deg)`,
                  }}
                >
                  {/* Layer 0: Foundation Client Armature Underlay (gentleman posture anchor) */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      scale: clientScale,
                      y: clientY,
                      transform: 'translateZ(-30px)',
                    }}
                  >
                    <img
                      src="/src/assets/images/man_shirt_stage_1794046898589.jpg"
                      alt="Gentleman Foundation Stance"
                      className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-[#060608]/50" />
                  </motion.div>

                  {/* Layer 1: Floating Chalk & Posture Alignment Grid (Parallax mid-plane) */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      opacity: chalkGridOpacity,
                      transform: 'translateZ(10px)',
                    }}
                  >
                    <svg
                      className="w-full h-full stroke-[#C5A880]/30 stroke-[1]"
                      viewBox="0 0 400 520"
                      fill="none"
                    >
                      <line x1="200" y1="40" x2="200" y2="480" strokeDasharray="4 4" />
                      <line x1="100" y1="140" x2="300" y2="140" strokeDasharray="3 3" />
                      <line x1="120" y1="230" x2="280" y2="230" strokeDasharray="3 3" />
                      <line x1="90" y1="360" x2="310" y2="360" strokeDasharray="3 3" />
                      <circle cx="200" cy="140" r="4" fill="#C5A880" />
                      <circle cx="200" cy="230" r="4" fill="#C5A880" />
                      <circle cx="200" cy="360" r="4" fill="#C5A880" />
                    </svg>
                  </motion.div>

                  {/* Layer 2: Real Gentleman Wearing the Current Assembled Garment Layer */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep.id}
                      initial={{
                        opacity: 0,
                        scale: 0.92,
                        z: 50,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        z: 25,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 1.05,
                        z: -20,
                        y: -15,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 130,
                        damping: 20,
                      }}
                      className="absolute inset-0 flex items-center justify-center p-3"
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#C5A880]/40 shadow-[0_15px_35px_rgba(0,0,0,0.9)] bg-[#0C0C12]/90 backdrop-blur-sm">
                        <img
                          src={activeStep.image}
                          alt={activeStep.name}
                          className="w-full h-full object-cover object-center filter brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-transparent to-transparent opacity-75" />

                        {/* Anatomical Marker Badge on the Gentleman */}
                        <div
                          className="absolute left-4 right-4 bg-[#08080C]/90 backdrop-blur-md border border-[#C5A880]/50 px-3 py-2 rounded-lg text-xs font-mono text-[#E5D5B8] flex items-center justify-between shadow-xl"
                          style={{
                            top: activeStep.clientAnchor.top,
                            transform: 'translateZ(65px)',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-ping" />
                            <span className="text-[11px] font-semibold text-[#F3F4F6]">
                              {activeStep.clientAnchor.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#C5A880] font-mono">
                            {activeStep.clientAnchor.measurement}
                          </span>
                        </div>

                        {/* Bottom Floating Tag */}
                        <div
                          className="absolute bottom-3 left-3 right-3 flex items-end justify-between"
                          style={{ transform: 'translateZ(45px)' }}
                        >
                          <div>
                            <span className="text-[9px] uppercase font-mono tracking-widest text-[#C5A880] block">
                              {activeStep.fabricOrigin}
                            </span>
                            <h4 className="text-xs sm:text-sm font-serif text-white font-medium truncate max-w-[220px]">
                              {activeStep.name}
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#14141C]/90 border border-[#C5A880]/30 rounded text-[#C5A880]">
                            Stage {activeStep.stepNumber}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Floating 3D Depth Indicator Tooltip */}
                  <div
                    className="absolute top-3 left-3 z-20 bg-[#09090D]/85 backdrop-blur-md border border-[#2B2B38] px-2.5 py-1 rounded text-[10px] font-mono text-[#C5A880] flex items-center gap-1.5"
                    style={{ transform: 'translateZ(70px)' }}
                  >
                    <Compass className="w-3 h-3 text-[#C5A880] animate-spin" />
                    <span>3D Parallax Active</span>
                  </div>
                </div>

                {/* 3D Stage Hint */}
                <p className="text-[11px] font-mono text-[#6B7280] mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]/60" />
                  <span>Move cursor to tilt 3D perspective · Scroll down to dress the gentleman step by step</span>
                </p>
              </div>

              {/* Right 5 Columns: Sartorial Specs & Action Suite */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-5 bg-[#0D0D14] border border-[#20202C] rounded-2xl p-5 sm:p-7 shadow-xl">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A880] block mb-1">
                    Layer {activeStep.stepNumber} · {activeStep.fabricOrigin}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif text-[#F3F4F6] mb-1.5 leading-tight">
                    {activeStep.name}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] italic">
                    "{activeStep.silhouetteNote}"
                  </p>
                  <div className="w-10 h-0.5 bg-[#C5A880] mt-3" />
                </div>

                {/* Technical Specifications */}
                <div className="space-y-2.5">
                  {activeStep.specNotes.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#D1D5DB] leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0 mt-1.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>

                {/* Stepper Navigation */}
                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={activeStepIndex === 0}
                    onClick={() => {
                      setActiveStepIndex((prev) => Math.max(0, prev - 1));
                      setIsMotionAssembling(false);
                    }}
                    className="px-3.5 py-2 bg-[#14141E] hover:bg-[#1E1E2C] disabled:opacity-30 disabled:cursor-not-allowed border border-[#2B2B3A] rounded text-xs uppercase tracking-wider text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors cursor-pointer"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    disabled={activeStepIndex === ASSEMBLY_STEPS.length - 1}
                    onClick={() => {
                      setActiveStepIndex((prev) => Math.min(ASSEMBLY_STEPS.length - 1, prev + 1));
                      setIsMotionAssembling(false);
                    }}
                    className="px-4 py-2 bg-[#C5A880] hover:bg-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed text-[#0A0A0C] font-semibold rounded text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <span>Next Layer</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#1C1C26] space-y-2.5">
                  <button
                    type="button"
                    onClick={onCustomizeLook}
                    className="w-full py-3 bg-[#C5A880] hover:bg-[#D4AF37] text-[#0A0A0C] text-xs font-semibold uppercase tracking-[0.2em] rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Customize Look in 3D Fitting Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={onExploreCollections}
                    className="w-full py-2 text-xs font-medium uppercase tracking-wider text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors text-center cursor-pointer"
                  >
                    Explore All Tailored Commissions →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* View Mode 2: 6-Stage Progressive Sequence Gallery on Gentleman */
            <div className="relative z-10 flex-1 flex flex-col justify-center bg-[#0D0D14] border border-[#20202C] rounded-2xl p-5 sm:p-7 shadow-xl my-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1C1C26]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">
                    Progressive Sartorial Architecture
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif text-[#F3F4F6]">
                    Complete 6-Stage Assembly on the Gentleman
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('gentleman')}
                  className="text-xs text-[#C5A880] hover:underline cursor-pointer"
                >
                  Return to 3D Drape View →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {ASSEMBLY_STEPS.map((step, idx) => {
                  const isCurrent = idx === activeStepIndex;
                  return (
                    <div
                      key={step.id}
                      onClick={() => {
                        setActiveStepIndex(idx);
                        setViewMode('gentleman');
                      }}
                      className={`group relative rounded-xl overflow-hidden border p-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-[#C5A880] bg-[#1A1A24] ring-1 ring-[#C5A880]/50 shadow-lg'
                          : 'border-[#22222E] bg-[#0A0A0E] hover:border-[#C5A880]/60'
                      }`}
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-[#101016]">
                        <img
                          src={step.image}
                          alt={step.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#C5A880] mb-0.5">
                        <span>{step.stepNumber}</span>
                        <span>{step.category}</span>
                      </div>
                      <h4 className="text-[11px] font-serif text-[#E5E7EB] truncate">
                        {step.name}
                      </h4>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={onCustomizeLook}
                  className="px-6 py-2.5 bg-[#C5A880] hover:bg-[#D4AF37] text-[#0A0A0C] text-xs font-semibold uppercase tracking-[0.2em] rounded-lg transition-all shadow-xl cursor-pointer"
                >
                  Commission This Assembled Look in 3D
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
