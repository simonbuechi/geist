import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
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

import { RoughBorder } from './RoughBorder';
import { RoughNotationHighlight } from './RoughNotationHighlight';

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
    <header className="sticky top-0 z-30 w-full bg-transparent transition-colors pt-safe">
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
              <RoughNotationHighlight
                trigger="both"
                animationDuration={500}
                padding={[2, 6, 2, 6]}
                className="cursor-pointer"
              >
                <h1 className="text-2xl sm:text-3xl font-hand font-bold tracking-wide text-[#4A3E36] dark:text-[#EDE5DD] truncate leading-tight">
                  {t.appTitle}
                </h1>
              </RoughNotationHighlight>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* History Toggle */}
            <button
              onClick={onToggleHistory}
              title={t.history}
              aria-label={t.history}
              className={`relative px-3 py-1.5 rounded-none text-sm font-hand font-bold transition-all sketch-btn-press min-h-[34px] flex items-center justify-center ${
                isHistoryView
                  ? 'bg-gradient-to-r from-[#9123A6] to-[#D7195F] text-white shadow-pencil'
                  : 'bg-[#FDFBF7] dark:bg-[#28221D] text-[#4A3E36] dark:text-[#EDE5DD] hover:bg-[#F2EAE0] dark:hover:bg-[#322A23] shadow-pencil-sm'
              }`}
            >
              <RoughBorder borderRadius={0} />
              <span className="relative z-10">{t.history}</span>
            </button>

            {/* User / Settings Profile */}
            <button
              onClick={onOpenAuth}
              title={user ? `${user.displayName || user.email || 'Konto'} (Angemeldet)` : `${t.auth.guestMode} (Lokal)`}
              aria-label="Settings and Profile"
              className="relative w-9 h-9 p-2 rounded-full bg-[#FDFBF7] dark:bg-[#28221D] text-[#4A3E36] dark:text-[#EDE5DD] hover:bg-[#F2EAE0] dark:hover:bg-[#322A23] shadow-pencil-sm sketch-btn-press transition-all flex items-center justify-center min-h-[36px]"
            >
              <RoughBorder shape="circle" />
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-[#7A6A5E]/20 relative z-10" />
              ) : (
                <UserIcon className="w-4 h-4 stroke-[2] relative z-10" />
              )}
              {/* Status Dot */}
              <span 
                className={`absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white dark:border-[#1F1B18] z-20 ${
                  user ? 'bg-[#4D7A4A]' : 'bg-[#BA9F83]'
                }`} 
              />
            </button>
          </div>
        </div>

        {/* Bottom bar: Week Navigator & Main Action */}
        {!isHistoryView && (
          <div className="flex items-center justify-between gap-2 pt-1 sm:pt-2">
            {/* Week Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial min-w-0">
              <button
                onClick={() => selectWeek(getPreviousWeekId(currentWeekId))}
                className="relative p-1.5 rounded-full bg-[#FDFBF7] dark:bg-[#28221D] text-[#4A3E36] dark:text-[#EDE5DD] hover:bg-[#F2EAE0] dark:hover:bg-[#322A23] shadow-pencil-sm sketch-btn-press transition-all shrink-0 min-h-[34px] min-w-[34px] flex items-center justify-center"
                title="Vorherige Woche"
                aria-label="Vorherige Woche"
              >
                <RoughBorder shape="circle" />
                <ChevronLeft className="w-4 h-4 stroke-[2.2] relative z-10" />
              </button>

              <div className="flex items-center justify-center gap-2 px-2 py-1 flex-1 sm:flex-initial min-w-0">
                <span className="text-base sm:text-lg font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD] whitespace-nowrap">
                  {t.week} {weekNumber}
                </span>
                {currentWeekPlan.reviewedAt && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-none bg-[#EEF5ED] dark:bg-[#203322] text-[#2F612C] dark:text-[#A6D6A2] border border-[#7CA379]/60 text-2xs font-semibold shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                    <span className="hidden xs:inline">{t.reviewed}</span>
                  </span>
                )}
                <span className="text-[#C5B4A2] dark:text-[#6E5F54] text-xs shrink-0">•</span>
                <span className="text-2xs sm:text-xs text-[#7D6E63] dark:text-[#BA9F83] truncate font-sans font-medium">
                  {formatWeekRange(startDate, endDate, language)}
                </span>
              </div>

              <button
                onClick={handleNextWeek}
                className={`relative p-1.5 rounded-full transition-all shrink-0 min-h-[34px] min-w-[34px] flex items-center justify-center ${
                  !isNextAccessible
                    ? 'bg-[#EAE0D2]/60 dark:bg-[#28221C] text-[#8C7D71] dark:text-[#7D6E63]'
                    : 'bg-[#FDFBF7] dark:bg-[#28221D] text-[#4A3E36] dark:text-[#EDE5DD] hover:bg-[#F2EAE0] dark:hover:bg-[#322A23] shadow-pencil-sm sketch-btn-press'
                }`}
                title={!isNextAccessible ? t.unlockNextWeek : "Nächste Woche"}
                aria-label={!isNextAccessible ? t.unlockNextWeek : "Nächste Woche"}
              >
                <RoughBorder shape="circle" />
                {!isNextAccessible ? (
                  <Lock className="w-3.5 h-3.5 stroke-[2.2] text-[#8C7D71] relative z-10" />
                ) : (
                  <ChevronRight className="w-4 h-4 stroke-[2.2] relative z-10" />
                )}
              </button>

              {!isCurrent && (
                <button
                  onClick={goToCurrentWeek}
                  className="relative text-xs px-2.5 py-1 rounded-none bg-[#FDF7EA] dark:bg-[#342714] text-[#8C5212] dark:text-[#F3D190] hover:bg-[#FCE6B8] dark:hover:bg-[#473418] sketch-btn-press transition-all font-sans font-semibold shrink-0"
                >
                  <RoughBorder borderRadius={0} color="#D4A759" />
                  <span className="relative z-10">{t.backToCurrentWeek}</span>
                </button>
              )}
            </div>

            {/* Review & Plan Main CTA Button (Desktop/Tablet) */}
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <button
                onClick={onOpenReview}
                className="relative px-5 py-2 rounded-none bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:opacity-95 text-white font-hand font-bold text-base sm:text-lg shadow-pencil-sm sketch-btn-press transition-all flex items-center justify-center group"
              >
                <RoughBorder borderRadius={0} color="#6E5F54" darkColor="#EDE5DD" opacity={0.45} />
                <span className="relative z-10">{currentWeekPlan.reviewedAt ? t.viewReview : t.reviewAndPlan}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
