import { 
  getMessaging, 
  getToken, 
  onMessage, 
  isSupported as isFcmSupported,
  type Messaging,
  type MessagePayload
} from 'firebase/messaging';
import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  collection,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { app, db, getDefaultFirebaseConfig } from './firebase';
import type { NotificationPreferences, UserFcmToken } from '../types';

let messagingInstance: Messaging | null = null;

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  pushEnabled: false,
  emailEnabled: false,
  reminderTimeSunday: '17:00',
  reminderTimeMonday: '17:00'
};

/**
 * Checks whether the current browser supports Web Push & Service Workers
 */
export function isPushNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'Notification' in window &&
    'PushManager' in window
  );
}

/**
 * Detects if user is running on iOS (iPhone/iPad)
 */
export function isIosDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/**
 * Checks if the PWA is currently running in standalone mode (e.g. Added to Home Screen)
 */
export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Boolean((navigator as any).standalone)
  );
}

/**
 * Initialize Firebase Messaging client instance safely
 */
export async function getMessagingClient(): Promise<Messaging | null> {
  if (messagingInstance) return messagingInstance;
  if (!app) return null;

  try {
    const supported = await isFcmSupported();
    if (!supported) return null;
    messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch (err) {
    console.warn('Firebase Messaging is not supported in this environment:', err);
    return null;
  }
}

/**
 * Request notification permission and obtain an FCM Registration Token
 */
export async function registerPushNotification(
  userId: string,
  vapidKey?: string
): Promise<{ token: string | null; error?: string }> {
  if (!isPushNotificationSupported()) {
    return { token: null, error: 'Push notifications are not supported by this browser.' };
  }

  if (isIosDevice() && !isStandalonePwa()) {
    return {
      token: null,
      error: 'Auf dem iPhone/iPad musst du diese App zuerst zum Home-Bildschirm hinzufügen ("Teilen" -> "Zum Home-Bildschirm").'
    };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { token: null, error: 'Notification permission was denied.' };
    }

    const messaging = await getMessagingClient();
    if (!messaging) {
      return { token: null, error: 'FCM is not initialized.' };
    }

    const cfg = getDefaultFirebaseConfig();
    const swUrl = `/firebase-messaging-sw.js?apiKey=${encodeURIComponent(cfg.apiKey || '')}&projectId=${encodeURIComponent(cfg.projectId || '')}&messagingSenderId=${encodeURIComponent(cfg.messagingSenderId || '')}&appId=${encodeURIComponent(cfg.appId || '')}`;

    const registration = await navigator.serviceWorker.register(swUrl);
    await navigator.serviceWorker.ready;

    const currentToken = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey: vapidKey || (import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined) || undefined
    });

    if (currentToken) {
      await saveFcmTokenToFirestore(userId, currentToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('kgs_fcm_token', currentToken);
      }
      return { token: currentToken };
    }

    return { token: null, error: 'No registration token available.' };
  } catch (err) {
    console.error('Error during push registration:', err);
    return { token: null, error: (err as Error).message || 'Failed to register push token' };
  }
}

/**
 * Checks if the current device/browser has granted permission and has an active registered token
 */
export function isCurrentDeviceRegistered(): boolean {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;
  return Boolean(localStorage.getItem('kgs_fcm_token'));
}

/**
 * Returns the count of registered device tokens for a given user
 */
export async function getRegisteredDevicesCount(userId: string): Promise<number> {
  if (!db || !userId) return 0;
  try {
    const coll = collection(db, 'users', userId, 'fcmTokens');
    const snap = await getDocs(coll);
    return snap.size;
  } catch (err) {
    console.warn('Error fetching registered devices count:', err);
    return 0;
  }
}

/**
 * Store FCM Token in Firestore under users/{userId}/fcmTokens/{token}
 */
export async function saveFcmTokenToFirestore(userId: string, token: string): Promise<void> {
  if (!db || !userId || !token) return;
  try {
    const tokenRef = doc(db, 'users', userId, 'fcmTokens', token);
    const tokenData: UserFcmToken = {
      token,
      createdAt: Date.now(),
      lastUsedAt: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };
    await setDoc(tokenRef, tokenData, { merge: true });
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.error('Error saving FCM token to Firestore:', err);
    throw err;
  }
}

/**
 * Remove FCM Token from Firestore
 */
export async function removeFcmTokenFromFirestore(userId: string, token: string): Promise<void> {
  if (!db || !userId || !token) return;
  try {
    const tokenRef = doc(db, 'users', userId, 'fcmTokens', token);
    await deleteDoc(tokenRef);
    if (typeof window !== 'undefined' && localStorage.getItem('kgs_fcm_token') === token) {
      localStorage.removeItem('kgs_fcm_token');
    }
  } catch (err) {
    console.error('Error removing FCM token from Firestore:', err);
  }
}

/**
 * Save user's notification preferences to Firestore: users/{userId}/settings/notifications
 */
export async function saveNotificationPreferences(
  userId: string,
  preferences: NotificationPreferences
): Promise<void> {
  if (!db || !userId) return;
  try {
    const prefRef = doc(db, 'users', userId, 'settings', 'notifications');
    await setDoc(prefRef, {
      ...preferences,
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Touch the parent user document so it is discovered by collection queries
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      updatedAt: serverTimestamp(),
      ...(preferences.emailAddress ? { email: preferences.emailAddress } : {})
    }, { merge: true });
  } catch (err) {
    console.error('Error saving notification preferences:', err);
    throw err;
  }
}

/**
 * Fetch user's notification preferences from Firestore
 */
export async function fetchNotificationPreferences(userId: string): Promise<NotificationPreferences> {
  if (!db || !userId) return DEFAULT_NOTIFICATION_PREFERENCES;
  try {
    const prefRef = doc(db, 'users', userId, 'settings', 'notifications');
    const snap = await getDoc(prefRef);
    if (snap.exists()) {
      return {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        ...(snap.data() as NotificationPreferences)
      };
    }
  } catch (err) {
    console.error('Error fetching notification preferences:', err);
  }
  return DEFAULT_NOTIFICATION_PREFERENCES;
}

/**
 * Setup listener for notifications when the app is actively in the foreground
 */
export function setupForegroundNotificationListener(
  callback: (payload: MessagePayload) => void
): () => void {
  let unsubscribe: (() => void) | null = null;

  getMessagingClient().then((messaging) => {
    if (messaging) {
      unsubscribe = onMessage(messaging, (payload) => {
        callback(payload);
      });
    }
  });

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}

/**
 * Display a client-side test notification
 */
export function showLocalTestNotification(title: string, body: string): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/favicon-32x32.png',
      tag: 'kgs-test-reminder'
    });
    return true;
  } catch (e) {
    console.warn('Could not display test notification:', e);
    return false;
  }
}
