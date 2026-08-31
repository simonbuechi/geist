import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  MinusCircle, 
  XCircle, 
  ArrowRight, 
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { GoalStatus, Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useGoals } from '../context/GoalsContext';
import { formatWeekRange, parseWeekId, getNextWeekId } from '../utils/dateUtils';
import { CategoryIcon } from './CategoryIcon';

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
  const [evaluations, setEvaluations] = useState<Record<string, { status: GoalStatus; comment: string }>>(() => {
    const initial: Record<string, { status: GoalStatus; comment: string }> = {};
    currentWeekPlan.goals.forEach(goal => {
      initial[goal.id] = {
        status: goal.status === 'pending' ? 'good' : goal.status,
        comment: goal.comment || ''
      };
    });
    return initial;
  });

  const [generalReflection, setGeneralReflection] = useState(currentWeekPlan.generalReflection || '');
  const [carryOverIds, setCarryOverIds] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

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

    // Trigger joyful confetti with primary palette
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9123A6', '#D7195F', '#c084fc', '#f472b6', '#fb7185', '#a855f7']
    });

    setIsSuccess(true);
  };

  const handleFinishAndOpenNextWeek = () => {
    selectWeek(nextWeekId);
    onClose();
    setIsSuccess(false);
  };

  const getCategoryIcon = (cat: Category) => {
    return <CategoryIcon category={cat} className="w-4 h-4 text-[#9123A6] dark:text-[#f472b6]" size={16} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-t-[28px] sm:rounded-3xl shadow-2xl border-t sm:border border-stone-200 dark:border-stone-800 h-[92vh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in">
        
        {/* Mobile Drag / Sheet Handle Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 bg-gradient-to-r from-[#9123A6] to-[#D7195F] flex justify-center shrink-0">
          <div className="w-10 h-1 bg-white/40 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 py-3.5 sm:p-6 bg-gradient-to-r from-[#9123A6] to-[#D7195F] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 rounded-2xl bg-white/15 backdrop-blur-md shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-serif font-bold tracking-tight">
                {t.reviewModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-pink-100/90 font-sans">
                {t.week} {weekNumber} • {formatWeekRange(startDate, endDate, language)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/15 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 flex-1 flex flex-col items-center justify-center text-center gap-4 overflow-y-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-[#9123A6] dark:text-[#f472b6] shadow-md shrink-0">
              <Check className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h4 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-50">
              {t.reviewModal.successMessage}
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md">
              Deine Reflexion wurde gespeichert. Bereit für die nächste Woche ({t.week} {nextWeekDetails.weekNumber})?
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mt-4 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-sm transition-colors active:scale-95"
              >
                {t.actions.close}
              </button>
              <button
                onClick={handleFinishAndOpenNextWeek}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:from-[#7e1c91] hover:to-[#c21453] text-white font-medium text-sm shadow-md shadow-[#9123A6]/20 hover:shadow-lg hover:shadow-[#D7195F]/30 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{t.actions.startNextWeek} (KW {nextWeekDetails.weekNumber})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 overscroll-contain">
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 italic font-serif">
                {t.reviewModal.description}
              </p>

              {/* Section 1: Evaluate Goals */}
              <div className="space-y-3.5 sm:space-y-4">
                <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {t.reviewModal.step1Title}
                </h4>

                {currentWeekPlan.goals.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-500 text-sm text-center">
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
                          className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 space-y-2.5 sm:space-y-3"
                        >
                          {/* Goal Item Description */}
                          <div className="flex items-start gap-2.5">
                            <span className="p-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 mt-0.5 shrink-0">
                              {getCategoryIcon(goal.category)}
                            </span>
                            <span className="text-sm font-medium text-stone-900 dark:text-stone-100 flex-1 leading-snug">
                              {goal.description}
                            </span>
                          </div>

                          {/* Status Radio Buttons (Good / Partly / Poor) */}
                          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'good')}
                              className={`py-2 sm:py-2 px-1 sm:px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all min-h-[42px] active:scale-95 ${
                                currentEval.status === 'good'
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-semibold'
                                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{t.status.good}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'partly')}
                              className={`py-2 sm:py-2 px-1 sm:px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all min-h-[42px] active:scale-95 ${
                                currentEval.status === 'partly'
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs font-semibold'
                                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-500'
                              }`}
                            >
                              <MinusCircle className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{t.status.partly}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(goal.id, 'poor')}
                              className={`py-2 sm:py-2 px-1 sm:px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all min-h-[42px] active:scale-95 ${
                                currentEval.status === 'poor'
                                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs font-semibold'
                                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-rose-500'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{t.status.poor}</span>
                            </button>
                          </div>

                          {/* Optional Goal Comment */}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={currentEval.comment}
                              onChange={(e) => handleCommentChange(goal.id, e.target.value)}
                              placeholder="Kurze Reflexion zu diesem Ziel..."
                              className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          {/* Carry over toggle */}
                          <div className="flex items-center justify-between pt-1 text-xs">
                            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600 dark:text-stone-300 py-1">
                              <input
                                type="checkbox"
                                checked={isCarried}
                                onChange={() => toggleCarryOver(goal.id)}
                                className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
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
              <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {t.actions.addReflection}
                </h4>
                <textarea
                  value={generalReflection}
                  onChange={(e) => setGeneralReflection(e.target.value)}
                  placeholder={t.reviewModal.generalReflectionPlaceholder}
                  rows={3}
                  className="w-full text-sm p-3 rounded-2xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-sans"
                />
              </div>
            </div>

            {/* Sticky Submit Action Bar */}
            <div className="p-3.5 sm:p-4 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0 pb-safe">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs sm:text-sm font-medium transition-colors active:scale-95"
              >
                {t.actions.cancel}
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:from-[#7e1c91] hover:to-[#c21453] text-white font-medium text-xs sm:text-sm shadow-md shadow-[#9123A6]/20 hover:shadow-lg hover:shadow-[#D7195F]/30 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.reviewModal.finishButton}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
