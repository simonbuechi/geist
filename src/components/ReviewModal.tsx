import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { GoalStatus, Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useGoals } from '../context/GoalsContext';
import { formatWeekRange, parseWeekId, getNextWeekId } from '../utils/dateUtils';
import { CategoryIcon } from './CategoryIcon';
import { RoughBackground } from './RoughBackground';
import { RoughButton } from './RoughButton';
import { RoughHoverBorder } from './RoughHoverBorder';
import { IconButton } from './IconButton';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onComplete }) => {
  const { t, language } = useLanguage();
  const { currentWeekId, currentWeekPlan, submitWeeklyReview } = useGoals();
  
  const { weekNumber, startDate, endDate } = parseWeekId(currentWeekId);
  const nextWeekId = getNextWeekId(currentWeekId);
  const nextWeekDetails = parseWeekId(nextWeekId);

  // Local state for evaluations during review
  const [evaluations, setEvaluations] = useState<Record<string, { status: GoalStatus; comment: string }>>({});
  const [generalReflection, setGeneralReflection] = useState(currentWeekPlan.generalReflection || '');
  const [carryOverIds, setCarryOverIds] = useState<string[]>([]);
  const [hoveredEvalButton, setHoveredEvalButton] = useState<string | null>(null);

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

    onClose();
    onComplete?.();
  };

  const getCategoryIcon = (cat: Category, status?: GoalStatus) => {
    return <CategoryIcon category={cat} status={status} size={28} className="w-7 h-7 object-contain" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#332B25]/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FCF9F4] dark:bg-[#221F1D] rounded-t-2xl sm:rounded-2xl border border-[#8C7E72]/25 dark:border-[#7A6F66]/25 shadow-notebook h-[92vh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in">
        
        {/* Mobile Drag / Sheet Handle Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 bg-[#F3EDE2] dark:bg-[#221F1D] flex justify-center shrink-0">
          <div className="w-10 h-1 bg-[#8C7E72]/35 rounded-full" />
        </div>

        {/* Header */}
        <div className="relative px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between shrink-0 border-b border-[#8C7E72]/20 dark:border-[#7A6F66]/20 bg-[#F3EDE2]/75 dark:bg-[#2A2521]/75">
          <div className="relative z-10 flex items-center gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-hand font-bold tracking-wide bg-gradient-to-r from-[#9123A6] to-[#D7195F] bg-clip-text text-transparent leading-[1.7] py-0.5">
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
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 overscroll-contain">
              <p className="text-sm sm:text-base text-[#7A6F66] dark:text-[#A3968B] italic font-serif">
                {t.reviewModal.description}
              </p>

              {/* Section 1: Evaluate Goals */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#7A6F66] dark:text-[#A3968B] font-sans">
                  {t.reviewModal.step1Title}
                </h4>

                {currentWeekPlan.goals.length === 0 ? (
                  <div className="p-5 bg-[#F3EDE2]/60 dark:bg-[#191614]/60 rounded-xl border border-dashed border-[#8C7E72]/40 text-[#7A6F66] text-base text-center font-hand">
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
                          className="relative p-3.5 sm:p-4 bg-[#FCF9F4] dark:bg-[#282421] rounded-xl border border-[#8C7E72]/20 dark:border-[#7A6F66]/20 flex flex-col gap-2.5 overflow-visible"
                        >
                          {/* Goal Item Description */}
                          <div className="relative z-10 flex items-center gap-2.5">
                            <span className="shrink-0 flex items-center justify-center">
                              {getCategoryIcon(goal.category, currentEval.status)}
                            </span>
                            <span className="text-sm font-serif text-[#332B25] dark:text-[#EAE2D9] flex-1 leading-relaxed">
                              {goal.description}
                            </span>
                          </div>

                          {/* Status Radio Buttons (Good / Partly / Poor) */}
                          <div className="relative z-10 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'good')}
                              onMouseEnter={() => setHoveredEvalButton(`${goal.id}-good`)}
                              onMouseLeave={() => setHoveredEvalButton(null)}
                              className={`group relative py-1 px-2.5 sm:px-3 rounded-full border-0 text-2xs sm:text-xs font-sans font-medium inline-flex items-center justify-center gap-1.5 min-h-[28px] overflow-visible ${
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
                                  opacity={0.28}
                                  shape="rounded"
                                  stroke="transparent"
                                  strokeWidth={0}
                                  seed={401}
                                  className="rounded-full overflow-hidden"
                                />
                              )}
                              <RoughHoverBorder
                                active={hoveredEvalButton === `${goal.id}-good`}
                                color="#4E7A52"
                                darkColor="#A3C9A8"
                              />
                              <CategoryIcon category={goal.category} variant="achieved" size={16} className="w-4 h-4 shrink-0 relative z-10" />
                              <span className="truncate relative z-10">{t.status.good}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'partly')}
                              onMouseEnter={() => setHoveredEvalButton(`${goal.id}-partly`)}
                              onMouseLeave={() => setHoveredEvalButton(null)}
                              className={`group relative py-1 px-2.5 sm:px-3 rounded-full border-0 text-2xs sm:text-xs font-sans font-medium inline-flex items-center justify-center gap-1.5 min-h-[28px] overflow-visible ${
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
                                  opacity={0.28}
                                  shape="rounded"
                                  stroke="transparent"
                                  strokeWidth={0}
                                  seed={402}
                                  className="rounded-full overflow-hidden"
                                />
                              )}
                              <RoughHoverBorder
                                active={hoveredEvalButton === `${goal.id}-partly`}
                                color="#B88028"
                                darkColor="#E2B467"
                              />
                              <CategoryIcon category={goal.category} variant="partial" size={16} className="w-4 h-4 shrink-0 relative z-10" />
                              <span className="truncate relative z-10">{t.status.partly}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'poor')}
                              onMouseEnter={() => setHoveredEvalButton(`${goal.id}-poor`)}
                              onMouseLeave={() => setHoveredEvalButton(null)}
                              className={`group relative py-1 px-2.5 sm:px-3 rounded-full border-0 text-2xs sm:text-xs font-sans font-medium inline-flex items-center justify-center gap-1.5 min-h-[28px] overflow-visible ${
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
                                  opacity={0.28}
                                  shape="rounded"
                                  stroke="transparent"
                                  strokeWidth={0}
                                  seed={403}
                                  className="rounded-full overflow-hidden"
                                />
                              )}
                              <RoughHoverBorder
                                active={hoveredEvalButton === `${goal.id}-poor`}
                                color="#B84A39"
                                darkColor="#E2876B"
                              />
                              <CategoryIcon category={goal.category} variant="not_achieved" size={16} className="w-4 h-4 shrink-0 relative z-10" />
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
                              className="w-full text-xs sm:text-sm p-2 rounded-lg border border-[#8C7E72]/25 dark:border-[#7A6F66]/25 bg-[#F3EDE2]/60 dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] placeholder-[#7A6F66] focus:outline-none focus:border-[#8A6A46] font-serif"
                            />
                          </div>

                          {/* Carry over toggle */}
                          <div className="relative z-10 flex items-center justify-between pt-0.5 text-xs">
                            <label className="flex items-center gap-2 cursor-pointer select-none text-[#7A6F66] dark:text-[#A3968B] py-0.5 font-sans">
                              <input
                                type="checkbox"
                                checked={isCarried}
                                onChange={() => toggleCarryOver(goal.id)}
                                className="w-3.5 h-3.5 rounded-none border-[#8C7E72]/50 text-[#8A6A46] focus:ring-[#8A6A46]"
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

              {/* Section 2: General Weekly Reflection */}
              <div className="space-y-2 pt-2 border-t border-[#8C7E72]/20 dark:border-[#7A6F66]/20">
                <h4 className="text-xs font-bold text-[#7A6F66] dark:text-[#A3968B] font-sans">
                  {t.actions.addReflection}
                </h4>
                <textarea
                  value={generalReflection}
                  onChange={(e) => setGeneralReflection(e.target.value)}
                  placeholder={t.reviewModal.generalReflectionPlaceholder}
                  rows={3}
                  className="w-full text-sm p-3 rounded-lg border border-[#8C7E72]/25 dark:border-[#7A6F66]/25 bg-[#F3EDE2]/60 dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] placeholder-[#7A6F66] focus:outline-none focus:border-[#8A6A46] font-serif leading-relaxed"
                />
              </div>
            </div>

            {/* Sticky Submit Action Bar */}
            <div className="p-3.5 sm:p-4 bg-[#F3EDE2]/95 dark:bg-[#191614]/95 border-t border-[#8C7E72]/20 dark:border-[#7A6F66]/20 flex items-center justify-between gap-3 shrink-0 pb-safe">
              <RoughButton
                type="button"
                onClick={onClose}
                variant="default"
                size="md"
              >
                <span>{t.actions.cancel}</span>
              </RoughButton>
              <RoughButton
                type="submit"
                variant="primary"
                size="md"
                seed={66}
              >
                <span className="truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">{t.reviewModal.finishButton}</span>
              </RoughButton>
            </div>
          </form>
      </div>
    </div>
  );
};
