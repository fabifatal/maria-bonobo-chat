// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./app/AuthContext";
import { RevelacionesProvider } from "./app/RevelacionesContext";
import { ToastProvider } from "./app/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RevelacionesList from "./pages/RevelacionesList";
import RevelacionDetail from "./pages/RevelacionDetail";
import RevelacionChatPage from "./pages/RevelacionChatPage";

function App() {
  return (
    <AuthProvider>
      <RevelacionesProvider>
        <ToastProvider>
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
          <Route
            path="/revelaciones/:id/chat"
            element={
              <ProtectedRoute>
                <RevelacionChatPage />
              </ProtectedRoute>
            }
          />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </RevelacionesProvider>
    </AuthProvider>
  );
}

export default App;
