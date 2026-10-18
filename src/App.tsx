import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { GoalsProvider } from './context/GoalsContext';
import { Header } from './components/Header';
import { CategoryCard } from './components/CategoryCard';
import { ReviewModal } from './components/ReviewModal';
import { HistoryView } from './components/HistoryView';
import { AuthModal } from './components/AuthModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { setupForegroundNotificationListener } from './config/notifications';

import { Sparkles, CheckCircle2, MinusCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { useGoals } from './context/GoalsContext';
import { CategoryIcon } from './components/CategoryIcon';
import { RoughBorder } from './components/RoughBorder';
import { RoughBackground } from './components/RoughBackground';
import { RoughButton } from './components/RoughButton';
import { RoughHoverBorder } from './components/RoughHoverBorder';
import { PrimaryActionButton } from './components/PrimaryActionButton';
import { RoughSparklesOverlay } from './components/RoughSparklesOverlay';
import type { Category } from './types';

type CategoryFilter = 'all' | Category;

const MainDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { currentWeekPlan, currentWeekId, realCurrentWeekId } = useGoals();
  const [isReviewOpen, setIsReviewOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('action') === 'review';
    }
    return false;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryView, setIsHistoryView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [hoveredTab, setHoveredTab] = useState<CategoryFilter | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);

  // Clean URL parameter if opened via action=review
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'review') {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', cleanUrl);
      }
    }
  }, []);

  // Foreground push message listener
  useEffect(() => {
    const unsubscribe = setupForegroundNotificationListener((payload) => {
      console.log('Foreground push notification received:', payload);
      if (payload.data?.url?.includes('action=review')) {
        setIsReviewOpen(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const goals = currentWeekPlan.goals || [];
  const bodyGoals = goals.filter(g => g.category === 'body');
  const mindGoals = goals.filter(g => g.category === 'mind');
  const soulGoals = goals.filter(g => g.category === 'soul');

  // Calculate Weekly Review Outcome Tier (>50% good -> green, >50% poor -> red, otherwise -> yellow)
  const totalGoals = goals.length;
  const goodCount = goals.filter(g => g.status === 'good').length;
  const partlyCount = goals.filter(g => g.status === 'partly').length;
  const poorCount = goals.filter(g => g.status === 'poor').length;

  const reviewOutcomeTier: 'green' | 'yellow' | 'red' =
    totalGoals > 0 && goodCount / totalGoals > 0.5
      ? 'green'
      : totalGoals > 0 && poorCount / totalGoals > 0.5
      ? 'red'
      : 'yellow';

  const outcomeMessages = t.reviewOutcomes[reviewOutcomeTier];
  const weekSeed = currentWeekId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const outcomeMessage =
    outcomeMessages[(weekSeed + goodCount * 3 + poorCount * 5) % outcomeMessages.length];

  const reviewBannerStyles = {
    green: {
      containerBg: 'bg-[#F2F7F2] dark:bg-[#1E2820]',
      roughFill: '#4E7A52',
      roughDarkFill: '#89B08E',
      borderColor: '#4E7A52',
      darkBorderColor: '#89B08E',
      iconFill: '#4E7A52',
      iconDarkFill: '#3F6643',
      messageColor: 'text-[#355E39] dark:text-[#A3CFA7]',
      icon: <CheckCircle2 className="w-4 h-4 stroke-[2.2] relative z-10" />,
    },
    yellow: {
      containerBg: 'bg-[#FDF6E9] dark:bg-[#2B2418]',
      roughFill: '#C88A2B',
      roughDarkFill: '#E2B467',
      borderColor: '#B88028',
      darkBorderColor: '#E2B467',
      iconFill: '#C88A2B',
      iconDarkFill: '#A6701E',
      messageColor: 'text-[#8A5A14] dark:text-[#F0CF90]',
      icon: <MinusCircle className="w-4 h-4 stroke-[2.2] relative z-10" />,
    },
    red: {
      containerBg: 'bg-[#FBECE9] dark:bg-[#2E1D1A]',
      roughFill: '#B84A39',
      roughDarkFill: '#E2876B',
      borderColor: '#B84A39',
      darkBorderColor: '#E2876B',
      iconFill: '#B84A39',
      iconDarkFill: '#963628',
      messageColor: 'text-[#963628] dark:text-[#F2A79E]',
      icon: <AlertCircle className="w-4 h-4 stroke-[2.2] relative z-10" />,
    },
  }[reviewOutcomeTier];

  const categoryTabs: { 
    id: CategoryFilter; 
    label: string; 
    icon?: React.ReactNode; 
    count: number;
    completed?: number;
  }[] = [
    { 
      id: 'all', 
      label: t.all, 
      count: goals.length,
    },
    { 
      id: 'body', 
      label: t.categories.body.title, 
      icon: <CategoryIcon category="body" variant="base" size={24} className="w-6 h-6 text-[#C46345] dark:text-[#E2876B]" />,
      count: bodyGoals.length,
      completed: bodyGoals.filter(g => g.status === 'good').length,
    },
    { 
      id: 'mind', 
      label: t.categories.mind.title, 
      icon: <CategoryIcon category="mind" variant="base" size={24} className="w-6 h-6 text-[#557659] dark:text-[#89B08E]" />,
      count: mindGoals.length,
      completed: mindGoals.filter(g => g.status === 'good').length,
    },
    { 
      id: 'soul', 
      label: t.categories.soul.title, 
      icon: <CategoryIcon category="soul" variant="base" size={24} className="w-6 h-6 text-[#9E5870] dark:text-[#D48BA3]" />,
      count: soulGoals.length,
      completed: soulGoals.filter(g => g.status === 'good').length,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#332B25] dark:text-[#EAE2D9] transition-colors selection:bg-[#C46345]/25 selection:text-[#332B25] dark:selection:text-[#FAF6F0] relative z-[1]">
      <div className="flex-1 flex flex-col">
        <Header
          onOpenReview={() => setIsReviewOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          isHistoryView={isHistoryView}
          onToggleHistory={() => setIsHistoryView(!isHistoryView)}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-5 sm:gap-6 pb-24 md:pb-8">
          {isHistoryView ? (
            <HistoryView onClose={() => setIsHistoryView(false)} />
          ) : (
            <>
              {/* Unreviewed Past Week Highlight Banner */}
              {currentWeekId < realCurrentWeekId && !currentWeekPlan.reviewedAt && (
                <div className="relative p-4 sm:p-5 bg-[#FCF9F4] dark:bg-[#221F1D] shadow-notebook flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 animate-fade-in overflow-hidden">
                  <RoughBackground
                    fill="#B88028"
                    darkFill="#E2B467"
                    fillStyle="hachure"
                    hachureAngle={-41}
                    hachureGap={8}
                    fillWeight={1.0}
                    opacity={0.12}
                    seed={201}
                  />
                  <RoughBorder borderRadius={2} width={1.2} color="#B88028" darkColor="#E2B467" opacity={0.5} />
                  <div className="relative z-10 flex items-start sm:items-center gap-3">
                    <div className="p-2.5 rounded-full bg-[#C46345] text-[#FAF6F0] shrink-0 relative overflow-hidden">
                      <RoughBackground
                        fill="#C46345"
                        darkFill="#B05236"
                        shape="circle"
                        fillStyle="cross-hatch"
                        hachureAngle={-41}
                        hachureGap={2.8}
                        fillWeight={1.2}
                        opacity={0.94}
                        seed={204}
                      />
                      <Sparkles className="w-4 h-4 stroke-[2.2] relative z-10" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-sans font-bold text-[#332B25] dark:text-[#EAE2D9]">
                        {t.pendingReviewBannerTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#7A6F66] dark:text-[#A3968B] font-sans">
                        {t.pendingReviewBannerDesc}
                      </p>
                    </div>
                  </div>
                  <PrimaryActionButton
                    onClick={() => setIsReviewOpen(true)}
                    label={t.actions.completeReview}
                    className="self-end sm:self-center text-sm"
                  />
                </div>
              )}

              {/* Reviewed Week Highlight Banner — Colored by Outcome (Green >50% erreicht, Red >50% nicht erreicht, Yellow otherwise) */}
              {currentWeekPlan.reviewedAt && (
                <div
                  data-testid={`review-completed-banner-${reviewOutcomeTier}`}
                  className={`relative p-4 sm:p-5 ${reviewBannerStyles.containerBg} shadow-notebook flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 animate-fade-in overflow-visible`}
                >
                  <RoughBackground
                    fill={reviewBannerStyles.roughFill}
                    darkFill={reviewBannerStyles.roughDarkFill}
                    fillStyle="hachure"
                    hachureAngle={-41}
                    hachureGap={7.5}
                    fillWeight={1.0}
                    opacity={0.16}
                    seed={202}
                  />
                  <RoughBorder
                    borderRadius={2}
                    width={1.25}
                    color={reviewBannerStyles.borderColor}
                    darkColor={reviewBannerStyles.darkBorderColor}
                    opacity={0.55}
                  />
                  <div className="relative z-10 flex items-start sm:items-center gap-3">
                    <div className="p-2.5 rounded-full text-[#FAF6F0] shrink-0 relative overflow-hidden">
                      <RoughBackground
                        fill={reviewBannerStyles.iconFill}
                        darkFill={reviewBannerStyles.iconDarkFill}
                        shape="circle"
                        fillStyle="cross-hatch"
                        hachureAngle={-41}
                        hachureGap={2.6}
                        fillWeight={1.3}
                        opacity={0.94}
                        seed={205}
                      />
                      {reviewBannerStyles.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-sans font-bold text-[#332B25] dark:text-[#EAE2D9]">
                          {t.reviewCompletedTitle}
                        </h3>
                        <div className="flex items-center gap-1.5 text-2xs font-medium">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#F1F6F1] dark:bg-[#1E2A20] text-[#4E7A52] dark:text-[#89B08E] border border-[#557659]/40 font-sans font-semibold">
                            {goodCount} {t.status.good}
                          </span>
                          {partlyCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF4E8] dark:bg-[#2C2418] text-[#B88028] dark:text-[#E2B467] border border-[#B88028]/40 font-sans font-semibold">
                              {partlyCount} {t.status.partly}
                            </span>
                          )}
                          {poorCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF1ED] dark:bg-[#2E1E1A] text-[#B84A39] dark:text-[#E2876B] border border-[#B84A39]/40 font-sans font-semibold">
                              {poorCount} {t.status.poor}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Outcome-based encouraging message */}
                      <p className={`text-xs sm:text-sm font-sans font-semibold ${reviewBannerStyles.messageColor}`}>
                        {outcomeMessage}
                      </p>

                      {currentWeekPlan.generalReflection && (
                        <p className="text-base sm:text-lg text-[#5C524B] dark:text-[#C5B9AE] font-hand pt-0.5">
                          &ldquo;{currentWeekPlan.generalReflection}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                  <RoughButton
                    onClick={() => setIsReviewOpen(true)}
                    variant="default"
                    size="sm"
                    seed={203}
                    className="relative z-10 self-end sm:self-center whitespace-nowrap shrink-0"
                  >
                    <span>{t.editReview}</span>
                  </RoughButton>
                </div>
              )}

              {/* Mobile Category Segmented Switcher */}
              <div className="md:hidden">
                <div className="relative grid grid-cols-4 gap-1.5 p-1.5 rounded-full bg-[#EAE2D3]/80 dark:bg-[#221F1D] overflow-visible">
                  {categoryTabs.map(tab => {
                    const isActive = selectedCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedCategory(tab.id)}
                        onMouseEnter={() => setHoveredTab(tab.id)}
                        onMouseLeave={() => setHoveredTab(null)}
                        className={`relative z-10 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1.5 rounded-full border-0 text-xs font-sans transition-all min-h-[44px] overflow-visible ${
                          isActive
                            ? 'bg-[#FCF9F4] dark:bg-[#2E2A27] text-[#332B25] dark:text-[#EAE2D9] font-semibold shadow-pencil-sm'
                            : 'bg-transparent text-[#7A6F66] dark:text-[#A3968B] font-medium'
                        }`}
                      >
                        <RoughHoverBorder
                          active={hoveredTab === tab.id}
                          color="#8A6A46"
                          darkColor="#DFC4A4"
                          strokeWidth={1.4}
                          padding={1}
                        />
                        <div className="flex items-center gap-1 relative z-10">
                          {tab.icon}
                          <span className="truncate text-xs">{tab.label}</span>
                        </div>
                        <span className={`text-2xs px-1.5 py-0.2 rounded-full font-sans font-semibold relative z-10 ${
                          isActive
                            ? 'bg-[#F3EDE2] dark:bg-[#221F1D] text-[#332B25] dark:text-[#EAE2D9]'
                            : 'text-[#8C7E72] dark:text-[#7A6F66]'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile View: Render Selected Dimension or All */}
              <div className="md:hidden flex-1 flex flex-col gap-6 pt-1">
                {selectedCategory === 'all' && (
                  <>
                    <CategoryCard category="body" />
                    <CategoryCard category="mind" />
                    <CategoryCard category="soul" />
                  </>
                )}
                {selectedCategory === 'body' && <CategoryCard category="body" />}
                {selectedCategory === 'mind' && <CategoryCard category="mind" />}
                {selectedCategory === 'soul' && <CategoryCard category="soul" />}
              </div>

              {/* Desktop View (md: and above): 3-Column Pinboard / Sketchpad Grid */}
              <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-7 items-stretch flex-1 pt-2">
                <CategoryCard category="body" />
                <CategoryCard category="mind" />
                <CategoryCard category="soul" />
              </div>
            </>
          )}
        </main>

        {/* Subtle Artisanal Colophon Footer */}
        <footer className="w-full py-6 px-4 flex justify-center text-xs text-[#7A6F66] dark:text-[#A3968B] font-sans transition-colors pb-24 md:pb-8">
          <div className="inline-flex items-center justify-center gap-2.5 flex-wrap px-4 py-1.5">
            <span>Copyright 2026 Simon B&uuml;chi</span>
            <span className="opacity-40">&bull;</span>
            <a
              href="https://github.com/simonbuechi/geist"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#332B25] dark:hover:text-[#EAE2D9] underline decoration-[#8C7E72]/40 underline-offset-4"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>github.com/simonbuechi/geist</span>
            </a>
          </div>
        </footer>

        {/* Mobile Sticky Bottom Action Bar — Only shown when week is not yet reviewed */}
        {!isHistoryView && !currentWeekPlan.reviewedAt && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#F3EDE2]/95 dark:bg-[#191614]/95 backdrop-blur-md border-t border-[#8C7E72]/25 dark:border-[#7A6F66]/25 px-4 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] transition-colors">
            <div className="max-w-md mx-auto">
              <PrimaryActionButton
                onClick={() => setIsReviewOpen(true)}
                isReviewed={false}
                label={t.reviewAndPlanShort || t.reviewAndPlan}
                className="w-full text-base py-2.5"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals & Overlays */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onComplete={() => setShowSparkles(true)}
      />

      <RoughSparklesOverlay
        active={showSparkles}
        onComplete={() => setShowSparkles(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <PwaInstallBanner />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <GoalsProvider>
            <MainDashboard />
          </GoalsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
