import React, { createContext, useContext, useMemo, useState } from "react";
import { getRevelaciones, getRevelacion } from "../api";
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

  const value = useMemo(
    () => ({ list, byId, loading, error, loadList, loadById }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list, byId, loading, error]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRevelaciones() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useRevelaciones must be used within RevelacionesProvider");
  return ctx;
}
