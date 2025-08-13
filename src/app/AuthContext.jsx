import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext({
  state: { user: null, token: null, loading: true },
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({ user: null, token: null, loading: true });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setState({ user: user ? JSON.parse(user) : null, token, loading: false });
  }, []);

  const login = async (email, _password) => {
    // MVP stub: reemplazar por Auth real en el Día 3
    const fakeToken = 'demo-token';
    const fakeUser = { id: 'u1', email };
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(fakeUser));
    setState({ user: fakeUser, token: fakeToken, loading: false });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ user: null, token: null, loading: false });
  };

  return (
    <AuthCtx.Provider value={{ state, login, logout }}>{children}</AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);