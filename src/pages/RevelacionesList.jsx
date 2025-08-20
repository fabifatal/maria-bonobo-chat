import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRevelaciones } from "../app/RevelacionesContext";
import { useAuth } from "../app/AuthContext";
import RevelacionItemActions from "../components/RevelacionItemActions";

export default function RevelacionesList() {
  const { list, loadList, create, operationStates } = useRevelaciones();
  const { state: authState, logout } = useAuth();
  const navigate = useNavigate();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useEffect(() => {
    // Solo cargar si hay un usuario autenticado
    if (authState.userId && !authState.loading) {
      loadList();
    }
  }, [loadList, authState.userId, authState.loading]);

  const handleCreateNewChat = async () => {
    if (isCreatingChat) return; // Prevenir múltiples clics
    
    setIsCreatingChat(true);
    try {
      const result = await create({ title: "Sin título" });
      
      if (result.success) {
        // Ir directo al chat de la nueva conversación
        navigate(`/revelaciones/${result.data.id}/chat`);
      } else {
        // Mostrar error si falla la creación
        console.error("Error creando conversación:", result.error);
        // Aquí podrías mostrar un toast de error si tienes un sistema de notificaciones
      }
    } catch (error) {
      console.error("Error inesperado creando conversación:", error);
      // Aquí podrías mostrar un toast de error si tienes un sistema de notificaciones
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Si no hay usuario autenticado, mostrar mensaje
  if (!authState.userId && !authState.loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Acceso requerido
        </h2>
        <p className="text-gray-600 mb-6">
          Necesitas iniciar sesión para ver tus conversaciones
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          Ir al login
        </Link>
      </div>
    );
  }

  // Estados de renderizado
  if (operationStates.loadList.loading && !list.length) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600" role="status">
            Cargando tus conversaciones...
          </p>
        </div>
      </div>
    );
  }

  if (operationStates.loadList.error && !list.length) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h2>
        <p className="text-gray-600 mb-4" role="alert">
          {operationStates.loadList.error}
        </p>
        <button
          onClick={loadList}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!list.length) {
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header con logout */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Conversaciones</h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, {authState.user?.nombre || 'Usuario'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="px-4 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                title="Cerrar sesión"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Estado vacío mejorado */}
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="max-w-md mx-auto">
              {/* Ícono ilustrativo */}
              <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              {/* Título y descripción */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                ¡Comienza tu primera conversación!
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Crea tu primera conversación para empezar a chatear. Puedes crear tantas como quieras y organizarlas como prefieras.
              </p>
              
              {/* Botón principal de creación */}
              <button
                onClick={handleCreateNewChat}
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isCreatingChat}
              >
                {isCreatingChat ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando conversación...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Crear mi primera conversación
                  </div>
                )}
              </button>
              
              {/* Información adicional */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  💡 <strong>Tip:</strong> Puedes crear múltiples conversaciones para diferentes temas o proyectos
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header con logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Conversaciones</h1>
            <p className="text-gray-600 mt-1">
              Bienvenido, {authState.user?.nombre || 'Usuario'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              title="Cerrar sesión"
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
            <button
              onClick={handleCreateNewChat}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium flex items-center"
              disabled={operationStates.create.loading}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {operationStates.create.loading ? "Creando..." : "Nueva conversación"}
            </button>
          </div>
        </div>

        {/* Lista de conversaciones */}
        <div className="space-y-4">
          {list.map((revelacion) => (
            <div
              key={`revelacion-${revelacion.id}`}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Link
                    to={`/revelaciones/${revelacion.id}/chat`}
                    className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {revelacion.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {revelacion.messages?.length || 0} mensajes
                  </p>
                </div>
                <RevelacionItemActions revelacion={revelacion} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
