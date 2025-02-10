export interface WeeklyData {
  id: string
  weekNumber: number
  year: number
  positives: string[]
  negatives: string[]
  nextWeekPlans: string[]
  triptiIndex: number
  tasks: DailyTasks
}

export interface DailyTasks {
  monday: Task[]
  tuesday: Task[]
  wednesday: Task[]
  thursday: Task[]
  friday: Task[]
  saturday: Task[]
  sunday: Task[]
}

export interface Task {
  id: string
  content: string
  completed: boolean
}

