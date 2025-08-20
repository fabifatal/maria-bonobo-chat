import React, { createContext, useContext, useMemo, useState } from "react";
import { getUserRevelaciones, getRevelacion, postRevelacion, updateRevelacion as updateRevelacionAPI, deleteRevelacion as deleteRevelacionAPI } from "../api";
import { useCallback } from "react";
import { useAuth } from "./AuthContext";

const Ctx = createContext(null);

export function RevelacionesProvider({ children }) {
  const { state: authState } = useAuth();
  const [list, setList] = useState([]);
  const [byId, setById] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Individual operation states
  const [operationStates, setOperationStates] = useState({
    create: { loading: false, error: null },
    update: { loading: false, error: null },
    remove: { loading: false, error: null },
    loadList: { loading: false, error: null },
    loadById: { loading: false, error: null }
  });

  const setOperationState = useCallback((operation, state) => {
    setOperationStates(prev => ({
      ...prev,
      [operation]: { ...prev[operation], ...state }
    }));
  }, []);

  const loadList = useCallback(async () => {
    // Solo cargar si hay un usuario autenticado
    if (!authState.userId) {
      setList([]);
      setById({});
      return;
    }

    console.log('🔄 Cargando revelaciones para userId:', authState.userId);
    setLoading(true);
    setOperationState('loadList', { loading: true, error: null });
    
    try {
      const { data, error, status } = await getUserRevelaciones(authState.userId);
      console.log('📡 Respuesta de API:', { data, error, status });
      
      // Si es 404, significa que no hay revelaciones para este usuario (caso válido)
      if (status === 404) {
        console.log('ℹ️ No hay revelaciones (404) - caso válido');
        setList([]);
        setById({});
        setOperationState('loadList', { loading: false, error: null });
        setLoading(false);
        return;
      }
      
      if (error) {
        console.log('❌ Error en API:', error);
        setOperationState('loadList', { loading: false, error: error.message });
        setError(error.message);
        setLoading(false);
        return;
      }
      
      if (data) {
        console.log('✅ Revelaciones cargadas:', data);
        setList(data);
        setById((prev) => ({
          ...prev,
          ...Object.fromEntries(data.map((it) => [it.id, it])),
        }));
      } else {
        console.log('ℹ️ No hay datos en la respuesta');
        setList([]);
        setById({});
      }
      
      setOperationState('loadList', { loading: false, error: null });
    } catch (err) {
      console.error('💥 Error inesperado cargando revelaciones:', err);
      setOperationState('loadList', { loading: false, error: 'Error inesperado al cargar' });
      setError('Error inesperado al cargar');
    }
    
    setLoading(false);
  }, [authState.userId, setOperationState]);

  // Recargar la lista cuando cambie el userId
  React.useEffect(() => {
    loadList();
  }, [loadList]);

  const loadById = useCallback(
    async (id) => {
      if (byId[id]) return byId[id];
      setLoading(true);
      setOperationState('loadById', { loading: true, error: null });
      const { data, error } = await getRevelacion(id);
      if (error) {
        setOperationState('loadById', { loading: false, error: null });
        setError(error.message);
        setLoading(false);
        return null;
      }
      if (data) {
        setById((prev) => ({ ...prev, [id]: data }));
        setOperationState('loadById', { loading: false, error: null });
        setLoading(false);
        return data;
      }
      setOperationState('loadById', { loading: false, error: null });
      setLoading(false);
      return null;
    },
    [byId, setOperationState]
  );

  const create = useCallback(async (data) => {
    // Asegurar que se incluya el userId del usuario autenticado
    if (!authState.userId) {
      throw new Error('Usuario no autenticado');
    }

    const revelacionData = {
      ...data,
      userId: authState.userId
    };

    console.log('🆕 Creando revelación:', revelacionData);
    setLoading(true);
    setOperationState('create', { loading: true, error: null });
    
    try {
      const { data: newRevelacion, error, status } = await postRevelacion(revelacionData);
      console.log('📡 Respuesta de creación:', { newRevelacion, error, status });
      
      if (error || status >= 400) {
        const errorMessage = error?.message || `Error ${status}: No se pudo crear la conversación`;
        console.log('❌ Error creando revelación:', errorMessage);
        setOperationState('create', { loading: false, error: errorMessage });
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
      
      if (newRevelacion) {
        console.log('✅ Revelación creada exitosamente:', newRevelacion);
        // Verificar que no exista ya en la lista para evitar duplicados
        const exists = list.some(item => item.id === newRevelacion.id);
        if (!exists) {
          // Sync cache: add to list and byId
          setList((prev) => [...prev, newRevelacion]);
          setById((prev) => ({ ...prev, [newRevelacion.id]: newRevelacion }));
        }
        setOperationState('create', { loading: false, error: null });
        setLoading(false);
        return { success: true, data: newRevelacion };
      }
      
      const errorMessage = 'No se recibieron datos de la conversación creada';
      console.log('⚠️ Sin datos en respuesta:', errorMessage);
      setOperationState('create', { loading: false, error: errorMessage });
      setLoading(false);
      return { success: false, error: errorMessage };
    } catch (err) {
      console.error('💥 Error inesperado creando revelación:', err);
      const errorMessage = err.message || 'Error inesperado al crear la conversación';
      setOperationState('create', { loading: false, error: errorMessage });
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [authState.userId, setOperationState, list]);

  const update = useCallback(async (id, data) => {
    setLoading(true);
    setOperationState('update', { loading: true, error: null });
    const { data: updatedRevelacion, error } = await updateRevelacionAPI(id, data);
    if (error) {
      setOperationState('update', { loading: false, error: error.message });
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
    if (updatedRevelacion) {
      // Sync cache: update in list and byId
      setList((prev) => 
        prev.map((item) => 
          item.id === id ? updatedRevelacion : item
        )
      );
      setById((prev) => ({ ...prev, [id]: updatedRevelacion }));
      setOperationState('update', { loading: false, error: null });
      setLoading(false);
      return { success: true, data: updatedRevelacion };
    }
    setLoading(false);
  }, [setOperationState]);

  const updateMessages = useCallback(async (id, messages) => {
    setLoading(true);
    setOperationState('update', { loading: true, error: null });
    const { data: updatedRevelacion, error } = await updateRevelacionAPI(id, { messages });
    if (error) {
      setOperationState('update', { loading: false, error: error.message });
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
    if (updatedRevelacion) {
      // Sync cache: update in list and byId
      setList((prev) => 
        prev.map((item) => 
          item.id === id ? updatedRevelacion : item
        )
      );
      setById((prev) => ({ ...prev, [id]: updatedRevelacion }));
      setOperationState('update', { loading: false, error: null });
      setLoading(false);
      return { success: true, data: updatedRevelacion };
    }
    setLoading(false);
  }, [setOperationState]);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setOperationState('remove', { loading: true, error: null });
    const { data, error } = await deleteRevelacionAPI(id);
    if (error) {
      setOperationState('remove', { loading: false, error: error.message });
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
    if (data) {
      // Sync cache: remove from list and byId
      setList((prev) => prev.filter((item) => item.id !== id));
      setById((prev) => {
        const newById = { ...prev };
        delete newById[id];
        return newById;
      });
      setOperationState('remove', { loading: false, error: null });
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
  }, [setOperationState]);

  // Legacy methods for backward compatibility
  const createRevelacion = create;
  const updateRevelacion = update;
  const deleteRevelacion = remove;

  const value = useMemo(
    () => ({ 
      list, 
      byId, 
      loading, 
      error, 
      operationStates,
      loadList, 
      loadById, 
      create, 
      update, 
      updateMessages,
      remove,
      createRevelacion, 
      updateRevelacion, 
      deleteRevelacion 
    }),
    [
      list, 
      byId, 
      loading, 
      error, 
      operationStates,
      loadList, 
      loadById, 
      create, 
      update, 
      updateMessages,
      remove,
      createRevelacion, 
      updateRevelacion, 
      deleteRevelacion
    ]
  );
  
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRevelaciones() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useRevelaciones must be used within RevelacionesProvider");
  return ctx;
}
