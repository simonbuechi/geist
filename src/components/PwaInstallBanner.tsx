import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { KgsLogo } from './KgsLogo';
import { IconButton } from './IconButton';
import { RoughBorder } from './RoughBorder';
import { RoughBackground } from './RoughBackground';

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
    <div className="fixed bottom-20 md:bottom-4 left-3.5 right-3.5 sm:left-auto sm:right-6 sm:max-w-sm z-40 p-4 bg-[#FCF9F4] dark:bg-[#221F1D] text-[#332B25] dark:text-[#EAE2D9] shadow-notebook animate-slide-up flex flex-col gap-3 overflow-hidden">
      <RoughBorder borderRadius={2} width={1.2} color="#8C7E72" darkColor="#7A6F66" opacity={0.45} />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <KgsLogo size={28} />
          <div>
            <h4 className="text-base font-sans font-semibold text-[#332B25] dark:text-[#EAE2D9]">
              {t.pwa.installTitle}
            </h4>
            <p className="text-xs text-[#7A6F66] dark:text-[#A3968B] mt-0.5 leading-snug font-serif">
              {t.pwa.installDesc}
            </p>
          </div>
        </div>
        <IconButton
          onClick={handleDismiss}
          title={t.pwa.dismissButton || 'Schließen'}
          aria-label="Schließen"
          variant="ghost"
          size="sm"
        >
          <X className="w-3.5 h-3.5 stroke-[2.2]" />
        </IconButton>
      </div>

      <div className="relative z-10 flex items-center justify-end gap-2 pt-1">
        <button
          onClick={handleDismiss}
          className="px-3 py-1 text-sm font-sans font-semibold text-[#7A6F66] dark:text-[#A3968B] transition-colors"
        >
          {t.pwa.dismissButton}
        </button>
        <button
          onClick={handleInstall}
          className="relative px-4 py-1.5 text-[#FAF6F0] border-0 font-sans font-semibold text-sm transition-all flex items-center gap-1.5 sketch-btn-press overflow-hidden"
        >
          <RoughBackground
            fill="#C46345"
            darkFill="#B05236"
            fillStyle="cross-hatch"
            hachureAngle={-38}
            hachureGap={2.8}
            fillWeight={1.4}
            opacity={0.94}
            seed={801}
          />
          <RoughBorder borderRadius={2} width={0.9} color="#8F4028" opacity={0.5} />
          <Download className="w-3.5 h-3.5 stroke-[2.2] relative z-10" />
          <span className="relative z-10">{t.pwa.installButton}</span>
        </button>
      </div>
    </div>
  );
};
