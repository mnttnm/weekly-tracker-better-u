'use client';

import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { getWeekDateRange } from '@/lib/utils';
import type { WeekStartDay } from '@/lib/utils';

interface WeekHeaderProps {
  selectedWeek: number;
  currentWeek: number;
  weekStartDay: WeekStartDay;
  onWeekChange: (week: number) => void;
  onDownload: () => void;
}

export function WeekHeader({ selectedWeek, currentWeek, weekStartDay, onWeekChange, onDownload }: WeekHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Week {selectedWeek} ({getWeekDateRange(selectedWeek, weekStartDay)})
        {selectedWeek === currentWeek && (
          <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">Current Week</span>
        )}
      </h2>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Button
          variant="outline"
          onClick={() => onWeekChange(Math.max(1, selectedWeek - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => onWeekChange(currentWeek)}
          className="hidden sm:flex items-center gap-2"
        >
          Current Week
        </Button>
        <Button
          variant="outline"
          onClick={() => onWeekChange(Math.min(52, selectedWeek + 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={onDownload}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Save as Image</span>
        </Button>
      </div>
    </div>
  );
} 