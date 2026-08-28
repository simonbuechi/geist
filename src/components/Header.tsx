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
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-stone-50/90 dark:bg-[#121614]/90 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col gap-3">
        {/* Top bar: Brand & Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (isHistoryView) onToggleHistory();
                goToCurrentWeek();
              }}
              className="text-left group flex items-center gap-3 focus:outline-none"
            >
              <KgsLogo size={42} />
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-stone-900 dark:text-stone-50 flex items-center gap-1.5">
                  {t.appTitle}
                </h1>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-sans hidden sm:block">
                  {t.tagline}
                </p>
              </div>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* History Toggle (Text only, no icon) */}
            <button
              onClick={onToggleHistory}
              title={t.history}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
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
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-stone-700 transition-colors"
            >
              <span>{language}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-stone-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>

            {/* User / Settings Profile (Icon only with status indicator) */}
            <button
              onClick={onOpenAuth}
              title={user ? `${user.displayName || user.email || 'Konto'} (Angemeldet)` : `${t.auth.guestMode} (Lokal)`}
              className="relative p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-stone-700 transition-colors flex items-center justify-center"
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
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-200/50 dark:border-stone-800/50">
            {/* Week Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => selectWeek(getPreviousWeekId(currentWeekId))}
                className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors"
                title="Vorherige Woche"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/60 dark:border-stone-800/60 shadow-2xs">
                <Calendar className="w-4 h-4 text-[#9123A6] dark:text-[#f1add4]" />
                <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {t.calendarWeek} {weekNumber}
                </span>
                <span className="text-stone-400 dark:text-stone-600 text-xs">•</span>
                <span className="text-xs text-stone-600 dark:text-stone-300">
                  {formatWeekRange(startDate, endDate, language)}
                </span>
              </div>

              <button
                onClick={() => selectWeek(getNextWeekId(currentWeekId))}
                className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors"
                title="Nächste Woche"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {!isCurrent && (
                <button
                  onClick={goToCurrentWeek}
                  className="ml-1 text-xs px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/70 text-[#9123A6] dark:text-[#f8d2e8] border border-pink-200/60 dark:border-pink-900/60 hover:bg-pink-100 dark:hover:bg-pink-900/70 transition-colors font-medium"
                >
                  {t.backToCurrentWeek}
                </button>
              )}
            </div>

            {/* Review & Plan Main CTA Button */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onOpenReview}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:from-[#7e1c91] hover:to-[#c21453] text-white font-medium text-xs sm:text-sm shadow-md shadow-[#9123A6]/20 hover:shadow-lg hover:shadow-[#D7195F]/30 transition-all flex items-center gap-2 group active:scale-95"
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
