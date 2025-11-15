/**
 * Ultra-compact task card for Today view
 */

import { Link } from 'react-router-dom'
import type { Task } from '../../../lib/types'
import { Badge } from '../../../components/ui/badge'
import { Tag } from '../../../components/ui/tag'
import { formatDuration } from '../../../lib/utils/format'
import { useUpdateTask } from '../../../lib/hooks/queries'
import { useToast } from '../../../lib/hooks'
import { cn } from '../../../lib/utils/cn'

interface TaskCardCompactProps {
  task: Task
}

export function TaskCardCompact({ task }: TaskCardCompactProps) {
  const updateTask = useUpdateTask()
  const toast = useToast()

  const handleSnooze = async () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)

    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: { snoozedUntil: tomorrow.toISOString() },
      })
      toast.success('Task snoozed until tomorrow')
    } catch (err) {
      toast.error('Failed to snooze task', (err as Error).message)
    }
  }

  const handleComplete = async () => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: { status: 'done' },
      })
      toast.success('Task completed')
    } catch (err) {
      toast.error('Failed to complete task', (err as Error).message)
    }
  }

  const priorityColors: Record<'LOW' | 'MEDIUM' | 'HIGH', 'info' | 'warning' | 'error'> = {
    LOW: 'info',
    MEDIUM: 'warning',
    HIGH: 'error',
  }

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:shadow-md transition-all">
      <input
        type="checkbox"
        checked={task.status === 'done'}
        onChange={handleComplete}
        className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
        aria-label={`Mark ${task.title} as complete`}
      />

      <Link to={`/tasks/${task.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3
            className={cn(
              'text-sm font-medium truncate',
              task.status === 'done' && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </h3>
          <Badge variant={priorityColors[task.priority]} size="sm">
            {task.priority}
          </Badge>
        </div>

        {task.estimatedMinutes && (
          <p className="text-xs text-muted-foreground mb-1">
            ⏱ {formatDuration(task.estimatedMinutes)}
          </p>
        )}

        {task.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {task.tags.map((tag) => (
              <Tag key={tag.id} color={tag.color} size="sm">
                {tag.name}
              </Tag>
            ))}
          </div>
        )}
      </Link>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={handleSnooze}
          className="p-1.5 rounded hover:bg-muted"
          aria-label="Snooze task"
          title="Snooze until tomorrow"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

