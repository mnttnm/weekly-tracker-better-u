import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'once', label: 'Once a week' },
  { value: 'twice', label: 'Twice a week' },
  { value: 'thrice', label: 'Three times a week' },
  { value: 'four', label: 'Four times a week' },
  { value: 'five', label: 'Five times a week' },
  { value: 'six', label: 'Six times a week' },
  { value: 'alt', label: 'Alternate days' },
] as const;

export type FrequencyType = typeof FREQUENCY_OPTIONS[number]['value'];

interface TaskInputGroupProps {
  newTask: string;
  frequency: FrequencyType;
  onTaskChange: (value: string) => void;
  onFrequencyChange: (value: FrequencyType) => void;
  onSubmit: () => void;
}

export function TaskInputGroup({
  newTask,
  frequency,
  onTaskChange,
  onFrequencyChange,
  onSubmit,
}: TaskInputGroupProps) {
  return (
    <Card className="p-4 space-y-4">
      <Input
        placeholder="Add a new task..."
        value={newTask}
        onChange={(e) => onTaskChange(e.target.value)}
        className="handwritten text-lg sm:text-2xl w-full"
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
      />
      <Select
        value={frequency}
        onValueChange={onFrequencyChange}
      >
        <SelectTrigger className="w-full">
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
      <Button onClick={onSubmit} className="w-full">
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Task
      </Button>
    </Card>
  );
} 