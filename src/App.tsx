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

import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { useGoals } from './context/GoalsContext';
import { CategoryIcon } from './components/CategoryIcon';
import { RoughBorder } from './components/RoughBorder';
import { RoughBackground } from './components/RoughBackground';
import { PrimaryActionButton } from './components/PrimaryActionButton';
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

  const categoryTabs: { 
    id: CategoryFilter; 
    label: string; 
    icon?: React.ReactNode; 
    count: number;
    completed?: number;
    accentColor?: string;
    activeDot?: string;
  }[] = [
    { 
      id: 'all', 
      label: t.all, 
      count: goals.length,
      accentColor: 'text-[#332B25] dark:text-[#EAE2D9]'
    },
    { 
      id: 'body', 
      label: t.categories.body.title, 
      icon: <CategoryIcon category="body" variant="base" size={24} className="w-6 h-6 text-[#C46345] dark:text-[#E2876B]" />,
      count: bodyGoals.length,
      completed: bodyGoals.filter(g => g.status === 'good').length,
      accentColor: 'text-[#C46345] dark:text-[#E2876B]',
      activeDot: 'bg-[#C46345]'
    },
    { 
      id: 'mind', 
      label: t.categories.mind.title, 
      icon: <CategoryIcon category="mind" variant="base" size={24} className="w-6 h-6 text-[#557659] dark:text-[#89B08E]" />,
      count: mindGoals.length,
      completed: mindGoals.filter(g => g.status === 'good').length,
      accentColor: 'text-[#557659] dark:text-[#89B08E]',
      activeDot: 'bg-[#557659]'
    },
    { 
      id: 'soul', 
      label: t.categories.soul.title, 
      icon: <CategoryIcon category="soul" variant="base" size={24} className="w-6 h-6 text-[#9E5870] dark:text-[#D48BA3]" />,
      count: soulGoals.length,
      completed: soulGoals.filter(g => g.status === 'good').length,
      accentColor: 'text-[#9E5870] dark:text-[#D48BA3]',
      activeDot: 'bg-[#9E5870]'
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
                    <div className="p-2.5 bg-[#C46345] text-[#FAF6F0] shrink-0 relative overflow-hidden">
                      <RoughBackground
                        fill="#C46345"
                        darkFill="#B05236"
                        fillStyle="cross-hatch"
                        hachureAngle={-41}
                        hachureGap={2.8}
                        fillWeight={1.2}
                        opacity={0.94}
                        seed={204}
                      />
                      <RoughBorder borderRadius={2} width={0.9} color="#8F4028" darkColor="#EAE2D9" opacity={0.35} />
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

              {/* Reviewed Week Highlight Banner */}
              {currentWeekPlan.reviewedAt && (
                <div className="relative p-4 sm:p-5 bg-[#FCF9F4] dark:bg-[#221F1D] shadow-notebook flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in overflow-hidden">
                  <RoughBackground
                    fill="#557659"
                    darkFill="#89B08E"
                    fillStyle="hachure"
                    hachureAngle={-41}
                    hachureGap={8}
                    fillWeight={1.0}
                    opacity={0.12}
                    seed={202}
                  />
                  <RoughBorder borderRadius={2} width={1.2} color="#557659" darkColor="#89B08E" opacity={0.45} />
                  <div className="relative z-10 flex items-start sm:items-center gap-3">
                    <div className="p-2.5 bg-[#4E7A52] text-[#FAF6F0] shrink-0 relative overflow-hidden">
                      <RoughBackground
                        fill="#4E7A52"
                        darkFill="#3F6643"
                        fillStyle="cross-hatch"
                        hachureAngle={-41}
                        hachureGap={2.8}
                        fillWeight={1.2}
                        opacity={0.94}
                        seed={205}
                      />
                      <RoughBorder borderRadius={2} width={0.9} color="#3A5E3D" darkColor="#EAE2D9" opacity={0.35} />
                      <CheckCircle2 className="w-4 h-4 stroke-[2.2] relative z-10" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-sans font-bold text-[#332B25] dark:text-[#EAE2D9]">
                          {t.reviewCompletedTitle}
                        </h3>
                        <div className="flex items-center gap-1.5 text-2xs font-medium">
                          <span className="px-2 py-0.5 bg-[#F1F6F1] dark:bg-[#1E2A20] text-[#4E7A52] dark:text-[#89B08E] border border-[#557659]/40 font-sans font-semibold">
                            {goals.filter(g => g.status === 'good').length} {t.status.good}
                          </span>
                          {goals.filter(g => g.status === 'partly').length > 0 && (
                            <span className="px-2 py-0.5 bg-[#FAF4E8] dark:bg-[#2C2418] text-[#B88028] dark:text-[#E2B467] border border-[#B88028]/40 font-sans font-semibold">
                              {goals.filter(g => g.status === 'partly').length} {t.status.partly}
                            </span>
                          )}
                          {goals.filter(g => g.status === 'poor').length > 0 && (
                            <span className="px-2 py-0.5 bg-[#FAF1ED] dark:bg-[#2E1E1A] text-[#B84A39] dark:text-[#E2876B] border border-[#B84A39]/40 font-sans font-semibold">
                              {goals.filter(g => g.status === 'poor').length} {t.status.poor}
                            </span>
                          )}
                        </div>
                      </div>
                      {currentWeekPlan.generalReflection && (
                        <p className="text-lg sm:text-xl text-[#5C524B] dark:text-[#C5B9AE] font-hand mt-1">
                          &ldquo;{currentWeekPlan.generalReflection}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsReviewOpen(true)}
                    className="group relative z-10 self-end sm:self-center text-xs px-3.5 py-1.5 bg-[#FCF9F4] dark:bg-[#2A2623] text-[#332B25] dark:text-[#EAE2D9] font-sans font-semibold sketch-btn-press transition-all whitespace-nowrap overflow-hidden"
                  >
                    <RoughBorder
                      borderRadius={2}
                      width={1.0}
                      roughness={1.2}
                      color="#8C7E72"
                      darkColor="#85786C"
                      opacity={0.45}
                    />
                    <span className="relative z-10">{t.editReview}</span>
                  </button>
                </div>
              )}

              {/* Mobile Category Segmented Switcher */}
              <div className="md:hidden">
                <div className="relative grid grid-cols-4 gap-1 p-1.5 bg-[#EAE2D3]/80 dark:bg-[#221F1D] overflow-hidden">
                  <RoughBorder
                    borderRadius={2}
                    width={1.0}
                    roughness={1.2}
                    color="#8C7E72"
                    darkColor="#7A6F66"
                    opacity={0.4}
                  />
                  {categoryTabs.map(tab => {
                    const isActive = selectedCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedCategory(tab.id)}
                        className={`relative z-10 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1.5 text-xs font-sans transition-all min-h-[44px] ${
                          isActive
                            ? 'bg-[#FCF9F4] dark:bg-[#2E2A27] text-[#332B25] dark:text-[#EAE2D9] font-semibold shadow-pencil-sm'
                            : 'text-[#7A6F66] dark:text-[#A3968B] font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {tab.icon}
                          <span className="truncate text-xs">{tab.label}</span>
                        </div>
                        <span className={`text-2xs px-1.5 py-0.2 font-sans font-semibold ${
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
        <footer className="w-full py-6 px-4 flex justify-center text-xs text-[#7A6F66] dark:text-[#A3968B] font-serif italic transition-colors pb-24 md:pb-8">
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

        {/* Mobile Sticky Bottom Action Bar */}
        {!isHistoryView && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#F3EDE2]/95 dark:bg-[#191614]/95 backdrop-blur-md border-t border-[#8C7E72]/25 dark:border-[#7A6F66]/25 px-4 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] transition-colors">
            <div className="max-w-md mx-auto">
              <PrimaryActionButton
                onClick={() => setIsReviewOpen(true)}
                isReviewed={Boolean(currentWeekPlan.reviewedAt)}
                label={currentWeekPlan.reviewedAt ? t.viewReview : (t.reviewAndPlanShort || t.reviewAndPlan)}
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
