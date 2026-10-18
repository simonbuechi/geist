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
import { IconButton } from './IconButton';
import { RoughBorder } from './RoughBorder';
import { RoughDivider } from './RoughDivider';
import { RoughButton } from './RoughButton';

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
        return <div className="w-2.5 h-2.5 rounded-full bg-[#8C7E72]/40 mt-1.5" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-1 sm:px-2 py-2 sm:py-4 space-y-5 animate-fade-in pb-20 md:pb-6">
      {/* Header Bar with notebook sheet styling */}
      <div className="relative flex items-center justify-between gap-3 p-4 sm:p-5 bg-[#FCF9F4] dark:bg-[#221F1D] shadow-notebook overflow-hidden">
        <RoughBorder borderRadius={2} width={1.2} color="#8C7E72" darkColor="#7A6F66" opacity={0.45} />
        <div className="relative z-10 flex items-center gap-3.5">
          <IconButton
            onClick={onClose}
            title={t.actions.cancel || 'Zurück'}
            aria-label="Zurück"
            variant="default"
            size="md"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          </IconButton>
          <div>
            <h2 className="text-xl sm:text-2xl font-hand font-bold text-[#332B25] dark:text-[#EAE2D9] tracking-wide">
              {t.historyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6F66] dark:text-[#A3968B] font-serif italic">
              Deine bisherigen Wochen und Notizen im Rückblick
            </p>
          </div>
        </div>
      </div>

      {sortedPlans.length === 0 ? (
        <div className="relative p-10 sm:p-14 text-center bg-[#FCF9F4] dark:bg-[#221F1D] shadow-notebook space-y-2.5 overflow-hidden">
          <RoughBorder borderRadius={2} width={1.1} color="#8C7E72" opacity={0.4} />
          <History className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-[#8C7E72] stroke-[1.8]" />
          <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#332B25] dark:text-[#EAE2D9]">
            {t.historyView.noHistoryYet}
          </h3>
          <p className="text-xs sm:text-sm text-[#7A6F66] dark:text-[#A3968B] max-w-sm mx-auto font-serif italic">
            {t.historyView.noHistorySub}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {sortedPlans.map((plan, idx) => {
            const { weekNumber, year, startDate, endDate } = parseWeekId(plan.id);
            const isExpanded = expandedWeekId === plan.id;
            const goals = plan.goals || [];
            const goodCount = goals.filter(g => g.status === 'good').length;
            const partlyCount = goals.filter(g => g.status === 'partly').length;
            const poorCount = goals.filter(g => g.status === 'poor').length;

            return (
              <div
                key={plan.id}
                className="relative bg-[#FCF9F4] dark:bg-[#221F1D] shadow-notebook transition-all overflow-hidden"
              >
                <RoughBorder borderRadius={2} width={1.1} color="#8C7E72" darkColor="#7A6F66" opacity={0.42} />

                {/* Week summary header */}
                <div
                  onClick={() => setExpandedWeekId(isExpanded ? null : plan.id)}
                  className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-[#F3EDE2]/40 dark:hover:bg-[#2A2623]/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="px-3 py-1 bg-[#F3EDE2] dark:bg-[#2E2A27] border border-[#8C7E72]/30 text-[#332B25] dark:text-[#EAE2D9] font-sans font-semibold text-sm flex items-center justify-center shrink-0 whitespace-nowrap">
                      {t.week} {weekNumber}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base sm:text-lg font-sans font-semibold text-[#332B25] dark:text-[#EAE2D9] flex items-center gap-2 flex-wrap">
                        <span>{t.week} {weekNumber} ({year})</span>
                        {plan.reviewedAt && (
                          <span className="text-2xs px-2 py-0.5 bg-[#F1F6F1] dark:bg-[#1E2A20] text-[#4E7A52] dark:text-[#89B08E] border border-[#557659]/40 font-sans font-semibold whitespace-nowrap">
                            ✓ {t.reviewWeek}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-[#7A6F66] dark:text-[#A3968B] truncate font-serif italic">
                        {formatWeekRange(startDate, endDate, language)}
                      </p>
                    </div>
                  </div>

                  {/* Goal Outcome Pills */}
                  <div className="flex items-center gap-3 sm:gap-4 ml-auto shrink-0">
                    <div className="flex items-center gap-2 text-xs font-sans font-semibold">
                      <span className="flex items-center gap-0.5 text-[#4E7A52] dark:text-[#89B08E]">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" />
                        {goodCount}
                      </span>
                      <span className="flex items-center gap-0.5 text-[#B88028] dark:text-[#E2B467]">
                        <MinusCircle className="w-3.5 h-3.5 stroke-[2.2]" />
                        {partlyCount}
                      </span>
                      <span className="flex items-center gap-0.5 text-[#B84A39] dark:text-[#E2876B]">
                        <XCircle className="w-3.5 h-3.5 stroke-[2.2]" />
                        {poorCount}
                      </span>
                    </div>

                    <div className="px-2.5 py-0.5 bg-[#F3EDE2] dark:bg-[#2E2A27] text-2xs font-sans font-semibold text-[#7A6F66] dark:text-[#A3968B]">
                      {goals.length} {t.historyView.totalGoals}
                    </div>

                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#7A6F66] stroke-[2.2]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#7A6F66] stroke-[2.2]" />
                    )}
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="relative z-10 px-4 sm:px-5 pb-5 pt-1 space-y-4 animate-slide-up">
                    <RoughDivider color="#8C7E72" darkColor="#7A6F66" opacity={0.3} seed={600 + idx} />

                    {/* General Reflection if available */}
                    {plan.generalReflection && (
                      <div className="p-3.5 bg-[#FAF4E8] dark:bg-[#2A2319] border border-[#B88028]/35 flex items-start gap-2.5">
                        <Quote className="w-4 h-4 text-[#B88028] shrink-0 mt-0.5" />
                        <p className="text-sm sm:text-base text-[#5C524B] dark:text-[#C5B9AE] font-hand leading-relaxed">
                          &ldquo;{plan.generalReflection}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Goals List organized by Dimension */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(['body', 'mind', 'soul'] as Category[]).map(cat => {
                        const catGoals = goals.filter(g => g.category === cat);
                        const headerWash = 'bg-[#F3EDE2]/70 dark:bg-[#2A2521] border-[#8C7E72]/25';

                        return (
                          <div key={cat} className={`p-3.5 border ${headerWash} space-y-2.5`}>
                            <div className="flex items-center gap-1.5 font-sans font-semibold text-base text-[#332B25] dark:text-[#EAE2D9]">
                              {getCategoryIcon(cat)}
                              <span className="capitalize">{t.categories[cat].title}</span>
                              <span className="text-xs text-[#7A6F66] font-sans font-normal">({catGoals.length})</span>
                            </div>
                            {catGoals.length === 0 ? (
                              <p className="text-sm text-[#7A6F66] italic font-hand">Keine Notizen</p>
                            ) : (
                              <div className="space-y-2">
                                {catGoals.map(g => (
                                  <div key={g.id} className="p-2.5 bg-[#FCF9F4] dark:bg-[#221F1D] border border-[#8C7E72]/20 text-xs sm:text-sm flex items-start gap-2">
                                    <span className="shrink-0 mt-0.5">{getGoalStatusIcon(g.category, g.status)}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[#332B25] dark:text-[#EAE2D9] font-serif leading-snug break-words">
                                        {g.description}
                                      </p>
                                      {g.comment && (
                                        <p className="text-sm text-[#7A6F66] dark:text-[#A3968B] font-hand mt-0.5">
                                          &ldquo;{g.comment}&rdquo;
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
                      <RoughButton
                        onClick={() => {
                          selectWeek(plan.id);
                          onClose();
                        }}
                        variant="primary"
                        size="md"
                        seed={700 + idx}
                        className="w-full sm:w-auto"
                      >
                        <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
                          Diese Woche öffnen & bearbeiten →
                        </span>
                      </RoughButton>
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
