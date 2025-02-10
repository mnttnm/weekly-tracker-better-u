'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChartBar, ListTodo, PlusCircle, Star, ThumbsDown, ThumbsUp, X, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { type WeekData } from '@/hooks/use-weekly-data';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { nanoid } from 'nanoid';

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'once', label: 'Once a week' },
  { value: 'twice', label: 'Twice a week' },
  { value: 'thrice', label: 'Three times a week' },
  { value: 'four', label: 'Four times a week' },
  { value: 'five', label: 'Five times a week' },
  { value: 'six', label: 'Six times a week' },
  { value: 'alt', label: 'Alternate days' },
] as const;

interface WeekRetrospectiveProps {
  weekData: WeekData;
  currentWeek: number;
  onTriptiIndexChange: (value: number) => void;
  onPositiveAdd: (text: string) => void;
  onPositiveRemove: (index: number) => void;
  onNegativeAdd: (text: string) => void;
  onNegativeRemove: (index: number) => void;
  allWeekData?: WeekData[];
  onTasksChange: (tasks: { id: string; description: string; frequency: 'daily' | 'once' | 'twice' | 'thrice' | 'four' | 'five' | 'six' | 'alt' }[]) => void;
  showTasksOnly?: boolean;
}

const getTriptiLabel = (value: number) => {
  const labels = {
    1: 'Needs Improvement - Time to reflect and adjust',
    2: 'Getting There - Making progress',
    3: 'Good - Steady and balanced',
    4: 'Great - Thriving and growing',
    5: 'Excellent - Peak performance'
  };
  return labels[value as keyof typeof labels] || '';
};

