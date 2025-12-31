import { now } from '@/lib/time';
import type { Task, TaskAction } from '@/types';

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
        orderIndex: 0,
      };

      // Shift existing 'new' tasks
      const updatedState = state.map((task) =>
        task.status === 'new'
          ? { ...task, orderIndex: task.orderIndex + 1 }
          : task
      );

      return [newTask, ...updatedState];
    }

    case 'MOVE_TASK': {
      const { id, toStatus } = action.payload;
      const task = state.find((t) => t.id === id);
      if (!task || task.status === toStatus) return state;

      const newOrderIndex = state.filter((t) => t.status === toStatus).length;

      const updatedTask: Task = {
        ...task,
        status: toStatus,
        orderIndex: newOrderIndex,
        ...(toStatus === 'ongoing' &&
          !task.movedToOngoingAt && { movedToOngoingAt: now() }),
        ...(toStatus === 'done' && { completedAt: now() }),
        ...(toStatus === 'new' && {
          movedToOngoingAt: undefined,
          completedAt: undefined,
          dueAt: undefined,
          overdueNotified: false,
        }),
      };

      const withoutTask = state
        .filter((t) => t.id !== id)
        .map((t) =>
          t.status === task.status && t.orderIndex > task.orderIndex
            ? { ...t, orderIndex: t.orderIndex - 1 }
            : t
        );

      return [...withoutTask, updatedTask];
    }

    case 'UPDATE_TASK': {
      const { id, ...updates } = action.payload;
      return state.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      );
    }

    case 'SET_DUE': {
      const { id, dueAt } = action.payload;
      return state.map((task) =>
        task.id === id
          ? {
              ...task,
              dueAt,
              overdueNotified:
                dueAt && new Date(dueAt) > new Date()
                  ? false
                  : task.overdueNotified,
            }
          : task
      );
    }

    case 'REORDER_IN_COLUMN': {
      const { status, activeId, overId } = action.payload;
      if (activeId === overId) return state;

      const columnTasks = state
        .filter((t) => t.status === status)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      const activeIndex = columnTasks.findIndex((t) => t.id === activeId);
      const overIndex = columnTasks.findIndex((t) => t.id === overId);

      if (activeIndex === -1 || overIndex === -1) return state;

      const reorderedTasks = [...columnTasks];
      const [removed] = reorderedTasks.splice(activeIndex, 1);
      reorderedTasks.splice(overIndex, 0, removed);

      const updatedColumnTasks = reorderedTasks.map((task, index) => ({
        ...task,
        orderIndex: index,
      }));

      const otherTasks = state.filter((t) => t.status !== status);
      return [...otherTasks, ...updatedColumnTasks];
    }

    case 'MARK_OVERDUE_NOTIFIED': {
      const { id, value } = action.payload;
      return state.map((task) =>
        task.id === id ? { ...task, overdueNotified: value } : task
      );
    }

    case 'DELETE_TASK': {
      const id = action.payload;
      const taskToDelete = state.find((t) => t.id === id);
      if (!taskToDelete) return state;

      return state
        .filter((t) => t.id !== id)
        .map((t) =>
          t.status === taskToDelete.status &&
          t.orderIndex > taskToDelete.orderIndex
            ? { ...t, orderIndex: t.orderIndex - 1 }
            : t
        );
    }

    case 'TOGGLE_ASSIGNEE': {
      const { id, userId } = action.payload;
      return state.map((task) => {
        if (task.id === id && task.status !== 'done') {
          const currentIds = task.assignedUserIds || [];
          const newIds = currentIds.includes(userId)
            ? currentIds.filter((uid) => uid !== userId)
            : [...currentIds, userId];
          return { ...task, assignedUserIds: newIds };
        }
        return task;
      });
    }

    case 'UPDATE_CHECKLIST_TITLE': {
      const { taskId, checklistId, title } = action.payload;
      return state.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            checklists: (task.checklists || []).map((cl) =>
              cl.id === checklistId ? { ...cl, title } : cl
            ),
          };
        }
        return task;
      });
    }

    case 'ADD_CHECKLIST': {
      const { taskId, title } = action.payload;
      return state.map((task) => {
        if (task.id === taskId) {
          const newChecklist = {
            id: crypto.randomUUID(),
            title,
            items: [],
          };
          return {
            ...task,
            checklists: [...(task.checklists || []), newChecklist],
          };
        }
        return task;
      });
    }

    case 'ADD_CHECKLIST_ITEM': {
      const { taskId, checklistId, title } = action.payload;
      return state.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            checklists: (task.checklists || []).map((cl) =>
              cl.id === checklistId
                ? {
                    ...cl,
                    items: [
                      ...cl.items,
                      { id: crypto.randomUUID(), title, isCompleted: false },
                    ],
                  }
                : cl
            ),
          };
        }
        return task;
      });
    }

    case 'TOGGLE_CHECKLIST_ITEM': {
      const { taskId, checklistId, itemId } = action.payload;
      return state.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            checklists: (task.checklists || []).map((cl) =>
              cl.id === checklistId
                ? {
                    ...cl,
                    items: cl.items.map((item) =>
                      item.id === itemId
                        ? { ...item, isCompleted: !item.isCompleted }
                        : item
                    ),
                  }
                : cl
            ),
          };
        }
        return task;
      });
    }

    case 'UPDATE_TASK_TITLE': {
      const { id, title } = action.payload;
      return state.map((task) =>
        task.id === id && task.status !== 'done' ? { ...task, title } : task
      );
    }

    case 'UPDATE_TASK_DESCRIPTION': {
      const { id, description } = action.payload;
      return state.map((task) =>
        task.id === id && task.status !== 'done'
          ? { ...task, description }
          : task
      );
    }

    case 'HYDRATE_FROM_STORAGE': {
      return action.payload;
    }

    default:
      return state;
  }
};
