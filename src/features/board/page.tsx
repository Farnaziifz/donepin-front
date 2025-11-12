/**
 * Board page - Kanban view with drag & drop
 */

import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useMemo } from 'react'
import { useTasks, useUpdateTask, useToast } from '../../lib/hooks'
import { KanbanColumn } from './components/kanban-column'
import { Skeleton } from '../../components/ui/skeleton'
import type { Task, TaskStatus } from '../../lib/types'

const columns: Array<{ status: TaskStatus; title: string }> = [
  { status: 'inbox', title: 'Inbox' },
  { status: 'todo', title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
]

export function BoardPage() {
  const { data: tasks, isLoading, error } = useTasks()
  const updateTask = useUpdateTask()
  const toast = useToast()

  const tasksByStatus = useMemo(() => {
    if (!tasks) return {} as Record<TaskStatus, Task[]>
    return tasks.reduce(
      (acc: Record<TaskStatus, Task[]>, task) => {
        if (!acc[task.status]) {
          acc[task.status] = []
        }
        acc[task.status].push(task)
        return acc
      },
      {} as Record<TaskStatus, Task[]>
    )
  }, [tasks])

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const taskId = result.draggableId
    const newStatus = result.destination.droppableId as TaskStatus

    // Find the task
    const task = tasks?.find((t: { id: string }) => t.id === taskId)
    if (!task || task.status === newStatus) return

    try {
      await updateTask.mutateAsync({
        id: taskId,
        data: { status: newStatus },
      })
      toast.success('Task moved successfully')
    } catch (err) {
      toast.error('Failed to move task', (err as Error).message)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1">
              <Skeleton className="h-96" />
            </div>
          ))}
        </div>
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
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Board</h1>
        <p className="text-muted-foreground">Drag and drop tasks to change their status</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.status}
              status={column.status}
              title={column.title}
              tasks={tasksByStatus[column.status] || []}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

