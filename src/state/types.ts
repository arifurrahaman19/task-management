export type Status = 'new' | 'ongoing' | 'done';

export interface Task {
  id: string; // uuid
  title: string;
  description?: string;
  status: Status;
  createdAt: string; // ISO
  movedToOngoingAt?: string;
  completedAt?: string;
  dueAt?: string; // ISO
  overdueNotified?: boolean;
  // for stable ordering per column
  orderIndex: number; // per column list ordering
}

export type TaskAction =
  | { type: 'ADD_TASK'; payload: { title: string; description?: string } }
  | { type: 'MOVE_TASK'; payload: { id: string; toStatus: Status } }
  | { type: 'SET_DUE'; payload: { id: string; dueAt: string } }
  | {
      type: 'REORDER_IN_COLUMN';
      payload: { status: Status; activeId: string; overId: string };
    }
  | { type: 'MARK_OVERDUE_NOTIFIED'; payload: { id: string; value: boolean } }
  | { type: 'HYDRATE_FROM_STORAGE'; payload: Task[] };
