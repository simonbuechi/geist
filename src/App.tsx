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
import { BodyBackground } from './components/BodyBackground';
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
  }[] = [
    { 
      id: 'all', 
      label: t.all, 
      count: goals.length 
    },
    { 
      id: 'body', 
      label: t.categories.body.title, 
      icon: <CategoryIcon category="body" variant="base" size={18} className="w-4.5 h-4.5" />,
      count: bodyGoals.length,
      completed: bodyGoals.filter(g => g.status === 'good').length,
      accentColor: 'text-[#D7195F] dark:text-[#F472B6]'
    },
    { 
      id: 'mind', 
      label: t.categories.mind.title, 
      icon: <CategoryIcon category="mind" variant="base" size={18} className="w-4.5 h-4.5" />,
      count: mindGoals.length,
      completed: mindGoals.filter(g => g.status === 'good').length,
      accentColor: 'text-[#D7195F] dark:text-[#F472B6]'
    },
    { 
      id: 'soul', 
      label: t.categories.soul.title, 
      icon: <CategoryIcon category="soul" variant="base" size={18} className="w-4.5 h-4.5" />,
      count: soulGoals.length,
      completed: soulGoals.filter(g => g.status === 'good').length,
      accentColor: 'text-[#D7195F] dark:text-[#F472B6]'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#4A3E36] dark:text-[#EDE5DD] transition-colors selection:bg-[#D7195F] selection:text-white relative z-[1]">
      <div className="flex-1 flex flex-col">
        <Header
          onOpenReview={() => setIsReviewOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          isHistoryView={isHistoryView}
          onToggleHistory={() => setIsHistoryView(!isHistoryView)}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6 pb-24 md:pb-6">
        {isHistoryView ? (
          <HistoryView onClose={() => setIsHistoryView(false)} />
        ) : (
          <>
            {/* Unreviewed Past Week Highlight Banner */}
            {currentWeekId < realCurrentWeekId && !currentWeekPlan.reviewedAt && (
              <div className="relative p-3.5 sm:p-4 rounded-none bg-[#FAF5ED] dark:bg-[#2A231C] shadow-pencil-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in overflow-hidden">
                <RoughBackground
                  fill="#D4A759"
                  darkFill="#D4A759"
                  fillStyle="cross-hatch"
                  hachureAngle={-41}
                  hachureGap={9}
                  fillWeight={1.0}
                  opacity={0.15}
                  seed={201}
                />
                <RoughBorder borderRadius={0} color="#D4A759" opacity={0.5} />
                <div className="relative z-10 flex items-start sm:items-center gap-2.5">
                  <div className="p-2 rounded-none bg-[#D7195F] text-white shadow-pencil-sm shrink-0 relative overflow-hidden">
                    <RoughBackground
                      fill="#D7195F"
                      darkFill="#C51756"
                      fillStyle="cross-hatch"
                      hachureAngle={-41}
                      hachureGap={2.8}
                      fillWeight={1.2}
                      opacity={0.94}
                      seed={204}
                    />
                    <RoughBorder borderRadius={0} width={0.9} color="#6E5F54" darkColor="#EDE5DD" opacity={0.3} />
                    <Sparkles className="w-4 h-4 stroke-[2.2] relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
                      {t.pendingReviewBannerTitle}
                    </h3>
                    <p className="text-2xs sm:text-xs text-[#7D6E63] dark:text-[#BA9F83] font-sans">
                      {t.pendingReviewBannerDesc}
                    </p>
                  </div>
                </div>
                <PrimaryActionButton
                  onClick={() => setIsReviewOpen(true)}
                  label={t.actions.completeReview}
                  className="self-end sm:self-center text-sm sm:text-base"
                />
              </div>
            )}

            {/* Reviewed Week Highlight Banner */}
            {currentWeekPlan.reviewedAt && (
              <div className="relative p-3.5 sm:p-4 rounded-none bg-[#F8F5EE] dark:bg-[#222921] shadow-pencil-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-fade-in overflow-hidden">
                <RoughBackground
                  fill="#4D7A4A"
                  darkFill="#4D7A4A"
                  fillStyle="cross-hatch"
                  hachureAngle={-41}
                  hachureGap={9}
                  fillWeight={1.0}
                  opacity={0.15}
                  seed={202}
                />
                <RoughBorder borderRadius={0} color="#4D7A4A" opacity={0.5} />
                <div className="relative z-10 flex items-start sm:items-center gap-2.5">
                  <div className="p-2 rounded-none bg-[#4D7A4A] text-white shadow-pencil-sm shrink-0 relative overflow-hidden">
                    <RoughBackground
                      fill="#4D7A4A"
                      darkFill="#3E6B3B"
                      fillStyle="cross-hatch"
                      hachureAngle={-41}
                      hachureGap={2.8}
                      fillWeight={1.2}
                      opacity={0.94}
                      seed={205}
                    />
                    <RoughBorder borderRadius={0} width={0.9} color="#6E5F54" darkColor="#EDE5DD" opacity={0.3} />
                    <CheckCircle2 className="w-4 h-4 stroke-[2.2] relative z-10" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
                        {t.reviewCompletedTitle}
                      </h3>
                      <div className="flex items-center gap-1.5 text-2xs font-medium">
                        <span className="px-2 py-0.2 rounded-none bg-[#EEF5ED] dark:bg-[#203322] text-[#2F612C] dark:text-[#A6D6A2] border border-[#7CA379]/60 font-sans font-semibold">
                          {goals.filter(g => g.status === 'good').length} {t.status.good}
                        </span>
                        {goals.filter(g => g.status === 'partly').length > 0 && (
                          <span className="px-2 py-0.2 rounded-none bg-[#FDF7EA] dark:bg-[#342714] text-[#8C5212] dark:text-[#F3D190] border border-[#D4A759]/60 font-sans font-semibold">
                            {goals.filter(g => g.status === 'partly').length} {t.status.partly}
                          </span>
                        )}
                        {goals.filter(g => g.status === 'poor').length > 0 && (
                          <span className="px-2 py-0.2 rounded-none bg-[#FDF0EE] dark:bg-[#361914] text-[#9E352B] dark:text-[#F3A59C] border border-[#DFA098]/60 font-sans font-semibold">
                            {goals.filter(g => g.status === 'poor').length} {t.status.poor}
                          </span>
                        )}
                      </div>
                    </div>
                    {currentWeekPlan.generalReflection && (
                      <p className="text-xs text-[#7D6E63] dark:text-[#BA9F83] italic font-hand mt-0.5">
                        "{currentWeekPlan.generalReflection}"
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="group relative z-10 self-end sm:self-center text-xs px-3 py-1 rounded-none border-0 bg-[#FDFBF7] dark:bg-[#28221D] text-[#4A3E36] dark:text-[#EDE5DD] font-hand font-bold shadow-pencil-sm sketch-btn-press transition-all whitespace-nowrap overflow-hidden"
                >
                  <RoughBackground
                    fill="#7A6A5E"
                    darkFill="#EDE5DD"
                    fillStyle="cross-hatch"
                    hachureAngle={45}
                    hachureGap={4.2}
                    fillWeight={1.0}
                    opacity={0.14}
                    seed={203}
                  />
                  <span className="relative z-10">{t.editReview}</span>
                </button>
              </div>
            )}

            {/* Mobile Category Segmented Switcher */}
            <div className="md:hidden">
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#EAE0D2]/90 dark:bg-[#28221C] rounded-none border border-[#7A6A5E]/25 dark:border-[#EDE5DD]/15 shadow-pencil-sm">
                {categoryTabs.map(tab => {
                  const isActive = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1.5 rounded-none border-0 text-xs font-hand transition-all min-h-[44px] ${
                        isActive
                          ? 'bg-[#FDFBF7] dark:bg-[#342C24] text-[#4A3E36] dark:text-[#EDE5DD] font-bold shadow-pencil-sm'
                          : 'text-[#7D6E63] dark:text-[#BA9F83]'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {tab.icon}
                        <span className="truncate text-xs">{tab.label}</span>
                      </div>
                      <span className={`text-2xs px-1.5 py-0.2 rounded-none font-sans font-semibold ${
                        isActive
                          ? 'bg-[#EFE7DC] dark:bg-[#28221C] text-[#4A3E36] dark:text-[#EDE5DD]'
                          : 'text-[#8C7D71] dark:text-[#7D6E63]'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile View: Render Selected Dimension or All */}
            <div className="md:hidden flex-1 flex flex-col gap-4">
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

            {/* Desktop View (md: and above): Full 3-Column Responsive Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch flex-1">
              <CategoryCard category="body" />
              <CategoryCard category="mind" />
              <CategoryCard category="soul" />
            </div>
          </>
        )}
      </main>

      {/* Footer in Body Font (Nunito) with clean readable background */}
      <footer className="w-full py-6 px-4 flex justify-center text-xs sm:text-sm text-[#7D6E63] dark:text-[#BA9F83] font-sans font-normal transition-colors pb-24 md:pb-8">
        <div className="inline-flex items-center justify-center gap-2 flex-wrap px-4 py-1.5 rounded-none bg-[#FDFBF7]/90 dark:bg-[#28221D]/90 border border-[#7A6A5E]/20 dark:border-[#EDE5DD]/15 shadow-pencil-sm">
          <span>Copyright 2026 Simon B&uuml;chi</span>
          <span className="opacity-40">&bull;</span>
          <a
            href="https://github.com/simonbuechi/geist"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors underline decoration-[#7A6A5E]/30 underline-offset-4"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>https://github.com/simonbuechi/geist</span>
          </a>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Action Bar (Thumb-Friendly CTA) */}
      {!isHistoryView && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#F5F2EB]/95 dark:bg-[#1F1B18]/95 backdrop-blur-md border-t border-[#7A6A5E]/20 dark:border-[#EDE5DD]/15 px-4 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-lg transition-colors">
          <div className="max-w-md mx-auto">
            <PrimaryActionButton
              onClick={() => setIsReviewOpen(true)}
              isReviewed={Boolean(currentWeekPlan.reviewedAt)}
              label={currentWeekPlan.reviewedAt ? t.viewReview : (t.reviewAndPlanShort || t.reviewAndPlan)}
              className="w-full text-xl sm:text-2xl py-2"
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
            <BodyBackground />
            <MainDashboard />
          </GoalsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
