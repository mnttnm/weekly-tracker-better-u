'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Copy, X } from 'lucide-react';
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

type FrequencyType = typeof FREQUENCY_OPTIONS[number]['value'];

interface Task {
  id: string;
  description: string;
  frequency: FrequencyType;
}

interface WeeklyTasksProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  previousWeekTasks?: Task[];
}

export function WeeklyTasks({ tasks, onTasksChange, previousWeekTasks = [] }: WeeklyTasksProps) {
  const [newTask, setNewTask] = useState('');
  const [frequency, setFrequency] = useState('daily');

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

  const handleCopyPreviousWeekTasks = () => {
    if (previousWeekTasks.length > 0) {
      const newTasks = previousWeekTasks.map(task => ({
        ...task,
        id: nanoid() // Generate new IDs for copied tasks
      }));
      onTasksChange([...tasks, ...newTasks]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="handwritten text-2xl"
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Select
          value={frequency}
          onValueChange={setFrequency}
        >
          <SelectTrigger className="w-[180px]">
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
        <Button onClick={handleAddTask}>
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>

      {previousWeekTasks.length > 0 && (
        <Button
          variant="outline"
          onClick={handleCopyPreviousWeekTasks}
          className="w-full flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy tasks from previous week
        </Button>
      )}

      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
          >
            <span className="handwritten text-xl">{task.description}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{task.frequency}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newTasks = [...tasks];
                  newTasks.splice(index, 1);
                  onTasksChange(newTasks);
                }}
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