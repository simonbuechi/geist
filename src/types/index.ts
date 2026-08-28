export type Category = 'body' | 'mind' | 'soul';

export type GoalStatus = 'pending' | 'good' | 'partly' | 'poor';

export interface Goal {
  id: string;
  category: Category;
  description: string;
  status: GoalStatus;
  comment?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface WeekPlan {
  id: string; // e.g. "2026-W35"
  year: number;
  weekNumber: number;
  startDate: string; // ISO date string of Monday
  endDate: string;   // ISO date string of Sunday
  goals: Goal[];
  reviewedAt?: number;
  generalReflection?: string;
  updatedAt?: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
}

export type Language = 'de' | 'en';
export type ThemeMode = 'light' | 'dark';
