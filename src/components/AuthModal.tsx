import React, { useState, useEffect } from 'react';
import { 
  X, 
  LogOut, 
  Download, 
  Upload, 
  Check,
  Bell,
  Mail,
  Smartphone,
  Info,
  Send,
  AlertCircle,
  Sun,
  Moon,
  Globe,
  Database,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useGoals } from '../context/GoalsContext';
import { RoughBorder } from './RoughBorder';
import { RoughBackground } from './RoughBackground';
import { IconButton } from './IconButton';
import { 
  getDefaultFirebaseConfig, 
  saveStoredFirebaseConfig, 
  type FirebaseCustomConfig 
} from '../config/firebase';
import {
  registerPushNotification,
  saveNotificationPreferences,
  fetchNotificationPreferences,
  showLocalTestNotification,
  isPushNotificationSupported,
  isIosDevice,
  isStandalonePwa,
  isCurrentDeviceRegistered,
  getRegisteredDevicesCount,
  DEFAULT_NOTIFICATION_PREFERENCES
} from '../config/notifications';
import type { NotificationPreferences } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, isConfigured, signInWithGoogle, signOut, reloadFirebase } = useAuth();
  const { exportData, importData } = useGoals();

  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState(getDefaultFirebaseConfig().apiKey || '');
  const [projectId, setProjectId] = useState(getDefaultFirebaseConfig().projectId || '');
  const [authDomain, setAuthDomain] = useState(getDefaultFirebaseConfig().authDomain || '');
  const [appId, setAppId] = useState(getDefaultFirebaseConfig().appId || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  const [isRegisteringPush, setIsRegisteringPush] = useState(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);
  const [testSent, setTestSent] = useState(false);
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(isCurrentDeviceRegistered());
  const [deviceCount, setDeviceCount] = useState<number>(0);

  const isPushSupported = isPushNotificationSupported();
  const isIos = isIosDevice();
  const isStandalone = isStandalonePwa();

  useEffect(() => {
    if (user?.uid && isOpen) {
      fetchNotificationPreferences(user.uid).then((prefs) => {
        setNotificationPrefs(prefs);
      });
      getRegisteredDevicesCount(user.uid).then((cnt) => {
        setDeviceCount(cnt);
      });
      setIsDeviceRegistered(isCurrentDeviceRegistered());
    }
  }, [user?.uid, isOpen]);

  const handleRegisterCurrentDevice = async () => {
    if (!user) return;
    setPushStatusMessage(null);

    if (isIos && !isStandalone) {
      setPushStatusMessage(t.notifications.iosNotice);
      return;
    }

    setIsRegisteringPush(true);
    const res = await registerPushNotification(user.uid);
    setIsRegisteringPush(false);

    if (res.error) {
      setPushStatusMessage(res.error);
      return;
    }

    setIsDeviceRegistered(true);
    const cnt = await getRegisteredDevicesCount(user.uid);
    setDeviceCount(cnt);

    if (!notificationPrefs.pushEnabled) {
      const updated: NotificationPreferences = { ...notificationPrefs, pushEnabled: true };
      setNotificationPrefs(updated);
      await saveNotificationPreferences(user.uid, updated);
    }
    setPushStatusMessage(t.notifications.statusEnabled);
    setTimeout(() => setPushStatusMessage(null), 3000);
  };

  const handleTogglePush = async () => {
    if (!user) return;
    setPushStatusMessage(null);

    if (notificationPrefs.pushEnabled) {
      const updated: NotificationPreferences = { ...notificationPrefs, pushEnabled: false };
      setNotificationPrefs(updated);
      await saveNotificationPreferences(user.uid, updated);
      return;
    }

    await handleRegisterCurrentDevice();
  };

  const handleToggleEmail = async () => {
    if (!user) return;
    const updated: NotificationPreferences = {
      ...notificationPrefs,
      emailEnabled: !notificationPrefs.emailEnabled,
      emailAddress: user.email || undefined
    };
    setNotificationPrefs(updated);
    await saveNotificationPreferences(user.uid, updated);
  };

  const handleSendTestPush = () => {
    const ok = showLocalTestNotification(
      'Körper Geist Seele',
      'Zeit für deinen Wochenrückblick! Nimm dir einen kurzen Moment.'
    );
    if (ok) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } else {
      setPushStatusMessage(t.notifications.permissionDenied);
      setTimeout(() => setPushStatusMessage(null), 4000);
    }
  };

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const cfg: FirebaseCustomConfig = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      appId: appId.trim()
    };
    saveStoredFirebaseConfig(cfg);
    reloadFirebase();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kgs-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const ok = importData(content);
      if (ok) {
        setImportStatus('Erfolgreich importiert!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Fehler beim Importieren.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#332B25]/55 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FCF9F4] dark:bg-[#221F1D] shadow-notebook max-h-[92vh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in">
        <RoughBorder borderRadius={2} width={1.3} opacity={0.45} color="#8C7E72" darkColor="#7A6F66" />
        
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 bg-[#8C7E72]/40 dark:bg-[#7A6F66]/40 rounded-none" />
        </div>

        {/* Modal Header */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-4.5 border-b border-[#8C7E72]/25 dark:border-[#7A6F66]/25 flex items-center justify-between shrink-0 bg-[#F3EDE2]/60 dark:bg-[#191614]/60">
          <h3 className="text-xl sm:text-2xl font-hand font-bold text-[#332B25] dark:text-[#EAE2D9] tracking-wide">
            {t.settings.title}
          </h3>
          <IconButton 
            onClick={onClose} 
            title="Schließen"
            aria-label="Schließen"
            variant="ghost"
            size="md"
            className="-mr-1.5"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </IconButton>
        </div>

        {/* Scrollable Settings Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">

          {/* 1. Account & Sync Section */}
          <div>
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-[#7A6F66] dark:text-[#A3968B] px-1 mb-2">
              {t.settings.account}
            </div>

            <div className="relative bg-[#F3EDE2]/55 dark:bg-[#191614]/80 divide-y divide-[#8C7E72]/20 dark:divide-[#7A6F66]/20 overflow-hidden">
              <RoughBorder borderRadius={2} width={1.0} color="#8C7E72" darkColor="#7A6F66" opacity={0.35} />
              {user ? (
                <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#8C7E72]/35" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#C46345] text-[#FAF6F0] flex items-center justify-center font-sans font-bold text-lg shrink-0">
                        {user.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-base font-sans font-bold text-[#332B25] dark:text-[#EAE2D9] truncate">
                        {user.displayName || 'Google Account'}
                      </h4>
                      <p className="text-xs text-[#7A6F66] dark:text-[#A3968B] truncate font-serif">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={signOut}
                    className="px-3 py-1.5 border-0 text-[#7A6F66] dark:text-[#A3968B] text-sm font-sans font-bold transition-colors flex items-center gap-1.5 shrink-0 sketch-btn-press"
                  >
                    <LogOut className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>{t.actions.signOut}</span>
                  </button>
                </div>
              ) : (
                <div className="relative z-10 p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#557659] mt-1.5 shrink-0" />
                    <div>
                      <div className="text-base font-sans font-bold text-[#332B25] dark:text-[#EAE2D9]">
                        {t.auth.guestMode}
                      </div>
                      <p className="text-xs text-[#7A6F66] dark:text-[#A3968B] mt-0.5 leading-relaxed font-serif">
                        {t.auth.cloudSyncDesc}
                      </p>
                    </div>
                  </div>

                  {isConfigured ? (
                    <button
                      onClick={signInWithGoogle}
                      className="relative w-full py-2.5 px-4 bg-[#332B25] dark:bg-[#EAE2D9] text-[#FAF6F0] dark:text-[#191614] font-sans font-bold text-base transition-all flex items-center justify-center gap-2 sketch-btn-press"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>{t.actions.signInWithGoogle}</span>
                    </button>
                  ) : (
                    <p className="text-xs text-[#7A6F66] font-serif italic">
                      Firebase ist lokal aktiv. Zur Cloud-Synchronisierung können eigene Firebase-Zugangsdaten hinterlegt werden.
                    </p>
                  )}
                </div>
              )}

              {/* Collapsible Firebase Credentials row */}
              <div className="relative z-10 p-3 sm:p-3.5 bg-[#EAE2D3]/45 dark:bg-[#221F1D]/60">
                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  className="w-full flex items-center justify-between text-xs text-[#7A6F66] dark:text-[#A3968B] transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-sans font-bold text-sm">
                    <Database className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Firebase Cloud Config (Optional)</span>
                  </span>
                  {showConfig ? <ChevronUp className="w-3.5 h-3.5 stroke-[2.2]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[2.2]" />}
                </button>

                {showConfig && (
                  <form onSubmit={handleSaveConfig} className="mt-3 space-y-2.5 pt-2.5 border-t border-[#8C7E72]/20 animate-slide-up">
                    <input
                      type="text"
                      placeholder="API Key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full text-xs p-2 border border-[#8C7E72]/30 bg-[#FCF9F4] dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] font-sans"
                    />
                    <input
                      type="text"
                      placeholder="Project ID"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full text-xs p-2 border border-[#8C7E72]/30 bg-[#FCF9F4] dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] font-sans"
                    />
                    <input
                      type="text"
                      placeholder="Auth Domain (optional)"
                      value={authDomain}
                      onChange={(e) => setAuthDomain(e.target.value)}
                      className="w-full text-xs p-2 border border-[#8C7E72]/30 bg-[#FCF9F4] dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] font-sans"
                    />
                    <input
                      type="text"
                      placeholder="App ID (optional)"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      className="w-full text-xs p-2 border border-[#8C7E72]/30 bg-[#FCF9F4] dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] font-sans"
                    />
                    <div className="flex items-center justify-between pt-1">
                      {saveSuccess ? (
                        <span className="text-sm font-sans font-bold text-[#4E7A52] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Gespeichert!
                        </span>
                      ) : <span />}
                      <button
                        type="submit"
                        className="relative px-4 py-1.5 text-[#FAF6F0] text-sm font-sans font-bold sketch-btn-press transition-all overflow-hidden"
                      >
                        <RoughBackground fill="#C46345" darkFill="#B05236" fillStyle="cross-hatch" hachureGap={2.8} opacity={0.94} seed={501} />
                        <span className="relative z-10">Speichern</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* 2. Appearance & Language Section */}
          <div>
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-[#7A6F66] dark:text-[#A3968B] px-1 mb-2">
              {t.settings.appearance}
            </div>

            <div className="relative bg-[#F3EDE2]/55 dark:bg-[#191614]/80 divide-y divide-[#8C7E72]/20 dark:divide-[#7A6F66]/20 overflow-hidden">
              <RoughBorder borderRadius={2} width={1.0} color="#8C7E72" darkColor="#7A6F66" opacity={0.35} />
              
              {/* Theme Row */}
              <div className="relative z-10 p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-[#B88028] stroke-[2.2] shrink-0" />
                  ) : (
                    <Sun className="w-4 h-4 text-[#B88028] stroke-[2.2] shrink-0" />
                  )}
                  <span className="text-base font-sans font-bold text-[#332B25] dark:text-[#EAE2D9]">
                    {t.settings.theme}
                  </span>
                </div>

                <div className="inline-flex p-1 bg-[#EAE2D3] dark:bg-[#2A2623] border border-[#8C7E72]/30">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-2.5 py-1 border-0 text-sm font-sans transition-all flex items-center gap-1 ${
                      theme === 'light'
                        ? 'bg-[#FCF9F4] dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] font-bold'
                        : 'text-[#7A6F66] dark:text-[#A3968B]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-[#B88028] stroke-[2.2]" />
                    <span>{t.settings.light}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-2.5 py-1 border-0 text-sm font-sans transition-all flex items-center gap-1 ${
                      theme === 'dark'
                        ? 'bg-[#FCF9F4] dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] font-bold'
                        : 'text-[#7A6F66] dark:text-[#A3968B]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-[#B88028] stroke-[2.2]" />
                    <span>{t.settings.dark}</span>
                  </button>
                </div>
              </div>

              {/* Language Row */}
              <div className="relative z-10 p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#7A6F66] dark:text-[#A3968B] stroke-[2.2] shrink-0" />
                  <span className="text-base font-sans font-bold text-[#332B25] dark:text-[#EAE2D9]">
                    {t.settings.language}
                  </span>
                </div>

                <div className="inline-flex p-1 bg-[#EAE2D3] dark:bg-[#2A2623] border border-[#8C7E72]/30">
                  <button
                    type="button"
                    onClick={() => setLanguage('de')}
                    className={`px-3 py-1 border-0 text-sm font-sans transition-all ${
                      language === 'de'
                        ? 'bg-[#FCF9F4] dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] font-bold'
                        : 'text-[#7A6F66] dark:text-[#A3968B]'
                    }`}
                  >
                    DE
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 border-0 text-sm font-sans transition-all ${
                      language === 'en'
                        ? 'bg-[#FCF9F4] dark:bg-[#191614] text-[#332B25] dark:text-[#EAE2D9] font-bold'
                        : 'text-[#7A6F66] dark:text-[#A3968B]'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Notifications Section */}
          <div>
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-[#7A6F66] dark:text-[#A3968B] px-1 mb-2 flex items-center justify-between">
              <span>{t.settings.notifications}</span>
              <span className="text-2xs font-normal normal-case text-[#7A6F66] dark:text-[#A3968B] font-serif italic">
                So & Mo 17:00
              </span>
            </div>

            <div className="relative bg-[#F3EDE2]/55 dark:bg-[#191614]/80 divide-y divide-[#8C7E72]/20 dark:divide-[#7A6F66]/20 overflow-hidden">
              <RoughBorder borderRadius={2} width={1.0} color="#8C7E72" darkColor="#7A6F66" opacity={0.35} />
              {user ? (
                <>
                  {/* Push Notifications Row */}
                  <div className="relative z-10 p-3.5 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-[#7A6F66] dark:text-[#A3968B] stroke-[2.2] shrink-0" />
                        <div>
                          <h6 className="text-base font-sans font-bold text-[#332B25] dark:text-[#EAE2D9]">
                            {t.notifications.pushTitle}
                          </h6>
                          <p className="text-xs text-[#7A6F66] dark:text-[#A3968B] font-serif">
                            {t.notifications.pushDesc}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={notificationPrefs.pushEnabled}
                        disabled={isRegisteringPush || (!isPushSupported && !isIos)}
                        onClick={handleTogglePush}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer border border-[#8C7E72] transition-colors duration-200 ease-in-out focus:outline-none ${
                          notificationPrefs.pushEnabled ? 'bg-[#C46345]' : 'bg-[#D9CEBF] dark:bg-[#332B25]'
                        } ${isRegisteringPush ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform bg-[#FCF9F4] shadow-xs transition duration-200 ease-in-out ${
                            notificationPrefs.pushEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* iOS Note */}
                    {isIos && !isStandalone && (
                      <div className="p-2.5 bg-[#FAF4E8] dark:bg-[#2C231D] border border-[#B88028]/50 flex items-start gap-2 text-xs text-[#B88028] dark:text-[#E2B467]">
                        <Info className="w-3.5 h-3.5 stroke-[2.2] shrink-0 mt-0.5" />
                        <span className="font-serif">{t.notifications.iosNotice}</span>
                      </div>
                    )}

                    {/* Push Status / Message */}
                    {pushStatusMessage && (
                      <div className="text-xs text-[#7A6F66] dark:text-[#A3968B] flex items-center gap-1.5 pt-1 font-serif">
                        <AlertCircle className="w-3.5 h-3.5 text-[#C46345] shrink-0 stroke-[2.2]" />
                        <span>{pushStatusMessage}</span>
                      </div>
                    )}

                    {/* Unregistered Device Callout */}
                    {notificationPrefs.pushEnabled && !isDeviceRegistered && (
                      <div className="p-2.5 bg-[#FAF1ED] dark:bg-[#2E1E1A] border border-[#C46345]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-xs text-[#332B25] dark:text-[#EAE2D9] font-serif">
                          {t.notifications.deviceNotRegistered}
                        </span>
                        <button
                          type="button"
                          onClick={handleRegisterCurrentDevice}
                          disabled={isRegisteringPush}
                          className="px-3 py-1 bg-[#C46345] text-[#FAF6F0] text-sm font-sans font-bold sketch-btn-press transition-all whitespace-nowrap"
                        >
                          {t.notifications.enableCurrentDevice}
                        </button>
                      </div>
                    )}

                    {/* Device Status & Test Push */}
                    {notificationPrefs.pushEnabled && (
                      <div className="pt-2 flex items-center justify-between border-t border-[#8C7E72]/20">
                        <span className="text-xs text-[#4E7A52] dark:text-[#89B08E] font-semibold flex items-center gap-1 font-sans">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>{isDeviceRegistered ? t.notifications.deviceActive : t.notifications.statusEnabled}</span>
                          {deviceCount > 1 && (
                            <span className="text-[#7A6F66] dark:text-[#A3968B] font-normal">
                              ({deviceCount} {t.notifications.devicesRegistered})
                            </span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={handleSendTestPush}
                          className="px-2.5 py-1 border-0 text-sm text-[#332B25] dark:text-[#EAE2D9] font-sans font-bold flex items-center gap-1 sketch-btn-press transition-all"
                        >
                          <Send className="w-3 h-3 stroke-[2.2]" />
                          <span>{testSent ? t.notifications.testPushSent : t.notifications.sendTestPush}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Email Notifications Row */}
                  <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#7A6F66] dark:text-[#A3968B] stroke-[2.2] shrink-0" />
                      <div>
                        <h6 className="text-base font-sans font-bold text-[#332B25] dark:text-[#EAE2D9]">
                          {t.notifications.emailTitle}
                        </h6>
                        <p className="text-xs text-[#7A6F66] dark:text-[#A3968B] font-serif">
                          {user.email ? `${t.notifications.emailDesc} ${user.email}` : t.notifications.emailDesc}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={notificationPrefs.emailEnabled}
                      onClick={handleToggleEmail}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer border border-[#8C7E72] transition-colors duration-200 ease-in-out focus:outline-none ${
                        notificationPrefs.emailEnabled ? 'bg-[#C46345]' : 'bg-[#D9CEBF] dark:bg-[#332B25]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform bg-[#FCF9F4] shadow-xs transition duration-200 ease-in-out ${
                          notificationPrefs.emailEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </>
              ) : (
                <div className="relative z-10 p-4 text-sm text-[#7A6F66] dark:text-[#A3968B] flex items-center gap-2 font-serif italic">
                  <Bell className="w-4 h-4 stroke-[2.2] text-[#7A6F66] shrink-0" />
                  <span>{t.notifications.loginRequired}</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Data & Backup Section */}
          <div>
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-[#7A6F66] dark:text-[#A3968B] px-1 mb-2">
              {t.settings.data}
            </div>

            <div className="relative bg-[#F3EDE2]/55 dark:bg-[#191614]/80 divide-y divide-[#8C7E72]/20 dark:divide-[#7A6F66]/20 overflow-hidden">
              <RoughBorder borderRadius={2} width={1.0} color="#8C7E72" darkColor="#7A6F66" opacity={0.35} />
              
              {/* Export Row */}
              <div className="relative z-10 p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-[#7A6F66] dark:text-[#A3968B] stroke-[2.2] shrink-0" />
                  <div>
                    <span className="text-base font-sans font-bold text-[#332B25] dark:text-[#EAE2D9]">
                      {t.actions.exportData}
                    </span>
                    <p className="text-xs text-[#7A6F66] font-serif">
                      JSON-Backup Datei sichern
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleExport}
                  className="px-3.5 py-1.5 border border-[#8C7E72]/35 bg-[#FCF9F4] dark:bg-[#221F1D] text-sm font-sans font-bold text-[#332B25] dark:text-[#EAE2D9] sketch-btn-press transition-all shrink-0"
                >
                  Exportieren
                </button>
              </div>

              {/* Import Row */}
              <div className="relative z-10 p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-[#7A6F66] dark:text-[#A3968B] stroke-[2.2] shrink-0" />
                  <div>
                    <span className="text-base font-sans font-bold text-[#332B25] dark:text-[#EAE2D9]">
                      {t.actions.importData}
                    </span>
                    <p className="text-xs text-[#7A6F66] font-serif">
                      Pläne aus JSON wiederherstellen
                    </p>
                  </div>
                </div>

                <label className="px-3.5 py-1.5 border border-[#8C7E72]/35 bg-[#FCF9F4] dark:bg-[#221F1D] text-sm font-sans font-bold text-[#332B25] dark:text-[#EAE2D9] cursor-pointer sketch-btn-press transition-all shrink-0">
                  Importieren
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>

              {importStatus && (
                <div className="relative z-10 p-2.5 text-center text-sm text-[#4E7A52] font-sans font-bold bg-[#F1F6F1] dark:bg-[#1E2A20]">
                  {importStatus}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
