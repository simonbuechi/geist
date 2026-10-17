import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import type { GoalStatus, Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useGoals } from '../context/GoalsContext';
import { formatWeekRange, parseWeekId, getNextWeekId } from '../utils/dateUtils';
import { CategoryIcon } from './CategoryIcon';
import { RoughBorder } from './RoughBorder';
import { RoughBackground } from './RoughBackground';
import { RoughDivider } from './RoughDivider';
import { IconButton } from './IconButton';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { currentWeekId, currentWeekPlan, submitWeeklyReview, selectWeek } = useGoals();
  
  const { weekNumber, startDate, endDate } = parseWeekId(currentWeekId);
  const nextWeekId = getNextWeekId(currentWeekId);
  const nextWeekDetails = parseWeekId(nextWeekId);

  // Local state for evaluations during review
  const [evaluations, setEvaluations] = useState<Record<string, { status: GoalStatus; comment: string }>>({});
  const [generalReflection, setGeneralReflection] = useState(currentWeekPlan.generalReflection || '');
  const [carryOverIds, setCarryOverIds] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, { status: GoalStatus; comment: string }> = {};
      currentWeekPlan.goals.forEach(goal => {
        initial[goal.id] = {
          status: goal.status === 'pending' ? 'good' : goal.status,
          comment: goal.comment || ''
        };
      });
      setEvaluations(initial);
      setGeneralReflection(currentWeekPlan.generalReflection || '');
      setCarryOverIds([]);
      setIsSuccess(false);
    }
  }, [isOpen, currentWeekPlan]);

  if (!isOpen) return null;

  const handleStatusChange = (goalId: string, status: GoalStatus) => {
    setEvaluations(prev => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        status
      }
    }));
  };

  const handleCommentChange = (goalId: string, comment: string) => {
    setEvaluations(prev => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        comment
      }
    }));
  };

  const toggleCarryOver = (goalId: string) => {
    setCarryOverIds(prev => 
      prev.includes(goalId) ? prev.filter(id => id !== goalId) : [...prev, goalId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goalEvalArray = currentWeekPlan.goals.map(goal => ({
      goalId: goal.id,
      status: evaluations[goal.id]?.status || 'good',
      comment: evaluations[goal.id]?.comment || ''
    }));

    submitWeeklyReview(
      currentWeekId,
      goalEvalArray,
      carryOverIds,
      generalReflection
    );

    setIsSuccess(true);
  };

  const handleFinishAndOpenNextWeek = () => {
    selectWeek(nextWeekId);
    onClose();
    setIsSuccess(false);
  };

  const getCategoryIcon = (cat: Category, status?: GoalStatus) => {
    return <CategoryIcon category={cat} status={status} size={32} className="w-8 h-8 object-contain" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#332B25]/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FCF9F4] dark:bg-[#221F1D] shadow-notebook h-[92vh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in">
        <RoughBorder borderRadius={2} width={1.3} opacity={0.45} color="#8C7E72" darkColor="#7A6F66" />
        
        {/* Mobile Drag / Sheet Handle Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 bg-[#F3EDE2] dark:bg-[#221F1D] flex justify-center shrink-0">
          <div className="w-10 h-1 bg-[#8C7E72]/35 rounded-none" />
        </div>

        {/* Header - Botanical Notebook Header with Hand-Drawn Cross-Hatch Wash */}
        <div className="relative px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between shrink-0 overflow-hidden bg-[#FAF1ED] dark:bg-[#2A201D]">
          <RoughBackground
            fill="#C46345"
            darkFill="#E2876B"
            fillStyle="hachure"
            hachureAngle={-41}
            hachureGap={6.5}
            fillWeight={1.0}
            roughness={1.3}
            opacity={0.14}
            drawBottomLine={true}
            bottomLineColor="#C46345"
            darkBottomLineColor="#E2876B"
            seed={111}
          />
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-[#FCF9F4] dark:bg-[#221F1D] border border-[#C46345]/30 dark:border-[#E2876B]/30 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#C46345] dark:text-[#E2876B] stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-hand font-bold tracking-wide text-[#332B25] dark:text-[#EAE2D9]">
                {t.reviewModal.title}
              </h3>
              <p className="text-xs text-[#7A6F66] dark:text-[#A3968B] font-serif italic">
                {t.week} {weekNumber} • {formatWeekRange(startDate, endDate, language)}
              </p>
            </div>
          </div>
          <IconButton
            onClick={onClose}
            title={t.actions.cancel || 'Schließen'}
            aria-label="Schließen"
            variant="ghost"
            size="md"
            className="relative z-10"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </IconButton>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 flex-1 flex flex-col items-center justify-center text-center gap-4 overflow-y-auto">
            <div className="flex items-center justify-center gap-3 my-2">
              {(['body', 'mind', 'soul'] as Category[]).map(cat => {
                const catGoals = currentWeekPlan.goals.filter(g => g.category === cat);
                const evals = catGoals.map(g => evaluations[g.id]?.status || 'good');
                const variant = catGoals.length === 0 
                  ? 'base' 
                  : evals.every(s => s === 'good') 
                    ? 'achieved' 
                    : evals.includes('poor') && !evals.includes('good')
                      ? 'not_achieved'
                      : 'partial';

                return (
                  <div key={cat} className="relative p-3.5 bg-[#FCF9F4] dark:bg-[#2A2623] flex flex-col items-center gap-2 min-w-[95px] overflow-hidden">
                    <RoughBorder borderRadius={2} width={1.0} color="#8C7E72" opacity={0.4} />
                    <CategoryIcon category={cat} variant={variant} size={64} className="w-16 h-16 relative z-10" />
                    <span className="text-sm font-sans font-semibold text-[#332B25] dark:text-[#EAE2D9] capitalize relative z-10">
                      {t.categories[cat].title}
                    </span>
                  </div>
                );
              })}
            </div>
            <h4 className="text-2xl sm:text-3xl font-sans font-semibold text-[#332B25] dark:text-[#EAE2D9]">
              {t.reviewModal.successMessage}
            </h4>
            <p className="text-xs sm:text-sm text-[#7A6F66] dark:text-[#A3968B] max-w-md font-serif">
              Deine Reflexion für {t.week} {weekNumber} wurde im Journal festgehalten.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="relative px-4 py-2 border-0 text-[#332B25] dark:text-[#EAE2D9] bg-[#F3EDE2] dark:bg-[#2A2623] font-sans font-semibold text-base sketch-btn-press transition-all overflow-hidden"
              >
                <RoughBorder borderRadius={2} width={0.9} color="#8C7E72" opacity={0.4} />
                <span className="relative z-10">{t.viewReview}</span>
              </button>
              <button
                onClick={handleFinishAndOpenNextWeek}
                className="group relative px-5 py-2 border-0 text-[#FAF6F0] font-sans font-semibold text-base sm:text-lg sketch-btn-press transition-all flex items-center justify-center gap-1.5 overflow-hidden"
              >
                <RoughBackground
                  fill="#C46345"
                  darkFill="#B05236"
                  fillStyle="cross-hatch"
                  hachureAngle={-38}
                  hachureGap={2.8}
                  fillWeight={1.4}
                  roughness={1.1}
                  opacity={0.94}
                  seed={77}
                />
                <RoughBorder borderRadius={2} width={1.0} color="#8F4028" opacity={0.5} />
                <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
                  {t.actions.startNextWeek} ({t.week} {nextWeekDetails.weekNumber})
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.2] relative z-10" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 overscroll-contain">
              <p className="text-sm sm:text-base text-[#7A6F66] dark:text-[#A3968B] italic font-serif">
                {t.reviewModal.description}
              </p>

              {/* Section 1: Evaluate Goals */}
              <div className="space-y-3">
                <h4 className="text-2xs sm:text-xs font-bold uppercase tracking-wider text-[#7A6F66] dark:text-[#A3968B] font-sans">
                  {t.reviewModal.step1Title}
                </h4>

                {currentWeekPlan.goals.length === 0 ? (
                  <div className="p-5 bg-[#F3EDE2]/60 dark:bg-[#191614]/60 border border-dashed border-[#8C7E72]/40 text-[#7A6F66] text-base text-center font-hand">
                    Für diese Woche wurden keine Ziele hinterlegt.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentWeekPlan.goals.map((goal) => {
                      const currentEval = evaluations[goal.id] || { status: 'good', comment: '' };
                      const isCarried = carryOverIds.includes(goal.id);

                      return (
                        <div
                          key={goal.id}
                          className="relative p-3.5 sm:p-4 bg-[#FCF9F4] dark:bg-[#282421] space-y-3 overflow-hidden"
                        >
                          <RoughBorder borderRadius={2} width={1.0} color="#8C7E72" darkColor="#7A6F66" opacity={0.35} />
                          {/* Goal Item Description */}
                          <div className="relative z-10 flex items-start gap-2.5">
                            <span className="p-1.5 bg-[#F3EDE2] dark:bg-[#201D1B] border border-[#8C7E72]/25 mt-0.5 shrink-0 flex items-center justify-center">
                              {getCategoryIcon(goal.category, currentEval.status)}
                            </span>
                            <span className="text-sm sm:text-[15px] font-serif text-[#332B25] dark:text-[#EAE2D9] flex-1 leading-relaxed pt-1">
                              {goal.description}
                            </span>
                          </div>

                          {/* Status Radio Buttons (Good / Partly / Poor) */}
                          <div className="relative z-10 grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'good')}
                              className={`group relative py-1.5 px-1 sm:px-2 border-0 text-sm sm:text-base font-sans font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[38px] sketch-btn-press overflow-hidden ${
                                currentEval.status === 'good'
                                  ? 'text-[#3A5E3D] dark:text-[#A3C9A8]'
                                  : 'bg-[#F3EDE2]/70 dark:bg-[#201D1B] text-[#7A6F66] dark:text-[#A3968B]'
                              }`}
                            >
                              {currentEval.status === 'good' && (
                                <RoughBackground
                                  fill="#557659"
                                  darkFill="#557659"
                                  fillStyle="cross-hatch"
                                  hachureAngle={-41}
                                  hachureGap={3.4}
                                  fillWeight={1.1}
                                  opacity={0.22}
                                  seed={401}
                                />
                              )}
                              <RoughBorder
                                borderRadius={2}
                                width={currentEval.status === 'good' ? 1.2 : 0.7}
                                color={currentEval.status === 'good' ? '#4E7A52' : '#8C7E72'}
                                opacity={currentEval.status === 'good' ? 0.65 : 0.25}
                              />
                              <CategoryIcon category={goal.category} variant="achieved" size={20} className="w-5 h-5 shrink-0 relative z-10" />
                              <span className="truncate relative z-10">{t.status.good}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'partly')}
                              className={`group relative py-1.5 px-1 sm:px-2 border-0 text-sm sm:text-base font-sans font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[38px] sketch-btn-press overflow-hidden ${
                                currentEval.status === 'partly'
                                  ? 'text-[#8C5A12] dark:text-[#E2B467]'
                                  : 'bg-[#F3EDE2]/70 dark:bg-[#201D1B] text-[#7A6F66] dark:text-[#A3968B]'
                              }`}
                            >
                              {currentEval.status === 'partly' && (
                                <RoughBackground
                                  fill="#B88028"
                                  darkFill="#B88028"
                                  fillStyle="cross-hatch"
                                  hachureAngle={-41}
                                  hachureGap={3.4}
                                  fillWeight={1.1}
                                  opacity={0.22}
                                  seed={402}
                                />
                              )}
                              <RoughBorder
                                borderRadius={2}
                                width={currentEval.status === 'partly' ? 1.2 : 0.7}
                                color={currentEval.status === 'partly' ? '#B88028' : '#8C7E72'}
                                opacity={currentEval.status === 'partly' ? 0.65 : 0.25}
                              />
                              <CategoryIcon category={goal.category} variant="partial" size={20} className="w-5 h-5 shrink-0 relative z-10" />
                              <span className="truncate relative z-10">{t.status.partly}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'poor')}
                              className={`group relative py-1.5 px-1 sm:px-2 border-0 text-sm sm:text-base font-sans font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[38px] sketch-btn-press overflow-hidden ${
                                currentEval.status === 'poor'
                                  ? 'text-[#963626] dark:text-[#E2876B]'
                                  : 'bg-[#F3EDE2]/70 dark:bg-[#201D1B] text-[#7A6F66] dark:text-[#A3968B]'
                              }`}
                            >
                              {currentEval.status === 'poor' && (
                                <RoughBackground
                                  fill="#B84A39"
                                  darkFill="#B84A39"
                                  fillStyle="cross-hatch"
                                  hachureAngle={-41}
                                  hachureGap={3.4}
                                  fillWeight={1.1}
                                  opacity={0.22}
                                  seed={403}
                                />
                              )}
                              <RoughBorder
                                borderRadius={2}
                                width={currentEval.status === 'poor' ? 1.2 : 0.7}
                                color={currentEval.status === 'poor' ? '#B84A39' : '#8C7E72'}
                                opacity={currentEval.status === 'poor' ? 0.65 : 0.25}
                              />
                              <CategoryIcon category={goal.category} variant="not_achieved" size={20} className="w-5 h-5 shrink-0 relative z-10" />
                              <span className="truncate relative z-10">{t.status.poor}</span>
                            </button>
                          </div>

                          {/* Optional Goal Comment */}
                          <div className="relative z-10 flex items-center gap-2">
                            <input
                              type="text"
                              value={currentEval.comment}
                              onChange={(e) => handleCommentChange(goal.id, e.target.value)}
                              placeholder="Kurze Reflexion notieren..."
                              className="w-full text-xs sm:text-sm p-2.5 border border-[#8C7E72]/30 dark:border-[#7A6F66]/30 bg-[#F3EDE2]/60 dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] placeholder-[#7A6F66] focus:outline-none focus:border-[#C46345] font-serif"
                            />
                          </div>

                          {/* Carry over toggle */}
                          <div className="relative z-10 flex items-center justify-between pt-0.5 text-xs">
                            <label className="flex items-center gap-2 cursor-pointer select-none text-[#7A6F66] dark:text-[#A3968B] py-0.5 font-sans">
                              <input
                                type="checkbox"
                                checked={isCarried}
                                onChange={() => toggleCarryOver(goal.id)}
                                className="w-3.5 h-3.5 rounded-none border-[#8C7E72]/50 text-[#C46345] focus:ring-[#C46345]"
                              />
                              <span>{t.actions.carryOver} (KW {nextWeekDetails.weekNumber})</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <RoughDivider color="#8C7E72" darkColor="#7A6F66" opacity={0.3} seed={305} />

              {/* Section 2: General Weekly Reflection */}
              <div className="space-y-2 pt-1">
                <h4 className="text-2xs sm:text-xs font-bold uppercase tracking-wider text-[#7A6F66] dark:text-[#A3968B] font-sans">
                  {t.actions.addReflection}
                </h4>
                <textarea
                  value={generalReflection}
                  onChange={(e) => setGeneralReflection(e.target.value)}
                  placeholder={t.reviewModal.generalReflectionPlaceholder}
                  rows={3}
                  className="w-full text-sm p-3 border border-[#8C7E72]/30 dark:border-[#7A6F66]/30 bg-[#F3EDE2]/60 dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] placeholder-[#7A6F66] focus:outline-none focus:border-[#C46345] font-serif leading-relaxed"
                />
              </div>
            </div>

            {/* Sticky Submit Action Bar */}
            <div className="p-3.5 sm:p-4 bg-[#F3EDE2]/95 dark:bg-[#191614]/95 border-t border-[#8C7E72]/25 dark:border-[#7A6F66]/25 flex items-center justify-between gap-3 shrink-0 pb-safe">
              <button
                type="button"
                onClick={onClose}
                className="relative px-4 py-2 border-0 bg-[#FCF9F4] dark:bg-[#221F1D] text-[#332B25] dark:text-[#EAE2D9] text-base font-sans font-semibold transition-all sketch-btn-press overflow-hidden"
              >
                <RoughBorder borderRadius={2} width={0.9} color="#8C7E72" opacity={0.4} />
                <span className="relative z-10">{t.actions.cancel}</span>
              </button>
              <button
                type="submit"
                className="group relative flex-1 sm:flex-initial px-5 py-2 border-0 text-[#FAF6F0] font-sans font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2 sketch-btn-press overflow-hidden"
              >
                <RoughBackground
                  fill="#C46345"
                  darkFill="#B05236"
                  fillStyle="cross-hatch"
                  hachureAngle={-38}
                  hachureGap={2.8}
                  fillWeight={1.4}
                  roughness={1.1}
                  opacity={0.94}
                  seed={66}
                />
                <RoughBorder borderRadius={2} width={1.0} color="#8F4028" opacity={0.5} />
                <Sparkles className="w-4 h-4 stroke-[2.2] shrink-0 text-[#FAF6F0] relative z-10" />
                <span className="truncate relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">{t.reviewModal.finishButton}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
