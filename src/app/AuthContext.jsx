import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLogin, postRegister } from '../api';

const AuthCtx = createContext({
  state: { user: null, token: null, loading: true },
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearToken: () => {},
  isTokenValid: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({ user: null, token: null, loading: true });

  // Función para limpiar token y usuario
  const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ user: null, token: null, loading: false });
  };

  // Función para verificar si el token es válido
  const isTokenValid = (token) => {
    if (!token) return false;
    
    // Para tokens de sesión simple, verificar formato básico
    if (token.startsWith('session_')) {
      // Extraer timestamp del token (formato: session_email_timestamp_random)
      const parts = token.split('_');
      if (parts.length >= 3) {
        const timestamp = parseInt(parts[2]);
        const currentTime = Date.now();
        const tokenAge = currentTime - timestamp;
        
        // Token expira después de 24 horas (86400000 ms)
        const maxAge = 24 * 60 * 60 * 1000;
        
        if (tokenAge > maxAge) {
          console.log('Token expirado, limpiando...');
          clearToken();
          return false;
        }
        return true;
      }
    }
    
    return false;
  };

  // Función para limpiar token expirado
  const cleanupExpiredToken = () => {
    const token = localStorage.getItem('token');
    if (token && !isTokenValid(token)) {
      console.log('Limpiando token expirado...');
      clearToken();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // Verificar si el token es válido antes de establecer el estado
    if (token && isTokenValid(token)) {
      setState({ 
        user: user ? JSON.parse(user) : null, 
        token, 
        loading: false 
      });
    } else {
      // Si el token no es válido, limpiarlo
      if (token) {
        clearToken();
      } else {
        setState({ user: null, token: null, loading: false });
      }
    }
  }, []);

  // Limpiar token expirado cada 5 minutos
  useEffect(() => {
    const interval = setInterval(cleanupExpiredToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
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

  const register = async (_email, _password, _nombre) => {
    try {
      // MVP stub: reemplazar por Auth real en el Día 3
      const { data, error } = await postRegister({
        email: _email,
        password: _password,
        nombre: _nombre
      });
      
      if (error) throw error;
      if (!data) throw new Error('No se pudo crear la cuenta');
      
      // Después del registro exitoso, hacer login automáticamente
      await login(_email, _password);
    } catch (err) {
      console.error('Error en registro:', err);
      throw err;
    }
  };

  const logout = () => {
    clearToken();
  };

  return (
    <AuthCtx.Provider value={{ 
      state, 
      login, 
      register,
      logout, 
      clearToken, 
      isTokenValid 
    }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);