import { create } from "zustand";
import { supabase } from "./supabase";
import type { Column, Task, Id, Toast, Priority, Profile, Subtask, Comment } from "./types";

interface KanbanState {
  columns: Column[];
  tasks: Task[];
  profiles: Profile[];
  isLoading: boolean;
  activeTaskId: Id | null;
  toasts: Toast[];
  setActiveTask: (id: Id | null) => void;
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  fetchTasks: () => Promise<void>;
  fetchProfiles: () => Promise<void>;
  addTask: (columnId: Id, content: string, priority?: Priority, assigneeId?: string) => Promise<void>;
  deleteTask: (id: Id) => Promise<void>;
  updateTask: (id: Id, newContent: string) => Promise<void>;
  updateTaskPriority: (id: Id, newPriority: Priority) => Promise<void>;
  updateTaskAssignee: (id: Id, newAssigneeId: string | null) => Promise<void>;
  moveTask: (
    taskId: Id,
    sourceColId: Id,
    destColId: Id,
    sourceIndex: number,
    destIndex: number
  ) => void;

  // New Actions
  updateTaskDescription: (id: Id, description: string) => Promise<void>;
  updateTaskDueDate: (id: Id, date: string | null) => Promise<void>;

  fetchSubtasks: (taskId: Id) => Promise<void>;
  addSubtask: (taskId: Id, content: string) => Promise<void>;
  toggleSubtask: (subtaskId: string, isCompleted: boolean) => Promise<void>;
  deleteSubtask: (subtaskId: string) => Promise<void>;

  fetchComments: (taskId: Id) => Promise<void>;
  addComment: (taskId: Id, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  columns: [
    { id: "col-1", title: "Pendiente" },
    { id: "col-2", title: "En Progreso" },
    { id: "col-3", title: "Terminado" },
  ],
  tasks: [],
  profiles: [],
  isLoading: false,
  activeTaskId: null,
  toasts: [],

  setActiveTask: (id) => set({ activeTaskId: id }),

  // Toast actions
  addToast: (type, message) => {
    const id = crypto.randomUUID();
    const newToast: Toast = { id, type, message, duration: 3000 };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  // 1. Cargar tareas
  fetchTasks: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
      console.error("Error cargando tareas:", error);
      get().addToast('error', 'Error al cargar las tareas');
      set({ isLoading: false });
      return;
    }

    const safeData = data || [];

    const mappedTasks: Task[] = safeData.map((t) => ({
      id: t.id,
      columnId: t.column_id,
      content: t.content,
      priority: t.priority,
      assigneeId: t.assignee_id,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      description: t.description,
      dueDate: t.due_date,
    }));

    set({ tasks: mappedTasks, isLoading: false });
  },

