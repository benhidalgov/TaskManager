export type Id = string | number;

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
    id: Id;
    columnId: Id;
    content: string;
    priority?: Priority;
    createdAt?: string;
    updatedAt?: string;
}

export interface Column {
    id: Id;
    title: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}