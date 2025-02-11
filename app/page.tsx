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
import { getCurrentWeek, getWeekDateRange, type WeekStartDay } from '@/lib/utils';
import { useWeekSettings } from '@/hooks/use-week-settings';
import { WelcomeDialog } from '@/components/welcome-dialog';

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

export default function Home() {
  const { weekStartDay, updateWeekStartDay } = useWeekSettings();
  const currentWeek = getCurrentWeek(new Date(), weekStartDay);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [userName, setUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  const { weekData, isLoading, getWeekData, updateWeekData } = useWeeklyData();
  const currentWeekData = getWeekData(selectedWeek);

  // Load username and first visit status from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('weeklyTrackerUser');
    const hasVisited = localStorage.getItem('weeklyTrackerHasVisited');

    if (savedName) {
      setUserName(savedName);
    }

    if (hasVisited) {
      setIsFirstVisit(false);
    }
  }, []);

  // Save username to localStorage
  useEffect(() => {
    if (userName) {
      localStorage.setItem('weeklyTrackerUser', userName);
    }
  }, [userName]);

  const handleWelcomeComplete = (name: string, startDay: WeekStartDay) => {
    setUserName(name);
    updateWeekStartDay(startDay);
    setIsFirstVisit(false);
    localStorage.setItem('weeklyTrackerHasVisited', 'true');
  };

  const handleDownloadScreenshot = async () => {
    const element = document.getElementById('week-content');
    if (element) {
      // Create a new container for the screenshot
      const screenshotContainer = document.createElement('div');
      screenshotContainer.className = 'screenshot-mode';
      
      // Create header
      const header = document.createElement('div');
      header.className = 'screenshot-header';
      header.innerHTML = `
        <h2>Week ${selectedWeek} Summary ${userName ? `for ${userName}` : ''}</h2>
        <div class="date-range">${getWeekDateRange(selectedWeek, weekStartDay)}</div>
      `;
      screenshotContainer.appendChild(header);

      // Create content container
      const screenshotContent = document.createElement('div');
      screenshotContent.className = 'space-y-8';

      // Add Tripti Index section
      const triptiHtml = `
        <div class="tripti-index">
          <div class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Tripti Index
          </div>
          ${currentWeekData.triptiIndex > 0 ? `
            <div class="rating-display">
              <div class="stars">
                ${Array.from({ length: 5 }, (_, i) => `
                  <div class="tripti-star ${i < currentWeekData.triptiIndex ? 'filled' : ''}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                `).join('')}
              </div>
              <div class="rating-label">
                <span class="value">${currentWeekData.triptiIndex}</span>
                <span class="label">${getTriptiLabel(currentWeekData.triptiIndex)}</span>
              </div>
            </div>
          ` : `
            <div class="empty-state">
              <p>No rating provided for this week</p>
            </div>
          `}
        </div>
      `;
      screenshotContent.innerHTML += triptiHtml;

      // Add current week's tasks section
      const tasksHtml = `
        <div class="tasks-section">
          <div class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7h18M3 12h18M3 17h18"/>
            </svg>
            Tasks for This Week
          </div>
          <div class="task-list">
            ${currentWeekData.currentWeekTasks.length > 0 ?
          currentWeekData.currentWeekTasks.map(task => `
                <div class="task-item">
                  <div class="task-content handwritten">${task.description}</div>
                  <div class="task-frequency">${task.frequency}</div>
                </div>
              `).join('') : `
                <div class="empty-state">
                  <p>No tasks planned for this week</p>
                </div>
              `}
          </div>
        </div>
      `;
      screenshotContent.innerHTML += tasksHtml;

      // Add positives section
      const positivesHtml = `
        <div class="feedback-section">
          <div class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            Positives
          </div>
          ${currentWeekData.positives.length > 0 ?
          currentWeekData.positives.map(text => `
              <div class="feedback-item handwritten">${text}</div>
            `).join('') : `
              <div class="empty-state">
                <p>No positives recorded for this week</p>
              </div>
            `}
        </div>
      `;
      screenshotContent.innerHTML += positivesHtml;

      // Add negatives section
      const negativesHtml = `
        <div class="feedback-section">
          <div class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
            </svg>
            Areas for Improvement
          </div>
          ${currentWeekData.negatives.length > 0 ?
          currentWeekData.negatives.map(text => `
              <div class="feedback-item handwritten">${text}</div>
            `).join('') : `
              <div class="empty-state">
                <p>No areas for improvement recorded for this week</p>
              </div>
            `}
        </div>
      `;
      screenshotContent.innerHTML += negativesHtml;

      // Add next week's planned tasks section
      const nextWeekTasksHtml = `
        <div class="tasks-section">
          <div class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
              <line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
            Next Week Planning
          </div>
          <div class="task-list">
            ${currentWeekData.nextWeekPlans.length > 0 ?
          currentWeekData.nextWeekPlans.map(task => `
                <div class="task-item">
                  <div class="task-content handwritten">${task.description}</div>
                  <div class="task-frequency">${task.frequency}</div>
                </div>
              `).join('') : `
                <div class="empty-state">
                  <p>No tasks planned for next week yet</p>
                </div>
              `}
          </div>
        </div>
      `;
      screenshotContent.innerHTML += nextWeekTasksHtml;

      // Add content to container
      screenshotContainer.appendChild(screenshotContent);

      // Save original content and replace with screenshot content
      const originalContent = element.innerHTML;
      element.innerHTML = '';
      element.appendChild(screenshotContainer);

      // Capture the screenshot
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Restore original content
      element.innerHTML = originalContent;
      
      // Download the image
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
    <main className="min-h-screen flex flex-col">
      {isFirstVisit && (
        <WelcomeDialog onComplete={handleWelcomeComplete} />
      )}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center justify-between w-full gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  BetterU Tracker
                </h1>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
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
                      className="text-lg font-normal hover:bg-transparent px-0 sm:px-3"
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
                    className="px-0 sm:px-3"
                    onClick={() => setIsEditingName(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add your name
                  </Button>
                )}
              </div>
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
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 pt-[88px] pb-6">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-6">
          <Button
            variant="outline"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <ChartBar className="h-4 w-4" />
            {showHeatmap ? 'Hide Year Progress' : 'Show Year Progress'}
          </Button>

          {showHeatmap && (
            <div className="-mx-4 sm:mx-0 px-2 sm:px-0 overflow-x-auto">
              <div className="flex items-center justify-between mb-4 px-2">
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
              <div className="min-w-[800px]">
                <YearHeatmap
                  data={weekData}
                  onWeekSelect={setSelectedWeek}
                  currentWeek={currentWeek}
                  selectedWeek={selectedWeek}
                  weekStartDay={weekStartDay}
                />
              </div>
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
            <div className="bg-white p-6 rounded-lg shadow-sm w-full">
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
                onCurrentWeekTasksChange={(tasks) => updateWeekData(selectedWeek, { currentWeekTasks: tasks })}
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
                  onCurrentWeekTasksChange={(tasks) => updateWeekData(selectedWeek, { currentWeekTasks: tasks })}
                  allWeekData={weekData}
                  showTasksOnly={false}
                  showJumpToCurrentWeek={true}
                  onJumpToCurrentWeek={() => setSelectedWeek(currentWeek)}
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
                    currentWeekTasks={currentWeekData.currentWeekTasks}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto py-6 text-center text-sm text-muted-foreground border-t">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          Made by <a href="https://www.mohittater.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mohit Tater</a> for BetterU community
        </div>
      </footer>
    </main>
  );
}