  // 2. Agregar Tarea
  addTask: async (columnId, content, priority = 'Medio', assigneeId) => {
    const tempId = crypto.randomUUID();
    const newTask: Task = {
      id: tempId,
      columnId,
      content,
      priority,
      assigneeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({ tasks: [...state.tasks, newTask] }));

    const { error } = await supabase
      .from("tasks")
      .insert({
        id: tempId,
        column_id: columnId,
        content,
        priority,
        assignee_id: assigneeId,
      });

    if (error) {
      console.error("Error guardando:", error);
      get().addToast('error', 'Error al crear la tarea');
      // Rollback optimistic update
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== tempId) }));
    } else {
      get().addToast('success', '✨ Tarea creada exitosamente');
    }
  },

  // 3. Eliminar Tarea
  deleteTask: async (id) => {
    const previousTasks = get().tasks;

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error eliminando:", error);
      get().addToast('error', 'Error al eliminar la tarea');
      // Rollback
      set({ tasks: previousTasks });
    } else {
      get().addToast('info', '🗑️ Tarea eliminada');
    }
  },

  // 4. Editar Tarea
  updateTask: async (id, newContent) => {
    const previousTasks = get().tasks;

    // Optimistic Update
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, content: newContent, updatedAt: new Date().toISOString() } : task
      ),
    }));

    // Update en Supabase
    const { error } = await supabase
      .from("tasks")
      .update({ content: newContent })
      .eq("id", id);

    if (error) {
      console.error("Error actualizando:", error);
      get().addToast('error', 'Error al actualizar la tarea');
      // Rollback
      set({ tasks: previousTasks });
    } else {
      get().addToast('success', '✅ Tarea actualizada');
    }
  },

  // 4b. Actualizar Prioridad
  updateTaskPriority: async (id, newPriority) => {
    const previousTasks = get().tasks;

    // Optimistic Update
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, priority: newPriority, updatedAt: new Date().toISOString() } : task
      ),
    }));

    // Update en Supabase
    const { error } = await supabase
      .from("tasks")
      .update({ priority: newPriority })
      .eq("id", id);

    if (error) {
      console.error("Error actualizando prioridad:", error);
      get().addToast('error', 'Error al actualizar la prioridad');
      // Rollback
      set({ tasks: previousTasks });
    } else {
      get().addToast('success', '🎯 Prioridad actualizada');
    }
  },

  // 4c. Actualizar Asignado
  updateTaskAssignee: async (id, newAssigneeId) => {
    const previousTasks = get().tasks;

    // Optimistic Update
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, assigneeId: newAssigneeId || undefined, updatedAt: new Date().toISOString() } : task
      ),
    }));

    // Update en Supabase
    const { error } = await supabase
      .from("tasks")
      .update({ assignee_id: newAssigneeId })
      .eq("id", id);

    if (error) {
      console.error("Error actualizando asignado:", error);
      get().addToast('error', 'Error al actualizar el asignado');
      // Rollback
      set({ tasks: previousTasks });
    } else {
      get().addToast('success', '👤 Asignación actualizada');
    }
  },

  // 5. Mover Tarea
  moveTask: async (taskId, sourceColId, destColId, sourceIndex, destIndex) => {
    const previousTasks = get().tasks;

    set((state) => {
      const newTasks = [...state.tasks];
      const sourceColumnTasks = newTasks.filter((t) => t.columnId === sourceColId);
      const destColumnTasks =
        sourceColId === destColId
          ? sourceColumnTasks
          : newTasks.filter((t) => t.columnId === destColId);

      const [movedTask] = sourceColumnTasks.splice(sourceIndex, 1);
      movedTask.columnId = destColId;

      if (sourceColId === destColId) {
        sourceColumnTasks.splice(destIndex, 0, movedTask);
      } else {
        destColumnTasks.splice(destIndex, 0, movedTask);
      }

      const finalTasks: Task[] = [];
      state.columns.forEach((col) => {
        if (col.id === sourceColId) finalTasks.push(...sourceColumnTasks);
        else if (col.id === destColId) finalTasks.push(...destColumnTasks);
        else finalTasks.push(...newTasks.filter((t) => t.columnId === col.id));
      });

      return { tasks: finalTasks };
    });

    // Celebration if moved to "Terminado"
    if (destColId === 'col-3' && sourceColId !== 'col-3') {
      get().addToast('success', '🎉 ¡Tarea completada! ¡Excelente trabajo!');
    }

    if (sourceColId !== destColId) {
      const { error } = await supabase
        .from("tasks")
        .update({ column_id: destColId })
        .eq("id", taskId);

      if (error) {
        console.error("Error moviendo tarea:", error);
        get().addToast('error', 'Error al mover la tarea');
        set({ tasks: previousTasks });
      }
    }
  },

  // 6. Cargar Perfiles
  fetchProfiles: async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) {
      console.error("Error cargando perfiles:", error);
      return;
    }
    set({ profiles: data || [] });
  },

  // 7. Update Description
  updateTaskDescription: async (id, description) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, description } : t)),
    }));
    await supabase.from("tasks").update({ description }).eq("id", id);
  },

  // 8. Update Due Date
  updateTaskDueDate: async (id, date) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, dueDate: date || undefined } : t)),
    }));
    await supabase.from("tasks").update({ due_date: date }).eq("id", id);
  },

  // 9. Subtasks
  fetchSubtasks: async (taskId) => {
    const { data } = await supabase.from("subtasks").select("*").eq("task_id", taskId).order("created_at");
    if (data) {
      const mapped: Subtask[] = data.map(s => ({
        id: s.id,
        taskId: s.task_id,
        content: s.content,
        isCompleted: s.is_completed,
        createdAt: s.created_at
      }));
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, subtasks: mapped } : t)
      }));
    }
  },

  addSubtask: async (taskId, content) => {
    const tempId = crypto.randomUUID();
    const newSubtask: Subtask = {
      id: tempId,
      taskId: String(taskId),
      content,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };

    // Optimistic
    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, subtasks: [...(t.subtasks || []), newSubtask] } : t)
    }));

    const { data, error } = await supabase.from("subtasks").insert({
      task_id: taskId,
      content
    }).select().single();

    if (error) {
      get().addToast('error', 'Error al crear subtarea');
      // Rollback
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, subtasks: t.subtasks?.filter(s => s.id !== tempId) } : t)
      }));
    } else if (data) {
      // Update ID with real one
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          subtasks: t.subtasks?.map(s => s.id === tempId ? { ...s, id: data.id } : s)
        } : t)
      }));
    }
  },

  toggleSubtask: async (subtaskId, isCompleted) => {
    // Find task containing this subtask
    const tasks = get().tasks;
    const task = tasks.find(t => t.subtasks?.some(s => s.id === subtaskId));
    if (!task) return;

    // Optimistic
    set((state) => ({
      tasks: state.tasks.map(t => t.id === task.id ? {
        ...t,
        subtasks: t.subtasks?.map(s => s.id === subtaskId ? { ...s, isCompleted } : s)
      } : t)
    }));

    await supabase.from("subtasks").update({ is_completed: isCompleted }).eq("id", subtaskId);
  },

  deleteSubtask: async (subtaskId) => {
    const tasks = get().tasks;
    const task = tasks.find(t => t.subtasks?.some(s => s.id === subtaskId));
    if (!task) return;

    set((state) => ({
      tasks: state.tasks.map(t => t.id === task.id ? {
        ...t,
        subtasks: t.subtasks?.filter(s => s.id !== subtaskId)
      } : t)
    }));

    await supabase.from("subtasks").delete().eq("id", subtaskId);
  },

  // 10. Comments
  fetchComments: async (taskId) => {
    const { data } = await supabase.from("comments").select("*").eq("task_id", taskId).order("created_at");
    if (data) {
      const mapped: Comment[] = data.map(c => ({
        id: c.id,
        taskId: c.task_id,
        userId: c.user_id,
        content: c.content,
        createdAt: c.created_at
      }));
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, comments: mapped } : t)
      }));
    }
  },

  addComment: async (taskId, content) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const tempId = crypto.randomUUID();
    const newComment: Comment = {
      id: tempId,
      taskId: String(taskId),
      userId: user.id,
      content,
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, comments: [...(t.comments || []), newComment] } : t)
    }));

    const { data, error } = await supabase.from("comments").insert({
      task_id: taskId,
      user_id: user.id,
      content
    }).select().single();

    if (error) {
      get().addToast('error', 'Error al comentar');
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, comments: t.comments?.filter(c => c.id !== tempId) } : t)
      }));
    } else if (data) {
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          comments: t.comments?.map(c => c.id === tempId ? { ...c, id: data.id } : c)
        } : t)
      }));
    }
  },

  deleteComment: async (commentId) => {
    const tasks = get().tasks;
    const task = tasks.find(t => t.comments?.some(c => c.id === commentId));
    if (!task) return;

    set((state) => ({
      tasks: state.tasks.map(t => t.id === task.id ? {
        ...t,
        comments: t.comments?.filter(c => c.id !== commentId)
      } : t)
    }));

    await supabase.from("comments").delete().eq("id", commentId);
  },

}));