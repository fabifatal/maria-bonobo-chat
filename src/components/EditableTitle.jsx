import React, { useState, useEffect } from "react";
import { useRevelaciones } from "../app/RevelacionesContext";
import { useToast } from "../app/ToastContext";

export default function EditableTitle({ revelacion, onTitleChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(revelacion.title);
  const [errors, setErrors] = useState({});
  const { update, operationStates } = useRevelaciones();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    setTitle(revelacion.title);
  }, [revelacion.title]);

  const validateTitle = () => {
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

  const handleSave = async () => {
    if (!validateTitle()) return;

    const result = await update(revelacion.id, { title: title.trim() });
    
    if (result.success) {
      showSuccess("Título guardado exitosamente");
      setIsEditing(false);
      if (onTitleChange) {
        onTitleChange(result.data);
      }
    } else {
      showError(result.error || "Error al guardar el título");
    }
  };

  const handleCancel = () => {
    setTitle(revelacion.title);
    setErrors({});
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full text-3xl font-bold text-gray-900 border-b-2 focus:outline-none focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ingresa el título"
              maxLength={80}
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {title.length}/80 caracteres
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={operationStates.update.loading || !title.trim() || title === revelacion.title}
            >
              {operationStates.update.loading ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={operationStates.update.loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between group">
        <h1 className="text-3xl font-bold text-gray-900">{revelacion.title}</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          title="Editar título"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
