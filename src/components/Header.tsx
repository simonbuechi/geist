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

import { RoughBackground } from './RoughBackground';
import { IconButton } from './IconButton';
import { PrimaryActionButton } from './PrimaryActionButton';

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
              className="text-left flex items-center gap-2 sm:gap-2.5 focus:outline-none min-w-0"
              aria-label="Home"
            >
              <h1 className="text-2xl sm:text-3xl font-hand font-bold tracking-wide bg-gradient-to-r from-[#9123A6] to-[#D7195F] bg-clip-text text-transparent truncate leading-tight select-none">
                {t.appTitle}
              </h1>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* History Toggle */}
            <button
              onClick={onToggleHistory}
              title={t.history}
              aria-label={t.history}
              className={`group relative px-3 py-1.5 rounded-none border-0 text-sm font-hand font-bold transition-all sketch-btn-press min-h-[34px] flex items-center justify-center overflow-hidden ${
                isHistoryView
                  ? 'text-white shadow-pencil'
                  : 'bg-[#FDFBF7] dark:bg-[#28221D] text-[#4A3E36] dark:text-[#EDE5DD] shadow-pencil-sm'
              }`}
            >
              {isHistoryView ? (
                <RoughBackground
                  fill="#D7195F"
                  darkFill="#C51756"
                  fillStyle="cross-hatch"
                  hachureAngle={-41}
                  hachureGap={3.2}
                  fillWeight={1.2}
                  roughness={1.1}
                  opacity={0.94}
                  seed={91}
                />
              ) : null}
              <span className={`relative z-10 ${isHistoryView ? 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]' : ''}`}>
                {t.history}
              </span>
            </button>

            {/* User / Settings Profile */}
            <IconButton
              onClick={onOpenAuth}
              title={user ? `${user.displayName || user.email || 'Konto'} (Angemeldet)` : `${t.auth.guestMode} (Lokal)`}
              aria-label="Settings and Profile"
              variant="default"
              size="md"
              className="relative"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-[#7A6A5E]/20" />
              ) : (
                <UserIcon className="w-4 h-4 stroke-[2]" />
              )}
              {/* Status Dot */}
              <span 
                className={`absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white dark:border-[#1F1B18] z-20 ${
                  user ? 'bg-[#4D7A4A]' : 'bg-[#BA9F83]'
                }`} 
                />
            </IconButton>
          </div>
        </div>

        {/* Bottom bar: Week Navigator & Main Action */}
        {!isHistoryView && (
          <div className="flex items-center justify-between gap-2 pt-1 sm:pt-2">
            {/* Week Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial min-w-0">
              <IconButton
                onClick={() => selectWeek(getPreviousWeekId(currentWeekId))}
                title="Vorherige Woche"
                aria-label="Vorherige Woche"
                variant="default"
                size="md"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              </IconButton>

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

              <IconButton
                onClick={handleNextWeek}
                title={!isNextAccessible ? t.unlockNextWeek : "Nächste Woche"}
                aria-label={!isNextAccessible ? t.unlockNextWeek : "Nächste Woche"}
                variant={!isNextAccessible ? 'subtle' : 'default'}
                size="md"
              >
                {!isNextAccessible ? (
                  <Lock className="w-3.5 h-3.5 stroke-[2.2] text-[#8C7D71]" />
                ) : (
                  <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                )}
              </IconButton>

              {!isCurrent && (
                <button
                  onClick={goToCurrentWeek}
                  className="relative text-xs px-2.5 py-1 rounded-none border-0 bg-[#FDF7EA] dark:bg-[#342714] text-[#8C5212] dark:text-[#F3D190] sketch-btn-press transition-all font-sans font-semibold shrink-0 overflow-hidden"
                >
                  <RoughBackground
                    fill="#D4A759"
                    darkFill="#D4A759"
                    fillStyle="cross-hatch"
                    hachureAngle={-35}
                    hachureGap={4.5}
                    fillWeight={1.0}
                    roughness={1.1}
                    opacity={0.18}
                    seed={92}
                  />
                  <span className="relative z-10">{t.backToCurrentWeek}</span>
                </button>
              )}
            </div>

            {/* Review & Plan Main CTA Button (Desktop/Tablet) */}
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <PrimaryActionButton
                onClick={onOpenReview}
                isReviewed={Boolean(currentWeekPlan.reviewedAt)}
                label={currentWeekPlan.reviewedAt ? t.viewReview : t.reviewAndPlan}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
