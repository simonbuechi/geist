import { describe, it, expect } from 'vitest';
import { getReminderTargetWeek, shouldSendMondayReminder } from './reminderUtils';

describe('reminderUtils', () => {
  describe('getReminderTargetWeek', () => {
    it('targets current week on Sunday afternoon', () => {
      // 2026-08-30 is Sunday of week 35
      const sunday = new Date('2026-08-30T17:00:00Z');
      expect(getReminderTargetWeek(sunday, 'sunday')).toBe('2026-W35');
    });

    it('targets previous week on Monday afternoon', () => {
      // 2026-08-31 is Monday of week 36
      const monday = new Date('2026-08-31T17:00:00Z');
      expect(getReminderTargetWeek(monday, 'monday')).toBe('2026-W35');
    });

    it('auto-detects Monday from date day of week', () => {
      const monday = new Date('2026-08-31T17:00:00Z');
      expect(getReminderTargetWeek(monday)).toBe('2026-W35');
    });
  });

  describe('shouldSendMondayReminder', () => {
    it('returns true if week plan is missing or null', () => {
      expect(shouldSendMondayReminder(null)).toBe(true);
      expect(shouldSendMondayReminder(undefined)).toBe(true);
    });

    it('returns true if week plan exists but reviewedAt is missing', () => {
      expect(shouldSendMondayReminder({
        id: '2026-W35',
        reviewedAt: undefined
      })).toBe(true);
    });

    it('returns false if week plan has already been reviewed (conditional suppression)', () => {
      expect(shouldSendMondayReminder({
        id: '2026-W35',
        reviewedAt: Date.now()
      })).toBe(false);
    });
  });
});
