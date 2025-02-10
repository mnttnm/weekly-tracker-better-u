import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, AlertTriangle } from 'lucide-react';
import { WEEK_DAYS, type WeekStartDay } from '@/lib/utils';

interface SettingsMenuProps {
  weekStartDay: WeekStartDay;
  onWeekStartDayChange: (day: WeekStartDay) => void;
  onReset?: () => void;
}

export function SettingsMenu({ weekStartDay, onWeekStartDayChange, onReset }: SettingsMenuProps) {
  const handleReset = () => {
    if (typeof window !== 'undefined') {
      // Clear all app data from localStorage
      localStorage.removeItem('weeklyTrackerData');
      localStorage.removeItem('weeklyTrackerUser');
      // Keep the week start day setting
      if (onReset) onReset();
      // Reload the page to reset all state
      window.location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted/30">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your tracking preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Week Starts On</label>
            <Select
              value={weekStartDay.toString()}
              onValueChange={(value) => onWeekStartDayChange(parseInt(value) as WeekStartDay)}
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
              Choose which day your week starts on. This will affect how weeks are calculated in the tracker.
            </p>
          </div>

          <div className="border-t pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reset All Progress
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your tracking data,
                    including all tasks, ratings, and notes. Your week start day preference will be kept.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 