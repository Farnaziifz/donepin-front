/**
 * Analytics page - Task statistics and insights
 */

import { useAnalytics } from '../../lib/hooks/queries/use-analytics'
import { Skeleton } from '../../components/ui/skeleton'
import { Badge } from '../../components/ui/badge'

export function AnalyticsPage() {
  const { data: analytics, isLoading, error } = useAnalytics()

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          Failed to load analytics. Please try again.
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">Insights into your task management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
          <p className="text-2xl font-bold text-foreground">{analytics.totalTasks}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{analytics.completedTasks}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground mb-1">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{analytics.inProgressTasks}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground mb-1">Completed Today</p>
          <p className="text-2xl font-bold text-foreground">{analytics.tasksCompletedToday}</p>
        </div>
      </div>

      {/* Tasks by Status */}
      <div className="rounded-lg border border-border bg-background p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Tasks by Status</h2>
        <div className="space-y-3">
          {Object.entries(analytics.tasksByStatus).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-sm text-foreground capitalize">{status.replace('-', ' ')}</span>
              <Badge variant="outline">{count}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks by Priority */}
      <div className="rounded-lg border border-border bg-background p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Tasks by Priority</h2>
        <div className="space-y-3">
          {Object.entries(analytics.tasksByPriority).map(([priority, count]) => (
            <div key={priority} className="flex items-center justify-between">
              <span className="text-sm text-foreground capitalize">{priority}</span>
              <Badge variant="outline">{count}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks by Tag */}
      {analytics.tasksByTag.length > 0 && (
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Tasks by Tag</h2>
          <div className="space-y-3">
            {analytics.tasksByTag.map(({ tag, count }) => (
              <div key={tag.id} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{tag.name}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

