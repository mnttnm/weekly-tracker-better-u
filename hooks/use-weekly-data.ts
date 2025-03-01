"use client"

import { useState, useEffect, useCallback } from "react"
import { nanoid } from "nanoid"

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
  currentWeekTasks: {
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
          })),
          currentWeekTasks: week.currentWeekTasks?.map(task => ({
            ...task,
            frequency: task.frequency as FrequencyType
          })) || []
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
    const weekDataItem = weekData.find((data) => data.week === weekNumber);

    if (!weekDataItem) {
      // For a new week, check if there were tasks planned for it in the previous week
      const previousWeek = weekData.find((data) => data.week === weekNumber - 1);
      const plannedTasks = previousWeek?.nextWeekPlans || [];

      return {
        week: weekNumber,
        triptiIndex: 0,
        positives: [],
        negatives: [],
        nextWeekPlans: [],
        currentWeekTasks: plannedTasks.map(task => ({
          ...task,
          id: nanoid() // Generate new IDs for copied tasks
        })),
      };
    }

    return weekDataItem;
  }, [weekData]);

  const updateWeekData = useCallback((weekNumber: number, data: Partial<WeekData>) => {
    setWeekData(prevData => {
      const currentData = getWeekData(weekNumber);
      const newData = { ...currentData, ...data };
      let updatedData = [...prevData];
      const index = updatedData.findIndex(d => d.week === weekNumber);

      // If we're updating currentWeekTasks, sync with previous week's nextWeekPlans
      if (data.currentWeekTasks) {
        // First ensure previous week exists
        const prevWeekIndex = updatedData.findIndex(d => d.week === weekNumber - 1);
        if (prevWeekIndex >= 0) {
          // Previous week exists, update its nextWeekPlans
          updatedData = updatedData.map(d => {
            if (d.week === weekNumber - 1) {
              return {
                ...d,
                nextWeekPlans: data.currentWeekTasks!
              };
            }
            return d;
          });
        } else {
          // Previous week doesn't exist, create it
          updatedData.push({
            week: weekNumber - 1,
            triptiIndex: 0,
            positives: [],
            negatives: [],
            nextWeekPlans: data.currentWeekTasks!,
            currentWeekTasks: []
          });
        }
      }

      // If we're updating nextWeekPlans, sync with next week's currentWeekTasks
      if (data.nextWeekPlans) {
        // First ensure next week exists
        const nextWeekIndex = updatedData.findIndex(d => d.week === weekNumber + 1);
        if (nextWeekIndex >= 0) {
          // Next week exists, update its currentWeekTasks
          updatedData = updatedData.map(d => {
            if (d.week === weekNumber + 1) {
              return {
                ...d,
                currentWeekTasks: data.nextWeekPlans!
              };
            }
            return d;
          });
        } else {
          // Next week doesn't exist, create it
          updatedData.push({
            week: weekNumber + 1,
            triptiIndex: 0,
            positives: [],
            negatives: [],
            nextWeekPlans: [],
            currentWeekTasks: data.nextWeekPlans!
          });
        }
      }
      
      // Finally, update or add the current week's data
      if (index >= 0) {
        updatedData = updatedData.map(d => d.week === weekNumber ? newData : d);
      } else {
        updatedData.push(newData);
      }

      // Sort weeks in ascending order
      return updatedData.sort((a, b) => a.week - b.week);
    });
  }, [getWeekData]);

  return {
    weekData,
    isLoading,
    getWeekData,
    updateWeekData,
  };
}

