import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       
  const [loading, setLoading] = useState(true); 

  
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
      
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};