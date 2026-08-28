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
    switch (cat) {
      case 'body': return <CategoryIcon category="body" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" size={16} />;
      case 'mind': return <CategoryIcon category="mind" className="w-4 h-4 text-sky-600 dark:text-sky-400" size={16} />;
      case 'soul': return <CategoryIcon category="soul" className="w-4 h-4 text-red-600 dark:text-red-400" size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 my-8 overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#9123A6] to-[#D7195F] text-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                {t.reviewModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-pink-100/90 mt-1 font-sans">
                {t.calendarWeek} {weekNumber} • {formatWeekRange(startDate, endDate, language)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-[#9123A6] dark:text-[#f472b6] shadow-md">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-50">
              {t.reviewModal.successMessage}
            </h4>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md">
              Deine Reflexion wurde gespeichert. Bereit für die nächste Woche (KW {nextWeekDetails.weekNumber})?
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-sm transition-colors"
              >
                {t.actions.close}
              </button>
              <button
                onClick={handleFinishAndOpenNextWeek}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:from-[#7e1c91] hover:to-[#c21453] text-white font-medium text-sm shadow-md shadow-[#9123A6]/20 hover:shadow-lg hover:shadow-[#D7195F]/30 transition-all flex items-center gap-2"
              >
                <span>{t.actions.startNextWeek} (KW {nextWeekDetails.weekNumber})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            <p className="text-sm text-stone-600 dark:text-stone-300 italic font-serif">
              {t.reviewModal.description}
            </p>

            {/* Section 1: Evaluate Goals */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
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
                        className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 space-y-3"
                      >
                        {/* Goal Item Description */}
                        <div className="flex items-start gap-2.5">
                          <span className="p-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 mt-0.5">
                            {getCategoryIcon(goal.category)}
                          </span>
                          <span className="text-sm font-medium text-stone-900 dark:text-stone-100 flex-1">
                            {goal.description}
                          </span>
                        </div>

                        {/* Status Radio Buttons (Good / Partly / Poor) */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(goal.id, 'good')}
                            className={`p-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                              currentEval.status === 'good'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-102 font-semibold'
                                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.status.good}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(goal.id, 'partly')}
                            className={`p-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                              currentEval.status === 'partly'
                                ? 'bg-amber-500 text-white border-amber-500 shadow-xs scale-102 font-semibold'
                                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-500'
                            }`}
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                            <span>{t.status.partly}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(goal.id, 'poor')}
                            className={`p-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                              currentEval.status === 'poor'
                                ? 'bg-rose-600 text-white border-rose-600 shadow-xs scale-102 font-semibold'
                                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-rose-500'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{t.status.poor}</span>
                          </button>
                        </div>

                        {/* Optional Goal Comment */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={currentEval.comment}
                            onChange={(e) => handleCommentChange(goal.id, e.target.value)}
                            placeholder="Kurze Reflexion / Erkenntnis zu diesem Ziel..."
                            className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Carry over toggle */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600 dark:text-stone-300">
                            <input
                              type="checkbox"
                              checked={isCarried}
                              onChange={() => toggleCarryOver(goal.id)}
                              className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
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
              <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
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

            {/* Submit Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium transition-colors"
              >
                {t.actions.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:from-[#7e1c91] hover:to-[#c21453] text-white font-medium text-sm shadow-md shadow-[#9123A6]/20 hover:shadow-lg hover:shadow-[#D7195F]/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.reviewModal.finishButton}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
