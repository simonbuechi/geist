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

import { RoughBackground } from './RoughBackground';
import { RoughBorder } from './RoughBorder';
import { RoughDivider } from './RoughDivider';
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
    <header className="w-full bg-transparent transition-colors pt-safe">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3.5 sm:pt-5 pb-2 flex flex-col gap-3 sm:gap-4">
        {/* Top Row: Artisanal Journal Brand & Utility Controls */}
        <div className="flex items-center justify-between gap-3">
          <button 
            onClick={() => {
              if (isHistoryView) onToggleHistory();
              goToCurrentWeek();
            }}
            className="group text-left flex items-center gap-2.5 sm:gap-3 focus:outline-none min-w-0"
            aria-label="Home"
          >
            {/* Three colored-pencil dimension dots (Terracotta, Sage, Dusty Rose) */}
            <span className="inline-flex items-center gap-1 shrink-0" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C46345] dark:bg-[#E2876B] opacity-85" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#557659] dark:bg-[#89B08E] opacity-85" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#9E5870] dark:bg-[#D48BA3] opacity-85" />
            </span>
            <h1 className="text-xl sm:text-2xl font-hand font-bold tracking-normal text-[#332B25] dark:text-[#EAE2D9] truncate leading-relaxed py-0.5 select-none">
              {t.appTitle}
            </h1>
          </button>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* History Journal Toggle — Muted rounded pencil pill */}
            <button
              onClick={onToggleHistory}
              title={t.history}
              aria-label={t.history}
              className="group relative px-4 py-1.5 rounded-full border-0 bg-transparent shadow-none text-xs sm:text-sm font-sans font-semibold text-[#332B25] dark:text-[#EAE2D9] hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 transition-all duration-150 min-h-[36px] flex items-center gap-1.5 justify-center select-none overflow-hidden"
            >
              <RoughBackground
                fill={isHistoryView ? '#C46345' : '#C8A986'}
                darkFill={isHistoryView ? '#E2876B' : '#C8A986'}
                stroke={isHistoryView ? '#964229' : '#9C7C58'}
                darkStroke={isHistoryView ? '#E2876B' : '#DFC4A4'}
                strokeWidth={1.15}
                shape="rounded"
                borderRadius={999}
                fillStyle="cross-hatch"
                hachureAngle={-41}
                hachureGap={2.8}
                fillWeight={1.35}
                roughness={1.1}
                opacity={isHistoryView ? 0.6 : 0.5}
                hoverOpacity={isHistoryView ? 0.8 : 0.78}
                seed={91}
              />
              <BookOpen className="w-3.5 h-3.5 stroke-[2] relative z-10 opacity-85 transition-transform duration-150 group-hover:scale-105" />
              <span className="relative z-10 leading-none">
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
                <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-[#8C7E72]/30" />
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
                <button
                  onClick={goToCurrentWeek}
                  className="relative inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#FCF9F4] dark:bg-[#221F1D] text-[#B88028] dark:text-[#E2B467] sketch-btn-press transition-all font-sans font-semibold shrink-0 overflow-hidden"
                >
                  <RoughBackground
                    fill="#B88028"
                    darkFill="#E2B467"
                    fillStyle="hachure"
                    hachureAngle={-35}
                    hachureGap={4.5}
                    fillWeight={1.0}
                    roughness={1.1}
                    opacity={0.14}
                    seed={92}
                  />
                  <RoughBorder
                    borderRadius={2}
                    width={0.9}
                    roughness={1.2}
                    color="#B88028"
                    darkColor="#E2B467"
                    opacity={0.5}
                  />
                  <RotateCcw className="w-3 h-3 stroke-[2.2] relative z-10" />
                  <span className="relative z-10">{t.backToCurrentWeek}</span>
                </button>
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
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F1F6F1] dark:bg-[#1E2A20] text-[#4E7A52] dark:text-[#89B08E] border border-[#557659]/40 text-2xs font-sans font-semibold shrink-0">
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
                <button
                  onClick={goToCurrentWeek}
                  className="md:hidden mt-2 relative inline-flex items-center gap-1.5 text-xs px-3 py-1 bg-[#FCF9F4] dark:bg-[#221F1D] text-[#B88028] dark:text-[#E2B467] sketch-btn-press transition-all font-sans font-semibold shrink-0 overflow-hidden"
                >
                  <RoughBorder
                    borderRadius={2}
                    width={0.9}
                    roughness={1.2}
                    color="#B88028"
                    darkColor="#E2B467"
                    opacity={0.5}
                  />
                  <RotateCcw className="w-3 h-3 stroke-[2.2] relative z-10" />
                  <span className="relative z-10">{t.backToCurrentWeek}</span>
                </button>
              )}
            </div>

            {/* Right Slot: Primary Review & Plan Action Button (Desktop/Tablet) */}
            <div className="hidden md:flex items-center justify-end">
              <PrimaryActionButton
                onClick={onOpenReview}
                isReviewed={Boolean(currentWeekPlan.reviewedAt)}
                label={currentWeekPlan.reviewedAt ? t.viewReview : t.reviewAndPlan}
              />
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
