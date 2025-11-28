import { useState } from "react";
import { supabase } from "../supabase";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Password Strength Calculation
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 5) strength += 1;
    if (pass.length > 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (activeTab === 'register') {
        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: '¡Registro exitoso! Revisa tu correo para confirmar.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Ocurrió un error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand/30 rounded-full blur-[120px] animate-blob mix-blend-multiply filter" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/30 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply filter" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply filter" />
      </div>

      <div className="w-full max-w-md relative z-10 perspective-1000">
        <div className="bg-dark-card/80 border border-white/10 shadow-2xl rounded-3xl p-8 backdrop-blur-xl transform transition-all duration-500 hover:shadow-neon/50">
          
          {/* Header & Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 hover:rotate-6 transition-transform duration-300">
              <svg className="w-10 h-10 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Neon<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">Board</span>
            </h1>
            <p className="text-text-secondary text-sm font-medium">
              Gestión de tareas de próxima generación
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-dark-bg/50 rounded-xl mb-8 relative">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-dark-surface rounded-lg shadow-sm transition-all duration-300 ease-out ${activeTab === 'login' ? 'left-1' : 'left-[calc(50%+4px)]'}`}
            />
            <button
              onClick={() => { setActiveTab('login'); setMessage(null); }}
              className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-300 ${activeTab === 'login' ? 'text-white' : 'text-text-tertiary hover:text-text-secondary'}`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setActiveTab('register'); setMessage(null); }}
              className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-300 ${activeTab === 'register' ? 'text-white' : 'text-text-tertiary hover:text-text-secondary'}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {activeTab === 'register' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-dark-bg/50 border border-dark-border rounded-xl text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Correo Electrónico</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-dark-bg/50 border border-dark-border rounded-xl text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Contraseña</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-dark-bg/50 border border-dark-border rounded-xl text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {activeTab === 'register' && password && (
                <div className="flex gap-1 mt-2 h-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength ? (passwordStrength < 3 ? 'bg-red-500' : passwordStrength === 3 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-dark-border'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {activeTab === 'register' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Confirmar Contraseña</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-dark-bg/50 border border-dark-border rounded-xl text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium animate-in zoom-in duration-200 ${
                message.type === 'success' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3.5 px-4 mt-2
                bg-gradient-to-r from-brand to-accent
                hover:from-brand-hover hover:to-accent-hover
                text-white font-bold rounded-xl shadow-lg shadow-brand/20
                transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                flex justify-center items-center
              "
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                activeTab === 'login' ? 'Entrar al Tablero' : 'Crear Cuenta'
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-dark-card px-2 text-text-tertiary">O continúa con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center px-4 py-2 border border-dark-border rounded-xl bg-dark-bg/50 hover:bg-white/5 transition-colors text-white text-sm font-medium gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Google
              </button>
              <button type="button" className="flex items-center justify-center px-4 py-2 border border-dark-border rounded-xl bg-dark-bg/50 hover:bg-white/5 transition-colors text-white text-sm font-medium gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-text-tertiary/50">
          &copy; {new Date().getFullYear()} NeonBoard. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;