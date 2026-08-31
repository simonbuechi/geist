import React, { useState, useEffect } from 'react';
import { 
  X, 
  LogOut, 
  Download, 
  Upload, 
  ShieldCheck, 
  Key, 
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
  Settings
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

  const isPushSupported = isPushNotificationSupported();
  const isIos = isIosDevice();
  const isStandalone = isStandalonePwa();

  useEffect(() => {
    if (user?.uid) {
      fetchNotificationPreferences(user.uid).then((prefs) => {
        setNotificationPrefs(prefs);
      });
    }
  }, [user?.uid]);

  const handleTogglePush = async () => {
    if (!user) return;
    setPushStatusMessage(null);

    if (notificationPrefs.pushEnabled) {
      const updated: NotificationPreferences = { ...notificationPrefs, pushEnabled: false };
      setNotificationPrefs(updated);
      await saveNotificationPreferences(user.uid, updated);
      return;
    }

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

    const updated: NotificationPreferences = { ...notificationPrefs, pushEnabled: true };
    setNotificationPrefs(updated);
    await saveNotificationPreferences(user.uid, updated);
    setPushStatusMessage(t.notifications.statusEnabled);
    setTimeout(() => setPushStatusMessage(null), 3000);
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
        setImportStatus('Fehler beim Importieren der Datei.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-t-[28px] sm:rounded-3xl shadow-2xl border-t sm:border border-stone-200 dark:border-stone-800 max-h-[92vh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in pb-safe">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-[#9123A6] dark:text-[#f472b6]">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
              {t.settings.title}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close"
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto overscroll-contain">
          {/* User Status Card */}
          {user ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {user.displayName || 'Google Benutzer'}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={signOut}
                className="p-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-stone-700 dark:text-stone-300 hover:text-rose-600 transition-colors"
                title={t.actions.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.auth.offlineActive}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {t.auth.guestDesc}
                </p>
              </div>

              {isConfigured ? (
                <button
                  onClick={signInWithGoogle}
                  className="w-full py-3 px-4 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100 font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2"
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
                <div className="space-y-3">
                  <p className="text-xs text-stone-500">
                    Firebase ist noch nicht verbunden. Du kannst die App sofort vollumfänglich lokal nutzen oder deine Firebase Zugangsdaten hinterlegen.
                  </p>
                  <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="text-xs text-[#9123A6] dark:text-[#f472b6] font-medium hover:underline flex items-center gap-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>Firebase Credentials konfigurieren</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Firebase Custom Config Form */}
          {showConfig && (
            <form onSubmit={handleSaveConfig} className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800 space-y-3 animate-slide-up">
              <h5 className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Firebase Web Config
              </h5>
              <input
                type="text"
                placeholder="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full text-base sm:text-xs p-2.5 sm:p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
              />
              <input
                type="text"
                placeholder="Project ID"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-base sm:text-xs p-2.5 sm:p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
              />
              <input
                type="text"
                placeholder="Auth Domain (optional)"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                className="w-full text-base sm:text-xs p-2.5 sm:p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
              />
              <input
                type="text"
                placeholder="App ID (optional)"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full text-base sm:text-xs p-2.5 sm:p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
              />
              <div className="flex items-center justify-between pt-1">
                {saveSuccess ? (
                  <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" /> Gespeichert!
                  </span>
                ) : <span />}
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#9123A6] to-[#D7195F] text-white rounded-xl text-xs font-medium shadow-sm active:scale-95 transition-all"
                >
                  Speichern & Verbinden
                </button>
              </div>
            </form>
          )}

          {/* Appearance & Language Section */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-950 text-[#9123A6] dark:text-[#f472b6]">
                <Globe className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {t.settings.appearance}
              </h5>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Theme Switcher */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 shadow-2xs">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  </div>
                  <span className="text-xs font-medium text-stone-900 dark:text-stone-100">
                    {t.settings.theme}
                  </span>
                </div>

                <div className="flex items-center p-1 bg-stone-200/70 dark:bg-stone-900/80 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      theme === 'light'
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.settings.light}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      theme === 'dark'
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t.settings.dark}</span>
                  </button>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 shadow-2xs">
                    <Globe className="w-4 h-4 text-sky-500" />
                  </div>
                  <span className="text-xs font-medium text-stone-900 dark:text-stone-100">
                    {t.settings.language}
                  </span>
                </div>

                <div className="flex items-center p-1 bg-stone-200/70 dark:bg-stone-900/80 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setLanguage('de')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      language === 'de'
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    DE
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      language === 'en'
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reminders & Notifications Section */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  <Bell className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {t.notifications.title}
                </h5>
              </div>
              <span className="text-2xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 font-medium">
                So & Mo 17:00
              </span>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t.notifications.scheduleInfo}
            </p>

            {user ? (
              <div className="space-y-3">
                {/* Push Notifications Toggle */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 shadow-2xs">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h6 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
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
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          notificationPrefs.pushEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* iOS Special Instructions */}
                  {isIos && !isStandalone && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2 text-2xs text-amber-800 dark:text-amber-300">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{t.notifications.iosNotice}</span>
                    </div>
                  )}

                  {/* Push Status / Error */}
                  {pushStatusMessage && (
                    <div className="text-2xs text-stone-600 dark:text-stone-300 flex items-center gap-1.5 pt-1">
                      <AlertCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>{pushStatusMessage}</span>
                    </div>
                  )}

                  {/* Test Push Button */}
                  {notificationPrefs.pushEnabled && (
                    <div className="pt-1 flex items-center justify-between border-t border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-2xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> {t.notifications.statusEnabled}
                      </span>
                      <button
                        type="button"
                        onClick={handleSendTestPush}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-2xs text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1 active:scale-95 transition-all"
                      >
                        <Send className="w-3 h-3" />
                        <span>{testSent ? t.notifications.testPushSent : t.notifications.sendTestPush}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Email Notifications Toggle */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 shadow-2xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
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
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        notificationPrefs.emailEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400">
                {t.notifications.loginRequired}
              </div>
            )}
          </div>

          {/* Data Backup & Restore */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Datensicherung & Export
            </h5>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleExport}
                className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center justify-center gap-1.5 active:scale-95 transition-all min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>{t.actions.exportData}</span>
              </button>

              <label className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all min-h-[44px]">
                <Upload className="w-4 h-4" />
                <span>{t.actions.importData}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
            {importStatus && (
              <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 font-medium">
                {importStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
