/**
 * Task detail page
 */

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTask, useDeleteTask, useUpdateTask } from '../../lib/hooks/queries'
import { useToast } from '../../lib/hooks'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tag } from '../../components/ui/tag'
import { Skeleton } from '../../components/ui/skeleton'
import { Input } from '../../components/ui/input'
import { formatDateTime, formatRelativeTime } from '../../lib/utils/format'
import type { TaskDetail } from '../../lib/types'

// Map API status to display label
const getStatusLabel = (status: TaskDetail['status']): string => {
  switch (status) {
    case 'TODO':
      return 'To Do'
    case 'IN_PROGRESS':
      return 'In Progress'
    case 'BLOCKED':
      return 'Blocked'
    case 'DONE':
      return 'Done'
    default:
      return status
  }
}

// Map API status to badge variant
const getStatusVariant = (status: TaskDetail['status']): 'default' | 'outline' | 'error' | 'info' | 'warning' | 'success' => {
  switch (status) {
    case 'TODO':
      return 'outline'
    case 'IN_PROGRESS':
      return 'default'
    case 'BLOCKED':
      return 'error'
    case 'DONE':
      return 'success'
    default:
      return 'outline'
  }
}

// Get event type label
const getEventTypeLabel = (type: string): string => {
  switch (type) {
    case 'StatusChanged':
      return 'Status Changed'
    case 'TaskCreated':
      return 'Task Created'
    default:
      return type
  }
}

export function TaskPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: task, isLoading, error } = useTask(id!)
  const deleteTask = useDeleteTask()
  const updateTask = useUpdateTask()
  const toast = useToast()
  const [isEditingDueDate, setIsEditingDueDate] = useState(false)
  const [dueDateValue, setDueDateValue] = useState('')

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

  const handleEditDueDate = () => {
    if (!task) return
    // Convert ISO date to datetime-local format (YYYY-MM-DDTHH:mm)
    if (task.dueDate) {
      const date = new Date(task.dueDate)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      setDueDateValue(`${year}-${month}-${day}T${hours}:${minutes}`)
    } else {
      setDueDateValue('')
    }
    setIsEditingDueDate(true)
  }

  const handleSaveDueDate = async () => {
    if (!task || !id) return

    try {
      const dueDate = dueDateValue ? new Date(dueDateValue).toISOString() : undefined
      await updateTask.mutateAsync({
        id,
        data: { dueDate },
      })
      setIsEditingDueDate(false)
      toast.success('Due date updated successfully')
    } catch (err) {
      toast.error('Failed to update due date', (err as Error).message)
    }
  }

  const handleCancelDueDate = () => {
    setIsEditingDueDate(false)
    setDueDateValue('')
  }

  const handleRemoveDueDate = async () => {
    if (!task || !id) return

    try {
      await updateTask.mutateAsync({
        id,
        data: { dueDate: undefined },
      })
      setIsEditingDueDate(false)
      toast.success('Due date removed')
    } catch (err) {
      toast.error('Failed to remove due date', (err as Error).message)
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
          {task.priority && (
            <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
          )}
          <Badge variant={getStatusVariant(task.status)}>{getStatusLabel(task.status)}</Badge>
          {task.project && (
            <Badge variant="outline">📁 {task.project.name}</Badge>
          )}
        </div>
      </div>

      {task.blockerReason && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:bg-red-900/30 dark:border-red-800">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">⚠️ Blocked</h3>
          <p className="text-sm text-red-700 dark:text-red-400">{task.blockerReason}</p>
        </div>
      )}

      {task.description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Description</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
        </div>
      )}

      {task.note && (
        <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">📝 Original Note</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{task.note.content}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Created {formatRelativeTime(task.note.createdAt)}
          </p>
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

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Due Date</h3>
            {!isEditingDueDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditDueDate}
                disabled={updateTask.isPending}
              >
                {task.dueDate ? 'Edit' : 'Set Due Date'}
              </Button>
            )}
          </div>
          {isEditingDueDate ? (
            <div className="space-y-2">
              <Input
                type="datetime-local"
                value={dueDateValue}
                onChange={(e) => setDueDateValue(e.target.value)}
                disabled={updateTask.isPending}
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveDueDate}
                  disabled={updateTask.isPending}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelDueDate}
                  disabled={updateTask.isPending}
                >
                  Cancel
                </Button>
                {task.dueDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveDueDate}
                    disabled={updateTask.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {task.dueDate ? formatDateTime(task.dueDate) : 'No due date set'}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Created</h3>
          <p className="text-muted-foreground">{formatDateTime(task.createdAt)}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Last Updated</h3>
          <p className="text-muted-foreground">{formatDateTime(task.updatedAt)}</p>
        </div>
      </div>

      {task.events.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Activity History</h2>
          <div className="space-y-3">
            {task.events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {getEventTypeLabel(event.type)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(event.createdAt)}
                    </span>
                  </div>
                  {event.type === 'StatusChanged' && 'payload' in event && typeof event.payload === 'object' && event.payload !== null && 'oldStatus' in event.payload && 'newStatus' in event.payload && (
                    <p className="text-sm text-muted-foreground">
                      {getStatusLabel(event.payload.oldStatus as TaskDetail['status'])} → {getStatusLabel(event.payload.newStatus as TaskDetail['status'])}
                    </p>
                  )}
                  {event.type === 'TaskCreated' && 'payload' in event && typeof event.payload === 'object' && event.payload !== null && 'title' in event.payload && (
                    <p className="text-sm text-muted-foreground">
                      Task "{event.payload.title as string}" was created
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button variant="destructive" onClick={handleDelete} disabled={deleteTask.isPending}>
          {deleteTask.isPending ? 'Deleting...' : 'Delete Task'}
        </Button>
      </div>
    </div>
  )
}


