import React, { useState } from "react";
import { useRevelaciones } from "../app/RevelacionesContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../app/ToastContext";

export default function NewRevelacionForm({ onClose }) {
  const { create, operationStates } = useRevelaciones();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await create({ title: "Sin título" });
    
    if (result.success) {
      showSuccess("Revelación creada exitosamente");
      
      // Cerrar formulario y navegar a ChatPage
      onClose();
      navigate(`/revelaciones/${result.data.id}/chat`);
    } else {
      showError(result.error || "Error al crear la revelación");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Nueva Conversación</h2>
        
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Comienza una nueva conversación con María Bonobo. 
            Podrás establecer el título después de conversar.
          </p>
          
          <div className="flex justify-center space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={operationStates.create.loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={operationStates.create.loading}
            >
              {operationStates.create.loading ? "Creando..." : "Crear"}
            </button>
          </div>
        </div>

        {operationStates.create.error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            Error: {operationStates.create.error}
          </p>
        )}
      </div>
    </div>
  );
}
