import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { storage } from '../_mock/storage';
import type { Status, TaskContextState } from '../types/types';
import { taskReducer } from '@/states/taskReducer';

const TaskContext = createContext<TaskContextState | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  // Hydrate from storage on mount
  useEffect(() => {
    const initialTasks = storage.load();
    if (initialTasks.length > 0) {
      dispatch({ type: 'HYDRATE_FROM_STORAGE', payload: initialTasks });
    }
  }, []);

  // Persist to storage on change
  useEffect(() => {
    storage.save(tasks);
  }, [tasks]);

  const getTasksByStatus = useCallback(
    (status: Status) => {
      return tasks
        .filter((t) => t.status === status)
        .sort((a, b) => a.orderIndex - b.orderIndex);
    },
    [tasks]
  );

  const value = useMemo(
    () => ({
      tasks,
      dispatch,
      getTasksByStatus,
    }),
    [tasks, getTasksByStatus]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
