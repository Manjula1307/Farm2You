import { useState } from 'react';
import { Sprout, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ onSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('consumer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password, role, form.phone);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <Sprout size={28} />
            <span className="text-2xl font-bold">Farm2You</span>
          </div>
          <p className="text-green-100 text-sm">Direct from farm, no middlemen</p>
        </div>

        <div className="p-8">
          {/* Mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                  mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Role selector (register only) */}
          {mode === 'register' && (
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">I am a</label>
              <div className="flex gap-3">
                {['consumer', 'farmer'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                      role === r
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {r === 'consumer' ? '🛒 Consumer' : '🌾 Farmer'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-green-600 font-semibold hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
