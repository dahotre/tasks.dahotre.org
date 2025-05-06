import React, { useEffect, useState, useRef } from "react";
import EisenhowerMatrix from "./components/EisenhowerMatrix";
import AuthModal from "./components/AuthModal";

function Logo() {
  // Inline SVG from favicon.svg
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="w-8 h-8">
      <circle cx="32" cy="32" r="28" fill="#2563eb" />
      <path d="M20 34l8 8 16-16" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GearIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function HeaderMenu({ email, onSignOut }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent"
        aria-label="Settings"
        onClick={() => setOpen(o => !o)}
      >
        <GearIcon className="w-7 h-7 text-gray-700" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="divide-y divide-gray-200">
            <div className="px-4 py-3 text-sm text-gray-700 bg-gray-50 select-none cursor-default">{email}</div>
            <button
              className="w-full text-left px-4 py-3 text-sm text-red-600 font-medium hover:bg-red-50 transition bg-white"
              onClick={onSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    fetch("/api/auth/session", { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setAuthModalOpen(true);
        setLoading(false);
      });
  }, []);

  function handleLogout() {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .then(() => {
        setUser(null);
        setAuthModalOpen(true);
      });
  }

  if (loading) return null; // or a loading spinner

  return (
    <>
      {authModalOpen && (
        <AuthModal
          mode="login"
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={user => {
            setUser(user);
            setAuthModalOpen(false);
          }}
        />
      )}
      {user && (
        <>
          <header className="flex items-center justify-between px-6 py-1.5 bg-neutral-50 shadow h-14">
            <Logo />
            <HeaderMenu email={user.email} onSignOut={handleLogout} />
          </header>
          <EisenhowerMatrix user={user} />
        </>
      )}
    </>
  );
}

export default App;
