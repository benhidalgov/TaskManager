import { useState } from "react";
import { useKanbanStore } from "../store";
import type { Priority } from "../types";

const AdminPanel = () => {
  const { tasks, profiles, updateTaskAssignee, updateTaskPriority, deleteTask, columns } = useKanbanStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterColumn, setFilterColumn] = useState<string>("all");

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesColumn = filterColumn === "all" || task.columnId === filterColumn;
    return matchesSearch && matchesColumn;
  });

  const getColumnTitle = (colId: string | number) => {
    return columns.find(c => c.id === colId)?.title || String(colId);
  };

  return (
    <div className="p-6 max-w-[1920px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Panel de Administración</h2>
          <p className="text-text-secondary">Gestión centralizada de tareas y asignaciones</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar tarea..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dark-surface border border-dark-border rounded-xl px-4 py-2 text-white focus:border-brand outline-none w-full md:w-64"
          />
          <select
            value={filterColumn}
            onChange={(e) => setFilterColumn(e.target.value)}
            className="bg-dark-surface border border-dark-border rounded-xl px-4 py-2 text-white focus:border-brand outline-none"
          >
            <option value="all">Todas las columnas</option>
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-surface border-b border-dark-border">
                <th className="p-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Tarea</th>
                <th className="p-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Estado</th>
                <th className="p-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Prioridad</th>
                <th className="p-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Asignado a</th>
                <th className="p-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-white max-w-md truncate" title={task.content}>
                      {task.content}
                    </div>
                    <div className="text-xs text-text-tertiary mt-1">
                      ID: {task.id} • Creado: {new Date(task.createdAt || '').toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`
                      px-2.5 py-1 rounded-full text-xs font-medium border
                      ${task.columnId === 'col-1' ? 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400' :
                        task.columnId === 'col-2' ? 'bg-brand/10 border-brand/30 text-brand-light' :
                        'bg-green-500/10 border-green-500/30 text-green-400'}
                    `}>
                      {getColumnTitle(task.columnId)}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={task.priority || 'medium'}
                      onChange={(e) => updateTaskPriority(task.id, e.target.value as Priority)}
                      className={`
                        bg-transparent border-none text-sm font-medium cursor-pointer focus:ring-0
                        ${task.priority === 'high' ? 'text-red-400' : 
                          task.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'}
                      `}
                    >
                      <option value="high" className="bg-dark-card text-red-400">Alta</option>
                      <option value="medium" className="bg-dark-card text-yellow-400">Media</option>
                      <option value="low" className="bg-dark-card text-green-400">Baja</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={task.assigneeId || ""}
                        onChange={(e) => updateTaskAssignee(task.id, e.target.value || null)}
                        className="
                          bg-dark-bg border border-dark-border rounded-lg px-3 py-1.5 
                          text-sm text-white focus:border-brand outline-none
                          min-w-[150px]
                        "
                      >
                        <option value="">Sin asignar</option>
                        {profiles.map((profile) => (
                          <option key={profile.id} value={profile.id}>
                            {profile.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de eliminar esta tarea?')) {
                          deleteTask(task.id);
                        }
                      }}
                      className="p-2 text-text-tertiary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Eliminar tarea"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-tertiary">
                    No se encontraron tareas que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
