"use client"

import { useState, useEffect, useCallback } from "react"

type FrequencyType = 'daily' | 'once' | 'twice' | 'thrice' | 'four' | 'five' | 'six' | 'alt';

export interface WeekData {
  week: number;
  triptiIndex: number;
  positives: string[];
  negatives: string[];
  nextWeekPlans: {
    id: string;
    description: string;
    frequency: FrequencyType;
  }[];
}

export function useWeeklyData() {
  const [isLoading, setIsLoading] = useState(true);
  const [weekData, setWeekData] = useState<WeekData[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('weeklyTrackerData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Convert any old frequency strings to the new type
        const migratedData = parsedData.map((week: WeekData) => ({
          ...week,
          nextWeekPlans: week.nextWeekPlans.map(task => ({
            ...task,
            frequency: task.frequency as FrequencyType
          }))
        }));
        setWeekData(migratedData);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {  // Only save after initial load
      try {
        localStorage.setItem('weeklyTrackerData', JSON.stringify(weekData));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  }, [weekData, isLoading]);

  const getWeekData = useCallback((weekNumber: number) => {
    return weekData.find((data) => data.week === weekNumber) || {
      week: weekNumber,
      triptiIndex: 0,
      positives: [],
      negatives: [],
      nextWeekPlans: [],
    };
  }, [weekData]);

  const updateWeekData = useCallback((weekNumber: number, data: Partial<WeekData>) => {
    setWeekData(prevData => {
      const currentData = getWeekData(weekNumber);
      const newData = { ...currentData, ...data };
      const index = prevData.findIndex(d => d.week === weekNumber);
      
      if (index >= 0) {
        return prevData.map(d => d.week === weekNumber ? newData : d);
      } else {
        return [...prevData, newData];
      }
    });
  }, [getWeekData]);

  return {
    weekData,
    isLoading,
    getWeekData,
    updateWeekData,
  };
}

