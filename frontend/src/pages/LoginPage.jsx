import React, { useState } from 'react';
import { login } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    if (res.id) {
      onLogin(res);
    } else {
      setError(res.error || 'Credenciales incorrectas');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  );
}
