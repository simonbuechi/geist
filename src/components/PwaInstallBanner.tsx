import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { KgsLogo } from './KgsLogo';

export const PwaInstallBanner: React.FC = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed recently
      const dismissed = localStorage.getItem('kgs_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('kgs_pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-3.5 right-3.5 sm:left-auto sm:right-6 sm:max-w-sm z-40 p-4 rounded-3xl bg-stone-900/95 dark:bg-stone-800/95 text-white shadow-2xl backdrop-blur-md border border-stone-700/80 animate-slide-up flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <KgsLogo size={24} />
          <div>
            <h4 className="text-xs font-semibold text-white">
              {t.pwa.installTitle}
            </h4>
            <p className="text-2xs text-stone-300 mt-0.5 leading-snug">
              {t.pwa.installDesc}
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-stone-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={handleDismiss}
          className="px-3 py-1 text-2xs text-stone-400 hover:text-white transition-colors"
        >
          {t.pwa.dismissButton}
        </button>
        <button
          onClick={handleInstall}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:from-[#7e1c91] hover:to-[#c21453] text-white text-xs font-medium shadow-md shadow-[#9123A6]/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.pwa.installButton}</span>
        </button>
      </div>
    </div>
  );
};
