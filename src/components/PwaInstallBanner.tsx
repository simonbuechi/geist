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
    <div className="fixed bottom-20 md:bottom-4 left-3.5 right-3.5 sm:left-auto sm:right-6 sm:max-w-sm z-40 p-4 rounded-none bg-[#FDFBF7] dark:bg-[#25201C] text-[#4A3E36] dark:text-[#EDE5DD] shadow-2xl border-2 border-[#7A6A5E]/40 dark:border-[#EDE5DD]/40 sketch-shadow animate-slide-up flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <KgsLogo size={28} />
          <div>
            <h4 className="text-sm font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
              {t.pwa.installTitle}
            </h4>
            <p className="text-2xs text-[#7D6E63] dark:text-[#BA9F83] mt-0.5 leading-snug font-sans">
              {t.pwa.installDesc}
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-[#7D6E63] hover:text-[#4A3E36] dark:hover:text-[#EDE5DD] p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={handleDismiss}
          className="px-3 py-1 text-xs font-hand font-bold text-[#7D6E63] hover:text-[#4A3E36] dark:hover:text-[#EDE5DD] transition-colors"
        >
          {t.pwa.dismissButton}
        </button>
        <button
          onClick={handleInstall}
          className="px-4 py-1.5 rounded-none bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:opacity-95 text-white border border-[#7A6A5E]/30 font-hand font-bold text-xs shadow-pencil-sm transition-all flex items-center gap-1.5 sketch-btn-press"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>{t.pwa.installButton}</span>
        </button>
      </div>
    </div>
  );
};
