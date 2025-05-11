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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">  
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
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