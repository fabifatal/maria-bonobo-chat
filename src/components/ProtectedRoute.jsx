import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { state, isTokenValid, clearToken } = useAuth();
  
  if (state.loading) return <div>Cargando…</div>;
  
  // Verificar si el token es válido
  if (!state.token || !isTokenValid(state.token)) {
    // Si el token no es válido, limpiarlo y redirigir al login
    if (state.token) {
      clearToken();
    }
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;