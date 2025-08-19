import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useRevelaciones } from "../app/RevelacionesContext";
import { useToast } from "../app/ToastContext";
import EditableTitle from "../components/EditableTitle";
import DeleteRevelacionButton from "../components/DeleteRevelacionButton";

export default function RevelacionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { byId, loadById, operationStates } = useRevelaciones();
  const { showError } = useToast();
  const [item, setItem] = useState(byId[id]);

  useEffect(() => {
    let mounted = true;
    if (!byId[id]) {
      loadById(id).then((data) => {
        if (mounted) {
          if (data) {
            setItem(data);
          } else {
            showError("Revelación no encontrada");
            navigate("/revelaciones");
          }
        }
      });
    } else {
      setItem(byId[id]);
    }
    return () => {
      mounted = false;
    };
  }, [id, byId, loadById, showError, navigate]);

  const handleTitleChange = (updatedRevelacion) => {
    setItem(updatedRevelacion);
  };

  // Estados de renderizado
  if (operationStates.loadById.loading && !item) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600" role="status">Cargando revelación...</p>
        </div>
      </div>
    );
  }

  if (operationStates.loadById.error && !item) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h2>
        <p className="text-gray-600 mb-4" role="alert">
          {operationStates.loadById.error}
        </p>
        <button
          onClick={() => loadById(id)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Revelación no encontrada</h2>
        <p className="text-gray-600 mb-6">La revelación que buscas no existe o fue eliminada.</p>
        <Link
          to="/revelaciones"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header con navegación */}
      <div className="mb-8">
        <Link
          to="/revelaciones"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a revelaciones
        </Link>
      </div>

      {/* Título editable */}
      <EditableTitle revelacion={item} onTitleChange={handleTitleChange} />

      {/* Información de la revelación */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Información</h2>
          <DeleteRevelacionButton revelacion={item} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Creada</label>
            <p className="text-sm text-gray-900">
              {new Date(item.createdAt).toLocaleString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <p className="text-sm text-gray-900 font-mono">{item.id}</p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mensajes</h2>
        
        {!item.messages?.length ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600">No hay mensajes en esta revelación.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {item.messages.map((message, index) => (
              <li key={`${message.role}-${message.ts ?? index}`} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        message.role === 'user' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {message.role === 'user' ? 'Usuario' : 'Asistente'}
                      </span>
                      {message.ts && (
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(message.ts).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900">{message.content || '...'}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Indicador de carga para operaciones en segundo plano */}
      {(operationStates.update.loading || operationStates.remove.loading) && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-md shadow-lg text-sm">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
            <span>
              {operationStates.update.loading && "Guardando..."}
              {operationStates.remove.loading && "Eliminando..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
