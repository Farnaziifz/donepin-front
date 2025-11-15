/**
 * Task detail page
 */

import { useParams, useNavigate } from 'react-router-dom'
import { useTask, useDeleteTask } from '../../lib/hooks/queries'
import { useToast } from '../../lib/hooks'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tag } from '../../components/ui/tag'
import { Skeleton } from '../../components/ui/skeleton'
import { formatDate, formatDuration } from '../../lib/utils/format'
import { TASK_STATUSES } from '../../lib/utils/constants'

export function TaskPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: task, isLoading, error } = useTask(id!)
  const deleteTask = useDeleteTask()
  const toast = useToast()

  const handleDelete = async () => {
    if (!task || !confirm('Are you sure you want to delete this task?')) return

    try {
      await deleteTask.mutateAsync(task.id)
      toast.success('Task deleted')
      navigate('/board')
    } catch (err) {
      toast.error('Failed to delete task', (err as Error).message)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-32 mb-4" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          Task not found or failed to load.
        </div>
        <Button onClick={() => navigate('/board')} className="mt-4">
          Back to Board
        </Button>
      </div>
    )
  }

  const priorityColors: Record<'LOW' | 'MEDIUM' | 'HIGH', 'info' | 'warning' | 'error'> = {
    LOW: 'info',
    MEDIUM: 'warning',
    HIGH: 'error',
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-4">{task.title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
          <Badge variant="outline">{TASK_STATUSES.find((s) => s.value === task.status)?.label}</Badge>
          {task.estimatedMinutes && (
            <Badge variant="outline">⏱ {formatDuration(task.estimatedMinutes)}</Badge>
          )}
        </div>
      </div>

      {task.description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Description</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {task.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Tags</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {task.tags.map((tag) => (
                <Tag key={tag.id} color={tag.color}>
                  {tag.name}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {task.assignees.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Assignees</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {task.assignees.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted"
                >
                  <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-800 dark:text-primary-300">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-foreground">{person.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {task.dueDate && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Due Date</h3>
            <p className="text-muted-foreground">{formatDate(task.dueDate)}</p>
          </div>
        )}

        {task.snoozedUntil && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Snoozed Until</h3>
            <p className="text-muted-foreground">{formatDate(task.snoozedUntil)}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="destructive" onClick={handleDelete} disabled={deleteTask.isPending}>
          {deleteTask.isPending ? 'Deleting...' : 'Delete Task'}
        </Button>
      </div>
    </div>
  )
}

