import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Category, Goal, GoalStatus, WeekPlan } from '../types';
import { 
  getWeekId, 
  parseWeekId, 
  getNextWeekId 
} from '../utils/dateUtils';
import { useAuth } from './AuthContext';
import { 
  syncWeekPlanToFirestore, 
  fetchUserWeekPlansFromFirestore 
} from '../config/firebase';
import {
  getStorageKey,
  GUEST_STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  mergeAllWeekPlans
} from '../utils/planSyncUtils';

interface GoalsContextType {
  currentWeekId: string; // The currently selected/viewed week ID (e.g. 2026-W35)
  realCurrentWeekId: string; // The actual calendar current week ID
  currentWeekPlan: WeekPlan;
  allWeekPlans: Record<string, WeekPlan>;
  loading: boolean;
  
  // Navigation
  selectWeek: (weekId: string) => void;
  goToCurrentWeek: () => void;
  
  // Goal CRUD
  addGoal: (category: Category, description: string) => void;
  updateGoal: (goalId: string, description: string) => void;
  deleteGoal: (goalId: string) => void;
  setGoalStatus: (goalId: string, status: GoalStatus) => void;
  setGoalComment: (goalId: string, comment: string) => void;
  
  // Review & Next Week Planning
  submitWeeklyReview: (
    weekId: string,
    goalEvaluations: { goalId: string; status: GoalStatus; comment?: string }[],
    carryOverGoalIds: string[],
    generalReflection?: string
  ) => void;
  
  // Data Import / Export
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
}

function loadPlansFromStorage(userId?: string | null): Record<string, WeekPlan> | null {
  try {
    const key = getStorageKey(userId);
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    // Backward-compatibility: if reading guest and legacy key exists, load legacy key
    if (!userId) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        return JSON.parse(legacy);
      }
    }
  } catch (e) {
    console.error('Failed to load week plans from storage', e);
  }
  return null;
}

function createDefaultWeekPlan(weekId: string): WeekPlan {
  const { year, weekNumber, startDate, endDate } = parseWeekId(weekId);
  return {
    id: weekId,
    year,
    weekNumber,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    goals: [],
    updatedAt: Date.now()
  };
}

