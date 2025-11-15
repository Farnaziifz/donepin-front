/**
 * Application constants
 * All values are read from environment variables with fallback defaults
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'DonePin'

export const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

// API Client Settings
export const API_RETRY_COUNT = Number(import.meta.env.VITE_API_RETRY_COUNT) || 3
export const API_RETRY_DELAY = Number(import.meta.env.VITE_API_RETRY_DELAY) || 1000
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000

// PWA Configuration
export const PWA_NAME = import.meta.env.VITE_PWA_NAME || 'DonePin - Task Management'
export const PWA_SHORT_NAME = import.meta.env.VITE_PWA_SHORT_NAME || 'DonePin'
export const PWA_DESCRIPTION = import.meta.env.VITE_PWA_DESCRIPTION || 'A minimal, fast, installable PWA for task management'
export const PWA_THEME_COLOR = import.meta.env.VITE_PWA_THEME_COLOR || '#3b82f6'
export const PWA_BACKGROUND_COLOR = import.meta.env.VITE_PWA_BACKGROUND_COLOR || '#ffffff'
export const PWA_DISPLAY = import.meta.env.VITE_PWA_DISPLAY || 'standalone'
export const PWA_ORIENTATION = import.meta.env.VITE_PWA_ORIENTATION || 'portrait'
export const PWA_START_URL = import.meta.env.VITE_PWA_START_URL || '/'
export const PWA_SCOPE = import.meta.env.VITE_PWA_SCOPE || '/'

// Cache Configuration
export const CACHE_MAX_ENTRIES = Number(import.meta.env.VITE_CACHE_MAX_ENTRIES) || 50
export const CACHE_MAX_AGE_SECONDS = Number(import.meta.env.VITE_CACHE_MAX_AGE_SECONDS) || 300
export const CACHE_NETWORK_TIMEOUT_SECONDS = Number(import.meta.env.VITE_CACHE_NETWORK_TIMEOUT_SECONDS) || 10

export const TASK_STATUSES: Array<{ value: 'inbox' | 'todo' | 'in-progress' | 'done'; label: string }> = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export const TASK_PRIORITIES: Array<{ value: 'LOW' | 'MEDIUM' | 'HIGH'; label: string; color: string }> = [
  { value: 'LOW', label: 'Low', color: 'blue' },
  { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
  { value: 'HIGH', label: 'High', color: 'red' },
]

export const TAG_COLORS = [
  'blue',
  'green',
  'yellow',
  'red',
  'purple',
  'pink',
  'indigo',
  'gray',
] as const

export type TagColor = (typeof TAG_COLORS)[number]

export const STORAGE_KEYS = {
  AUTH_TOKEN: import.meta.env.VITE_STORAGE_AUTH_TOKEN || 'auth_token',
  THEME: import.meta.env.VITE_STORAGE_THEME || 'theme',
  OFFLINE_QUEUE: import.meta.env.VITE_STORAGE_OFFLINE_QUEUE || 'offline_queue',
} as const

export const QUERY_KEYS = {
  notes: ['notes'] as const,
  note: (id: string) => ['notes', id] as const,
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  tags: ['tags'] as const,
  people: ['people'] as const,
  analytics: ['analytics'] as const,
  search: (query: string) => ['search', query] as const,
} as const

