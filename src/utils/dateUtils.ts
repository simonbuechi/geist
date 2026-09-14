import { 
  startOfISOWeek, 
  endOfISOWeek, 
  getISOWeek, 
  getISOWeekYear, 
  format, 
  addWeeks, 
  subWeeks, 
  parseISO, 
  isBefore,
  parse
} from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import type { Language, WeekPlan } from '../types';

export function getMondayOfWeek(date: Date = new Date()): Date {
  return startOfISOWeek(date);
}

export function getSundayOfWeek(date: Date = new Date()): Date {
  return endOfISOWeek(date);
}

export function getWeekId(date: Date = new Date()): string {
  const year = getISOWeekYear(date);
  const weekNumber = getISOWeek(date);
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

export function parseWeekId(weekId: string): { year: number; weekNumber: number; startDate: Date; endDate: Date } {
  const parts = weekId.split('-W');
  const year = parseInt(parts[0], 10);
  const weekNumber = parseInt(parts[1], 10);

  // Derive Monday of this ISO week
  const simpleDate = parse(`${year}-W${weekNumber}-1`, "RRRR-'W'II-i", new Date());
  const monday = startOfISOWeek(simpleDate);
  const sunday = endOfISOWeek(simpleDate);

  return {
    year,
    weekNumber,
    startDate: monday,
    endDate: sunday
  };
}

export function formatWeekRange(startDate: Date | string, endDate: Date | string, lang: Language = 'de'): string {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const locale = lang === 'de' ? de : enUS;

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'd.', { locale })} – ${format(end, 'd. MMMM yyyy', { locale })}`;
    }
    return `${format(start, 'd. MMM', { locale })} – ${format(end, 'd. MMM yyyy', { locale })}`;
  }
  return `${format(start, 'd. MMM yyyy', { locale })} – ${format(end, 'd. MMM yyyy', { locale })}`;
}

export function getPreviousWeekId(weekId: string): string {
  const { startDate } = parseWeekId(weekId);
  return getWeekId(subWeeks(startDate, 1));
}

export function getNextWeekId(weekId: string): string {
  const { startDate } = parseWeekId(weekId);
  return getWeekId(addWeeks(startDate, 1));
}

export function isCurrentWeekId(weekId: string): boolean {
  return weekId === getWeekId(new Date());
}

export function isPastWeekId(weekId: string): boolean {
  const { endDate } = parseWeekId(weekId);
  const currentSunday = endOfISOWeek(new Date());
  return isBefore(endDate, currentSunday);
}

/**
 * Finds the latest unreviewed past week prior to `referenceWeekId` (defaults to current real week).
 * A past week is considered "unreviewed" and unfinished if:
 * 1. It is strictly before `referenceWeekId` (e.g. weekId < referenceWeekId).
 * 2. It contains goals (`plan.goals.length > 0`).
 * 3. It has not been reviewed yet (`!plan.reviewedAt`).
 * Returns the weekId of that unfinished past week, or null if all past weeks are reviewed.
 */
export function findUnreviewedPastWeek(
  weekPlans: Record<string, WeekPlan>,
  referenceWeekId: string = getWeekId(new Date())
): string | null {
  if (!weekPlans) return null;

  const unreviewedPastWeekIds = Object.keys(weekPlans)
    .filter(weekId => weekId < referenceWeekId)
    .filter(weekId => {
      const plan = weekPlans[weekId];
      return Boolean(plan && plan.goals && plan.goals.length > 0 && !plan.reviewedAt);
    })
    .sort();

  if (unreviewedPastWeekIds.length === 0) {
    return null;
  }

  return unreviewedPastWeekIds[unreviewedPastWeekIds.length - 1];
}

/**
 * Checks if a target week is accessible.
 * If a prior week has not been reviewed, the new week cannot be viewed/planned
 * until that previous week has been reviewed.
 */
export function isWeekAccessible(
  targetWeekId: string,
  weekPlans: Record<string, WeekPlan>,
  realCurrentWeekId: string = getWeekId(new Date())
): boolean {
  // 1. If there is an unreviewed past week prior to realCurrentWeekId, cannot access any week newer than it
  const unreviewedPast = findUnreviewedPastWeek(weekPlans, realCurrentWeekId);
  if (unreviewedPast && targetWeekId > unreviewedPast) {
    return false;
  }

  // 2. If target is in the future relative to realCurrentWeekId or subsequent to another planned week,
  // the immediately preceding week must have been reviewed
  const prevOfTarget = getPreviousWeekId(targetWeekId);
  const prevPlan = weekPlans[prevOfTarget];
  if (prevPlan && prevPlan.goals && prevPlan.goals.length > 0 && !prevPlan.reviewedAt) {
    return false;
  }

  return true;
}
