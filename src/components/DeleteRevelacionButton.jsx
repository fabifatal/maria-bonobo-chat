import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRevelaciones } from "../app/RevelacionesContext";
import { useToast } from "../app/ToastContext";

export default function DeleteRevelacionButton({ revelacion }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { remove, operationStates } = useRevelaciones();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleDelete = async () => {
    const result = await remove(revelacion.id);
    
    if (result.success) {
      showSuccess("Revelación eliminada exitosamente");
      navigate("/revelaciones");
    } else {
      showError(result.error || "Error al eliminar la revelación");
    }
  };

  const confirmDelete = () => {
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={confirmDelete}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        disabled={operationStates.remove.loading}
        title="Eliminar revelación"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        {operationStates.remove.loading ? "Eliminando..." : "Eliminar"}
      </button>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
              Confirmar eliminación
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              ¿Estás seguro de que quieres eliminar la revelación <strong>"{revelacion.title}"</strong>? 
              Esta acción no se puede deshacer.
            </p>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={operationStates.remove.loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={operationStates.remove.loading}
              >
                {operationStates.remove.loading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>

            {operationStates.remove.error && (
              <p className="text-red-500 text-sm mt-3 text-center">
                Error: {operationStates.remove.error}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
