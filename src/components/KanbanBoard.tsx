import React, { useReducer, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { taskReducer } from '../state/reducer';
import { initialState } from '../state/initialState';
import type { Status, Task } from '../state/types';
import { saveToStorage, loadFromStorage } from '../lib/storage';
import { isOverdue } from '../lib/time';

export const KanbanBoard: React.FC = () => {
  const [tasks, dispatch] = useReducer(taskReducer, initialState);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );
  useEffect(() => {
    const storedTasks = loadFromStorage();
    if (storedTasks.length > 0) {
      dispatch({ type: 'HYDRATE_FROM_STORAGE', payload: storedTasks });
    }
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    saveToStorage(tasks);
  }, [tasks]);

  // Check for overdue tasks every 30 seconds

  // Load from localStorage on mount
  useEffect(() => {
    const checkOverdueTasks = () => {
      tasks.forEach((task: Task) => {
        if (
          task.status === 'ongoing' &&
          task.dueAt &&
          isOverdue(task.dueAt) &&
          !task.overdueNotified
        ) {
          alert(`Task '${task.title}' is overdue.`);
          dispatch({
            type: 'MARK_OVERDUE_NOTIFIED',
            payload: { id: task.id, value: true },
          });
        }
      });
    };

    const interval = setInterval(checkOverdueTasks, 30000);
    return () => clearInterval(interval);
  }, [tasks]);

  const handleAddTask = (title: string, description?: string) => {
    dispatch({ type: 'ADD_TASK', payload: { title, description } });
  };

  const handleMoveTask = (id: string, toStatus: Status) => {
    dispatch({ type: 'MOVE_TASK', payload: { id, toStatus } });
  };

  const handleSetDue = (id: string, dueAt?: string) => {
    if (dueAt) {
      dispatch({ type: 'SET_DUE', payload: { id, dueAt } });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t: Task) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find((t: Task) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id.toString();

    // Check if dropping on a column
    if (['new', 'ongoing', 'done'].includes(overId)) {
      const newStatus = overId as Status;
      if (activeTask.status !== newStatus) {
        handleMoveTask(activeTask.id, newStatus);
      }
      return;
    }

    // Check if reordering within the same column
    const overTask = tasks.find((t: Task) => t.id === overId);
    if (overTask && overTask.status === activeTask.status) {
      const columnTasks = getTasksByStatus(activeTask.status);
      const oldIndex = columnTasks.findIndex((t: Task) => t.id === activeTask.id);
      const newIndex = columnTasks.findIndex((t: Task) => t.id === overId);

      if (oldIndex !== newIndex) {
        dispatch({
          type: 'REORDER_IN_COLUMN',
          payload: { 
            status: activeTask.status, 
            activeId: activeTask.id, 
            overId: overId 
          },
        });
      }
    }
  };

  const getTasksByStatus = (status: Status): Task[] => {
    return tasks.filter((task: Task) => task.status === status);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-background p-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">LYXA Todo</h1>
          <p className="text-muted-foreground">
            Organize your tasks with a clean, minimal Kanban board
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Column
            status="new"
            tasks={getTasksByStatus('new')}
            onAddTask={handleAddTask}
            onMoveTask={handleMoveTask}
            onSetDue={handleSetDue}
          />
          <Column
            status="ongoing"
            tasks={getTasksByStatus('ongoing')}
            onMoveTask={handleMoveTask}
            onSetDue={handleSetDue}
          />
          <Column
            status="done"
            tasks={getTasksByStatus('done')}
            onMoveTask={handleMoveTask}
            onSetDue={handleSetDue}
          />
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-90 rotate-3 scale-105">
              <TaskCard
                task={activeTask}
                onMove={() => {}}
                onSetDue={() => {}}
              />
            </div>
          ) : <div className="opacity-0">Loading...</div>}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
