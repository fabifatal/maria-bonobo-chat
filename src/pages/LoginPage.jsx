import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav('/revelaciones');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <h1>Ingresar</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <div role="alert">{error}</div>}
        <button type="submit">Entrar</button>
      </form>
    </main>
  );
};

export default LoginPage;