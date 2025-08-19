import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRevelaciones } from "../app/RevelacionesContext";
import NewRevelacionForm from "../components/NewRevelacionForm";
import RevelacionItemActions from "../components/RevelacionItemActions";

export default function RevelacionesList() {
  const { list, loadList, operationStates } = useRevelaciones();
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowNewForm = () => {
    setShowNewForm(true);
  };

  const handleCloseNewForm = () => {
    setShowNewForm(false);
  };

  // Estados de renderizado
  if (operationStates.loadList.loading && !list.length) {
    return (
              <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" role="status">
              Cargando revelaciones...
            </p>
          </div>
        </div>
    );
  }

  if (operationStates.loadList.error && !list.length) {
    return (
      <div className="text-center py-12">
                  <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Error al cargar
        </h2>
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
      <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No hay revelaciones
        </h2>
        <p className="text-gray-600 mb-6">
          Comienza creando tu primera revelación
        </p>
        <button
          onClick={handleShowNewForm}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          Crear primera revelación
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Revelaciones</h1>
        <button
          onClick={handleShowNewForm}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium flex items-center"
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
          Nueva revelación
        </button>
      </div>

      {/* Lista de revelaciones */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {list.map((revelacion, index) => (
            <li
              key={
                revelacion.id ??
                revelacion._id ??
                revelacion.uuid ??
                `${revelacion.title}-${revelacion.createdAt}-${index}`
              }
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/revelaciones/${revelacion.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors block truncate"
                  >
                    {revelacion.title}
                  </Link>
                                      <div className="flex items-center mt-2 text-sm text-gray-500">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(revelacion.createdAt).toLocaleString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                </div>

                {/* Acciones */}
                <RevelacionItemActions revelacion={revelacion} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Indicador de carga para operaciones en segundo plano */}
      {(operationStates.create.loading ||
        operationStates.update.loading ||
        operationStates.remove.loading) && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-md shadow-lg text-sm">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
            <span>
              {operationStates.create.loading && "Creando..."}
              {operationStates.update.loading && "Actualizando..."}
              {operationStates.remove.loading && "Eliminando..."}
            </span>
          </div>
        </div>
      )}

      {/* Formulario de nueva revelación */}
      {showNewForm && <NewRevelacionForm onClose={handleCloseNewForm} />}
    </div>
  );
}
