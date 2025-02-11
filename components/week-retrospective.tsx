'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChartBar, ListTodo, Star, ThumbsDown, ThumbsUp, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { type WeekData } from '@/hooks/use-weekly-data';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FeedbackSection } from '@/components/feedback-section';
import { TaskItem } from '@/components/task-item';
import { TaskInputGroup, type FrequencyType, FREQUENCY_OPTIONS } from './task-input-group';

interface WeekRetrospectiveProps {
  weekData: WeekData;
  currentWeek: number;
  onTriptiIndexChange: (value: number) => void;
  onPositiveAdd: (text: string) => void;
  onPositiveRemove: (index: number) => void;
  onNegativeAdd: (text: string) => void;
  onNegativeRemove: (index: number) => void;
  allWeekData?: WeekData[];
  onTasksChange: (tasks: { id: string; description: string; frequency: FrequencyType }[]) => void;
  onCurrentWeekTasksChange: (tasks: { id: string; description: string; frequency: FrequencyType }[]) => void;
  showTasksOnly?: boolean;
  showJumpToCurrentWeek?: boolean;
  onJumpToCurrentWeek?: () => void;
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
  onCurrentWeekTasksChange,
  showTasksOnly = false,
  showJumpToCurrentWeek = false,
  onJumpToCurrentWeek,
}: WeekRetrospectiveProps) {
  const [newPositive, setNewPositive] = useState('');
  const [newNegative, setNewNegative] = useState('');
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');

  // Get tasks that were planned for this week from previous week's nextWeekPlans
  const previousWeekPlans = allWeekData.find(data => data.week === weekData.week - 1)?.nextWeekPlans || [];

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
      // For current week view, add to currentWeekTasks
      if (weekData.week === currentWeek) {
        onCurrentWeekTasksChange([
          ...weekData.currentWeekTasks,
          {
            id: nanoid(),
            description: newTask.trim(),
            frequency,
          },
        ]);
      } else {
        // For past/future weeks, add to currentWeekTasks of that week
        onCurrentWeekTasksChange([
          ...weekData.currentWeekTasks,
          {
            id: nanoid(),
            description: newTask.trim(),
            frequency,
          },
        ]);
      }
      setNewTask('');
    }
  };

  const handleTaskRemove = (taskId: string) => {
    // Always remove from currentWeekTasks since we're in the "Tasks for Week" view
    onCurrentWeekTasksChange(weekData.currentWeekTasks.filter(task => task.id !== taskId));
  };

  const handleCopyPreviousWeekTasks = () => {
    if (previousWeekPlans.length > 0) {
      const newTasks = previousWeekPlans.map(task => ({
        ...task,
        id: nanoid() // Generate new IDs for copied tasks
      }));
      // Always add to currentWeekTasks since we're in the "Tasks for Week" view
      onCurrentWeekTasksChange(newTasks);
    }
  };

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
              {(weekData.week === currentWeek ? weekData.currentWeekTasks : previousWeekPlans).length > 0 && (
                <span className="text-sm bg-primary/10 text-primary rounded-full px-2 py-0.5">
                  {(weekData.week === currentWeek ? weekData.currentWeekTasks : previousWeekPlans).length} tasks
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
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <TaskInputGroup
                    newTask={newTask}
                    frequency={frequency}
                    onTaskChange={setNewTask}
                    onFrequencyChange={(value: FrequencyType) => setFrequency(value)}
                    onSubmit={handleTaskAdd}
                  />
                </div>
                {weekData.currentWeekTasks.length === 0 && previousWeekPlans.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleCopyPreviousWeekTasks}
                    className="w-full sm:w-auto whitespace-nowrap flex items-center gap-2 justify-center self-start mt-0 sm:mt-1"
                  >
                    <Copy className="h-4 w-4" />
                    Copy from Previous Week
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 -mr-2">
              {weekData.week === currentWeek ? (
                weekData.currentWeekTasks.length > 0 ? (
                  weekData.currentWeekTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      removable={true}
                      onRemove={handleTaskRemove}
                    />
                  ))
                ) : (
                  <div className="text-center p-4 sm:p-6 bg-muted/30 rounded-md">
                    <ListTodo className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground font-medium mb-1">No tasks for this week</p>
                    <p className="text-sm text-muted-foreground">
                      Add tasks above or copy from previous week's planning
                    </p>
                  </div>
                )
              ) : previousWeekPlans.length > 0 ? (
                previousWeekPlans.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    removable={false}
                    onRemove={handleTaskRemove}
                  />
                ))
                ) : (
                    <div className="text-center p-4 sm:p-6 bg-muted/30 rounded-md">
                      <ListTodo className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground font-medium mb-1">No tasks planned for this week</p>
                  <p className="text-sm text-muted-foreground">
                    Add tasks above to start planning your week
                      </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (showTasksOnly) {
    return (
      <Card data-tasks-only="true">
        {renderTasksSection()}
      </Card>
    );
  }

  // Regular interactive UI
  return (
    <Card className="p-2 WeekRetrospective" data-tasks-only="false">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar className="h-5 w-5 shrink-0" />
          <span>Retrospective</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5" />
              Tripti Index
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <FeedbackSection
          type="positive"
          title="Positives"
          icon={<ThumbsUp className="h-5 w-5" />}
          placeholder="Add a positive..."
          items={weekData.positives}
          onAdd={onPositiveAdd}
          onRemove={onPositiveRemove}
        />

        <FeedbackSection
          type="negative"
          title="Areas for Improvement"
          icon={<ThumbsDown className="h-5 w-5" />}
          placeholder="Add a negative..."
          items={weekData.negatives}
          onAdd={onNegativeAdd}
          onRemove={onNegativeRemove}
        />
      </CardContent>
    </Card>
  );
} 