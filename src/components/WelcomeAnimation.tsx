import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SacredConstructLogo } from './SacredLogo';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const hasFinishedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 250);
  }, [onComplete]);

  useEffect(() => {
    // 1.5s total animation duration
    const timer = setTimeout(() => {
      handleFinish();
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [handleFinish]);

  return (
    <div
      onClick={handleFinish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-stone-50/80 dark:bg-[#0c0e0d]/80 backdrop-blur-md transition-opacity duration-250 cursor-pointer select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Welcome Screen"
    >
      {/* Skip button at top right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pt-safe pr-safe z-30">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          className="px-3.5 py-1.5 rounded-full bg-stone-200/70 dark:bg-stone-800/70 hover:bg-stone-300/80 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400 text-xs font-medium transition-all active:scale-95 flex items-center gap-1.5"
        >
          <span>{t.actions.skip}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Inspiring Stage */}
      <div className="relative flex flex-col items-center justify-center max-w-sm w-full text-center">
        {/* Sacred Geometry Construction Stage */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-2">
          <SacredConstructLogo size={160} />
        </div>

        {/* App Title visible from the beginning */}
        <div className="flex flex-col items-center mt-3">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50">
            {t.appTitle}
          </h2>
        </div>
      </div>
    </div>
  );
};
