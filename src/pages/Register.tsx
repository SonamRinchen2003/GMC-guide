import { useState, type FormEvent } from 'react';
import { supabase } from '../api/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email,
          full_name: null,
          role: 'user', // Default role for standard registration
          created_at: new Date().toISOString(),
        },
      ]);

      if (profileError) {
        console.error('Profile creation error:', profileError.message);
      }
    }

    setLoading(false);
    alert('Registration successful! Please check your email or login.');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-stone-50 p-6">
      <form 
        onSubmit={handleRegister} 
        className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-black mb-2 text-center text-emerald-900">Get Started</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Join Gelephu Mindfulness City</p>

        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Create Password" 
            className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button 
          disabled={loading}
          className="w-full mt-8 bg-emerald-600 text-white py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="mt-8 space-y-4 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-black hover:underline">Login</Link>
          </p>

          {/* Guide Application Link */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">Professional?</p>
            <Link 
              to="/register-guide" 
              className="text-xs text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full font-black hover:bg-emerald-100 transition-colors"
            >
              Apply as a Tour Guide →
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}