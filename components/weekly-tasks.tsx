'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Badge } from '@/components/ui/badge';
import { TaskInputGroup, type FrequencyType } from './task-input-group';

interface Task {
  id: string;
  description: string;
  frequency: FrequencyType;
}

interface WeeklyTasksProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  currentWeekTasks?: Task[];
}

export function WeeklyTasks({ tasks, onTasksChange, currentWeekTasks = [] }: WeeklyTasksProps) {
  const [newTask, setNewTask] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');

  const handleAddTask = () => {
    if (newTask.trim()) {
      onTasksChange([
        ...tasks,
        {
          id: nanoid(),
          description: newTask.trim(),
          frequency,
        },
      ]);
      setNewTask('');
    }
  };

  const handleCopyCurrentWeekTasks = () => {
    if (currentWeekTasks.length > 0) {
      const newTasks = currentWeekTasks.map(task => ({
        ...task,
        id: nanoid() // Generate new IDs for copied tasks
      }));
      onTasksChange([...tasks, ...newTasks]);
    }
  };

  return (
    <div className="space-y-4 next-week-planning">
      <div className="space-y-4">
        <TaskInputGroup
          newTask={newTask}
          frequency={frequency}
          onTaskChange={setNewTask}
          onFrequencyChange={setFrequency}
          onSubmit={handleAddTask}
        />
      </div>

      {currentWeekTasks.length > 0 && (
        <Button
          variant="outline"
          onClick={handleCopyCurrentWeekTasks}
          className="w-full flex items-center gap-2 justify-center"
        >
          <Copy className="h-4 w-4" />
          Copy tasks from current week
        </Button>
      )}

      <div className="space-y-2 task-list max-h-[300px] overflow-y-auto pr-2 -mr-2">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg group gap-2"
          >
            <span className="handwritten text-base sm:text-xl line-clamp-2">{task.description}</span>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary">{task.frequency}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newTasks = [...tasks];
                  newTasks.splice(index, 1);
                  onTasksChange(newTasks);
                }}
                className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 