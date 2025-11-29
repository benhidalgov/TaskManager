import { useState, useEffect } from 'react';
import { useKanbanStore } from '../store';

export default function TaskDetailModal() {
  const { 
    tasks, 
    activeTaskId, 
    setActiveTask, 
    updateTaskDescription, 
    updateTaskDueDate,
    fetchSubtasks,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    fetchComments,
    addComment,
    deleteComment,
    profiles
  } = useKanbanStore();

  const task = tasks.find(t => t.id === activeTaskId);
  const [description, setDescription] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

  useEffect(() => {
    if (task) {
      setDescription(task.description || '');
      fetchSubtasks(task.id);
      fetchComments(task.id);
    }
  }, [task?.id]);

  if (!task) return null;

  const handleSaveDescription = () => {
    updateTaskDescription(task.id, description);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    addSubtask(task.id, newSubtask);
    setNewSubtask('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(task.id, newComment);
    setNewComment('');
  };

  const getAssigneeName = (id?: string) => {
    if (!id) return 'Unassigned';
    const profile = profiles.find(p => p.id === id);
    return profile ? profile.email.split('@')[0] : 'Unknown';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-card w-full max-w-2xl rounded-2xl border border-dark-border shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-dark-border flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                task.priority === 'Alto' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                task.priority === 'Medio' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                'bg-green-500/10 text-green-400 border-green-500/20'
              }`}>
                {task.priority?.toUpperCase()}
              </span>
              <span className="text-text-secondary text-sm">
                {new Date(task.createdAt || '').toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{task.content}</h2>
          </div>
          <button 
            onClick={() => setActiveTask(null)}
            className="text-text-secondary hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-border px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details' 
                ? 'border-brand text-brand' 
                : 'border-transparent text-text-secondary hover:text-white'
            }`}
          >
            Detalles y subtareas
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'comments' 
                ? 'border-brand text-brand' 
                : 'border-transparent text-text-secondary hover:text-white'
            }`}
          >
            Comentarios ({task.comments?.length || 0})
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {activeTab === 'details' && (
            <div className="space-y-8">
              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-secondary">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleSaveDescription}
                  placeholder="Agregar descripción..."
                  className="w-full bg-dark-surface border border-dark-border rounded-xl p-4 text-text-primary focus:border-brand focus:ring-1 focus:ring-brand outline-none min-h-[120px] resize-y"
                />
              </div>

              {/* Subtasks */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-secondary">Subtasks</label>
                  <span className="text-xs text-text-tertiary">
                    {task.subtasks?.filter(s => s.isCompleted).length || 0} / {task.subtasks?.length || 0} completed
                  </span>
                </div>
                
                {/* Progress Bar */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="h-1.5 bg-dark-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand transition-all duration-500"
                      style={{ width: `${(task.subtasks.filter(s => s.isCompleted).length / task.subtasks.length) * 100}%` }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  {task.subtasks?.map(subtask => (
                    <div key={subtask.id} className="flex items-start gap-3 group">
                      <button
                        onClick={() => toggleSubtask(subtask.id, !subtask.isCompleted)}
                        className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          subtask.isCompleted 
                            ? 'bg-brand border-brand text-white' 
                            : 'border-dark-border hover:border-brand'
                        }`}
                      >
                        {subtask.isCompleted && (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span className={`flex-1 text-sm ${subtask.isCompleted ? 'text-text-tertiary line-through' : 'text-text-primary'}`}>
                        {subtask.content}
                      </span>
                      <button 
                        onClick={() => deleteSubtask(subtask.id)}
                        className="text-text-tertiary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddSubtask} className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Agregar subtarea..."
                    className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-brand outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={!newSubtask.trim()}
                    className="px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-text-secondary hover:text-brand hover:border-brand disabled:opacity-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-border">
                <div>
                  <label className="text-xs font-medium text-text-tertiary uppercase mb-1 block">Assignee</label>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center text-xs text-brand font-bold">
                      {getAssigneeName(task.assigneeId).slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm text-text-primary">{getAssigneeName(task.assigneeId)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-tertiary uppercase mb-1 block">Due Date</label>
                  <input 
                    type="date" 
                    value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => updateTaskDueDate(task.id, e.target.value ? new Date(e.target.value).toISOString() : null)}
                    className="bg-transparent text-sm text-text-primary outline-none focus:text-brand"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {task.comments?.map(comment => (
                  <div key={comment.id} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-xs font-bold text-text-secondary shrink-0">
                      {getAssigneeName(comment.userId).slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-primary">{getAssigneeName(comment.userId)}</span>
                        <span className="text-xs text-text-tertiary">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-text-secondary bg-dark-surface p-3 rounded-r-xl rounded-bl-xl border border-dark-border/50">
                        {comment.content}
                      </p>
                    </div>
                    {/* Only show delete if it's the current user's comment - logic needed in store/component but for now simple delete */}
                    <button 
                      onClick={() => deleteComment(comment.id)}
                      className="self-start text-text-tertiary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {(!task.comments || task.comments.length === 0) && (
                  <div className="text-center py-8 text-text-tertiary">
                    No comments yet. Start the conversation!
                  </div>
                )}
              </div>

              <form onSubmit={handleAddComment} className="sticky bottom-0 bg-dark-card pt-4 border-t border-dark-border mt-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-dark-surface border border-dark-border rounded-xl pl-4 pr-12 py-3 text-sm text-text-primary focus:border-brand outline-none shadow-lg"
                  />
                  <button 
                    type="submit"
                    disabled={!newComment.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-brand hover:bg-brand/10 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
