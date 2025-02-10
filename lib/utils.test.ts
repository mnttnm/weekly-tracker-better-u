import { getCurrentWeek, getWeekStartDate, getWeekDateRange, type WeekStartDay } from './utils';

describe('Week Calculations', () => {
  test('getWeekStartDate returns correct start date based on week start day', () => {
    // Test case: If today is Thursday (2024-02-15) and week starts on Monday (1)
    const testDate = new Date(2024, 1, 15); // February 15, 2024 (Thursday)
    const weekStartDay: WeekStartDay = 1; // Monday
    
    const result = getWeekStartDate(testDate, weekStartDay);
    
    // Should return Monday (2024-02-12)
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getDate()).toBe(12);
    expect(result.getDay()).toBe(1); // Monday
  });

  test('getCurrentWeek returns correct week number based on week start day', () => {
    // Test case: February 15, 2024 with week starting on Monday
    const testDate = new Date(2024, 1, 15);
    const weekStartDay: WeekStartDay = 1;
    
    const result = getCurrentWeek(testDate, weekStartDay);
    
    // Since Jan 1, 2024 was a Monday, this should be week 7
    expect(result).toBe(7);
  });

  test('getWeekDateRange returns correct date range string', () => {
    const weekNumber = 7;
    const weekStartDay: WeekStartDay = 1;
    const year = 2024;
    
    const result = getWeekDateRange(weekNumber, weekStartDay, year);
    
    // Week 7 of 2024 (Monday start) should be Feb 12 - Feb 18
    expect(result).toBe('Feb 12 - Feb 18');
  });
}); 