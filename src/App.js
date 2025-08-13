// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./app/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RevelacionesList from "./pages/RevelacionesList";
import RevelacionDetail from "./pages/RevelacionDetail";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Público */}
          <Route path="/" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protegido */}
          <Route
            path="/revelaciones"
            element={
              <ProtectedRoute>
                <RevelacionesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revelaciones/:id"
            element={
              <ProtectedRoute>
                <RevelacionDetail />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
