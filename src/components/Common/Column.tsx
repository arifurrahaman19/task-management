import { NewTaskForm } from '@/components/Homepage/NewTaskForm';
import { cn } from '@/lib/utils';
import type { Status, Task } from '@/types';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { memo, useMemo } from 'react';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  status: Status;
  tasks: Task[];
  onAddTask?: (title: string, description?: string) => void;
  onTaskClick?: (task: Task) => void;
}

export const Column: React.FC<ColumnProps> = memo(
  ({ status, tasks, onAddTask, onTaskClick }) => {
    const getColumnTitle = (status: Status) => {
      switch (status) {
        case 'new':
          return 'New';
        case 'ongoing':
          return 'Ongoing';
        case 'done':
          return 'Done';
        default:
          return 'Unknown';
      }
    };

    const getColumnColor = (status: Status) => {
      switch (status) {
        case 'new':
          return 'border-t-status-new';
        case 'ongoing':
          return 'border-t-status-ongoing';
        case 'done':
          return 'border-t-status-done';
        default:
          return 'border-t-border';
      }
    };

    const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

    const { setNodeRef, isOver } = useDroppable({
      id: status,
    });

    return (
      <section
        ref={setNodeRef}
        className={cn(
          'bg-muted/30 rounded-lg border-t-4 p-4 min-h-96 transition-colors',
          getColumnColor(status),
          isOver && 'bg-accent/50'
        )}
      >
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {getColumnTitle(status)}
            <span className="ml-2 text-sm text-muted-foreground">
              ({tasks.length})
            </span>
          </h2>
        </header>

        {status === 'new' && onAddTask && <NewTaskForm onSubmit={onAddTask} />}

        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick?.(task)}
              />
            ))}

            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground/60 animate-in fade-in duration-500">
                <div className="w-12 h-12 mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
                <p className="text-sm font-medium">No tasks yet</p>
                <p className="text-xs">Drag tasks here or create one</p>
              </div>
            )}
          </div>
        </SortableContext>
      </section>
    );
  }
);

Column.displayName = 'Column';
