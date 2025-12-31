import { Column } from '@/components/Common/Column';
import { TaskCard } from '@/components/Common/TaskCard';
import { TaskModal } from '@/components/Common/TaskModal';
import { useTasks } from '@/contexts/TaskContext';
import { useToast } from '@/hooks/use-toast';
import { isOverdue } from '@/lib/time';
import type { Status, Task } from '@/types';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import React, { useCallback, useEffect, useState } from 'react';

export const KanbanBoard: React.FC = () => {
  const { tasks, dispatch, getTasksByStatus } = useTasks();
  const { toast } = useToast();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: () => ({ x: 0, y: 0 }),
    })
  );

  const handleAddTask = (title: string, description?: string) => {
    dispatch({ type: 'ADD_TASK', payload: { title, description } });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t: Task) => t.id === active.id);
    setActiveTask(task || null);
    document.body.style.overflow = 'hidden';
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    document.body.style.overflow = '';

    if (!over) return;

    const activeTask = tasks.find((t: Task) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id.toString();

    // Check if dropping on a column
    if (['new', 'ongoing', 'done'].includes(overId)) {
      const newStatus = overId as Status;
      if (activeTask.status !== newStatus) {
        dispatch({
          type: 'MOVE_TASK',
          payload: { id: activeTask.id, toStatus: newStatus },
        });
      }
      return;
    }

    // Check if reordering within the same column
    const overTask = tasks.find((t: Task) => t.id === overId);

    if (overTask && overTask.status === activeTask.status) {
      const columnTasks = getTasksByStatus(activeTask.status);
      const oldIndex = columnTasks.findIndex(
        (t: Task) => t.id === activeTask.id
      );

      const newIndex = columnTasks.findIndex((t: Task) => t.id === overId);

      if (oldIndex !== newIndex) {
        dispatch({
          type: 'REORDER_IN_COLUMN',
          payload: {
            status: activeTask.status,
            activeId: activeTask.id,
            overId: overId,
          },
        });
      }
    }
  };

  const checkOverdueTasks = useCallback(() => {
    tasks.forEach((task: Task) => {
      if (
        task.status === 'ongoing' &&
        task.dueAt &&
        isOverdue(task.dueAt) &&
        !task.overdueNotified
      ) {
        toast({
          title: 'Task Overdue',
          description: `Task "${task.title}" is past its due date!`,
          variant: 'destructive',
        });
        dispatch({
          type: 'MARK_OVERDUE_NOTIFIED',
          payload: { id: task.id, value: true },
        });
      }
    });
  }, [tasks, dispatch, toast]);

  useEffect(() => {
    const preventTouchScroll = (e: TouchEvent) => {
      if (activeTask) e.preventDefault();
    };
    document.addEventListener('touchmove', preventTouchScroll, {
      passive: false,
    });
    return () => {
      document.removeEventListener('touchmove', preventTouchScroll);
    };
  }, [activeTask]);

  useEffect(() => {
    const interval = setInterval(checkOverdueTasks, 30000);
    return () => clearInterval(interval);
  }, [checkOverdueTasks]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Column
            status="new"
            tasks={getTasksByStatus('new')}
            onAddTask={handleAddTask}
            onTaskClick={(task) => setSelectedTaskId(task.id)}
          />
          <Column
            status="ongoing"
            tasks={getTasksByStatus('ongoing')}
            onTaskClick={(task) => setSelectedTaskId(task.id)}
          />
          <Column
            status="done"
            tasks={getTasksByStatus('done')}
            onTaskClick={(task) => setSelectedTaskId(task.id)}
          />
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-90 rotate-2 scale-105 shadow-2xl">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>

        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTaskId(null)}
          />
        )}
      </div>
    </DndContext>
  );
};
