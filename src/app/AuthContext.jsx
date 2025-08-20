import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLogin } from '../api';

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

  const login = async (_email, _password) => {
    // MVP stub: reemplazar por Auth real en el Día 3
    const { data, error } = await getLogin(_email, _password);
    console.log("data", data);
    console.log("error", error);
    if (error) throw error;
    if (!data) throw new Error('No se pudo obtener el token');
    if (data.length === 0) throw new Error('Credenciales inválidas');
    const { email, nombre } = data[0];
    // For MVP, create a simple session token (not JWT)
    const sessionToken = `session_${email}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem('token', sessionToken);
    localStorage.setItem('user', JSON.stringify({ id: 'u1', email, nombre }));
    setState({ user: { id: 'u1', email, nombre }, token: sessionToken, loading: false });
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