export type Status = 'new' | 'ongoing' | 'done';

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  createdAt: string;
  movedToOngoingAt?: string;
  completedAt?: string;
  dueAt?: string;
  overdueNotified?: boolean;
  orderIndex: number;
  assignedUserIds?: string[];
  checklists?: Checklist[];
}

export type TaskAction =
  | { type: 'ADD_TASK'; payload: { title: string; description?: string } }
  | { type: 'MOVE_TASK'; payload: { id: string; toStatus: Status } }
  | { type: 'UPDATE_TASK'; payload: Partial<Task> & { id: string } }
  | { type: 'SET_DUE'; payload: { id: string; dueAt?: string } }
  | {
      type: 'REORDER_IN_COLUMN';
      payload: { status: Status; activeId: string; overId: string };
    }
  | { type: 'MARK_OVERDUE_NOTIFIED'; payload: { id: string; value: boolean } }
  | { type: 'HYDRATE_FROM_STORAGE'; payload: Task[] }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_ASSIGNEE'; payload: { id: string; userId: string } }
  | { type: 'ADD_CHECKLIST'; payload: { taskId: string; title: string } }
  | {
      type: 'UPDATE_CHECKLIST_TITLE';
      payload: { taskId: string; checklistId: string; title: string };
    }
  | {
      type: 'ADD_CHECKLIST_ITEM';
      payload: { taskId: string; checklistId: string; title: string };
    }
  | {
      type: 'TOGGLE_CHECKLIST_ITEM';
      payload: { taskId: string; checklistId: string; itemId: string };
    }
  | { type: 'UPDATE_TASK_TITLE'; payload: { id: string; title: string } }
  | {
      type: 'UPDATE_TASK_DESCRIPTION';
      payload: { id: string; description: string };
    };

export interface TaskContextState {
  tasks: Task[];
  dispatch: React.Dispatch<TaskAction>;
  getTasksByStatus: (status: Status) => Task[];
}

export const MOCK_USERS: User[] = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Bob Wilson', avatar: 'https://i.pravatar.cc/150?u=4' },
];
