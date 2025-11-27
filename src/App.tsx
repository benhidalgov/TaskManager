import { useEffect, useState } from "react";
// Importación corregida: DragDropContext es valor, DropResult es tipo
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"; 
import { useKanbanStore } from "./store";
import Column from "./componentes/Column"; 
import Login from "./componentes/login";
import ToastContainer from "./componentes/ToastContainer";
import FloatingActionButton from "./componentes/FloatingActionButton";
import { supabase } from "./supabase";

function App() {
  const { columns, tasks, moveTask, fetchTasks } = useKanbanStore();
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. Efecto para manejar la sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) fetchTasks();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTasks();
    });

    return () => subscription.unsubscribe();
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    moveTask(
      draggableId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    useKanbanStore.setState({ tasks: [] });
  };

  // Get user initials for avatar
  const getUserInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.columnId === 'col-3').length;
    const inProgress = tasks.filter(t => t.columnId === 'col-2').length;
    const pending = tasks.filter(t => t.columnId === 'col-1').length;
    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  // Loading state
  if (authLoading) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-dark-border border-t-brand rounded-full animate-spin shadow-neon" />
        <p className="text-brand font-medium animate-pulse">Cargando...</p>
      </div>
    </div>
  );
  
  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col font-sans text-text-primary selection:bg-brand/30">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Enhanced Navbar */}
      <nav className="glass-dark sticky top-0 z-40 border-b border-dark-border/50">
        <div className="max-w-[1920px] mx-auto px-6 md:px-8 relative">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo & Stats */}
            <div className="flex items-center gap-8">
              {/* Logo - Simplified */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-neon group-hover:shadow-neon-hover transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">
                    Neon<span className="text-transparent bg-clip-text bg-gradient-brand">Board</span>
                  </h1>
                </div>
              </div>

              {/* Stats - Hidden on mobile */}
              <div className="hidden lg:flex items-center gap-6 ml-6 pl-8 border-l border-dark-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-600 shadow-[0_0_10px_rgba(82,82,91,0.5)]"></div>
                  <span className="text-sm text-text-secondary">
                    <span className="font-semibold text-white">{stats.pending}</span> Pendientes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand shadow-neon"></div>
                  <span className="text-sm text-text-secondary">
                    <span className="font-semibold text-white">{stats.inProgress}</span> En Progreso
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(217,70,239,0.5)]"></div>
                  <span className="text-sm text-text-secondary">
                    <span className="font-semibold text-white">{stats.completed}</span> Completadas
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Create Task Button (Desktop) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
              <FloatingActionButton 
                onCreateTask={(content, priority, columnId) => {
                  useKanbanStore.getState().addTask(columnId, content, priority);
                }}
              />
            </div>

            {/* Right: User & Mobile Action */}
            <div className="flex items-center gap-6">
              {/* Mobile Create Button (Visible only on mobile) */}
              <div className="md:hidden">
                <FloatingActionButton 
                  onCreateTask={(content, priority, columnId) => {
                    useKanbanStore.getState().addTask(columnId, content, priority);
                  }}
                />
              </div>

              {/* User Avatar & Info */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-white text-sm font-bold shadow-card ring-2 ring-transparent hover:ring-brand/50 transition-all">
                  {getUserInitials(session.user.email)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-white leading-none mb-1">
                    {session.user.email.split('@')[0]}
                  </p>
                  <button 
                    onClick={handleLogout}
                    className="text-xs text-text-secondary hover:text-accent transition-colors flex items-center gap-1"
                  >
                    Cerrar sesión
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar max-w-[1920px] mx-auto h-full items-start pt-4">
            {columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                tasks={tasks.filter((t) => t.columnId === col.id)}
              />
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}

export default App;