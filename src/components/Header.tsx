import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  User as UserIcon,
  Check,
  Lock,
  BookOpen,
  RotateCcw
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

import { RoughDivider } from './RoughDivider';
import { IconButton } from './IconButton';
import { RoughButton } from './RoughButton';
import { PrimaryActionButton } from './PrimaryActionButton';
import { RoughNotationHighlight } from './RoughNotationHighlight';
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
    <header className="w-full bg-transparent pt-safe overflow-visible">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3.5 sm:pt-5 pb-2 flex flex-col gap-3 sm:gap-4 overflow-visible">
        {/* Top Row: Artisanal Journal Brand & Utility Controls */}
        <div className="flex items-center justify-between gap-3 overflow-visible">
          <div
            onClick={() => {
              if (isHistoryView) onToggleHistory();
              goToCurrentWeek();
            }}
            className="text-left flex items-center gap-2.5 sm:gap-3 border-0 bg-transparent focus:outline-none min-w-0 cursor-pointer overflow-visible"
            role="button"
            tabIndex={0}
            aria-label="Home"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isHistoryView) onToggleHistory();
                goToCurrentWeek();
              }
            }}
          >
            <KgsLogo size={38} className="w-8 h-8 sm:w-9 sm:h-9" />
            <RoughNotationHighlight
              type="box"
              trigger="click"
              color="#9123A6"
              darkColor="#D7195F"
              strokeWidth={1.6}
              padding={[4, 8, 8, 8]}
            >
              <h1 className="text-xl sm:text-2xl font-hand font-bold tracking-normal bg-gradient-to-r from-[#9123A6] to-[#D7195F] bg-clip-text text-transparent leading-[1.75] pt-1 pb-2.5 px-1 select-none overflow-visible whitespace-nowrap">
                {t.appTitle}
              </h1>
            </RoughNotationHighlight>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* History Journal Toggle — Unified muted rounded pill */}
            <RoughButton
              onClick={onToggleHistory}
              title={t.history}
              aria-label={t.history}
              variant={isHistoryView ? 'primary' : 'default'}
              size="md"
              seed={91}
            >
              <BookOpen className="w-3.5 h-3.5 stroke-[2] opacity-85" />
              <span>{t.history}</span>
            </RoughButton>

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
                <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 stroke-[2]" />
              )}
            </IconButton>
          </div>
        </div>

        {/* Centered Editorial Journal Masthead: Week Navigator & Primary CTA */}
        {!isHistoryView && (
          <div className="pt-1 pb-1.5 flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* Left Balancing Slot: "Back to Current Week" Pill when browsing past/future weeks */}
            <div className="hidden md:flex items-center justify-start">
              {!isCurrent && (
                <RoughButton
                  onClick={goToCurrentWeek}
                  variant="warning"
                  size="sm"
                  seed={92}
                >
                  <RotateCcw className="w-3 h-3 stroke-[2.2]" />
                  <span>{t.backToCurrentWeek}</span>
                </RoughButton>
              )}
            </div>

            {/* Center: Tactile Week Switcher */}
            <div className="flex flex-col items-center justify-center w-full md:w-auto">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <IconButton
                  onClick={() => selectWeek(getPreviousWeekId(currentWeekId))}
                  title="Vorherige Woche"
                  aria-label="Vorherige Woche"
                  variant="default"
                  size="md"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
                </IconButton>

                <div className="flex flex-col items-center justify-center px-3 py-0.5 min-w-[170px] sm:min-w-[210px] text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg sm:text-xl font-sans font-bold text-[#332B25] dark:text-[#EAE2D9] tracking-tight leading-none">
                      {t.week} {weekNumber}
                    </span>
                    {currentWeekPlan.reviewedAt && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F1F6F1] dark:bg-[#1E2A20] text-[#4E7A52] dark:text-[#89B08E] border border-[#557659]/40 text-2xs font-sans font-semibold shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                        <span>{t.reviewed}</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#7A6F66] dark:text-[#A3968B] font-sans mt-1">
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
                    <Lock className="w-3.5 h-3.5 stroke-[2.2] text-[#7A6F66] dark:text-[#A3968B]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                  )}
                </IconButton>
              </div>

              {/* Mobile-only "Back to Current Week" button below week switcher */}
              {!isCurrent && (
                <div className="md:hidden mt-2">
                  <RoughButton
                    onClick={goToCurrentWeek}
                    variant="warning"
                    size="sm"
                    seed={93}
                  >
                    <RotateCcw className="w-3 h-3 stroke-[2.2]" />
                    <span>{t.backToCurrentWeek}</span>
                  </RoughButton>
                </div>
              )}
            </div>

            {/* Right Slot: Primary Review & Plan Action Button (Desktop/Tablet) - only shown when week is not yet reviewed */}
            <div className="hidden md:flex items-center justify-end">
              {!currentWeekPlan.reviewedAt && (
                <PrimaryActionButton
                  onClick={onOpenReview}
                  isReviewed={false}
                  label={t.reviewAndPlan}
                />
              )}
            </div>
          </div>
        )}

        {/* Hand-sketched pencil rule grounding the masthead */}
        <RoughDivider
          color="#8C7E72"
          darkColor="#7A6F66"
          opacity={0.35}
          roughness={1.3}
          strokeWidth={1.0}
          seed={19}
        />
      </div>
    </header>
  );
};
