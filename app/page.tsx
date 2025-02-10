"use client"

import { useState, useEffect } from 'react';
import { YearHeatmap } from '@/components/year-heatmap';
import { WeeklyTasks } from '@/components/weekly-tasks';
import { WeekHeader } from '@/components/week-header';
import { WeekRetrospective } from '@/components/week-retrospective';
import { SettingsMenu } from '@/components/settings-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChartBar,
  ListTodo,
  PlusCircle,
  ChevronUp} from 'lucide-react';
import html2canvas from 'html2canvas';
import { useWeeklyData } from '@/hooks/use-weekly-data';
import { getCurrentWeek, getWeekDateRange } from '@/lib/utils';
import { useWeekSettings } from '@/hooks/use-week-settings';

type FrequencyType = 'daily' | 'once' | 'twice' | 'thrice' | 'four' | 'five' | 'six' | 'alt';

interface WeekData {
  week: number;
  triptiIndex: number;
  positives: string[];
  negatives: string[];
  nextWeekPlans: {
    id: string;
    description: string;
    frequency: FrequencyType;
  }[];
}

export default function Home() {
  const { weekStartDay, updateWeekStartDay } = useWeekSettings();
  const currentWeek = getCurrentWeek(new Date(), weekStartDay);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [userName, setUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  
  const { weekData, isLoading, getWeekData, updateWeekData } = useWeeklyData();
  const currentWeekData = getWeekData(selectedWeek);

  // Load username from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('weeklyTrackerUser');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Save username to localStorage
  useEffect(() => {
    if (userName) {
      localStorage.setItem('weeklyTrackerUser', userName);
    }
  }, [userName]);

  const handleDownloadScreenshot = async () => {
    const element = document.getElementById('week-content');
    if (element) {
      element.querySelectorAll('.hide-in-screenshot').forEach(el => el.classList.add('hidden'));
      element.querySelectorAll('.screenshot-only').forEach(el => el.classList.remove('hidden'));
      element.classList.add('screenshot-mode');
      
      const header = document.createElement('div');
      header.className = 'screenshot-header';
      header.innerHTML = `
        <h2>Week ${selectedWeek} Summary ${userName ? `for ${userName}` : ''}</h2>
        <div class="date-range">${getWeekDateRange(selectedWeek, weekStartDay)}</div>
      `;
      element.insertBefore(header, element.firstChild);
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      element.querySelectorAll('.hide-in-screenshot').forEach(el => el.classList.remove('hidden'));
      element.querySelectorAll('.screenshot-only').forEach(el => el.classList.add('hidden'));
      element.classList.remove('screenshot-mode');
      header.remove();
      
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = data;
      link.download = `week-${selectedWeek}-summary.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold flex items-center">
            BetterU Tracker
            {isEditingName ? (
              <div className="flex items-center gap-2 ml-2">
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-[200px] text-lg"
                  placeholder="Enter your name"
                  autoFocus
                  onBlur={() => setIsEditingName(false)}
                  onKeyPress={(e) => e.key === 'Enter' && setIsEditingName(false)}
                />
              </div>
            ) : (
              userName && (
                <Button
                  variant="ghost"
                  className="text-lg font-normal ml-2 hover:bg-transparent"
                  onClick={() => setIsEditingName(true)}
                >
                  <span className="text-muted-foreground">for</span>
                  <span className="ml-1 text-primary">{userName}</span>
                </Button>
              )
            )}
            {!userName && !isEditingName && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => setIsEditingName(true)}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add your name
              </Button>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <SettingsMenu
            weekStartDay={weekStartDay}
            onWeekStartDayChange={updateWeekStartDay}
            onReset={() => {
              setUserName('');
              setSelectedWeek(currentWeek);
              setShowHeatmap(false);
              setIsEditingName(false);
            }}
          />
          <Button
            variant="outline"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="flex items-center gap-2"
          >
            <ChartBar className="h-4 w-4" />
            <span className="hidden sm:inline">
              {showHeatmap ? 'Hide Year Progress' : 'Show Year Progress'}
            </span>
          </Button>
        </div>
      </div>
      
      {showHeatmap && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-muted-foreground">Year Overview</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHeatmap(false)}
              className="text-muted-foreground"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
          <YearHeatmap
            data={weekData}
            onWeekSelect={setSelectedWeek}
            currentWeek={currentWeek}
            selectedWeek={selectedWeek}
            weekStartDay={weekStartDay}
          />
        </div>
      )}

      <WeekHeader
        selectedWeek={selectedWeek}
        currentWeek={currentWeek}
        onWeekChange={setSelectedWeek}
        onDownload={handleDownloadScreenshot}
        weekStartDay={weekStartDay}
      />

      <div id="week-content" className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <WeekRetrospective
            weekData={currentWeekData}
            currentWeek={currentWeek}
            onTriptiIndexChange={(value) => updateWeekData(selectedWeek, { triptiIndex: value })}
            onPositiveAdd={(text) => updateWeekData(selectedWeek, { 
              positives: [...currentWeekData.positives, text] 
            })}
            onPositiveRemove={(index) => {
              const newPositives = [...currentWeekData.positives];
              newPositives.splice(index, 1);
              updateWeekData(selectedWeek, { positives: newPositives });
            }}
            onNegativeAdd={(text) => updateWeekData(selectedWeek, { 
              negatives: [...currentWeekData.negatives, text] 
            })}
            onNegativeRemove={(index) => {
              const newNegatives = [...currentWeekData.negatives];
              newNegatives.splice(index, 1);
              updateWeekData(selectedWeek, { negatives: newNegatives });
            }}
            onTasksChange={(tasks) => updateWeekData(selectedWeek, { nextWeekPlans: tasks })}
            allWeekData={weekData}
            showTasksOnly={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <WeekRetrospective
              weekData={currentWeekData}
              currentWeek={currentWeek}
              onTriptiIndexChange={(value) => updateWeekData(selectedWeek, { triptiIndex: value })}
              onPositiveAdd={(text) => updateWeekData(selectedWeek, { 
                positives: [...currentWeekData.positives, text] 
              })}
              onPositiveRemove={(index) => {
                const newPositives = [...currentWeekData.positives];
                newPositives.splice(index, 1);
                updateWeekData(selectedWeek, { positives: newPositives });
              }}
              onNegativeAdd={(text) => updateWeekData(selectedWeek, { 
                negatives: [...currentWeekData.negatives, text] 
              })}
              onNegativeRemove={(index) => {
                const newNegatives = [...currentWeekData.negatives];
                newNegatives.splice(index, 1);
                updateWeekData(selectedWeek, { negatives: newNegatives });
              }}
              onTasksChange={(tasks) => updateWeekData(selectedWeek, { nextWeekPlans: tasks })}
              allWeekData={weekData}
              showTasksOnly={false}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Next Week Planning
              </h3>
              <WeeklyTasks
                tasks={currentWeekData.nextWeekPlans}
                onTasksChange={(tasks) => updateWeekData(selectedWeek, { nextWeekPlans: tasks })}
                previousWeekTasks={getWeekData(selectedWeek - 1).nextWeekPlans}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

