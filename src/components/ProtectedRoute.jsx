import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();
  if (state.loading) return <div>Cargando…</div>;
  if (!state.token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;