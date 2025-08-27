'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login, getErrorMessage, APP_CONFIG } from '@/services/api';
import { useLoading, useError } from '@/hooks';
import type { LoginResponse } from '@/types';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    } catch (err: any) {
      // Si el backend envía un mensaje personalizado, mostrarlo
      if (err && err.status === 401 && err.message && err.message.includes('Tu usuario o contraseña son incorrectos')) {
        setError('Tu usuario o contraseña son incorrectos');
      } else {
        setError(getErrorMessage(err));
      }
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
        
        <div className="form-group" style={{ position: 'relative' }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            required
            style={{ paddingRight: '2.5rem' }}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '2.2rem',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              height: '2rem',
              width: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {showPassword ? (
              // Ojo abierto
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            ) : (
              // Ojo cerrado
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.442-4.362M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.284 5.255M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
            )}
          </button>
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
