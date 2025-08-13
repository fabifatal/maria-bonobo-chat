import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { getRevelacionById } from '../api';

const RevelacionDetail = () => {
  const { id } = useParams();
  const { state } = useAuth();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !state.token) return;
    getRevelacionById(id, state.token)
      .then(setItem)
      .catch(() => setError('No se pudo cargar la revelación'));
  }, [id, state.token]);

  if (error) return <div role="alert">{error}</div>;
  if (!item) return <div>Cargando…</div>;

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h1>{item.title}</h1>
      <pre>{JSON.stringify(item.messages, null, 2)}</pre>
    </main>
  );
};

export default RevelacionDetail;