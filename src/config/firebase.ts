import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged, 
  type Auth 
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  doc, 
  setDoc, 
  collection, 
  getDocs, 
  type Firestore 
} from 'firebase/firestore';
import type { WeekPlan } from '../types';

export interface FirebaseCustomConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const LOCAL_STORAGE_KEY_FIREBASE = 'kgs_firebase_config';

export function getStoredFirebaseConfig(): FirebaseCustomConfig | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_FIREBASE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom firebase config', e);
  }
  return null;
}

export function saveStoredFirebaseConfig(config: FirebaseCustomConfig) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_FIREBASE, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save firebase config', e);
  }
}

export function getDefaultFirebaseConfig(): FirebaseCustomConfig {
  const custom = getStoredFirebaseConfig();
  if (custom && custom.apiKey && custom.projectId) {
    return custom;
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export function isFirebaseConfigured(): boolean {
  const cfg = getDefaultFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.projectId);
}

export function initFirebase() {
  const config = getDefaultFirebaseConfig();
  if (!config.apiKey || !config.projectId) {
    return { app: null, auth: null, db: null, googleProvider: null };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    try {
      db = initializeFirestore(app, {
        ignoreUndefinedProperties: true
      });
    } catch {
      db = getFirestore(app);
    }
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }

  return { app, auth, db, googleProvider };
}

// Initial attempt
initFirebase();

export { app, auth, db, googleProvider, signInWithPopup, fbSignOut, onAuthStateChanged };

// Firestore Database Helpers
export async function syncWeekPlanToFirestore(userId: string, weekPlan: WeekPlan): Promise<void> {
  if (!db || !userId) return;
  try {
    const planRef = doc(db, 'users', userId, 'weekPlans', weekPlan.id);
    // Sanitize any undefined properties to guarantee reliable Firestore synchronization
    const cleanedPlan = JSON.parse(JSON.stringify({
      ...weekPlan,
      updatedAt: Date.now()
    }));
    await setDoc(planRef, cleanedPlan, { merge: true });
  } catch (err) {
    console.error('Error syncing week plan to Firestore:', err);
    throw err;
  }
}

export async function fetchUserWeekPlansFromFirestore(userId: string): Promise<Record<string, WeekPlan>> {
  if (!db || !userId) return {};
  try {
    const colRef = collection(db, 'users', userId, 'weekPlans');
    const snapshot = await getDocs(colRef);
    const plans: Record<string, WeekPlan> = {};
    snapshot.forEach((docSnap) => {
      plans[docSnap.id] = docSnap.data() as WeekPlan;
    });
    return plans;
  } catch (err) {
    console.error('Error fetching week plans from Firestore:', err);
    return {};
  }
}
