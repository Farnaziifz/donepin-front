// Core domain types

export type TaskStatus = 'inbox' | 'todo' | 'in-progress' | 'blocked' | 'done'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

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
  tasksByPriority: Record<'LOW' | 'MEDIUM' | 'HIGH', number>
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
  priority?: TaskPriority
  dueDate?: string
  noteId?: string
  ownerId?: string
  projectId?: string | null
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

export interface UpdateTaskStatusRequest {
  status: 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE'
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

// Board API Response
export interface BoardTask {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | null
  dueDate: string | null
  blockerReason: string | null
  orgId: string
  projectId: string | null
  noteId: string | null
  ownerId: string | null
  createdAt: string
  updatedAt: string
}

export interface TasksBoardResponse {
  TODO: BoardTask[]
  IN_PROGRESS: BoardTask[]
  BLOCKED: BoardTask[]
  DONE: BoardTask[]
}

// Error types

export interface ApiError {
  message: string
  code?: string
  statusCode: number
}

