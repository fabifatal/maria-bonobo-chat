import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRevelaciones } from "../app/RevelacionesContext";
import { useToast } from "../app/ToastContext";

export default function RevelacionItemActions({ revelacion }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { remove, operationStates } = useRevelaciones();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleContinueChat = () => {
    navigate(`/revelaciones/${revelacion.id}/chat`);
  };

  const handleDelete = async () => {
    const result = await remove(revelacion.id);
    
    if (result.success) {
      showSuccess("Revelación eliminada exitosamente");
      setShowDeleteConfirm(false);
    } else {
      showError(result.error || "Error al eliminar la revelación");
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Botón Continuar conversación */}
      <button
        onClick={handleContinueChat}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
        title="Continuar conversación"
      >
        Continuar conversación
      </button>

      {/* Botón Eliminar */}
      <button
        onClick={confirmDelete}
        className="text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
        title="Eliminar revelación"
        disabled={operationStates.remove.loading}
      >
        Eliminar
      </button>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar la revelación "{revelacion.title}"? 
              Esta acción no se puede deshacer.
            </p>
            
            <div className="flex justify-end space-x-3">
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
    </div>
  );
}
