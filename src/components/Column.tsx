import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Task, Status } from '../state/types';
import { TaskCard } from './TaskCard';
import { NewTaskForm } from './NewTaskForm';
import {cn} from '../lib/utils';

interface ColumnProps {
  status: Status;
  tasks: Task[];
  onAddTask?: (title: string, description?: string) => void;
  onMoveTask: (id: string, status: Status) => void;
  onSetDue: (id: string, dueAt?: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  status,
  tasks,
  onAddTask,
  onMoveTask,
  onSetDue,
}) => {
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

  const sortedTasks = [...tasks].sort((a, b) => a.orderIndex - b.orderIndex);
  const taskIds = sortedTasks.map((task) => task.id);

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
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={onMoveTask}
              onSetDue={onSetDue}
            />
          ))}

          {tasks.length === 0 && status !== 'new' && (
            <div className="text-center py-8 text-muted-foreground">
              No tasks yet
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
};
