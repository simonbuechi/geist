import React from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Sun, 
  Moon, 
  User as UserIcon 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useGoals } from '../context/GoalsContext';
import { 
  formatWeekRange, 
  parseWeekId, 
  getPreviousWeekId, 
  getNextWeekId, 
  isCurrentWeekId 
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
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { 
    currentWeekId, 
    selectWeek, 
    goToCurrentWeek 
  } = useGoals();

  const { weekNumber, startDate, endDate } = parseWeekId(currentWeekId);
  const isCurrent = isCurrentWeekId(currentWeekId);

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
              className="text-left group flex items-center gap-2.5 sm:gap-3 focus:outline-none min-w-0"
              aria-label="Home"
            >
              <KgsLogo size={36} className="sm:w-[42px] sm:h-[42px]" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-serif font-semibold tracking-tight text-stone-900 dark:text-stone-50 truncate">
                  {t.appTitle}
                </h1>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-sans hidden sm:block truncate">
                  {t.tagline}
                </p>
              </div>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* History Toggle */}
            <button
              onClick={onToggleHistory}
              title={t.history}
              aria-label={t.history}
              className={`px-2.5 py-1.5 sm:px-3 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95 min-h-[36px] flex items-center justify-center ${
                isHistoryView
                  ? 'bg-gradient-to-r from-[#9123A6] to-[#D7195F] text-white shadow-sm'
                  : 'bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-300/60 dark:hover:bg-stone-700'
              }`}
            >
              <span>{t.history}</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              title={language === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
              aria-label="Change Language"
              className="w-9 h-9 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-stone-700 active:scale-95 transition-all flex items-center justify-center"
            >
              <span>{language}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              aria-label="Toggle Theme"
              className="w-9 h-9 sm:w-auto sm:h-auto p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-stone-700 active:scale-95 transition-all flex items-center justify-center"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>

            {/* User / Settings Profile */}
            <button
              onClick={onOpenAuth}
              title={user ? `${user.displayName || user.email || 'Konto'} (Angemeldet)` : `${t.auth.guestMode} (Lokal)`}
              aria-label="User Profile"
              className="relative w-9 h-9 sm:w-auto sm:h-auto p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-stone-700 active:scale-95 transition-all flex items-center justify-center"
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
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9123A6] dark:text-[#f1add4] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                  {t.calendarWeek} {weekNumber}
                </span>
                <span className="text-stone-400 dark:text-stone-600 text-xs hidden xs:inline">•</span>
                <span className="text-2xs sm:text-xs text-stone-600 dark:text-stone-300 truncate hidden xs:inline">
                  {formatWeekRange(startDate, endDate, language)}
                </span>
              </div>

              <button
                onClick={() => selectWeek(getNextWeekId(currentWeekId))}
                className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 active:scale-90 transition-all shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
                title="Nächste Woche"
                aria-label="Nächste Woche"
              >
                <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4" />
              </button>

              {!isCurrent && (
                <button
                  onClick={goToCurrentWeek}
                  className="text-2xs sm:text-xs px-2 sm:px-2.5 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/70 text-[#9123A6] dark:text-[#f8d2e8] border border-pink-200/60 dark:border-pink-900/60 hover:bg-pink-100 dark:hover:bg-pink-900/70 active:scale-95 transition-all font-medium shrink-0"
                >
                  {t.backToCurrentWeek}
                </button>
              )}
            </div>

            {/* Review & Plan Main CTA Button (Desktop/Tablet) */}
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <button
                onClick={onOpenReview}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:from-[#7e1c91] hover:to-[#c21453] text-white font-medium text-sm shadow-md shadow-[#9123A6]/20 hover:shadow-lg hover:shadow-[#D7195F]/30 transition-all flex items-center gap-2 group active:scale-95"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>{t.reviewAndPlan}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
