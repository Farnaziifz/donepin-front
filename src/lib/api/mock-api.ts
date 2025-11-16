/**
 * Mock API implementation for development
 * Simulates backend endpoints with in-memory storage
 */

import { apiClient } from './client'
import { mockStore, mockTags, mockPeople } from './mock-data'
import type {
  Note,
  Task,
  Tag,
  Person,
  Analytics,
  CreateNoteRequest,
  CreateNoteResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  SearchRequest,
  SearchResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  TasksBoardResponse,
} from '../types'

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock API functions
export const mockApi = {
  // Auth
  async login(data: LoginRequest): Promise<LoginResponse> {
    await delay()
    // Mock login - always succeeds
    const token = `mock_token_${Date.now()}`
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
    return {
      accessToken: token,
      user: {
        id: '1',
        email: data.email,
        name: 'Mock User',
        roles: ['MEMBER'],
        orgId: 'org-1',
      },
    }
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    await delay()
    // Mock register - always succeeds
    const token = `mock_token_${Date.now()}`
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
    return {
      accessToken: token,
      user: {
        id: String(Date.now()),
        email: data.email,
        name: data.name || null,
        roles: ['MEMBER'],
        orgId: 'org-1',
      },
    }
  },

  // Notes
  async getNotes(): Promise<Note[]> {
    await delay()
    return [...mockStore.notes]
  },

  async createNote(data: CreateNoteRequest): Promise<CreateNoteResponse> {
    await delay()
    const note: Note = {
      id: `note_${Date.now()}`,
      content: data.content,
      createdAt: new Date().toISOString(),
    }
    mockStore.notes.unshift(note)
    return { note }
  },

  async deleteNote(id: string): Promise<void> {
    await delay()
    mockStore.notes = mockStore.notes.filter((n) => n.id !== id)
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    await delay()
    return [...mockStore.tasks]
  },

  async getTask(id: string): Promise<Task> {
    await delay()
    const task = mockStore.tasks.find((t) => t.id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return task
  },

  // createTask removed - using real API now

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    await delay()
    const taskIndex = mockStore.tasks.findIndex((t) => t.id === id)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    const existingTask = mockStore.tasks[taskIndex]
    const updatedTask: Task = {
      ...existingTask,
      ...data,
      tags: data.tagIds
        ? mockTags.filter((t) => data.tagIds!.includes(t.id))
        : existingTask.tags,
      assignees: data.assigneeIds
        ? mockPeople.filter((p) => data.assigneeIds!.includes(p.id))
        : existingTask.assignees,
      updatedAt: new Date().toISOString(),
    }
    mockStore.tasks[taskIndex] = updatedTask
    return updatedTask
  },

  async deleteTask(id: string): Promise<void> {
    await delay()
    mockStore.tasks = mockStore.tasks.filter((t) => t.id !== id)
  },

  // Tags
  async getTags(): Promise<Tag[]> {
    await delay()
    return [...mockStore.tags]
  },

  // People
  async getPeople(): Promise<Person[]> {
    await delay()
    return [...mockStore.people]
  },

  // Search
  async search(data: SearchRequest): Promise<SearchResponse> {
    await delay(500) // Simulate slower search
    const query = data.query.toLowerCase()
    const tasks = mockStore.tasks.filter((task) => {
      const matchesQuery =
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      const matchesStatus = !data.filters?.status || data.filters.status.includes(task.status)
      const matchesPriority =
        !data.filters?.priority || data.filters.priority.includes(task.priority)
      const matchesTags =
        !data.filters?.tagIds ||
        task.tags.some((tag) => data.filters!.tagIds!.includes(tag.id))
      const matchesAssignees =
        !data.filters?.assigneeIds ||
        task.assignees.some((person) => data.filters!.assigneeIds!.includes(person.id))

      return matchesQuery && matchesStatus && matchesPriority && matchesTags && matchesAssignees
    })

    const notes = mockStore.notes.filter((note) =>
      note.content.toLowerCase().includes(query)
    )

    return { tasks, notes }
  },

  // Analytics
  async getAnalytics(): Promise<Analytics> {
    await delay()
    // Recalculate analytics from current store
    const tasks = mockStore.tasks
    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'done').length,
      inProgressTasks: tasks.filter((t) => t.status === 'in-progress').length,
      tasksByStatus: {
        inbox: tasks.filter((t) => t.status === 'inbox').length,
        todo: tasks.filter((t) => t.status === 'todo').length,
        'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
        blocked: tasks.filter((t) => t.status === 'blocked').length,
        done: tasks.filter((t) => t.status === 'done').length,
      },
      tasksByPriority: {
        LOW: tasks.filter((t) => t.priority === 'LOW').length,
        MEDIUM: tasks.filter((t) => t.priority === 'MEDIUM').length,
        HIGH: tasks.filter((t) => t.priority === 'HIGH').length,
      },
      tasksByTag: mockStore.tags.map((tag) => ({
        tag,
        count: tasks.filter((t) => t.tags.some((t) => t.id === tag.id)).length,
      })),
      averageCompletionTime: 2.5,
      tasksCompletedToday: tasks.filter(
        (t) => t.status === 'done' && new Date(t.updatedAt).toDateString() === new Date().toDateString()
      ).length,
    }
  },
}

// Export API functions - using real API
export const api = {
  // Auth
  login: (data: LoginRequest) => apiClient.post<LoginResponse>('/auth/login', data),
  register: (data: RegisterRequest) => apiClient.post<RegisterResponse>('/auth/register', data),

  // Notes
  getNotes: () => apiClient.get<Note[]>('/notes'),
  createNote: (data: CreateNoteRequest) => apiClient.post<Note>('/notes', data),
  deleteNote: (id: string) => apiClient.delete<void>(`/notes/${id}`),

  // Tasks
  getTasks: () => apiClient.get<TasksBoardResponse>('/tasks/board'),
  getTask: (id: string) => apiClient.get<Task>(`/tasks/${id}`),
  createTask: (data: CreateTaskRequest) => apiClient.post<Task>('/tasks', data),
  updateTask: (id: string, data: UpdateTaskRequest) => apiClient.patch<Task>(`/tasks/${id}`, data),
  updateTaskStatus: (id: string, data: UpdateTaskStatusRequest) => apiClient.patch<void>(`/tasks/${id}/status`, data),
  deleteTask: (id: string) => apiClient.delete<void>(`/tasks/${id}`),

  // Tags
  getTags: () => mockApi.getTags(),

  // People
  getPeople: () => mockApi.getPeople(),

  // Search
  search: (data: SearchRequest) => mockApi.search(data),

  // Analytics
  getAnalytics: () => mockApi.getAnalytics(),
}

