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
import type { Language } from '../types';

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
