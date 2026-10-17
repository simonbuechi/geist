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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#4A3E36]/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FDFBF7] dark:bg-[#25201C] rounded-none shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in sketch-shadow">
        <RoughBorder borderRadius={0} width={1.2} opacity={0.5} />
        
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 bg-[#BA9F83] dark:bg-[#6A5C52] rounded-none" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-4.5 border-b-2 border-dashed border-[#7A6A5E]/25 dark:border-[#EDE5DD]/20 flex items-center justify-between shrink-0">
          <h3 className="text-lg sm:text-xl font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
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
            <div className="text-xs font-hand font-bold uppercase tracking-wider text-[#7D6E63] dark:text-[#BA9F83] px-1 mb-2">
              {t.settings.account}
            </div>

            <div className="rounded-none bg-[#FAF5ED] dark:bg-[#1E1B18] border-1.5 border-[#7A6A5E]/30 dark:border-[#EDE5DD]/30 divide-y divide-[#7A6A5E]/15 dark:divide-[#EDE5DD]/15 overflow-hidden sketch-border-sm">
              {user ? (
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-none object-cover shrink-0 border-2 border-[#7A6A5E]/30" />
                    ) : (
                      <div className="w-10 h-10 rounded-none bg-gradient-to-r from-[#9123A6] to-[#D7195F] text-white flex items-center justify-center font-hand font-bold text-base shrink-0 border border-[#7A6A5E]/30">
                        {user.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD] truncate">
                        {user.displayName || 'Google Account'}
                      </h4>
                      <p className="text-2xs sm:text-xs text-[#7D6E63] dark:text-[#BA9F83] truncate font-sans">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={signOut}
                    className="px-3 py-1.5 rounded-none border-0 text-[#7D6E63] dark:text-[#BA9F83] text-xs font-hand font-bold transition-colors flex items-center gap-1.5 shrink-0 sketch-btn-press"
                  >
                    <LogOut className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>{t.actions.signOut}</span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-none bg-[#4D7A4A] mt-1 shrink-0 border border-[#7A6A5E]/30" />
                    <div>
                      <div className="text-xs sm:text-sm font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
                        {t.auth.guestMode}
                      </div>
                      <p className="text-2xs sm:text-xs text-[#7D6E63] dark:text-[#BA9F83] mt-0.5 leading-relaxed font-sans">
                        {t.auth.cloudSyncDesc}
                      </p>
                    </div>
                  </div>

                  {isConfigured ? (
                    <button
                      onClick={signInWithGoogle}
                      className="w-full py-2.5 px-4 rounded-none bg-[#5C4F45] dark:bg-[#EDE5DD] text-white dark:text-[#4A3E36] font-hand font-bold text-xs sm:text-sm transition-all shadow-pencil-sm flex items-center justify-center gap-2 sketch-btn-press"
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
                    <p className="text-2xs text-[#7D6E63] font-sans">
                      Firebase ist lokal aktiv. Zur Cloud-Synchronisierung können eigene Firebase-Zugangsdaten hinterlegt werden.
                    </p>
                  )}
                </div>
              )}

              {/* Collapsible Firebase Credentials row */}
              <div className="p-3 sm:p-3.5 bg-[#EAE0D2]/50 dark:bg-[#25201C]/60">
                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  className="w-full flex items-center justify-between text-2xs text-[#7D6E63] dark:text-[#BA9F83] transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-hand font-bold text-xs">
                    <Database className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Firebase Cloud Config (Optional)</span>
                  </span>
                  {showConfig ? <ChevronUp className="w-3.5 h-3.5 stroke-[2.2]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[2.2]" />}
                </button>

                {showConfig && (
                  <form onSubmit={handleSaveConfig} className="mt-3 space-y-2.5 pt-2.5 border-t border-[#7A6A5E]/15 dark:border-[#EDE5DD]/15 animate-slide-up">
                    <input
                      type="text"
                      placeholder="API Key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full text-xs p-2 rounded-none border border-[#7A6A5E]/30 dark:border-[#EDE5DD]/30 bg-[#FDFBF7] dark:bg-[#1E1B18] text-[#4A3E36] dark:text-[#EDE5DD] font-sans"
                    />
                    <input
                      type="text"
                      placeholder="Project ID"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full text-xs p-2 rounded-none border border-[#7A6A5E]/30 dark:border-[#EDE5DD]/30 bg-[#FDFBF7] dark:bg-[#1E1B18] text-[#4A3E36] dark:text-[#EDE5DD] font-sans"
                    />
                    <input
                      type="text"
                      placeholder="Auth Domain (optional)"
                      value={authDomain}
                      onChange={(e) => setAuthDomain(e.target.value)}
                      className="w-full text-xs p-2 rounded-none border border-[#7A6A5E]/30 dark:border-[#EDE5DD]/30 bg-[#FDFBF7] dark:bg-[#1E1B18] text-[#4A3E36] dark:text-[#EDE5DD] font-sans"
                    />
                    <input
                      type="text"
                      placeholder="App ID (optional)"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      className="w-full text-xs p-2 rounded-none border border-[#7A6A5E]/30 dark:border-[#EDE5DD]/30 bg-[#FDFBF7] dark:bg-[#1E1B18] text-[#4A3E36] dark:text-[#EDE5DD] font-sans"
                    />
                    <div className="flex items-center justify-between pt-1">
                      {saveSuccess ? (
                        <span className="text-xs font-hand font-bold text-[#3B6B38] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Gespeichert!
                        </span>
                      ) : <span />}
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-gradient-to-r from-[#9123A6] to-[#D7195F] text-white rounded-none text-xs font-hand font-bold sketch-shadow-sm sketch-btn-press transition-all"
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
            <div className="text-xs font-hand font-bold uppercase tracking-wider text-[#7D6E63] dark:text-[#BA9F83] px-1 mb-2">
              {t.settings.appearance}
            </div>

            <div className="rounded-none bg-[#FAF5ED] dark:bg-[#1E1B18] border-1.5 border-[#7A6A5E]/30 dark:border-[#EDE5DD]/30 divide-y divide-[#7A6A5E]/15 dark:divide-[#EDE5DD]/15 overflow-hidden sketch-border-sm">
              
              {/* Theme Row */}
              <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-[#D9822B] stroke-[2.2] shrink-0" />
                  ) : (
                    <Sun className="w-4 h-4 text-[#C97A1E] stroke-[2.2] shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
                    {t.settings.theme}
                  </span>
                </div>

                <div className="inline-flex p-1 bg-[#EAE0D2] dark:bg-[#2D2420] border border-[#7A6A5E]/30 rounded-none sketch-shadow-sm">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-2.5 py-1 rounded-none border-0 text-xs font-hand transition-all flex items-center gap-1 ${
                      theme === 'light'
                        ? 'bg-[#FDFBF7] dark:bg-[#1E1B18] text-[#4A3E36] dark:text-[#EDE5DD] shadow-2xs font-bold'
                        : 'text-[#7D6E63] dark:text-[#BA9F83]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-[#C97A1E] stroke-[2.2]" />
                    <span>{t.settings.light}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-2.5 py-1 rounded-none border-0 text-xs font-hand transition-all flex items-center gap-1 ${
                      theme === 'dark'
                        ? 'bg-[#FDFBF7] dark:bg-[#1E1B18] text-[#4A3E36] dark:text-[#EDE5DD] shadow-2xs font-bold'
                        : 'text-[#7D6E63] dark:text-[#BA9F83]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-[#D9822B] stroke-[2.2]" />
                    <span>{t.settings.dark}</span>
                  </button>
                </div>
              </div>

              {/* Language Row */}
              <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#7D6E63] dark:text-[#BA9F83] stroke-[2.2] shrink-0" />
                  <span className="text-xs sm:text-sm font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
                    {t.settings.language}
                  </span>
                </div>

                <div className="inline-flex p-1 bg-[#EAE0D2] dark:bg-[#2D2420] border border-[#7A6A5E]/30 rounded-none sketch-shadow-sm">
                  <button
                    type="button"
                    onClick={() => setLanguage('de')}
                    className={`px-3 py-1 rounded-none border-0 text-xs font-hand transition-all ${
                      language === 'de'
                        ? 'bg-[#FDFBF7] dark:bg-[#1E1B18] text-[#4A3E36] dark:text-[#EDE5DD] shadow-2xs font-bold'
                        : 'text-[#7D6E63] dark:text-[#BA9F83]'
                    }`}
                  >
                    DE
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-none border-0 text-xs font-hand transition-all ${
                      language === 'en'
                        ? 'bg-[#FDFBF7] dark:bg-[#1E1B18] text-[#4A3E36] dark:text-[#EDE5DD] shadow-2xs font-bold'
                        : 'text-[#7D6E63] dark:text-[#BA9F83]'
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
            <div className="text-xs font-hand font-bold uppercase tracking-wider text-[#7D6E63] dark:text-[#BA9F83] px-1 mb-2 flex items-center justify-between">
              <span>{t.settings.notifications}</span>
              <span className="text-2xs font-normal normal-case text-[#7D6E63] dark:text-[#BA9F83] font-sans">
                So & Mo 17:00
              </span>
            </div>

            <div className="rounded-none bg-[#FAF5ED] dark:bg-[#1E1B18] border-1.5 border-[#7A6A5E]/30 dark:border-[#EDE5DD]/30 divide-y divide-[#7A6A5E]/15 dark:divide-[#EDE5DD]/15 overflow-hidden sketch-border-sm">
              {user ? (
                <>
                  {/* Push Notifications Row */}
                  <div className="p-3.5 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-[#7D6E63] dark:text-[#BA9F83] stroke-[2.2] shrink-0" />
                        <div>
                          <h6 className="text-xs sm:text-sm font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
                            {t.notifications.pushTitle}
                          </h6>
                          <p className="text-2xs text-[#7D6E63] dark:text-[#BA9F83] font-sans">
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
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-none border-2 border-[#7A6A5E] dark:border-[#EDE5DD]/50 transition-colors duration-200 ease-in-out focus:outline-none ${
                          notificationPrefs.pushEnabled ? 'bg-[#D7195F]' : 'bg-[#D9CEBF] dark:bg-[#4A3E36]'
                        } ${isRegisteringPush ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-none bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            notificationPrefs.pushEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* iOS Note */}
                    {isIos && !isStandalone && (
                      <div className="p-2.5 rounded-none bg-[#FFF9F2] dark:bg-[#2C231D] border border-[#D4A759] flex items-start gap-2 text-2xs text-[#A66814] dark:text-[#F3D190]">
                        <Info className="w-3.5 h-3.5 stroke-[2.2] shrink-0 mt-0.5" />
                        <span className="font-sans">{t.notifications.iosNotice}</span>
                      </div>
                    )}

                    {/* Push Status / Message */}
                    {pushStatusMessage && (
                      <div className="text-2xs text-[#7D6E63] dark:text-[#BA9F83] flex items-center gap-1.5 pt-1 font-sans">
                        <AlertCircle className="w-3.5 h-3.5 text-[#D7195F] shrink-0 stroke-[2.2]" />
                        <span>{pushStatusMessage}</span>
                      </div>
                    )}

                    {/* Unregistered Device Callout */}
                    {notificationPrefs.pushEnabled && !isDeviceRegistered && (
                      <div className="p-2.5 rounded-none bg-[#FDF0EE] dark:bg-[#361914] border border-[#DFA098] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-2xs text-[#4A3E36] dark:text-[#EDE5DD] font-sans">
                          {t.notifications.deviceNotRegistered}
                        </span>
                        <button
                          type="button"
                          onClick={handleRegisterCurrentDevice}
                          disabled={isRegisteringPush}
                          className="px-2.5 py-1 rounded-none bg-gradient-to-r from-[#9123A6] to-[#D7195F] text-white text-xs font-hand font-bold sketch-btn-press transition-all shadow-pencil-sm whitespace-nowrap"
                        >
                          {t.notifications.enableCurrentDevice}
                        </button>
                      </div>
                    )}

                    {/* Device Status & Test Push */}
                    {notificationPrefs.pushEnabled && (
                      <div className="pt-2 flex items-center justify-between border-t border-[#7A6A5E]/15 dark:border-[#EDE5DD]/15">
                        <span className="text-2xs text-[#3B6B38] dark:text-[#A6D6A2] font-semibold flex items-center gap-1 font-sans">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>{isDeviceRegistered ? t.notifications.deviceActive : t.notifications.statusEnabled}</span>
                          {deviceCount > 1 && (
                            <span className="text-[#7D6E63] dark:text-[#BA9F83] font-normal">
                              ({deviceCount} {t.notifications.devicesRegistered})
                            </span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={handleSendTestPush}
                          className="px-2.5 py-1 rounded-none border-0 text-2xs text-[#4A3E36] dark:text-[#EDE5DD] font-hand font-bold flex items-center gap-1 sketch-btn-press transition-all"
                        >
                          <Send className="w-3 h-3 stroke-[2.2]" />
                          <span>{testSent ? t.notifications.testPushSent : t.notifications.sendTestPush}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Email Notifications Row */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#7D6E63] dark:text-[#BA9F83] stroke-[2.2] shrink-0" />
                      <div>
                        <h6 className="text-xs sm:text-sm font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
                          {t.notifications.emailTitle}
                        </h6>
                        <p className="text-2xs text-[#7D6E63] dark:text-[#BA9F83] font-sans">
                          {user.email ? `${t.notifications.emailDesc} ${user.email}` : t.notifications.emailDesc}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={notificationPrefs.emailEnabled}
                      onClick={handleToggleEmail}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-none border-2 border-[#7A6A5E] dark:border-[#EDE5DD]/50 transition-colors duration-200 ease-in-out focus:outline-none ${
                        notificationPrefs.emailEnabled ? 'bg-[#D7195F]' : 'bg-[#D9CEBF] dark:bg-[#4A3E36]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-none bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          notificationPrefs.emailEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-3.5 sm:p-4 text-xs text-[#7D6E63] dark:text-[#BA9F83] flex items-center gap-2 font-hand">
                  <Bell className="w-4 h-4 stroke-[2.2] text-[#7D6E63] shrink-0" />
                  <span>{t.notifications.loginRequired}</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Data & Backup Section */}
          <div>
            <div className="text-xs font-hand font-bold uppercase tracking-wider text-[#7D6E63] dark:text-[#BA9F83] px-1 mb-2">
              {t.settings.data}
            </div>

            <div className="rounded-none bg-[#FAF5ED] dark:bg-[#1E1B18] border-1.5 border-[#7A6A5E]/30 dark:border-[#EDE5DD]/30 divide-y divide-[#7A6A5E]/15 dark:divide-[#EDE5DD]/15 overflow-hidden sketch-border-sm">
              
              {/* Export Row */}
              <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-[#7D6E63] dark:text-[#BA9F83] stroke-[2.2] shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
                      {t.actions.exportData}
                    </span>
                    <p className="text-2xs text-[#7D6E63] font-sans">
                      JSON-Backup Datei sichern
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleExport}
                  className="px-3.5 py-1.5 rounded-none border-0 text-xs font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD] sketch-btn-press transition-all shrink-0"
                >
                  Exportieren
                </button>
              </div>

              {/* Import Row */}
              <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-[#7D6E63] dark:text-[#BA9F83] stroke-[2.2] shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD]">
                      {t.actions.importData}
                    </span>
                    <p className="text-2xs text-[#7D6E63] font-sans">
                      Pläne aus JSON wiederherstellen
                    </p>
                  </div>
                </div>

                <label className="px-3.5 py-1.5 rounded-none border-0 text-xs font-hand font-bold text-[#4A3E36] dark:text-[#EDE5DD] cursor-pointer sketch-btn-press transition-all shrink-0">
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
                <div className="p-2.5 text-center text-xs text-[#3B6B38] font-hand font-bold bg-[#EEF5ED] dark:bg-[#203322]">
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
