'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login, getErrorMessage, APP_CONFIG } from '@/services/api';
import { useLoading, useError } from '@/hooks';
import type { LoginResponse } from '@/types';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { error, setError, clearError } = useError();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    
    if (!username.trim() || !password.trim()) {
      setError('Usuario y contraseña son requeridos');
      return;
    }

    startLoading();
    
    try {
      const response: LoginResponse = await login(username, password);
      
      if (response.id) {
        localStorage.setItem(APP_CONFIG.session.storageKey, JSON.stringify(response));
        router.push('/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="form-container">
      <div className="logo-section">
        <h1>Inventario Municipio</h1>
        <p>Sistema de Gestión de Equipos</p>
      </div>
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            id="username"
            type="text"
            placeholder="Ingrese su usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            autoComplete="username"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
