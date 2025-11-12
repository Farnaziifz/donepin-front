/**
 * Inbox page - Capture notes and convert to tasks
 */

import { useNotes } from '../../lib/hooks/queries'
import type { Note } from '../../lib/types'
import { CreateNoteForm } from './components/create-note-form'
import { NoteCard } from './components/note-card'
import { EmptyState } from '../../components/ui/empty-state'
import { Skeleton } from '../../components/ui/skeleton'

export function InboxPage() {
  const { data: notes, isLoading, error } = useNotes()

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          Failed to load notes. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Inbox</h1>
        <p className="text-muted-foreground">Capture quick notes and convert them to tasks</p>
      </div>

      <div className="mb-8">
        <CreateNoteForm />
      </div>

      <div className="space-y-4">
        {notes && notes.length > 0 ? (
          notes.map((note: Note) => <NoteCard key={note.id} note={note} />)
        ) : (
          <EmptyState
            icon="📝"
            title="No notes yet"
            description="Start capturing your thoughts, ideas, or tasks as quick notes"
          />
        )}
      </div>
    </div>
  )
}

