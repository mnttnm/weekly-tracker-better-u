'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WEEK_DAYS, type WeekStartDay } from '@/lib/utils';
import { ListTodo, Calendar, Camera, ChartBar } from 'lucide-react';

interface WelcomeDialogProps {
  onComplete: (name: string, weekStartDay: WeekStartDay) => void;
}

export function WelcomeDialog({ onComplete }: WelcomeDialogProps) {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('');
  const [weekStartDay, setWeekStartDay] = useState<WeekStartDay>(1); // Default to Monday
  const [step, setStep] = useState(1);

  const handleComplete = () => {
    onComplete(name, weekStartDay);
    setOpen(false);
  };

  const features = [
    {
      icon: ListTodo,
      title: 'Task Tracking',
      description: 'Plan and track your weekly tasks with customizable frequency',
    },
    {
      icon: Calendar,
      title: 'Weekly Retrospectives',
      description: 'Reflect on your week with positives, negatives, and satisfaction rating',
    },
    {
      icon: Camera,
      title: 'Share Progress',
      description: 'Take screenshots of your weekly summaries to share with the community',
    },
    {
      icon: ChartBar,
      title: 'Progress Visualization',
      description: 'View your progress over time with an interactive year heatmap',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Welcome to BetterU Tracker! 👋</DialogTitle>
              <DialogDescription className="pt-4">
                Your personal weekly planning and reflection companion. Here's what you can do:
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium leading-none mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => setStep(2)}>Let's Get Started</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Quick Setup</DialogTitle>
              <DialogDescription>
                Let's personalize your experience. You can always change these settings later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Week Starts On</label>
                <Select
                  value={weekStartDay.toString()}
                  onValueChange={(value) => setWeekStartDay(parseInt(value) as WeekStartDay)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEK_DAYS.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose which day your week starts on. This affects how weeks are calculated.
                </p>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleComplete} disabled={!name.trim()}>
                Start Tracking
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 