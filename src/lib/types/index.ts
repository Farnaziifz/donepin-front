// Core domain types

export type TaskStatus = 'inbox' | 'todo' | 'in-progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Tag {
  id: string
  name: string
  color: string
  createdAt: string
}

export interface Person {
  id: string
  name: string
  email?: string
  avatar?: string
  createdAt: string
}

export interface Note {
  id: string
  content: string
  createdAt: string
  convertedAt?: string
  taskId?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  tags: Tag[]
  assignees: Person[]
  dueDate?: string
  snoozedUntil?: string
  estimatedMinutes?: number
  createdAt: string
  updatedAt: string
  noteId?: string
}

export interface Analytics {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  tasksByStatus: Record<TaskStatus, number>
  tasksByPriority: Record<TaskPriority, number>
  tasksByTag: Array<{ tag: Tag; count: number }>
  averageCompletionTime: number
  tasksCompletedToday: number
}

// API DTOs

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    email: string
    name: string | null
    roles: string[]
    orgId: string
  }
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface RegisterResponse {
  accessToken: string
  user: {
    id: string
    email: string
    name: string | null
    roles: string[]
    orgId: string
  }
}

export interface User {
  id: string
  email: string
  name: string | null
  roles: string[]
  orgId: string
}

export interface CreateNoteRequest {
  content: string
}

export interface CreateNoteResponse {
  note: Note
}

export interface CreateTaskRequest {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  tagIds?: string[]
  assigneeIds?: string[]
  dueDate?: string
  estimatedMinutes?: number
  noteId?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  tagIds?: string[]
  assigneeIds?: string[]
  dueDate?: string
  snoozedUntil?: string
  estimatedMinutes?: number
}

export interface SearchRequest {
  query: string
  filters?: {
    status?: TaskStatus[]
    priority?: TaskPriority[]
    tagIds?: string[]
    assigneeIds?: string[]
  }
}

export interface SearchResponse {
  tasks: Task[]
  notes: Note[]
}

// Error types

export interface ApiError {
  message: string
  code?: string
  statusCode: number
}

