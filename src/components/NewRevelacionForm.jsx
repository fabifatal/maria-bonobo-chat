import React, { useState } from "react";
import { useRevelaciones } from "../app/RevelacionesContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../app/ToastContext";

export default function NewRevelacionForm({ onClose }) {
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const { create, operationStates } = useRevelaciones();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (title.length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres";
    } else if (title.length > 80) {
      newErrors.title = "El título no puede exceder 80 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await create({ title: title.trim() });
    
    if (result.success) {
      showSuccess("Revelación creada exitosamente");
      
      // Cerrar formulario y navegar al detalle
      onClose();
      navigate(`/revelaciones/${result.data.id}`);
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
        <h2 className="text-xl font-semibold mb-4">Nueva Revelación</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ingresa el título de la revelación"
              maxLength={80}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {title.length}/80 caracteres
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={operationStates.create.loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={operationStates.create.loading || !title.trim()}
            >
              {operationStates.create.loading ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>

        {operationStates.create.error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            Error: {operationStates.create.error}
          </p>
        )}
      </div>
    </div>
  );
}
