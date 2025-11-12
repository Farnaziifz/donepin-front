/**
 * React Query hooks for Tasks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api'
import { QUERY_KEYS } from '../../utils/constants'
import type { CreateTaskRequest, UpdateTaskRequest } from '../../types'

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
        if (!Array.isArray(old)) return old
        return old.map((task) =>
          task.id === id
            ? { ...task, ...data, updatedAt: new Date().toISOString() }
            : task
        )
      })

      return { previousTask, previousTasks }
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(QUERY_KEYS.task(id), context.previousTask)
      }
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.tasks, context.previousTasks)
      }
    },
    onSettled: (data, _error, variables) => {
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

