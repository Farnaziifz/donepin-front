/**
 * Today page - Ultra-compact actions for 2-10 minute tasks
 */

import { useTasks } from '../../lib/hooks/queries'
import { TaskCardCompact } from './components/task-card-compact'
import { EmptyState } from '../../components/ui/empty-state'
import { Skeleton } from '../../components/ui/skeleton'
import type { Task } from '../../lib/types'

export function TodayPage() {
  const { data: tasks, isLoading, error } = useTasks()

  // React Compiler will automatically memoize this computation
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayTasks = tasks?.filter((task: Task) => {
    // Show tasks that are not done and not snoozed
    if (task.status === 'done') return false
    if (task.snoozedUntil) {
      const snoozeDate = new Date(task.snoozedUntil)
      if (snoozeDate > today) return false
    }

    // Show tasks due today or with no due date
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() === today.getTime()
    }

    // Show tasks in inbox, todo, or in-progress
    return ['inbox', 'todo', 'in-progress'].includes(task.status)
  }) ?? []

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          Failed to load tasks. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Today</h1>
        <p className="text-muted-foreground">Focus on quick actions (2-10 minutes)</p>
      </div>

      <div className="space-y-3">
        {todayTasks.length > 0 ? (
          todayTasks.map((task: Task) => <TaskCardCompact key={task.id} task={task} />)
        ) : (
          <EmptyState
            icon="✨"
            title="All caught up!"
            description="No tasks for today. Enjoy your free time!"
          />
        )}
      </div>
    </div>
  )
}

