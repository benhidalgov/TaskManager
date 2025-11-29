import { useState } from "react";
import { createPortal } from "react-dom";
import type { Priority } from "../types";

import { useKanbanStore } from "../store";

interface Props {
  onCreateTask?: (content: string, priority: Priority, columnId: string, assigneeId?: string) => void;
  isAdmin?: boolean;
}

const CreateTaskButton = ({ onCreateTask, isAdmin = false }: Props) => {
  const { profiles } = useKanbanStore();
  const [showModal, setShowModal] = useState(false);
  const [taskContent, setTaskContent] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const [selectedColumn, setSelectedColumn] = useState("col-1");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");

  const handleCreate = () => {
    if (taskContent.trim() && onCreateTask) {
      onCreateTask(taskContent, selectedPriority, selectedColumn, selectedAssignee || undefined);
      setTaskContent("");
      setSelectedPriority("medium");
      setSelectedColumn("col-1");
      setSelectedAssignee("");
      setShowModal(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
    if (e.key === "Escape") {
      setShowModal(false);
    }
  };

  return (
    <>
      {/* Navbar Button - Prominent Gradient Style */}
      <button
        onClick={() => setShowModal(true)}
        className="
          bg-gradient-brand
          text-white
          px-6 py-2.5 rounded-xl
          font-bold text-sm tracking-wide
          flex items-center gap-2
          shadow-neon hover:shadow-neon-hover
          transition-all duration-300
          hover:scale-105 hover:-translate-y-0.5
          border border-white/10
        "
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="hidden sm:inline">Nueva Tarea</span>
      </button>

      {/* Modal - Rendered via Portal to avoid z-index/transform issues */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-dark-card rounded-2xl shadow-card-hover border border-dark-border w-full max-w-md p-6 animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-dark-card z-10 pb-2 border-b border-dark-border/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-brand rounded-full"></span>
                Crear Nueva Tarea
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-tertiary hover:text-white transition-colors p-1 hover:bg-dark-surface rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Task Content */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Descripción de la tarea
              </label>
              <textarea
                autoFocus
                value={taskContent}
                onChange={(e) => setTaskContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="¿Qué necesitas hacer?"
                className="
                  w-full p-4 rounded-xl
                  bg-dark-surface border border-dark-border
                  text-white placeholder-text-tertiary
                  focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20
                  transition-all resize-none
                "
                rows={4}
              />
            </div>

            {/* Column Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Columna
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'col-1', label: 'Pendiente', color: 'bg-zinc-800 border-zinc-600 text-white' },
                  { id: 'col-2', label: 'En Progreso', color: 'bg-brand/20 border-brand text-brand-light' },
                  { id: 'col-3', label: 'Terminado', color: 'bg-accent/20 border-accent text-accent' },
                ].map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColumn(col.id)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all border
                      ${selectedColumn === col.id 
                        ? `${col.color} shadow-neon` 
                        : 'bg-dark-surface border-dark-border text-text-tertiary hover:text-white hover:border-text-tertiary'
                      }
                    `}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Prioridad
              </label>
              <div className="flex gap-3">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={`
                      flex-1 flex items-center justify-center gap-2
                      px-4 py-2.5 rounded-lg text-sm font-medium transition-all border
                      ${selectedPriority === p 
                        ? p === 'high' ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                        : p === 'medium' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                        : 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                        : 'bg-dark-surface border-dark-border text-text-tertiary hover:text-white hover:border-text-tertiary'
                      }
                    `}
                  >
                    <div className={`
                      w-2 h-2 rounded-full
                      ${p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
                    `} />
                    {p === 'high' ? 'Alta' : p === 'medium' ? 'Media' : 'Baja'}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee Selection - Only for Admins */}
            {isAdmin && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Asignar a (Opcional)
                </label>
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="
                    w-full p-3 rounded-xl
                    bg-dark-surface border border-dark-border
                    text-white
                    focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20
                    transition-all
                  "
                >
                  <option value="">Sin asignar</option>
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.email} ({profile.role === 'admin' ? 'Jefe' : 'Colaborador'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 sticky bottom-0 bg-dark-card pt-4 border-t border-dark-border/50">
              <button
                onClick={() => setShowModal(false)}
                className="
                  flex-1 px-4 py-3 rounded-xl
                  bg-dark-surface border border-dark-border
                  text-text-secondary font-medium
                  hover:border-text-tertiary hover:text-white
                  transition-all
                "
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!taskContent.trim()}
                className="
                  flex-1 px-4 py-3 rounded-xl
                  bg-gradient-brand
                  text-white font-bold tracking-wide
                  transition-all shadow-neon hover:shadow-neon-hover
                  hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                "
              >
                Crear Tarea
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CreateTaskButton;

