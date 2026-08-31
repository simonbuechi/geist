import React, { useState } from 'react';
import { 
  History, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  MinusCircle, 
  XCircle, 
  ArrowLeft, 
  Quote 
} from 'lucide-react';
import { useGoals } from '../context/GoalsContext';
import { useLanguage } from '../context/LanguageContext';
import { parseWeekId, formatWeekRange } from '../utils/dateUtils';
import type { Category, GoalStatus } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface HistoryViewProps {
  onClose: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onClose }) => {
  const { t, language } = useLanguage();
  const { allWeekPlans, selectWeek } = useGoals();
  const [expandedWeekId, setExpandedWeekId] = useState<string | null>(null);

  // Sort week plans in descending order (newest first)
  const sortedPlans = Object.values(allWeekPlans).sort((a, b) => {
    return b.id.localeCompare(a.id);
  });

  const getCategoryIcon = (category: Category) => {
    return <CategoryIcon category={category} className="w-3.5 h-3.5 text-[#9123A6] dark:text-[#f472b6]" size={14} />;
  };

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case 'good': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'partly': return <MinusCircle className="w-4 h-4 text-amber-500" />;
      case 'poor': return <XCircle className="w-4 h-4 text-rose-500" />;
      default: return <div className="w-3.5 h-3.5 rounded-full border border-stone-400" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in pb-20 md:pb-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            aria-label="Back"
            className="w-10 h-10 rounded-xl bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-stone-700 active:scale-95 transition-all flex items-center justify-center shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-50">
              {t.historyTitle}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
              Deine bisherigen Wochen und Erfolge im Rückblick
            </p>
          </div>
        </div>
      </div>

      {sortedPlans.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <History className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-stone-400" />
          <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-800 dark:text-stone-200">
            {t.historyView.noHistoryYet}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            {t.historyView.noHistorySub}
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {sortedPlans.map((plan) => {
            const { weekNumber, year, startDate, endDate } = parseWeekId(plan.id);
            const isExpanded = expandedWeekId === plan.id;
            const goals = plan.goals || [];
            const goodCount = goals.filter(g => g.status === 'good').length;
            const partlyCount = goals.filter(g => g.status === 'partly').length;
            const poorCount = goals.filter(g => g.status === 'poor').length;

            return (
              <div
                key={plan.id}
                className="rounded-3xl bg-white dark:bg-[#161c19] border border-stone-200/80 dark:border-stone-800/80 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
              >
                {/* Week summary header */}
                <div
                  onClick={() => setExpandedWeekId(isExpanded ? null : plan.id)}
                  className="p-3.5 sm:p-5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 cursor-pointer hover:bg-stone-50/50 dark:hover:bg-stone-800/40 active:bg-stone-100/50 dark:active:bg-stone-800/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="px-2.5 sm:px-3 h-10 sm:h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-serif font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 whitespace-nowrap">
                      {t.week} {weekNumber}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 flex-wrap">
                        <span>{t.week} {weekNumber} ({year})</span>
                        {plan.reviewedAt && (
                          <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-medium whitespace-nowrap">
                            ✓ {t.reviewWeek}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {formatWeekRange(startDate, endDate, language)}
                      </p>
                    </div>
                  </div>

                  {/* Goal Outcome Pills */}
                  <div className="flex items-center gap-2 sm:gap-4 ml-auto shrink-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium">
                      <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {goodCount}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                        <MinusCircle className="w-3.5 h-3.5" />
                        {partlyCount}
                      </span>
                      <span className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400">
                        <XCircle className="w-3.5 h-3.5" />
                        {poorCount}
                      </span>
                    </div>

                    <div className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300">
                      {goals.length} {t.historyView.totalGoals}
                    </div>

                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-stone-100 dark:border-stone-800/80 space-y-4 animate-slide-up">
                    {/* General Reflection if available */}
                    {plan.generalReflection && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 flex items-start gap-2.5">
                        <Quote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-stone-700 dark:text-stone-300 italic font-serif leading-relaxed">
                          „{plan.generalReflection}“
                        </p>
                      </div>
                    )}

                    {/* Goals List organized by Dimension */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(['body', 'mind', 'soul'] as Category[]).map(cat => {
                        const catGoals = goals.filter(g => g.category === cat);
                        return (
                          <div key={cat} className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 space-y-2">
                            <div className="flex items-center gap-1.5 font-medium text-xs text-stone-600 dark:text-stone-300">
                              {getCategoryIcon(cat)}
                              <span className="capitalize">{t.categories[cat].title}</span>
                              <span className="text-stone-400">({catGoals.length})</span>
                            </div>
                            {catGoals.length === 0 ? (
                              <p className="text-2xs text-stone-400 italic">Keine Ziele</p>
                            ) : (
                              <div className="space-y-1.5">
                                {catGoals.map(g => (
                                  <div key={g.id} className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/50 dark:border-stone-700 text-xs flex items-start gap-2">
                                    <span className="mt-0.5 shrink-0">{getStatusIcon(g.status)}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-stone-800 dark:text-stone-200 leading-snug break-words">
                                        {g.description}
                                      </p>
                                      {g.comment && (
                                        <p className="text-2xs text-stone-500 italic mt-0.5">
                                          „{g.comment}“
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Switch to this week button */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          selectWeek(plan.id);
                          onClose();
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 sm:py-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-stone-700 dark:text-stone-300 text-xs font-medium active:scale-95 transition-all flex items-center justify-center"
                      >
                        Diese Woche öffnen & bearbeiten →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
