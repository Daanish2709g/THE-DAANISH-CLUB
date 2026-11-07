import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  Scissors,
  Layers,
  Crown,
  ChevronRight,
  RotateCcw,
  Calendar,
  Eye,
} from 'lucide-react';
import { STYLE_QUIZ_QUESTIONS, evaluateQuizAnswers } from '../utils/styleQuiz';
import { QuizAnswers, StyleQuizResult } from '../types/quiz';
import { SuitProduct, CurrencyCode, FabricOption } from '../types/suit';
import { SUIT_CATALOG, LUXURY_FABRICS } from '../data/suitCatalog';
import { formatPrice } from '../utils/pricing';

interface StyleDiscoveryQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: CurrencyCode;
  onSelectSuitFor3DCustomizer: (suit: SuitProduct, fabricOption?: FabricOption) => void;
  onOpenConsultation: () => void;
}

export const StyleDiscoveryQuizModal: React.FC<StyleDiscoveryQuizModalProps> = ({
  isOpen,
  onClose,
  currentCurrency,
  onSelectSuitFor3DCustomizer,
  onOpenConsultation,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<StyleQuizResult | null>(null);
  const [showSecondarySuit, setShowSecondarySuit] = useState(false);

  // Close on Escape key
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

  const currentQuestion = STYLE_QUIZ_QUESTIONS[currentStepIndex];
  const totalQuestions = STYLE_QUIZ_QUESTIONS.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalQuestions) * 100);
  const isCurrentAnswered = Boolean(answers[currentQuestion?.id]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentStepIndex < totalQuestions - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Calculate final bespoke match
      const result = evaluateQuizAnswers(answers, SUIT_CATALOG);
      setQuizResult(result);
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setQuizResult(null);
    setShowSecondarySuit(false);
  };

  const handleLaunch3DStudio = (suit: SuitProduct, fabricId?: string) => {
    const matchedFabric = LUXURY_FABRICS.find((f) => f.id === fabricId) || LUXURY_FABRICS[0];
    onSelectSuitFor3DCustomizer(suit, matchedFabric);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#070709]/85 backdrop-blur-xl animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-[#0E0E14] border border-[#272733] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Atelier Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22222E] bg-[#12121A]/70">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#C5A880]/15 border border-[#C5A880]/30 rounded-lg text-[#C5A880]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A880] block">
                Atelier Intelligence
              </span>
              <h2 id="quiz-modal-title" className="text-sm sm:text-base font-serif text-[#F3F4F6] font-medium">
                {isCompleted ? 'Your Bespoke Sartorial Match' : 'AI Style Discovery Quiz'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isCompleted && (
              <span className="text-xs font-mono text-[#9CA3AF] bg-[#1A1A24] px-2.5 py-1 rounded-md border border-[#2B2B38]">
                Step {currentStepIndex + 1} of {totalQuestions}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Quiz"
              className="p-1.5 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1A1A24] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar (during quiz) */}
        {!isCompleted && (
          <div className="w-full bg-[#161620] h-1">
            <div
              className="bg-gradient-to-r from-[#997B4D] via-[#C5A880] to-[#E5D5B8] h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {!isCompleted && currentQuestion ? (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              {/* Question Header */}
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#C5A880]">
                  Dimension 0{currentQuestion.number} · {currentQuestion.category.replace('-', ' ')}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-[#F9FAFB] leading-tight">
                  {currentQuestion.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                  {currentQuestion.subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                      className={`group relative p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 ${
                        isSelected
                          ? 'border-[#C5A880] bg-[#1A1A26] shadow-xl ring-1 ring-[#C5A880]/30'
                          : 'border-[#22222E] bg-[#121218]/90 hover:border-[#C5A880]/40 hover:bg-[#151520]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#F3F4F6] group-hover:text-[#C5A880] transition-colors">
                            {option.label}
                          </span>
                          {option.tag && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] bg-[#C5A880]/10 px-2 py-0.5 rounded border border-[#C5A880]/20">
                              {option.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#9CA3AF] leading-relaxed">
                          {option.sublabel}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#C5A880] border-[#C5A880] text-[#0A0A0C]'
                            : 'border-[#333342] group-hover:border-[#9CA3AF]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : quizResult ? (
            /* Results View */
            <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
              {/* Persona Headline & Match Score */}
              <div className="text-center space-y-3 pb-6 border-b border-[#22222E]">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/15 border border-[#C5A880]/30 rounded-full text-[#C5A880] text-xs font-mono uppercase tracking-widest">
                  <Crown className="w-3.5 h-3.5" />
                  <span>{quizResult.matchScore}% Sartorial Affinity</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#F9FAFB]">
                  {quizResult.archetypeTitle}
                </h3>
                <p className="text-sm text-[#C4C8D0] max-w-xl mx-auto leading-relaxed italic font-serif">
                  &ldquo;{quizResult.stylePersonaSummary}&rdquo;
                </p>
              </div>

              {/* Recommended Commission Card */}
              {(() => {
                const activeSuit = showSecondarySuit && quizResult.secondarySuit
                  ? quizResult.secondarySuit
                  : quizResult.recommendedSuit;
                const matchedFabric =
                  LUXURY_FABRICS.find((f) => f.id === quizResult.recommendedFabricId) ||
                  LUXURY_FABRICS[0];

                return (
                  <div className="bg-[#12121A] border border-[#2B2B3A] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                      {/* Suit Visual Preview */}
                      <div className="md:col-span-5 relative min-h-[260px] md:min-h-full bg-[#08080B] overflow-hidden">
                        <img
                          src={activeSuit.image}
                          alt={activeSuit.name}
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E14] via-transparent to-transparent opacity-80" />
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] bg-[#0E0E14]/90 px-2.5 py-1 rounded border border-[#C5A880]/30 backdrop-blur-md">
                            {showSecondarySuit ? 'Alternative Option' : 'Primary Atelier Match'}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-left">
                          <span className="text-xs text-[#9CA3AF] uppercase tracking-wider block">
                            Base Commission
                          </span>
                          <span className="text-lg font-serif text-[#F9FAFB] font-semibold">
                            {formatPrice(activeSuit.basePriceUsd, currentCurrency)}
                          </span>
                        </div>
                      </div>

                      {/* Suit Architecture & Cutter Details */}
                      <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-5">
                        <div className="space-y-3">
                          <div>
                            <span className="text-[11px] font-mono text-[#C5A880] uppercase tracking-widest block mb-0.5">
                              {activeSuit.gender === 'women'
                                ? "Women's Bespoke Couture"
                                : "Men's Master Tailoring"}
                            </span>
                            <h4 className="text-xl font-serif text-[#F3F4F6] font-semibold">
                              {activeSuit.name}
                            </h4>
                            <p className="text-xs text-[#9CA3AF] mt-0.5 line-clamp-2">
                              {activeSuit.subtitle}
                            </p>
                          </div>

                          {/* Master Cutter Rationale */}
                          <div className="bg-[#181822] border border-[#272736] rounded-xl p-3.5 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-[#C5A880] font-medium">
                              <Scissors className="w-3.5 h-3.5" />
                              <span>Master Cutter Rationale</span>
                            </div>
                            <p className="text-xs text-[#D1D5DB] leading-relaxed">
                              {quizResult.cutterRationale}
                            </p>
                          </div>

                          {/* Recommended Textile and Construction Specs */}
                          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                            <div className="bg-[#14141C] p-2.5 rounded-lg border border-[#22222E]">
                              <span className="text-[10px] text-[#9CA3AF] uppercase block">
                                Recommended Cloth
                              </span>
                              <span className="text-[#F3F4F6] font-medium truncate block">
                                {matchedFabric.name.split('·')[0]}
                              </span>
                              <span className="text-[10px] text-[#C5A880] block">
                                {matchedFabric.mill.split(',')[0]}
                              </span>
                            </div>

                            <div className="bg-[#14141C] p-2.5 rounded-lg border border-[#22222E]">
                              <span className="text-[10px] text-[#9CA3AF] uppercase block">
                                Lapel & Silhouette
                              </span>
                              <span className="text-[#F3F4F6] font-medium truncate block">
                                {quizResult.suggestedLapel}
                              </span>
                              <span className="text-[10px] text-[#9CA3AF] block truncate">
                                {activeSuit.silhouetteDefault.replace(/-/g, ' ')}
                              </span>
                            </div>
                          </div>

                          {/* Curated Styling Recommendations */}
                          <div className="space-y-1 text-xs text-[#9CA3AF] pt-1">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] block">
                              Sartorial Styling Protocol:
                            </span>
                            <ul className="space-y-1 pl-3 text-[11px] list-disc list-outside marker:text-[#C5A880]">
                              {quizResult.stylingTips.map((tip, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Interactive Primary Action Buttons */}
                        <div className="pt-3 border-t border-[#22222E] flex flex-col sm:flex-row items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleLaunch3DStudio(activeSuit, quizResult.recommendedFabricId)
                            }
                            className="w-full sm:flex-1 py-3 px-4 bg-[#C5A880] hover:bg-[#D4AF37] text-[#0A0A0C] text-xs font-semibold uppercase tracking-[0.16em] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Customize in 3D Fitting Studio</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenConsultation();
                            }}
                            className="w-full sm:w-auto py-3 px-4 bg-[#1A1A24] hover:bg-[#222230] text-[#E5E7EB] border border-[#2F2F3E] text-xs font-medium uppercase tracking-[0.14em] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>Book Consultation</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Secondary Alternate Option Switcher */}
              {quizResult.secondarySuit && (
                <div className="flex items-center justify-between p-4 bg-[#12121A] rounded-xl border border-[#22222E]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#9CA3AF] block">
                      Explore Alternative Silhouette:
                    </span>
                    <span className="text-xs font-serif text-[#F3F4F6] font-medium">
                      {quizResult.secondarySuit.name} ({formatPrice(quizResult.secondarySuit.basePriceUsd, currentCurrency)})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSecondarySuit(!showSecondarySuit)}
                    className="text-xs text-[#C5A880] hover:text-[#E5D5B8] underline-offset-4 underline cursor-pointer font-medium"
                  >
                    {showSecondarySuit ? 'View Primary Recommendation' : 'Compare Alternative'}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Modal Bottom Controls */}
        <div className="px-6 py-4 border-t border-[#22222E] bg-[#12121A]/70 flex items-center justify-between">
          {!isCompleted ? (
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#F3F4F6] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C5A880] hover:bg-[#D4AF37] disabled:opacity-40 disabled:pointer-events-none text-[#0A0A0C] text-xs font-semibold uppercase tracking-[0.16em] rounded-lg transition-all shadow-md cursor-pointer"
              >
                <span>
                  {currentStepIndex === totalQuestions - 1
                    ? 'Discover Sartorial Match'
                    : 'Next Dimension'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#C5A880] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Sartorial Quiz</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-[#9CA3AF] hover:text-[#F3F4F6] underline-offset-2 hover:underline cursor-pointer"
              >
                Back to Wardrobe
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
