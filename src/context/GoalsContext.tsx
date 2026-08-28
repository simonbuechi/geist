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

const LOCAL_STORAGE_KEY_PLANS = 'kgs_week_plans';

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
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PLANS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load local week plans', e);
    }
    
    // First time setup with starter sample goals for current week
    const initialPlan = createDefaultWeekPlan(realCurrentWeekId);
    initialPlan.goals = INITIAL_STARTER_GOALS;
    return { [realCurrentWeekId]: initialPlan };
  });
  
  const [loading, setLoading] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PLANS, JSON.stringify(weekPlans));
    } catch (e) {
      console.error('Failed to save week plans to localStorage', e);
    }
  }, [weekPlans]);

  // Sync with Firestore when user signs in
  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    async function loadCloudData() {
      setLoading(true);
      try {
        const cloudPlans = await fetchUserWeekPlansFromFirestore(user!.uid);
        if (!isMounted) return;

        setWeekPlans(prev => {
          // Merge cloud & local (cloud wins if newer)
          const merged = { ...prev };
          Object.entries(cloudPlans).forEach(([id, plan]) => {
            if (!merged[id] || (plan.updatedAt || 0) >= (merged[id].updatedAt || 0)) {
              merged[id] = plan;
            }
          });
          return merged;
        });
      } catch (e) {
        console.error('Failed to load cloud plans', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCloudData();
    return () => { isMounted = false; };
  }, [user?.uid]);

  // Persist a modified week plan locally and to Firestore
  const persistPlan = useCallback(async (updatedPlan: WeekPlan) => {
    setWeekPlans(prev => ({
      ...prev,
      [updatedPlan.id]: updatedPlan
    }));

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
