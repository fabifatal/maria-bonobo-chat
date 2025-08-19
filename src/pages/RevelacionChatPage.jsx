import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRevelaciones } from '../app/RevelacionesContext';
import { useToast } from '../app/ToastContext';

const RevelacionChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { byId, loadById, update, operationStates } = useRevelaciones();
  const { showSuccess, showError } = useToast();
  
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: 'Soy María Bonobo. ¿Qué alma canta hoy? ✨' },
  ]);
  const [input, setInput] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');
  const [item, setItem] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!byId[id]) {
      loadById(id).then((data) => {
        if (mounted && data) {
          setItem(data);
          setTitle(data.title);
        }
      });
    } else {
      setItem(byId[id]);
      setTitle(byId[id].title);
    }
    return () => {
      mounted = false;
    };
  }, [id, byId, loadById]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    const assistantMsg = { role: 'assistant', content: 'respuesta simulada.' };
    
    setMsgs((m) => [...m, userMsg, assistantMsg]);
    setInput('');
  };

  const handleTitleSave = async () => {
    if (!title.trim() || title === item.title) {
      setIsEditingTitle(false);
      return;
    }

    const result = await update(id, { title: title.trim() });
    
    if (result.success) {
      showSuccess("Título actualizado exitosamente");
      setItem(result.data);
      setIsEditingTitle(false);
    } else {
      showError(result.error || "Error al actualizar el título");
    }
  };

  const handleTitleCancel = () => {
    setTitle(item.title);
    setIsEditingTitle(false);
  };

  if (operationStates.loadById.loading && !item) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando conversación...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Conversación no encontrada</h2>
        <Link
          to="/revelaciones"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          Volver a revelaciones
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/revelaciones"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a revelaciones
        </Link>
        
        {/* Título editable */}
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none focus:border-blue-600"
                placeholder="Ingresa el título"
                maxLength={80}
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleTitleSave}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={operationStates.update.loading || !title.trim()}
                >
                  {operationStates.update.loading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  onClick={handleTitleCancel}
                  className="px-3 py-1 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={operationStates.update.loading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {item.title === "Sin título" ? (
                  <span className="text-gray-500 italic">{item.title}</span>
                ) : (
                  item.title
                )}
              </h1>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                title="Editar título"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          Creada: {new Date(item.createdAt).toLocaleString("es-ES")}
        </p>
      </div>

      {/* Chat */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={send} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Escribe un mensaje"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe tu mensaje..."
          />
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enviar
          </button>
        </form>
      </div>

      {/* Indicador de carga para operaciones en segundo plano */}
      {operationStates.update.loading && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-md shadow-lg text-sm">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
            <span>Guardando título...</span>
          </div>
        </div>
      )}
    </main>
  );
};

export default RevelacionChatPage;
