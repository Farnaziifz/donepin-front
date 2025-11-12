/**
 * Mock data for development until backend is ready
 */

import type { Note, Task, Tag, Person, Analytics } from '../types'

// Mock Tags
export const mockTags: Tag[] = [
  { id: '1', name: 'Work', color: 'blue', createdAt: new Date().toISOString() },
  { id: '2', name: 'Personal', color: 'green', createdAt: new Date().toISOString() },
  { id: '3', name: 'Urgent', color: 'red', createdAt: new Date().toISOString() },
  { id: '4', name: 'Project', color: 'purple', createdAt: new Date().toISOString() },
]

// Mock People
export const mockPeople: Person[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date().toISOString(),
  },
]

// Mock Notes
export const mockNotes: Note[] = [
  {
    id: '1',
    content: 'Review the quarterly report',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    content: 'Call client about project update',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    content: 'Buy groceries for the weekend',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive docs for the new feature',
    status: 'in-progress',
    priority: 'high',
    tags: [mockTags[0], mockTags[3]],
    assignees: [mockPeople[0]],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedMinutes: 120,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    noteId: '1',
  },
  {
    id: '2',
    title: 'Review code changes',
    status: 'todo',
    priority: 'medium',
    tags: [mockTags[0]],
    assignees: [],
    estimatedMinutes: 30,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Team meeting preparation',
    description: 'Prepare agenda and materials',
    status: 'done',
    priority: 'medium',
    tags: [mockTags[0]],
    assignees: [mockPeople[1]],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Fix bug in login flow',
    status: 'todo',
    priority: 'high',
    tags: [mockTags[0], mockTags[2]],
    assignees: [mockPeople[0]],
    estimatedMinutes: 45,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Update dependencies',
    status: 'inbox',
    priority: 'low',
    tags: [],
    assignees: [],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock Analytics
export const mockAnalytics: Analytics = {
  totalTasks: mockTasks.length,
  completedTasks: mockTasks.filter((t) => t.status === 'done').length,
  inProgressTasks: mockTasks.filter((t) => t.status === 'in-progress').length,
  tasksByStatus: {
    inbox: mockTasks.filter((t) => t.status === 'inbox').length,
    todo: mockTasks.filter((t) => t.status === 'todo').length,
    'in-progress': mockTasks.filter((t) => t.status === 'in-progress').length,
    done: mockTasks.filter((t) => t.status === 'done').length,
  },
  tasksByPriority: {
    low: mockTasks.filter((t) => t.priority === 'low').length,
    medium: mockTasks.filter((t) => t.priority === 'medium').length,
    high: mockTasks.filter((t) => t.priority === 'high').length,
  },
  tasksByTag: mockTags.map((tag) => ({
    tag,
    count: mockTasks.filter((t) => t.tags.some((t) => t.id === tag.id)).length,
  })),
  averageCompletionTime: 2.5,
  tasksCompletedToday: 1,
}

// In-memory storage for mock data
export const mockStore = {
  notes: [...mockNotes] as Note[],
  tasks: [...mockTasks] as Task[],
  tags: [...mockTags] as Tag[],
  people: [...mockPeople] as Person[],
  analytics: mockAnalytics,
}

