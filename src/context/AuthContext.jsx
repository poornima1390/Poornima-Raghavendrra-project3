import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // { username } or null
  const [loading, setLoading] = useState(true); // true while checking session on load

  // On app load, ask the backend if there is a valid session cookie
  useEffect(() => {
    fetch('/api/user/isLoggedIn', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then((data) => setUser({ username: data.username }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Called by Login and Register pages after a successful API response
  const login = (username) => setUser({ username });

  // Called by the Navbar logout button
  const logout = async () => {
    await fetch('/api/user/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {/* Don't render children until we know if user is logged in —
          prevents a flash of logged-out UI on page refresh */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook — import this in any component that needs auth state
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};