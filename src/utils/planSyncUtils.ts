import type { Goal, WeekPlan } from '../types';

export const GUEST_STORAGE_KEY = 'kgs_week_plans_guest';
export const LEGACY_STORAGE_KEY = 'kgs_week_plans';

/**
 * Returns the namespaced storage key for the current user or guest.
 */
export function getStorageKey(userId?: string | null): string {
  if (!userId) {
    return GUEST_STORAGE_KEY;
  }
  return `kgs_week_plans_${userId}`;
}

/**
 * Checks if a goal is an unmodified initial starter template goal.
 */
export function isSampleGoal(goal: Goal): boolean {
  return typeof goal.id === 'string' && goal.id.startsWith('sample-');
}

/**
 * Checks if a week plan contains any real, user-created or modified goals
 * (excluding default unmodified starter goals).
 */
export function hasRealUserGoals(plan: WeekPlan): boolean {
  if (!plan || !plan.goals) return false;
  return plan.goals.some(g => !isSampleGoal(g));
}

/**
 * Merges two lists of goals:
 * 1. Drops starter template goals if any real goals or cloud goals exist.
 * 2. Deduplicates goals by ID (or normalized description).
 * 3. Keeps the most recently updated goal if there is a conflict.
 */
export function mergeGoals(guestGoals: Goal[] = [], cloudGoals: Goal[] = []): Goal[] {
  const goalMap = new Map<string, Goal>();

  // 1. Add cloud goals first
  for (const cloudGoal of cloudGoals) {
    goalMap.set(cloudGoal.id, cloudGoal);
  }

  // 2. Determine if we should drop sample goals from guest
  const hasCloudGoals = cloudGoals.length > 0;
  const filteredGuestGoals = guestGoals.filter(g => {
    if (isSampleGoal(g)) {
      // If cloud already has goals, skip starter template goals completely
      if (hasCloudGoals) return false;
      // If guest only has sample goals without any modification, keep only if no other goals exist
      return true;
    }
    return true;
  });

  // If there are real guest goals or cloud goals, remove any residual starter goals
  const hasRealGoals = filteredGuestGoals.some(g => !isSampleGoal(g)) || hasCloudGoals;

  for (const guestGoal of filteredGuestGoals) {
    if (hasRealGoals && isSampleGoal(guestGoal)) {
      continue;
    }

    const existingById = goalMap.get(guestGoal.id);
    if (existingById) {
      // Conflict by ID: pick whichever was updated or created later
      const guestTime = guestGoal.updatedAt || guestGoal.createdAt || 0;
      const existingTime = existingById.updatedAt || existingById.createdAt || 0;
      if (guestTime >= existingTime) {
        goalMap.set(guestGoal.id, guestGoal);
      }
      continue;
    }

    // Check if matching by description exists (e.g. duplicate goal added in both places)
    const existingDescEntry = Array.from(goalMap.entries()).find(
      ([, g]) => g.description.trim().toLowerCase() === guestGoal.description.trim().toLowerCase() && g.category === guestGoal.category
    );

    if (existingDescEntry) {
      const [existingKey, existingGoal] = existingDescEntry;
      const guestTime = guestGoal.updatedAt || guestGoal.createdAt || 0;
      const existingTime = existingGoal.updatedAt || existingGoal.createdAt || 0;
      if (guestTime > existingTime) {
        goalMap.delete(existingKey);
        goalMap.set(guestGoal.id, guestGoal);
      }
    } else {
      goalMap.set(guestGoal.id, guestGoal);
    }
  }

  return Array.from(goalMap.values());
}

/**
 * Merges a guest week plan and cloud week plan for the same week.
 */
export function mergeWeekPlans(
  guestPlan?: WeekPlan,
  cloudPlan?: WeekPlan,
  weekId?: string
): WeekPlan {
  const id = weekId || cloudPlan?.id || guestPlan?.id || '';

  if (!guestPlan && cloudPlan) {
    return cloudPlan;
  }
  if (guestPlan && !cloudPlan) {
    return guestPlan;
  }
  if (!guestPlan && !cloudPlan) {
    throw new Error('Both guestPlan and cloudPlan are undefined');
  }

  const gPlan = guestPlan!;
  const cPlan = cloudPlan!;

  const mergedGoals = mergeGoals(gPlan.goals || [], cPlan.goals || []);

  const latestUpdatedAt = Math.max(
    gPlan.updatedAt || 0,
    cPlan.updatedAt || 0,
    Date.now()
  );

  const reviewedAt = cPlan.reviewedAt || gPlan.reviewedAt;
  const generalReflection = cPlan.generalReflection || gPlan.generalReflection;

  return {
    id,
    year: cPlan.year || gPlan.year,
    weekNumber: cPlan.weekNumber || gPlan.weekNumber,
    startDate: cPlan.startDate || gPlan.startDate,
    endDate: cPlan.endDate || gPlan.endDate,
    goals: mergedGoals,
    reviewedAt,
    generalReflection,
    updatedAt: latestUpdatedAt
  };
}

export interface MergeResult {
  mergedPlans: Record<string, WeekPlan>;
  plansToUpload: WeekPlan[];
}

/**
 * Deep merges all guest plans with all cloud plans on login.
 * Identifies which week plans contain new/modified local data that must be uploaded to Firestore.
 */
export function mergeAllWeekPlans(
  guestPlans: Record<string, WeekPlan> = {},
  cloudPlans: Record<string, WeekPlan> = {}
): MergeResult {
  const mergedPlans: Record<string, WeekPlan> = {};
  const plansToUpload: WeekPlan[] = [];

  const allWeekIds = new Set([
    ...Object.keys(guestPlans),
    ...Object.keys(cloudPlans)
  ]);

  for (const weekId of allWeekIds) {
    const gPlan = guestPlans[weekId];
    const cPlan = cloudPlans[weekId];

    if (gPlan && !cPlan) {
      // Exists only in guest storage
      // Only upload if it contains actual user goals (not just untouched sample goals)
      const cleanedGoals = gPlan.goals?.filter(g => !isSampleGoal(g)) || [];
      if (cleanedGoals.length > 0 || gPlan.reviewedAt || gPlan.generalReflection) {
        const planWithCleanGoals = {
          ...gPlan,
          goals: cleanedGoals,
          updatedAt: Date.now()
        };
        mergedPlans[weekId] = planWithCleanGoals;
        plansToUpload.push(planWithCleanGoals);
      } else {
        // Untouched sample plan with no real goals, preserve locally if needed or keep default
        mergedPlans[weekId] = gPlan;
      }
    } else if (!gPlan && cPlan) {
      // Exists only in cloud
      mergedPlans[weekId] = cPlan;
    } else if (gPlan && cPlan) {
      // Exists in both: merge goals
      const merged = mergeWeekPlans(gPlan, cPlan, weekId);
      mergedPlans[weekId] = merged;

      // Determine if local had new data that cloud didn't have
      const hadLocalRealGoals = (gPlan.goals || []).some(
        g => !isSampleGoal(g) && !cPlan.goals?.some(cg => cg.id === g.id)
      );
      const hadLocalNewerReview = (gPlan.reviewedAt || 0) > (cPlan.reviewedAt || 0);

      if (hadLocalRealGoals || hadLocalNewerReview) {
        plansToUpload.push(merged);
      }
    }
  }

  return { mergedPlans, plansToUpload };
}
