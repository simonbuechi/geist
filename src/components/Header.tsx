import React from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  User as UserIcon,
  Check,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useGoals } from '../context/GoalsContext';
import { 
  formatWeekRange, 
  parseWeekId, 
  getPreviousWeekId, 
  getNextWeekId 
} from '../utils/dateUtils';

import { KgsLogo } from './KgsLogo';

interface HeaderProps {
  onOpenReview: () => void;
  onOpenAuth: () => void;
  isHistoryView: boolean;
  onToggleHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReview,
  onOpenAuth,
  isHistoryView,
  onToggleHistory
}) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { 
    currentWeekId, 
    realCurrentWeekId,
    unreviewedPastWeekId,
    currentWeekPlan,
    selectWeek, 
    goToCurrentWeek,
    isWeekAccessible
  } = useGoals();

  const { weekNumber, startDate, endDate } = parseWeekId(currentWeekId);
  const nextWeekId = getNextWeekId(currentWeekId);
  const isNextAccessible = isWeekAccessible(nextWeekId);
  const activeWorkingWeekId = unreviewedPastWeekId || realCurrentWeekId;
  const isCurrent = currentWeekId === activeWorkingWeekId;

  const handleNextWeek = () => {
    if (!isNextAccessible) {
      onOpenReview();
    } else {
      selectWeek(nextWeekId);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-stone-50/90 dark:bg-[#121614]/90 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors pt-safe">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex flex-col gap-2.5 sm:gap-3">
        {/* Top bar: Brand & Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button 
              onClick={() => {
                if (isHistoryView) onToggleHistory();
                goToCurrentWeek();
              }}
              className="text-left group flex items-center gap-2 sm:gap-2.5 focus:outline-none min-w-0"
              aria-label="Home"
            >
              <KgsLogo size={30} className="sm:w-8 sm:h-8 transition-transform group-hover:scale-105" />
              <h1 className="text-sm sm:text-base font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50 truncate">
                {t.appTitle}
              </h1>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* History Toggle */}
            <button
              onClick={onToggleHistory}
              title={t.history}
              aria-label={t.history}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 min-h-[34px] flex items-center justify-center ${
                isHistoryView
                  ? 'bg-gradient-to-r from-[#9123A6] to-[#D7195F] text-white shadow-xs'
                  : 'bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-300/60 dark:hover:bg-stone-700'
              }`}
            >
              <span>{t.history}</span>
            </button>

            {/* User / Settings Profile */}
            <button
              onClick={onOpenAuth}
              title={user ? `${user.displayName || user.email || 'Konto'} (Angemeldet)` : `${t.auth.guestMode} (Lokal)`}
              aria-label="Settings and Profile"
              className="relative w-9 h-9 sm:w-auto sm:h-auto p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-stone-700 active:scale-95 transition-all flex items-center justify-center min-h-[36px]"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
              {/* Status Dot */}
              <span 
                className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-stone-100 dark:ring-stone-800 ${
                  user ? 'bg-emerald-500' : 'bg-stone-400 dark:bg-stone-500'
                }`} 
              />
            </button>
          </div>
        </div>

        {/* Bottom bar: Week Navigator & Main Action */}
        {!isHistoryView && (
          <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-stone-200/50 dark:border-stone-800/50">
            {/* Week Switcher */}
            <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial min-w-0">
              <button
                onClick={() => selectWeek(getPreviousWeekId(currentWeekId))}
                className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 active:scale-90 transition-all shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
                title="Vorherige Woche"
                aria-label="Vorherige Woche"
              >
                <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/60 dark:border-stone-800/60 shadow-2xs flex-1 sm:flex-initial min-w-0">
                <Calendar className="w-3.5 h-3.5 text-[#9123A6] dark:text-[#f1add4] shrink-0" />
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                  {t.week} {weekNumber}
                </span>
                {currentWeekPlan.reviewedAt && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 text-2xs font-semibold shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                    <span className="hidden xs:inline">{t.reviewed}</span>
                  </span>
                )}
                <span className="text-stone-300 dark:text-stone-700 text-xs shrink-0">•</span>
                <span className="text-2xs sm:text-xs text-stone-500 dark:text-stone-400 truncate font-medium">
                  {formatWeekRange(startDate, endDate, language)}
                </span>
              </div>

              <button
                onClick={handleNextWeek}
                className={`p-1.5 rounded-xl transition-all shrink-0 min-h-[32px] min-w-[32px] flex items-center justify-center ${
                  !isNextAccessible
                    ? 'text-stone-400 dark:text-stone-500 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 active:scale-90'
                }`}
                title={!isNextAccessible ? t.unlockNextWeek : "Nächste Woche"}
                aria-label={!isNextAccessible ? t.unlockNextWeek : "Nächste Woche"}
              >
                {!isNextAccessible ? (
                  <Lock className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {!isCurrent && (
                <button
                  onClick={goToCurrentWeek}
                  className="text-2xs px-2 py-1 rounded-xl bg-pink-50 dark:bg-pink-950/70 text-[#9123A6] dark:text-[#f8d2e8] border border-pink-200/60 dark:border-pink-900/60 hover:bg-pink-100 dark:hover:bg-pink-900/70 active:scale-95 transition-all font-medium shrink-0"
                >
                  {t.backToCurrentWeek}
                </button>
              )}
            </div>

            {/* Review & Plan Main CTA Button (Desktop/Tablet) */}
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <button
                onClick={onOpenReview}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:from-[#7e1c91] hover:to-[#c21453] text-white font-medium text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 group active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                <span>{currentWeekPlan.reviewedAt ? t.viewReview : t.reviewAndPlan}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
