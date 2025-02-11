'use client';

import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { getWeekDateRange } from '@/lib/utils';
import type { WeekStartDay } from '@/lib/utils';
import { Badge } from './ui/badge';

interface WeekHeaderProps {
  selectedWeek: number;
  currentWeek: number;
  weekStartDay: WeekStartDay;
  onWeekChange: (week: number) => void;
  onDownload: () => void;
}

export function WeekHeader({ selectedWeek, currentWeek, weekStartDay, onWeekChange, onDownload }: WeekHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
      <div className="flex justify-between sm:justify-start gap-1 items-center flex-grow flex-1">
        <h2 className="font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Week {selectedWeek} ({getWeekDateRange(selectedWeek, weekStartDay)})
        </h2>
        {selectedWeek === currentWeek && (
          <Badge variant="secondary">Current Week</Badge>
          // <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">Current Week</span>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onWeekChange(Math.max(1, selectedWeek - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => onWeekChange(currentWeek)}
            className="flex items-center gap-2 flex-1"
          >
            Jump to Current Week
          </Button>
          <Button
            variant="outline"
            onClick={() => onWeekChange(Math.min(52, selectedWeek + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={onDownload}
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Download className="h-4 w-4" />
          <span>Download Week Summary</span>
        </Button>
      </div>
    </div>
  );
} 