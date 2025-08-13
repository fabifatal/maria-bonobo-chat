import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { getRevelaciones } from '../api';

const RevelacionesList = () => {
  const { state } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state.token) return;
    getRevelaciones(state.token)
      .then(setItems)
      .catch(() => setError('No se pudieron cargar las revelaciones'));
  }, [state.token]);

  if (error) return <div role="alert">{error}</div>;

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h1>Revelaciones</h1>
      <ul>
        {items.map((r) => (
          <li key={r.id}>
            <Link to={`/revelaciones/${r.id}`}>{r.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default RevelacionesList;