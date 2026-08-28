import React, { useState } from 'react';
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

const MainDashboard: React.FC = () => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryView, setIsHistoryView] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 dark:bg-[#121614] transition-colors">
      <Header
        onOpenReview={() => setIsReviewOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isHistoryView={isHistoryView}
        onToggleHistory={() => setIsHistoryView(!isHistoryView)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {isHistoryView ? (
          <HistoryView onClose={() => setIsHistoryView(false)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch flex-1">
            <CategoryCard category="body" />
            <CategoryCard category="mind" />
            <CategoryCard category="soul" />
          </div>
        )}
      </main>

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
