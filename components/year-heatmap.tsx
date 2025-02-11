'use client';

import { format, eachWeekOfInterval, getMonth, addDays, endOfMonth, startOfMonth } from 'date-fns';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import { cn, getCurrentWeek, type WeekStartDay } from '@/lib/utils';

interface YearHeatmapProps {
  data: {
    week: number;
    triptiIndex: number;
  }[];
  onWeekSelect: (week: number) => void;
  currentWeek: number;
  selectedWeek: number;
  weekStartDay: WeekStartDay;
}

const getTriptiLabel = (value: number) => {
  const labels = {
    1: 'Needs Improvement',
    2: 'Getting There',
    3: 'Good',
    4: 'Great',
    5: 'Excellent'
  };
  return labels[value as keyof typeof labels] || '';
};

const getTriptiColor = (value: number) => {
  const colors = {
    1: '#E5F3FF',
    2: '#B3D9FF',
    3: '#80BFFF',
    4: '#4DA6FF',
    5: '#1A8CFF'
  };
  return colors[value as keyof typeof colors] || '#f0f0f0';
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatWeekLabel = (date: Date) => {
  const endDate = addDays(date, 6);
  return `${format(date, 'MMM d')} - ${format(endDate, 'MMM d')}`;
};

export function YearHeatmap({ data, onWeekSelect, currentWeek, selectedWeek, weekStartDay }: YearHeatmapProps) {
  const currentYear = new Date().getFullYear();
  
  // Create month-wise week data with max 5 weeks per month
  const monthsData = MONTHS.map((_, monthIndex) => {
    const monthStart = startOfMonth(new Date(currentYear, monthIndex));
    const monthEnd = endOfMonth(monthStart);
    const monthWeeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
    
    // Get weeks that start in this month
    const weeksInMonth = monthWeeks.filter(date => getMonth(date) === monthIndex);
    
    // Limit to 5 weeks max per month
    const limitedWeeks = weeksInMonth.slice(0, 5);
    
    // Calculate week numbers relative to start date
    const weeksData = limitedWeeks.map(weekStart => {
      const weekNumber = getCurrentWeek(weekStart, weekStartDay);
      return {
        date: weekStart,
        weekNumber,
        triptiIndex: data.find(d => d.week === weekNumber)?.triptiIndex || 0
      };
    });

    // Pad array to always have 5 items for consistent height
    while (weeksData.length < 5) {
      weeksData.unshift({ date: new Date(), weekNumber: -1, triptiIndex: 0 });
    }
    
    return {
      month: MONTHS[monthIndex],
      weeks: weeksData
    };
  });

  const WeekTile = ({ date, weekNumber, triptiIndex }: { date: Date; weekNumber: number; triptiIndex: number }) => {
    if (weekNumber === -1) return <div className="h-5 w-5" />; // Empty spacer for padding
    
    const isCurrentWeek = weekNumber === currentWeek;
    const isSelectedWeek = weekNumber === selectedWeek;
    
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <button
            onClick={() => onWeekSelect(weekNumber)}
            className={cn(
              "h-5 w-5 rounded-[2px] transition-all relative",
              isCurrentWeek && "ring-2 ring-blue-400 ring-offset-1",
              isSelectedWeek && "ring-2 ring-primary ring-offset-1",
              !isCurrentWeek && !isSelectedWeek && "hover:ring-2 hover:ring-primary/50 hover:ring-offset-1"
            )}
            style={{
              backgroundColor: getTriptiColor(triptiIndex),
            }}
          />
        </HoverCardTrigger>
        <HoverCardContent className="w-auto p-2">
          <div className="space-y-1">
            <p className="text-sm font-medium">Week {weekNumber}</p>
            <p className="text-xs text-muted-foreground">
              {formatWeekLabel(date)}
            </p>
            {triptiIndex > 0 ? (
              <p className="text-xs">
                Tripti Index: {triptiIndex} - {getTriptiLabel(triptiIndex)}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">No data</p>
            )}
            {isCurrentWeek && (
              <p className="text-xs font-medium text-blue-500">Current Week</p>
            )}
            {isSelectedWeek && (
              <p className="text-xs font-medium text-primary">Selected Week</p>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex gap-4">
        {monthsData.map(({ month, weeks }) => (
          <div key={month} className="flex-1 flex flex-col items-center min-h-[120px] justify-between">
            {/* Week tiles stacked vertically */}
            <div className="flex flex-col gap-[3px]">
              {weeks.map((weekData) => (
                <WeekTile
                  key={weekData.weekNumber}
                  date={weekData.date}
                  weekNumber={weekData.weekNumber}
                  triptiIndex={weekData.triptiIndex}
                />
              ))}
            </div>
            {/* Month label at the bottom with fixed positioning */}
            <div className="h-8 flex items-center">
              <span className="text-sm font-medium text-muted-foreground">{month}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-3 pt-4 border-t">
        {[1, 2, 3, 4, 5].map((value) => (
          <div key={`legend-${value}`} className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-[2px]"
              style={{ backgroundColor: getTriptiColor(value) }}
            />
            <span className="text-xs text-muted-foreground">
              {getTriptiLabel(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 