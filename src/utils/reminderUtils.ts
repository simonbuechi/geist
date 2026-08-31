import { getWeekId, getPreviousWeekId } from './dateUtils';
import type { WeekPlan } from '../types';

/**
 * Determines which week is being targeted for a reminder:
 * - On Sunday: The current week ending today.
 * - On Monday: The week that just ended yesterday (previous week).
 */
export function getReminderTargetWeek(date: Date = new Date(), dayType?: 'sunday' | 'monday'): string {
  const currentWeek = getWeekId(date);
  const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday

  if (dayType === 'monday' || (dayType === undefined && dayOfWeek === 1)) {
    return getPreviousWeekId(currentWeek);
  }

  return currentWeek;
}

/**
 * Checks whether a Monday reminder should be sent:
 * Only send if the week plan does not exist OR has not been reviewed yet (reviewedAt is missing).
 */
export function shouldSendMondayReminder(weekPlan?: Partial<WeekPlan> | null): boolean {
  if (!weekPlan) return true;
  return typeof weekPlan.reviewedAt !== 'number';
}
