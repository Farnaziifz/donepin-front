/**
 * Kanban column component
 */

import { Droppable } from '@hello-pangea/dnd'
import type { Task, TaskStatus } from '../../../lib/types'
import { TaskCard } from './task-card'
import { cn } from '../../../lib/utils/cn'

interface KanbanColumnProps {
  status: TaskStatus
  title: string
  tasks: Task[]
}

export function KanbanColumn({ status, title, tasks }: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full min-w-[280px]">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-1">{title}</h2>
        <span className="text-xs text-muted-foreground">{tasks.length} tasks</span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 rounded-lg border-2 border-dashed p-4 transition-colors',
              snapshot.isDraggingOver
                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                : 'border-border bg-muted/30'
            )}
          >
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  )
}

