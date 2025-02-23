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
import { weeksToDays } from 'date-fns';

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
      try {
        // Wait for fonts to load
        await document.fonts.ready;

        // Create a new container for the screenshot
        const screenshotContainer = document.createElement('div');
        screenshotContainer.className = 'screenshot-mode';
        screenshotContainer.style.width = '1200px';
        screenshotContainer.style.backgroundColor = '#ffffff';
        screenshotContainer.style.position = 'relative'; // Ensure proper layout
        screenshotContainer.style.overflow = 'hidden'; // Prevent overflow issues

        // Create header
        const header = document.createElement('div');
        header.className = 'screenshot-header';
        header.innerHTML = `
          <h2 style="font-size: 2rem; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; white-space: normal;">${'Week ' + selectedWeek + ' Summary' + (userName ? ' for ' + userName : '')}</h2>
          <div style="font-size: 1.25rem; color: #64748b; white-space: normal;">${getWeekDateRange(selectedWeek, weekStartDay)}</div>
        `;
        screenshotContainer.appendChild(header);

        // Create content container with fixed width for consistency
        const screenshotContent = document.createElement('div');
        screenshotContent.className = 'space-y-8';
        screenshotContent.style.padding = '24px';
        screenshotContent.style.width = '1200px'; // Fixed width for consistent rendering

        // Add Tripti Index section
        const triptiHtml = `
          <div class="tripti-index" style="background: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
            <div class="section-title" style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <div style="font-size: 1.5rem; font-weight: 600; white-space: normal;">Tripti Index</div>
            </div>
            ${currentWeekData.triptiIndex > 0 ? `
              <div class="rating-display">
                <div class="stars" style="display: flex; gap: 12px; margin: 24px 0;">
                  ${Array.from({ length: 5 }, (_, i) => `
                    <div class="tripti-star" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"
                           fill="${i < currentWeekData.triptiIndex ? '#2563eb' : 'none'}" 
                           stroke="${i < currentWeekData.triptiIndex ? '#2563eb' : 'currentColor'}" 
                           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                  `).join('')}
                </div>
                <div class="rating-label" style="margin-top: 16px;">
                  <span class="value" style="font-size: 1.5rem; font-weight: 600; color: #2563eb;">${currentWeekData.triptiIndex}</span>
                  <span class="label" style="font-size: 1.25rem; color: #64748b; margin-left: 12px;">${getTriptiLabel(currentWeekData.triptiIndex)}</span>
                </div>
              </div>
            ` : `
              <div class="empty-state" style="text-align: center; padding: 32px; background: rgba(0,0,0,0.05); border-radius: 12px; margin-top: 16px;">
                <p style="color: #64748b; font-size: 1.25rem;">No rating provided for this week</p>
              </div>
            `}
          </div>
        `;
        screenshotContent.innerHTML += triptiHtml;

        // Add current week's tasks section
        const tasksHtml = `
          <div class="tasks-section" style="background: #f8fafc; padding: 12px; border-radius: 12px; margin-bottom: 32px;">
            <div class="section-title" style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                <path d="M3 7h18M3 12h18M3 17h18"/>
              </svg>
              <span style="font-size: 1.5rem; font-weight: 600; white-space: normal;">Tasks for This Week</span>
            </div>
            <div class="task-list" style="display: flex; flex-direction: column; gap: 16px;">
              ${currentWeekData.currentWeekTasks.length > 0 ?
          currentWeekData.currentWeekTasks.map(task => `
                  <div class="task-item" style="background: rgba(0,0,0,0.05); padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="task-content handwritten" style="font-size: 1.75rem; line-height: 1.5; flex: 1; margin-right: 24px;">${task.description}</div>
                    <div class="task-frequency" style="font-size: 1.125rem; color: #64748b; background: white; padding: 4px 16px; border-radius: 16px;  display: inline-flex; align-items: center;">${task.frequency}</div>
                  </div>
                `).join('') : `
                  <div class="empty-state" style="text-align: center; padding: 32px; background: rgba(0,0,0,0.05); border-radius: 12px;">
                    <p style="color: #64748b; font-size: 1.25rem;">No tasks planned for this week</p>
                  </div>
                `}
            </div>
          </div>
        `;
        screenshotContent.innerHTML += tasksHtml;

        // Add positives section
        const positivesHtml = `
          <div class="feedback-section" style="background: #f0fdf4; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
            <div class="section-title" style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
              <span style="font-size: 1.5rem; font-weight: 600; white-space: normal;">Positives</span>
            </div>
            ${currentWeekData.positives.length > 0 ?
          currentWeekData.positives.map(text => `
                <div class="feedback-item handwritten" style="background: rgba(34, 197, 94, 0.1); padding: 16px 24px; border-radius: 12px; margin-bottom: 16px;">
                  <div style="font-size: 1.75rem; line-height: 1.5; color: #166534; overflow-wrap: break-word; word-break: break-word;">${text}</div>
                </div>
              `).join('') : `
                <div class="empty-state" style="text-align: center; padding: 32px; background: rgba(34, 197, 94, 0.1); border-radius: 12px;">
                  <p style="color: #166534; font-size: 1.25rem;">No positives recorded for this week</p>
                </div>
              `}
          </div>
        `;
        screenshotContent.innerHTML += positivesHtml;

        // Add negatives section
        const negativesHtml = `
          <div class="feedback-section" style="background: #fef2f2; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
            <div class="section-title" style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
              </svg>
              <span style="font-size: 1.5rem; font-weight: 600; white-space: normal;">Areas for Improvement</span>
            </div>
            ${currentWeekData.negatives.length > 0 ?
          currentWeekData.negatives.map(text => `
                <div class="feedback-item handwritten" style="background: rgba(239, 68, 68, 0.1); padding: 16px 24px; border-radius: 12px; margin-bottom: 16px;">
                  <div style="font-size: 1.75rem; line-height: 1.5; color: #991b1b; overflow-wrap: break-word; word-break: break-word;">${text}</div>
                </div>
              `).join('') : `
                <div class="empty-state" style="text-align: center; padding: 32px; background: rgba(239, 68, 68, 0.1); border-radius: 12px;">
                  <p style="color: #991b1b; font-size: 1.25rem;">No areas for improvement recorded for this week</p>
                </div>
              `}
          </div>
        `;
        screenshotContent.innerHTML += negativesHtml;

        // Add next week's planned tasks section
        const nextWeekTasksHtml = `
          <div class="tasks-section" style="background: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
            <div class="section-title" style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
              <span style="font-size: 1.5rem; font-weight: 600; white-space: normal;">Next Week Planning</span>
            </div>
            <div class="task-list" style="display: flex; flex-direction: column; gap: 16px;">
              ${currentWeekData.nextWeekPlans.length > 0 ?
          currentWeekData.nextWeekPlans.map(task => `
                  <div class="task-item" style="background: rgba(0,0,0,0.05); padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="task-content handwritten" style="font-size: 1.75rem; line-height: 1.5; flex: 1; margin-right: 24px;">${task.description}</div>
                    <div class="task-frequency" style="font-size: 1.125rem; color: #64748b; background: white; padding: 8px 16px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; display: inline-block;">${task.frequency}</div>
                  </div>
                `).join('') : `
                  <div class="empty-state" style="text-align: center; padding: 32px; background: rgba(0,0,0,0.05); border-radius: 12px;">
                    <p style="color: #64748b; font-size: 1.25rem;">No tasks planned for next week yet</p>
                  </div>
                `}
            </div>
          </div>
        `;
        screenshotContent.innerHTML += nextWeekTasksHtml;

        // Add content to container
        screenshotContainer.appendChild(screenshotContent);

        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '1200px';
        tempContainer.style.height = 'auto';
        tempContainer.style.transform = 'none'; // Prevent transform issues
        tempContainer.style.webkitTransform = 'none'; // Safari specific
        document.body.appendChild(tempContainer);
        tempContainer.appendChild(screenshotContainer);

        // Force layout calculation
        tempContainer.getBoundingClientRect();
        screenshotContainer.getBoundingClientRect();

        // Wait for fonts and layout
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get pixel ratio for retina displays
        const pixelRatio = window.devicePixelRatio || 1;

        // Capture the screenshot with improved configuration
        const canvas = await html2canvas(screenshotContainer, {
          scale: pixelRatio * 2, // Account for retina displays
          useCORS: true,
          logging: true,
          backgroundColor: '#ffffff',
          allowTaint: true,
          removeContainer: false,
          width: 1200,
          height: screenshotContainer.offsetHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 1200,
          windowHeight: screenshotContainer.offsetHeight,
          foreignObjectRendering: false, // Disable for better Safari support
          onclone: (clonedDoc) => {
            // Add font to cloned document
            const style = clonedDoc.createElement('style');
            style.textContent = `
              @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');
              .handwritten {
                font-family: 'Caveat Variable', cursive !important;
                font-size: 1.75rem !important;
                line-height: 1.5 !important;
              }
            `;
            clonedDoc.head.appendChild(style);

            // Force all SVGs to render properly
            const svgs = clonedDoc.getElementsByTagName('svg');
            Array.from(svgs).forEach(svg => {
              svg.setAttribute('width', svg.getAttribute('width') || '24');
              svg.setAttribute('height', svg.getAttribute('height') || '24');
              svg.style.minWidth = '24px';
              svg.style.minHeight = '24px';
            });

            // Force immediate font loading
            return document.fonts.ready;
          }
        });

        // Create a new canvas with exact dimensions
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = canvas.width;
        finalCanvas.height = canvas.height;
        const ctx = finalCanvas.getContext('2d');

        if (ctx) {
          // Enable font smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw with white background first
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

          // Draw the captured content
          ctx.drawImage(canvas, 0, 0);
        }

        // Download with maximum quality
        const data = finalCanvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = data;
        link.download = `weekly-reflection-${userName.replace(/ /g, '-').replace(/--+/g, '-')}-${getWeekDateRange(selectedWeek, weekStartDay).replace(/ /g, '-').replace(/--+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } catch (error) {
        console.error('Screenshot error:', error);
        alert('There was an error generating the screenshot. Please try again.');
      } finally {
        // Cleanup
        const tempContainer = document.querySelector('[style*="position: absolute"]');
        if (tempContainer) {
          document.body.removeChild(tempContainer);
        }
      }
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

