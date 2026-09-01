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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121614] rounded-t-[28px] sm:rounded-3xl shadow-2xl border-t sm:border border-stone-200 dark:border-stone-800 max-h-[92vh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in">
        
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between shrink-0">
          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
            {t.settings.title}
          </h3>
          <button 
            onClick={onClose} 
            aria-label="Schließen"
            className="p-1.5 -mr-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">

          {/* 1. Account & Sync Section */}
          <div>
            <div className="text-2xs sm:text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-1 mb-2">
              {t.settings.account}
            </div>

            <div className="rounded-2xl bg-stone-50 dark:bg-[#161c19] border border-stone-200/70 dark:border-stone-800/80 divide-y divide-stone-200/60 dark:divide-stone-800/60 overflow-hidden">
              {user ? (
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-stone-200 dark:ring-stone-700" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9123A6] to-[#D7195F] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {user.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {user.displayName || 'Google Account'}
                      </h4>
                      <p className="text-2xs sm:text-xs text-stone-500 dark:text-stone-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={signOut}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 active:scale-95"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.actions.signOut}</span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {t.auth.guestMode}
                      </div>
                      <p className="text-2xs sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                        {t.auth.cloudSyncDesc}
                      </p>
                    </div>
                  </div>

                  {isConfigured ? (
                    <button
                      onClick={signInWithGoogle}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100 font-medium text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98"
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
                    <p className="text-2xs text-stone-500">
                      Firebase ist lokal aktiv. Zur Cloud-Synchronisierung können eigene Firebase-Zugangsdaten hinterlegt werden.
                    </p>
                  )}
                </div>
              )}

              {/* Collapsible Firebase Credentials row */}
              <div className="p-3 sm:p-3.5 bg-stone-100/60 dark:bg-stone-800/30">
                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  className="w-full flex items-center justify-between text-2xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Database className="w-3.5 h-3.5" />
                    <span>Firebase Cloud Config (Optional)</span>
                  </span>
                  {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showConfig && (
                  <form onSubmit={handleSaveConfig} className="mt-3 space-y-2.5 pt-2.5 border-t border-stone-200/60 dark:border-stone-700/60 animate-slide-up">
                    <input
                      type="text"
                      placeholder="API Key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                    />
                    <input
                      type="text"
                      placeholder="Project ID"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                    />
                    <input
                      type="text"
                      placeholder="Auth Domain (optional)"
                      value={authDomain}
                      onChange={(e) => setAuthDomain(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                    />
                    <input
                      type="text"
                      placeholder="App ID (optional)"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                    />
                    <div className="flex items-center justify-between pt-1">
                      {saveSuccess ? (
                        <span className="text-2xs text-emerald-600 flex items-center gap-1 font-medium">
                          <Check className="w-3 h-3" /> Gespeichert!
                        </span>
                      ) : <span />}
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl text-2xs font-medium active:scale-95 transition-all"
                      >
                        Speichern
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* 2. Appearance & Language Section */}
          <div>
            <div className="text-2xs sm:text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-1 mb-2">
              {t.settings.appearance}
            </div>

            <div className="rounded-2xl bg-stone-50 dark:bg-[#161c19] border border-stone-200/70 dark:border-stone-800/80 divide-y divide-stone-200/60 dark:divide-stone-800/60 overflow-hidden">
              
              {/* Theme Row */}
              <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                    {t.settings.theme}
                  </span>
                </div>

                <div className="inline-flex p-1 bg-stone-200/70 dark:bg-stone-800/80 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1 ${
                      theme === 'light'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.settings.light}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1 ${
                      theme === 'dark'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t.settings.dark}</span>
                  </button>
                </div>
              </div>

              {/* Language Row */}
              <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                    {t.settings.language}
                  </span>
                </div>

                <div className="inline-flex p-1 bg-stone-200/70 dark:bg-stone-800/80 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setLanguage('de')}
                    className={`px-3 py-1 rounded-lg text-xs transition-all ${
                      language === 'de'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium'
                    }`}
                  >
                    DE
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-lg text-xs transition-all ${
                      language === 'en'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium'
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
            <div className="text-2xs sm:text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-1 mb-2 flex items-center justify-between">
              <span>{t.settings.notifications}</span>
              <span className="text-2xs font-normal normal-case text-stone-400 dark:text-stone-500">
                So & Mo 17:00
              </span>
            </div>

            <div className="rounded-2xl bg-stone-50 dark:bg-[#161c19] border border-stone-200/70 dark:border-stone-800/80 divide-y divide-stone-200/60 dark:divide-stone-800/60 overflow-hidden">
              {user ? (
                <>
                  {/* Push Notifications Row */}
                  <div className="p-3.5 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0" />
                        <div>
                          <h6 className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                            {t.notifications.pushTitle}
                          </h6>
                          <p className="text-2xs text-stone-500 dark:text-stone-400">
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
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          notificationPrefs.pushEnabled ? 'bg-[#9123A6]' : 'bg-stone-300 dark:bg-stone-700'
                        } ${isRegisteringPush ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            notificationPrefs.pushEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* iOS Note */}
                    {isIos && !isStandalone && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-2 text-2xs text-amber-800 dark:text-amber-300">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{t.notifications.iosNotice}</span>
                      </div>
                    )}

                    {/* Push Status / Message */}
                    {pushStatusMessage && (
                      <div className="text-2xs text-stone-600 dark:text-stone-300 flex items-center gap-1.5 pt-1">
                        <AlertCircle className="w-3.5 h-3.5 text-[#9123A6] dark:text-[#f472b6] shrink-0" />
                        <span>{pushStatusMessage}</span>
                      </div>
                    )}

                    {/* Unregistered Device Callout */}
                    {notificationPrefs.pushEnabled && !isDeviceRegistered && (
                      <div className="p-2.5 rounded-xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-200/60 dark:border-pink-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-2xs text-stone-700 dark:text-stone-300">
                          {t.notifications.deviceNotRegistered}
                        </span>
                        <button
                          type="button"
                          onClick={handleRegisterCurrentDevice}
                          disabled={isRegisteringPush}
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#9123A6] to-[#D7195F] text-white text-2xs font-medium active:scale-95 transition-all shadow-2xs whitespace-nowrap"
                        >
                          {t.notifications.enableCurrentDevice}
                        </button>
                      </div>
                    )}

                    {/* Device Status & Test Push */}
                    {notificationPrefs.pushEnabled && (
                      <div className="pt-2 flex items-center justify-between border-t border-stone-200/50 dark:border-stone-800/60">
                        <span className="text-2xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>{isDeviceRegistered ? t.notifications.deviceActive : t.notifications.statusEnabled}</span>
                          {deviceCount > 1 && (
                            <span className="text-stone-400 dark:text-stone-500 font-normal">
                              ({deviceCount} {t.notifications.devicesRegistered})
                            </span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={handleSendTestPush}
                          className="px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-2xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <Send className="w-3 h-3" />
                          <span>{testSent ? t.notifications.testPushSent : t.notifications.sendTestPush}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Email Notifications Row */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0" />
                      <div>
                        <h6 className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                          {t.notifications.emailTitle}
                        </h6>
                        <p className="text-2xs text-stone-500 dark:text-stone-400">
                          {user.email ? `${t.notifications.emailDesc} ${user.email}` : t.notifications.emailDesc}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={notificationPrefs.emailEnabled}
                      onClick={handleToggleEmail}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notificationPrefs.emailEnabled ? 'bg-[#9123A6]' : 'bg-stone-300 dark:bg-stone-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          notificationPrefs.emailEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-3.5 sm:p-4 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>{t.notifications.loginRequired}</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Data & Backup Section */}
          <div>
            <div className="text-2xs sm:text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-1 mb-2">
              {t.settings.data}
            </div>

            <div className="rounded-2xl bg-stone-50 dark:bg-[#161c19] border border-stone-200/70 dark:border-stone-800/80 divide-y divide-stone-200/60 dark:divide-stone-800/60 overflow-hidden">
              
              {/* Export Row */}
              <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                      {t.actions.exportData}
                    </span>
                    <p className="text-2xs text-stone-400 dark:text-stone-500">
                      JSON-Backup Datei sichern
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleExport}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 active:scale-95 transition-all shrink-0"
                >
                  Exportieren
                </button>
              </div>

              {/* Import Row */}
              <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                      {t.actions.importData}
                    </span>
                    <p className="text-2xs text-stone-400 dark:text-stone-500">
                      Pläne aus JSON wiederherstellen
                    </p>
                  </div>
                </div>

                <label className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 cursor-pointer active:scale-95 transition-all shrink-0">
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
                <div className="p-2.5 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50/50 dark:bg-emerald-950/20">
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
