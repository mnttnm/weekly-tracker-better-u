'use client';

import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

// Define task type
export interface Task {
  id: string;
  description: string;
  frequency: 'daily' | 'once' | 'twice' | 'thrice' | 'four' | 'five' | 'six' | 'alt';
}

interface TaskItemProps {
  task: Task;
  removable: boolean;
  onRemove: (id: string) => void;
}

export function TaskItem({ task, removable, onRemove }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-md group gap-2">
      <span className="handwritten text-base sm:text-2xl line-clamp-2">{task.description}</span>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="secondary">{task.frequency}</Badge>
        {removable && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 hidden sm:flex"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(task.id)}
              className="sm:hidden flex text-muted-foreground/70 hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
} 