const INITIAL_STARTER_GOALS: Goal[] = [
  {
    id: 'sample-body-1',
    category: 'body',
    description: '3x 30 Minuten Bewegung an der frischen Luft',
    status: 'pending',
    createdAt: Date.now() - 3600000
  },
  {
    id: 'sample-body-2',
    category: 'body',
    description: 'Täglich 2 Liter Wasser trinken & vor 23 Uhr schlafen',
    status: 'pending',
    createdAt: Date.now() - 3500000
  },
  {
    id: 'sample-mind-1',
    category: 'mind',
    description: '30 Minuten täglich in einem inspirierenden Buch lesen',
    status: 'pending',
    createdAt: Date.now() - 3400000
  },
  {
    id: 'sample-soul-1',
    category: 'soul',
    description: 'Jeden Morgen 5 Minuten bewusste Stille & Dankbarkeit',
    status: 'pending',
    createdAt: Date.now() - 3300000
  }
];

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const realCurrentWeekId = getWeekId(new Date());
  const [selectedWeekId, setSelectedWeekId] = useState<string>(realCurrentWeekId);
  const [weekPlans, setWeekPlans] = useState<Record<string, WeekPlan>>(() => {
    const saved = loadPlansFromStorage(user?.uid);
    if (saved && Object.keys(saved).length > 0) {
      return saved;
    }
    
    // First time setup with starter sample goals for current week
    const initialPlan = createDefaultWeekPlan(realCurrentWeekId);
    initialPlan.goals = INITIAL_STARTER_GOALS;
    return { [realCurrentWeekId]: initialPlan };
  });
  
  const [loading, setLoading] = useState(false);
  const prevUserUidRef = React.useRef<string | null | undefined>(user?.uid);

  // Sync state to namespaced LocalStorage
  useEffect(() => {
    try {
      const key = getStorageKey(user?.uid);
      localStorage.setItem(key, JSON.stringify(weekPlans));
    } catch (e) {
      console.error('Failed to save week plans to localStorage', e);
    }
  }, [weekPlans, user?.uid]);

  // Handle User Login / Logout / Sync with Firestore
  useEffect(() => {
    const prevUid = prevUserUidRef.current;
    const currentUid = user?.uid;
    prevUserUidRef.current = currentUid;

    // 1. User logged out
    if (!currentUid) {
      if (prevUid) {
        // Switched from authenticated to guest -> reset to clean guest data
        const guestData = loadPlansFromStorage(null);
        if (guestData && Object.keys(guestData).length > 0) {
          setWeekPlans(guestData);
        } else {
          const initialPlan = createDefaultWeekPlan(realCurrentWeekId);
          initialPlan.goals = INITIAL_STARTER_GOALS;
          setWeekPlans({ [realCurrentWeekId]: initialPlan });
        }
      }
      return;
    }

    // 2. User logged in (currentUid is present)
    const uid = currentUid;
    let isMounted = true;

    async function handleLoginSync() {
      setLoading(true);
      try {
        // A. Read guest storage (offline data created before login)
        const guestPlans = loadPlansFromStorage(null) || {};
        // Also read any cached plans for this user from before
        const userCachedPlans = loadPlansFromStorage(uid) || {};
        const localCombined = { ...userCachedPlans, ...guestPlans };

        // B. Fetch user cloud plans from Firestore
        const cloudPlans = await fetchUserWeekPlansFromFirestore(uid);
        if (!isMounted) return;

        // C. Deep merge offline/guest/cached plans with cloud plans
        const { mergedPlans, plansToUpload } = mergeAllWeekPlans(localCombined, cloudPlans);

        // If completely empty, initialize current week
        if (Object.keys(mergedPlans).length === 0) {
          const initialPlan = createDefaultWeekPlan(realCurrentWeekId);
          initialPlan.goals = INITIAL_STARTER_GOALS;
          mergedPlans[realCurrentWeekId] = initialPlan;
        }

        // D. Save merged plans to user's namespaced storage immediately
        try {
          const userKey = getStorageKey(uid);
          localStorage.setItem(userKey, JSON.stringify(mergedPlans));
        } catch (e) {
          console.error('Failed to save merged plans to user storage', e);
        }

        // E. Push newly created offline/guest plans to Firestore
        if (plansToUpload.length > 0) {
          await Promise.all(
            plansToUpload.map(plan => 
              syncWeekPlanToFirestore(uid, plan).catch(err =>
                console.warn(`Could not sync week ${plan.id} to Firestore:`, err)
              )
            )
          );
        }

        // F. Clear guest storage and legacy storage so guest state is clean on subsequent logout
        try {
          localStorage.removeItem(GUEST_STORAGE_KEY);
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch (e) {
          console.warn('Could not remove guest storage keys:', e);
        }

        if (isMounted) {
          setWeekPlans(mergedPlans);
        }
      } catch (e) {
        console.error('Failed to handle cloud sync on login', e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    handleLoginSync();

    return () => {
      isMounted = false;
    };
  }, [user?.uid, realCurrentWeekId]);

  // Persist a modified week plan locally and to Firestore
  const persistPlan = useCallback(async (updatedPlan: WeekPlan) => {
    setWeekPlans(prev => {
      const next = {
        ...prev,
        [updatedPlan.id]: updatedPlan
      };
      try {
        const storageKey = getStorageKey(user?.uid);
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save plan to localStorage:', e);
      }
      return next;
    });

    if (user?.uid) {
      try {
        await syncWeekPlanToFirestore(user.uid, updatedPlan);
      } catch (err) {
        console.warn('Could not sync to cloud immediately (offline/error):', err);
      }
    }
  }, [user?.uid]);

  // Ensure current week plan exists
  const currentWeekPlan: WeekPlan = weekPlans[selectedWeekId] || createDefaultWeekPlan(selectedWeekId);

  const selectWeek = (weekId: string) => {
    setSelectedWeekId(weekId);
    if (!weekPlans[weekId]) {
      const newPlan = createDefaultWeekPlan(weekId);
      persistPlan(newPlan);
    }
  };

  const goToCurrentWeek = () => {
    selectWeek(realCurrentWeekId);
  };

  const addGoal = (category: Category, description: string) => {
    const trimmed = description.trim();
    if (!trimmed) return;

    const newGoal: Goal = {
      id: 'goal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      category,
      description: trimmed,
      status: 'pending',
      createdAt: Date.now()
    };

    const plan = weekPlans[selectedWeekId] || createDefaultWeekPlan(selectedWeekId);
    const updatedPlan: WeekPlan = {
      ...plan,
      goals: [...plan.goals, newGoal],
      updatedAt: Date.now()
    };

    persistPlan(updatedPlan);
  };

  const updateGoal = (goalId: string, description: string) => {
    const trimmed = description.trim();
    if (!trimmed) return;

    const plan = weekPlans[selectedWeekId] || createDefaultWeekPlan(selectedWeekId);
    const updatedGoals = plan.goals.map(g => 
      g.id === goalId ? { ...g, description: trimmed, updatedAt: Date.now() } : g
    );

    const updatedPlan: WeekPlan = {
      ...plan,
      goals: updatedGoals,
      updatedAt: Date.now()
    };

    persistPlan(updatedPlan);
  };

  const deleteGoal = (goalId: string) => {
    const plan = weekPlans[selectedWeekId] || createDefaultWeekPlan(selectedWeekId);
    const updatedGoals = plan.goals.filter(g => g.id !== goalId);

    const updatedPlan: WeekPlan = {
      ...plan,
      goals: updatedGoals,
      updatedAt: Date.now()
    };

    persistPlan(updatedPlan);
  };

  const setGoalStatus = (goalId: string, status: GoalStatus) => {
    const plan = weekPlans[selectedWeekId] || createDefaultWeekPlan(selectedWeekId);
    const updatedGoals = plan.goals.map(g => 
      g.id === goalId ? { ...g, status, updatedAt: Date.now() } : g
    );

    const updatedPlan: WeekPlan = {
      ...plan,
      goals: updatedGoals,
      updatedAt: Date.now()
    };

    persistPlan(updatedPlan);
  };

  const setGoalComment = (goalId: string, comment: string) => {
    const plan = weekPlans[selectedWeekId] || createDefaultWeekPlan(selectedWeekId);
    const updatedGoals = plan.goals.map(g => 
      g.id === goalId ? { ...g, comment, updatedAt: Date.now() } : g
    );

    const updatedPlan: WeekPlan = {
      ...plan,
      goals: updatedGoals,
      updatedAt: Date.now()
    };

    persistPlan(updatedPlan);
  };

  const submitWeeklyReview = (
    weekId: string,
    goalEvaluations: { goalId: string; status: GoalStatus; comment?: string }[],
    carryOverGoalIds: string[],
    generalReflection?: string
  ) => {
    const currentPlan = weekPlans[weekId] || createDefaultWeekPlan(weekId);
    
    // 1. Update goals with review evaluation
    const updatedGoals = currentPlan.goals.map(goal => {
      const evalMatch = goalEvaluations.find(e => e.goalId === goal.id);
      if (evalMatch) {
        return {
          ...goal,
          status: evalMatch.status,
          comment: evalMatch.comment || goal.comment,
          updatedAt: Date.now()
        };
      }
      return goal;
    });

    const reviewedPlan: WeekPlan = {
      ...currentPlan,
      goals: updatedGoals,
      reviewedAt: Date.now(),
      generalReflection: generalReflection?.trim() || currentPlan.generalReflection,
      updatedAt: Date.now()
    };

    persistPlan(reviewedPlan);

    // 2. Prepare next week plan and carry over chosen goals
    if (carryOverGoalIds.length > 0) {
      const nextWeekId = getNextWeekId(weekId);
      const nextPlan = weekPlans[nextWeekId] || createDefaultWeekPlan(nextWeekId);

      const goalsToCarryOver = currentPlan.goals
        .filter(g => carryOverGoalIds.includes(g.id))
        .map(g => ({
          id: 'goal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          category: g.category,
          description: g.description,
          status: 'pending' as GoalStatus,
          createdAt: Date.now()
        }));

      // Avoid duplicates if already present in next week
      const existingDescriptions = new Set(nextPlan.goals.map(g => g.description.toLowerCase().trim()));
      const uniqueNewGoals = goalsToCarryOver.filter(g => !existingDescriptions.has(g.description.toLowerCase().trim()));

      const updatedNextPlan: WeekPlan = {
        ...nextPlan,
        goals: [...nextPlan.goals, ...uniqueNewGoals],
        updatedAt: Date.now()
      };

      persistPlan(updatedNextPlan);
    }
  };

  const exportData = (): string => {
    return JSON.stringify(weekPlans, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === 'object' && parsed !== null) {
        setWeekPlans(parsed);
        if (user?.uid) {
          Object.values(parsed as Record<string, WeekPlan>).forEach(plan => {
            syncWeekPlanToFirestore(user.uid, plan);
          });
        }
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  };

  return (
    <GoalsContext.Provider
      value={{
        currentWeekId: selectedWeekId,
        realCurrentWeekId,
        currentWeekPlan,
        allWeekPlans: weekPlans,
        loading,
        selectWeek,
        goToCurrentWeek,
        addGoal,
        updateGoal,
        deleteGoal,
        setGoalStatus,
        setGoalComment,
        submitWeeklyReview,
        exportData,
        importData
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) throw new Error('useGoals must be used within GoalsProvider');
  return context;
};
