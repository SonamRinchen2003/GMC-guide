import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../api/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      const role = profile?.role ? String(profile.role).toLowerCase() : 'user';

      if (role === 'admin') navigate('/admin-dashboard', { replace: true });
      else if (role === 'guide') navigate('/guide-dashboard', { replace: true });
      else navigate('/userdashboard', { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* BACKGROUND WITH OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover grayscale brightness-[0.2]" 
          alt="Background"
        />
        <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm" />
      </div>

      {/* HEADER SECTION */}
      <div className="relative z-10 text-center mb-8 animate-in fade-in zoom-in duration-700">
        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">GMC Guide</h1>
        <p className="text-emerald-100/60 font-medium tracking-tight">Your trusted partner in professional services.</p>
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-white/20">
          <header className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-emerald-950 tracking-tighter mb-2">Login</h2>
            <p className="text-gray-500 font-medium">Welcome back. Please enter your details.</p>
          </header>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-black rounded-2xl border border-red-100 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉</span>
                <input
                  type="email"
                  placeholder="sonam@gmail.com"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 border border-transparent transition-all font-bold text-emerald-950"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter hover:underline">Forgot Password?</button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 border border-transparent transition-all font-bold text-emerald-950"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-emerald-950 text-white py-5 rounded-2xl font-black hover:bg-emerald-800 disabled:opacity-50 shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-3 text-lg"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Login →'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center space-y-6">
            <p className="text-gray-400 font-bold text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-950 font-black hover:underline">Register</Link>
            </p>
            
            <div className="bg-emerald-50/50 p-6 rounded-4xl border border-emerald-100">
              <p className="text-emerald-800 text-[11px] font-black uppercase tracking-widest mb-3">Are you a professional Guide?</p>
              <Link 
                to="/register-guide" 
                className="inline-block w-full px-6 py-4 bg-emerald-900 text-white rounded-2xl font-black text-xs hover:bg-emerald-800 transition-all shadow-md"
              >
                Apply as Tour Guide
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER LINKS */}
      <footer className="relative z-10 mt-12 flex gap-8 text-[10px] font-black text-emerald-100/40 uppercase tracking-[0.2em]">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-white transition-colors">Contact Support</a>
      </footer>
    </div>
  );
}