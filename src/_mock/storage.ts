import type { Task } from '../types/types';

const STORAGE_KEY = 'lypd-todo-tasks-v2';

export const storage = {
  save: (tasks: Task[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('[Storage Service] Failed to save tasks:', error);
      // In a real app, we might want to track this via error reporting service
    }
  },

  load: (): Task[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid data format in localStorage');
      }
      return parsed;
    } catch (error) {
      console.error('[Storage Service] Failed to load tasks:', error);
      return [];
    }
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
