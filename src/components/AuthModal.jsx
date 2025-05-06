import React, { useState } from 'react';

function AuthModal({ mode, onClose, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState(mode || 'login'); // 'login' or 'register'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      onAuthSuccess(data.user);
      onClose();
    } else {
      setError(data.error || 'Something went wrong');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 transition-all duration-300">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6 relative font-sans transition-all duration-300">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-2xl rounded-full transition p-1 border-0 bg-transparent shadow-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-base font-semibold mb-4 text-gray-800 tracking-wide">{authMode === 'login' ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-xs font-medium mb-1 text-gray-500">Email</label>
            <input
              id="auth-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-xl px-3 py-2 bg-gray-100 text-gray-800 text-base placeholder-gray-400 placeholder:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="block text-xs font-medium mb-1 text-gray-500">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-xl px-3 py-2 bg-gray-100 text-gray-800 text-base placeholder-gray-400 placeholder:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
          </div>
          {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
          <button
            className="w-full px-3 py-1.5 rounded-full bg-blue-500 text-white font-semibold text-[10px] hover:bg-blue-600 transition shadow-none mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (authMode === 'login' ? 'Logging in...' : 'Registering...') : (authMode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 font-medium text-[10px] hover:bg-gray-200 transition shadow-none"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-3 py-1.5 rounded-full bg-white border border-blue-300 text-blue-700 font-medium text-[10px] hover:bg-blue-50 transition shadow-none"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            type="button"
          >
            {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal; 