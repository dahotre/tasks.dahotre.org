import React, { useEffect, useState } from "react";
import EisenhowerMatrix from "./components/EisenhowerMatrix";
import AuthModal from "./components/AuthModal";

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
          <header className="flex items-center justify-between px-6 py-3 bg-white shadow">
            <span className="text-sm text-gray-700">Welcome, {user.email}</span>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </header>
          <EisenhowerMatrix user={user} />
        </>
      )}
    </>
  );
}

export default App;
