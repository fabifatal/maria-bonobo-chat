import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRevelaciones } from "../app/RevelacionesContext";

export default function RevelacionDetail() {
  const { id } = useParams();
  const { byId, loadById, loading, error } = useRevelaciones();
  const [item, setItem] = useState(byId[id]);

  useEffect(() => {
    let mounted = true;
    if (!byId[id]) {
      loadById(id).then((data) => mounted && setItem(data));
    } else {
      setItem(byId[id]);
    }
    return () => {
      mounted = false;
    };
  }, [id, byId, loadById]);

  if (loading && !item) return <p role="status">Cargando…</p>;
  if (error && !item) return <p role="alert">Error: {error}</p>;
  if (!item) return <p>No encontrada.</p>;

  return (
    <div>
      <p>
        <Link to="/revelaciones">← Volver</Link>
      </p>
      <h1>{item.title}</h1>
      <p>
        <small>{new Date(item.createdAt).toLocaleString()}</small>
      </p>

      <h2>Mensajes</h2>
      {!item.messages?.length ? (
        <p>No hay mensajes en esta revelación.</p>
      ) : (
        <ul>
          {item.messages.map((m, i) => (
            <li key={`${m.role}-${m.ts ?? i}`}>...</li>
          ))}
        </ul>
      )}
    </div>
  );
}
