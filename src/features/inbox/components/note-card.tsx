/**
 * Note card component
 */

import type { Note } from '../../../lib/types'
import { Button } from '../../../components/ui/button'
import { formatRelativeTime } from '../../../lib/utils/format'
import { useDeleteNote, useCreateTask } from '../../../lib/hooks/queries'
import { useToast } from '../../../lib/hooks'

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const deleteNote = useDeleteNote()
  const createTask = useCreateTask()
  const toast = useToast()

  const handleConvertToTask = async () => {
    try {
      await createTask.mutateAsync({
        title: note.content.substring(0, 100),
        description: note.content.length > 100 ? note.content : undefined,
        noteId: note.id,
        status: 'inbox',
      })
      await deleteNote.mutateAsync(note.id)
      toast.success('Note converted to task')
    } catch (err) {
      toast.error('Failed to convert note', (err as Error).message)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteNote.mutateAsync(note.id)
      toast.success('Note deleted')
    } catch (err) {
      toast.error('Failed to delete note', (err as Error).message)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm text-foreground mb-3 whitespace-pre-wrap">{note.content}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{formatRelativeTime(note.createdAt)}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleConvertToTask}
            disabled={createTask.isPending || deleteNote.isPending}
          >
            Convert to Task
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteNote.isPending}
            aria-label="Delete note"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}

