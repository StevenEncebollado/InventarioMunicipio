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
  const [showRegister, setShowRegister] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
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
        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: '1rem', width: '100%' }}
          onClick={() => {
            setShowRegister(true);
            setRegisterError('');
            setRegisterUsername('');
            setRegisterPassword('');
          }}
        >
          Registrarse
        </button>
      </form>
      
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      {/* Modal de registro */}
      {showRegister && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '320px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Registro de Usuario</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setRegisterError('');
                if (!registerUsername.trim() || !registerPassword.trim() || !registerConfirmPassword.trim()) {
                  setRegisterError('Todos los campos son requeridos');
                  return;
                }
                if (registerPassword !== registerConfirmPassword) {
                  setRegisterError('Las contraseñas no coinciden');
                  return;
                }
                setRegisterLoading(true);
                try {
                  // Llamar al endpoint de registro del backend
                  const res = await fetch('http://localhost:8081/usuarios/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: registerUsername, password: registerPassword })
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setShowRegister(false);
                    alert('Usuario registrado exitosamente');
                  } else {
                    setRegisterError(data.message || 'Error al registrar usuario');
                  }
                } catch (err) {
                  setRegisterError('Error de red o servidor');
                } finally {
                  setRegisterLoading(false);
                }
              }}
            >
              <div className="form-group">
                <label htmlFor="register-username">Usuario:</label>
                <input
                  id="register-username"
                  type="text"
                  value={registerUsername}
                  onChange={e => setRegisterUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={registerLoading}
                />
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label htmlFor="register-password">Contraseña:</label>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={registerLoading}
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
              <div className="form-group">
                <label htmlFor="register-confirm-password">Confirmar contraseña:</label>
                <input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={registerConfirmPassword}
                  onChange={e => setRegisterConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={registerLoading}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={registerLoading}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {registerLoading ? 'Registrando...' : 'Registrar'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={() => setShowRegister(false)}
                disabled={registerLoading}
              >
                Cancelar
              </button>
              {registerError && (
                <div className="error-message" role="alert" style={{ marginTop: '1rem' }}>
                  {registerError}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
