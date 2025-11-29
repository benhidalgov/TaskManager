export type Id = string | number;

export type Priority = 'Alto' | 'Medio' | 'Bajo';

export interface Subtask {
    id: string;
    taskId: string;
    content: string;
    isCompleted: boolean;
    createdAt: string;
}

export interface Comment {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    createdAt: string;
}

export interface Task {
    id: Id;
    columnId: Id;
    content: string;
    priority?: Priority;
    assigneeId?: string;
    description?: string;
    dueDate?: string;
    subtasks?: Subtask[];
    comments?: Comment[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Column {
    id: Id;
    title: string;
}

export interface Profile {
    id: string;
    email: string;
    role: 'admin' | 'user';
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}