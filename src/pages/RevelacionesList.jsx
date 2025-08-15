import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRevelaciones } from "../app/RevelacionesContext";

export default function RevelacionesList() {
  const { list, loading, error, loadList } = useRevelaciones();

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !list.length) return <p role="status">Cargando…</p>;
  if (error && !list.length) return <p role="alert">Error: {error}</p>;
  if (!list.length) return <p>No hay revelaciones aún.</p>;

  console.log(
    "ids:",
    list.map((x) => x.id)
  ); // busca undefined

  return (
    <div>
      <h1>Revelaciones</h1>
      <ul>
        {list.map((r, i) => (
          <li key={r.id ?? r._id ?? r.uuid ?? `${r.title}-${r.createdAt}-${i}`}>
            <Link to={`/revelaciones/${r.id}`}>{r.title}</Link>
            <small style={{ marginLeft: 8 }}>
              {new Date(r.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