export function WeekRetrospective({
  weekData,
  currentWeek,
  onTriptiIndexChange,
  onPositiveAdd,
  onPositiveRemove,
  onNegativeAdd,
  onNegativeRemove,
  allWeekData = [],
  onTasksChange,
  showTasksOnly = false,
}: WeekRetrospectiveProps) {
  const [newPositive, setNewPositive] = useState('');
  const [newNegative, setNewNegative] = useState('');
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [frequency, setFrequency] = useState<typeof FREQUENCY_OPTIONS[number]['value']>('daily');

  // Get tasks that were planned for this week
  // For any week N, we need to look at week N-1's nextWeekPlans
  const tasksForCurrentWeek = allWeekData.find(data => data.week === weekData.week - 1)?.nextWeekPlans || [];
  const previousWeekTasks = allWeekData.find(data => data.week === weekData.week - 1)?.nextWeekPlans || [];

  const handlePositiveAdd = () => {
    if (newPositive.trim()) {
      onPositiveAdd(newPositive.trim());
      setNewPositive('');
    }
  };

  const handleNegativeAdd = () => {
    if (newNegative.trim()) {
      onNegativeAdd(newNegative.trim());
      setNewNegative('');
    }
  };

  const handleTaskAdd = () => {
    if (newTask.trim()) {
      onTasksChange([
        ...weekData.nextWeekPlans,
        {
          id: nanoid(),
          description: newTask.trim(),
          frequency,
        },
      ]);
      setNewTask('');
    }
  };

  const handleTaskRemove = (taskId: string) => {
    onTasksChange(weekData.nextWeekPlans.filter(task => task.id !== taskId));
  };

  const handleCopyPreviousWeekTasks = () => {
    if (previousWeekTasks.length > 0) {
      const newTasks = previousWeekTasks.map(task => ({
        ...task,
        id: nanoid() // Generate new IDs for copied tasks
      }));
      onTasksChange(newTasks);
    }
  };

  // Get formatted content for screenshot
  const getScreenshotContent = () => (
    <div className="screenshot-content space-y-6">
      {/* Tripti Index Section */}
      <div className="screenshot-section bg-white/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Star className="h-5 w-5" />
          Week Rating
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-primary">{weekData.triptiIndex}/5</div>
          <div className="text-muted-foreground">{getTriptiLabel(weekData.triptiIndex)}</div>
        </div>
      </div>

      {/* Tasks Section */}
      {tasksForCurrentWeek.length > 0 && (
        <div className="screenshot-section bg-white/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            {weekData.week === currentWeek ? "This Week's Tasks" : `Week ${weekData.week} Tasks`}
          </h3>
          <div className="space-y-3">
            {tasksForCurrentWeek.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="handwritten text-lg">{task.description}</span>
                <span className="text-sm text-muted-foreground px-2 py-1 bg-muted/20 rounded-full">
                  {task.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positives Section */}
      {weekData.positives.length > 0 && (
        <div className="screenshot-section bg-white/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ThumbsUp className="h-5 w-5" />
            Highlights
          </h3>
          <div className="space-y-3">
            {weekData.positives.map((positive, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <ThumbsUp className="h-4 w-4 text-primary shrink-0" />
                <span className="handwritten text-lg">{positive}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negatives Section */}
      {weekData.negatives.length > 0 && (
        <div className="screenshot-section bg-white/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ThumbsDown className="h-5 w-5" />
            Areas for Improvement
          </h3>
          <div className="space-y-3">
            {weekData.negatives.map((negative, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <ThumbsDown className="h-4 w-4 text-destructive shrink-0" />
                <span className="handwritten text-lg">{negative}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTasksSection = () => (
    <div className={showTasksOnly ? "" : "mb-6"}>
      <button
        onClick={() => setIsTasksExpanded(!isTasksExpanded)}
        className="w-full p-4 bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium flex items-center gap-2 flex-wrap">
            <ListTodo className="h-5 w-5" />
            <span className="flex items-center gap-2 flex-wrap">
              Tasks for {weekData.week === currentWeek ? "This Week" : "Week " + weekData.week}
              {weekData.week === currentWeek && (
                <span className="text-sm text-muted-foreground">(Planned last week)</span>
              )}
              {tasksForCurrentWeek.length > 0 && (
                <span className="text-sm bg-primary/10 text-primary rounded-full px-2 py-0.5">
                  {tasksForCurrentWeek.length} tasks
                </span>
              )}
            </span>
          </h4>
          <div className="flex items-center gap-2">
            {isTasksExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isTasksExpanded ? "max-h-[500px] mt-2" : "max-h-0"
      )}>
        <div className="p-4 bg-muted/30 rounded-lg space-y-4">
          {weekData.week === currentWeek && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="handwritten text-lg sm:text-2xl flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleTaskAdd()}
                />
                <div className="flex gap-2">
                  <Select
                    value={frequency}
                    onValueChange={(value: typeof FREQUENCY_OPTIONS[number]['value']) => setFrequency(value)}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleTaskAdd} className="shrink-0">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {tasksForCurrentWeek.length === 0 && previousWeekTasks.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleCopyPreviousWeekTasks}
                  className="w-full flex items-center gap-2 justify-center"
                >
                  <Copy className="h-4 w-4" />
                  Copy tasks from previous week
                </Button>
              )}
            </div>
          )}

          <div className="space-y-2">
            {tasksForCurrentWeek.length > 0 ? (
              tasksForCurrentWeek.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 sm:p-3 bg-white/50 rounded-md group gap-2"
                >
                  <span className="handwritten text-base sm:text-2xl line-clamp-2">{task.description}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs sm:text-sm text-muted-foreground">{task.frequency}</span>
                    {weekData.week === currentWeek && (
                      <>
                        {/* Desktop remove button (hover) */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskRemove(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 hidden sm:flex"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {/* Mobile remove button (always visible) */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskRemove(task.id)}
                          className="sm:hidden flex text-muted-foreground/70 hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 sm:p-6 bg-white/50 rounded-md">
                <ListTodo className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground font-medium mb-1">No tasks planned for this week</p>
                {weekData.week === currentWeek ? (
                  <p className="text-sm text-muted-foreground">
                    Add tasks above to start planning your week
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tasks were planned for this week
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (showTasksOnly) {
    return (
      <div className="bg-white rounded-lg">
        {renderTasksSection()}
      </div>
    );
  }

  // Regular interactive UI
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Regular UI content */}
      <div className="hide-in-screenshot">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <ChartBar className="h-5 w-5" />
          Retrospective
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Tripti Index
            </h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  variant={weekData.triptiIndex === value ? 'default' : 'outline'}
                  onClick={() => onTriptiIndexChange(value)}
                  className="w-12 h-12 p-0 relative group"
                  title={getTriptiLabel(value)}
                >
                  <Star className={`h-6 w-6 ${weekData.triptiIndex >= value ? 'fill-current' : ''}`} />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                    {getTriptiLabel(value)}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
              <ThumbsUp className="h-5 w-5" />
              Positives
            </h4>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a positive..."
                  value={newPositive}
                  onChange={(e) => setNewPositive(e.target.value)}
                  className="handwritten text-2xl"
                  onKeyPress={(e) => e.key === 'Enter' && handlePositiveAdd()}
                />
                <Button onClick={handlePositiveAdd}>
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              {weekData.positives.map((positive, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="h-4 w-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="handwritten text-xl">{positive}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPositiveRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
              <ThumbsDown className="h-5 w-5" />
              Negatives
            </h4>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a negative..."
                  value={newNegative}
                  onChange={(e) => setNewNegative(e.target.value)}
                  className="handwritten text-2xl"
                  onKeyPress={(e) => e.key === 'Enter' && handleNegativeAdd()}
                />
                <Button onClick={handleNegativeAdd}>
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              {weekData.negatives.map((negative, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <ThumbsDown className="h-4 w-4 text-destructive opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="handwritten text-xl">{negative}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNegativeRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot optimized content */}
      <div className="screenshot-only hidden">
        {getScreenshotContent()}
      </div>
    </div>
  );
} 