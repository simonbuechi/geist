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
    return <CategoryIcon category={cat} status={status} size={24} className="w-6 h-6 object-contain" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#2D2621]/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] dark:bg-[#25201C] rounded-none shadow-xl h-[92vh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in shadow-pencil">
        <RoughBorder borderRadius={0} width={1.2} opacity={0.5} />
        
        {/* Mobile Drag / Sheet Handle Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 bg-[#FAF6F0] dark:bg-[#25201C] flex justify-center shrink-0">
          <div className="w-10 h-1 bg-[#574A40]/30 rounded-none" />
        </div>

        {/* Header - Delicate Notebook Header with Warm Tinted Background */}
        <div className="relative px-4 py-3 sm:px-6 sm:py-4 border-b border-[#D7195F]/20 dark:border-[#EDE5DD]/15 flex items-center justify-between shrink-0 overflow-hidden bg-[#FAF3EE] dark:bg-[#2B1D17]">
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-none bg-white/95 dark:bg-[#2D2621] border border-[#574A40]/30 dark:border-[#EDE5DD]/20 shadow-pencil-sm shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D7195F] stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-hand font-bold tracking-wide text-[#2D2621] dark:text-[#EDE5DD]">
                {t.reviewModal.title}
              </h3>
              <p className="text-2xs sm:text-xs text-[#8A796D] dark:text-[#BA9F83] font-sans">
                {t.week} {weekNumber} • {formatWeekRange(startDate, endDate, language)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="relative z-10 p-1.5 rounded-full text-[#6A5C52] dark:text-[#BA9F83] hover:text-[#2D2621] dark:hover:text-[#EDE5DD] hover:bg-white/80 dark:hover:bg-[#382E28] transition-all shadow-pencil-sm"
          >
            <RoughBorder shape="circle" width={0.9} />
            <X className="w-4 h-4 stroke-[2] relative z-10" />
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 flex-1 flex flex-col items-center justify-center text-center gap-3.5 overflow-y-auto">
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
                  <div key={cat} className="p-2.5 rounded-none bg-white dark:bg-[#1E1B18] border border-[#574A40]/25 dark:border-[#EDE5DD]/20 shadow-pencil-sm flex flex-col items-center gap-1.5 min-w-[76px]">
                    <CategoryIcon category={cat} variant={variant} size={36} className="w-9 h-9" />
                    <span className="text-xs font-hand font-bold text-[#2D2621] dark:text-[#EDE5DD] capitalize">
                      {t.categories[cat].title}
                    </span>
                  </div>
                );
              })}
            </div>
            <h4 className="text-xl sm:text-2xl font-hand font-bold text-[#2D2621] dark:text-[#EDE5DD]">
              {t.reviewModal.successMessage}
            </h4>
            <p className="text-xs sm:text-sm text-[#6A5C52] dark:text-[#BA9F83] max-w-md font-sans">
              Deine Reflexion für {t.week} {weekNumber} wurde erfolgreich im Skizzenbuch gespeichert.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-none border-1.5 border-[#2D2621]/60 dark:border-[#EDE5DD]/40 text-[#2D2621] dark:text-[#EDE5DD] bg-white dark:bg-[#1E1B18] hover:bg-[#FAF6F0] dark:hover:bg-[#2D2621] font-hand font-bold text-sm sm:text-base sketch-btn-press transition-all"
              >
                {t.viewReview}
              </button>
              <button
                onClick={handleFinishAndOpenNextWeek}
                className="px-5 py-2 rounded-none bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:opacity-95 text-white border-2 border-[#2D2621] dark:border-[#EDE5DD]/40 font-hand font-bold text-sm sm:text-base sketch-shadow-sm sketch-btn-press transition-all flex items-center justify-center gap-1.5"
              >
                <span>{t.actions.startNextWeek} ({t.week} {nextWeekDetails.weekNumber})</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
              <p className="text-sm sm:text-base text-[#6A5C52] dark:text-[#BA9F83] italic font-hand">
                {t.reviewModal.description}
              </p>

              {/* Section 1: Evaluate Goals */}
              <div className="space-y-3">
                <h4 className="text-2xs sm:text-xs font-bold uppercase tracking-wider text-[#8A796D] dark:text-[#BA9F83] font-sans">
                  {t.reviewModal.step1Title}
                </h4>

                {currentWeekPlan.goals.length === 0 ? (
                  <div className="p-4 rounded-none bg-[#F7F2EB] dark:bg-[#1E1B18] border border-dashed border-[#BA9F83] text-[#6A5C52] text-xs text-center font-hand">
                    Für diese Woche wurden keine Ziele hinterlegt.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {currentWeekPlan.goals.map((goal) => {
                      const currentEval = evaluations[goal.id] || { status: 'good', comment: '' };
                      const isCarried = carryOverIds.includes(goal.id);

                      return (
                        <div
                          key={goal.id}
                          className="p-3 sm:p-3.5 rounded-none bg-white dark:bg-[#1E1B18] border border-[#574A40]/25 dark:border-[#EDE5DD]/20 shadow-pencil-sm space-y-2.5"
                        >
                          {/* Goal Item Description */}
                          <div className="flex items-start gap-2.5">
                            <span className="p-1.5 rounded-none bg-[#FAF6F0] dark:bg-[#2D2621] border border-[#574A40]/20 dark:border-[#EDE5DD]/20 mt-0.5 shrink-0 flex items-center justify-center shadow-pencil-sm">
                              {getCategoryIcon(goal.category, currentEval.status)}
                            </span>
                            <span className="text-xs sm:text-sm font-sans font-medium text-[#2D2621] dark:text-[#EDE5DD] flex-1 leading-snug pt-1">
                              {goal.description}
                            </span>
                          </div>

                          {/* Status Radio Buttons (Good / Partly / Poor) */}
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'good')}
                              className={`py-1.5 px-1 sm:px-2 rounded-none text-sm font-hand font-bold flex items-center justify-center gap-1.5 transition-all min-h-[38px] sketch-btn-press ${
                                currentEval.status === 'good'
                                  ? 'bg-[#EEF5ED] dark:bg-[#203322] text-[#2F612C] dark:text-[#A6D6A2] border border-[#4D7A4A] shadow-pencil-sm'
                                  : 'bg-[#FAF6F0]/80 dark:bg-[#25201C] text-[#6A5C52] dark:text-[#BA9F83] border border-[#574A40]/20 dark:border-[#EDE5DD]/20 hover:border-[#4D7A4A]/50'
                              }`}
                            >
                              <CategoryIcon category={goal.category} variant="achieved" size={20} className="w-5 h-5 shrink-0" />
                              <span className="truncate">{t.status.good}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'partly')}
                              className={`py-1.5 px-1 sm:px-2 rounded-none text-sm font-hand font-bold flex items-center justify-center gap-1.5 transition-all min-h-[38px] sketch-btn-press ${
                                currentEval.status === 'partly'
                                  ? 'bg-[#FDF7EA] dark:bg-[#342714] text-[#8C5212] dark:text-[#F3D190] border border-[#C97A1E] shadow-pencil-sm'
                                  : 'bg-[#FAF6F0]/80 dark:bg-[#25201C] text-[#6A5C52] dark:text-[#BA9F83] border border-[#574A40]/20 dark:border-[#EDE5DD]/20 hover:border-[#C97A1E]/50'
                              }`}
                            >
                              <CategoryIcon category={goal.category} variant="partial" size={20} className="w-5 h-5 shrink-0" />
                              <span className="truncate">{t.status.partly}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'poor')}
                              className={`py-1.5 px-1 sm:px-2 rounded-none text-sm font-hand font-bold flex items-center justify-center gap-1.5 transition-all min-h-[38px] sketch-btn-press ${
                                currentEval.status === 'poor'
                                  ? 'bg-[#FDF0EE] dark:bg-[#361914] text-[#9E352B] dark:text-[#F3A59C] border border-[#C44B40] shadow-pencil-sm'
                                  : 'bg-[#FAF6F0]/80 dark:bg-[#25201C] text-[#6A5C52] dark:text-[#BA9F83] border border-[#574A40]/20 dark:border-[#EDE5DD]/20 hover:border-[#C44B40]/50'
                              }`}
                            >
                              <CategoryIcon category={goal.category} variant="not_achieved" size={20} className="w-5 h-5 shrink-0" />
                              <span className="truncate">{t.status.poor}</span>
                            </button>
                          </div>

                          {/* Optional Goal Comment */}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={currentEval.comment}
                              onChange={(e) => handleCommentChange(goal.id, e.target.value)}
                              placeholder="Kurze Reflexion notieren..."
                              className="w-full text-xs p-2.5 rounded-none border border-[#574A40]/25 dark:border-[#EDE5DD]/20 bg-white/95 dark:bg-[#25201C] text-[#2D2621] dark:text-[#EDE5DD] placeholder-[#8A796D] focus:outline-none focus:ring-1 focus:ring-[#D7195F] font-sans"
                            />
                          </div>

                          {/* Carry over toggle */}
                          <div className="flex items-center justify-between pt-0.5 text-2xs sm:text-xs">
                            <label className="flex items-center gap-2 cursor-pointer select-none text-[#6A5C52] dark:text-[#BA9F83] py-0.5 font-sans">
                              <input
                                type="checkbox"
                                checked={isCarried}
                                onChange={() => toggleCarryOver(goal.id)}
                                className="w-3.5 h-3.5 rounded-none border-[#574A40]/40 text-[#D7195F] focus:ring-[#D7195F]"
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
              <div className="space-y-2 pt-2 border-t border-dashed border-[#574A40]/20 dark:border-[#EDE5DD]/15">
                <h4 className="text-2xs sm:text-xs font-bold uppercase tracking-wider text-[#8A796D] dark:text-[#BA9F83] font-sans">
                  {t.actions.addReflection}
                </h4>
                <textarea
                  value={generalReflection}
                  onChange={(e) => setGeneralReflection(e.target.value)}
                  placeholder={t.reviewModal.generalReflectionPlaceholder}
                  rows={3}
                  className="w-full text-xs sm:text-sm p-3 rounded-none border border-[#574A40]/30 dark:border-[#EDE5DD]/25 bg-white dark:bg-[#1E1B18] text-[#2D2621] dark:text-[#EDE5DD] placeholder-[#8A796D] focus:outline-none focus:ring-1 focus:ring-[#D7195F] font-sans"
                />
              </div>
            </div>

            {/* Sticky Submit Action Bar */}
            <div className="p-3 sm:p-4 bg-[#FAF6F0]/90 dark:bg-[#1C1917]/90 border-t border-[#574A40]/20 dark:border-[#EDE5DD]/15 flex items-center justify-between gap-3 shrink-0 pb-safe">
              <button
                type="button"
                onClick={onClose}
                className="relative px-3.5 py-2 rounded-none text-[#2D2621] dark:text-[#EDE5DD] hover:bg-[#EFE6DA] dark:hover:bg-[#2D2420] text-sm font-hand font-bold transition-all sketch-btn-press shadow-pencil-sm"
              >
                <RoughBorder borderRadius={0} width={1.0} opacity={0.4} />
                <span className="relative z-10">{t.actions.cancel}</span>
              </button>
              <button
                type="submit"
                className="relative flex-1 sm:flex-initial px-5 py-2 rounded-none bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:opacity-95 text-white font-hand font-bold text-sm sm:text-base shadow-pencil-sm transition-all flex items-center justify-center gap-1.5 sketch-btn-press"
              >
                <RoughBorder borderRadius={0} color="#574A40" darkColor="#EDE5DD" opacity={0.45} />
                <Sparkles className="w-4 h-4 stroke-[2.2] shrink-0 text-[#FFE2CD] relative z-10" />
                <span className="truncate relative z-10">{t.reviewModal.finishButton}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
