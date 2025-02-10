'use client';

import { useState, useEffect } from 'react';
import type { WeekStartDay } from '@/lib/utils';

export function useWeekSettings() {
  const [weekStartDay, setWeekStartDay] = useState<WeekStartDay>(1); // Default to Monday

  useEffect(() => {
    // Load settings from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedStartDay = localStorage.getItem('weeklyTrackerWeekStartDay');
      if (savedStartDay) {
        setWeekStartDay(parseInt(savedStartDay) as WeekStartDay);
      }
    }
  }, []);

  const updateWeekStartDay = (day: WeekStartDay) => {
    setWeekStartDay(day);
    if (typeof window !== 'undefined') {
      localStorage.setItem('weeklyTrackerWeekStartDay', day.toString());
    }
  };

  return {
    weekStartDay,
    updateWeekStartDay,
  };
} 