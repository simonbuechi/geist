import { describe, it, expect } from 'vitest';
import {
  getStorageKey,
  isSampleGoal,
  hasRealUserGoals,
  mergeGoals,
  mergeWeekPlans,
  mergeAllWeekPlans,
  GUEST_STORAGE_KEY
} from './planSyncUtils';
import type { Goal, WeekPlan } from '../types';

describe('planSyncUtils', () => {
  describe('getStorageKey', () => {
    it('returns guest storage key when userId is null or empty', () => {
      expect(getStorageKey(null)).toBe(GUEST_STORAGE_KEY);
      expect(getStorageKey(undefined)).toBe(GUEST_STORAGE_KEY);
      expect(getStorageKey('')).toBe(GUEST_STORAGE_KEY);
    });

    it('returns user-specific storage key when userId is provided', () => {
      expect(getStorageKey('user-123')).toBe('kgs_week_plans_user-123');
    });
  });

  describe('isSampleGoal', () => {
    it('identifies starter sample goals', () => {
      const sampleGoal: Goal = {
        id: 'sample-body-1',
        category: 'body',
        description: 'Sample Goal',
        status: 'pending',
        createdAt: 1000
      };
      expect(isSampleGoal(sampleGoal)).toBe(true);
    });

    it('identifies custom user goals', () => {
      const userGoal: Goal = {
        id: 'goal-1725110000-abc',
        category: 'mind',
        description: 'User Goal',
        status: 'pending',
        createdAt: 2000
      };
      expect(isSampleGoal(userGoal)).toBe(false);
    });
  });

  describe('hasRealUserGoals', () => {
    it('returns false for plan with only sample goals', () => {
      const plan: WeekPlan = {
        id: '2026-W35',
        year: 2026,
        weekNumber: 35,
        startDate: '',
        endDate: '',
        goals: [
          { id: 'sample-1', category: 'body', description: 'Test', status: 'pending', createdAt: 100 }
        ],
        updatedAt: 100
      };
      expect(hasRealUserGoals(plan)).toBe(false);
    });

    it('returns true when plan contains at least one user-created goal', () => {
      const plan: WeekPlan = {
        id: '2026-W35',
        year: 2026,
        weekNumber: 35,
        startDate: '',
        endDate: '',
        goals: [
          { id: 'sample-1', category: 'body', description: 'Test', status: 'pending', createdAt: 100 },
          { id: 'goal-custom-1', category: 'mind', description: 'Real Goal', status: 'pending', createdAt: 200 }
        ],
        updatedAt: 200
      };
      expect(hasRealUserGoals(plan)).toBe(true);
    });
  });

  describe('mergeGoals', () => {
    it('merges new guest goal with existing cloud goals without losing either', () => {
      const guestGoals: Goal[] = [
        { id: 'goal-guest-1', category: 'body', description: 'Jogging', status: 'pending', createdAt: 2000 }
      ];
      const cloudGoals: Goal[] = [
        { id: 'goal-cloud-1', category: 'mind', description: 'Reading', status: 'good', createdAt: 1000 }
      ];

      const merged = mergeGoals(guestGoals, cloudGoals);
      expect(merged).toHaveLength(2);
      expect(merged.some(g => g.id === 'goal-guest-1')).toBe(true);
      expect(merged.some(g => g.id === 'goal-cloud-1')).toBe(true);
    });

    it('drops starter sample goals if cloud goals exist', () => {
      const guestGoals: Goal[] = [
        { id: 'sample-body-1', category: 'body', description: 'Sample', status: 'pending', createdAt: 500 },
        { id: 'goal-guest-1', category: 'soul', description: 'Meditation', status: 'pending', createdAt: 2000 }
      ];
      const cloudGoals: Goal[] = [
        { id: 'goal-cloud-1', category: 'mind', description: 'Reading', status: 'good', createdAt: 1000 }
      ];

      const merged = mergeGoals(guestGoals, cloudGoals);
      expect(merged).toHaveLength(2);
      expect(merged.find(g => g.id === 'sample-body-1')).toBeUndefined();
      expect(merged.find(g => g.id === 'goal-guest-1')).toBeDefined();
      expect(merged.find(g => g.id === 'goal-cloud-1')).toBeDefined();
    });

    it('resolves conflicting goal updates by keeping the newer one', () => {
      const guestGoals: Goal[] = [
        { id: 'goal-common-1', category: 'body', description: 'Updated Description', status: 'good', createdAt: 1000, updatedAt: 3000 }
      ];
      const cloudGoals: Goal[] = [
        { id: 'goal-common-1', category: 'body', description: 'Old Description', status: 'pending', createdAt: 1000, updatedAt: 2000 }
      ];

      const merged = mergeGoals(guestGoals, cloudGoals);
      expect(merged).toHaveLength(1);
      expect(merged[0].description).toBe('Updated Description');
      expect(merged[0].status).toBe('good');
    });
  });

  describe('mergeWeekPlans', () => {
    it('merges goals and preserves latest reflection and review info', () => {
      const guestPlan: WeekPlan = {
        id: '2026-W35',
        year: 2026,
        weekNumber: 35,
        startDate: '',
        endDate: '',
        goals: [{ id: 'goal-g1', category: 'body', description: 'Run', status: 'pending', createdAt: 100 }],
        reviewedAt: 5000,
        generalReflection: 'Guest Reflection',
        updatedAt: 5000
      };

      const cloudPlan: WeekPlan = {
        id: '2026-W35',
        year: 2026,
        weekNumber: 35,
        startDate: '',
        endDate: '',
        goals: [{ id: 'goal-c1', category: 'mind', description: 'Read', status: 'good', createdAt: 100 }],
        updatedAt: 1000
      };

      const merged = mergeWeekPlans(guestPlan, cloudPlan, '2026-W35');
      expect(merged.goals).toHaveLength(2);
      expect(merged.reviewedAt).toBe(5000);
      expect(merged.generalReflection).toBe('Guest Reflection');
    });
  });

  describe('mergeAllWeekPlans', () => {
    it('correctly marks new guest-created week plans for cloud upload on login', () => {
      const guestPlans: Record<string, WeekPlan> = {
        '2026-W35': {
          id: '2026-W35',
          year: 2026,
          weekNumber: 35,
          startDate: '2026-08-24T00:00:00.000Z',
          endDate: '2026-08-30T23:59:59.999Z',
          goals: [
            { id: 'goal-guest-1', category: 'body', description: 'Walk 10k steps', status: 'pending', createdAt: 1000 }
          ],
          updatedAt: 1000
        }
      };

      const cloudPlans: Record<string, WeekPlan> = {};

      const result = mergeAllWeekPlans(guestPlans, cloudPlans);
      expect(result.plansToUpload).toHaveLength(1);
      expect(result.plansToUpload[0].id).toBe('2026-W35');
      expect(result.mergedPlans['2026-W35'].goals).toHaveLength(1);
      expect(result.mergedPlans['2026-W35'].goals[0].description).toBe('Walk 10k steps');
    });

    it('does NOT upload untouched default starter sample plans to cloud', () => {
      const guestPlans: Record<string, WeekPlan> = {
        '2026-W35': {
          id: '2026-W35',
          year: 2026,
          weekNumber: 35,
          startDate: '2026-08-24T00:00:00.000Z',
          endDate: '2026-08-30T23:59:59.999Z',
          goals: [
            { id: 'sample-body-1', category: 'body', description: 'Sample', status: 'pending', createdAt: 500 }
          ],
          updatedAt: 500
        }
      };

      const cloudPlans: Record<string, WeekPlan> = {};

      const result = mergeAllWeekPlans(guestPlans, cloudPlans);
      expect(result.plansToUpload).toHaveLength(0);
    });

    it('merges goals when both guest and cloud have data for the same week', () => {
      const guestPlans: Record<string, WeekPlan> = {
        '2026-W35': {
          id: '2026-W35',
          year: 2026,
          weekNumber: 35,
          startDate: '2026-08-24T00:00:00.000Z',
          endDate: '2026-08-30T23:59:59.999Z',
          goals: [
            { id: 'goal-guest-new', category: 'soul', description: 'Yoga', status: 'pending', createdAt: 2000 }
          ],
          updatedAt: 2000
        }
      };

      const cloudPlans: Record<string, WeekPlan> = {
        '2026-W35': {
          id: '2026-W35',
          year: 2026,
          weekNumber: 35,
          startDate: '2026-08-24T00:00:00.000Z',
          endDate: '2026-08-30T23:59:59.999Z',
          goals: [
            { id: 'goal-cloud-existing', category: 'mind', description: 'Chess', status: 'good', createdAt: 1000 }
          ],
          updatedAt: 1000
        }
      };

      const result = mergeAllWeekPlans(guestPlans, cloudPlans);
      expect(result.plansToUpload).toHaveLength(1);
      expect(result.mergedPlans['2026-W35'].goals).toHaveLength(2);
    });
  });
});
