import React, { useState } from 'react';

function AuthModal({ mode, onClose, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState(mode || 'login'); // 'login' or 'register'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full rounded-xl px-3 py-2 bg-gray-100 text-gray-800 text-base placeholder-gray-400 placeholder:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition pr-10"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none bg-transparent shadow-none border-0 p-0"
                tabIndex={0}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.122-2.122A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-2.122 2.122A9.956 9.956 0 0112 21c-2.21 0-4.267-.72-5.947-1.947m0 0L3 21m0 0l2.053-2.053" /></svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0a9.77 9.77 0 01-1.5 3.5c-1.5 2.5-4.5 5.5-9 5.5s-7.5-3-9-5.5A9.77 9.77 0 011.5 12c1.5-2.5 4.5-5.5 9-5.5s7.5 3 9 5.5z" /></svg>
                )}
              </button>
            </div>
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