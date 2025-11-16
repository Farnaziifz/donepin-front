/**
 * Board page - Kanban view with drag & drop
 */

import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useMemo } from 'react'
import { useTasks, useUpdateTaskStatus, useToast } from '../../lib/hooks'
import { KanbanColumn } from './components/kanban-column'
import { Skeleton } from '../../components/ui/skeleton'
import type { Task, TaskStatus, TasksBoardResponse, BoardTask } from '../../lib/types'

const columns: Array<{ status: TaskStatus; title: string; apiKey: keyof TasksBoardResponse }> = [
  { status: 'todo', title: 'To Do', apiKey: 'TODO' },
  { status: 'in-progress', title: 'In Progress', apiKey: 'IN_PROGRESS' },
  { status: 'blocked', title: 'Blocked', apiKey: 'BLOCKED' },
  { status: 'done', title: 'Done', apiKey: 'DONE' },
]

// Map API status to internal status
const mapApiStatusToInternal = (apiStatus: BoardTask['status']): TaskStatus => {
  switch (apiStatus) {
    case 'TODO':
      return 'todo'
    case 'IN_PROGRESS':
      return 'in-progress'
    case 'BLOCKED':
      return 'blocked'
    case 'DONE':
      return 'done'
    default:
      return 'todo'
  }
}

// Map internal status to API status
const mapInternalStatusToApi = (status: TaskStatus): BoardTask['status'] => {
  switch (status) {
    case 'todo':
    case 'inbox':
      return 'TODO'
    case 'in-progress':
      return 'IN_PROGRESS'
    case 'blocked':
      return 'BLOCKED'
    case 'done':
      return 'DONE'
    default:
      return 'TODO'
  }
}

// Convert BoardTask to Task
const convertBoardTaskToTask = (boardTask: BoardTask): Task => {
  return {
    id: boardTask.id,
    title: boardTask.title,
    description: boardTask.description || undefined,
    status: mapApiStatusToInternal(boardTask.status),
    priority: boardTask.priority || 'MEDIUM',
    tags: [], // API doesn't return tags in board response
    assignees: [], // API doesn't return assignees in board response
    dueDate: boardTask.dueDate || undefined,
    createdAt: boardTask.createdAt,
    updatedAt: boardTask.updatedAt,
    noteId: boardTask.noteId || undefined,
  }
}

export function BoardPage() {
  const { data: boardData, isLoading, error } = useTasks()
  const updateTaskStatus = useUpdateTaskStatus()
  const toast = useToast()

  const tasksByStatus = useMemo(() => {
    if (!boardData) return {} as Record<TaskStatus, Task[]>
    
    const result: Record<TaskStatus, Task[]> = {
      todo: [],
      'in-progress': [],
      blocked: [],
      done: [],
      inbox: [],
    }

    // Convert board data to tasks grouped by status
    columns.forEach((column) => {
      const boardTasks = boardData[column.apiKey] || []
      result[column.status] = boardTasks.map(convertBoardTaskToTask)
    })

    return result
  }, [boardData])

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !boardData) return

    const taskId = result.draggableId
    const newStatus = result.destination.droppableId as TaskStatus
    const apiStatus = mapInternalStatusToApi(newStatus)

    // Find the task in board data
    let foundTask: BoardTask | undefined
    for (const key of ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'] as const) {
      foundTask = boardData[key]?.find((t) => t.id === taskId)
      if (foundTask) break
    }

    if (!foundTask || foundTask.status === apiStatus) return

    try {
      await updateTaskStatus.mutateAsync({
        id: taskId,
        status: apiStatus,
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

