import { describe, it, expect } from 'vitest';
import {
  getWeekId,
  parseWeekId,
  getNextWeekId,
  getPreviousWeekId,
  getMondayOfWeek,
  getSundayOfWeek,
  formatWeekRange,
  isCurrentWeekId,
} from './dateUtils';

describe('dateUtils', () => {
  describe('getWeekId', () => {
    it('generates the correct ISO week format for a given date', () => {
      // 2026-08-29 is Saturday of ISO week 35 in 2026
      const date = new Date('2026-08-29T12:00:00Z');
      expect(getWeekId(date)).toBe('2026-W35');
    });

    it('handles week 1 correctly', () => {
      // 2026-01-01 is Thursday, belonging to 2026-W01
      const date = new Date('2026-01-01T12:00:00Z');
      expect(getWeekId(date)).toBe('2026-W01');
    });
  });

  describe('parseWeekId', () => {
    it('correctly derives Monday and Sunday for an ISO week', () => {
      const { year, weekNumber, startDate, endDate } = parseWeekId('2026-W35');
      expect(year).toBe(2026);
      expect(weekNumber).toBe(35);

      // In JS, Sunday is 0, Monday is 1
      expect(startDate.getDay()).toBe(1); // Monday
      expect(endDate.getDay()).toBe(0);   // Sunday
    });

    it('ensures startDate is before endDate', () => {
      const { startDate, endDate } = parseWeekId('2026-W10');
      expect(startDate.getTime()).toBeLessThan(endDate.getTime());
    });
  });

  describe('week navigation (getNextWeekId & getPreviousWeekId)', () => {
    it('advances to next consecutive week', () => {
      expect(getNextWeekId('2026-W35')).toBe('2026-W36');
      expect(getPreviousWeekId('2026-W35')).toBe('2026-W34');
    });

    it('handles year transitions cleanly', () => {
      // 2026 has 53 ISO weeks: week 53 rolls over to 2027-W01
      const nextFromW53 = getNextWeekId('2026-W53');
      expect(nextFromW53).toBe('2027-W01');

      // 2025 has 52 ISO weeks: week 52 rolls over to 2026-W01
      const nextFrom2025W52 = getNextWeekId('2025-W52');
      expect(nextFrom2025W52).toBe('2026-W01');

      // Previous from week 1 should roll back to the last week of previous year
      const prevFromW01 = getPreviousWeekId('2026-W01');
      expect(prevFromW01).toBe('2025-W52');
    });
  });

  describe('getMondayOfWeek and getSundayOfWeek', () => {
    it('returns Monday and Sunday of the current week', () => {
      const testDate = new Date('2026-08-26T12:00:00Z'); // Wednesday
      const monday = getMondayOfWeek(testDate);
      const sunday = getSundayOfWeek(testDate);

      expect(monday.getDay()).toBe(1);
      expect(sunday.getDay()).toBe(0);
      expect(monday.getTime()).toBeLessThan(sunday.getTime());
    });
  });

  describe('formatWeekRange', () => {
    it('formats date range in German format by default', () => {
      const { startDate, endDate } = parseWeekId('2026-W35');
      const formatted = formatWeekRange(startDate, endDate, 'de');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
      // Should include the year
      expect(formatted).toContain('2026');
    });

    it('formats date range in English format', () => {
      const { startDate, endDate } = parseWeekId('2026-W35');
      const formatted = formatWeekRange(startDate, endDate, 'en');
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2026');
    });
  });

  describe('isCurrentWeekId', () => {
    it('returns true for the actual current week', () => {
      const currentId = getWeekId(new Date());
      expect(isCurrentWeekId(currentId)).toBe(true);
      expect(isCurrentWeekId('1999-W01')).toBe(false);
    });
  });
});
