import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { addDays, format, differenceInWeeks } from 'date-fns'

export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWeekStartDate(date: Date, weekStartDay: WeekStartDay): Date {
  const currentDay = date.getDay();
  const diff = currentDay >= weekStartDay ? currentDay - weekStartDay : 7 - (weekStartDay - currentDay);
  return addDays(date, -diff);
}

export function getCurrentWeek(date: Date = new Date(), weekStartDay: WeekStartDay = 1): number {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const firstWeekStart = getWeekStartDate(yearStart, weekStartDay);
  const targetWeekStart = getWeekStartDate(date, weekStartDay);
  return Math.floor(differenceInWeeks(targetWeekStart, firstWeekStart)) + 1;
}

export function getWeekDateRange(weekNumber: number, weekStartDay: WeekStartDay = 1, year: number = new Date().getFullYear()): string {
  const yearStart = new Date(year, 0, 1);
  const firstWeekStart = getWeekStartDate(yearStart, weekStartDay);
  const weekStart = addDays(firstWeekStart, (weekNumber - 1) * 7);
  const weekEnd = addDays(weekStart, 6);
  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;
}

export const WEEK_DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
] as const;
