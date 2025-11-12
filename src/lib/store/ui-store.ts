/**
 * Zustand store for UI state (dialogs, modals, filters, layout preferences)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TaskStatus, TaskPriority } from '../types'

interface FilterState {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  tagIds?: string[]
  assigneeIds?: string[]
  searchQuery?: string
}

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // Dialogs/Modals
  isCreateTaskDialogOpen: boolean
  setIsCreateTaskDialogOpen: (open: boolean) => void

  isCreateNoteDialogOpen: boolean
  setIsCreateNoteDialogOpen: (open: boolean) => void

  isSettingsDialogOpen: boolean
  setIsSettingsDialogOpen: (open: boolean) => void

  // Filters
  filters: FilterState
  setFilters: (filters: Partial<FilterState>) => void
  clearFilters: () => void

  // Layout preferences
  viewMode: 'list' | 'board' | 'compact'
  setViewMode: (mode: 'list' | 'board' | 'compact') => void

  // Selected task for detail view
  selectedTaskId: string | null
  setSelectedTaskId: (id: string | null) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Dialogs
      isCreateTaskDialogOpen: false,
      setIsCreateTaskDialogOpen: (open) => set({ isCreateTaskDialogOpen: open }),

      isCreateNoteDialogOpen: false,
      setIsCreateNoteDialogOpen: (open) => set({ isCreateNoteDialogOpen: open }),

      isSettingsDialogOpen: false,
      setIsSettingsDialogOpen: (open) => set({ isSettingsDialogOpen: open }),

      // Filters
      filters: {},
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      clearFilters: () => set({ filters: {} }),

      // Layout
      viewMode: 'list',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Selected task
      selectedTaskId: null,
      setSelectedTaskId: (id) => set({ selectedTaskId: id }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        viewMode: state.viewMode,
        filters: state.filters,
      }),
    }
  )
)

