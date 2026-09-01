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
import type { Category } from './types';

type CategoryFilter = 'all' | Category;

const MainDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { currentWeekPlan } = useGoals();
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
      icon: <CategoryIcon category="body" size={14} className="w-3.5 h-3.5 text-[#9123A6] dark:text-[#f472b6]" />,
      count: bodyGoals.length,
      completed: bodyGoals.filter(g => g.status === 'good').length,
      accentColor: 'text-[#9123A6] dark:text-[#f472b6]'
    },
    { 
      id: 'mind', 
      label: t.categories.mind.title, 
      icon: <CategoryIcon category="mind" size={14} className="w-3.5 h-3.5 text-[#9123A6] dark:text-[#f472b6]" />,
      count: mindGoals.length,
      completed: mindGoals.filter(g => g.status === 'good').length,
      accentColor: 'text-[#9123A6] dark:text-[#f472b6]'
    },
    { 
      id: 'soul', 
      label: t.categories.soul.title, 
      icon: <CategoryIcon category="soul" size={14} className="w-3.5 h-3.5 text-[#9123A6] dark:text-[#f472b6]" />,
      count: soulGoals.length,
      completed: soulGoals.filter(g => g.status === 'good').length,
      accentColor: 'text-[#9123A6] dark:text-[#f472b6]'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 dark:bg-[#121614] transition-colors selection:bg-brand-500 selection:text-white relative">
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
            {/* Reviewed Week Highlight Banner */}
            {currentWeekPlan.reviewedAt && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 dark:from-purple-950/40 dark:via-pink-950/30 dark:to-rose-950/40 border border-purple-200/70 dark:border-purple-800/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-fade-in">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#9123A6] to-[#D7195F] text-white shadow-2xs shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {t.reviewCompletedTitle}
                      </h3>
                      <div className="flex items-center gap-1 text-2xs font-medium">
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {goals.filter(g => g.status === 'good').length} {t.status.good}
                        </span>
                        {goals.filter(g => g.status === 'partly').length > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {goals.filter(g => g.status === 'partly').length} {t.status.partly}
                          </span>
                        )}
                        {goals.filter(g => g.status === 'poor').length > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            {goals.filter(g => g.status === 'poor').length} {t.status.poor}
                          </span>
                        )}
                      </div>
                    </div>
                    {currentWeekPlan.generalReflection && (
                      <p className="text-2xs sm:text-xs text-stone-600 dark:text-stone-300 italic font-serif mt-0.5">
                        "{currentWeekPlan.generalReflection}"
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="self-end sm:self-center text-2xs px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 font-medium active:scale-95 transition-all shadow-2xs whitespace-nowrap"
                >
                  {t.editReview}
                </button>
              </div>
            )}

            {/* Mobile Category Segmented Switcher */}
            <div className="md:hidden">
              <div className="grid grid-cols-4 gap-1 p-1 bg-stone-200/60 dark:bg-stone-800/80 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-2xs">
                {categoryTabs.map(tab => {
                  const isActive = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 min-h-[44px] ${
                        isActive
                          ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 shadow-xs font-semibold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {tab.icon}
                        <span className="truncate">{tab.label}</span>
                      </div>
                      <span className={`text-2xs px-1.5 py-0.2 rounded-full font-sans ${
                        isActive
                          ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          : 'text-stone-400 dark:text-stone-500'
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

      {/* Mobile Sticky Bottom Action Bar (Thumb-Friendly CTA) */}
      {!isHistoryView && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-stone-50/95 dark:bg-[#121614]/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-stone-800/80 px-4 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] shadow-lg transition-colors">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setIsReviewOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:from-[#7e1c91] hover:to-[#c21453] text-white font-medium text-xs sm:text-sm shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentWeekPlan.reviewedAt ? t.viewReview : (t.reviewAndPlanShort || t.reviewAndPlan)}</span>
            </button>
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
