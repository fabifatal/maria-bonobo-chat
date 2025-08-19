import React, { createContext, useContext, useMemo, useState } from "react";
import { getRevelaciones, getRevelacion, postRevelacion } from "../api";
import { useCallback } from "react";

const Ctx = createContext(null);

export function RevelacionesProvider({ children }) {
  const [list, setList] = useState([]);
  const [byId, setById] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await getRevelaciones();
    if (error) setError(error.message);
    if (data) {
      setList(data);
      setById((prev) => ({
        ...prev,
        ...Object.fromEntries(data.map((it) => [it.id, it])),
      }));
    }
    setLoading(false);
  }, []);

  const loadById = useCallback(
    async (id) => {
      if (byId[id]) return byId[id];
      setLoading(true);
      setError(null);
      const { data, error } = await getRevelacion(id);
      if (error) setError(error.message);
      if (data) setById((prev) => ({ ...prev, [id]: data }));
      setLoading(false);
      return data;
    },
    [byId]
  );

  const createRevelacion = useCallback(async (_data) => {
    const { data, error } = await postRevelacion(_data);
    if (error) setError(error.message);
    if (data) setList((prev) => [...prev, data]);
  }, []);

  const updateRevelacion = useCallback(async (id, _data) => {
    const { data, error } = await updateRevelacion(id, _data);
    if (error) setError(error.message);
    if (data) setById((prev) => ({ ...prev, [id]: data }));
  }, []);

  const deleteRevelacion = useCallback(async (id) => {
    const { data, error } = await deleteRevelacion(id);
    if (error) setError(error.message);
    if (data) setList((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const value = useMemo(
    () => ({ list, byId, loading, error, loadList, loadById, createRevelacion, updateRevelacion, deleteRevelacion }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list, byId, loading, error, createRevelacion, updateRevelacion, deleteRevelacion]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRevelaciones() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useRevelaciones must be used within RevelacionesProvider");
  return ctx;
}
