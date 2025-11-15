/**
 * React Query hooks for Tasks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api'
import { QUERY_KEYS } from '../../utils/constants'
import type { CreateTaskRequest, UpdateTaskRequest, BoardTask, TasksBoardResponse, TaskStatus } from '../../types'

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

export function useTasks() {
  return useQuery({
    queryKey: QUERY_KEYS.tasks,
    queryFn: () => api.getTasks(),
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.task(id),
    queryFn: () => api.getTask(id),
    enabled: !!id,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => api.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      api.updateTask(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.task(id) })
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks })

      // Snapshot previous value
      const previousTask = queryClient.getQueryData(QUERY_KEYS.task(id))
      const previousTasks = queryClient.getQueryData(QUERY_KEYS.tasks)

      // Optimistically update
      queryClient.setQueryData(QUERY_KEYS.task(id), (old: unknown) => {
        if (!old) return old
        return { ...(old as object), ...data, updatedAt: new Date().toISOString() }
      })

      queryClient.setQueryData(QUERY_KEYS.tasks, (old: unknown) => {
        if (!old || typeof old !== 'object') return old
        const boardData = { ...(old as TasksBoardResponse) }
        
        // Convert status to API format if present and build update data
        const updateData: Partial<BoardTask> = {}
        if (data.title !== undefined) updateData.title = data.title
        if (data.description !== undefined) updateData.description = data.description ?? null
        if (data.status !== undefined) updateData.status = mapInternalStatusToApi(data.status)
        if (data.priority !== undefined) updateData.priority = data.priority ?? null
        if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ?? null
        
        // Update task in the appropriate status array
        const statusKeys: Array<keyof TasksBoardResponse> = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE']
        for (const key of statusKeys) {
          if (Array.isArray(boardData[key])) {
            boardData[key] = boardData[key].map((task: BoardTask) =>
              task.id === id
                ? { ...task, ...updateData, updatedAt: new Date().toISOString() }
                : task
            )
          }
        }
        
        return boardData
      })

      return { previousTask, previousTasks }
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(QUERY_KEYS.task(_variables.id), context.previousTask)
      }
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.tasks, context.previousTasks)
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.task(variables.id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics })
    },
  })
}

