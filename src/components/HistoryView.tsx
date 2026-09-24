import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  MinusCircle, 
  XCircle,
  History,
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
    return <CategoryIcon category={category} variant="base" size={18} className="w-4.5 h-4.5 object-contain" />;
  };

  const getGoalStatusIcon = (category: Category, status: GoalStatus) => {
    switch (status) {
      case 'good':
      case 'partly':
      case 'poor':
        return <CategoryIcon category={category} status={status} size={18} className="w-4.5 h-4.5 object-contain" />;
      default:
        return <div className="w-3.5 h-3.5 rounded-none border border-[#8A796D]/50" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in pb-20 md:pb-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 sm:pb-4 border-b-2 border-dashed border-[#7A6A5E]/20 dark:border-[#EDE5DD]/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-[#FDFBF7] dark:bg-[#28221D] border border-[#7A6A5E]/40 dark:border-[#EDE5DD]/30 text-[#4A3E36] dark:text-[#EDE5DD] hover:bg-[#F2EAE0] dark:hover:bg-[#322A23] sketch-shadow-sm sketch-btn-press transition-all flex items-center justify-center shrink-0"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
              {t.historyTitle}
            </h2>
            <p className="text-2xs sm:text-xs text-[#7D6E63] dark:text-[#BA9F83] font-sans">
              Deine bisherigen Wochen und Erfolge im Rückblick
            </p>
          </div>
        </div>
      </div>

      {sortedPlans.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-none bg-[#FDFBF7] dark:bg-[#28221D] border-2 border-dashed border-[#BA9F83] space-y-2.5">
          <History className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-[#BA9F83] stroke-[1.8]" />
          <h3 className="text-base sm:text-lg font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
            {t.historyView.noHistoryYet}
          </h3>
          <p className="text-xs sm:text-sm text-[#7D6E63] dark:text-[#BA9F83] max-w-sm mx-auto font-sans">
            {t.historyView.noHistorySub}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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
                className="rounded-none bg-[#FDFBF7] dark:bg-[#28221D] border border-[#7A6A5E]/20 dark:border-[#EDE5DD]/20 shadow-pencil-sm hover:shadow-pencil transition-all overflow-hidden"
              >
                {/* Week summary header */}
                <div
                  onClick={() => setExpandedWeekId(isExpanded ? null : plan.id)}
                  className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-2 sm:gap-3 cursor-pointer hover:bg-[#F5EDE1]/60 dark:hover:bg-[#2F2722] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="px-3 py-1 rounded-none bg-[#EAE0D2] dark:bg-[#342C24] border border-[#7A6A5E]/25 text-[#4A3E36] dark:text-[#EDE5DD] font-hand font-bold text-xs flex items-center justify-center shrink-0 whitespace-nowrap">
                      {t.week} {weekNumber}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD] flex items-center gap-1.5 flex-wrap">
                        <span>{t.week} {weekNumber} ({year})</span>
                        {plan.reviewedAt && (
                          <span className="text-2xs px-2 py-0.2 rounded-none bg-[#EEF5ED] dark:bg-[#203322] text-[#2F612C] dark:text-[#A6D6A2] border border-[#7CA379]/60 font-sans font-semibold whitespace-nowrap">
                            ✓ {t.reviewWeek}
                          </span>
                        )}
                      </h4>
                      <p className="text-2xs sm:text-xs text-[#7D6E63] dark:text-[#BA9F83] truncate font-sans">
                        {formatWeekRange(startDate, endDate, language)}
                      </p>
                    </div>
                  </div>

                  {/* Goal Outcome Pills */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto shrink-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <span className="flex items-center gap-0.5 text-[#2F612C] dark:text-[#A6D6A2]">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" />
                        {goodCount}
                      </span>
                      <span className="flex items-center gap-0.5 text-[#8C5212] dark:text-[#F2CF87]">
                        <MinusCircle className="w-3.5 h-3.5 stroke-[2.2]" />
                        {partlyCount}
                      </span>
                      <span className="flex items-center gap-0.5 text-[#9E352B] dark:text-[#F3A59C]">
                        <XCircle className="w-3.5 h-3.5 stroke-[2.2]" />
                        {poorCount}
                      </span>
                    </div>

                    <div className="px-2 py-0.5 rounded-none bg-[#EAE0D2] dark:bg-[#342C24] text-2xs font-sans font-semibold text-[#7D6E63] dark:text-[#BA9F83]">
                      {goals.length} {t.historyView.totalGoals}
                    </div>

                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#7D6E63] stroke-[2.2]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#7D6E63] stroke-[2.2]" />
                    )}
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-dashed border-[#7A6A5E]/20 dark:border-[#EDE5DD]/15 space-y-3.5 animate-slide-up">
                    {/* General Reflection if available */}
                    {plan.generalReflection && (
                      <div className="p-3.5 rounded-none bg-[#FAF5ED] dark:bg-[#2C231D] border border-[#D4A759]/40 flex items-start gap-2.5 shadow-pencil-sm">
                        <Quote className="w-4 h-4 text-[#C97A1E] shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-[#7D6E63] dark:text-[#BA9F83] italic font-hand leading-relaxed">
                          „{plan.generalReflection}“
                        </p>
                      </div>
                    )}

                    {/* Goals List organized by Dimension */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(['body', 'mind', 'soul'] as Category[]).map(cat => {
                        const catGoals = goals.filter(g => g.category === cat);
                        return (
                          <div key={cat} className="p-3 rounded-none bg-[#FAF5ED] dark:bg-[#201C18] border border-[#7A6A5E]/20 dark:border-[#EDE5DD]/20 space-y-2">
                            <div className="flex items-center gap-1.5 font-hand font-bold text-xs text-[#4A3E36] dark:text-[#EDE5DD]">
                              {getCategoryIcon(cat)}
                              <span className="capitalize">{t.categories[cat].title}</span>
                              <span className="text-[#8C7D71] font-sans font-normal">({catGoals.length})</span>
                            </div>
                            {catGoals.length === 0 ? (
                              <p className="text-2xs text-[#8C7D71] italic font-hand">Keine Ziele</p>
                            ) : (
                              <div className="space-y-1.5">
                                {catGoals.map(g => (
                                  <div key={g.id} className="p-2 rounded-none bg-[#FDFBF7] dark:bg-[#28221D] border border-[#7A6A5E]/15 dark:border-[#EDE5DD]/15 text-xs flex items-start gap-2">
                                    <span className="shrink-0">{getGoalStatusIcon(g.category, g.status)}</span>
                                    <div className="flex-1 min-w-0 font-sans">
                                      <p className="text-[#4A3E36] dark:text-[#EDE5DD] leading-snug break-words">
                                        {g.description}
                                      </p>
                                      {g.comment && (
                                        <p className="text-2xs text-[#7D6E63] dark:text-[#BA9F83] font-hand italic mt-0.5">
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
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          selectWeek(plan.id);
                          onClose();
                        }}
                        className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-none bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:opacity-95 text-white border border-[#7A6A5E]/30 font-hand font-bold text-xs shadow-pencil-sm sketch-btn-press transition-all flex items-center justify-center gap-1"
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
