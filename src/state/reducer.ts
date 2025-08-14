import type { Task, TaskAction, Status } from './types';
import { now } from '../lib/time';

export const taskReducer = (state: Task[], action: TaskAction): Task[] => {
  switch (action.type) {
    case 'ADD_TASK': {
      const { title, description } = action.payload;
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        status: 'new',
        createdAt: now(),
        orderIndex: 0
      };
      
      // Increment order index of existing 'new' tasks
      const updatedState = state.map(task => 
        task.status === 'new' 
          ? { ...task, orderIndex: task.orderIndex + 1 }
          : task
      );
      
      return [newTask, ...updatedState];
    }
    
    case 'MOVE_TASK': {
      const { id, toStatus } = action.payload;
      const task = state.find(t => t.id === id);
      if (!task) return state;
      
      // Get tasks in destination column to determine order index
      const destTasks = state.filter(t => t.status === toStatus);
      const newOrderIndex = destTasks.length;
      
      // Update timestamps based on destination status
      const updatedTask: Task = {
        ...task,
        status: toStatus,
        orderIndex: newOrderIndex,
        ...(toStatus === 'ongoing' && !task.movedToOngoingAt && { movedToOngoingAt: now() }),
        ...(toStatus === 'done' && { completedAt: now() }),
        ...(toStatus === 'new' && { 
          movedToOngoingAt: undefined, 
          completedAt: undefined, 
          dueAt: undefined, 
          overdueNotified: false 
        })
      };
      
      // Remove from original position and reindex
      const withoutTask = state
        .filter(t => t.id !== id)
        .map(t => t.status === task.status 
          ? { ...t, orderIndex: t.orderIndex > task.orderIndex ? t.orderIndex - 1 : t.orderIndex }
          : t
        );
      
      return [...withoutTask, updatedTask];
    }
    
    case 'SET_DUE': {
      const { id, dueAt } = action.payload;
      return state.map(task =>
        task.id === id
          ? { 
              ...task, 
              dueAt,
              overdueNotified: new Date(dueAt) > new Date() ? false : task.overdueNotified
            }
          : task
      );
    }
    
    case 'REORDER_IN_COLUMN': {
      const { status, activeId, overId } = action.payload;
      
      const columnTasks = state
        .filter(t => t.status === status)
        .sort((a, b) => a.orderIndex - b.orderIndex);
      
      const activeIndex = columnTasks.findIndex(t => t.id === activeId);
      const overIndex = columnTasks.findIndex(t => t.id === overId);
      
      if (activeIndex === -1 || overIndex === -1) return state;
      
      // Reorder the tasks
      const reorderedTasks = [...columnTasks];
      const [removed] = reorderedTasks.splice(activeIndex, 1);
      reorderedTasks.splice(overIndex, 0, removed);
      
      // Update order indices
      const updatedColumnTasks = reorderedTasks.map((task, index) => ({
        ...task,
        orderIndex: index
      }));
      
      // Merge with tasks from other columns
      const otherTasks = state.filter(t => t.status !== status);
      
      return [...otherTasks, ...updatedColumnTasks];
    }
    
    case 'MARK_OVERDUE_NOTIFIED': {
      const { id, value } = action.payload;
      return state.map(task =>
        task.id === id ? { ...task, overdueNotified: value } : task
      );
    }
    
    case 'HYDRATE_FROM_STORAGE': {
      return action.payload;
    }
    
    default:
      return state;
  }
};

// Selectors
export const getTasksByStatus = (tasks: Task[], status: Status): Task[] => {
  return tasks
    .filter(task => task.status === status)
    .sort((a, b) => a.orderIndex - b.orderIndex);
};
