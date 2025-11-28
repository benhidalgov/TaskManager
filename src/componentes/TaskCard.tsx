import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Task, Priority } from "../types";
import { useKanbanStore } from "../store";

interface Props {
  task: Task;
  index: number;
}

const TaskCard = ({ task, index }: Props) => {
  const { deleteTask, updateTask, updateTaskPriority, profiles } = useKanbanStore();
  
  const assignee = profiles.find(p => p.id === task.assigneeId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(task.content);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  const handleSave = () => {
    if (!content.trim()) return;
    updateTask(task.id, content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const handlePriorityChange = (newPriority: Priority) => {
    updateTaskPriority(task.id, newPriority);
    setShowPriorityMenu(false);
  };

  // Format timestamp
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  // Priority color dot
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      case 'medium': return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]';
      case 'low': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
      default: return 'bg-zinc-500';
    }
  };

  const getPriorityLabel = () => {
    switch (task.priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Sin prioridad';
    }
  };

  // EDITING MODE
  if (isEditing) {
    return (
      <div className="bg-dark-surface p-4 rounded-xl border border-brand shadow-neon animate-in fade-in zoom-in duration-200">
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full text-sm text-white outline-none resize-none bg-transparent placeholder-text-tertiary font-sans"
          rows={3}
        />
      </div>
    );
  }

  // DISPLAY MODE - Dark Neon Widget Style
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onDoubleClick={() => setIsEditing(true)}
          className={`
            group relative
            bg-dark-surface rounded-xl p-5
            border border-dark-border
            cursor-grab active:cursor-grabbing
            transition-all duration-300
            animate-in fade-in slide-in-from-bottom-2
            hover:border-brand/50 hover:shadow-neon
            ${
              snapshot.isDragging
                ? "shadow-neon-hover scale-105 rotate-1 z-50 border-brand bg-dark-card"
                : "shadow-card"
            }
          `}
          style={{
            ...provided.draggableProps.style,
            animationDelay: `${index * 50}ms`,
          }}
        >
          {/* Priority Dot - Top Left - Clickable */}
          {task.priority && (
            <div className="absolute top-3 left-3 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPriorityMenu(!showPriorityMenu);
                }}
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center
                  hover:bg-white/5 transition-all cursor-pointer
                  ${showPriorityMenu ? 'bg-white/10 ring-1 ring-brand' : ''}
                `}
                title={`Prioridad: ${getPriorityLabel()} - Click para cambiar`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${getPriorityColor()} ${showPriorityMenu ? 'scale-125' : ''} transition-transform`} />
              </button>
              
              {/* Priority Menu with Backdrop */}
              {showPriorityMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPriorityMenu(false);
                    }}
                  />
                  
                  <div className="absolute top-8 left-0 bg-dark-card border border-dark-border rounded-xl shadow-card-hover p-2 z-50 min-w-[160px] animate-in fade-in zoom-in duration-200">
                    <div className="text-xs font-bold text-brand mb-2 px-2 uppercase tracking-wider">
                      Prioridad
                    </div>
                    {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                      <button
                        key={p}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePriorityChange(p);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1
                          hover:bg-white/5 transition-all text-left
                          ${task.priority === p ? 'bg-brand/10 border border-brand/30' : 'border border-transparent'}
                        `}
                      >
                        <div className={`
                          w-2 h-2 rounded-full
                          ${p === 'high' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : p === 'medium' ? 'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]'}
                        `} />
                        <span className="text-sm text-text-primary font-medium flex-1">
                          {p === 'high' ? 'Alta' : p === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="mt-1 ml-6 mb-8">
            <p className="text-base font-medium text-text-primary leading-relaxed break-words">
              {task.content}
            </p>
          </div>

          {/* Assignee Avatar */}
          {assignee && (
            <div className="absolute bottom-3 left-3" title={`Asignado a: ${assignee.email}`}>
              <div className="w-6 h-6 rounded-full bg-brand/20 border border-brand flex items-center justify-center text-xs text-brand-light font-bold">
                {assignee.email.substring(0, 2).toUpperCase()}
              </div>
            </div>
          )}

          {/* Footer: Timestamp & Delete Button */}
          <div className="absolute bottom-3 right-3 flex items-center gap-3">
            {/* Timestamp */}
            <span className="text-xs text-text-tertiary font-medium">
              {task.createdAt ? formatDate(task.createdAt) : ''}
            </span>

            {/* Delete Button WITH TEXT */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
              className="
                opacity-0 group-hover:opacity-100
                flex items-center gap-1.5
                bg-dark-bg hover:bg-red-500/10 
                text-text-tertiary hover:text-red-400
                px-2 py-1 rounded-md transition-all border border-dark-border
                hover:border-red-500/30
                text-xs font-medium
              "
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;